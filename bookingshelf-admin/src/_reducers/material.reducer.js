import { materialConstants } from "../_constants/material.constants";

const initialState = {
    categories: [],
    brands: [],
    suppliers: []
}
export function material(state= initialState, action) {
    switch (action.type) {
        case materialConstants.GET_CATEGORIES_SUCCESS:
            return {
                ...state,
                categories: action.categories
            };

        case materialConstants.GET_BRANDS_SUCCESS:
            return {
                ...state,
                brands: action.brands
            };

        case materialConstants.GET_SUPPLIERS_SUCCESS:
            return {
                ...state,
                suppliers: action.suppliers
            };

        default:
            return state
    }
}