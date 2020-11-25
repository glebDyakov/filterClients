import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';


import {
  AddProduct, AddCategory, AddProvider, AddBrand, AddUnit,
  InfoProduct, AddStoreHouse, ExpenditureProduct, StorehouseProduct,
} from '../_components/modals';
import Paginator from '../_components/Paginator';
import FeedbackStaff from '../_components/modals/FeedbackStaff';
import EmptyContent from './EmptyContent';
import AddButton from './AddButton';
import ProductsList from './lists/ProductsList';
import CategoryList from './lists/CategoryList';
import BrandsList from './lists/BrandsList';
import SuppliersList from './lists/SuppliersList';
import MovementList from './lists/MovementList';
import StoreHouseList from './lists/StoreHouseList';

import { analiticsActions, materialActions, staffActions } from '../_actions';

import { getWeekRange } from '../_helpers/time';
import { access } from '../_helpers/access';

import 'react-day-picker/lib/style.css';
import '../../public/css_admin/date.css';

import '../../public/scss/staff.scss';
import '../../public/scss/material.scss';
import { withTranslation } from 'react-i18next';
import Hint from '../_components/Hint';
import { DatePicker } from '../_components/DatePicker';

function getWeekDays(weekStart) {
  const days = [weekStart];
  for (let i = 1; i < 7; i += 1) {
    days.push(
      moment(weekStart).utc().locale('ru')
        .add(i, 'days')
        .toDate(),
    );
  }
  return days;
}

class Index extends Component {
  constructor(props) {
    super(props);

    if (!access(13)) {
      props.history.push('/denied');
    }

    if (props.match.params.activeTab &&
      props.match.params.activeTab !== 'suppliers' &&
      props.match.params.activeTab !== 'products' &&
      props.match.params.activeTab !== 'brands' &&
      props.match.params.activeTab !== 'moving' &&
      props.match.params.activeTab !== 'categories' &&
      props.match.params.activeTab !== 'units' &&
      props.match.params.activeTab !== 'store-houses'
    ) {
      props.history.push('/nopage');
    }

    const companyTypeId = this.props.company.settings && this.props.company.settings.companyTypeId;
    if (props.match.params.activeTab === 'suppliers') {
      document.title = this.props.t('Поставщики | Онлайн-запись');
    }
    if (props.match.params.activeTab === 'brands') {
      document.title = this.props.t('Выходные дни | Онлайн-запись');
    }
    if (props.match.params.activeTab === 'categories') {
      document.title = this.props.t('Категории | Онлайн-запись');
    }
    if (props.match.params.activeTab === 'moving') {
      document.title = this.props.t('Движение товаров | Онлайн-запись');
    }
    if (props.match.params.activeTab === 'units') {
      document.title = this.props.t('Еденицы измерения | Онлайн-запись');
    }
    if (props.match.params.activeTab === 'store-houses') {
      document.title = this.props.t('Склады | Онлайн-запись');
    }
    if (!props.match.params.activeTab || props.match.params.activeTab === 'products') {
      document.title = this.props.t('Товары | Онлайн-запись');
    }


    this.state = {
      edit: false,
      staff_working: {},
      closedDates: {},
      timetable: {},
      hoverRange: undefined,
      opacity: false,
      selectedDays: getWeekDays(getWeekRange(moment().format()).from),
      emailNew: '',
      emailIsValid: false,
      from: null,
      to: null,
      enteredTo: null,
      activeTab: props.match.params.activeTab ? props.match.params.activeTab : 'products',
      addWorkTime: false,
      newStaffByMail: false,
      newStaff: false,

      productsCurrentPage: 1,
      movingCurrentPage: 1,

      selectedMovementDay: moment().utc().toDate(),

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


      movementsProducts: props.material.movements,

      // storeHouseProducts: props.material.storeHouseProducts,
      // defaultStoreHouseProductsList: props.material.storeHouseProducts,
      // expenditureProducts: props.material.expenditureProducts,
      // defaultExpenditureProductsList: props.material.expenditureProducts,

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
    this.handleMovingPageClick = this.handleMovingPageClick.bind(this);
    this.setTab = this.setTab.bind(this);
    this.queryInitData = this.queryInitData.bind(this);
    this.toggleUnit = this.toggleUnit.bind(this);
    this.onCloseUnit = this.onCloseUnit.bind(this);
    this.toggleStoreHouse = this.toggleStoreHouse.bind(this);
    this.onCloseStoreHouse = this.onCloseStoreHouse.bind(this);
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
    // this.handleDayChooseClick = this.handleDayChooseClick.bind(this);

    this.deleteProduct = this.deleteProduct.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
    this.deleteBrand = this.deleteBrand.bind(this);
    this.deleteSupplier = this.deleteSupplier.bind(this);
    this.deleteMovement = this.deleteMovement.bind(this);
    this.deleteStoreHouse = this.deleteStoreHouse.bind(this);

    this.toggleInfoProduct = this.toggleInfoProduct.bind(this);
  }

  componentDidMount() {
    const { selectedDays } = this.state;
    if (this.props.authentication.loginChecked) {
      this.queryInitData();
    }
    this.setState({
      ...this.state,
      timetableFrom: moment(selectedDays[0]).startOf('day').format('x'),
      timetableTo: moment(selectedDays[6]).endOf('day').format('x'),
    });
    initializeJs();
  }

  queryInitData() {
    const { selectedDays } = this.state;
    this.props.dispatch(materialActions.getProducts());
    this.props.dispatch(materialActions.getCategories());
    this.props.dispatch(materialActions.getBrands());
    this.props.dispatch(materialActions.getSuppliers());
    this.props.dispatch(materialActions.getStoreHouses());
    this.props.dispatch(materialActions.getUnits());
    // this.props.dispatch(materialActions.getStoreHouseProducts());
    // this.props.dispatch(materialActions.getExpenditureProducts());
    this.props.dispatch(materialActions.getMovements());
  }

  componentWillReceiveProps(newProps) {
    if (this.props.authentication.loginChecked !== newProps.authentication.loginChecked) {
      this.queryInitData();
    }

    if (JSON.stringify(this.props.company) !== JSON.stringify(newProps.company)) {
      const companyTypeId = newProps.company.settings && newProps.company.settings.companyTypeId;
      // if (JSON.stringify(this.props.company.settings) !== JSON.stringify(newProps.company.settings)){
      //     if (newProps.company.settings && newProps.company.settings.companyName) {
      //         this.props.dispatch(materialActions.getStoreHouses(newProps.company.settings.companyName));
      //     }
      // }
      if (newProps.match.params.activeTab === 'staff') {
        document.title = (companyTypeId === 2 || companyTypeId === 3) ? 'Рабочие места | Онлайн-запись' : 'Сотрудники | Онлайн-запись';
      }
    }

    if (this.props.staff.status !== newProps.staff.status) {
      this.setState({
        addWorkTime: newProps.staff.status && newProps.staff.status === 209 ? false : this.state.addWorkTime,
      });
    }

    if (this.state.staff_working.staffId && JSON.stringify(newProps.staff.staff) !== (JSON.stringify(this.props.staff.staff))) {
      const staff_working = newProps.staff.staff.find((item) => item.staffId === this.state.staff_working.staffId);
      if (staff_working) {
        this.setState({ staff_working });
      }
    }

    if (JSON.stringify(this.props.material.movements) !== JSON.stringify(newProps.material.movements)) {
      this.setState({
        movementsProducts: newProps.material.movements,
      });
    }

    if (JSON.stringify(this.props.material.products) !== JSON.stringify(newProps.material.products)) {
      let info_product_working = {};
      if (this.state.info_product_working) {
        info_product_working = newProps.material.products.find((item) => item.productId === this.state.info_product_working.productId);
      }
      this.setState({
        products: newProps.material.products,
        defaultProductsList: newProps.material.products,
        info_product_working,
      });
    }
    if (JSON.stringify(this.props.material.categories) !== JSON.stringify(newProps.material.categories)) {
      this.setState({
        categories: newProps.material.categories,
        defaultCategoriesList: newProps.material.categories,
      });
    }
    if (JSON.stringify(this.props.material.brands) !== JSON.stringify(newProps.material.brands)) {
      this.setState({
        brands: newProps.material.brands,
        defaultBrandsList: newProps.material.brands,
      });
    }
    if (JSON.stringify(this.props.material.suppliers) !== JSON.stringify(newProps.material.suppliers)) {
      this.setState({
        suppliers: newProps.material.suppliers,
        defaultSuppliersList: newProps.material.suppliers,
      });
    }
    if (JSON.stringify(this.props.material.units) !== JSON.stringify(newProps.material.units)) {
      this.setState({
        units: newProps.material.units,
        defaultUnitsList: newProps.material.units,
      });
    }
    if (JSON.stringify(this.props.material.storeHouses) !== JSON.stringify(newProps.material.storeHouses)) {
      this.setState({
        storeHouses: newProps.material.storeHouses,
        defaultStoreHousesList: newProps.material.storeHouses,
      });
    }

    if (JSON.stringify(this.props.material.storeHouseProducts) !== JSON.stringify(newProps.material.storeHouseProducts)) {
      this.setState({
        storeHouseProducts: newProps.material.storeHouseProducts,
        defaultStoreHouseProductsList: newProps.material.storeHouseProducts,
      });
    }

    if (JSON.stringify(this.props.material.expenditureProducts) !== JSON.stringify(newProps.material.expenditureProducts)) {
      this.setState({
        expenditureProducts: newProps.material.expenditureProducts,
        defaultExpenditureProductsList: newProps.material.expenditureProducts,
      });
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
    this.setState({ isOpenDropdownMenu: false });
  }

  // handleDayChooseClick(day, modifiers = {}, dayKey) {
  //   const { selectedMovementDay } = this.state;
  //   const daySelected = moment(day);
  //
  //   this.props.dispatch(materialActions.getMovements(1, '', 11,
  //     moment(daySelected.startOf('day')).format('x'),
  //     moment(daySelected.endOf('day')).format('x'),
  //   ));
  //
  //   this.setState({ selectedMovementDay: daySelected.utc().startOf('day').toDate() });
  // }


  setTab(tab) {
    this.setState({
      activeTab: tab,
      isOpenDropdownMenu: false,
    });

    if (tab === 'suppliers') {
      document.title = this.props.t('Поставщики | Онлайн-запись');
    }
    if (tab === 'brands') {
      document.title = this.props.t('Выходные дни | Онлайн-запись');
    }
    if (tab === 'categories') {
      document.title = this.props.t('Категории | Онлайн-запись');
    }
    if (tab === 'products') {
      document.title = this.props.t('Товары | Онлайн-запись');
      // this.props.dispatch(materialActions.getProducts(this.state.productsCurrentPage));
    }
    if (tab === 'units') {
      document.title = this.props.t('Единицы измерения | Онлайн-запись');
    }
    if (tab === 'store-houses') {
      document.title = this.props.t('Склады | Онлайн-запись');
    }

    if (tab === 'moving') {
      document.title = this.props.t('Движение товаров | Онлайн-запись');
      // this.props.dispatch(materialActions.getProducts());
    }

    history.pushState(null, '', '/material/' + tab);
  }

  handlePageClick(data) {
    const { selected } = data;
    const currentPage = selected + 1;
    this.setState({
      productsCurrentPage: currentPage,
    });

    this.props.dispatch(materialActions.getProducts(currentPage));
  };

  handleMovingPageClick(data) {
    const { selected } = data;
    const currentPage = selected + 1;
    this.setState({
      movingCurrentPage: currentPage,
    });
    // this.props.dispatch(materialActions.getMovements(currentPage, '', 11, moment(this.state.selectedMovementDay).utc().startOf('day').format('x'), moment(this.state.selectedMovementDay).utc().endOf('day').format('x')));
    this.props.dispatch(materialActions.getMovements(currentPage, '', 11));
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
    this.setState({ storeHouse_working, storeHouseOpen: true });
  }

  toggleCategory(category_working) {
    this.setState({ category_working, categoryOpen: true });
  }

  getNavTabs(activeTab) {
    const activeTabMob = this.getActiveTab(activeTab);
    const { t } = this.props;
    return (

      <div className="row align-items-center content clients mb-0 search-container">

        <div className="header-tabs d-flex">

          <a className={'nav-link' + (activeTab === 'products' ? ' active show' : '')} data-toggle="tab"
             href="#tab1" onClick={() => {
            this.setTab('products');
          }}>{t('Товары')}</a>


          <a className={'nav-link' + (activeTab === 'categories' ? ' active show' : '')} data-toggle="tab"
             href="#tab2" onClick={() => this.setTab('categories')}>{t('Категории')}</a>


          <a className={'nav-link' + (activeTab === 'brands' ? ' active show' : '')} data-toggle="tab"
             href="#tab3" onClick={() => this.setTab('brands')}>{t('Бренды')}</a>

          {access(-1) &&

          <a className={'nav-link' + (activeTab === 'suppliers' ? ' active show' : '')} data-toggle="tab"
             href="#tab4" onClick={() => this.setTab('suppliers')}>{t('Поставщики')}</a>

          }

          <a className={'nav-link' + (activeTab === 'moving' ? ' active show' : '')} data-toggle="tab"
             href="#tab5" onClick={() => this.setTab('moving')}>{t('Движение товаров')}</a>

          {/* <li className="nav-item">*/}
          {/*    <a className={"nav-link"+(activeTab==='units'?' active show':'')} data-toggle="tab" href="#tab6" onClick={()=>this.setTab('units')}>Еденицы измерения</a>*/}
          {/* </li>*/}
          <a className={'nav-link' + (activeTab === 'store-houses' ? ' active show' : '')} data-toggle="tab"
             href="#tab7" onClick={() => this.setTab('store-houses')}>{t('Склады')}</a>

        </div>

        <div className={'header-tabs-mob' + (this.state.isOpenDropdownMenu ? ' opened' : '')}>
          <p onClick={this.handleOpenDropdownMenu}
             className="dropdown-button">{activeTabMob}</p>

          {this.state.isOpenDropdownMenu && (
            <div ref={this.setWrapperRef} className="dropdown-buttons">

              <a className={'nav-link' + (activeTab === 'products' ? ' active show' : '')}
                 data-toggle="tab" href="#tab1" onClick={() => {
                this.setTab('products');
              }}>{t('Товары')}</a>


              <a className={'nav-link' + (activeTab === 'categories' ? ' active show' : '')}
                 data-toggle="tab" href="#tab2"
                 onClick={() => this.setTab('categories')}>{t('Категории')}</a>


              <a className={'nav-link' + (activeTab === 'brands' ? ' active show' : '')} data-toggle="tab"
                 href="#tab3" onClick={() => this.setTab('brands')}>{t('Бренды')}</a>

              {access(-1) &&

              <a className={'nav-link' + (activeTab === 'suppliers' ? ' active show' : '')}
                 data-toggle="tab" href="#tab4"
                 onClick={() => this.setTab('suppliers')}>{t('Поставщики')}</a>

              }

              <a className={'nav-link' + (activeTab === 'moving' ? ' active show' : '')} data-toggle="tab"
                 href="#tab5" onClick={() => this.setTab('moving')}>{t('Движение товаров')}</a>

              {/* <li className="nav-item">*/}
              {/*    <a className={"nav-link"+(activeTab==='units'?' active show':'')} data-toggle="tab" href="#tab6" onClick={()=>this.setTab('units')}>Еденицы измерения</a>*/}
              {/* </li>*/}
              <a className={'nav-link' + (activeTab === 'store-houses' ? ' active show' : '')}
                 data-toggle="tab" href="#tab7"
                 onClick={() => this.setTab('store-houses')}>{t('Склады')}</a>


            </div>
          )}
        </div>
      </div>
    );
  }


  getActiveTab(activeTab) {
    switch (activeTab) {
      case 'products':
        return this.props.t('Товары');
        break;
      case 'categories':
        return this.props.t('Категории');
        break;
      case 'brands':
        return this.props.t('Бренды');
        break;
      case 'suppliers':
        return this.props.t('Поставщики');
        break;
      case 'moving':
        return this.props.t('Движение товаров');
        break;
      case 'store-houses':
        return this.props.t('Склады');
        break;
      default:
        return this.props.t('Тест');
    }
  }

  handleOpenDropdownMenu() {
    if (this.state.isOpenDropdownMenu) {
      this.setState({ isOpenDropdownMenu: false });
    } else {
      this.setState({ isOpenDropdownMenu: true });
    }
  }

  render() {
    const { staff, material, t } = this.props;
    const {
      product_working, info_product_working, category_working, supplier_working, brand_working, productOpen,
      infoProductOpen, providerOpen, categoryOpen, brandOpen, edit, currentStaff, date,
      editing_object, editWorkingHours, activeTab, unit_working, unitOpen, storeHouse_working, storeHouseOpen,
      exProdOpen, storehouseProductOpen, ex_product_working, storehouseProduct_working,
    } = this.state;


    const { products, finalTotalProductsPages, finalTotalMovementsPages, categories, suppliers, units, storeHouses } = material;

    const dayPickerProps = {
      month: new Date(),
      toMonth: new Date(),
      disabledDays: [
        {
          after: new Date(),
        },
      ],
    };


    const movingArray = !this.props.material.isLoadingMovements && this.state.movementsProducts.content
      .sort((b, a) =>
        moment(a.date).format('x') - moment(b.date).format('x'),
      ) || [];

    movingArray.forEach((item) => {
      if (item.target) {
        switch (item.target) {
          case 'SALE':
            item.targetTranslated = this.props.t('Продажа');
            break;
          case 'INTERNAL':
            item.targetTranslated = this.props.t('Списание на услугу');
            break;
          case 'DAMAGED':
            item.targetTranslated = this.props.t('Товар поврежден');
            break;
          case 'CHANGING':
            item.targetTranslated = this.props.t('Изменение наличия');
            break;
          case 'LOST':
            item.targetTranslated = this.props.t('Утеря');
            break;
          case 'OTHER':
            item.targetTranslated = this.props.t('Другое');
            break;
          default:
          // item.target = '';
        }
      }
    });


    const movingList = (
      <React.Fragment>
        {
          movingArray.map((movement) => {
              const activeProduct = products && products.find((item) => item.productId === movement.productId);
              const activeStorehouse = storeHouses && storeHouses.find((item) => item.storehouseId === movement.storehouseId);
              const activeUnit = units.find((unit) => unit.unitId === movement.unitId);
              return (
                <MovementList
                  movement={movement}
                  activeProduct={activeProduct}
                  deleteMovement={this.deleteMovement}
                  toggleStorehouseProduct={this.toggleStorehouseProduct}
                  toggleExProd={this.toggleExProd}
                  activeUnit={activeUnit}
                  activeStorehouse={activeStorehouse}
                  staffs={this.props.staff.staff}
                />

              );

            },
          )

        }
      </React.Fragment>
    );


    const navTabs = this.getNavTabs(activeTab);

    return (
      <div className="material" ref={(node) => {
        this.node = node;
      }}>
        {/* {staff.isLoadingStaffInit && <div className="loader loader-email"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}*/}
        <div className="row retreats content-inner page_staff">
          <div className="flex-content col-xl-12">

          </div>
        </div>


        <div className="retreats">
          <div className="tab-content">
            <div className={'tab-pane' + (activeTab === 'products' ? ' active' : '')} id="tab1">
              <div className="material-products">
                {
                  (this.state.defaultProductsList && this.state.defaultProductsList !== '' &&

                    <div className="row align-items-center content clients mb-2 search-container">
                      <div className="search col-8 col-lg-4">
                        <input type="search" placeholder={t('Поиск товаров')}
                               aria-label="Search" ref={(input) => this.productSearch = input}
                               onChange={() =>
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
                      <div>
                        <p>{t('Наименование')}</p>
                      </div>
                      <div>
                        <p>{t('Код товара')}</p>
                      </div>
                      <div>
                        <p>{t('Категория')}</p>
                      </div>
                      <div>
                        <p>{t('Номинальный объем')}</p>
                      </div>
                      {/*<div className="overflow-visible reserve-title">*/}
                      {/*    <p>{t("Стоимость ед. обьема")}*/}
                      {/*        <Hint hintMessage={*/}
                      {/*            t('За 1 ед. номинального объема.')*/}
                      {/*        }*/}
                      {/*        /></p>*/}
                      {/*</div>*/}
                      <div className="overflow-visible reserve-title">
                        <p>{t('Остаток')}<br/>/<span className="red-text"> {t('Резерв')}</span>
                          <Hint hintMessage={
                            t('Товары, зарезервированные на созданные визиты.')
                          }
                          /></p>
                      </div>

                      <div className="delete clientEditWrapper"></div>
                      <div className="delete dropdown">

                        <div className="dropdown-menu delete-menu"></div>
                      </div>
                    </div>

                    <React.Fragment>
                      {this.state.products.map((product) => {
                          const activeCategory = categories && categories.find((item) => item.categoryId === product.categoryId);
                          const activeUnit = units && units.find((item) => item.unitId === product.unitId);
                          return (
                            <ProductsList
                              product={product}
                              activeCategory={activeCategory}
                              activeUnit={activeUnit}
                              toggleInfoProduct={this.toggleInfoProduct}
                              toggleProduct={this.toggleProduct}
                              deleteProduct={this.deleteProduct}
                            />
                          );
                        },
                      )}
                    </React.Fragment>
                  </div>
                  : (!this.props.material.isLoadingProducts &&
                    <EmptyContent
                      img="2box"
                      title={t('Нет товаров')}
                      text={t('Добавьте первый товар, чтобы начать работу')}
                      buttonText={t('Новый товар')}
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
                buttonText={t('Новый товар')}
              />
              {this.props.material.isLoadingProducts &&
              <div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/>
              </div>}
            </div>
            <div className={'tab-pane staff-list-tab' + (activeTab === 'categories' ? ' active' : '')}
                 id="tab2">
              <div className="material-categories">
                {
                  (this.state.categories && this.state.defaultCategoriesList !== '' &&

                    <div className="row align-items-center content clients mb-2">
                      <div className="search col-6 col-lg-4">
                        <input type="search" placeholder={t('Поиск категорий')}
                               aria-label="Search" ref={(input) => this.categorySearch = input}
                               onChange={() => this.handleSearch('defaultCategoriesList', 'categories', ['categoryName'], 'categorySearch')}/>
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
                      <div>
                        <p>{t('Название категории')}</p>
                      </div>
                      <div className="delete clientEditWrapper"></div>
                      <div className="delete dropdown">

                        <div className="dropdown-menu delete-menu"></div>
                      </div>
                    </div>

                    {this.state.categories.map((category) => (
                      <CategoryList
                        openClientStats={this.openClientStats}
                        deleteCategory={this.deleteCategory}
                        categories={categories}
                        category={category}
                        toggleCategory={this.toggleCategory}
                      />))}
                  </div>
                  : (!this.props.material.isLoadingCategories &&
                    <EmptyContent
                      img="box"
                      title={t('Нет категорий')}
                      text={t('Создайте категории и свяжите их с продуктами')}
                      buttonText={t('Новая категория')}
                      buttonClick={this.toggleCategory}
                    />
                  )}


              </div>
              <AddButton
                handleOpen={this.toggleCategory}
                buttonText={t('Новая категория')}
              />
              {this.props.material.isLoadingCategories &&
              <div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/>
              </div>}
            </div>
            <div className={'tab-pane' + (activeTab === 'brands' ? ' active' : '')} id="tab3">
              <div className="material-categories">
                {
                  (this.state.defaultBrandsList && this.state.defaultBrandsList !== '' &&

                    <div className="row align-items-center content clients mb-2">
                      <div className="search col-6 col-lg-4">
                        <input type="search" placeholder={t('Поиск брендов')}
                               aria-label="Search" ref={(input) => this.brandSearch = input}
                               onChange={() => this.handleSearch('defaultBrandsList', 'brands', ['brandName'], 'brandSearch')}/>
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
                    <div>
                      <p>{t('Название бренда')}</p>
                    </div>
                    <div className="delete clientEditWrapper"></div>
                    <div className="delete dropdown">

                      <div className="dropdown-menu delete-menu"></div>
                    </div>
                  </div>}

                  {this.state.brands.length ?
                    this.state.brands.map((brand) => (
                        <BrandsList
                          brand={brand}
                          openClientStats={this.openClientStats}
                          toggleBrand={this.toggleBrand}
                          deleteBrand={this.deleteBrand}
                        />
                      ),
                    ) : (!this.props.material.isLoadingBrands &&
                      <EmptyContent
                        img="shopping"
                        title={t('Нет брендов')}
                        text={t('Создайте новый бренд и свяжите его с товарами')}
                        buttonText={t('Новый бренд')}
                        buttonClick={this.toggleBrand}
                      />
                    )}
                </div>
              </div>
              <AddButton
                handleOpen={this.toggleBrand}
                buttonText={t('Новый бренд')}
              />
              {this.props.material.isLoadingBrands &&
              <div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/>
              </div>}
            </div>
            {access(-1) && !staff.error &&
            <div className={'tab-pane access-tab' + (activeTab === 'suppliers' ? ' active' : '')} id="tab4">
              <div className="access">
                {
                  (this.state.defaultSuppliersList && this.state.defaultSuppliersList !== '' &&

                    <div className="row align-items-center content clients mb-2">
                      <div className="search col-6 col-lg-4">
                        <input type="search" placeholder={t('Поиск поставщика')}
                               aria-label="Search" ref={(input) => this.supplierSearch = input}
                               onChange={() =>
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
                      <div>
                        <p>{t('Поставщик')}</p>
                      </div>
                      <div>
                        <p>{t('Описание')}</p>
                      </div>
                      <div>
                        <p>{t('Веб-сайт')}</p>
                      </div>
                      <div>
                        <p>{t('Город')}</p>
                      </div>

                      <div className="delete clientEditWrapper"></div>
                      <div className="delete dropdown">

                        <div className="dropdown-menu delete-menu"></div>
                      </div>
                    </div>}

                    {this.state.suppliers.length ?
                      this.state.suppliers.map((supplier) => (
                          <SuppliersList
                            supplier={supplier}
                            openClientStats={this.openClientStats}
                            toggleProvider={this.toggleProvider}
                            deleteSupplier={this.deleteSupplier}
                          />
                        ),
                      ) : (!this.props.material.isLoadingSuppliers &&
                        <EmptyContent
                          img="car"
                          title={t('Нет поставщиков')}
                          text={t('Добавьте поставщиков, чтобы создавать автоматические ордеры на поставку товаров')}
                          buttonText={t('Новый поставщик')}
                          buttonClick={this.toggleProvider}
                        />
                      )}
                  </div>
                </div>
                <AddButton
                  handleOpen={this.toggleProvider}
                  buttonText={t('Новый поставщик')}
                />
              </div>
              {this.props.material.isLoadingSuppliers &&
              <div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/>
              </div>}
            </div>
            }

            <div className={'tab-pane' + (activeTab === 'moving' ? ' active' : '')} id="tab5">
              {
                (this.state.movementsProducts.content && this.state.movementsProducts.content !== '' &&

                  <React.Fragment>
                    <div className="row align-items-center justify-content-between content clients mb-2">
                      {/*<div className="search col-6 col-lg-2">*/}
                      <div className="search col-6 col-lg-4">
                        <input type="search" placeholder={t('Поиск товаров')}
                               aria-label="Search" ref={(input) => this.movingSearch = input}
                               onChange={(e) =>
                                 this.handleSearchMoving(e)}/>
                        <button className="search-icon" type="submit"/>
                      </div>

                      <div className="col-6 col-lg-7 p-0">
                        {navTabs}
                      </div>

                      {/*<div className="col-lg-3 staff-day-picker movements-day-picker online-zapis-date-picker">*/}
                      {/*  <DatePicker*/}
                      {/*    type="day"*/}
                      {/*    selectedDay={this.state.selectedMovementDay}*/}
                      {/*    handleDayClick={(day, modifiers) => this.handleDayChooseClick(day, modifiers, 'selectedMovementDay')}*/}
                      {/*    dayPickerProps={dayPickerProps}*/}
                      {/*    language={this.props.i18n.language}*/}
                      {/*  />*/}
                      {/*</div>*/}

                    </div>

                    {/*<div className="col-12 staff-day-picker mobile-movements-day-picker online-zapis-date-picker">*/}
                    {/*  <DatePicker*/}
                    {/*    type="day"*/}
                    {/*    selectedDay={this.state.selectedMovementDay}*/}
                    {/*    handleDayClick={(day, modifiers) => this.handleDayChooseClick(day, modifiers, 'selectedMovementDay')}*/}
                    {/*    dayPickerProps={dayPickerProps}*/}
                    {/*    language={this.props.i18n.language}*/}
                    {/*  />*/}
                    {/*</div>*/}
                  </React.Fragment>

                )}
              {movingArray.length ? (
                  <React.Fragment>
                    <div className="title-and-main-info">
                      {!!(movingArray.length) &&
                      <div className="tab-content-list mb-2 title title-moving position-sticky">
                        <div className="empty-block">
                        </div>
                        <div>
                          <p>{t('Сотрудник')}</p>
                        </div>
                        <div>
                          <p>{t('Код товара')}</p>
                        </div>
                        <div>
                          <p>{t('Наименование')}</p>
                        </div>
                        {/* <div >*/}
                        {/*    <p>Склад</p>*/}
                        {/* </div>*/}
                        <div>
                          <p>{t('Причина списания')}</p>
                        </div>
                        <div>
                          <p>{t('Количество списания / поступления')}</p>
                        </div>
                        <div>
                          <p>{t('Цена ед. / ед. объема')}</p>
                        </div>
                        <div>
                          <p>{t('Единицы измерения')}</p>
                        </div>
                        <div>
                          <p>{t('Дата')}</p>
                        </div>
                        {/* <div >*/}
                        {/*    <p>Время</p>*/}
                        {/* </div>*/}
                        <div className="overflow-visible reserve-title">
                          <p>{t('Остаток')} <br/>/<span className="red-text"> {t('Резерв')}</span>
                            <Hint hintMessage={
                              t('Товары, зарезервированные на созданные визиты.')
                            }
                            /></p>
                        </div>

                        {/*<div className="delete clientEditWrapper"></div>*/}
                        {/*<div className="delete dropdown">*/}

                        {/*    <div className="dropdown-menu delete-menu"></div>*/}
                        {/*</div>*/}
                      </div>}

                      {movingList}

                    </div>

                  </React.Fragment>

                ) :
                (!this.props.material.isLoadingMovements && <div>
                  <EmptyContent
                    img="2box"
                    title={t('Нет движения товаров')}
                    text={t('Произведите списание или движение для отображения информации')}
                    buttonText={t('Новый товар')}
                    buttonClick={this.toggleProvider}
                    hideButton={true}
                  />
                </div>)}
              <div style={{ opacity: this.props.material.isLoadingMovements ? 0 : 1 }}>
                {this.state.movementsProducts && this.state.movementsProducts.content && this.state.movementsProducts.content.length > 0 &&
                <Paginator
                  finalTotalPages={finalTotalMovementsPages}
                  onPageChange={this.handleMovingPageClick}
                />}
              </div>
              {/* <a className="add"/>*/}
              {/* <div className="hide buttons-container">*/}
              {/*    <div className="p-4">*/}
              {/*        <button type="button" className="button new-holiday">Новый товар</button>*/}
              {/*    </div>*/}
              {/*    <div className="arrow"></div>*/}
              {/* </div>*/}
              {this.props.material.isLoadingMovements &&
              <div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/>
              </div>}
            </div>

            {/* <div className={"tab-pane"+(activeTab==='units'?' active':'')}  id="tab6">*/}
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
            {/* </div>*/}

            <div className={'tab-pane' + (activeTab === 'store-houses' ? ' active' : '')} id="tab7">
              <div className="material-categories">
                {
                  (this.state.defaultStoreHousesList && this.state.defaultStoreHousesList !== '' &&

                    <div className="row align-items-center content clients mb-2">
                      <div className="search col-6 col-lg-4">
                        <input type="search" placeholder={t('Поиск складов')}
                               aria-label="Search"
                               ref={(input) => this.storeHouseSearch = input}
                               onChange={() =>
                                 this.handleSearch('defaultStoreHousesList', 'storeHouses', ['storehouseName'], 'storeHouseSearch')}/>
                        <button className="search-icon" type="submit"/>
                      </div>

                      <div className="col-6 col-lg-8 p-0">
                        {navTabs}
                      </div>
                    </div>
                  )
                }
                <div className="title-and-main-info">
                  {!!this.state.storeHouses.length &&
                  <div className="tab-content-list mb-2 title position-sticky">
                    <div>
                      <p>{t('Название склада')}</p>
                    </div>
                    <div className="delete clientEditWrapper"></div>
                    <div className="delete dropdown">

                      <div className="dropdown-menu delete-menu"></div>
                    </div>
                  </div>}
                  {(this.state.storeHouses && this.state.storeHouses.length) ?
                    this.state.storeHouses.map((storeHouse) => {
                        return (
                          <StoreHouseList
                            storeHouse={storeHouse}
                            openClientStats={this.openClientStats}
                            toggleStoreHouse={this.toggleStoreHouse}/>
                        );
                      },
                    ) : (!this.props.material.isLoadingStoreHouses &&
                      <EmptyContent
                        img="shopping"
                        title={t('Нет заданных складов')}
                        // text="Создайте новый склад"
                        // buttonText="Новый склад"
                        // buttonClick={() => this.toggleStoreHouse()}
                        hideButton={true}
                      />
                    )}
                </div>
                {this.props.material.isLoadingStoreHouses &&
                <div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`}
                                             alt=""/></div>}
              </div>
              {/* <a className="add"/>*/}
              {/* <div className="hide buttons-container">*/}
              {/*    <div className="p-4">*/}
              {/*        <button type="button" className="button new-holiday" onClick={() => this.toggleStoreHouse()}>Новый склад</button>*/}
              {/*    </div>*/}
              {/*    <div className="arrow"></div>*/}
              {/* </div>*/}
            </div>

            {/* {staff.isLoadingStaff && <div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}*/}
            {/* {staff.error  && <div className="errorStaff"><h2 style={{textAlign: "center", marginTop: "50px"}}>Извините, что-то пошло не так</h2></div>}*/}
          </div>
        </div>
        <FeedbackStaff/>
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
          productPageNum={this.state.productsCurrentPage}
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
          productPageNum={this.state.productsCurrentPage}
        />
        }
        {storehouseProductOpen &&
        <StorehouseProduct
          edit={!!storehouseProduct_working}
          client_working={storehouseProduct_working}
          onClose={this.onCloseStorehouseProduct}
          suppliers={suppliers}
          productPageNum={this.state.productsCurrentPage}
        />
        }

      </div>
    );
  }

  toggleExProd(ex_product_working) {
    this.setState({ ex_product_working, exProdOpen: true });
  }

  onCloseExProd() {
    this.setState({ exProdOpen: false });
  }

  toggleStorehouseProduct(storehouseProduct_working) {
    this.setState({ storehouseProduct_working, storehouseProductOpen: true });
  }

  onCloseStorehouseProduct() {
    this.setState({ storehouseProductOpen: false });
  }

  handleSearch(defaultKey = 'defaultCategoriesList', key = 'categoriesList', fields = ['categoryName'], searchKey = 'categorySearch') {
    const { [defaultKey]: defaultList } = this.state;


    const searchServicesList = defaultList.filter((item) => {
      return fields.some((field) => {
        return item[field].toLowerCase().includes(this[searchKey].value.toLowerCase());
      });
    });


    this.setState({
      search: true,
      [key]: searchServicesList,
    });

    if (this[searchKey].value === '') {
      this.setState({
        search: true,
        [key]: defaultList,
      });
    }
  }

  handleSearchMoving(e) {
    // this.props.dispatch(materialActions.getMovements(this.state.movingCurrentPage, e.target.value, 11, moment(this.state.selectedMovementDay).utc().startOf('day').format('x'), moment(this.state.selectedMovementDay).utc().endOf('day').format('x')));
    this.props.dispatch(materialActions.getMovements(this.state.movingCurrentPage, e.target.value, 11, moment().subtract(1, 'year').utc().startOf('day').format('x'), moment().utc().endOf('day').format('x')));
  }

  deleteCategory(id) {
    const { dispatch } = this.props;

    dispatch(materialActions.deleteCategory(id));
  }

  deleteBrand(id) {
    const { dispatch } = this.props;

    dispatch(materialActions.deleteBrand(id));
  }

  deleteSupplier(id) {
    const { dispatch } = this.props;

    dispatch(materialActions.deleteSupplier(id));
  }

  deleteUnit(id) {
    const { dispatch } = this.props;

    dispatch(materialActions.deleteUnit(id));
  }

  deleteStoreHouse(id) {
    const { dispatch } = this.props;

    dispatch(materialActions.deleteStoreHouse(id));
  }

  deleteProduct(id) {
    const { dispatch } = this.props;

    dispatch(materialActions.deleteProduct(id));
  }

  deleteMovement(movement) {
    const { dispatch } = this.props;
    const type = movement.movementType === 'ARRIVAL';
    const id = movement.movementType === 'ARRIVAL' ? movement.storehouseProductId : movement.storehouseProductExpenditureId;
    console.log('type', type);
    dispatch(materialActions.deleteMovement(id, type));
  }

  onCloseProvider() {
    this.setState({ providerOpen: false });
  }

  onCloseProducts() {
    this.setState({ productOpen: false });
  }

  onCloseInfoProducts() {
    this.setState({ infoProductOpen: false });
  }

  onCloseCategory() {
    this.setState({ categoryOpen: false });
  }

  onCloseBrand() {
    this.setState({ brandOpen: false });
  }

  onCloseUnit() {
    this.setState({ unitOpen: false });
  }

  onCloseStoreHouse() {
    this.setState({ storeHouseOpen: false });
  }

  getUnitName(unit) {
    const { t } = this.props;
    switch (unit) {
      case 'Миллилитр':
        return t('мл');
      case 'Штука':
        return t('шт');
      case 'Килограмм':
        return t('кг');
      case 'Грамм':
        return t('гр');
      case 'Коробка':
        return t('кор');
      case 'Сантиметр':
        return t('см');
      default:
        return '';
    }
  }
}


function mapStateToProps(store) {
  const { staff, company, timetable, authentication, material } = store;

  return {
    staff, company, timetable, authentication, material,
  };
}

export default connect(mapStateToProps)(withTranslation('common')(Index));
