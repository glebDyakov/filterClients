import { clientConstants } from '../_constants';
import { clientService } from '../_services';
import { alertActions } from './';

export const clientActions = {
  addClient,
  updateClient,
  getClient,
  getActiveClient,
  getActiveClientAppointments,
  deleteClient,
  getClientWithInfo,
  getClientV2,
  downloadFile,
  uploadFile,
  getClientsByTypes
};

function addClient(params) {
  return (dispatch) => {
    dispatch(request(0));
    clientService.addClient(params)
      .then(
        (client) => {
          dispatch(success(client));
          setTimeout(()=>dispatch(successTime(0)), 3000);
        },
        (error) => {
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        },
      );
  };

  function request(id) {
    return { type: clientConstants.CLIENT_REQUEST, id };
  }
  function success(client) {
    return { type: clientConstants.ADD_CLIENT_SUCCESS, client };
  }
  function successTime(client) {
    return { type: clientConstants.CLIENT_SUCCESS_TIME, client };
  }
  function failure(error) {
    return { type: clientConstants.ADD_CLIENT_FAILURE, error };
  }
}

function updateClient(params, blacklisted) {
  return (dispatch) => {
    dispatch(request(0));

    clientService.updateClient(params)
      .then(
        (client) => {
          dispatch(success(client));
          if (blacklisted) {
            dispatch(getClientV2(1, '', true));
          }
          setTimeout(()=>dispatch(successTime(client)), 500);
        },
        (error) => {
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        },
      );
  };

  function request(id) {
    return { type: clientConstants.CLIENT_REQUEST, id };
  }
  function success(client) {
    return { type: clientConstants.UPDATE_CLIENT_SUCCESS, client };
  }
  function successTime(client) {
    return { type: clientConstants.CLIENT_SUCCESS_TIME, client };
  }
  function failure(error) {
    return { type: clientConstants.UPDATE_CLIENT_FAILURE, error };
  }
}

function getClient() {
  return (dispatch) => {
    clientService.getClient()
      .then(
        (client) => dispatch(success(client)),
      );
  };

  function success(client) {
    return { type: clientConstants.GET_CLIENT_SUCCESS, client };
  }
}

function uploadFile(uploadFile) {
  return (dispatch) => {
    clientService.uploadFile(uploadFile)
      .then(
        // client => dispatch(success(client)),
      );
  };
}


function downloadFile() {
  return (dispatch) => {
    clientService.downloadFile()
      .then(
        // client => dispatch(success(client)),
      );
  };
}

function getClientWithInfo() {
  return (dispatch) => {
    dispatch(request());
    clientService.getClientWithInfo()
      .then(
        (client) => dispatch(success(client)),
        () => dispatch(failure('Ошибка при подгрузке клиентов')),
      );
  };

  function request() {
    return { type: clientConstants.GET_CLIENT };
  }
  function success(client) {
    return { type: clientConstants.GET_CLIENT_SUCCESS, client };
  }
  function failure(error) {
    return { type: clientConstants.GET_CLIENT_FAILURE, error };
  }
}

function getClientV2(pageNum, searchValue, blacklisted) {
  return (dispatch) => {
    dispatch(request());
    clientService.getClientV2(pageNum, searchValue, blacklisted)
      .then(
        (client) => dispatch(success(client)),
        () => dispatch(failure('Ошибка при подгрузке клиентов')),
      );
  };

  function request() {
    return { type: clientConstants.GET_CLIENT_V2 };
  }
  function success(client) {
    return { type: clientConstants.GET_CLIENT_V2_SUCCESS, client, blacklisted };
  }
  function failure(error) {
    return { type: clientConstants.GET_CLIENT_V2_FAILURE, error };
  }
}

function getActiveClientAppointments(clientId, pageNum) {
  return (dispatch) => {
    dispatch(request());
    clientService.getActiveClientAppointments(clientId, pageNum)
      .then(
        (activeClientAppointments) => {
          dispatch(success(activeClientAppointments));
        },
        () => dispatch(failure('Ошибка при подгрузке клиентов')),
      );
  };

  function request() {
    return { type: clientConstants.GET_ACTIVE_CLIENT_APPOINTMENTS };
  }
  function success(activeClientAppointments) {
    return { type: clientConstants.GET_ACTIVE_CLIENT_APPOINTMENTS_SUCCESS, activeClientAppointments };
  }
  function failure(error) {
    return { type: clientConstants.GET_ACTIVE_CLIENT_APPOINTMENTS_FAILURE, error };
  }
}

function getActiveClient(clientId) {
  return (dispatch) => {
    dispatch(request());
    clientService.getActiveClient(clientId)
      .then(
        (activeClient) => dispatch(success(activeClient)),
        () => dispatch(failure('Ошибка при подгрузке клиентов')),
      );
  };

  function request() {
    return { type: clientConstants.GET_ACTIVE_CLIENT };
  }
  function success(activeClient) {
    return { type: clientConstants.GET_ACTIVE_CLIENT_SUCCESS, activeClient };
  }
  function failure(error) {
    return { type: clientConstants.GET_ACTIVE_CLIENT_FAILURE, error };
  }
}


function deleteClient(clientId) {
  return (dispatch) => {
    clientService.deleteClient(clientId)
      .then(
        (client) => dispatch(success(clientId)),
        (error) => dispatch(failure(id, error.toString())),
      );
  };

  function success(clientId) {
    return { type: clientConstants.DELETE_CLIENT_SUCCESS, clientId };
  }
  function failure(error) {
    return { type: clientConstants.DELETE_CLIENT_FAILURE, error };
  }
}

function getClientsByTypes() {
  return { type: clientConstants.GET_CLIENTS_TYPES };
}