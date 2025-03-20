import { TypedUseSelectorHook, useSelector } from 'react-redux';

import actionButtons from '../actionButtonsSlice';
import clusterAction from '../clusterActionSlice';
import configReducer from '../configSlice';
import detailsViewSectionReducer from '../detailsViewSectionSlice';
import filterReducer from '../filterSlice';
import eventCallbackReducer from '../headlampEventSlice';
import notificationsReducer from '../notificationsSlice';
import overviewChartsReducer from '../overviewChartsSlice';
// import pluginConfigReducer from '../pluginConfigSlice';
// import pluginsReducer from '../pluginsSlice';
import resourceTableReducer from '../resourceTableSlice';
// import routesReducer from '../routesSlice';
// import sidebarReducer from '../sidebarSlice';
// import themeReducer from '../themeSlice';
import uiReducer from './ui';

import { combineReducers } from 'redux';

const reducers = combineReducers({
  filter: filterReducer,
  ui: uiReducer,
  clusterAction: clusterAction,
  config: configReducer,
  // plugins: pluginsReducer,
  actionButtons: actionButtons,
  notifications: notificationsReducer,
  // theme: themeReducer,
  resourceTable: resourceTableReducer,
  detailsViewSection: detailsViewSectionReducer,
  // routes: routesReducer,
  // sidebar: sidebarReducer,
  detailsViewSections: detailsViewSectionReducer,
  eventCallbackReducer,
  // pluginConfigs: pluginConfigReducer,
  overviewCharts: overviewChartsReducer,
});

export type RootState = ReturnType<typeof reducers>;

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default reducers;
