/* @flow */

import { TestBench } from '../../../specs/bench/TestBench';
import { ServiceHandlerRegistryClass } from './serviceHandlerRegistry';
import { serviceHandlerAction } from './actions';

const ServiceHandlerRegistryModule = require('./serviceHandlerRegistry');

// TODO
xdescribe('serviceHandler', () => {
  let bench: TestBench;

  beforeEach(() => {
    bench = new TestBench();
    bench.mountAppAgent();
  })

  afterEach(() => {
    bench.restore();
  });

  it('dispatches request action with params', async () => {
    class TestService
    {
      getTestStuff() {
        return Promise.resolve();
      }
    }

    const
      tesetService = new TestService(),
      RegistryName = {
        TEST_SERVICE: 'testService',
      },
      Registry = {
        [RegistryName.TEST_SERVICE]: tesetService,
      };

    bench.stub.sinon
      .stub(ServiceHandlerRegistryModule, 'ServiceHandlerRegistryName')
      .value(RegistryName);

    bench.stub.sinon
      .stub(ServiceHandlerRegistryModule, 'serviceHandlerRegistry')
      .value(new ServiceHandlerRegistryClass(Registry));

    const action = serviceHandlerAction({
      service: {
        name: RegistryName.TEST_SERVICE,
        method: tesetService.getTestStuff.name,
      },
      actions: {
        request: 'TEST_REQUEST_ACTION',
        success: 'TEST_SUCCESS_ACTION',
        failure: 'TEST_FAILURE_ACTION',
      },
      params: ['123'],
    });

    bench.agent.mountApp();
    bench.agent.action.dispatch(action);

    await bench.agent.assert.actionCalled('TEST_REQUEST_ACTION', {
      params: ['123'],
    });
  });

  it('dispatches success action with params & response', async () => {
    class TestService
    {
      getTestStuff() {
        return Promise.resolve({
          ok: true,
          data: 'Success !',
        });
      }
    }

    const
      tesetService = new TestService(),
      RegistryName = {
        TEST_SERVICE: 'testService',
      },
      Registry = {
        [RegistryName.TEST_SERVICE]: tesetService,
      };

    bench.stub.sinon
      .stub(ServiceHandlerRegistryModule, 'ServiceHandlerRegistryName')
      .value(RegistryName);

    bench.stub.sinon
      .stub(ServiceHandlerRegistryModule, 'serviceHandlerRegistry')
      .value(new ServiceHandlerRegistryClass(Registry));

    const action = serviceHandlerAction({
      service: {
        name: RegistryName.TEST_SERVICE,
        method: tesetService.getTestStuff.name,
      },
      actions: {
        request: 'TEST_REQUEST_ACTION',
        success: 'TEST_SUCCESS_ACTION',
        failure: 'TEST_FAILURE_ACTION',
      },
      params: ['321'],
    });

    bench.agent.mountApp();
    bench.agent.action.dispatch(action);

    await bench.agent.assert.actionCalled('TEST_SUCCESS_ACTION', {
      params: ['321'],
      response: {
        ok: true,
        data: 'Success !',
      },
    });
  });

  it('dispatches failure action with params & response', async () => {
    class TestService
    {
      getTestStuff() {
        return Promise.reject({
          ok: false,
          error: 'Failure :(',
        });
      }
    }

    const
      tesetService = new TestService(),
      RegistryName = {
        TEST_SERVICE: 'testService',
      },
      Registry = {
        [RegistryName.TEST_SERVICE]: tesetService,
      };

    bench.stub.sinon
      .stub(ServiceHandlerRegistryModule, 'ServiceHandlerRegistryName')
      .value(RegistryName);

    bench.stub.sinon
      .stub(ServiceHandlerRegistryModule, 'serviceHandlerRegistry')
      .value(new ServiceHandlerRegistryClass(Registry));

    const action = serviceHandlerAction({
      service: {
        name: RegistryName.TEST_SERVICE,
        method: tesetService.getTestStuff.name,
      },
      actions: {
        request: 'TEST_REQUEST_ACTION',
        success: 'TEST_SUCCESS_ACTION',
        failure: 'TEST_FAILURE_ACTION',
      },
      params: ['111'],
    });

    bench.agent.mountApp();
    bench.agent.action.dispatch(action);

    await bench.agent.assert.actionCalled('TEST_FAILURE_ACTION', {
      params: ['111'],
      response: {
        ok: false,
        error: 'Failure :(',
      },
    });
  });
});
