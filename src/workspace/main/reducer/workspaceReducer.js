/* @flow */

import {combineReducers} from '@sepo27/redux-di';
import { componentsReducer } from '../../components/reducer/componentsReducer';

export const workspaceReducer = combineReducers({
  components: componentsReducer,
});