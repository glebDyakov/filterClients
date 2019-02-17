import { menuConstants } from '../_constants';

export function menu(state = {}, action) {
  switch (action.type) {
    case menuConstants.GET_MENU_SUCCESS:
      return {
          ...state,
        menu: action.menu
      };
    case menuConstants.GET_MENU_LIST_SUCCESS:
        return {
            ...state,
            menuList: {
              "company_menu_id":{
                "url":"/",
                "icon":"10.svg",
                "name":"Настройки компании",
              },
              "calendar_menu_id":{
                  "url":"/calendar",
                  "icon":"1.svg",
                  "name":"Журнал записи",
              },
              "clients_menu_id":{
                  "url":"/clients",
                  "icon":"4.svg",
                  "name":"Клиенты",
              },
              "staff_menu_id":{
                  "url":"/staff",
                  "icon":"5.svg",
                  "name":"Сотрудники",
              },
              "services_menu_id":{
                  "url":"/services",
                  "icon":"6.svg",
                  "name":"Услуги",
              },
              "email_menu_id":{
                  "url":"/email_sms",
                  "icon":"7.svg",
                  "name":"Email и SMS",
              },
              "analytics_menu_id":{
                  "url":"/analytics",
                  "icon":"8.svg",
                  "name":"Аналитика",
              },
              "booking_menu_id":{
                  "url":"/online_booking",
                  "icon":"9.svg",
                  "name":"Онлайн-запись"
              },
            }
        };
      default:
          return state
  }
}