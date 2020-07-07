import { materialConstants } from "../_constants/material.constants";

const initialState = {
    products: [],
    categories: [],
    brands: [],
    suppliers: [],
    units: [],
    storeHouses: [],
    storeHouseProducts:[],
    expenditureProducts: [],
    adding: false,
    status: 209
}
export function material(state= initialState, action) {
    switch (action.type) {

        case materialConstants.MATERIAL_SUCCESS_TIME:
            return {
                ...state,
                status: 209
            };

        case materialConstants.GET_PRODUCT_SUCCESS:
            return {
                ...state,
                products: action.products
            };
        case materialConstants.TOGGLE_PRODUCT:
            return {
                ...state,
                adding: true
            };
        case materialConstants.TOGGLE_PRODUCT_SUCCESS:
            return {
                ...state,
                adding: false,
                status: 200
            };

        case materialConstants.GET_CATEGORIES_SUCCESS:
            return {
                ...state,
                categories: action.categories
            };
        case materialConstants.TOGGLE_CATEGORY:
            return {
                ...state,
                adding: true
            };
        case materialConstants.TOGGLE_CATEGORY_SUCCESS:
            return {
                ...state,
                adding: false,
                status: 200
            };

        case materialConstants.GET_BRANDS_SUCCESS:
            return {
                ...state,
                brands: action.brands
            };

        case materialConstants.TOGGLE_BRAND:
            return {
                ...state,
                adding: true
            };

        case materialConstants.TOGGLE_BRAND_SUCCESS:
            return {
                ...state,
                adding: false,
                status: 200
            };

        case materialConstants.GET_SUPPLIERS_SUCCESS:
            return {
                ...state,
                suppliers: action.suppliers
            };
        case materialConstants.TOGGLE_SUPPLIER:
            return {
                ...state,
                adding: true
            };
        case materialConstants.TOGGLE_SUPPLIER_SUCCESS:
            return {
                ...state,
                adding: false,
                status: 200
            };

        case materialConstants.GET_UNITS_SUCCESS:
            return {
                ...state,
                units: action.units
            };
        case materialConstants.TOGGLE_UNIT:
            return {
                ...state,
                adding: true
            };
        case materialConstants.TOGGLE_UNIT_SUCCESS:
            return {
                ...state,
                adding: false,
                status: 200
            };

        case materialConstants.GET_STORE_HOUSES_SUCCESS:
            return {
                ...state,
                storeHouses: action.storeHouses
            };

        case materialConstants.TOGGLE_STORE_HOUSE:
            return {
                ...state,
                adding: true
            };

        case materialConstants.TOGGLE_STORE_HOUSE_SUCCESS:
            return {
                ...state,
                adding: false,
                status: 200
            };

        case materialConstants.GET_STORE_HOUSES_PRODUCTS_SUCCESS:
            return {
                ...state,
                storeHouseProducts: action.storeHouseProducts
            };
        case materialConstants.STORE_HOUSE_PRODUCT:
            return {
                ...state,
                adding: true
            };
        case materialConstants.STORE_HOUSE_PRODUCT_SUCCESS:
            return {
                ...state,
                adding: false,
                status: 200
            };

        case materialConstants.GET_EXPENDITURE_PRODUCTS_SUCCESS:
            return {
                ...state,
                expenditureProducts: action.expenditureProducts
            };


        case materialConstants.EXPEND_PRODUCT:
            return {
                ...state,
                adding: true
            };
        case materialConstants.EXPEND_PRODUCT_SUCCESS:
            return {
                ...state,
                adding: false,
                status: 200
            };

        default:
            return state
    }
}