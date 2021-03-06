import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AddGroup, AddService, CreatedService } from '../_components/modals';
import DragDrop from '../_components/DragDrop';
import ServiceGroupInfo from './ServiceGroupInfo';
import ServiceInfo from './ServiceInfo';

import { servicesActions, staffActions, materialActions, companyActions } from '../_actions';

import '../../public/scss/services.scss';
import {withTranslation} from "react-i18next";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

// const grid = 8;
//
// const getItemStyle = (isDragging, draggableStyle) => ({
//   // some basic styles to make the dragDropItems look a bit nicer
//   userSelect: 'none',
//   // padding: grid * 2,
//   // margin: `0 0 ${grid}px 0`,
//
//   // change background colour if dragging
//   background: isDragging ? '#f5f5f6' : 'transparent',
//
//   // styles we need to apply on draggables
//   ...draggableStyle,
// });
//
// const getListStyle = (isDraggingOver) => ({
//   // background: isDraggingOver ? "#0a1330" : "transparent",
//   padding: grid,
//   position: 'relative',
//   width: '100%',
// });

class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      services: props.services,
      defaultServicesList: props.services,
      search: false,
      staff: props.staff,
      edit: false,
      editServiceItem: false,
      group_working: {},
      group_workingGroup: {},
      idGroupEditable: null,
      selectedProperties: [],
      editService: false,
      collapse: localStorage.getItem('services') ? JSON.parse(localStorage.getItem('services')) : [],
      newSet: false,
      newSetElement: null,
      addService: false,
      addGroup: false,
      createdService: false,
      dragDropItems: [],
      handleOpen: false,
      company: props.company,
    };


    this.onDragEnd = this.onDragEnd.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.update = this.update.bind(this);
    this.add = this.add.bind(this);
    this.loadServices = this.loadServices.bind(this);
    this.addService = this.addService.bind(this);
    this.updateService = this.updateService.bind(this);
    this.deleteService = this.deleteService.bind(this);
    this.onCollapse = this.onCollapse.bind(this);
    this.newService = this.newService.bind(this);
    this.onClose = this.onClose.bind(this);
    this.handleDrogEnd = this.handleDrogEnd.bind(this);
    this.handleServicesDrogEnd = this.handleServicesDrogEnd.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this._delete = this._delete.bind(this);
    this.handleOpenDropdownMenu = this.handleOpenDropdownMenu.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside, false);

    if (this.props.authentication.loginChecked) {
      this.queryInitData();
    }

    document.title = this.props.t('???????????? | ????????????-????????????');
    initializeJs();
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside, false);
  }

  handleOpenDropdownMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ handleOpen: !this.state.handleOpen });
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ handleOpen: false });
    }
  }

  queryInitData() {
    this.props.dispatch(servicesActions.get());
    this.props.dispatch(staffActions.get());
    this.props.dispatch(materialActions.getProducts());
    this.props.dispatch(materialActions.getUnits());
    this.props.dispatch(companyActions.get());
  }

  componentWillReceiveProps(newProps) {
    if (this.props.authentication.loginChecked !== newProps.authentication.loginChecked) {
      this.queryInitData();
    }
    if (JSON.stringify(this.props.staff) !== JSON.stringify(newProps.staff)) {
      this.setState({
        services: newProps.services,
        addService: newProps.services.status && newProps.services.status === 209 ? false : this.state.addService,
        addGroup: newProps.services.status && newProps.services.status === 209 ? false : this.state.addGroup,
        createdService: newProps.services.status && newProps.services.status === 209
          ? false
          : this.state.createdService,
        staff: newProps.staff,
      });
    }
    if (JSON.stringify(this.props.services) !== JSON.stringify(newProps.services)) {
      if (this.state.searchInput) {
        this.setState({ defaultServicesList: newProps.services })
        this.handleSearch({ target: { value: this.state.searchInput } })
      } else {
        this.setState({ services: newProps.services, defaultServicesList: newProps.services });
      }
    }
    if (JSON.stringify(this.props.services.services) !== JSON.stringify(newProps.services.services)) {
      setTimeout(() => {
        this.forceUpdate();
      }, 400);
    }

    if (JSON.stringify(this.props.company) !== JSON.stringify(newProps.company)) {
      this.setState({ company: newProps.company });
    }
  }

  onCollapse(key) {
    const { collapse } = this.state;

    const arrayCollapsed = collapse;

    if (collapse.indexOf(key) === -1) {
      arrayCollapsed.push(key);
    } else {
      arrayCollapsed.splice(collapse.indexOf(key), 1);
    }

    localStorage.setItem('services', JSON.stringify(arrayCollapsed));

    this.setState({ collapse: arrayCollapsed });
  }

  handleDrogEnd(dragDropGroupsItems) {
    const updatedSortOrderStaffs = [];
    dragDropGroupsItems.forEach((item, i) => {
      updatedSortOrderStaffs.push({
        serviceGroupId: item.serviceGroupId,
        sortOrder: i + 1,
      });
    });
    this.props.dispatch(servicesActions.updateServiceGroups(updatedSortOrderStaffs));
  }

  handleServicesDrogEnd(dragDropGroupsItems, idGroup) {
    const updatedSortOrderStaffs = [];
    dragDropGroupsItems.forEach((item, i) => {
      updatedSortOrderStaffs.push({
        serviceId: item.serviceId,
        sortOrder: i + 1,
      });
    });
    this.props.dispatch(servicesActions.updateServices(updatedSortOrderStaffs));
  }

  onDragEnd(result) {
    const { handleDrogEnd } = this.props;
    const { dragDropItems } = this.state;
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const updatedDragDropItems = reorder(
      this.state.dragDropItems,
      result.source.index,
      result.destination.index,
    );

    const isOrderChanged = dragDropItems.some((item, i) => dragDropItems[i].id !== updatedDragDropItems[i].id);

    if (isOrderChanged) {
      this.setState({
        dragDropItems: updatedDragDropItems,
      });
      if (handleDrogEnd) {
        handleDrogEnd(updatedDragDropItems);
      }
    }
  }

  onManualOrderChange = (oldIndex, newIndex, items) => {
    const updatedDragDropItems = reorder(
      items,
      oldIndex,
      newIndex,
    );
    this.setState({
      dragDropItems: updatedDragDropItems,
    });
    this.handleDrogEnd(updatedDragDropItems);
  }

  render() {
    const {
      services, edit, group_working, staff, group_workingGroup, editServiceItem, collapse, newSet,
      idGroupEditable, addService, addGroup, createdService, defaultServicesList, search, company
    } = this.state;
    const isLoading = staff.isLoading || services.isLoading;
    const dragDropGroupsItems = [];

    const { t } = this.props;


    services.services && services.services.forEach((item, keyGroup) => {
      const dragDropServicesItems = [];
      collapse.indexOf(item.serviceGroupId) === -1 && item.services && item.services.length > 0 && item.services
        .map((item2, keyService) => {
          dragDropServicesItems.push({
            serviceId: item2.serviceId,
            id: `service-${keyGroup}-${keyService}`,
            getContent: (dragHandleProps) => (
              <ServiceInfo
                company={company}
                keyGroup={keyGroup}
                dragHandleProps={dragHandleProps}
                keyService={keyService}
                item2={item2}
                item={item}
                newService={this.newService}
                deleteService={this.deleteService}
              />
            ),
          });
        });

      dragDropGroupsItems.push({
        dragDropServicesItems,
        item,
        keyGroup,
        serviceGroupId: item.serviceGroupId,
        id: `service-group-${keyGroup}`,
        getContent: (dragHandleProps) => (
          <ServiceGroupInfo
            onCollapse={this.onCollapse}
            services={services}
            item={item}
            keyGroup={keyGroup}
            dragHandleProps={dragHandleProps}
            collapse={collapse}
            handleClick={this.handleClick}
            _delete={this._delete}
            dragDropServicesItems={dragDropServicesItems}
            handleServicesDrogEnd={this.handleServicesDrogEnd}
            newService={this.newService}
            onManualOrderChange={(oldIndex, newIndex) => this.onManualOrderChange(oldIndex, newIndex, dragDropGroupsItems)}
          />
        ),
      });
    });


    return (
      <div className="services">
        {/* {this.state.isLoading
          ? <div className="zIndex"><Pace color="rgb(42, 81, 132)" height="3"  /></div>
          : null}*/
        }
        {isLoading &&
                <div className="loader loader-service">
                  <img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/>
                </div>
        }

        <div className="pages-content">
          <div className="services_list" id="sortable_list">
            {(defaultServicesList.services && defaultServicesList !== '' &&
                            <div className="row align-items-center search-header-container content clients mb-2">
                              <div className="search">
                                <input className="search-input" type="search"
                                  placeholder={t('?????????????? ???????????????? ????????????')}
                                  aria-label="Search" value={this.state.searchInput}
                                  onChange={this.handleSearch}/>

                                <input className="mob-search-input" type="search"
                                  placeholder={t('?????????????? ???????????????? ????????????')}
                                  aria-label="Search" value={this.state.searchInput}
                                  onChange={this.handleSearch}/>
                                <button className="search-icon" type="submit"/>
                              </div>
                            </div>
            )}

            <div className="services_wrapper">
              <DragDrop
                dragDropItems={dragDropGroupsItems}
                handleDrogEnd={this.handleDrogEnd}
              />
            </div>
          </div>
          <div ref={this.setWrapperRef}>
            <a
              className={'add' + (this.state.handleOpen ? ' rotate' : '')}
              href="#"
              onClick={this.handleOpenDropdownMenu}
            />

            <div className={'buttons-container' + (this.state.handleOpen ? '' : ' hide')}>
              <div className="buttons">
                <button type="button" className="button"
                  onClick={(e) => this.handleClick(null, false, e)}>
                  {t('?????????? ???????????? ??????????')}
                </button>

                <button type="button" onClick={() => this.setState({ createdService: true })}
                  className="button">
                  {t('?????????? ????????????')}
                </button>
              </div>
              <div className="arrow"/>
            </div>
          </div>
        </div>
        <div className="tab-content">
          {(!isLoading && (!services.services || services.services.length === 0)) && !search &&
                    <div className="no-holiday">
                      <span>
                        {t('???????????? ???? ??????????????????')}
                        <span className="buttons">
                          <button type="button"
                            className="button"
                            onClick={(e) => this.handleClick(null, false, e)}>{t('???????????????? ????????????')}</button>
                        </span>
                      </span>
                    </div>
          }

          {(!isLoading && (!services.services || services.services.length === 0)) && search &&
                    <div className="no-holiday">
                      <span>
                        {t('?????????? ???? ??????????????')}
                      </span>
                    </div>
          }
        </div>

        {addGroup &&
                <AddGroup
                  group_workingGroup={group_workingGroup}
                  edit={edit}
                  update={this.update}
                  add={this.add}
                  newSet={newSet}
                  onClose={this.onClose}
                />
        }

        {addService &&
                <AddService
                  group_working={group_working}
                  editServiceItem={editServiceItem}
                  updateService={this.updateService}
                  addService={this.addService}
                  staffs={staff.staff}
                  group={idGroupEditable}
                  onClose={this.onClose}
                />
        }

        {createdService &&
                <CreatedService
                  services={services}
                  newServiceGroup={this.handleClick}
                  newServiceFromGroup={this.newService}
                  serviceCurrent={this.state.newSetElement}
                  onClose={this.onClose}
                />
        }
      </div>
    );
  }

  handleClick(id, newSet) {
    const { services } = this.state;
    this.setState({ ...this.state, editService: false });

    if (id != null) {
      const group_workingGroup = services.services.find((item) => {
        return id === item.serviceGroupId;
      });
      this.setState({ edit: true, addGroup: true, group_workingGroup: group_workingGroup });
    } else {
      this.setState({ edit: false, addGroup: true, group_workingGroup: {}, newSet: newSet });
    }
  }

  newService(item2, id2) {
    if (item2 != null) {
      this.setState({
        editServiceItem: true,
        addService: true,
        group_working: item2,
        idGroupEditable: id2,
      });
    } else {
      this.setState({
        editServiceItem: false,
        addService: true,
        group_working: {},
        idGroupEditable: id2,
      });
    }
  }

  update(service) {
    const { dispatch } = this.props;
    dispatch(servicesActions.update(service));
  };

  add(service, newSet) {
    const { dispatch } = this.props;
    if (newSet) {
      this.setState({ ...this.state, newSetElement: service });
    }

    dispatch(servicesActions.add(JSON.stringify(service)));
  };

  _delete(id) {
    const { dispatch } = this.props;

    dispatch(servicesActions._delete(id));
  }

  loadServices(idGroup) {
    const { dispatch } = this.props;
    const { selectedProperties } = this.state;
    const selectedItem = selectedProperties;
    const index = selectedProperties.includes(idGroup) && selectedProperties.indexOf(idGroup);

    selectedProperties.includes(idGroup) ? selectedItem.splice(index, 1) : selectedItem.push(idGroup);

    this.setState({ ...this.state, selectedProperties: selectedItem });

    selectedProperties.includes(idGroup) && dispatch(servicesActions.getServiceList(idGroup));
  };

  updateService(service, deletedProductsList) {
    const { dispatch } = this.props;
    const { idGroupEditable } = this.state;

    const finalServiceProducts = service.serviceProducts
      .filter((item) => deletedProductsList
        .every((serviceProductForDeleting) => serviceProductForDeleting.productId !== item.productId),
      );
    if (service && service.usingMaterials) {
      const productToPost = [];
      const productToPut = [];
      finalServiceProducts.forEach((item) => {
        const serviceProducts = {
          amount: 0,
          productId: 0,
          serviceId: 0,
        };
        serviceProducts.amount = parseInt(item.amount);
        serviceProducts.productId = parseInt(item.productId);
        serviceProducts.serviceId = service.serviceId;
        if (item.serviceProductId) {
          serviceProducts.serviceProductId = item.serviceProductId;
          productToPut.push(serviceProducts);
        } else {
          productToPost.push(serviceProducts);
        }
      });

      // dispatch(servicesActions.createServiceProducts(productToPost));
      productToPut.forEach((item, i) => {
        setTimeout(() => {
          // dispatch(servicesActions.updateServiceProduct(JSON.stringify(item), item.serviceProductId));
        }, i * 100);
      });
    }

    deletedProductsList.forEach((item) => {
      setTimeout(() => {
        if (item.serviceProductId) {
          // dispatch(servicesActions.deleteServiceProduct(item.serviceProductId));
        }
      });
    });

    dispatch(servicesActions.updateService(JSON.stringify(service), idGroupEditable.serviceGroupId));
  };

  addService(service) {
    const { dispatch } = this.props;
    const { idGroupEditable } = this.state;

    dispatch(servicesActions.addService(service, idGroupEditable.serviceGroupId));
  };

  deleteServiceGroup(id) {
    const { dispatch } = this.props;

    dispatch(servicesActions.deleteServiceGroup(id));
  }

  deleteService(groupId, idService) {
    const { dispatch } = this.props;

    dispatch(servicesActions.deleteService(groupId, idService));
  }

  onClose() {
    this.setState({ ...this.state, addService: false, addGroup: false, createdService: false });
  }

  handleSearch(e) {
    const { value } = e.target;
    const { defaultServicesList } = this.state;

    // const searchServicesList = defaultServicesList.services.filter((item) => {
    //   return (item.services && item.services.some((item) => item.name.toLowerCase().includes(value.toLowerCase())))
    //     || (item.services && item.services.some((item) => item.details.toLowerCase().includes(value.toLowerCase())));
    //   // || item.name.toLowerCase().includes(value.toLowerCase())
    //   // || item.description.toLowerCase().includes(value.toLowerCase())
    // });

    const searchServicesList = defaultServicesList.services.reduce((filtered, group) => {
      if (group.name.toLowerCase().includes(value)) {
        filtered.push(group);
      } else {
        const services = (group.services || []).filter((s) => {
          if (group.name.toLowerCase().includes(value.toLowerCase())) return true;
          return (s.name.toLowerCase().includes(value.toLowerCase()) || s.details.toLowerCase().includes(value.toLowerCase()));
        });

        if (services.length > 0) {
          filtered.push({
            ...group,
            services,
          });
        }
      }
      return filtered;
    }, [],
    );

    console.log('searchServicesList: ', searchServicesList);


    this.setState({
      searchInput: value,
      search: true,
      services: { services: searchServicesList },
    });

    if (value === '') {
      this.setState({
        search: true,
        services: defaultServicesList,
      });
    }
  }
}

function mapStateToProps(store) {
  const { services, staff, authentication, company } = store;
  return {
    services,
    staff,
    authentication,
    company,
  };
}

export default connect(mapStateToProps)(withTranslation('common')(Index));
