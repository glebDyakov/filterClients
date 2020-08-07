import React, {Component} from 'react';
import { connect } from 'react-redux';
import StarRatings from 'react-star-ratings';

import {notificationActions, staffActions, materialActions } from '../_actions';
import {AddWorkTime} from "../_components/modals/AddWorkTime";
import {NewStaff} from "../_components/modals/NewStaff";
import {isMobile} from "react-device-detect";

import '../../public/scss/staff.scss'
import '../../public/scss/material.scss'

import moment from "moment";
import {
    AddProduct,
    AddCategory,
    AddProvider,
    AddBrand,
    AddUnit,
    InfoProduct,
    AddStoreHouse,
    ExpenditureProduct, StorehouseProduct
} from "../_components/modals";

import 'react-day-picker/lib/style.css';
import DayPicker, { DateUtils } from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import '../../public/css_admin/date.css'
import {DatePicker} from '../_components/DatePicker'
import {getWeekRange} from '../_helpers/time'
import {access} from "../_helpers/access";
import DragDrop from "../_components/DragDrop";
import Paginator from "../_components/Paginator";
import FeedbackStaff from "../_components/modals/FeedbackStaff";
import EmptyContent from "./EmptyContent";
import Modal from "@trendmicro/react-modal";
import AddButton from "./AddButton";

function getWeekDays(weekStart) {
    const days = [weekStart];
    for (let i = 1; i < 7; i += 1) {
        days.push(
            moment(weekStart).utc().locale('ru')
                .add(i, 'days')
                .toDate()
        );
    }
    return days;
}

class Index extends Component {
    constructor(props) {
        super(props);

        if(!access(13)){
            props.history.push('/denied')
        }

        if(props.match.params.activeTab &&
            props.match.params.activeTab!=='suppliers' &&
            props.match.params.activeTab!=='products' &&
            props.match.params.activeTab!=='brands' &&
            props.match.params.activeTab!=='moving' &&
            props.match.params.activeTab!=='categories' &&
            props.match.params.activeTab!=='units' &&
            props.match.params.activeTab!=='store-houses'
        ){
            props.history.push('/nopage')
        }

        const companyTypeId = this.props.company.settings && this.props.company.settings.companyTypeId;
        if(props.match.params.activeTab==='suppliers') {document.title = "Поставщики | Онлайн-запись";}
        if(props.match.params.activeTab==='brands'){document.title = "Выходные дни | Онлайн-запись"}
        if(props.match.params.activeTab==='categories'){document.title = "Категории | Онлайн-запись"}
        if(props.match.params.activeTab==='moving'){document.title = "Движение товаров | Онлайн-запись"}
        if(props.match.params.activeTab==='units'){document.title = "Еденицы измерения | Онлайн-запись"}
        if(props.match.params.activeTab==='store-houses'){document.title = "Склады | Онлайн-запись"}
        if(!props.match.params.activeTab || props.match.params.activeTab==='products'){document.title = "Товары | Онлайн-запись"}



        this.state = {
            edit: false,
            staff_working: {},
            closedDates: {},
            timetable: {},
            hoverRange: undefined,
            opacity: false,
            selectedDays: getWeekDays(getWeekRange(moment().format()).from),
            emailNew:'',
            emailIsValid: false,
            from: null,
            to: null,
            enteredTo: null,
            activeTab: props.match.params.activeTab?props.match.params.activeTab:'products',
            addWorkTime: false,
            newStaffByMail: false,
            newStaff: false,
            isOpenDropdownMenu: false,

            products: props.material.products,
            defaultProductsList: props.material.categories,
            categories: props.material.categories,
            defaultCategoriesList: props.material.categories,
            brands: props.material.brands,
            defaultBrandsList: props.material.brands,
            suppliers: props.material.suppliers,
            defaultSuppliersList: props.material.suppliers,
            units: props.material.units,
            defaultUnitsList: props.material.units,
            storeHouses: props.material.storeHouses,
            defaultStoreHousesList: props.material.storeHouses,


            storeHouseProducts: props.material.storeHouseProducts,
            defaultStoreHouseProductsList: props.material.storeHouseProducts,
            expenditureProducts: props.material.expenditureProducts,
            defaultExpenditureProductsList: props.material.expenditureProducts,

        };

        this.toggleProvider = this.toggleProvider.bind(this);
        this.toggleProduct = this.toggleProduct.bind(this);
        this.onCloseProducts = this.onCloseProducts.bind(this);
        this.onCloseInfoProducts = this.onCloseInfoProducts.bind(this);
        this.toggleBrand = this.toggleBrand.bind(this);
        this.toggleCategory = this.toggleCategory.bind(this);
        this.onCloseProvider = this.onCloseProvider.bind(this);
        this.onCloseBrand = this.onCloseBrand.bind(this);
        this.onCloseCategory = this.onCloseCategory.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.setTab = this.setTab.bind(this);
        this.queryInitData = this.queryInitData.bind(this);
        this.toggleUnit = this.toggleUnit.bind(this);
        this.onCloseUnit = this.onCloseUnit.bind(this);
        this.toggleStoreHouse = this.toggleStoreHouse.bind(this);
        this.onCloseStoreHouse = this.onCloseStoreHouse.bind(this);
        this.deleteMovement = this.deleteMovement.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSearchMoving = this.handleSearchMoving.bind(this);

        this.toggleExProd = this.toggleExProd.bind(this);
        this.onCloseExProd = this.onCloseExProd.bind(this);
        this.toggleStorehouseProduct = this.toggleStorehouseProduct.bind(this);
        this.onCloseStorehouseProduct = this.onCloseStorehouseProduct.bind(this);
        this.getNavTabs = this.getNavTabs.bind(this);
        this.handleOpenDropdownMenu = this.handleOpenDropdownMenu.bind(this);
        this.getActiveTab = this.getActiveTab.bind(this);
        this.handleOutsideDropdownClick = this.handleOutsideDropdownClick.bind(this);
    }

    componentDidMount() {
        const {selectedDays}=this.state;
        if (this.props.authentication.loginChecked) {
            this.queryInitData()
        }
        this.setState({...this.state,
            timetableFrom: moment(selectedDays[0]).startOf('day').format('x'),
            timetableTo:moment(selectedDays[6]).endOf('day').format('x')
        })
        initializeJs();
    }

    queryInitData() {
        const {selectedDays}=this.state;
        this.props.dispatch(materialActions.getProducts());
        this.props.dispatch(materialActions.getCategories());
        this.props.dispatch(materialActions.getBrands());
        this.props.dispatch(materialActions.getSuppliers());
        this.props.dispatch(materialActions.getStoreHouses());
        this.props.dispatch(materialActions.getUnits());
        this.props.dispatch(materialActions.getStoreHouseProducts());
        this.props.dispatch(materialActions.getExpenditureProducts());
    }

    componentWillReceiveProps(newProps) {
        if (this.props.authentication.loginChecked !== newProps.authentication.loginChecked) {
            this.queryInitData()
        }

        if (JSON.stringify(this.props.company) !== JSON.stringify(newProps.company)) {
            const companyTypeId = newProps.company.settings && newProps.company.settings.companyTypeId;
            // if (JSON.stringify(this.props.company.settings) !== JSON.stringify(newProps.company.settings)){
            //     if (newProps.company.settings && newProps.company.settings.companyName) {
            //         this.props.dispatch(materialActions.getStoreHouses(newProps.company.settings.companyName));
            //     }
            // }
            if(newProps.match.params.activeTab==='staff'){document.title = (companyTypeId === 2 || companyTypeId === 3) ? "Рабочие места | Онлайн-запись" : "Сотрудники | Онлайн-запись"}
        }

        if (this.props.staff.status !== newProps.staff.status) {
            this.setState({
                addWorkTime: newProps.staff.status && newProps.staff.status===209 ? false : this.state.addWorkTime,
            })
        }

        if (this.state.staff_working.staffId && JSON.stringify(newProps.staff.staff) !== (JSON.stringify(this.props.staff.staff))) {
            const staff_working = newProps.staff.staff.find(item => item.staffId === this.state.staff_working.staffId);
            if (staff_working) {
                this.setState({ staff_working })
            }
        }

        if (JSON.stringify(this.props.material.products) !== JSON.stringify(newProps.material.products)) {
            let info_product_working = {}
            if (this.state.info_product_working) {
                info_product_working = newProps.material.products.find(item => item.productId === this.state.info_product_working.productId)

            }
            this.setState({
                products: newProps.material.products,
                defaultProductsList: newProps.material.products,
                info_product_working
            })

        }
        if (JSON.stringify(this.props.material.categories) !== JSON.stringify(newProps.material.categories)) {
            this.setState({
                categories: newProps.material.categories,
                defaultCategoriesList: newProps.material.categories,
            })


        }
        if (JSON.stringify(this.props.material.brands) !== JSON.stringify(newProps.material.brands)) {
            this.setState({
                brands: newProps.material.brands,
                defaultBrandsList: newProps.material.brands,
            })

        }
        if (JSON.stringify(this.props.material.suppliers) !== JSON.stringify(newProps.material.suppliers)) {
            this.setState({
                suppliers: newProps.material.suppliers,
                defaultSuppliersList: newProps.material.suppliers,
            })

        }
        if (JSON.stringify(this.props.material.units) !== JSON.stringify(newProps.material.units)) {
            this.setState({
                units: newProps.material.units,
                defaultUnitsList: newProps.material.units,
            })

        }
        if (JSON.stringify(this.props.material.storeHouses) !== JSON.stringify(newProps.material.storeHouses)) {
            this.setState({
                storeHouses: newProps.material.storeHouses,
                defaultStoreHousesList: newProps.material.storeHouses,
            })

        }

        if (JSON.stringify(this.props.material.storeHouseProducts) !== JSON.stringify(newProps.material.storeHouseProducts)) {
            this.setState({
                storeHouseProducts: newProps.material.storeHouseProducts,
                defaultStoreHouseProductsList: newProps.material.storeHouseProducts,
            })

        }

        if (JSON.stringify(this.props.material.expenditureProducts) !== JSON.stringify(newProps.material.expenditureProducts)) {
            this.setState({
                expenditureProducts: newProps.material.expenditureProducts,
                defaultExpenditureProductsList: newProps.material.expenditureProducts,
            })
        }

    }

    componentDidUpdate(nextProps, nextState, nextContext) {
        initializeJs();

        if (this.state.isOpenDropdownMenu) {
            document.addEventListener('click', this.handleOutsideDropdownClick, false);
        } else {
            document.removeEventListener('click', this.handleOutsideDropdownClick, false);
        }

    }
    handleOutsideDropdownClick() {
        this.setState({ isOpenDropdownMenu: false })
    }


    setTab(tab){
        this.setState({
            activeTab: tab,
            isOpenDropdownMenu: false
        })

        if(tab==='suppliers') {document.title = "Поставщики | Онлайн-запись";}
        if(tab==='brands'){document.title = "Выходные дни | Онлайн-запись"}
        if(tab==='categories'){document.title = "Категории | Онлайн-запись"}
        if(tab==='products'){document.title = "Товары| Онлайн-запись"}
        if(tab==='units'){document.title = "Еденицы измерения | Онлайн-запись"}
        if(tab==='store-houses'){document.title = "Склады | Онлайн-запись"}

        history.pushState(null, '', '/material/'+tab);
    }

    handlePageClick(data) {
        const { selected } = data;
        const currentPage = selected + 1;
        this.props.dispatch(materialActions.getProducts(currentPage));
    };

    toggleProvider(supplier_working) {
        this.setState({ supplier_working, providerOpen: true });
    }

    toggleProduct(product_working) {
        this.setState({ product_working, productOpen: true });
    }

    toggleInfoProduct(info_product_working) {
        this.setState({ info_product_working, infoProductOpen: true });
    }

    toggleBrand(brand_working) {
        this.setState({ brand_working, brandOpen: true });
    }
    toggleUnit(unit_working) {
        this.setState({ unit_working, unitOpen: true });
    }
    toggleStoreHouse(storeHouse_working) {
        this.setState({storeHouse_working, storeHouseOpen: true });
    }

    toggleCategory(category_working) {
        this.setState({ category_working, categoryOpen: true });
    }

    getNavTabs(activeTab) {
        const activeTabMob = this.getActiveTab(activeTab);

        return (

              <div

                   className="row align-items-center content clients mb-0 search-container">

                  <div className="header-tabs d-flex">

                      <a className={"nav-link"+(activeTab==='products'?' active show':'')} data-toggle="tab" href="#tab1" onClick={()=>{this.setTab('products')}}>Товары</a>


                      <a className={"nav-link"+(activeTab==='categories'?' active show':'')} data-toggle="tab" href="#tab2" onClick={()=>this.setTab('categories')}>Категории</a>


                      <a className={"nav-link"+(activeTab==='brands'?' active show':'')} data-toggle="tab" href="#tab3" onClick={()=>this.setTab('brands')}>Бренды</a>

                      {access(-1) &&

                      <a className={"nav-link"+(activeTab==='suppliers'?' active show':'')} data-toggle="tab" href="#tab4" onClick={()=>this.setTab('suppliers')}>Поставщики</a>

                      }

                      <a className={"nav-link"+(activeTab==='moving'?' active show':'')} data-toggle="tab" href="#tab5" onClick={()=>this.setTab('moving')}>Движение товаров</a>

                      {/*<li className="nav-item">*/}
                      {/*    <a className={"nav-link"+(activeTab==='units'?' active show':'')} data-toggle="tab" href="#tab6" onClick={()=>this.setTab('units')}>Еденицы измерения</a>*/}
                      {/*</li>*/}
                      <a className={"nav-link"+(activeTab==='store-houses'?' active show':'')} data-toggle="tab" href="#tab7" onClick={()=>this.setTab('store-houses')}>Склады</a>

                  </div>
                  <div className={"header-tabs-mob" + (this.state.isOpenDropdownMenu ? " opened" : '')}>
                      <p onClick={this.handleOpenDropdownMenu}
                         className="dropdown-button">{activeTabMob}</p>

                      {this.state.isOpenDropdownMenu && (
                        <div ref={this.setWrapperRef} className="dropdown-buttons">

                            <a className={"nav-link"+(activeTab==='products'?' active show':'')} data-toggle="tab" href="#tab1" onClick={()=>{this.setTab('products')}}>Товары</a>


                            <a className={"nav-link"+(activeTab==='categories'?' active show':'')} data-toggle="tab" href="#tab2" onClick={()=>this.setTab('categories')}>Категории</a>


                            <a className={"nav-link"+(activeTab==='brands'?' active show':'')} data-toggle="tab" href="#tab3" onClick={()=>this.setTab('brands')}>Бренды</a>

                            {access(-1) &&

                            <a className={"nav-link"+(activeTab==='suppliers'?' active show':'')} data-toggle="tab" href="#tab4" onClick={()=>this.setTab('suppliers')}>Поставщики</a>

                            }

                            <a className={"nav-link"+(activeTab==='moving'?' active show':'')} data-toggle="tab" href="#tab5" onClick={()=>this.setTab('moving')}>Движение товаров</a>

                            {/*<li className="nav-item">*/}
                            {/*    <a className={"nav-link"+(activeTab==='units'?' active show':'')} data-toggle="tab" href="#tab6" onClick={()=>this.setTab('units')}>Еденицы измерения</a>*/}
                            {/*</li>*/}
                            <a className={"nav-link"+(activeTab==='store-houses'?' active show':'')} data-toggle="tab" href="#tab7" onClick={()=>this.setTab('store-houses')}>Склады</a>



                        </div>
                      )}
                  </div>

              </div>
        )
    }


    getActiveTab(activeTab){
        switch(activeTab){
            case 'products':
                return "Товары";
                break;
            case 'categories':
                return "Категории";
                break;
            case 'brands':
                return "Бренды";
                break;
            case 'suppliers':
                return "Поставщики";
                break;
            case 'moving':
                return "Движение товаров";
                break;
            case 'store-houses':
                return "Склады";
                break;
            default:
                return "Тест";
        }

    }

    handleOpenDropdownMenu() {
        if (this.state.isOpenDropdownMenu) {
            this.setState({isOpenDropdownMenu: false});
        } else {
            this.setState({isOpenDropdownMenu: true});
        }
    }

    render() {
        const { staff, material } = this.props;
        const { product_working, info_product_working, category_working, supplier_working, brand_working, productOpen,
            infoProductOpen, providerOpen, categoryOpen, brandOpen, edit, currentStaff, date,
            editing_object, editWorkingHours, activeTab, unit_working,  unitOpen, storeHouse_working, storeHouseOpen,
            exProdOpen, storehouseProductOpen, ex_product_working, storehouseProduct_working} = this.state;



        const { products, finalTotalProductsPages, categories, suppliers, units, storeHouses } = material;


        const movingArrray = this.state.storeHouseProducts
            .concat(this.state.expenditureProducts)
            .sort((b, a) =>
                (a.expenditureDateMillis? a.expenditureDateMillis: a.deliveryDateMillis) - (b.expenditureDateMillis? b.expenditureDateMillis: b.deliveryDateMillis)
            );

        movingArrray.forEach(item => {

            if (item.target) {
              switch (item.target) {
                case 'SALE':
                  item.targetTranslated = 'Продажа';
                  break;
                case 'INTERNAL':
                  item.targetTranslated = 'Внутреннее списание';
                  break;
                case 'DAMAGED':
                  item.targetTranslated = 'Товар поврежден';
                  break;
                case 'CHANGING':
                  item.targetTranslated = 'Изменения наличия';
                  break;
                case 'LOST':
                  item.targetTranslated = 'Утеря';
                  break;
                case 'OTHER':
                  item.targetTranslated = 'Другое';
                  break;
                default:
                // item.target = '';

              }
            }
        })

        const movingList = (
            <React.Fragment>
                {
                    movingArrray.map(movement => {
                            const activeProduct = products && products.find((item) => item.productId === movement.productId);
                            const activeStorehouse = storeHouses && storeHouses.find((item) => item.storehouseId === movement.storehouseId);
                            const activeUnit = activeProduct && units.find(unit => unit.unitId === activeProduct.unitId)
                        return (
                                <div className="tab-content-list mb-2">
                                    <div className="plus-or-minus-field">
                                        <div className={movement.storehouseProductId ? "plus":"minus"}/>
                                    </div>
                                  <div >
                                    <p><span className="mob-title">Код товара: </span>{activeProduct && activeProduct.productCode}</p>
                                  </div>
                                    <div>
                                            <p className="productName">{activeProduct && activeProduct.productName}</p>
                                    </div>
                                    {/*<div>*/}
                                    {/*        <p style={{ width: "100%" }}><span className="mob-title">Описание: </span>{activeProduct && activeProduct.description}</p>*/}
                                    {/*</div>*/}
                                    {/*<div >*/}
                                    {/*        <p style={{ width: "100%" }}><span className="mob-title">Склад: </span>{activeStorehouse && activeStorehouse.storehouseName}</p>*/}
                                    {/*</div>*/}
                                    <div className={(movement && movement.targetTranslated)? "": "movement-target-empty"}>
                                        <p><span className="mob-title">Причина списания: </span>{movement && movement.targetTranslated}</p>
                                    </div>
                                    <div  className={(movement && movement.retailPrice)? "": "retail-price-empty"}>
                                        <p><span className="mob-title">Цена розн.: </span>{movement && movement.retailPrice}</p>
                                    </div>
                                    {/*<div className={(movement && movement.specialPrice)? "": "retail-price-empty"}>*/}
                                    {/*    <p><span className="mob-title">Цена спец.: </span>{movement && movement.specialPrice}</p>*/}
                                    {/*</div>*/}
                                    {/*<div  className={(movement && movement.supplierPrice)? "": "retail-price-empty"}>*/}
                                    {/*    <p><span className="mob-title">Цена пост.: </span>{movement && movement.supplierPrice}</p>*/}
                                    {/*</div>*/}
                                    <div >
                                        <p><span className="mob-title">Ед. измерения: </span>{activeUnit ? activeUnit.unitName : ''}</p>
                                    </div>
                                    <div >
                                        <p><span className="mob-title">Дата: </span>{movement && moment(movement.deliveryDateMillis?movement.deliveryDateMillis:movement.expenditureDateMillis).format('DD.MM HH:mm')}</p>
                                    </div>
                                    {/*<div >*/}
                                    {/*    <p><span className="mob-title">Время: </span>{movement && moment(movement.deliveryDateMillis?movement.deliveryDateMillis:movement.expenditureDateMillis).format('HH:mm')}</p>*/}
                                    {/*</div>*/}
                                    <div >
                                      <p><span className="mob-title">Остаток: </span>{activeProduct && activeProduct.currentAmount}</p>
                                    </div>
                                    <div className="delete clientEditWrapper">
                                        <a className="clientEdit" onClick={() => (movement.storehouseProductId) ? this.toggleStorehouseProduct(movement) : this.toggleExProd(movement) }/>
                                    </div>
                                    <div className="delete dropdown">
                                        <a className="delete-icon menu-delete-icon" data-toggle="dropdown"
                                           aria-haspopup="true" aria-expanded="false">
                                            <img src={`${process.env.CONTEXT}public/img/delete_new.svg`} alt=""/>
                                        </a>
                                        <div className="dropdown-menu delete-menu p-3">
                                            <button type="button" className="button delete-tab"
                                                    onClick={() => this.deleteMovement(movement)}>Удалить
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    )

                }
            </React.Fragment>
            );


        const navTabs = this.getNavTabs(activeTab);

        return (
            <div className="material"  ref={node => { this.node = node; }}>
                {/*{staff.isLoadingStaffInit && <div className="loader loader-email"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}*/}
                <div className="row retreats content-inner page_staff">
                    <div className="flex-content col-xl-12">

                    </div>
                </div>


                <div className="retreats">
                    <div className="tab-content">
                        <div className={"tab-pane"+(activeTab==='products'?' active':'')} id="tab1">
                            <div className="material-products">
                                {
                                    (this.state.defaultProductsList && this.state.defaultProductsList!=="" &&

                                        <div className="row align-items-center content clients mb-2 search-container">
                                            <div className="search col-8 col-lg-4">
                                                <input type="search" placeholder="Поиск товаров"
                                                       aria-label="Search" ref={input => this.productSearch = input} onChange={() =>
                                                    this.handleSearch('defaultProductsList', 'products', ['productName', 'description'], 'productSearch')}/>
                                                <button className="search-icon" type="submit"/>
                                            </div>
                                            <div className="col-4 col-lg-8 p-0">
                                                {navTabs}
                                            </div>
                                        </div>
                                    )
                                }
                                {!!this.state.products.length ?
                                <div className="title-and-main-info">
                                    <div className="tab-content-list mb-2 title title-product position-sticky">
                                        <div >
                                                <p>Наименование</p>
                                        </div>
                                        <div >
                                            <p>Код товара</p>
                                        </div>
                                        <div >
                                            <p>Категория</p>
                                        </div>
                                        <div>
                                          <p>Номинальный объем</p>
                                        </div>
                                        <div >
                                            <p>Остаток</p>
                                        </div>

                                        <div className="delete clientEditWrapper"></div>
                                        <div className="delete dropdown">

                                            <div className="dropdown-menu delete-menu"></div>
                                        </div>
                                    </div>

                                        <React.Fragment>
                                            <div className="tab-mapped-list">
                                            {this.state.products.map(product => {
                                            const activeCategory = categories && categories.find((item) => item.categoryId === product.categoryId);
                                            const activeUnit = units && units.find((item) => item.unitId === product.unitId);

                                            return (
                                                    <div className="tab-content-list mb-2" >
                                                        <div  className="material-products-details">
                                                            {/*<a onClick={()=>this.openClientStats(product)}>*/}
                                                            <a onClick={() => this.toggleInfoProduct(product)}>
                                                                <p className="productName"><span className="mob-title">Наименование: </span>{product.productName}</p>
                                                            </a>
                                                        </div>
                                                        <div >
                                                            <p><span className="mob-title">Код товара: </span>{product.productCode}</p>
                                                        </div>
                                                        <div >
                                                            <p><span className="mob-title">Категория: </span>{activeCategory && activeCategory.categoryName}</p>
                                                        </div>
                                                        <div>
                                                          <p><span className="mob-title">Номинальный объем: </span>{product && product.nominalAmount} {activeUnit && activeUnit.unitName}</p>
                                                        </div>
                                                        <div >
                                                            <p><span className="mob-title">Остаток: </span>{product.currentAmount}</p>
                                                        </div>
                                                        <div className="delete clientEditWrapper">
                                                            <a className="clientEdit" onClick={() => this.toggleProduct(product)}/>
                                                        </div>
                                                        <div className="delete dropdown">
                                                            <a className="delete-icon menu-delete-icon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                <img src={`${process.env.CONTEXT}public/img/delete_new.svg`} alt=""/>
                                                            </a>
                                                            <div className="dropdown-menu delete-menu p-3">
                                                                <button type="button" className="button delete-tab" onClick={()=>this.deleteProduct(product.productId)}>Удалить</button>

                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        )}
                                        </div>
                                        </React.Fragment>
                                </div>
                                        : ( !this.props.material.isLoadingProducts &&
                                    <EmptyContent
                                        img="2box"
                                        title="Нет товаров"
                                        text="Добавьте первый товар, чтобы начать работу"
                                        buttonText="Новый товар"
                                        buttonClick={this.toggleProduct}
                                    />)
                                    }


                                {!!this.state.products.length && <Paginator
                                  finalTotalPages={finalTotalProductsPages}
                                  onPageChange={this.handlePageClick}
                                />}
                            </div>
                            <AddButton
                                handleOpen={this.toggleProduct}
                                buttonText={"Новый товар"}
                            />
                            {this.props.material.isLoadingProducts && <div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}
                        </div>
                        <div className={"tab-pane staff-list-tab"+(activeTab==='categories'?' active':'')} id="tab2">
                            <div className="material-categories">
                                {
                                    (this.state.categories && this.state.defaultCategoriesList!=="" &&

                                        <div className="row align-items-center content clients mb-2" >
                                            <div className="search col-6 col-lg-4">
                                                <input type="search" placeholder="Поиск категорий"
                                                       aria-label="Search" ref={input => this.categorySearch = input} onChange={() => this.handleSearch('defaultCategoriesList', 'categories', ['categoryName'], 'categorySearch')}/>
                                                <button className="search-icon" type="submit"/>
                                            </div>
                                            <div className="col-6 col-lg-8 p-0">
                                                {navTabs}
                                            </div>
                                        </div>
                                    )
                                }
                                {this.state.categories.length ?
                                <div className="title-and-main-info">
                                    <div className="tab-content-list mb-2 title position-sticky">
                                        <div >
                                            <p>Название категории</p>
                                        </div>
                                        <div className="delete clientEditWrapper"></div>
                                        <div className="delete dropdown">

                                            <div className="dropdown-menu delete-menu"></div>
                                        </div>
                                    </div>


                                    {this.state.categories.map(category => (
                                        <div className="tab-content-list mb-2" >
                                            <div >
                                                <a onClick={()=>this.openClientStats(category)}>
                                                    <p>{category.categoryName}</p>
                                                </a>
                                            </div>

                                            <div className="delete clientEditWrapper">
                                                <a className="clientEdit" onClick={() => this.toggleCategory(category)}/>
                                            </div>
                                            <div className="delete dropdown">
                                                <a className="delete-icon menu-delete-icon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    <img src={`${process.env.CONTEXT}public/img/delete_new.svg`} alt=""/>
                                                </a>
                                                <div className="dropdown-menu delete-menu p-3">
                                                    <button type="button" className="button delete-tab" onClick={()=>this.deleteCategory(category.categoryId)}>Удалить</button>

                                                </div>
                                            </div>
                                        </div>))}
                                        </div>
                                  : ( !this.props.material.isLoadingCategories &&
                                        <EmptyContent
                                            img="box"
                                            title="Нет категорий"
                                            text="Создайте категории и свяжите их с продуктами"
                                            buttonText="Новая категория"
                                            buttonClick={this.toggleCategory}
                                        />
                                    )}


                            </div>
                            <AddButton
                              handleOpen={this.toggleCategory}
                              buttonText={"Новая категория"}
                            />
                            {this.props.material.isLoadingCategories && <div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}
                        </div>
                        <div className={"tab-pane"+(activeTab==='brands'?' active':'')}  id="tab3">
                            <div className="material-categories">
                                {
                                    (this.state.defaultBrandsList && this.state.defaultBrandsList!=="" &&

                                        <div className="row align-items-center content clients mb-2" >
                                            <div className="search col-6 col-lg-4">
                                                <input type="search" placeholder="Поиск брендов"
                                                       aria-label="Search" ref={input => this.brandSearch = input} onChange={() => this.handleSearch('defaultBrandsList', 'brands', ['brandName'], 'brandSearch')}/>
                                                <button className="search-icon" type="submit"/>
                                            </div>

                                            <div className="col-6 col-lg-8 p-0">
                                                {navTabs}
                                            </div>
                                        </div>
                                    )
                                }
                                 <div className="title-and-main-info">
                                     {!!this.state.brands.length &&
                                    <div className="tab-content-list mb-2 title position-sticky">
                                        <div >
                                            <p>Название бренда</p>
                                        </div>
                                        <div className="delete clientEditWrapper"></div>
                                        <div className="delete dropdown">

                                            <div className="dropdown-menu delete-menu"></div>
                                        </div>
                                    </div>}

                                {this.state.brands.length ?
                                    this.state.brands.map(brand => (
                                            <div className="tab-content-list mb-2" >
                                                <div >
                                                    <a onClick={()=>this.openClientStats(brand)}>
                                                        <p>{brand.brandName}</p>
                                                    </a>
                                                </div>

                                                <div className="delete clientEditWrapper">
                                                    <a className="clientEdit" onClick={() => this.toggleBrand(brand)}/>
                                                </div>
                                                <div className="delete dropdown">
                                                    <a className="delete-icon menu-delete-icon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        <img src={`${process.env.CONTEXT}public/img/delete_new.svg`} alt=""/>
                                                    </a>
                                                    <div className="dropdown-menu delete-menu p-3">
                                                        <button type="button" className="button delete-tab" onClick={()=>this.deleteBrand(brand.brandId)}>Удалить</button>

                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    ) : ( !this.props.material.isLoadingBrands &&
                                        <EmptyContent
                                            img="shopping"
                                            title="Нет брендов"
                                            text="Создайте новый бренд и свяжите его с товарами"
                                            buttonText="Новый бренд"
                                            buttonClick={this.toggleBrand}
                                        />
                                    )}
                                </div>
                            </div>
                            <AddButton
                              handleOpen={this.toggleBrand}
                              buttonText={"Новый бренд"}
                            />
                            {this.props.material.isLoadingBrands && <div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}
                        </div>
                        {access(-1) && !staff.error &&
                        <div className={"tab-pane access-tab"+(activeTab==='suppliers'?' active':'')} id="tab4">
                            <div className="access">
                                {
                                    (this.state.defaultSuppliersList && this.state.defaultSuppliersList!=="" &&

                                        <div className="row align-items-center content clients mb-2">
                                            <div className="search col-6 col-lg-4">
                                                <input type="search" placeholder="Поиск поставщика"
                                                       aria-label="Search" ref={input => this.supplierSearch = input} onChange={() =>
                                                    this.handleSearch('defaultSuppliersList', 'suppliers', ['supplierName', 'city', 'webSite', 'description'], 'supplierSearch')}/>
                                                <button className="search-icon" type="submit"/>
                                            </div>

                                            <div className="col-6 col-lg-8 p-0">
                                                {navTabs}
                                            </div>
                                        </div>
                                    )
                                }
                                <div className="material-categories">
                                    <div className="title-and-main-info">
                                        {!!this.state.suppliers.length &&
                                    <div className="tab-content-list mb-2 title title-supplier position-sticky">
                                        <div >
                                            <p>Поставщик</p>
                                        </div>
                                        <div >
                                            <p>Описание</p>
                                        </div>
                                        <div >
                                            <p>Веб-сайт</p>
                                        </div>
                                        <div >
                                            <p>Город</p>
                                        </div>

                                        <div className="delete clientEditWrapper"></div>
                                        <div className="delete dropdown">

                                            <div className="dropdown-menu delete-menu"></div>
                                        </div>
                                    </div>}

                                    {this.state.suppliers.length ?
                                        this.state.suppliers.map(supplier => (
                                            <div className="tab-content-list mb-2" >
                                                <div >
                                                    <a onClick={()=>this.openClientStats(supplier)}>
                                                        <p><span className="mob-title">Поставщик: </span>{supplier.supplierName}</p>
                                                    </a>
                                                </div>
                                                <div >
                                                        <p><span className="mob-title">Описание: </span>{supplier.description}</p>
                                                </div>
                                                <div >
                                                        <p><span className="mob-title">Веб-сайт: </span>{supplier.webSite}</p>
                                                </div>
                                                <div >
                                                        <p><span className="mob-title">Город: </span>{supplier.city}</p>
                                                </div>

                                                <div className="delete clientEditWrapper">
                                                    <a className="clientEdit" onClick={() => this.toggleProvider(supplier)}/>
                                                </div>
                                                <div className="delete dropdown">
                                                    <a className="delete-icon menu-delete-icon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        <img src={`${process.env.CONTEXT}public/img/delete_new.svg`} alt=""/>
                                                    </a>
                                                    <div className="dropdown-menu delete-menu p-3">
                                                        <button type="button" className="button delete-tab" onClick={()=>this.deleteSupplier(supplier.supplierId)}>Удалить</button>

                                                    </div>
                                                </div>
                                            </div>
                                            )
                                        ) : ( !this.props.material.isLoadingSuppliers &&
                                            <EmptyContent
                                                img="car"
                                                title="Нет поставщиков"
                                                text="Добавьте поставщиков, чтобы создавать автоматические ордеры на поставку товаров"
                                                buttonText="Новый поставщик"
                                                buttonClick={this.toggleProvider}
                                            />
                                        )}
                                    </div>
                                </div>
                                <AddButton
                                  handleOpen={this.toggleProvider}
                                  buttonText={"Новый поставщик"}
                                />
                            </div>
                            {this.props.material.isLoadingSuppliers && <div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}
                        </div>
                        }

                        <div className={"tab-pane"+(activeTab==='moving'?' active':'')}  id="tab5">
                            {
                                ((this.state.defaultStoreHouseProductsList && this.state.defaultStoreHouseProductsList!=="")||
                                    (this.state.defaultExpenditureProductsList && this.state.defaultExpenditureProductsList!=="")) &&

                                    <div className="row align-items-center content clients mb-2" >
                                        <div className="search col-6 col-lg-4">
                                            <input type="search" placeholder="Поиск товаров"
                                                   aria-label="Search" ref={input => this.movingSearch = input} onChange={() =>
                                                this.handleSearchMoving()}/>
                                            <button className="search-icon" type="submit"/>
                                        </div>

                                        <div className="col-6 col-lg-8 p-0">
                                            {navTabs}
                                        </div>
                                    </div>

                            }
                            {movingArrray.length ? (
                                <React.Fragment>
                            <div className="title-and-main-info">
                                {!!(movingArrray.length) &&
                                <div className="tab-content-list mb-2 title title-moving position-sticky">
                                    <div className="empty-block">

                                </div>
                                <div >
                                  <p>Код товара</p>
                                </div>
                                <div >
                                    <p>Наименование</p>
                                </div>
                                {/*<div >*/}
                                {/*    <p>Склад</p>*/}
                                {/*</div>*/}
                                <div >
                                    <p>Причина списания</p>
                                </div>
                                <div >
                                    <p>Цена розн.</p>
                                </div>
                                <div >
                                    <p>Единицы измерения</p>
                                </div>
                                <div >
                                    <p>Дата</p>
                                </div>
                                {/*<div >*/}
                                {/*    <p>Время</p>*/}
                                {/*</div>*/}
                                <div >
                                    <p>Остаток</p>
                                </div>

                                    <div className="delete clientEditWrapper"></div>
                                    <div className="delete dropdown">

                                        <div className="dropdown-menu delete-menu"></div>
                                    </div>
                                </div>}
                                {movingList}
                            </div>
                                </React.Fragment>

                            ):
                            (!this.props.material.isLoadingMoving1 && !this.props.material.isLoadingMoving2 && <div>
                                <EmptyContent
                                    img="2box"
                                    title="Нет товаров"
                                    text="Добавьте первый товар, чтобы начать работу"
                                    buttonText="Новый товар"
                                    buttonClick={this.toggleProvider}
                                    hideButton={true}
                                />
                            </div>)}

                            {/*<a className="add"/>*/}
                            {/*<div className="hide buttons-container">*/}
                            {/*    <div className="p-4">*/}
                            {/*        <button type="button" className="button new-holiday">Новый товар</button>*/}
                            {/*    </div>*/}
                            {/*    <div className="arrow"></div>*/}
                            {/*</div>*/}
                            {this.props.material.isLoadingMoving1 && this.props.material.isLoadingMoving2 && <div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}
                        </div>

                        {/*<div className={"tab-pane"+(activeTab==='units'?' active':'')}  id="tab6">*/}
                        {/*    <div className="material-categories">*/}
                        {/*        {*/}
                        {/*            (this.state.defaultUnitsList && this.state.defaultUnitsList!=="" &&*/}

                        {/*                <div className="row align-items-center content clients mb-2" style={{margin: "0 -7px", width: "calc(100% + 7px)"}}>*/}
                        {/*                    <div className="search col-7">*/}
                        {/*                        <input type="search" placeholder="Введите единицу измерения" style={{width: "175%"}}*/}
                        {/*                               aria-label="Search" ref={input => this.unitSearch = input} onChange={() =>*/}
                        {/*                            this.handleSearch('defaultUnitsList', 'units', ['unitName'], 'unitSearch')}/>*/}
                        {/*                        <button className="search-icon" type="submit"/>*/}
                        {/*                    </div>*/}
                        {/*                </div>*/}
                        {/*            )*/}
                        {/*        }*/}

                        {/*        {this.state.units.length ?*/}
                        {/*            this.state.units.map(unit => (*/}
                        {/*                    <div className="tab-content-list mb-2" >*/}
                        {/*                        <div >*/}
                        {/*                            <a onClick={()=>this.openClientStats(unit)}>*/}
                        {/*                                <p>{unit.unitName}</p>*/}
                        {/*                            </a>*/}
                        {/*                        </div>*/}

                        {/*                        <div className="delete clientEditWrapper">*/}
                        {/*                            <a className="clientEdit" onClick={() => this.toggleUnit(unit)}/>*/}
                        {/*                        </div>*/}
                        {/*                        <div className="delete dropdown">*/}
                        {/*                            <div className="clientEyeDel" onClick={()=>this.toggleUnit(unit)}></div>*/}
                        {/*                            <a style={{ marginRight: '24px' }} className="delete-icon menu-delete-icon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">*/}
                        {/*                                <img src={`${process.env.CONTEXT}public/img/delete_new.svg`} alt=""/>*/}
                        {/*                            </a>*/}
                        {/*                            <div className="dropdown-menu delete-menu p-3">*/}
                        {/*                                <button type="button" className="button delete-tab" onClick={()=>this.deleteUnit(unit.unitId)}>Удалить</button>*/}

                        {/*                            </div>*/}
                        {/*                        </div>*/}
                        {/*                    </div>*/}
                        {/*                )*/}
                        {/*            ) : (*/}
                        {/*                <EmptyContent*/}
                        {/*                    img="shopping"*/}
                        {/*                    title="Нет едениц измерения"*/}
                        {/*                    text="Создайте новую еденицу измерения и свяжите его с товарами"*/}
                        {/*                    buttonText="Новая еденица измерения"*/}
                        {/*                    buttonClick={() => this.toggleUnit()}*/}
                        {/*                />*/}
                        {/*            )}*/}
                        {/*    </div>*/}
                        {/*    <a className="add"/>*/}
                        {/*    <div className="hide buttons-container">*/}
                        {/*        <div className="p-4">*/}
                        {/*            <button type="button" className="button new-holiday" onClick={() => this.toggleUnit()}>Новые еденицы измерения</button>*/}
                        {/*        </div>*/}
                        {/*        <div className="arrow"></div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                        <div className={"tab-pane"+(activeTab==='store-houses'?' active':'')}  id="tab7">
                            <div className="material-categories">
                                {
                                    (this.state.defaultStoreHousesList && this.state.defaultStoreHousesList!=="" &&

                                        <div className="row align-items-center content clients mb-2" >
                                            <div className="search col-6 col-lg-4">
                                                <input type="search" placeholder="Поиск складов"
                                                       aria-label="Search" ref={input => this.storeHouseSearch = input} onChange={() =>
                                                    this.handleSearch('defaultStoreHousesList', 'storeHouses', ['storehouseName'], 'storeHouseSearch')}/>
                                                <button className="search-icon" type="submit"/>
                                            </div>

                                            <div className="col-6 col-lg-8 p-0">
                                                {navTabs}
                                            </div>
                                        </div>
                                    )
                                }<div className="title-and-main-info">
                                {!!this.state.storeHouses.length &&
                                <div className="tab-content-list mb-2 title position-sticky">
                                <div >
                                    <p>Название склада</p>
                                </div>
                                <div className="delete clientEditWrapper"></div>
                                <div className="delete dropdown">

                                    <div className="dropdown-menu delete-menu"></div>
                                </div>
                                </div>}
                                {(this.state.storeHouses && this.state.storeHouses.length)?
                                    this.state.storeHouses.map(storeHouse => {
                                        return(
                                                <div className="tab-content-list mb-2" >
                                                    <div >
                                                        <a onClick={()=>this.openClientStats(storeHouse)}>
                                                            <p>{storeHouse.storehouseName}</p>
                                                        </a>
                                                    </div>

                                                    {/*<div className="delete clientEditWrapper">*/}
                                                    {/*    <a className="clientEdit" onClick={() => this.toggleStoreHouse(storeHouse)}/>*/}
                                                    {/*</div>*/}
                                                    <div className="delete dropdown">
                                                        {/*<div className="clientEyeDel" onClick={()=>this.toggleStoreHouse(storeHouse)}></div>*/}
                                                        {/*<a style={{ marginRight: '24px' }} className="delete-icon menu-delete-icon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">*/}
                                                        {/*    <img src={`${process.env.CONTEXT}public/img/delete_new.svg`} alt=""/>*/}
                                                        {/*</a>*/}
                                                        {/*<div className="dropdown-menu delete-menu p-3">*/}
                                                        {/*    <button type="button" className="button delete-tab" onClick={()=>this.deleteStoreHouse(storeHouse.storehouseId)}>Удалить</button>*/}

                                                        {/*</div>*/}
                                                        <a className="clientEdit" onClick={() => this.toggleStoreHouse(storeHouse)}/>

                                                    </div>
                                                </div>
                                            )
                                        }
                                    ) : (!this.props.material.isLoadingStoreHouses &&
                                        <EmptyContent
                                            img="shopping"
                                            title="Нет заданных складов"
                                            // text="Создайте новый склад"
                                            // buttonText="Новый склад"
                                            // buttonClick={() => this.toggleStoreHouse()}
                                            hideButton={true}
                                        />
                                    )}
                            </div>
                                {this.props.material.isLoadingStoreHouses && <div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}
                            </div>
                            {/*<a className="add"/>*/}
                            {/*<div className="hide buttons-container">*/}
                            {/*    <div className="p-4">*/}
                            {/*        <button type="button" className="button new-holiday" onClick={() => this.toggleStoreHouse()}>Новый склад</button>*/}
                            {/*    </div>*/}
                            {/*    <div className="arrow"></div>*/}
                            {/*</div>*/}
                        </div>

                        {/*{staff.isLoadingStaff && <div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}*/}
                        {/*{staff.error  && <div className="errorStaff"><h2 style={{textAlign: "center", marginTop: "50px"}}>Извините, что-то пошло не так</h2></div>}*/}
                    </div>
                </div>
                <FeedbackStaff />
                {productOpen &&
                <AddProduct
                    edit={!!product_working.productId}
                    client_working={product_working}
                    onClose={this.onCloseProducts}
                />
                }
                {infoProductOpen &&
                <InfoProduct
                    edit={!!info_product_working}
                    client_working={info_product_working}
                    onClose={this.onCloseInfoProducts}
                />
                }
                {providerOpen &&
                <AddProvider
                    edit={!!supplier_working.supplierId}
                    client_working={supplier_working}
                    onClose={this.onCloseProvider}
                />
                }
                {brandOpen &&
                <AddBrand
                    edit={!!brand_working.brandId}
                    client_working={brand_working}
                    onClose={this.onCloseBrand}
                />
                }
                {categoryOpen &&
                <AddCategory
                    edit={!!category_working.categoryId}
                    client_working={category_working}
                    onClose={this.onCloseCategory}
                />
                }
                {unitOpen &&
                <AddUnit
                    edit={!!unit_working}
                    client_working={unit_working}
                    onClose={this.onCloseUnit}
                />
                }
                {storeHouseOpen &&
                <AddStoreHouse
                    edit={!!storeHouse_working}
                    client_working={storeHouse_working}
                    onClose={this.onCloseStoreHouse}
                />
                }
                {exProdOpen &&
                <ExpenditureProduct
                    edit={!!ex_product_working}
                    client_working={ex_product_working}
                    onClose={this.onCloseExProd}
                />
                }
                {storehouseProductOpen &&
                <StorehouseProduct
                    edit={!!storehouseProduct_working}
                    client_working={storehouseProduct_working}
                    onClose={this.onCloseStorehouseProduct}
                    suppliers={suppliers}
                />
                }

            </div>
        );
    }

    toggleExProd(ex_product_working) {
        this.setState({ ex_product_working, exProdOpen: true });
    }

    onCloseExProd() {
        this.setState({ exProdOpen: false })
    }

    toggleStorehouseProduct(storehouseProduct_working) {
        this.setState({ storehouseProduct_working, storehouseProductOpen: true });
    }

    onCloseStorehouseProduct() {
        this.setState({ storehouseProductOpen: false })
    }

    handleSearch(defaultKey = 'defaultCategoriesList',key = 'categoriesList', fields = ['categoryName'],searchKey = 'categorySearch') {

        const {[defaultKey]: defaultList } = this.state;

        const searchServicesList = defaultList.filter((item)=>{
            return fields.some((field) =>
            {
                return item[field].toLowerCase().includes(this[searchKey].value.toLowerCase())
            })
        });

        this.setState({
            search: true,
            [key]: searchServicesList
        });

        if(this[searchKey].value===''){
            this.setState({
                search: true,
                [key]: defaultList
            })
        }
    }

    handleSearchMoving(fields = ['productName', 'description', 'productCode']) {
        const { products } = this.props.material;
        const {defaultStoreHouseProductsList: defaultListPlus, defaultExpenditureProductsList:  defaultListMinus} = this.state;

        const searchListPlus = defaultListPlus.filter((item)=>{
            const activeProduct = products && products.find((product) => item.productId === product.productId);
            return fields.some((field) =>
            {
                return String(activeProduct[field]).toLowerCase().includes(this.movingSearch.value.toLowerCase())
            })
        });
        const searchListMinus = defaultListMinus.filter((item)=>{
            const activeProduct = products && products.find((product) => item.productId === product.productId);
            return fields.some((field) =>
            {
                return String(activeProduct[field]).toLowerCase().includes(this.movingSearch.value.toLowerCase())
            })
        });

        this.setState({
            search: true,
            storeHouseProducts: searchListPlus,
            expenditureProducts: searchListMinus
        });

        if(this.movingSearch.value===''){
            this.setState({
                search: true,
                defaultStoreHouseProductsList: defaultListPlus,
                defaultExpenditureProductsList: defaultListMinus
            })
        }
    }
    deleteCategory(id){
        const { dispatch } = this.props;

        dispatch(materialActions.deleteCategory(id));
    }

    deleteBrand(id){
        const { dispatch } = this.props;

        dispatch(materialActions.deleteBrand(id));
    }

    deleteSupplier(id){
        const { dispatch } = this.props;

        dispatch(materialActions.deleteSupplier(id));
    }

    deleteUnit(id){
        const { dispatch } = this.props;

        dispatch(materialActions.deleteUnit(id));
    }

    deleteStoreHouse(id){
        const { dispatch } = this.props;

        dispatch(materialActions.deleteStoreHouse(id));
    }

    deleteProduct(id){
        const { dispatch } = this.props;

        dispatch(materialActions.deleteProduct(id));
    }
    deleteMovement(movement){
        const { dispatch } = this.props;
        let type = !!movement.storehouseProductId;
        let id = type ? movement.storehouseProductId : movement.storehouseProductExpenditureId;
        console.log("type", type);
        dispatch(materialActions.deleteMovement(id, type));

    }
    onCloseProvider() {
        this.setState({ providerOpen: false })
    }
    onCloseProducts() {
        this.setState({ productOpen: false })
    }
    onCloseInfoProducts() {
        this.setState({ infoProductOpen: false })
    }
    onCloseCategory() {
        this.setState({ categoryOpen: false })
    }
    onCloseBrand() {
        this.setState({ brandOpen: false })
    }
    onCloseUnit() {
        this.setState({ unitOpen: false })
    }
    onCloseStoreHouse() {
        this.setState({ storeHouseOpen: false })
    }
}

function mapStateToProps(store) {
    const {staff, company, timetable, authentication, material}=store;

    return {
        staff, company, timetable, authentication, material
    };
}

export default connect(mapStateToProps)(Index);
