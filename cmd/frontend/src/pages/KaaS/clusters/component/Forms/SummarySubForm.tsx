import { SubmitHandler } from 'react-hook-form';

import { Box, Step, Typography } from '@mui/material';

import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

import { FormValue } from '../../Create';
import style from '../../Create.module.scss';
import { Label } from '../../schemas';
import FormAction from './FormAction';

import DescriptionItem from '@components/atoms/KaaS/DescriptionItem/DescriptionItem';

interface SummaryFormProps {
  values?: FormValue;
  onSubmit: SubmitHandler<FormValue>;
}

const SummarySubForm = ({ values, onSubmit }: SummaryFormProps) => {
  interface SummaryGroup extends Array<Step> {}
  interface SummaryLayout extends Array<SummaryGroup> {}

  const summaryData: SummaryLayout = [
    [
      {
        title: 'Cluster',
        index: 1,
        sub: [
          {
            title: 'GENERAL',
            contents: [
              ['Name', values?.cluster?.name],
              ['Version', values?.cluster?.controlPlaneVersion],
              ['Container Runtime', values?.cluster?.containerRuntime],
              [
                'SSH Keys',
                isEmpty(values?.cluster?.sshKeys) ? 'No assigned keys' : values?.cluster?.sshKeys?.join(', '),
              ],
              [
                'Cluster Labels',
                values?.cluster?.labels
                  ?.filter((label: Label) => !(isEmpty(label.key) && isEmpty(label.value)))
                  .map(
                    (label: Label) => `${label.key}: ${label.value}`
                    // <Box>
                    //   <Chip label={label.key} />
                    //   <Chip label={label.value} />
                    // </Box>
                  )
                  .join(', '),
              ],
            ],
          },

          {
            title: 'NETWORK CONFIGURATION',
            contents: [
              ['CNI Plugin', values?.cluster?.cniPlugin],
              ['CNI Plugin Version', values?.cluster?.cniPluginVersion],
              ['Proxy Mode', 'ebpf'],
              ['Expose Strategy', 'NodePort'],
              ['Allowed IP Ranges for Node Ports', undefined],
              ['Services CIDR', '10.240.16.0/20'],
              ['Node CIDR Mask Size', '24'],
            ],
          },

          {
            title: 'SPECIFICATION',
            contents: [['User SSH Key Agent', undefined]],
          },

          {
            title: 'ADMISSION PLUGINS',
            contents: [['User SSH Key Agent', undefined]],
          },
        ],
      },
      {
        title: 'Settings',
        index: 2,
        contents: [['Preset', 'cocktail-preset']],
      },
    ],
    [
      {
        title: 'Static Nodes',
        index: 3,
        contents: [['Static Node Names', 'cp-node-1, wk-node-1']],
      },
      {
        title: 'Applications',
        index: 4,
      },
    ],
  ];

  return (
    <Box component="form">
      <Box className={style.summary}>
        {map(summaryData, (group, groupIndex) => (
          <Box className={style.group} key={groupIndex}>
            {map(group, (step) => (
              <SummaryStep key={step.title} stepData={step} />
            ))}
          </Box>
        ))}
      </Box>
      <FormAction onSubmit={() => values && onSubmit(values)} isValid />
    </Box>
  );
};

interface Step {
  title: string;
  index: number;
  contents?: any[];
  sub?: any[];
}

interface SummaryStepProps {
  stepData: Step;
}

const SummaryStep: React.FC<SummaryStepProps> = ({ stepData }) => (
  <Box className={style.step}>
    <Typography className={`${style.header} ${style[`counter-${stepData.index}`]}`} gutterBottom>
      {stepData.title}
    </Typography>

    {map(stepData.sub, (sub) => (
      <Box sx={{ paddingBottom: '24px' }} key={sub.title}>
        <Typography variant="subtitle1" sx={{ marginBottom: '14px' }}>
          {sub.title}
        </Typography>

        <Box className={style.content}>
          {map(sub.contents, (content) => (
            <DescriptionItem key={content[0]} description={{ label: content[0], value: content[1] }} />
          ))}
        </Box>
      </Box>
    ))}

    {map(stepData.contents, (content) => (
      <DescriptionItem key={content[0]} description={{ label: content[0], value: content[1] }} />
    ))}
  </Box>
);

export default SummarySubForm;
