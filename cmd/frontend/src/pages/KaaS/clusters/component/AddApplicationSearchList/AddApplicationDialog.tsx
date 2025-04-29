import { useEffect, useState } from 'react';

import { OpenInNew } from '@mui/icons-material';
import { Box, Link, Typography, Stack, Card, CardContent, CardMedia } from '@mui/material';

import { concat, includes, isFunction, map, omit, range, reduce } from 'lodash';
import isEmpty from 'lodash/isEmpty';

import style from './AddApplicationDialog.module.scss';
import { value } from './istioValue';

import Button from '@components/atoms/KaaS/Button/Button';
import Dialog from '@components/molecules/KaaS/Dialog/Dialog';
import Editor from '@components/molecules/KaaS/Editor/Editor';
import ProgressStepper, { Controller } from '@components/molecules/KaaS/ProgressStepper/ProgressStepper';
import SearchList from '@components/organisms/KaaS/SearchList/SearchList';
import Argo from '@resources/app_argo.svg';
import CertManager from '@resources/app_cert-manager.svg';
import Falco from '@resources/app_falco.svg';
import Flux2 from '@resources/app_flux2.svg';
import Istio from '@resources/app_istio.svg';
import Jaeger from '@resources/app_jaegertracing.svg';
import Kiali from '@resources/app_kiali.svg';
import Prometheus from '@resources/app_prometheus.svg';

export interface Application {
  image: string;
  title: string;
  summary: string;
  values?: string;
}

interface AddApplicationSearchListProps {
  onSelect: (app: Application) => void;
}

const AddApplicationSearchList = ({ onSelect }: AddApplicationSearchListProps) => {
  const applications = [
    {
      image: Istio,
      title: 'istio',
      summary:
        'Istio is an open-source service mesh that provides a uniform way to secure, connect, and monitor microservices.',
      values: value,
    },
    {
      image: Kiali,
      title: 'kiali',
      summary:
        'Kiali is a management console for Istio-based service meshes, providing comprehensive visualization and monitoring capabilities to help operators understand and manage their microservices architecture.',
    },
    {
      image: Prometheus,
      title: 'prometheus',
      summary:
        'Prometheus is an open-source monitoring toolkit that collects metrics, uses PromQL for queries,  and integrates with Kubernetes for effective alerting and observability.',
    },
    {
      image: Jaeger,
      title: 'jaeger',
      summary:
        'Jaeger is an open-source distributed tracing system that operates within Kubernetes environments to monitor and visualize transactions across microservices.',
    },
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

  const repeat = (arr: any[], n: number) => reduce(range(n), (acc) => concat(acc, arr), arr);

  const filterFn = (search: string, app: Application) => {
    if (isEmpty(search)) return true;
    return includes(app.title, search) || includes(app.summary, search);
  };

  const ListItem = (app: Application) => (
    <Card className={style.cardContainer} onClick={() => onSelect(app)}>
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
      <Typography variant="body2" component="div" sx={{ display: 'flex', margin: '14px 0', gap: '5px' }}>
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

interface AddApplicationDialogProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const AddApplicationDialog = ({ isOpen = false, onClose }: AddApplicationDialogProps) => {
  const [app, setApp] = useState<Application>();
  const installApplicationStep = [
    {
      label: 'Select Application',
      content: ({ onNext }: Controller) => {
        const handleSelectApplication = (application: Application) => {
          onNext();
          setApp(application);
        };

        return <AddApplicationSearchList onSelect={handleSelectApplication} />;
      },
    },
    {
      label: 'Settings',
      content: (c: Controller) => {
        return (
          <Stack sx={{ marginY: '30px', gap: '10px' }}>
            <Editor value={app?.values} height={'1095px'} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={c.onPrev}>Back</Button>
              <Button onClick={c.onNext}>Next</Button>
            </Box>
          </Stack>
        );
      },
    },
    {
      label: 'Application Values',
      content: (c: Controller) => {
        return (
          <Stack sx={{ marginY: '30px', gap: '10px' }}>
            <Editor value={''} height={'1095px'} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={c.onPrev}>Back</Button>
              <Button onClick={c.onNext}>Next</Button>
            </Box>
          </Stack>
        );
      },
    },
  ];

  const [_isOpen, setIsOpen] = useState(isOpen);
  useEffect(() => {
    setIsOpen(isOpen);
  }, [isOpen]);

  const handleOnClose = () => {
    setIsOpen(false);
    setApp(undefined);
    setCurrentStep(0);
    if (isFunction(onClose)) onClose();
  };

  const [currentStep, setCurrentStep] = useState(0);
  const defaultWidth = {
    maxWidth: '660px',
    minWidth: '660px',
  };

  const editorWidth = {
    maxWidth: '1080px',
    minWidth: '1080px',
  };

  return (
    <Dialog
      isOpen={_isOpen}
      onClose={handleOnClose}
      closeBtn
      title="Add Application"
      content={
        <ProgressStepper
          steps={map(installApplicationStep, (step) => omit(step, 'content'))}
          currentStep={currentStep}
          onChangeCurrentStep={setCurrentStep}
          fitWidth
          Render={(controller) => {
            const { currentStep } = controller;

            return installApplicationStep[currentStep].content(controller);
          }}
        />
      }
      sx={{ padding: '10px', '& .MuiDialog-paper': currentStep == 0 ? defaultWidth : editorWidth }}
    />
  );
};

export default AddApplicationDialog;
