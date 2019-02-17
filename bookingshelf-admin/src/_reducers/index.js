import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { users } from './users.reducer';
import { alert } from './alert.reducer';
import { company } from './company.reducer';
import { staff } from './staff.reducer';
import { client } from './client.reducer';
import { services } from './services.reducer';
import { menu } from './menu.reducer';
import { calendar } from './calendar.reducer';
import { notification } from './notification.reducer';

const rootReducer = combineReducers({
  authentication,
  users,
  company,
  staff,
  alert,
  client,
  services,
  menu,
  calendar,
  notification
});

export default rootReducer;