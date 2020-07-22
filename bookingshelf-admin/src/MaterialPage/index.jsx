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
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.renderSwitch = this.renderSwitch.bind(this);
        this.updateStaff = this.updateStaff.bind(this);
        this.addStaff = this.addStaff.bind(this);
        this.handleClosedDate = this.handleClosedDate.bind(this);
        this.addClosedDate = this.addClosedDate.bind(this);
        this.deleteClosedDate = this.deleteClosedDate.bind(this);
        this.enumerateDaysBetweenDates = this.enumerateDaysBetweenDates.bind(this);
        this.addWorkingHours = this.addWorkingHours.bind(this);
        this.setStaff = this.setStaff.bind(this);
        this.deleteWorkingHours = this.deleteWorkingHours.bind(this);
        this.handleDayChange = this.handleDayChange.bind(this);
        this.handleDayEnter = this.handleDayEnter.bind(this);
        this.handleDayLeave = this.handleDayLeave.bind(this);
        this.handleWeekClick = this.handleWeekClick.bind(this);
        this.showCalendar = this.showCalendar.bind(this);
        this.showPrevWeek = this.showPrevWeek.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.showNextWeek = this.showNextWeek.bind(this);
        this.updateTimetable = this.updateTimetable.bind(this);
        this.deleteStaff = this.deleteStaff.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleAllFeedbackClick = this.handleAllFeedbackClick.bind(this);
        this.addStaffEmail = this.addStaffEmail.bind(this);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.handleDayMouseEnter = this.handleDayMouseEnter.bind(this);
        this.handleResetClick = this.handleResetClick.bind(this);
        this.setTab = this.setTab.bind(this);
        this.handleDrogEnd = this.handleDrogEnd.bind(this);
        this.onClose = this.onClose.bind(this);
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

    }

    setTab(tab){
        this.setState({
            activeTab: tab
        })

        const companyTypeId = this.props.company.settings && this.props.company.settings.companyTypeId;
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

    handleDrogEnd(dragDropItems) {
        const updatedSortOrderStaffs = []
        dragDropItems.forEach((item, i) => {
            updatedSortOrderStaffs.push({
                staffId: item.staffId,
                sortOrder: i + 1
            })
        })
        this.props.dispatch(staffActions.update(JSON.stringify(updatedSortOrderStaffs)))
    }

    handleAllFeedbackClick(activeStaff) {
        $('.feedback-staff').modal('show');
        this.props.dispatch(staffActions.updateFeedbackStaff(activeStaff));
        this.props.dispatch(staffActions.getFeedback(1));
    }

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

    handleClick(id, email, staff = this.props.staff) {
        if(id!=null) {
            const staff_working = staff.staff.find((item) => {return id === item.staffId});

            this.setState({...this.state, edit: true, staff_working: staff_working, newStaff: true});
        } else {
            if(email){
                this.setState({...this.state, edit: false, staff_working: {}, newStaffByMail: true});
            }else{
                this.setState({...this.state, edit: false, staff_working: {}, newStaff: true});
            }
        }
    }

    getItemListName(itemList) {
        const companyTypeId = this.props.company.settings && this.props.company.settings.companyTypeId;
        switch (itemList.permissionCode) {
            case 2:
                return (companyTypeId === 2 || companyTypeId === 3) ? 'Календарь других рабочих мест' : 'Календарь других сотрудников';
            case 10:
                return (companyTypeId === 2 || companyTypeId === 3) ? 'Рабочие места' : 'Сотрудники';
            default:
                return itemList.name
        }
    }

    render() {
        const { staff, company, material } = this.props;
        const { product_working, info_product_working, category_working, supplier_working, brand_working, productOpen, infoProductOpen, providerOpen, categoryOpen, brandOpen,
            emailNew, emailIsValid, feedbackStaff, staff_working, edit, closedDates, timetableFrom, timetableTo, currentStaff, date,
            editing_object, editWorkingHours, hoverRange, selectedDays, opacity, activeTab, addWorkTime, newStaffByMail, newStaff,
            unit_working,  unitOpen, storeHouse_working, storeHouseOpen, exProdOpen, storehouseProductOpen, ex_product_working, storehouseProduct_working} = this.state;



        const { products, finalTotalProductsPages, categories, brands, suppliers, units, storeHouses, storeHouseProducts, expenditureProducts } = material;

        const companyTypeId = company.settings && company.settings.companyTypeId;
        const daysAreSelected = selectedDays.length > 0;

        const modifiers = {
            hoverRange,
            selectedRange: daysAreSelected && {
                from: selectedDays[0],
                to: selectedDays[6],
            },
            hoverRangeStart: hoverRange && hoverRange.from,
            hoverRangeEnd: hoverRange && hoverRange.to,
            selectedRangeStart: daysAreSelected && selectedDays[0],
            selectedRangeEnd: daysAreSelected && selectedDays[6],
        };

        const { from, to, enteredTo } = this.state;
        const modifiersClosed = { start: from, end: enteredTo };
        const disabledDays = { before: this.state.from };
        const selectedDaysClosed = [from, { from, to: enteredTo }];

        const dragDropItems = []
        let staffGroups = [];
        staff.staff && staff.staff.forEach((staff_user, i) => {
            let staffGroupIndex = staff.costaff && staff.costaff.findIndex(staffGroup => staffGroup.some(item => item.staffId === staff_user.staffId));

            let isGroup = staff.costaff && staff.costaff[staffGroupIndex] && staff.costaff[staffGroupIndex].length > 1
            let groupIndex;
            if (isGroup) {
                const localIndex = staffGroups.findIndex(staffGroup => staffGroup.some(staffInGroup => staffInGroup.staffId === staff_user.staffId));

                if (localIndex === -1) {
                    staffGroups.push(staff.costaff[staffGroupIndex]);
                    groupIndex = staffGroups.length - 1
                } else {
                    groupIndex = localIndex;
                }
            }
            dragDropItems.push({
                staffId: staff_user.staffId,
                id: `staff-user-${i}`,
                content: (
                    <div className="tab-content-list" key={i}>
                        {/*{staffGroup.length > i + 1 && <span className="line_connect"/>}*/}
                        <div style={{ display: 'block' }}>
                            <a style={{ paddingBottom: isGroup ? '4px' : '10px' }} key={i} onClick={() => this.handleClick(staff_user.staffId, false)}>
                                                <span className="img-container">
                                                    <img className="rounded-circle"
                                                         src={staff_user.imageBase64 ? "data:image/png;base64," + staff_user.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                                         alt=""/>
                                                </span>
                                <p>{`${staff_user.firstName} ${staff_user.lastName ? staff_user.lastName : ''}`}</p>
                            </a>
                            {isGroup && <p className="staff-group">Группа напарников {groupIndex + 1}</p>}
                        </div>
                        <div>
                            {staff_user.phone}
                        </div>
                        <div>
                            {staff_user.email}
                        </div>
                        <div>
                                                    <span>
                                                        {this.renderSwitch(staff_user.roleId)}
                                                    </span>
                        </div>

                        <div className="delete dropdown">

                            <a className="delete-icon menu-delete-icon"
                               data-toggle="dropdown" aria-haspopup="true"
                               aria-expanded="false">
                                {staff_user.roleId !== 4 &&
                                <img
                                    src={`${process.env.CONTEXT}public/img/delete_new.svg`}
                                    alt=""/>
                                }
                            </a>
                            {staff_user.roleId !== 4 &&
                            <div className="dropdown-menu delete-menu p-3">
                                <button type="button"
                                        className="button delete-tab"
                                        onClick={() => this.deleteStaff(staff_user.staffId)}>Удалить
                                </button>
                            </div>
                            }
                        </div>
                    </div>
                )
            })
        });

        const movingArrray = this.state.storeHouseProducts
            .concat(this.state.expenditureProducts)
            .sort((b, a) =>
                (a.expenditureDateMillis? a.expenditureDateMillis: a.deliveryDateMillis) - (b.expenditureDateMillis? b.expenditureDateMillis: b.deliveryDateMillis)
            );

        movingArrray.forEach(item => {

            if (item.target) {
                switch (item.target) {
                    case 'INTERNAL':
                        item.targetTranslated = 'Внутренняя ошибка';
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
                                <div className="tab-content-list mb-2" style={{ position: "relative", textAlign: "center" }}>
                                    <div style={{ position: "relative", width: "80px" }}>
                                        <p style={{ width: "100%", paddingLeft: "10px" }}>{movement.storehouseProductId ? <span style={{color:"#44FF00 ", fontSize: "2em"}}> + </span> : <span style={{color:"#FF0000 ", fontSize: "2em"}}> - </span>}</p>
                                    </div>
                                  <div style={{ position: "relative" }}>
                                    <p><span className="mob-title">Код товара: </span>{activeProduct && activeProduct.productCode}</p>
                                  </div>
                                    <div style={{ position: "relative" }}>
                                        {/*<a onClick={() => this.toggleInfoProduct(activeProduct)}>*/}
                                            <p style={{ width: "100%" }}><span className="mob-title">Название: </span>{activeProduct && activeProduct.productName}</p>
                                        {/*</a>*/}
                                    </div>
                                    {/*<div style={{ position: "relative" }}>*/}
                                    {/*        <p style={{ width: "100%" }}><span className="mob-title">Описание: </span>{activeProduct && activeProduct.description}</p>*/}
                                    {/*</div>*/}
                                    {/*<div style={{ position: "relative" }}>*/}
                                    {/*        <p style={{ width: "100%" }}><span className="mob-title">Склад: </span>{activeStorehouse && activeStorehouse.storehouseName}</p>*/}
                                    {/*</div>*/}
                                    <div style={{ position: "relative" }} className={(movement && movement.targetTranslated)? "": "movement-target-empty"}>
                                        <p><span className="mob-title">Причина списания: </span>{movement && movement.targetTranslated}</p>
                                    </div>
                                    <div style={{ position: "relative" }} className={(movement && movement.retailPrice)? "": "retail-price-empty"}>
                                        <p><span className="mob-title">Цена розн.: </span>{movement && movement.retailPrice}</p>
                                    </div>
                                    <div style={{ position: "relative" }}>
                                        <p><span className="mob-title">Ед. измерения: </span>{activeUnit ? activeUnit.unitName : ''}</p>
                                    </div>
                                    <div style={{ position: "relative" }}>
                                        <p><span className="mob-title">Дата: </span>{movement && moment(movement.deliveryDateMillis?movement.deliveryDateMillis:movement.expenditureDateMillis).format('DD.MM')}</p>
                                    </div>
                                    <div style={{ position: "relative" }}>
                                        <p><span className="mob-title">Время: </span>{movement && moment(movement.deliveryDateMillis?movement.deliveryDateMillis:movement.expenditureDateMillis).format('HH:mm')}</p>
                                    </div>
                                    <div style={{ position: "relative" }}>
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



        return (
            <div className="staff material"  ref={node => { this.node = node; }}>
                {/*{staff.isLoadingStaffInit && <div className="loader loader-email"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}*/}
                <div className="row retreats content-inner page_staff">
                    <div className="flex-content col-xl-12">
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <a className={"nav-link"+(activeTab==='products'?' active show':'')} data-toggle="tab" href="#tab1" onClick={()=>{this.setTab('products')}}>Товары</a>
                            </li>
                            <li className="nav-item">
                                <a className={"nav-link"+(activeTab==='categories'?' active show':'')} data-toggle="tab" href="#tab2" onClick={()=>this.setTab('categories')}>Категории</a>
                            </li>
                            <li className="nav-item">
                                <a className={"nav-link"+(activeTab==='brands'?' active show':'')} data-toggle="tab" href="#tab3" onClick={()=>this.setTab('brands')}>Бренды</a>
                            </li>
                            {access(-1) &&
                            <li className="nav-item">
                                <a className={"nav-link"+(activeTab==='suppliers'?' active show':'')} data-toggle="tab" href="#tab4" onClick={()=>this.setTab('suppliers')}>Поставщики</a>
                            </li>
                            }
                            <li className="nav-item">
                                <a className={"nav-link"+(activeTab==='moving'?' active show':'')} data-toggle="tab" href="#tab5" onClick={()=>this.setTab('moving')}>Движение товаров</a>
                            </li>
                            {/*<li className="nav-item">*/}
                            {/*    <a className={"nav-link"+(activeTab==='units'?' active show':'')} data-toggle="tab" href="#tab6" onClick={()=>this.setTab('units')}>Еденицы измерения</a>*/}
                            {/*</li>*/}
                            <li className="nav-item">
                                <a className={"nav-link"+(activeTab==='store-houses'?' active show':'')} data-toggle="tab" href="#tab7" onClick={()=>this.setTab('store-houses')}>Склады</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="retreats">
                    <div style={{ overflowX: 'visible'}} className="tab-content">
                        <div style={{ height: '100%', maxHeight: '65vh' }} className={"tab-pane"+(activeTab==='products'?' active':'')} id="tab1">
                            <div className="material-products">
                                {
                                    (this.state.defaultProductsList && this.state.defaultProductsList!=="" &&

                                        <div className="row align-items-center content clients mb-2" style={{margin: "0 -7px", width: "calc(100% + 7px)"}}>
                                            <div className="search col-7">
                                                <input type="search" placeholder="Введите название товара или его описание" style={{width: "175%"}}
                                                       aria-label="Search" ref={input => this.productSearch = input} onChange={() =>
                                                    this.handleSearch('defaultProductsList', 'products', ['productName', 'description'], 'productSearch')}/>
                                                <button className="search-icon" type="submit"/>
                                            </div>
                                        </div>
                                    )
                                }

                                <div className="tab-content-list mb-2 title" style={{position: "relative", height: "50px"}}>
                                    <div style={{position: "relative"}}>
                                            <p>Наименование</p>
                                    </div>
                                    <div style={{position: "relative"}}>
                                        <p>Код товара</p>
                                    </div>
                                    <div style={{position: "relative"}}>
                                        <p>Категория</p>
                                    </div>
                                    <div style={{position: "relative"}}>
                                        <p>Остаток</p>
                                    </div>

                                    <div className="delete clientEditWrapper"></div>
                                    <div className="delete dropdown">

                                        <div className="dropdown-menu delete-menu"></div>
                                    </div>
                                </div>
                                {this.state.products.length ?
                                    <React.Fragment>
                                        {this.state.products.map(product => {
                                        const activeCategory = categories && categories.find((item) => item.categoryId === product.categoryId);

                                        return (
                                                <div className="tab-content-list mb-2" style={{position: "relative"}}>
                                                    <div style={{position: "relative"}} className="material-products-details">
                                                        {/*<a onClick={()=>this.openClientStats(product)}>*/}
                                                        <a onClick={() => this.toggleInfoProduct(product)}>
                                                            <p><span className="mob-title">Наименование: </span>{product.productName}</p>
                                                        </a>
                                                    </div>
                                                    <div style={{position: "relative"}}>
                                                        <p><span className="mob-title">Код товара: </span>{product.productCode}</p>
                                                    </div>
                                                    <div style={{position: "relative"}}>
                                                        <p><span className="mob-title">Категория: </span>{activeCategory && activeCategory.categoryName}</p>
                                                    </div>
                                                    <div style={{position: "relative"}}>
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
                                    <Paginator
                                        finalTotalPages={finalTotalProductsPages}
                                        onPageChange={this.handlePageClick}
                                    />
                                    </React.Fragment>
                                    : ( !this.props.material.isLoadingProducts &&
                                <EmptyContent
                                    img="2box"
                                    title="Нет товаров"
                                    text="Добавьте первый товар, чтобы начать работу"
                                    buttonText="Новый товар"
                                    buttonClick={() => this.toggleProduct()}
                                />)}
                            </div>
                            <a className="add"/>
                            <div className="hide buttons-container">
                                <div className="p-4">
                                    <button type="button" className="button new-holiday" onClick={() => this.toggleProduct()}>Новый товар</button>
                                </div>
                                <div className="arrow"></div>
                            </div>
                            {this.props.material.isLoadingProducts && <div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}
                        </div>
                        <div className={"tab-pane staff-list-tab"+(activeTab==='categories'?' active':'')} id="tab2">
                            <div className="material-categories">
                                {
                                    (this.state.defaultCategoriesList && this.state.defaultCategoriesList!=="" &&

                                        <div className="row align-items-center content clients mb-2" style={{margin: "0 -7px", width: "calc(100% + 14px)"}}>
                                            <div className="search col-7">
                                                <input type="search" placeholder="Введите название категории" style={{width: "175%"}}
                                                       aria-label="Search" ref={input => this.categorySearch = input} onChange={() => this.handleSearch('defaultCategoriesList', 'categories', ['categoryName'], 'categorySearch')}/>
                                                <button className="search-icon" type="submit"/>
                                            </div>
                                        </div>
                                    )
                                }

                                {this.state.categories.length ?
                                    this.state.categories.map(category => (
                                        <div className="tab-content-list mb-2" style={{position: "relative"}}>
                                            <div style={{position: "relative"}}>
                                                <a onClick={()=>this.openClientStats(category)}>
                                                    <p>{category.categoryName}</p>
                                                </a>
                                            </div>

                                            <div className="delete clientEditWrapper">
                                                <a className="clientEdit" onClick={() => this.toggleCategory(category)}/>
                                            </div>
                                            <div className="delete dropdown">
                                                <div className="clientEyeDel" onClick={()=>this.toggleCategory(category)}></div>
                                                <a style={{ marginRight: '24px' }} className="delete-icon menu-delete-icon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    <img src={`${process.env.CONTEXT}public/img/delete_new.svg`} alt=""/>
                                                </a>
                                                <div className="dropdown-menu delete-menu p-3">
                                                    <button type="button" className="button delete-tab" onClick={()=>this.deleteCategory(category.categoryId)}>Удалить</button>

                                                </div>
                                            </div>
                                        </div>
                                        )
                                    ) : ( !this.props.material.isLoadingCategories &&
                                        <EmptyContent
                                            img="box"
                                            title="Нет категорий"
                                            text="Создайте категории и свяжите их с продуктами"
                                            buttonText="Новая категория"
                                            buttonClick={() => this.toggleCategory()}
                                        />
                                    )}

                            </div>
                            <a className="add"/>
                            <div className="hide buttons-container">
                                <div className="p-4">
                                    <button type="button" className="button new-holiday" onClick={() => this.toggleCategory()}>Новая категория</button>
                                </div>
                                <div className="arrow"></div>
                            </div>
                            {this.props.material.isLoadingCategories && <div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}
                        </div>
                        <div className={"tab-pane"+(activeTab==='brands'?' active':'')}  id="tab3">
                            <div className="material-categories">
                                {
                                    (this.state.defaultBrandsList && this.state.defaultBrandsList!=="" &&

                                        <div className="row align-items-center content clients mb-2" style={{margin: "0 -7px", width: "calc(100% + 14px)"}}>
                                            <div className="search col-7">
                                                <input type="search" placeholder="Введите бренд" style={{width: "175%"}}
                                                       aria-label="Search" ref={input => this.brandSearch = input} onChange={() => this.handleSearch('defaultBrandsList', 'brands', ['brandName'], 'brandSearch')}/>
                                                <button className="search-icon" type="submit"/>
                                            </div>
                                        </div>
                                    )
                                }

                                {this.state.brands.length ?
                                    this.state.brands.map(brand => (
                                            <div className="tab-content-list mb-2" style={{position: "relative"}}>
                                                <div style={{position: "relative"}}>
                                                    <a onClick={()=>this.openClientStats(brand)}>
                                                        <p>{brand.brandName}</p>
                                                    </a>
                                                </div>

                                                <div className="delete clientEditWrapper">
                                                    <a className="clientEdit" onClick={() => this.toggleBrand(brand)}/>
                                                </div>
                                                <div className="delete dropdown">
                                                    <div className="clientEyeDel" onClick={()=>this.toggleBrand(brand)}></div>
                                                    <a style={{ marginRight: '24px' }} className="delete-icon menu-delete-icon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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
                                            buttonClick={() => this.toggleBrand()}
                                        />
                                    )}
                            </div>
                            <a className="add"/>
                            <div className="hide buttons-container">
                                <div className="p-4">
                                    <button type="button" className="button new-holiday" onClick={() => this.toggleBrand()}>Новый бренд</button>
                                </div>
                                <div className="arrow"></div>
                            </div>
                            {this.props.material.isLoadingBrands && <div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}
                        </div>
                        {access(-1) && !staff.error &&
                        <div className={"tab-pane access-tab"+(activeTab==='suppliers'?' active':'')} id="tab4">
                            <div className="access">
                                {
                                    (this.state.defaultSuppliersList && this.state.defaultSuppliersList!=="" &&

                                        <div className="row align-items-center content clients mb-2" style={{margin: "0 -7px", width: "calc(100% + 7px)"}}>
                                            <div className="search col-7">
                                                <input type="search" placeholder="Введите поставщика, описание, вебсайт или город " style={{width: "175%"}}
                                                       aria-label="Search" ref={input => this.supplierSearch = input} onChange={() =>
                                                    this.handleSearch('defaultSuppliersList', 'suppliers', ['supplierName', 'city', 'webSite', 'description'], 'supplierSearch')}/>
                                                <button className="search-icon" type="submit"/>
                                            </div>
                                        </div>
                                    )
                                }
                                <div className="material-categories">
                                    <div className="tab-content-list mb-2 title" style={{position: "relative", height: "40px", textAlign: "center"}}>
                                        <div style={{position: "relative"}}>
                                            <p>Поставщик</p>
                                        </div>
                                        <div style={{position: "relative"}}>
                                            <p>Описание</p>
                                        </div>
                                        <div style={{position: "relative"}}>
                                            <p>Веб-сайт</p>
                                        </div>
                                        <div style={{position: "relative"}}>
                                            <p>Город</p>
                                        </div>

                                        <div className="delete clientEditWrapper"></div>
                                        <div className="delete dropdown">

                                            <div className="dropdown-menu delete-menu"></div>
                                        </div>
                                    </div>

                                    {this.state.suppliers.length ?
                                        this.state.suppliers.map(supplier => (
                                            <div className="tab-content-list mb-2" style={{position: "relative"}}>
                                                <div style={{position: "relative"}}>
                                                    <a onClick={()=>this.openClientStats(supplier)}>
                                                        <p><span className="mob-title">Поставщик: </span>{supplier.supplierName}</p>
                                                    </a>
                                                </div>
                                                <div style={{position: "relative"}}>
                                                        <p><span className="mob-title">Описание: </span>{supplier.description}</p>
                                                </div>
                                                <div style={{position: "relative"}}>
                                                        <p><span className="mob-title">Веб-сайт: </span>{supplier.webSite}</p>
                                                </div>
                                                <div style={{position: "relative"}}>
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
                                                buttonClick={() => this.toggleProvider()}
                                            />
                                        )}
                                </div>
                                <a className="add"/>
                                <div className="hide buttons-container">
                                    <div className="p-4">
                                        <button onClick={() => this.toggleProvider()} type="button" className="button new-holiday">Новый поставщик</button>
                                    </div>
                                    <div className="arrow"></div>
                                </div>
                            </div>
                            {this.props.material.isLoadingSuppliers && <div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}
                        </div>
                        }

                        <div className={"tab-pane"+(activeTab==='moving'?' active':'')}  id="tab5">
                            {
                                ((this.state.defaultStoreHouseProductsList && this.state.defaultStoreHouseProductsList!=="")||
                                    (this.state.defaultExpenditureProductsList && this.state.defaultExpenditureProductsList!=="")) &&

                                    <div className="row align-items-center content clients mb-2" style={{margin: "0 -7px", width: "calc(100% + 7px)"}}>
                                        <div className="search col-7">
                                            <input type="search" placeholder="Введите название товара, код или его описание" style={{width: "175%"}}
                                                   aria-label="Search" ref={input => this.movingSearch = input} onChange={() =>
                                                this.handleSearchMoving()}/>
                                            <button className="search-icon" type="submit"/>
                                        </div>
                                    </div>

                            }

                            {1 ? (
                                <React.Fragment>
                            <div className="tab-content-list mb-2 title" style={{position: "relative", }}>
                                <div style={{width:"80px"}}>

                                </div>
                                <div style={{position: "relative"}}>
                                  <p>Код товара</p>
                                </div>
                                <div style={{position: "relative"}}>
                                    <p>Наименование</p>
                                </div>
                                {/*<div style={{position: "relative"}}>*/}
                                {/*    <p>Склад</p>*/}
                                {/*</div>*/}
                                <div style={{position: "relative"}}>
                                    <p>Причина списания</p>
                                </div>
                                <div style={{position: "relative"}}>
                                    <p>Цена розн.</p>
                                </div>
                                <div style={{position: "relative"}}>
                                    <p>Единицы измерения</p>
                                </div>
                                <div style={{position: "relative"}}>
                                    <p>Дата</p>
                                </div>
                                <div style={{position: "relative"}}>
                                    <p>Время</p>
                                </div>
                                <div style={{position: "relative"}}>
                                    <p>Остаток</p>
                                </div>

                                <div className="delete clientEditWrapper"></div>
                                <div className="delete dropdown">

                                    <div className="dropdown-menu delete-menu"></div>
                                </div>
                            </div>
                                {movingList}
                                </React.Fragment>

                            ):
                            (!this.props.material.isLoadingMoving1 && !this.props.material.isLoadingMoving2 && <div>
                                <EmptyContent
                                    img="2box"
                                    title="Нет товаров"
                                    text="Добавьте первый товар, чтобы начать работу"
                                    buttonText="Новый товар"
                                    buttonClick={() => this.toggleProvider()}
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
                        {/*                    <div className="tab-content-list mb-2" style={{position: "relative"}}>*/}
                        {/*                        <div style={{position: "relative"}}>*/}
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

                                        <div className="row align-items-center content clients mb-2" style={{margin: "0 -7px", width: "calc(100% + 7px)"}}>
                                            <div className="search col-7">
                                                <input type="search" placeholder="Введите название склада" style={{width: "175%"}}
                                                       aria-label="Search" ref={input => this.storeHouseSearch = input} onChange={() =>
                                                    this.handleSearch('defaultStoreHousesList', 'storeHouses', ['storehouseName'], 'storeHouseSearch')}/>
                                                <button className="search-icon" type="submit"/>
                                            </div>
                                        </div>
                                    )
                                }
                                {(this.state.storeHouses && this.state.storeHouses.length)?
                                    this.state.storeHouses.map(storeHouse => {
                                        return(
                                                <div className="tab-content-list mb-2" style={{position: "relative"}}>
                                                    <div style={{position: "relative"}}>
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

                {addWorkTime &&
                <AddWorkTime
                    addWorkingHours={this.addWorkingHours}
                    deleteWorkingHours={this.deleteWorkingHours}
                    currentStaff={currentStaff}
                    date={date}
                    editWorkingHours={editWorkingHours}
                    editing_object={editing_object}
                    onClose={this.onClose}
                />
                }
                {newStaff &&
                <NewStaff
                    staff={staff}
                    staff_working={staff_working}
                    edit={edit}
                    updateStaff={this.updateStaff}
                    addStaff={this.addStaff}
                    onClose={this.onClose}
                />
                }
                {productOpen &&
                <AddProduct
                    edit={!!product_working}
                    client_working={product_working}
                    addStaffEmail={this.addStaffEmail}
                    onClose={this.onCloseProducts}
                />
                }
                {infoProductOpen &&
                <InfoProduct
                    edit={!!info_product_working}
                    client_working={info_product_working}
                    addStaffEmail={this.addStaffEmail}
                    onClose={this.onCloseInfoProducts}
                />
                }
                {providerOpen &&
                <AddProvider
                    edit={!!supplier_working}
                    client_working={supplier_working}
                    addStaffEmail={this.addStaffEmail}
                    onClose={this.onCloseProvider}
                />
                }
                {brandOpen &&
                <AddBrand
                    edit={!!brand_working}
                    client_working={brand_working}
                    addStaffEmail={this.addStaffEmail}
                    onClose={this.onCloseBrand}
                />
                }
                {categoryOpen &&
                <AddCategory
                    edit={!!category_working}
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


    handleChangeEmail(e) {
        const { value } = e.target;

        this.setState({ ...this.state, emailNew: value });
    }

    setStaff(staff){
        this.setState({...this.state, currentStaff:staff.staff})
    }

    enumerateDaysBetweenDates(startDate, endDate) {
        let dates = [],
            days = 7;

        for(let i=1; i<=days; i++){
            if(i===1){
                dates.push(moment(parseInt(startDate)).format('x'))
            }else{
                dates.push(moment(parseInt(dates[i-2])).add(1,'days').format('x'))
            }
        }

        return dates;
    };

    handleSubmit(e) {
        const { firstName, lastName, email, phone, roleId, workStartMilis, workEndMilis, onlineBooking } = this.props.staff;
        const { dispatch } = this.props;

        e.preventDefault();

        this.setState({ submitted: true });

        if (firstName || lastName || email || phone) {
            let params = JSON.stringify({ firstName, lastName, email, phone, roleId, workStartMilis, workEndMilis, onlineBooking });
            dispatch(staffActions.add(params));
        }
    }

    addStaffEmail (emailNew){
        const { dispatch } = this.props;

        dispatch(staffActions.addUSerByEmail(JSON.stringify({'email': emailNew})));


    }

    handleClick(id, email, staff = this.props.staff) {
        if(id!=null) {
            const staff_working = staff.staff.find((item) => {return id === item.staffId});

            this.setState({...this.state, edit: true, staff_working: staff_working, newStaff: true});
        } else {
            if(email){
                this.setState({...this.state, edit: false, staff_working: {}, newStaffByMail: true});
            }else{
                this.setState({...this.state, edit: false, staff_working: {}, newStaff: true});
            }
        }
    }

    handleClosedDate(e) {
        const { name, value } = e.target;
        const { closedDates } = this.state;


        this.setState({ closedDates: {...closedDates, [name]: value   }});
    }

    renderSwitch(param) {
        switch (param) {
            case 4:   return "Владелец";
            case 3: return "Админ";
            case 2:  return "Средний доступ";
            default:      return "Низкий доступ";
        }
    };

    updateStaff(staff){
        const { dispatch } = this.props;

        const body = JSON.parse(JSON.stringify(staff));
        body.phone = body.phone && (body.phone.startsWith('+') ? body.phone : `+${body.phone}`);

        dispatch(staffActions.update(JSON.stringify([body]), staff.staffId));
    };

    addStaff(staff){
        const { dispatch } = this.props;

        const body = JSON.parse(JSON.stringify(staff));
        body.phone = body.phone && (body.phone.startsWith('+') ? body.phone : `+${body.phone}`);
        dispatch(staffActions.add(JSON.stringify(body)));
    };

    addWorkingHours(timing, id, edit){
        const { dispatch } = this.props;
        const { editWorkingHours } = this.state;


        !editWorkingHours ?
            dispatch(staffActions.addWorkingHours(JSON.stringify(timing), id))
            : dispatch(staffActions.updateWorkingHours(JSON.stringify(timing), id))
    };

    deleteWorkingHours(id, startDay, endDay, staffTimetableId){
        const { dispatch } = this.props;
        const { timetableFrom, timetableTo } = this.state;

        dispatch(staffActions.deleteWorkingHours(id, startDay, endDay, timetableFrom, timetableTo, staffTimetableId))
    }

    addClosedDate(){
        const { dispatch } = this.props;
        const { closedDates, from, to } = this.state;

        closedDates.startDateMillis=moment(from).format('x');
        closedDates.endDateMillis=moment(to===null?moment(from):to).format('x');

        dispatch(staffActions.addClosedDates(JSON.stringify(closedDates)));

        this.setState({
            ...this.state,
            from: null,
            to: null,
            enteredTo: null,
            closedDates: {
                description: ''
            }
        });
    };

    toggleChange (roleCode, permissionCode) {
        const { staff } = this.props;
        const { dispatch } = this.props;

        const access = staff.access;
        const keyCurrent=[];

        access.find((item, key)=>{
            if(item.roleCode===roleCode){

                item.permissions.find((item2, key2)=>{
                    if(item2.permissionCode===permissionCode){
                        keyCurrent[0]=key2;
                        keyCurrent[1]='delete';
                    }
                });

                if(keyCurrent[1]!=='delete') {
                    access[key].permissions.push({"permissionCode": permissionCode})
                }else {
                    access[key].permissions.splice(keyCurrent[0], 1);
                }
            }
        });

        dispatch(staffActions.updateAccess(JSON.stringify(access)));
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

    deleteClosedDate (id){
        const { dispatch } = this.props;

        dispatch(staffActions.deleteClosedDates(id));
    }

    deleteStaff (id){
        const { dispatch } = this.props;

        dispatch(staffActions.deleteStaff(id));
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

    updateTimetable (){
        const {selectedDays}=this.state;
        this.props.dispatch(staffActions.getTimetable(moment(selectedDays[0]).startOf('day').format('x'), moment(selectedDays[6]).endOf('day').format('x')));

    }

    handleDayChange (date) {
        this.showCalendar();
        let weeks = getWeekDays(getWeekRange(date).from)
        this.setState({
            selectedDays: weeks,
            timetableFrom: moment(weeks[0]).startOf('day').format('x'),
            timetableTo:moment(weeks[6]).endOf('day').format('x')
        });
        this.props.dispatch(staffActions.getTimetable(moment(weeks[0]).startOf('day').format('x'), moment(weeks[6]).endOf('day').format('x')));

    };

    handleDayEnter (date) {
        const hoverRange = getWeekRange(date)
        this.setState({
            hoverRange
        });
    };

    handleDayLeave () {
        this.setState({
            hoverRange: undefined,
        });
    };

    showCalendar() {
        if (!this.state.opacity) {
            // attach/remove event handler
            document.addEventListener('click', this.handleOutsideClick, false);
        } else {
            document.removeEventListener('click', this.handleOutsideClick, false);
        }

        this.setState(prevState => ({
            opacity: !prevState.opacity,
        }));
    }

    handleOutsideClick(e) {
        this.showCalendar();
    }

    handleWeekClick (weekNumber, days, e) {
        this.setState({
            selectedDays: days,
            timetableFrom: moment(days[0]).startOf('day').format('x'),
            timetableTo:moment(days[6]).endOf('day').format('x')
        });
        this.props.dispatch(staffActions.getTimetable(moment(days[0]).startOf('day').format('x'), moment(days[6]).endOf('day').format('x')));

    };

    showPrevWeek (){
        const {selectedDays} = this.state;

        this.showCalendar();
        let weeks = getWeekDays(getWeekRange(moment(selectedDays[0]).subtract(7, 'days')).from);
        this.setState({
            selectedDays: weeks,
            timetableFrom: moment(weeks[0]).startOf('day').format('x'),
            timetableTo:moment(weeks[6]).endOf('day').format('x')
        });
        this.props.dispatch(staffActions.getTimetable(moment(weeks[0]).startOf('day').format('x'), moment(weeks[6]).endOf('day').format('x')));

    }

    showNextWeek (){
        const {selectedDays} = this.state;

        this.showCalendar();
        let weeks = getWeekDays(getWeekRange(moment(selectedDays[0]).add(7, 'days')).from);
        this.setState({
            selectedDays: weeks,
            timetableFrom: moment(weeks[0]).startOf('day').format('x'),
            timetableTo:moment(weeks[6]).endOf('day').format('x')
        });
        this.props.dispatch(staffActions.getTimetable(moment(weeks[0]).startOf('day').format('x'), moment(weeks[6]).endOf('day').format('x')));

    }

    isSelectingFirstDay(from, to, day) {
        const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from);
        const isRangeSelected = from && to;
        return !from || isBeforeFirstDay || isRangeSelected;
    }

    handleDayClick(day) {
        const { from, to } = this.state;
        if (from && to && day >= from && day <= to) {
            this.handleResetClick();
            return;
        }
        if (this.isSelectingFirstDay(from, to, day)) {
            this.setState({
                ...this.state,
                from: day,
                to: null,
                enteredTo: day,
            });
        } else {
            this.setState({
                ...this.state,
                to: day,
                enteredTo: day,
            });
        }
    }

    handleDayMouseEnter(day) {
        const { from, to } = this.state;
        if (!this.isSelectingFirstDay(from, to, day)) {
            this.setState({
                enteredTo: day,
            });
        }
    }

    handleResetClick() {
        this.setState({...this.state, from: null,
            to: null,
            enteredTo: null});
    }

    onClose(){
        this.setState({...this.state, addWorkTime: false, newStaffByMail: false, newStaff: false, createdService: false});
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
