/* @flow */

import { TestBench } from '../../../specs/bench/TestBench';
import { workspaceMarginAppSel } from '../workspace/margin/main/selectors';
import { componentsGen } from '../../../specs/generators/componentsGen';
import { workspaceComponentsAppSel } from '../workspace/components/selectors';
import { getInitialAppState } from '../main/getInitialAppState';
import { addComponentAction } from '../workspace/components/actions';
import { ComponentKind } from '../components/ComponentKind';
import { STORAGE_KEY } from './constants';
import { Lit } from '../common/Lit';
import { SaveStatus } from '../save_deprecated/constants';

describe('storage', () => {
  let bench: TestBench;

  beforeEach(() => {
    bench = new TestBench();
    bench.mountAppAgent();
  })

  afterEach(() => {
    bench.restore();
  })

  it('empty storage data results to initial app state', async () => {
    bench.stub.getStorageData(null);

    bench.agent.mountApp();

    (await bench.agent.assert.appState()).toEqual(getInitialAppState());
  });

  it('data is loaded upon mount', async () => {
    bench.stub.getStorageData({
      workspace: {
        margin: {
          width: 999,
          isLocked: true,
        },
        components: componentsGen([
          {
            id: '1',
          }
        ]),
      },
    });

    bench.agent.mountApp();

    (await bench.agent.assert.appState(workspaceMarginAppSel)).toMatchObject({
      width: 999,
      isLocked: true,
    });

    (await bench.agent.assert.appState(workspaceComponentsAppSel)).toHaveLength(1);
  });

  it('data is saved', async () => {
    bench.stub.setStorageData();

    bench.agent.mountApp();
    bench.agent.action.dispatch(addComponentAction(ComponentKind.BUTTON));
    bench.agent.action.save();

    const expectedAppStateToSave = await bench.agent.store.getState();
    expectedAppStateToSave[Lit.saveStatus] = SaveStatus.SAVED;

    // TODO: abstract out to bench
    const
      setItemCalls = bench.stub.ls.setItem.getCalls(),
      [arg1, arg2] = setItemCalls.length && setItemCalls[0]
        ? setItemCalls[0].args
        : [null, null];

    expect(arg1).toEqual(STORAGE_KEY);
    expect(arg2).toEqual(JSON.stringify(expectedAppStateToSave));
  });
});
