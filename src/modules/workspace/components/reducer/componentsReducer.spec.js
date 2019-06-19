/* @flow */

import {
  ComponentsInitialState,
  componentsReducer as reducer,
} from './componentsReducer';
import { assertReducerInitialState } from '../../../../../specs/assertions/assertReducerInitialState';
import { addComponentAction, touchComponentAction } from '../actions';
import { ComponentKind } from '../../../components/ComponentKind';
import { comRegistry } from '../../../components/ComponentsRegistry';
import { baseComponentStateGen } from '../../../../../specs/generators/baseComponentStateGen';
import { NEW_COMPONENT_POSITION_SHIFT_DISTANCE } from './constants';
import { TestBench } from '../../../../../specs/bench/TestBench';
import { moveOverWorkspaceAction } from '../../main/actions';
import { WorkspaceMode } from '../../mode/WorkspaceMode';

describe('componentsReducer', () => {
  let bench: TestBench;

  beforeEach(() => {
    bench = new TestBench();
  })

  afterEach(() => {
    bench.restore();
  })

  it('resolves initial state', () => {
    assertReducerInitialState(reducer, ComponentsInitialState);
  });

  it('adds component', () => {
    bench.stub.uuid.returns('123');

    const
      state = [...ComponentsInitialState],
      action = addComponentAction(ComponentKind.BUTTON);

    expect(reducer(state, action, { mode: WorkspaceMode.IDLE })).toEqual([
      comRegistry.getInitialState(ComponentKind.BUTTON),
    ]);
  });

  it('adds new component with position shift', () => {
    bench.stub.uuidCycle(2);

    const
      baseCom = baseComponentStateGen(ComponentKind.BUTTON),
      state = [baseCom],
      action = addComponentAction(ComponentKind.BUTTON);

    expect(reducer(state, action, { mode: WorkspaceMode.IDLE })).toEqual([
      comRegistry.getInitialState(ComponentKind.BUTTON),
      {
        ...comRegistry.getInitialState(ComponentKind.BUTTON),
        position: {
          top: baseCom.position.top + NEW_COMPONENT_POSITION_SHIFT_DISTANCE,
          left: baseCom.position.left + NEW_COMPONENT_POSITION_SHIFT_DISTANCE,
        },
      },
    ]);
  });

  it('selects component on touch', () => {
    const
      com = baseComponentStateGen(ComponentKind.BUTTON, {
        id: '321',
      }),
      state = [com],
      action = touchComponentAction('321');

    expect(reducer(state, action, { mode: WorkspaceMode.IDLE })).toEqual([
      {
        ...com,
        selected: true,
      }
    ]);
  });

  it('deselects other components when selecting one', () => {
    const
      com1 = baseComponentStateGen(ComponentKind.BUTTON, {
        id: '1',
        isSelected: true,
      }),
      com2 = baseComponentStateGen(ComponentKind.BUTTON, {
        id: '2',
        isSelected: false,
      }),
      state = [com1, com2];

    expect(reducer(state, touchComponentAction('2'), { mode: WorkspaceMode.IDLE })).toEqual([
      {
        ...com1,
        selected: false,
      },
      {
        ...com2,
        selected: true,
      },
    ]);
  });

  it('moves selected component', () => {
    const
      com = baseComponentStateGen(ComponentKind.BUTTON, {
        id: '111',
        position: {
          top: 50,
          left: 50,
        },
        isSelected: true,
      }),
      state = [com],
      action = moveOverWorkspaceAction({
        top: 55,
        left: 60,
      }),
      dependencies = {
        mode: WorkspaceMode.MOVING_COMPONENTS,
      };

    expect(reducer(state, action, dependencies)).toEqual([
      {
        ...com,
        position: {
          top: 55,
          left: 60,
        },
      },
    ]);
  });
});
