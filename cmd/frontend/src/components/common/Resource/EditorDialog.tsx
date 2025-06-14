import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Fragment } from 'react/jsx-runtime';

import { Grid2 } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { cloneDeep } from 'lodash';

import ConfirmButton from '@components/common/ConfirmButton';
import { Dialog, DialogProps } from '@components/common/Dialog';
import Loader from '@components/common/Loader';
import DocsViewer from '@components/common/Resource/DocsViewer';
import SimpleEditor from '@components/common/Resource/SimpleEditor';
import Tabs from '@components/common/Tabs';
import { apply } from '@lib/k8s/apiProxy';
import { KubeObjectInterface } from '@lib/k8s/cluster';
import { getCluster, useId } from '@lib/util';
import Editor, { loader } from '@monaco-editor/react';
import 'i18n/config';
import * as yaml from 'js-yaml';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import { clusterAction } from 'redux/clusterActionSlice';
import { EventStatus, HeadlampEventType, useEventCallback } from 'redux/headlampEventSlice';
import { AppDispatch } from 'redux/stores/store';

(self as any).MonacoEnvironment = {
  getWorker(_: unknown, label: string) {
    if (label === 'json') {
      return new jsonWorker();
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker();
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker();
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

type KubeObjectIsh = Partial<KubeObjectInterface>;

export interface EditorDialogProps extends DialogProps {
  /** The object to edit, or null to make the dialog be in "loading mode". Pass it an empty object if no contents are to be shown when the dialog is first open. */
  item: KubeObjectIsh | object | object[] | string | null;
  /** Called when the dialog is closed. */
  onClose: () => void;
  /** Called when the user clicks the save button. */
  onSave?: ((...args: any[]) => void) | 'default' | null;
  /** Called when the editor's contents change. */
  onEditorChanged?: ((newValue: string) => void) | null;
  /** The function to open the dialog. */
  setOpen?: (open: boolean) => void;
  allowToHideManagedFields?: boolean;
  /** The label to use for the save button. */
  saveLabel?: string;
  /** The error message to display. */
  errorMessage?: string;
  /** The dialog title. */
  title?: string;
  /** Extra optional actions. */
  actions?: React.ReactNode[];
}

export default function EditorDialog(props: EditorDialogProps) {
  const {
    item,
    onClose,
    onSave = 'default',
    onEditorChanged,
    setOpen,
    saveLabel,
    errorMessage,
    allowToHideManagedFields,
    title,
    actions = [],
    ...other
  } = props;
  const editorOptions = {
    selectOnLineNumbers: true,
    readOnly: isReadOnly(),
    automaticLayout: true,
  };
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);

  const theme = useTheme();
  const themeName = theme.palette.mode;

  const initialCode = typeof item === 'string' ? item : yaml.dump(item || {});
  const originalCodeRef = useRef({ code: initialCode, format: item ? 'yaml' : '' });
  const [code, setCode] = useState(originalCodeRef.current);
  const codeRef = useRef(code);
  const lastCodeCheckHandler = useRef(0);
  const previousVersionRef = useRef(isKubeObjectIsh(item) ? item?.metadata?.resourceVersion || '' : '');
  const [error, setError] = useState('');
  const [docSpecs, setDocSpecs] = useState<KubeObjectInterface | KubeObjectInterface[] | null>([]);
  const { t } = useTranslation();

  const [hideManagedFields, setHideManagedFieldsState] = useState(() => {
    const localData = localStorage.getItem('hideManagedFields');
    return localData ? JSON.parse(localData) : true;
  });

  function setHideManagedFields(data: any) {
    localStorage.setItem('hideManagedFields', JSON.stringify(data));
    setHideManagedFieldsState(data);
  }

  const [useSimpleEditor, setUseSimpleEditorState] = useState(() => {
    const localData = localStorage.getItem('useSimpleEditor');
    return localData ? JSON.parse(localData) : false;
  });

  function setUseSimpleEditor(data: boolean) {
    localStorage.setItem('useSimpleEditor', JSON.stringify(data));
    setUseSimpleEditorState(data);
  }

  const dispatchCreateEvent = useEventCallback(HeadlampEventType.CREATE_RESOURCE);
  const dispatch: AppDispatch = useDispatch();

  function isKubeObjectIsh(item: any): item is KubeObjectIsh {
    return item && typeof item === 'object' && !Array.isArray(item) && 'metadata' in item;
  }

  // Update the code when the item changes, but only if the code hasn't been touched.
  useEffect(() => {
    const clonedItem = cloneDeep(item);
    if (!item || Object.keys(item || {}).length === 0) {
      const defaultCode = '# Enter your YAML or JSON here';
      originalCodeRef.current = { code: defaultCode, format: 'yaml' };
      setCode({ code: defaultCode, format: 'yaml' });
      return;
    }

    if (allowToHideManagedFields && hideManagedFields) {
      if (isKubeObjectIsh(clonedItem) && clonedItem.metadata) {
        delete clonedItem.metadata.managedFields;
      }
    }

    // Determine the format (YAML or JSON) and serialize to string
    const format = looksLikeJson(originalCodeRef.current.code) ? 'json' : 'yaml';
    const itemCode = format === 'json' ? JSON.stringify(clonedItem) : yaml.dump(clonedItem);

    // Update the code if the item representation has changed
    if (itemCode !== originalCodeRef.current.code) {
      originalCodeRef.current = { code: itemCode, format };
      setCode({ code: itemCode, format });
    }

    // Additional handling for Kubernetes objects
    if (isKubeObjectIsh(item) && item.metadata) {
      const resourceVersionsDiffer = (previousVersionRef.current || '') !== (item.metadata!.resourceVersion || '');
      // Only change if the code hasn't been touched.
      // We use the codeRef in this effect instead of the code, because we need to access the current
      // state of the code but we don't want to trigger a re-render when we set the code here.
      if (resourceVersionsDiffer || codeRef.current.code === originalCodeRef.current.code) {
        // Prevent updating to the same code, which would lead to an infinite loop.
        if (codeRef.current.code !== itemCode) {
          setCode({ code: itemCode, format: originalCodeRef.current.format });
        }

        if (resourceVersionsDiffer && !!item.metadata!.resourceVersion) {
          previousVersionRef.current = item.metadata!.resourceVersion;
        }
      }
    }
  }, [item, hideManagedFields]);

  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  useEffect(() => {
    i18n.on('languageChanged', setLang);
    return () => {
      // Stop the timeout from trying to use the component after it's been unmounted.
      clearTimeout(lastCodeCheckHandler.current);

      i18n.off('languageChanged', setLang);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function isReadOnly() {
    return onSave === null;
  }

  function looksLikeJson(code: string) {
    const trimmedCode = code.trimLeft();
    const firstChar = trimmedCode ? trimmedCode[0] : '';
    if (['{', '['].includes(firstChar)) {
      return true;
    }
    return false;
  }

  function onChange(value: string | undefined): void {
    // Clear any ongoing attempts to check the code.
    window.clearTimeout(lastCodeCheckHandler.current);

    // Only check the code for errors after the user has stopped typing for a moment.
    lastCodeCheckHandler.current = window.setTimeout(() => {
      const { error: err, format } = getObjectsFromCode({
        code: value || '',
        format: originalCodeRef.current.format,
      });
      if (code.format !== format) {
        setCode((currentCode) => ({ code: currentCode.code || '', format }));
      }

      if (error !== (err?.message || '')) {
        setError(err?.message || '');
      }
    }, 500); // ms

    setCode((currentCode) => ({ code: value as string, format: currentCode.format }));

    if (onEditorChanged) {
      onEditorChanged(value as string);
    }
  }

  function getObjectsFromCode(codeInfo: typeof originalCodeRef.current): {
    obj: KubeObjectInterface[] | null;
    format: string;
    error: Error | null;
  } {
    const { code, format } = codeInfo;
    const res: { obj: KubeObjectInterface[] | null; format: string; error: Error | null } = {
      obj: null,
      format,
      error: null,
    };

    if (!format || (!res.obj && looksLikeJson(code))) {
      res.format = 'json';
      try {
        let helperArr = [];
        const parsedCode = JSON.parse(code);
        if (!Array.isArray(parsedCode)) {
          helperArr.push(parsedCode);
        } else {
          helperArr = parsedCode;
        }
        res.obj = helperArr;
        return res;
      } catch (e) {
        res.error = new Error((e as Error).message || t('Invalid JSON'));
      }
    }

    if (!res.obj) {
      res.format = 'yaml';
      try {
        res.obj = yaml.loadAll(code) as KubeObjectInterface[];
        res.obj = res.obj.filter((obj) => !!obj);
        return res;
      } catch (e) {
        res.error = new Error((e as Error).message || t('Invalid YAML'));
      }
    }

    if (res.obj) {
      res.error = null;
    }

    return res;
  }

  function handleTabChange(tabIndex: number) {
    // Check if the docs tab has been selected.
    if (tabIndex !== 1) {
      return;
    }

    const { obj: codeObjs } = getObjectsFromCode(code);
    setDocSpecs(codeObjs);
  }

  function onUndo() {
    setCode(originalCodeRef.current);
  }

  const applyFunc = async (newItems: KubeObjectInterface[], clusterName: string) => {
    await Promise.allSettled(newItems.map((newItem) => apply(newItem, clusterName))).then((values: any) => {
      values.forEach((value: any, index: number) => {
        if (value.status === 'rejected') {
          let msg;
          const kind = newItems[index].kind;
          const name = newItems[index].metadata.name;
          const apiVersion = newItems[index].apiVersion;
          if (newItems.length === 1) {
            msg = t('translation|Failed to create {{ kind }} {{ name }}.', { kind, name });
          } else {
            msg = t('translation|Failed to create {{ kind }} {{ name }} in {{ apiVersion }}.', {
              kind,
              name,
              apiVersion,
            });
          }
          const errorDetail = value.reason?.message || msg;
          setError(errorDetail);
          setOpen?.(true);
          // throw msg;
          throw new Error(msg);
        }
      });
    });
  };

  function handleSave() {
    // Verify the YAML even means anything before trying to use it.
    const { obj, format, error } = getObjectsFromCode(code);
    if (error) {
      setError(t('Error parsing the code: {{error}}', { error: error.message }));
      return;
    }

    if (format !== code.format) {
      setCode((currentCode) => ({ code: currentCode.code, format }));
    }

    if (!getObjectsFromCode(code)) {
      setError(t("Error parsing the code. Please verify it's valid YAML or JSON!"));
      return;
    }

    const newItemDefs = obj!;

    if (typeof onSave === 'string' && onSave === 'default') {
      const resourceNames = newItemDefs.map((newItemDef) => newItemDef.metadata.name);
      const clusterName = getCluster() || '';

      dispatch(
        clusterAction(() => applyFunc(newItemDefs, clusterName), {
          startMessage: t('translation|Applying {{ newItemName }}…', {
            newItemName: resourceNames.join(','),
          }),
          cancelledMessage: t('translation|Cancelled applying {{ newItemName }}.', {
            newItemName: resourceNames.join(','),
          }),
          successMessage: t('translation|Applied {{ newItemName }}.', {
            newItemName: resourceNames.join(','),
          }),
          errorMessage: t('translation|Failed to apply {{ newItemName }}.', {
            newItemName: resourceNames.join(','),
          }),
          cancelUrl: location.pathname,
        })
      );

      dispatchCreateEvent({
        status: EventStatus.CONFIRMED,
      });

      onClose();
    } else if (typeof onSave === 'function') {
      onSave!(obj);
    }
  }

  function makeEditor() {
    // @todo: monaco editor does not support pt, ta, hi amongst various other langs.
    if (['de', 'es', 'fr', 'it', 'ja', 'ko', 'ru', 'zh-cn', 'zh-tw'].includes(lang)) {
      loader.config({ 'vs/nls': { availableLanguages: { '*': lang } }, monaco });
    } else {
      loader.config({ monaco });
    }

    return useSimpleEditor ? (
      <Box paddingTop={2} height="100%">
        <SimpleEditor language={originalCodeRef.current.format || 'yaml'} value={code.code} onChange={onChange} />
      </Box>
    ) : (
      <Box height="100%">
        <Editor
          language={originalCodeRef.current.format || 'yaml'}
          theme={themeName === 'dark' ? 'vs-dark' : 'light'}
          value={code.code}
          options={editorOptions}
          onChange={onChange}
          height="600px"
        />
      </Box>
    );
  }

  const errorLabel = error || errorMessage;
  let dialogTitle = title;
  if (!dialogTitle && item) {
    const itemName = (isKubeObjectIsh(item) && item.metadata?.name) || t('New Object');
    dialogTitle = isReadOnly()
      ? t('translation|View: {{ itemName }}', { itemName })
      : t('translation|Edit: {{ itemName }}', { itemName });
  }

  const dialogTitleId = useId('editor-dialog-title-');

  if (!other.open && !other.keepMounted) {
    return null;
  }

  return (
    <Dialog
      title={dialogTitle}
      aria-busy={!item}
      maxWidth="lg"
      scroll="paper"
      fullWidth
      withFullScreen
      onClose={onClose}
      {...other}
      aria-labelledby={dialogTitleId}
      titleProps={{
        id: dialogTitleId,
      }}
    >
      {!item ? (
        <Loader title={t('Loading editor')} />
      ) : (
        <Fragment>
          <DialogContent
            sx={{
              height: '80%',
              overflowY: 'hidden',
            }}
          >
            <Box py={1}>
              <Grid2 container spacing={2} justifyContent="space-between" sx={{ flexGrow: 1 }}>
                {
                  actions.length > 0 ? (
                    actions.map((action, i) => <Grid2 key={`editor_action_${i}`}>{action}</Grid2>)
                  ) : (
                    <Grid2></Grid2>
                  ) // Just to keep the layout consistent.
                }
                <Grid2>
                  <FormGroup row>
                    {allowToHideManagedFields && (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={hideManagedFields}
                            onChange={() => setHideManagedFields(() => !hideManagedFields)}
                            name="hideManagedFields"
                          />
                        }
                        label={t('Hide Managed Fields')}
                      />
                    )}
                    <FormControlLabel
                      control={
                        <Switch
                          checked={useSimpleEditor}
                          onChange={() => setUseSimpleEditor(!useSimpleEditor)}
                          name="useSimpleEditor"
                        />
                      }
                      label={t('Use minimal editor')}
                    />
                  </FormGroup>
                </Grid2>
              </Grid2>
            </Box>
            {isReadOnly() ? (
              makeEditor()
            ) : (
              <Tabs
                onTabChanged={handleTabChange}
                ariaLabel={t('translation|Editor')}
                tabs={[
                  {
                    label: t('translation|Editor'),
                    component: makeEditor(),
                  },
                  {
                    label: t('translation|Documentation'),
                    component: (
                      <Box
                        p={2}
                        sx={{
                          overflowY: 'auto',
                          overflowX: 'hidden',
                        }}
                        maxHeight={600}
                        height={600}
                      >
                        <DocsViewer docSpecs={docSpecs} />
                      </Box>
                    ),
                  },
                ]}
              />
            )}
          </DialogContent>
          <DialogActions>
            {!isReadOnly() && (
              <ConfirmButton
                disabled={originalCodeRef.current.code === code.code}
                color="secondary"
                variant="contained"
                aria-label={t('translation|Undo')}
                onConfirm={onUndo}
                confirmTitle={t('translation|Are you sure?')}
                confirmDescription={t('This will discard your changes in the editor. Do you want to proceed?')}
                // @todo: aria-controls should point to the textarea id
              >
                {t('translation|Undo Changes')}
              </ConfirmButton>
            )}
            <div style={{ flex: '1 0 0' }} />
            {errorLabel && <Typography color="error">{errorLabel}</Typography>}
            <div style={{ flex: '1 0 0' }} />
            <Button onClick={onClose} color="secondary" variant="contained">
              {t('translation|Close')}
            </Button>
            {!isReadOnly() && (
              <Button
                onClick={handleSave}
                color="primary"
                variant="contained"
                disabled={originalCodeRef.current.code === code.code || !!error}
                // @todo: aria-controls should point to the textarea id
              >
                {saveLabel || t('translation|Save & Apply')}
              </Button>
            )}
          </DialogActions>
        </Fragment>
      )}
    </Dialog>
  );
}

// export function ViewDialog(props: Omit<EditorDialogProps, 'onSave'>) {
//   return <EditorDialog {...props} onSave={null} />;
// }
