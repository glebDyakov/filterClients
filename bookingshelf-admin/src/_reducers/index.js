import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { appointment } from './appointment.reducer';
import { users } from './users.reducer';
import { alert } from './alert.reducer';
import { company } from './company.reducer';
import { staff } from './staff.reducer';
import { socket } from './socket.reducer';
import { client } from './client.reducer';
import { services } from './services.reducer';
import { menu } from './menu.reducer';
import { calendar } from './calendar.reducer';
import { notification } from './notification.reducer';
import { analitics } from '././analitics.reducer';
import { payments } from '././payments.reducer';


const rootReducer = combineReducers({
  authentication,
  appointment,
  users,
  company,
  staff,
  socket,
  alert,
  client,
  services,
  menu,
  calendar,
  notification,
  analitics,
  payments
});

export default rootReducer;
