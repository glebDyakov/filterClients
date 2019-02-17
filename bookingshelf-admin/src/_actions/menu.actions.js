import { menuConstants} from '../_constants';
import {menuService} from '../_services';

export const menuActions = {
    get,
    getMenu
};

function get() {
    return dispatch => {
        menuService.getAll()
            .then(
                menu => dispatch(success(menu))
            );
    };

    function success(menu) { return { type: menuConstants.GET_MENU_SUCCESS, menu } }
}

function getMenu() {
        return { type: menuConstants.GET_MENU_LIST_SUCCESS }
}