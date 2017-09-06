const LogicFunctor = (action, store) => {
  return {
    ofType: type => {
      if (action.type === type) {
        return this;
      }

      console.log('this: ', this);

      return;
    },
    map: cb => {
      const newAction = cb(store);
      return LogicFunctor(newAction, store);
    },
    mapTo: newAction => {
      store.dispatch(newAction);
    },
  };
};

const flatten = (rootLogics, logic) => {
  if (Array.isArray(logic)) {
    logic.forEach(l => flatten(rootLogics, l));
  } else {
    rootLogics.push(logic);
  }
}

export const combineLogics = (...args) => {
  let logics = [];
  flatten(logics, [...args]);
  return logics;
};

export const makeLogicMiddleware = rootLogic => store => next => action => {
  next(action);
  if (Array.isArray(rootLogic)) {
    rootLogic.forEach(logic => {
      logic(action, store);
    });
    return;
  }
  rootLogic(action, store);
};
