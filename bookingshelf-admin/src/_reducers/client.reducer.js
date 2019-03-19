import {calendarConstants, clientConstants} from '../_constants';

export function client(state= {}, action) {
  switch (action.type) {
      case clientConstants.CLIENT_SUCCESS_TIME:
          setTimeout(()=>$('.new-client').modal('hide'), 100)

          return {
              ...state,
              status: 209
          };
      case clientConstants.CLIENT_REQUEST:
          return {
              ...state,
              status: 208,
              adding: true
          };
      case clientConstants.GET_CLIENT_SUCCESS:
          return {
              ...state,
              client: action.client
          };
      case clientConstants.ADD_CLIENT_SUCCESS:
          let client=state.client;
          client ? client.push(action.client) : client=[action.client];

          return {
              ...state,
              status: 200,
              client: client,
              error: null,
              adding: false
          };
      case clientConstants.ADD_CLIENT_FAILURE:
          return {
              ...state,
              error: JSON.parse(action.error),
              step: Math.random(),
              adding: false,
              status: 209
          };
      case clientConstants.UPDATE_CLIENT_SUCCESS:
          const clients=state.client;

          clients.find((item, key)=>{
              if(item.clientId===action.client.clientId){
                  clients[key]={...clients[key], firstName: action.client.firstName, lastName: action.client.lastName, phone: action.client.phone, email: action.client.email, acceptNewsletter: action.client.acceptNewsletter, city: action.client.city, country: action.client.country, province: action.client.province};
              }
          });

          return {
              ...state,
              status: 200,
              client: clients,
              adding: false
          };
      case clientConstants.UPDATE_CLIENT_FAILURE:
          return state;
      case clientConstants.DELETE_CLIENT_SUCCESS:
          return {
              ...state,
              client: state.client.filter(client => client.clientId !== action.clientId)
          };
      case clientConstants.DELETE_CLIENT_FAILURE:
          return {
              ...state,
              client: action.client
          };
      default:
          return state
  }
}