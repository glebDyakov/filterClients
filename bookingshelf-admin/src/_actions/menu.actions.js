import { menuConstants } from '../_constants';
import { menuService } from '../_services';

export const menuActions = {
  get,
  getMenu,
  runSocket,
  stopSocket,
};

function get() {
  return (dispatch) => {
    menuService.getAll()
      .then(
        (menu) => dispatch(success(menu)),
      );
  };

  function success(menu) {
    return { type: menuConstants.GET_MENU_SUCCESS, menu };
  }
}

function getMenu() {
  return { type: menuConstants.GET_MENU_LIST_SUCCESS };
} function runSocket() {
  return { type: menuConstants.RUN_MENU_SOCKET };
}
function stopSocket() {
  return { type: menuConstants.STOP_MENU_SOCKET };
}
