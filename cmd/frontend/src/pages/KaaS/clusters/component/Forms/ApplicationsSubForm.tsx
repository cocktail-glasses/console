import { useEffect, useState } from 'react';

import { Add, OpenInNew } from '@mui/icons-material';
import { Box, Button, Link, Typography, Stack, Card, CardContent, CardMedia } from '@mui/material';

import { concat, includes, range, reduce } from 'lodash';
import isEmpty from 'lodash/isEmpty';

import '../../common.scss';
import style from './ApplicationSubForm.module.scss';

import Dialog from '@components/molecules/KaaS/Dialog/Dialog';
import ProgressStepperContent from '@components/organisms/KaaS/ProgressStepperContent/ProgressStepperContent';
import SearchList from '@components/organisms/KaaS/SearchList/SearchList';
import Argo from '@resources/app_argo.svg';
import CertManager from '@resources/app_cert-manager.svg';
import Falco from '@resources/app_falco.svg';
import Flux2 from '@resources/app_flux2.svg';

const ApplicationsSubForm = () => {
  const [stepIndex, setStepIndex] = useState(0);

  const handleSelectApplication = (application: string) => {
    setStepIndex((prev) => prev + 1);
    console.log(application);
  };

  const installApplicationStep = [
    { label: 'Select Application', content: <SelectApplicationContent onSelect={handleSelectApplication} /> },
    { label: 'Settings', content: <></> },
    { label: 'Application Values', content: <></> },
  ];

  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (isOpen) setStepIndex(0);
  }, [isOpen]);

  return (
    <Stack>
      <Typography variant="h6">Applications to Install</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <p>
          No application selected to install on cluster creation,{' '}
          <Link sx={{ display: 'inline-flex', alignItems: 'center' }}>
            learn more about Applicaitons
            <OpenInNew sx={{ fontSize: 15 }} />
          </Link>
        </p>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={() => setIsOpen(true)}
          sx={{ minHeight: '42px', maxHeight: '42px', textTransform: 'none' }}
        >
          Add Application
        </Button>
      </Box>

      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        closeBtn
        title="Add Application"
        content={
          <ProgressStepperContent stepDatas={installApplicationStep} activeStepIndex={stepIndex} progressFitWidth />
        }
        sx={{ padding: '10px', '& .MuiDialog-paper': { maxWidth: '660px', minWidth: '660px' } }}
      />
    </Stack>
  );
};

export default ApplicationsSubForm;

interface SelectApplicationContentProp {
  onSelect: (...event: any) => void;
}

const SelectApplicationContent: React.FC<SelectApplicationContentProp> = ({ onSelect }) => {
  const applications = [
    { image: Argo, title: 'argocd', summary: 'Argo CD - Declarative, GitOps Continues Delivery Tool for Kubernetes.' },
    {
      image: CertManager,
      title: 'cert-manager',
      summary:
        'cert-manager is a Kubernetes addon to automate the management and issuance of TLS certificates from various issuing sources.',
    },
    {
      image: Falco,
      title: 'falco',
      summary: 'Falco is a cloud native runtime security tool for Linux operating system.',
    },
    {
      image: Flux2,
      title: 'flux2',
      summary:
        'Flux is a tool for keeping Kubernetes clusters in sync with sources of configuration (like Git repositories), and automating updates to configuration when there is new cold to deploy.',
    },
  ];

  interface Application {
    image: string;
    title: string;
    summary: string;
  }

  const repeat = (arr: any[], n: number) => reduce(range(n), (acc) => concat(acc, arr), arr);

  const filterFn = (search: string, app: Application) => {
    if (isEmpty(search)) return true;
    return includes(app.title, search) || includes(app.summary, search);
  };

  const ListItem = (app: Application) => (
    <Card className={style.cardContainer} onClick={() => onSelect(app.title)}>
      <Box className={style.appImgContainer}>
        <CardMedia className={style.appImg} image={app.image} title={app.title} />
      </Box>
      <CardContent className={style.cardContent}>
        <Typography variant="subtitle1">
          <strong>{app.title}</strong>
        </Typography>
        <Typography variant="caption">{app.summary}</Typography>
      </CardContent>
    </Card>
  );

  return (
    <Stack sx={{ gap: '10px' }}>
      <Typography variant="body2" component="div" sx={{ display: 'flex', margin: '14px 0' }}>
        Install third party Applications into a cluster,
        <Link sx={{ display: 'flex', alignItems: 'center' }}>
          learn more about Applications
          <OpenInNew sx={{ fontSize: 15 }} />.
        </Link>
      </Typography>

      <SearchList
        data={repeat(applications, 5)}
        displayFn={ListItem}
        filterFn={filterFn}
        emptyMessage="No applications found."
      />
    </Stack>
  );
};
