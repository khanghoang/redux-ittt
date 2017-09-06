import configureStore from 'redux-mock-store';

import { makeLogicMiddleware, combineLogics } from '../src/index';

describe('Redux if this do that', function() {
  it('is a middleware', function() {
    const logic = (action, store) => {
      if (action.type === 'foo') {
        store.dispatch({ type: 'bar' });
      }
    };

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
    const logic1 = (action, store) => {
      if (action.type === 'foo') {
        store.dispatch({ type: 'bar' });
      }
    };

    const logic2 = (action, store) => {
      if (action.type === 'bar') {
        store.dispatch({ type: 'bar2' });
      }
    };

    const logic3 = (action, store) => {
      if (action.type === 'bar2') {
        store.dispatch({ type: 'bar3' });
      }
    };

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
  it('gets called every action', function() {});
  it('be injected with handy functions', function() {});
});
