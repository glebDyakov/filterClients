import { userConstants } from '../_constants';
import { userActions } from '../_actions/user.actions';
import { i18next } from 'i18next';

const user = JSON.parse(localStorage.getItem('user'));
let initialState = {};

if (user && !user.companyTimetables || (user && !user.profile.permissions) ||
  !user || !user.companyName || !user.countryCode || !user.timezoneId
) {
  userActions.logout();
  initialState = {};
}

const menuList = [{
  'company_menu_id': {
    'url': '/settings',
    'icon': '10.svg',
    'name': 'Настройки компании',
    'permission': -1,
  },
  'salary_menu_id': {
    'url': '/salary',
    'icon': '21.svg',
    'name': 'Расчет зарплат',
    'permission': 16,
  },
  'calendar_menu_id': {
    'url': '/calendar',
    'icon': '1.svg',
    'name': 'Журнал записи',
    'permission': 0,
  },
  'clients_menu_id': {
    'url': '/clients',
    'icon': '4.svg',
    'name': 'Клиенты',
    'permission': 4,
  },
  'staff_menu_id': {
    'url': '/staff',
    'icon': '5.svg',
    'name': 'Сотрудники',
    'permission': 10,
  },
  'services_menu_id': {
    'url': '/services',
    'icon': '6.svg',
    'name': 'Услуги',
    'permission': 3,
  },
  'email_menu_id': {
    'url': '/email_sms',
    'icon': '7.svg',
    'name': 'Email и SMS',
    'permission': 7,
  },
  'analytics_menu_id': {
    'url': '/analytics',
    'icon': '8.svg',
    'name': 'Аналитика',
    'permission': 8,
  },
  'booking_menu_id': {
    'url': '/online_booking',
    'icon': '9.svg',
    'name': 'Онлайн-запись',
    'permission': 9,
  },
  'payments_menu_id': {
    'url': '/payments',
    'icon': 'payment.svg',
    'name': 'Оплата',
    'permission': -1,
  },
}];

const times = [
  {
    'companyTimetableId': 8,
    'startTimeMillis': 1544936400000,
    'endTimeMillis': 1544994000000,
  },
  {
    'companyTimetableId': 9,
    'startTimeMillis': 1545022800000,
    'endTimeMillis': 1545080400000,
  },
  {
    'companyTimetableId': 10,
    'startTimeMillis': 1545109200000,
    'endTimeMillis': 1545166800000,
  },
  {
    'companyTimetableId': 11,
    'startTimeMillis': 1545195600000,
    'endTimeMillis': 1545253200000,
  },
  {
    'companyTimetableId': 12,
    'startTimeMillis': 1545282000000,
    'endTimeMillis': 1545339600000,
  },
  {
    'companyTimetableId': 13,
    'startTimeMillis': 1545368400000,
    'endTimeMillis': 1545426000000,
  },
  {
    'companyTimetableId': 14,
    'startTimeMillis': 1545454800000,
    'endTimeMillis': 1545512400000,
  },
];

export function authentication(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        ...state,
        loggingIn: true,
        user: action.payload.user,
        error: -1,
      };
    case userConstants.UPDATE_COMPANY_SUCCESS:
      const companyAllInfo = { ...action.company, menu: action.menu, profile: action.profile };

      // localStorage.setItem('user', JSON.stringify(companyAllInfo))

      return {
        ...state,
        user: companyAllInfo,
        status: 'saved.settings',
      };
    case userConstants.UPDATE_PROFILE_SUCCESS_TIME:
      $('.modal_user_setting').modal('hide');

      return {
        ...state,
        status: 209,
      };

    case userConstants.UPDATE_LANG:
      return {
        ...state,
        i18nLanguage: action.lang,
      };
    case userConstants.UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        status: 208,
        adding: true,
      };
    case userConstants.UPDATE_PROFILE_SUCCESS:
      const profile = state.user;

      const user = {
        ...action.user, password: null,
        newPasswordRepeat: null,
        newPassword: null,
      };

      const unify = { ...profile, profile: user };

      localStorage.setItem('user', JSON.stringify(unify));
      return {
        ...state,
        user: {
          ...state.user,
          profile: user,
        },
        status: 200,
        adding: false,
      };
    case userConstants.UPDATE_PROFILE_FAILURE:

      return {
        ...state,
        errorPass: true,
        status: 406,
        adding: false,
      };
    case userConstants.CHECK_LOGIN_SUCCESS:
    case userConstants.LOGIN_SUCCESS:


      if (!action.payload.user.companyTimetables || action.payload.user.companyTimetables <= 7) {
        action.payload.user.companyTimetables = times;
      }

      const newUserMenu = action.payload.user.menu;

      const user4 = {
        ...action.payload.user, password: '',
        newPasswordRepeat: '',
        newPassword: '',
        menu: newUserMenu,
      };

      localStorage.setItem('menu', JSON.stringify(menuList));
      localStorage.setItem('user', JSON.stringify(user4));

      return {
        ...state,
        loginChecked: true,
        loggedIn: true,
        loggingIn: false,
        user: user4,
        menu: menuList,
        error: -1,
        step: Math.random(),
      };
    case userConstants.FORGOT_PASS_REQUEST:
      return {
        ...state,
        forgotPassLoading: true,
        error: -1,
        status: '',
      };
    case userConstants.FORGOT_PASS_SUCCESS:
      setTimeout(() => {
        // $('.modal_reset_password').modal('hide')
      }, 3000);
      return {
        ...state,
        status: 'reset.email',
        email: action.email,
        error: -1,
        step: Math.random(),
        forgotPassLoading: false,
      };
    case userConstants.FORGOT_PASS_FAILURE:
      return {
        ...state,
        error: JSON.parse(action.error),
        step: Math.random(),
        forgotPassLoading: false,
      };
    case userConstants.CHECK_LOGIN_FAILURE:
      return {
        ...state,
        loginChecked: action.payload.loginChecked,
        loggingIn: false,
      };
    case userConstants.LOGIN_FAILURE:
      return {
        ...state,
        error: JSON.parse(action.payload.error),
        step: Math.random(),
        loggedIn: false,
        loggingIn: false,
      };
    case userConstants.HIDE_MENU: {
      return {
        ...state,
        menu: null,
      };
    }
    case userConstants.LOGOUT:
      localStorage.clear();
      return {
        ...state,
        loggedIn: false,
        isLoading: false,
        menu: null,
        user: {},
      };
    case userConstants.CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        status: null,
      };
    case userConstants.REGISTER_REQUEST:
      return {
        ...state,
        registering: true,
        error: -1,
      };
    case userConstants.REGISTER_SUCCESS:
      return {
        ...state,
        status: 'register.company',
        error: -1,
        step: Math.random(),
        registering: false,
      };
    case userConstants.REGISTER_FAILURE:
      return {
        ...state,
        error: JSON.parse(action.error),
        step: Math.random(),
        registering: false,
      };
    default:
      return state;
  }
}
