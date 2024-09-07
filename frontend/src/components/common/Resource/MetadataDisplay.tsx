import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography, { TypographyProps } from '@mui/material/Typography';

import Link from '@components/common/Link.tsx';
import { NameValueTable, NameValueTableRow } from '@components/common/SimpleTable.tsx';
import { LightTooltip } from '@components/common/Tooltip';
import { Icon } from '@iconify/react';
import { ResourceClasses } from '@lib/k8s';
import { KubeObject, KubeObjectInterface, KubeOwnerReference } from '@lib/k8s/cluster.ts';
import Theme from '@lib/themes.ts';
import { localeDate } from '@lib/util.ts';

type ExtraRowsFunc = (resource: KubeObjectInterface) => NameValueTableRow[] | null;

export const metadataStyles = (theme: typeof Theme.light) => ({
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.metadataBgColor,
  fontSize: theme.typography.pxToRem(16),
  wordBreak: 'break-word',
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  marginRight: theme.spacing(1),
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  overflowWrap: 'anywhere',
  textOverflow: 'ellipsis',
});

export interface MetadataDisplayProps {
  resource: KubeObject;
  extraRows?: ExtraRowsFunc | NameValueTableRow[] | null;
}

export function MetadataDisplay(props: MetadataDisplayProps) {
  const { resource, extraRows } = props;
  const { t } = useTranslation();
  let makeExtraRows: ExtraRowsFunc;

  function makeOwnerReferences(ownerReferences: KubeOwnerReference[]) {
    if (!resource || ownerReferences === undefined) {
      return undefined;
    }

    const numItems = ownerReferences.length;
    if (numItems === 0) {
      return undefined;
    }

    return ownerReferences
      .map((ownerRef, i) => {
        if (ownerRef.kind in ResourceClasses) {
          let routeName;
          try {
            routeName = new ResourceClasses[ownerRef.kind]().detailsRoute;
          } catch (e) {
            console.error('Error getting routeName for {ownerRef.kind}', e);
            return null;
          }
          return (
            <>
              <Link routeName={routeName} params={{ name: ownerRef.name, namespace: resource.metadata.namespace }}>
                {ownerRef.kind}: {ownerRef.name}
              </Link>
              {i < numItems - 1 && <br />}
            </>
          );
        }
        return (
          <>
            {`${ownerRef.kind}: ${ownerRef.name}`}
            {i < numItems - 1 && <br />}
          </>
        );
      })
      .filter((element) => element !== null);
  }

  if (typeof extraRows === 'function') {
    makeExtraRows = extraRows;
  } else if (!extraRows) {
    makeExtraRows = () => null;
  } else {
    makeExtraRows = () => extraRows as NameValueTableRow[];
  }

  const mainRows = (
    [
      {
        name: t('translation|Name'),
        value: resource.metadata.name,
      },
      {
        name: t('glossary|Namespace'),
        value: resource.metadata.namespace && (
          <Link routeName={'namespace'} params={{ name: resource.metadata.namespace }}>
            {resource.metadata.namespace}
          </Link>
        ),
        hide: !resource.metadata.namespace,
      },
      {
        name: t('Creation'),
        value: localeDate(resource.metadata.creationTimestamp),
      },
      {
        name: t('Labels'),
        value: resource.metadata.labels && <MetadataDictGrid dict={resource.metadata.labels} />,
        hide: !resource.metadata.labels,
      },
      {
        name: t('Annotations'),
        value: resource.metadata.annotations && <MetadataDictGrid dict={resource.metadata.annotations} />,
        hide: !resource.metadata.annotations,
      },
      {
        name:
          resource.metadata.ownerReferences && resource.metadata.ownerReferences.length > 1
            ? t('Owner refs')
            : t('Controlled by'),
        value: makeOwnerReferences(resource.metadata.ownerReferences || []),
        hide: !resource.metadata.ownerReferences || resource.metadata.ownerReferences.length === 0,
      },
    ] as NameValueTableRow[]
  ).concat(makeExtraRows(resource) || []);

  return (
    <Box>
      <NameValueTable rows={mainRows} />
    </Box>
  );
}

interface MetadataDictGridProps {
  dict: {
    [index: string]: string;
    [index: number]: string;
  };
  showKeys?: boolean;
  gridProps?: {
    [index: string]: any;
  };
}

export function MetadataDictGrid(props: MetadataDictGridProps) {
  const { dict, showKeys = true, gridProps } = props;
  const [expanded, setExpanded] = useState(false);
  const defaultNumShown = 20;

  const keys = Object.keys(dict || []);

  const MetadataEntry = forwardRef((props: TypographyProps, ref: any) => {
    return (
      <Typography
        {...props}
        sx={(theme) => ({
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.metadataBgColor,
          fontSize: theme.typography.pxToRem(16),
          wordBreak: 'break-word',
          paddingLeft: theme.spacing(1),
          paddingRight: theme.spacing(1),
          marginRight: theme.spacing(1),
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          overflowWrap: 'anywhere',
          textOverflow: 'ellipsis',
        })}
        ref={ref}
      />
    );
  });

  function makeLabel(key: string | number) {
    let fullText = dict[key];

    if (showKeys) {
      fullText = key + ': ' + fullText;
    }

    let shortText = fullText;

    // Shorten the label manually because relying on the ellipsing methods
    // was not working (it would correctly ellipse the text, but the width of it
    // would still extend the area/section where the text is contained).
    if (fullText.length > 50) {
      shortText = fullText.substr(0, 50) + '…';
    }

    let labelComponent = <MetadataEntry>{shortText}</MetadataEntry>;

    // If the full label is not being shown, use a tooltip to show the full text
    // to the user (so they select it, etc.).
    if (fullText.length !== shortText.length) {
      labelComponent = <LightTooltip title={fullText} children={labelComponent} interactive />;
    }
    return labelComponent;
  }

  return (
    <Grid container spacing={1} justifyContent="flex-start">
      {keys.length > defaultNumShown && (
        <Grid item>
          <IconButton onClick={() => setExpanded(!expanded)} size="small">
            <Icon icon={expanded ? 'mdi:menu-up' : 'mdi:menu-down'} />
          </IconButton>
        </Grid>
      )}
      <Grid
        container
        item
        justifyContent="flex-start"
        spacing={1}
        style={{
          maxWidth: '80%',
        }}
        {...gridProps}
      >
        {/* Limit the size to two entries until the user chooses to expand the whole section */}
        {keys.slice(0, expanded ? keys.length : defaultNumShown).map((key, i) => (
          <Grid key={i} item zeroMinWidth>
            {makeLabel(key)}
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
