/* @flow */

import type { ComponentKindT } from '../../components/types';
import type { Dimensions } from '../../common/commonTypes';
import type {Position} from '../../common/commonTypes';

export const
  ADD_COMPONENT_ACTION = 'ADD_COMPONENT_ACTION',
  addComponentAction = (kind: ComponentKindT) => ({
    type: ADD_COMPONENT_ACTION,
    payload: kind,
  });

export const
  NEW_COMPONENT_MEASURED_ACTION = 'NEW_COMPONENT_MEASURED_ACTION',
  newComponentMeasuredAction = (id: string, dimensions: Dimensions) => ({
    type: NEW_COMPONENT_MEASURED_ACTION,
    payload: { id, dimensions },
  });

export const
  SELECT_COMPONENT_ACTION = 'SELECT_COMPONENT_ACTION',
  selectComponentAction = (id: string) => ({
    type: SELECT_COMPONENT_ACTION,
    payload: id,
  });

export const
  DESELECT_COMPONENT_ACTION = 'DESELECT_COMPONENT_ACTION',
  deselectComponentAction = (id: string) => ({
    type: DESELECT_COMPONENT_ACTION,
    payload: id,
  });

export const
  MOVE_COMPONENT_ACTION = 'MOVE_COMPONENT_ACTION',
  moveComponentAction = (id: string, position: Position) => ({
    type: MOVE_COMPONENT_ACTION,
    payload: {id, position},
  });
