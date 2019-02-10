import { combineReducers } from 'redux';
import { STORE as user } from './user';

const rootReducer = combineReducers({
  user
});

export default rootReducer;
