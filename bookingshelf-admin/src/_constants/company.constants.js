export const companyConstants = {
  UPDATE_SAVED: 'UPDATE_SAVED',

  GET_BOOKING_REQUEST: 'GET_BOOKING_REQUEST',
  GET_BOOKING_SUCCESS: 'GET_BOOKING_SUCCESS',
  GET_BOOKING_FAILURE: 'GET_BOOKING_FAILURE',

  CHANGE_THEME: 'CHANGE_THEME',

  ADD_SUBCOMPANY_SUCCESS: 'ADD_SUBCOMPANY_SUCCESS',
  UPDATE_SUBCOMPANY_SUCCESS: 'UPDATE_SUBCOMPANY_SUCCESS',
  SWITCH_SUBCOMPANY_SUCCESS: 'SWITCH_SUBCOMPANY_SUCCESS',

  UPDATE_COMPANY_SETTINGS_REQUEST: 'UPDATE_COMPANY_SETTINGS_REQUEST',
  UPDATE_COMPANY_SETTINGS_SUCCESS: 'UPDATE_COMPANY_SETTINGS_SUCCESS',
  UPDATE_COMPANY_SETTINGS_FAILURE: 'UPDATE_COMPANY_SETTINGS_FAILURE',

  UPDATE_BOOKING_INFO_REQUEST: 'UPDATE_BOOKING_INFO_REQUEST',
  UPDATE_BOOKING_INFO_SUCCESS: 'UPDATE_BOOKING_INFO_SUCCESS',
  UPDATE_BOOKING_INFO_FAILURE: 'UPDATE_BOOKING_INFO_FAILURE',

  ADD_COMPANY_SUCCESS: 'ADD_COMPANY_SUCCESS',
  ADD_COMPANY_FAILURE: 'ADD_COMPANY_FAILURE',

  GET_SUBCOMPANIES_SUCCESS: 'GET_SUBCOMPANIES_SUCCESS',

  GET_COMPANY_SUCCESS: 'GET_COMPANY_SUCCESS',


  GET_NEW_APPOINMENTS_SUCCESS: 'GET_NEW_APPOINMENTS_SUCCESS',

  GET_NEW_APPOINMENTS_MARKER_INCR: 'GET_NEW_APPOINMENTS_MARKER_INCR',
  GET_MOVED_APPOINMENTS_MARKER_INCR: 'GET_MOVED_APPOINMENTS_MARKER_INCR',
  GET_NEW_APPOINMENTS_MARKER_DECR: 'GET_NEW_APPOINMENTS_MARKER_DECR',
};

export const VISITS_STORAGE_DURATIONS = [
  {
    name: 'По умолчанию',
    value: 0,
  },
  {
    name: '2 года',
    value: 365 * 2,
  },
  {
    name: '1 год',
    value: 365,
  },
  {
    name: '6 месяцев',
    value: 183,
  },
  {
    name: '3 месяца',
    value: 91,
  },
  {
    name: '1 месяц',
    value: 30,
  },
  ,
  {
    name: '1 неделя',
    value: 7,
  },
  {
    name: '1 день',
    value: 1,
  },
]
