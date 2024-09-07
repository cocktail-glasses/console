// import * as buffer from 'buffer';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

import Empty from '@components/common/EmptyContent.tsx';
import Loader from '@components/common/Loader.tsx';
import { Icon } from '@iconify/react';
import getDocDefinitions from '@lib/docs.ts';

// Buffer class is not polyffiled with CRA(v5) so we manually do it here
// window.Buffer = buffer.Buffer;

// @todo: Declare strict types.
function DocsViewer(props: { docSpecs: any }) {
  const { docSpecs } = props;
  const [docs, setDocs] = useState<
    (
      | {
          data: null;
          error: any;
          kind: string;
        }
      | {
          data: any;
          error: null;
          kind: string;
        }
      | undefined
    )[]
  >([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setDocsLoading(true);
    // fetch docSpecs for all the resources specified
    Promise.allSettled(
      docSpecs.map((docSpec: { apiVersion: string; kind: string }) => {
        return getDocDefinitions(docSpec.apiVersion, docSpec.kind);
      }) as PromiseSettledResult<any>[]
    )
      .then((values) => {
        const docSpecsFromApi = values.map((value, index) => {
          if (value.status === 'fulfilled') {
            return {
              data: value.value,
              error: null,
              kind: docSpecs[index].kind,
            };
          } else if (value.status === 'rejected') {
            return {
              data: null,
              error: value.reason,
              kind: docSpecs[index].kind,
            };
          }
        });
        setDocsLoading(false);
        setDocs(docSpecsFromApi);
      })
      .catch(() => {
        setDocsLoading(false);
      });
  }, [docSpecs]);

  function makeItems(name: string, value: any, key: string) {
    return (
      <TreeItem
        key={key}
        itemId={`${key}`}
        label={
          <div>
            <Typography display="inline">{name}</Typography>&nbsp;
            <Typography display="inline" color="textSecondary" variant="caption">
              ({value.type})
            </Typography>
          </div>
        }
      >
        <Typography color="textSecondary">{value.description}</Typography>
        {Object.entries(value.properties || {}).map(([name, value], i) => makeItems(name, value, `${key}_${i}`))}
      </TreeItem>
    );
  }
  const coIcon = () => <Icon icon="mdi:chevron-down" />;
  const exIcon = () => <Icon icon="mdi:chevron-right" />;
  return (
    <>
      {docsLoading ? (
        <Loader title={t('Loading documentation')} />
      ) : (
        docs.map((docSpec: any, idx: number) => {
          if (!docSpec.error && !docSpec.data) {
            return (
              <Empty key={`empty_msg_${idx}`}>
                {t('No documentation for type {{ docsType }}.', {
                  docsType: docSpec?.kind?.trim() || '""',
                })}
              </Empty>
            );
          }
          if (docSpec.error) {
            return (
              <Empty color="error" key={`empty_msg_${idx}`}>
                {docSpec.error.message}
              </Empty>
            );
          }
          if (docSpec.data) {
            return (
              <Box p={2} key={`docs_${idx}`}>
                <Typography>
                  {t('Showing documentation for: {{ docsType }}', {
                    docsType: docSpec.kind.trim(),
                  })}
                </Typography>
                <SimpleTreeView
                  sx={{ flexGrow: 1, maxWidth: 400 }}
                  slots={{ collapseIcon: coIcon, expandIcon: exIcon }}
                >
                  {Object.entries(docSpec.data.properties || {}).map(([name, value], i) =>
                    makeItems(name, value, i.toString())
                  )}
                </SimpleTreeView>
              </Box>
            );
          }
        })
      )}
    </>
  );
}

export default DocsViewer;
