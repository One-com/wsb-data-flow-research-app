/* @flow */

import type { Store, Dispatch } from 'redux';
import type { WorkspaceState } from '../workspace/main/types';
import type { SaveStatusState } from '../save/status/types';

export type AppState = {
  workspace: WorkspaceState,
  saveStatus: SaveStatusState,
};

export type AppDispatch = Dispatch<*>;

export type AppStore = Store<AppState, *>;

export type SelectorPath = Array<string | number>;

// TODO: reuse from 'redux-di'
export type AppSel<R: any = any> = {
  (appState: AppState): R,
  _path: SelectorPath,
  toStrPath: () => SelectorPath,
  spawn: <R>(path: SelectorPath) => AppSel<R>;
};
