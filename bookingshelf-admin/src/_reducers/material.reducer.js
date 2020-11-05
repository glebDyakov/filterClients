import { materialConstants } from '../_constants/material.constants';

const initialState = {
  products: [],
  categories: [],
  brands: [],
  suppliers: [],
  units: [],
  movements: [],
  storeHouses: [],
  // storeHouseProducts: [],
  // expenditureProducts: [],
  adding: false,
  status: 209,
  isLoadingProducts: true,
  isLoadingCategories: true,
  isLoadingBrands: true,
  isLoadingSuppliers: true,
  isLoadingMovements: true,
  // isLoadingMoving1: true,
  // isLoadingMoving2: true,
  isLoadingStoreHouses: true,

};
export function material(state= initialState, action) {
  switch (action.type) {
    case materialConstants.MATERIAL_SUCCESS_TIME:
      return {
        ...state,
        status: 209,
      };

    case materialConstants.GET_PRODUCT_SUCCESS:
      return {
        ...state,
        products: (action.products &&action.products.content) || [],
        finalTotalProductsPages: (action.products && action.products.totalPages) || 0,
        isLoadingProducts: false,
      };
    case materialConstants.TOGGLE_PRODUCT:
      return {
        ...state,
        adding: true,
      };
    case materialConstants.TOGGLE_PRODUCT_SUCCESS:
      return {
        ...state,
        adding: false,
        status: 200,
      };

    case materialConstants.GET_CATEGORIES_SUCCESS:
      return {
        ...state,
        categories: action.categories,
        isLoadingCategories: false,
      };
    case materialConstants.TOGGLE_CATEGORY:
      return {
        ...state,
        adding: true,
      };
    case materialConstants.TOGGLE_CATEGORY_SUCCESS:
      return {
        ...state,
        adding: false,
        status: 200,
      };

    case materialConstants.GET_BRANDS_SUCCESS:
      return {
        ...state,
        brands: action.brands,
        isLoadingBrands: false,
      };

    case materialConstants.TOGGLE_BRAND:
      return {
        ...state,
        adding: true,
      };

    case materialConstants.TOGGLE_BRAND_SUCCESS:
      return {
        ...state,
        adding: false,
        status: 200,
      };

    case materialConstants.GET_SUPPLIERS_SUCCESS:
      return {
        ...state,
        suppliers: action.suppliers,
        isLoadingSuppliers: false,
      };
    case materialConstants.TOGGLE_SUPPLIER:
      return {
        ...state,
        adding: true,
      };
    case materialConstants.TOGGLE_SUPPLIER_SUCCESS:
      return {
        ...state,
        adding: false,
        status: 200,
      };

    case materialConstants.GET_UNITS_SUCCESS:
      return {
        ...state,
        units: action.units,
      };
    case materialConstants.TOGGLE_UNIT:
      return {
        ...state,
        adding: true,
      };
    case materialConstants.TOGGLE_UNIT_SUCCESS:
      return {
        ...state,
        adding: false,
        status: 200,
      };

    case materialConstants.GET_STORE_HOUSES_SUCCESS:
      return {
        ...state,
        storeHouses: action.storeHouses,
        isLoadingStoreHouses: false,
      };

    case materialConstants.TOGGLE_STORE_HOUSE:
      return {
        ...state,
        adding: true,
      };

    case materialConstants.TOGGLE_STORE_HOUSE_SUCCESS:
      return {
        ...state,
        adding: false,
        status: 200,
      };

    case materialConstants.GET_STORE_HOUSES_PRODUCTS_SUCCESS:
      return {
        ...state,
        storeHouseProducts: action.storeHouseProducts,
        isLoadingMoving1: false,
      };
    case materialConstants.STORE_HOUSE_PRODUCT:
      return {
        ...state,
        adding: true,
      };
    case materialConstants.STORE_HOUSE_PRODUCT_SUCCESS:
      return {
        ...state,
        adding: false,
        status: 200,
      };

    case materialConstants.GET_EXPENDITURE_PRODUCTS_SUCCESS:
      return {
        ...state,
        expenditureProducts: action.expenditureProducts,
        isLoadingMoving2: false,
      };

    case materialConstants.GET_MOVEMENTS_SUCCESS:
      return {
        ...state,
        movements: action.movements,
        finalTotalMovementsPages: (action.movements && action.movements.totalPages) || 0,
        isLoadingMovements: false,
      };

    case materialConstants.EXPEND_PRODUCT:
      return {
        ...state,
        adding: true,
      };
    case materialConstants.EXPEND_PRODUCT_SUCCESS:
      return {
        ...state,
        adding: false,
        status: 200,
      };

    case materialConstants.GET_PRODUCT:
      return {
        ...state,
        isLoadingProducts: true,
      };
    case materialConstants.GET_CATEGORIES:
      return {
        ...state,
        isLoadingCategories: true,
      };
    case materialConstants.GET_BRANDS:
      return {
        ...state,
        isLoadingBrands: true,
      };
    case materialConstants.GET_SUPPLIERS:
      return {
        ...state,
        isLoadingSuppliers: true,
      };
    case materialConstants.GET_STORE_HOUSE_PRODUCTS:
      return {
        ...state,
        isLoadingMoving1: true,
      };

    case materialConstants.GET_MOVEMENTS:
      return {
        ...state,
        isLoadingMovements: true,
      };

    case materialConstants.GET_EXPENDITURE_PRODUCTS:
      return {
        ...state,
        isLoadingMoving2: true,
      };
    case materialConstants.GET_STORE_HOUSES:
      return {
        ...state,
        isLoadingStoreHouses: true,
      };

    default:
      return state;
  }
}
