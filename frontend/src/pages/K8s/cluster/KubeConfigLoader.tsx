// import { useEffect, useState } from 'react';
// import { useDropzone } from 'react-dropzone';
// import { useTranslation } from 'react-i18next';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';

// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Checkbox from '@mui/material/Checkbox';
// import FormControl from '@mui/material/FormControl';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Grid from '@mui/material/Grid';
// import Tooltip from '@mui/material/Tooltip';
// import Typography from '@mui/material/Typography';
// import { styled } from '@mui/material/styles';

// import { ClusterDialog } from './Chooser';

// import { DialogTitle } from '@components/common/Dialog';
// import Loader from '@components/common/Loader';
// import { InlineIcon } from '@iconify/react';
// import { setCluster } from '@lib/k8s/apiProxy';
// import * as yaml from 'js-yaml';
// import { setStatelessConfig } from 'redux/configSlice';

// interface Cluster {
//   name: string;
//   cluster: {
//     server: string;
//     [key: string]: any;
//   };
// }

// interface User {
//   name: string;
//   user: {
//     token: string;
//     [key: string]: any;
//   };
// }

// interface kubeconfig {
//   clusters: Cluster[];
//   users: User[];
//   contexts: { name: string; context: { cluster: string; user: string } }[];
//   currentContext: string;
// }

// function configWithSelectedClusters(config: kubeconfig, selectedClusters: string[]): kubeconfig {
//   const newConfig: kubeconfig = {
//     clusters: [],
//     users: [],
//     contexts: [],
//     currentContext: '',
//   };

//   // We use a map to avoid duplicates since many contexts can point to the same cluster/user.
//   const clusters: { [key: string]: Cluster } = {};
//   const users: { [key: string]: User } = {};

//   selectedClusters.forEach(clusterName => {
//     const context = config.contexts.find(c => c.name === clusterName);
//     if (!context) {
//       return;
//     }

//     const cluster = config.clusters.find(c => c.name === context.context.cluster);
//     if (!cluster) {
//       return;
//     }
//     clusters[cluster.name] = cluster;

//     // Optionally add the user.
//     const user = config.users?.find(c => c.name === context.context.user);
//     if (!!user) {
//       users[user.name] = user;
//     }

//     newConfig.contexts.push(context);
//   });

//   newConfig.clusters = Object.values(clusters);
//   newConfig.users = Object.values(users);

//   return newConfig;
// }

// const DropZoneBox = styled(Box)({
//   border: 1,
//   borderRadius: 1,
//   borderWidth: 2,
//   borderColor: 'rgba(0, 0, 0)',
//   borderStyle: 'dashed',
//   padding: '20px',
//   margin: '20px',
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   '&:hover': {
//     borderColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   '&:focus-within': {
//     borderColor: 'rgba(0, 0, 0, 0.5)',
//   },
// });

// const WideButton = styled(Button)({
//   width: '100%',
//   maxWidth: '300px',
// });

// const BlackButton = styled(WideButton)(({ theme }) => ({
//   backgroundColor: theme.palette.sidebarBg,
//   color: theme.palette.primaryColor,
//   '&:hover': {
//     opacity: '0.8',
//     backgroundColor: theme.palette.sidebarBg,
//   },
// }));

// const enum Step {
//   LoadKubeConfig,
//   SelectClusters,
//   ConfigureClusters,
//   Success,
// }

// function KubeConfigLoader() {
//   const navigate = useNavigate();
//   const [state, setState] = useState(Step.LoadKubeConfig);
//   const [error, setError] = React.useState('');
//   const [fileContent, setFileContent] = useState<kubeconfig>({
//     clusters: [],
//     users: [],
//     contexts: [],
//     currentContext: '',
//   });
//   const [selectedClusters, setSelectedClusters] = useState<string[]>([]);

//   useEffect(() => {
//     if (fileContent.contexts.length > 0) {
//       setSelectedClusters(fileContent.contexts.map(context => context.name));
//       setState(Step.SelectClusters);
//     }
//     return () => { };
//   }, [fileContent]);

//   useEffect(() => {
//     if (state === Step.ConfigureClusters) {
//       function loadClusters() {
//         //@todo: We need to check if the cluster is already configured.
//         const selectedClusterConfig = configWithSelectedClusters(fileContent, selectedClusters);
//         setCluster({ kubeconfig: btoa(yaml.dump(selectedClusterConfig)) })
//           .then(res => {
//             if (res?.clusters?.length > 0) {
//               dispatch(setStatelessConfig(res));
//             }
//             setState(Step.Success);
//           })
//           .catch(e => {
//             console.debug('Error setting up clusters from kubeconfig:', e);
//             setError(
//               t('translation|Error setting up clusters, please load a valid kubeconfig file')
//             );
//             setState(Step.SelectClusters);
//           });
//       }
//       loadClusters();
//     }
//     return () => { };
//   }, [state]);

//   const dispatch = useDispatch();
//   const { t } = useTranslation(['translation']);

//   const onDrop = (acceptedFiles: Blob[]) => {
//     setError('');
//     const reader = new FileReader();
//     reader.onerror = () => setError(t("translation|Couldn't read kubeconfig file"));
//     reader.onload = () => {
//       try {
//         const data = String.fromCharCode.apply(null, [
//           ...new Uint8Array(reader.result as ArrayBuffer),
//         ]);
//         const doc = yaml.load(data) as kubeconfig;
//         if (!doc.clusters || !doc.contexts) {
//           throw new Error('Invalid kubeconfig file');
//         }
//         setFileContent(doc);
//       } catch (err) {
//         setError(t('translation|Load a valid kubeconfig'));
//         return;
//       }
//     };
//     reader.readAsArrayBuffer(acceptedFiles[0]);
//   };

//   const { getRootProps, getInputProps, open } = useDropzone({
//     onDrop: onDrop,
//     multiple: false,
//   });

//   function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
//     if (!event.target.checked) {
//       // remove from selected clusters
//       setSelectedClusters(selectedClusters =>
//         selectedClusters.filter(cluster => cluster !== event.target.name)
//       );
//     } else {
//       // add to selected clusters
//       setSelectedClusters(selectedClusters => [...selectedClusters, event.target.name]);
//     }
//   }

//   function renderSwitch() {
//     switch (state) {
//       case Step.LoadKubeConfig:
//         return (
//           <Box>
//             <DropZoneBox border={1} borderColor="secondary.main" {...getRootProps()}>
//               <FormControl>
//                 <input {...getInputProps()} />
//                 <Tooltip
//                   title={t('translation|Drag & drop or choose kubeconfig file here')}
//                   placement="top"
//                 >
//                   <Button
//                     variant="contained"
//                     onClick={() => open}
//                     startIcon={<InlineIcon icon="mdi:upload" width={32} />}
//                   >
//                     {t('translation|Choose file')}
//                   </Button>
//                 </Tooltip>
//               </FormControl>
//             </DropZoneBox>
//             <Box style={{ display: 'flex', justifyContent: 'center' }}>
//               <WideButton onClick={() => navigate(-1)}>{t('translation|Back')}</WideButton>
//             </Box>
//           </Box>
//         );
//       case Step.SelectClusters:
//         return (
//           <Box
//             style={{
//               display: 'flex',
//               flexDirection: 'column',
//               justifyContent: 'center',
//               textAlign: 'center',
//               alignItems: 'center',
//             }}
//           >
//             <Typography>{t('translation|Select clusters')}</Typography>
//             {fileContent.clusters ? (
//               <>
//                 <Box
//                   sx={{
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     textAlign: 'center',
//                     justifyContent: 'center',
//                     padding: '15px',
//                     width: '100%',
//                     maxWidth: '300px',
//                   }}
//                 >
//                   <FormControl
//                     sx={{
//                       overflowY: 'auto',
//                       height: '150px',
//                       paddingLeft: '10px',
//                       paddingRight: '10px',
//                       width: '100%',
//                     }}
//                   >
//                     {fileContent.contexts.map(context => {
//                       return (
//                         <FormControlLabel
//                           key={context.name}
//                           control={
//                             <Checkbox
//                               value={context.name}
//                               name={context.name}
//                               onChange={handleCheckboxChange}
//                               color="primary"
//                               checked={selectedClusters.includes(context.name)}
//                             />
//                           }
//                           label={context.name}
//                         />
//                       );
//                     })}
//                   </FormControl>
//                   <Grid
//                     container
//                     direction="column"
//                     spacing={2}
//                     justifyContent="center"
//                     alignItems="stretch"
//                   >
//                     <Grid item>
//                       <BlackButton
//                         variant="contained"
//                         color="primary"
//                         onClick={() => {
//                           setState(Step.ConfigureClusters);
//                         }}
//                         disabled={selectedClusters.length === 0}
//                       >
//                         {t('translation|Next')}
//                       </BlackButton>
//                     </Grid>
//                     <Grid item>
//                       <WideButton
//                         onClick={() => {
//                           setError('');
//                           setState(Step.LoadKubeConfig);
//                         }}
//                       >
//                         {t('translation|Back')}
//                       </WideButton>
//                     </Grid>
//                   </Grid>
//                 </Box>
//               </>
//             ) : null}
//           </Box>
//         );
//       case Step.ConfigureClusters:
//         return (
//           <Box style={{ textAlign: 'center' }}>
//             <Typography>{t('translation|Setting up clusters')}</Typography>
//             <Loader title={t('translation|Setting up clusters')} />
//           </Box>
//         );
//       case Step.Success:
//         return (
//           <Box
//             sx={{
//               display: 'flex',
//               flexDirection: 'column',
//               justifyContent: 'center',
//               textAlign: 'center',
//               alignItems: 'center',
//             }}
//           >
//             <Box style={{ padding: '32px' }}>
//               <Typography>{t('translation|Clusters successfully set up!')}</Typography>
//             </Box>
//             <BlackButton variant="contained" onClick={() => navigate('/', { replace: true })}>
//               {t('translation|Finish')}
//             </BlackButton>
//           </Box>
//         );
//     }
//   }

//   return (
//     <ClusterDialog
//       showInfoButton={false}
//       // Disable backdrop clicking.
//       onClose={() => { }}
//       useCover
//     >
//       <DialogTitle>{t('translation|Load from KubeConfig')}</DialogTitle>
//       {error && error !== '' ? (
//         <Box style={{ backgroundColor: 'red', textAlign: 'center', padding: '4px' }}>{error}</Box>
//       ) : null}
//       <Box>{renderSwitch()}</Box>
//     </ClusterDialog>
//   );
// }

// export default KubeConfigLoader;
