import { menuConstants } from '../_constants';
const initialState = {
    socketFlag: true

}

export function menu(state = initialState, action) {
  switch (action.type) {
    case menuConstants.GET_MENU_SUCCESS:
      return {
          ...state,
        menu: action.menu
      };
    case menuConstants.GET_MENU_LIST_SUCCESS:
        return {
            ...state,
            menuList: [
              {
                  "id":"calendar_menu_id",
                  "url":"/calendar",
                  "icon":"1.svg",
                  "name":"Онлайн-запись",
              },
              {
                  "id":"clients_menu_id",
                  "url":"/clients",
                  "icon":"4.svg",
                  "name":"Клиенты",
              },
              {
                  "id":"staff_menu_id",
                  "url":"/staff",
                  "icon":"5.svg",
                  "name":"Сотрудники",
              },
              {
                  "id":"services_menu_id",
                  "url":"/services",
                  "icon":"6.svg",
                  "name":"Услуги",
              },
              {
                  "id":"email_menu_id",
                  "url":"/email_sms",
                  "icon":"7.svg",
                  "name":"Email и SMS",
              },
              {
                  "id":"analytics_menu_id",
                  "url":"/analytics",
                  "icon":"8.svg",
                  "name":"Аналитика",
              },
              {
                  "id":"booking_menu_id",
                  "url":"/online_booking",
                  "icon":"9.svg",
                  "name":"Записи"
              },
                {
                    "id":"company_menu_id",
                    "url":"/settings",
                    "icon":"10.svg",
                    "name":"Настройки компании",
                },
                {
                    "id":"payments_menu_id",
                    "url":"/payments",
                    "icon":"payment.svg",
                    "name":"Оплатить",
                }]
            };
      case menuConstants.RUN_MENU_SOCKET:
          return {
              ...state,
              socketFlag: true
          };
      case menuConstants.STOP_MENU_SOCKET:
          return {
              ...state,
             socketFlag: false
          };
      default:
          return state
  }
}
