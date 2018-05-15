class LogicFunctor {
  constructor(action, store) {
    this.action = action;
    this.store = store;
  }

  ofType(type) {
    if (this.action.type === type) {
      return this;
    }
    return new LogicFunctor(null, this.store);
  }
  map(cb) {
    if (!this || !this.getAction()) {
      return;
    }
    const newAction = cb(this.getAction(), this.store);
    return new LogicFunctor(newAction, this.store);
  }
  mapTo(newAction) {
    if (!this || !this.getAction()) {
      return;
    }
    return new LogicFunctor(newAction, this.store);
  }

  getAction() {
    if (!this) {
      return null;
    }
    return this.action;
  }
}

export const inject = (customMethods) => {
  Object.keys(customMethods).forEach(k => {
    LogicFunctor.prototype[k] = function(...args) {
      const newAction = customMethods[k](...args, this.action, this.store);
      const newFunctor = new LogicFunctor(newAction, this.store);
      return newFunctor;
    };
  });
}

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

  let newRootLogic = rootLogic;

  if (!Array.isArray(rootLogic)) {
    newRootLogic = [rootLogic];
  }

  newRootLogic.forEach(logic => {
    const finalActionFunctor = logic(new LogicFunctor(action, store), store);
    if (!finalActionFunctor || !finalActionFunctor.getAction()) return;
    const finalAction = finalActionFunctor.getAction();
    if (finalAction) {
      store.dispatch(finalAction);
    }
  });
};
