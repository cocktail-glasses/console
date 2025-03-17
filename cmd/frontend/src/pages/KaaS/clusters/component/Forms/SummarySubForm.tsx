import { Box, Step, Typography } from '@mui/material';

import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

import { FormValue } from '../../Create';
import style from '../../Create.module.scss';

// import '../../common.scss';
import DescriptionItem from '@components/atoms/KaaS/DescriptionItem/DescriptionItem';

interface SummaryFormProps {
  formValue: FormValue;
}

const SummarySubForm: React.FC<SummaryFormProps> = ({ formValue }) => {
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
              ['Name', formValue.cluster?.name],
              ['Version', formValue.cluster?.controlPlaneVersion],
              ['Container Runtime', formValue.cluster?.containerRuntime],
              [
                'SSH Keys',
                isEmpty(formValue.cluster?.sshKeys) ? 'No assigned keys' : formValue.cluster.sshKeys?.join(', '),
              ],
            ],
          },

          {
            title: 'NETWORK CONFIGURATION',
            contents: [
              ['CNI Plugin', formValue.cluster?.cniPlugin],
              ['CNI Plugin Version', formValue.cluster?.cniPluginVersion],
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
      {
        title: 'Static Nodes',
        index: 3,
      },
    ],
    [
      {
        title: 'Applications',
        index: 4,
      },
    ],
  ];

  return (
    <Box className={style.summary}>
      {map(summaryData, (group, groupIndex) => (
        <Box className={style.group} key={groupIndex}>
          {map(group, (step) => (
            <SummaryStep key={step.title} stepData={step} />
          ))}
        </Box>
      ))}
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
