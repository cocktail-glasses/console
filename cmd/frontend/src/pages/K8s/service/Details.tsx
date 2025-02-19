import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';

import { isEmpty } from 'lodash';

import { Link } from '@components/common';
import Empty from '@components/common/EmptyContent';
import { ValueLabel } from '@components/common/Label';
import { DetailsGrid, MetadataDictGrid } from '@components/common/Resource';
import PortForward from '@components/common/Resource/PortForward';
import { SectionBox } from '@components/common/SectionBox';
import SimpleTable from '@components/common/SimpleTable';
import { InlineIcon } from '@iconify/react';
import Endpoints from '@lib/k8s/endpoints';
import Service from '@lib/k8s/service';

export default function ServiceDetails() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const { t } = useTranslation(['glossary', 'translation']);

  const [endpoints, endpointsError] = Endpoints.useList({ namespace });

  function getOwnedEndpoints(item: Service) {
    return item ? endpoints?.filter((endpoint) => endpoint.getName() === item.getName()) : null;
  }

  return (
    <DetailsGrid
      resourceType={Service}
      name={name}
      namespace={namespace}
      withEvents
      extraInfo={(item) =>
        item && [
          {
            name: t('translation|Type'),
            value: item.spec.type,
          },
          {
            name: t('Cluster IP'),
            value: item.spec.clusterIP,
          },
          {
            name: t('External IP'),
            value: item.getExternalAddresses(),
            hide: isEmpty,
          },
          {
            name: t('Selector'),
            value: <MetadataDictGrid dict={item.spec.selector} />,
          },
        ]
      }
      extraSections={(item) =>
        item && [
          {
            id: 'headlamp.service-ports',
            section: (
              <SectionBox title={t('Ports')}>
                <SimpleTable
                  data={item.spec.ports}
                  columns={[
                    {
                      label: t('Protocol'),
                      datum: 'protocol',
                    },
                    {
                      label: t('translation|Name'),
                      datum: 'name',
                    },
                    {
                      label: t('Ports'),
                      getter: ({ port, targetPort }) => (
                        <React.Fragment>
                          <ValueLabel>{port}</ValueLabel>
                          <InlineIcon icon="mdi:chevron-right" />
                          <ValueLabel>{targetPort}</ValueLabel>
                          <PortForward containerPort={targetPort} resource={item} />
                        </React.Fragment>
                      ),
                    },
                  ]}
                  reflectInURL="ports"
                />
              </SectionBox>
            ),
          },
          {
            id: 'headlamp.service-endpoints',
            section: (
              <SectionBox title={t('Endpoints')}>
                {endpointsError ? (
                  <Empty color="error">
                    <>{endpointsError}</>
                  </Empty>
                ) : (
                  <SimpleTable
                    data={getOwnedEndpoints(item)}
                    columns={[
                      {
                        label: t('translation|Name'),
                        getter: (endpoint) => <Link kubeObject={endpoint} />,
                      },
                      {
                        label: t('translation|Addresses'),
                        getter: (endpoint) => (
                          <Box display="flex" flexDirection="column">
                            {endpoint.getAddresses().map((address: string) => (
                              <ValueLabel>{address}</ValueLabel>
                            ))}
                          </Box>
                        ),
                      },
                    ]}
                    reflectInURL="endpoints"
                  />
                )}
              </SectionBox>
            ),
          },
        ]
      }
    />
  );
}
