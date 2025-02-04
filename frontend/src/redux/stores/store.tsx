import { configureStore } from '@reduxjs/toolkit';
import { initialState as CLUSTER_ACTIONS_INITIAL_STATE } from '../clusterActionSlice.ts';
import { initialState as CONFIG_INITIAL_STATE } from '../configSlice.ts';
import { initialState as FILTER_INITIAL_STATE } from '../filterSlice.ts';
import { listenerMiddleware } from '../headlampEventSlice.ts';
import reducers from '../reducers/reducers.tsx';
import { INITIAL_STATE as UI_INITIAL_STATE } from '../reducers/ui.tsx';

const store = configureStore({
  reducer: reducers,
  preloadedState: {
    filter: FILTER_INITIAL_STATE,
    ui: UI_INITIAL_STATE,
    config: CONFIG_INITIAL_STATE,
    clusterAction: CLUSTER_ACTIONS_INITIAL_STATE,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk: true,
    }).prepend(listenerMiddleware.middleware),
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
