import {clientConstants} from '../_constants';

export function client(state= { activeClientAppointments: [], client: [] }, action) {
  switch (action.type) {
      case clientConstants.CLIENT_SUCCESS_TIME:
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

      case clientConstants.GET_CLIENT:
      case clientConstants.GET_CLIENT_V2:
          return {
              ...state,
              isLoading: true
          }
      case clientConstants.GET_ACTIVE_CLIENT_SUCCESS:
          return {
              ...state,
              activeClient: action.activeClient
          }
      case clientConstants.GET_ACTIVE_CLIENT_APPOINTMENTS_SUCCESS:
          return {
              ...state,
              activeClientAppointments: action.activeClientAppointments || []
              // activeClientAppointments: action.activeClientAppointments.content || [],
              // clientAppointmentsTotalPages: action.activeClientAppointments.totalPages,
          }
      case clientConstants.GET_CLIENT_SUCCESS:
          return {
              ...state,
              client: action.client || [],
              isLoading: false,
              error: null
          };
      case clientConstants.GET_CLIENT_V2_SUCCESS:
          let clientState = {}
          if (action.blacklisted) {
              clientState.blacklistedClients = action.client.content;
              clientState.blacklistedTotalPages = action.client.totalPages;
          } else {
              clientState.client = action.client.content;
              clientState.totalPages = action.client.totalPages;
          }
          return {
              ...state,
              ...clientState,
              isLoading: false,
              error: null
          };
      case clientConstants.GET_CLIENT_FAILURE:
      case clientConstants.GET_CLIENT_V2_FAILURE:
          return {
              ...state,
              isLoading: false,
              error: action.error
          }
      case clientConstants.ADD_CLIENT_SUCCESS:
          let client=state.client;
          client ? client.push(action.client) : client=[action.client];

          return {
              ...state,
              status: 200,
              client: client || [],
              error: null,
              adding: false
          };
      case clientConstants.ADD_CLIENT_FAILURE:
          return {
              ...state,
              error: JSON.parse(action.error),
              step: Math.random(),
              adding: false,
              // status: 209
          };
      case clientConstants.UPDATE_CLIENT_SUCCESS:
          const clients=state.client;

          if (clients && clients.length) {
              clients.find((item, key) => {
                  if (item.clientId === action.client.clientId) {
                      clients[key] = {
                          ...clients[key],
                          discountPercent: action.client.discountPercent,
                          firstName: action.client.firstName,
                          lastName: action.client.lastName,
                          phone: action.client.phone,
                          email: action.client.email,
                          acceptNewsletter: action.client.acceptNewsletter,
                          city: action.client.city,
                          country: action.client.country,
                          province: action.client.province,
                          blacklisted: action.client.blacklisted
                      };
                  }
              });
          }

          return {
              ...state,
              status: 200,
              client: clients || [],
              adding: false
          };
      case clientConstants.UPDATE_CLIENT_FAILURE:
          return state;
      case clientConstants.DELETE_CLIENT_SUCCESS:
          return {
              ...state,
              client: state.client.filter(client => client.clientId !== action.clientId) || []
          };
      case clientConstants.DELETE_CLIENT_FAILURE:
          return {
              ...state,
              client: action.client || []
          };
      default:
          return state
  }
}