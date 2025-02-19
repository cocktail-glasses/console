// import { isValidElement, useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';

// import Box, { BoxProps } from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Stack from '@mui/material/Stack';

// import { isEqual } from 'lodash';

// import { SectionBox } from '@components/common';
// import { ConfirmDialog } from '@components/common/Dialog';
// import ErrorBoundary from '@components/common/ErrorBoundary';
// import { PluginInfo } from 'redux/pluginsSlice';

// const ScrollableBox = (props: BoxProps) => (
//   <Box
//     sx={{
//       overflowY: 'scroll',
//       msOverflowStyle: 'none',
//       scrollbarWidth: 'none',
//       '&::-webkit-scrollbar': {
//         display: 'none',
//       },
//     }}
//     {...props}
//   />
// );

// /**
//  * Represents the properties expected by the PluginSettingsDetails component.
//  *
//  * @property {Object} [config] - Optional configuration settings for the plugin. This is an object that contains current configuration of the plugin.
//  * @property {PluginInfo} plugin - Information about the plugin.
//  * @property {(data: { [key: string]: any }) => void} [onSave] - Optional callback function that is called when the settings are saved. The function receives an object representing the updated configuration settings for the plugin.
//  * @property {() => void} onDelete - Callback function that is called when the plugin is requested to be deleted. This function does not take any parameters and does not return anything.
//  *
//  * @see PluginInfo - Refer to the PluginInfo documentation for details on what this object should contain.
//  */
// export interface PluginSettingsDetailsPureProps {
//   config?: { [key: string]: any };
//   plugin: PluginInfo;
//   onSave?: (data: { [key: string]: any }) => void;
//   onDelete: () => void;
// }

// export function PluginSettingsDetailsPure(props: PluginSettingsDetailsPureProps) {
//   const { config, plugin, onSave, onDelete } = props;
//   const { t } = useTranslation(['translation']);
//   const [data, setData] = useState<{ [key: string]: any } | undefined>(config);
//   const [enableSaveButton, setEnableSaveButton] = useState(false);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!isEqual(config, data)) {
//       setEnableSaveButton(true);
//     } else {
//       setEnableSaveButton(false);
//     }
//   }, [data, config]);

//   function onDataChange(data: { [key: string]: any }) {
//     setData(data);
//   }

//   async function handleSave() {
//     if (onSave && data) {
//       await onSave(data);
//       navigate('/settings/plugins');
//     }
//   }

//   function handleDelete() {
//     setOpenDeleteDialog(true);
//   }

//   function handleDeleteConfirm() {
//     onDelete();
//   }

//   async function handleCancel() {
//     await setData(config);
//     navigate('/settings/plugins');
//   }

//   let component;
//   if (isValidElement(plugin.settingsComponent)) {
//     component = plugin.settingsComponent;
//   } else if (typeof plugin.settingsComponent === 'function') {
//     const Comp = plugin.settingsComponent;
//     if (plugin.displaySettingsComponentWithSaveButton) {
//       component = <Comp onDataChange={onDataChange} data={data} />;
//     } else {
//       component = <Comp />;
//     }
//   } else {
//     component = <></>;
//   }

//   return (
//     <>
//       <SectionBox aria-live="polite" title={plugin.name} backLink={'/settings/plugins'}>
//         {plugin.description}
//         <ScrollableBox style={{ height: '70vh' }} py={0}>
//           <ConfirmDialog
//             open={openDeleteDialog}
//             title={t('translation|Delete Plugin')}
//             description={t('translation|Are you sure you want to delete this plugin?')}
//             handleClose={() => setOpenDeleteDialog(false)}
//             onConfirm={() => handleDeleteConfirm()}
//           />
//           <ErrorBoundary>{component}</ErrorBoundary>
//         </ScrollableBox>
//       </SectionBox>
//       <Box py={0}>
//         <Stack
//           direction="row"
//           spacing={2}
//           justifyContent="space-between"
//           alignItems="center"
//           sx={{ borderTop: '2px solid', borderColor: 'silver', padding: '10px' }}
//         >
//           <Stack direction="row" spacing={1}>
//             {plugin.displaySettingsComponentWithSaveButton && (
//               <>
//                 <Button
//                   variant="contained"
//                   disabled={!enableSaveButton}
//                   style={{ backgroundColor: 'silver', color: 'black' }}
//                   onClick={handleSave}
//                 >
//                   {t('translation|Save')}
//                 </Button>
//                 <Button style={{ color: 'silver' }} onClick={handleCancel}>
//                   {t('translation|Cancel')}
//                 </Button>
//               </>
//             )}
//           </Stack>
//         </Stack>
//       </Box>
//     </>
//   );
// }
