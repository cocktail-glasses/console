import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import Paper from '@mui/material/Paper';

import { MainInfoHeader } from './MainInfoSectionHeader';

import Empty from '@components/common/EmptyContent';
import Loader from '@components/common/Loader';
import { MetadataDisplay } from '@components/common/Resource/MetadataDisplay';
import SectionBox from '@components/common/SectionBox';
import { HeaderStyle } from '@components/common/SectionHeader';
import { NameValueTableRow } from '@components/common/SimpleTable';
import { KubeObject } from '@lib/k8s/cluster';
import { createRouteURL } from '@lib/router';
import { HeaderAction } from 'redux/actionButtonsSlice';

export interface MainInfoSectionProps<T extends KubeObject = KubeObject> {
  resource: T | null;
  headerSection?: ((resource: T | null) => React.ReactNode) | React.ReactNode;
  title?: string;
  extraInfo?: ((resource: T | null) => NameValueTableRow[] | null) | NameValueTableRow[] | null;
  actions?:
    | ((resource: T | any | null) => React.ReactNode[] | null | HeaderAction[])
    | React.ReactNode[]
    | null
    | HeaderAction[];
  headerStyle?: HeaderStyle;
  noDefaultActions?: boolean;
  /** The route or location to go to. If it's an empty string, then the "browser back" function is used. If null, no back button will be shown. */
  backLink?: string | ReturnType<typeof useLocation> | null;
  error?: string | Error | null;
}

export function MainInfoSection(props: MainInfoSectionProps) {
  const {
    resource,
    headerSection,
    title,
    extraInfo = [],
    actions = [],
    headerStyle = 'main',
    noDefaultActions = false,
    backLink,
    error = null,
  } = props;
  const { t } = useTranslation();
  const header = typeof headerSection === 'function' ? headerSection(resource) : headerSection;

  function getBackLink() {
    if (backLink === null) {
      return false;
    }

    if (!!backLink || backLink === '') {
      return backLink;
    }

    if (resource) {
      return createRouteURL(resource.listRoute);
    }
  }

  return (
    <SectionBox
      aria-busy={resource === null}
      aria-live="polite"
      title={
        <MainInfoHeader
          title={title}
          resource={resource}
          headerStyle={headerStyle}
          noDefaultActions={noDefaultActions}
          actions={actions}
        />
      }
      backLink={getBackLink()}
    >
      {resource === null ? (
        error ? (
          <Paper variant="outlined">
            <Empty color="error">{error.toString()}</Empty>
          </Paper>
        ) : (
          <Loader title={t('translation|Loading resource data')} />
        )
      ) : (
        <React.Fragment>
          {header}
          <MetadataDisplay resource={resource} extraRows={extraInfo} />
        </React.Fragment>
      )}
    </SectionBox>
  );
}
