import { combineReducers } from 'redux';

import { alert } from './alert.reducer';
import { staff } from './staff.reducer';

const rootReducer = combineReducers({
  alert,
  staff
});

export default rootReducer;