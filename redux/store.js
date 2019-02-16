import { createStore, compose, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import { REACT_APP_REDUX_DEBUGGING_ENABLED } from 'react-native-dotenv';

function baselineMiddleware() {
  if (REACT_APP_REDUX_DEBUGGING_ENABLED === 'true') {
    return compose(applyMiddleware(thunkMiddleware, createLogger()));
  }

  return compose(applyMiddleware(thunkMiddleware));
}

export default initialState => {
  const enhancers =
    REACT_APP_REDUX_DEBUGGING_ENABLED === 'true'
      ? composeWithDevTools(baselineMiddleware())
      : baselineMiddleware();
  const store = createStore(rootReducer, initialState, enhancers);
  return store;
};
