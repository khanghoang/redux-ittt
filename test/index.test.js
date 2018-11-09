import configureStore from 'redux-mock-store';

import { makeLogicMiddleware, combineLogics, inject } from '../src/index';

inject({
  withThisTypeReturnBar: (extraParam, action, store) => {
    if (action.type === extraParam) {
      return { type: 'bar' };
    }
  },
});

describe('Redux if this do that', function() {
  it('is a middleware', function() {
    const logic = (action, store) =>
      action.ofType('foo').mapTo({ type: 'bar' });

    const middleware = makeLogicMiddleware(logic);
    const mockStore = configureStore([middleware]);
    const store = mockStore();
    const action = { type: 'foo' };
    store.dispatch(action);
    expect(store.getActions()).toEqual(
      expect.arrayContaining([{ type: 'bar' }])
    );
  });

  it('can be composed', function() {
    const logic1 = (action, store) =>
      action.ofType('foo').mapTo({ type: 'bar' });
    const logic2 = (action, store) =>
      action.ofType('bar').mapTo({ type: 'bar2' });
    const logic3 = (action, store) =>
      action.ofType('bar2').mapTo({ type: 'bar3' });

    const middleware = makeLogicMiddleware(
      combineLogics(logic1, combineLogics(logic2, logic3))
    );
    const mockStore = configureStore([middleware]);
    const store = mockStore();
    const action = { type: 'foo' };
    store.dispatch(action);

    expect(store.getActions()).toEqual(
      expect.arrayContaining([
        { type: 'bar' },
        { type: 'bar2' },
        { type: 'bar3' },
      ])
    );
  });

  it('gets called every action', function() {
    const logic = jest.fn();
    const middleware = makeLogicMiddleware(combineLogics(logic));
    const mockStore = configureStore([middleware]);
    const store = mockStore();
    store.dispatch({ type: 'foo' });
    store.dispatch({ type: 'bar' });
    expect(logic.mock.calls.length).toEqual(2);
  });

  it('get called with action and store', function() {
    const mockMap = jest.fn();
    const logic = (action, store) =>
      action.ofType('foo').map(mockMap);
    const middleware = makeLogicMiddleware(combineLogics(logic));
    const mockStore = configureStore([middleware]);
    const store = mockStore();
    const action = { type: 'foo' };
    store.dispatch(action);
    expect(mockMap.mock.calls[0][0]).toEqual(action);
    expect(mockMap.mock.calls[0][1]).toEqual(
      expect.objectContaining({
        dispatch: expect.any(Function),
        getState: expect.any(Function),
      })
    );
  });

  describe('`Each` method', function() {
    it('should method', function() {
      const mockFunc = jest.fn();
      const logic = (action, store) =>
        action.ofType('foo').each(mockFunc);

      const middleware = makeLogicMiddleware(combineLogics(logic));
      const mockStore = configureStore([middleware]);
      const store = mockStore();
      store.dispatch({ type: 'foo' });
      store.dispatch({ type: 'bar' });
      store.dispatch({ type: 'foo' });
      expect(mockFunc.mock.calls.length).toEqual(2);
    });

    it('is not chainable', function() {
      const mockFunc = jest.fn();
      const logic = (action, store) =>
        action.ofType('foo').each(mockFunc);

      const middleware = makeLogicMiddleware(combineLogics(logic));
      const mockStore = configureStore([middleware]);
      const store = mockStore();

      store.dispatch({ type: 'foo' });

      const actions = store.getActions(); 
      expect(actions).toEqual([ { type: 'foo' } ]);
    });

    it('logs to console that "Each" method is un-chainable', () => {
      const messsge = 'Redux-ittt "Each" is not chainable';
      const mockLog = jest.fn();
      const originLog = console.warn;
      console.warn = mockLog;

      const logic = (action, store) =>
        action.ofType('foo').each(() => {}).map({ type: 'not-chainable' });

      const middleware = makeLogicMiddleware(combineLogics(logic));
      const mockStore = configureStore([middleware]);
      const store = mockStore();

      store.dispatch({ type: 'foo' });

      const actions = store.getActions(); 

      console.warn = originLog;
      expect(mockLog.mock.calls[0][0]).toEqual(messsge);
    });

    it('gets called with action and store as params', function() {
      const mockFunc = jest.fn();
      const logic = (action, store) =>
        action.ofType('foo').each(mockFunc);

      const middleware = makeLogicMiddleware(combineLogics(logic));
      const mockStore = configureStore([middleware]);
      const store = mockStore();
      store.dispatch({ type: 'foo', payload: { foo : 'bar' } });

      expect(mockFunc.mock.calls.length).toEqual(1);
      expect(mockFunc.mock.calls[0][0]).toEqual({
        type: 'foo',
        payload: {
          foo: 'bar'
        }
      });
      expect(mockFunc.mock.calls[0][1]).toEqual(
        expect.objectContaining({
          dispatch: expect.any(Function),
          getState: expect.any(Function),
        })
      );
    });
  });

  it('be injected with handy functions', function() {
    const logic = (action, store) => action.withThisTypeReturnBar('foo');
    const middleware = makeLogicMiddleware(logic);
    const mockStore = configureStore([middleware]);
    const store = mockStore();
    const action = { type: 'foo' };
    store.dispatch(action);
    expect(store.getActions()).toEqual(
      expect.arrayContaining([{ type: 'bar' }])
    );
  });
});
