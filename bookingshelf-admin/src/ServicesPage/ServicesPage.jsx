import React, {Component} from 'react';
import { connect } from 'react-redux';

import {servicesActions, staffActions} from '../_actions';
import {SidebarMain} from "../_components/SidebarMain";
import {HeaderMain} from "../_components/HeaderMain";
import { parseNumber, formatNumber, isValidNumber } from 'libphonenumber-js'

import '../../public/scss/styles.scss'
import '../../public/scss/services.scss'
import {AddGroup, AddService, UserSettings, CreatedService} from "../_components/modals";

import moment from 'moment';
import 'moment-duration-format';
import {UserPhoto} from "../_components/modals/UserPhoto";
import Pace from "react-pace-progress";

class ServicesPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            services: props.services,
            staff: props.staff,
            edit: false,
            editServiceItem: false,
            group_working: {},
            group_workingGroup: {},
            idGroupEditable: null,
            selectedProperties: [],
            editService: false,
            isLoading: true,
            collapse: localStorage.getItem('services')?JSON.parse(localStorage.getItem('services')):[],
            newSet: false,
            newSetElement: null
        };

        this.handleClick = this.handleClick.bind(this);
        this.update = this.update.bind(this);
        this.add = this.add.bind(this);
        this.loadServices = this.loadServices.bind(this);
        this.addService = this.addService.bind(this);
        this.updateService = this.updateService.bind(this);
        this.deleteService = this.deleteService.bind(this);
        this.onCollapse = this.onCollapse.bind(this);
        this.newService = this.newService.bind(this);
    }

    componentDidMount() {
        document.title = "Услуги | Онлайн-запись";
        initializeJs();
        this.props.dispatch(servicesActions.get());
        this.props.dispatch(staffActions.get());
        setTimeout(() => this.setState({ isLoading: false }), 4500);

    }

    componentWillReceiveProps(newProps) {
        if ( JSON.stringify(this.props) !==  JSON.stringify(newProps)) {
            this.setState({...this.state, services: newProps.services, staff: newProps.staff })
        }
    }

    onCollapse(key){
        const {collapse}=this.state;

        let arrayCollapsed=collapse;

        if(collapse.indexOf(key)===-1){
            arrayCollapsed.push(key)
        }else {
            arrayCollapsed.splice(collapse.indexOf(key), 1)
        }

        localStorage.setItem('services', JSON.stringify(arrayCollapsed))

        this.setState({collapse:arrayCollapsed})
    }

    render() {
        const { services, edit, group_working, staff, selectedProperties, group_workingGroup, editService, editServiceItem, collapse, newSet, idGroupEditable, isLoading  } = this.state;

        return (
            <div>
                {this.state.isLoading ? <div className="zIndex"><Pace color="rgb(42, 81, 132)" height="3"  /></div> : null}

                <div className={"container_wrapper services "+(localStorage.getItem('collapse')=='true'&&' content-collapse')}>
                    {/*<SidebarMain/>*/}
                    <div className={"content-wrapper "+(localStorage.getItem('collapse')=='true'&&' content-collapse')}>
                        <div className="container-fluid">
                            <HeaderMain/>

                            <div className="pages-content container-fluid">

                                <div className="services_list" id="sortable_list">
                                    {
                                        services.services && services.services.map((item, keyGroup)=>
                                            <div className={item.color.toLowerCase() + " "+'row mb-3 service_one collapsible'} key={keyGroup} >

                                                <div className="col-sm-7 buttonsCollapse d-flex align-items-center">
                                                    <div className={item.color.toLowerCase() + "ButtonEdit "+"btn btn-warning text-light float-left mr-3"} onClick={()=>this.onCollapse(item.serviceGroupId)}>
                                                        {collapse.indexOf(item.serviceGroupId)===-1?'-':'+'}
                                                    </div>
                                                    <p className="title_block mt-1">{item.name} {item.description.length===0 ?"": ("("+item.description+")")}</p>
                                                </div>
                                                <div className="col-sm-5 d-flex justify-content-between align-items-center services_buttons">
                                                    <a className="edit_service" href="#" data-toggle="modal"
                                                       data-target=".modal_add_group"  onClick={(e)=>this.handleClick(item.serviceGroupId, false, e, this)}/>
                                                    <a className="delete-icon" id="menu-delete4564" data-toggle="dropdown"
                                                       aria-haspopup="true" aria-expanded="false">
                                                        <img src={`${process.env.CONTEXT}public/img/delete.png`} alt=""/>
                                                    </a>
                                                    <div className="dropdown-menu delete-menu p-3">
                                                        <button type="button" className="button delete-tab"  onClick={()=>this._delete(item.serviceGroupId)}>Удалить</button>
                                                    </div>
                                                    <a href="" data-toggle="modal" data-target=".new-service-modal"
                                                       className="new-service"  onClick={(e)=>this.newService(null, item, e, this)}>Новая услуга</a>
                                                    {/*<span className="ellipsis">*/}
                                                        {/*<img src={`${process.env.CONTEXT}public/img/ellipsis.png`} alt=""/>*/}
                                                    {/*</span>*/}

                                                </div>

                                                { collapse.indexOf(item.serviceGroupId)===-1 && item.services && item.services.length>0 && item.services.map((item2, keyService)=>
                                                    <div className="services_items" key={keyService}  id={"collapseService"+keyGroup}>
                                                        <p className="gray-text">
                                                            {item2.name} {item2.details.length!==0 && "("+item2.details+")"}
                                                            <span className="hide-item">
                                                        <span>{item2.priceFrom} {item2.priceFrom!==item2.priceTo && " - "+item2.priceTo}  {item2.currency}</span>
                                                        <span>{moment.duration(parseInt(item2.duration), "seconds").format("h[ ч] m[ мин]")}</span>
                                                    </span>
                                                        </p>
                                                        <div className="list-inner">
                                                            <span>{item2.priceFrom} {item2.priceFrom!==item2.priceTo && " - "+item2.priceTo}  {item2.currency}</span>
                                                            <span>{moment.duration(parseInt(item2.duration), "seconds").format("h[ ч] m[ мин]")}</span>
                                                            <a className="edit_service" href="#" data-toggle="modal"
                                                               data-target=".new-service-modal"  onClick={(e)=>this.newService(item2, item, e, this)}/>
                                                            <a className="delete-icon" id="menu-delete6633"
                                                               data-toggle="dropdown"
                                                               aria-haspopup="true" aria-expanded="false">
                                                                <img src={`${process.env.CONTEXT}public/img/delete.png`} alt=""/>
                                                            </a>
                                                            <div className="dropdown-menu delete-menu p-3">
                                                                <button type="button"
                                                                        className="button delete-tab" onClick={()=>this.deleteService(item.serviceGroupId, item2.serviceId)}>Удалить
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                { (collapse.indexOf(item.serviceGroupId)===-1 && (!item.services || item.services.length===0)) &&
                                                    <div className="services_items" >
                                                        <p>
                                                            Нет услуг
                                                        </p>
                                                    </div>
                                                }
                                            </div>
                                        )
                                    }
                                </div>
                                <a className="add" href="#"></a>
                                <div className="hide buttons-container">
                                    <div className="p-4">
                                        <button type="button" data-toggle="modal" data-target=".modal_add_group"
                                                className="button" onClick={(e)=>this.handleClick(null, false, e)}>Новая группа услуг
                                        </button>
                                        <button type="button"  data-toggle="modal" data-target=".modal_add_service_by_list_group"
                                                className="button">Новая услуга
                                        </button>
                                    </div>
                                    <div className="arrow"></div>
                                </div>
                            </div>
                            <div className="tab-content">
                                {
                                    (!isLoading && (!services.services || services.services.length===0)) &&
                                    <div className="no-holiday">
                                                <span>
                                                    Услуги не добавлены
                                                    <button type="button"
                                                            className="button mt-3 p-3" data-toggle="modal" data-target=".modal_add_group" onClick={(e)=>this.handleClick(null, false, e)}>Добавить услугу</button>
                                                </span>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>

                </div>
                <AddGroup
                    group_workingGroup={group_workingGroup}
                    edit={edit}
                    update={this.update}
                    add={this.add}
                    newSet={newSet}
                />
                <AddService
                    group_working={group_working}
                    editServiceItem={editServiceItem}
                    updateService={this.updateService}
                    addService={this.addService}
                    staffs={staff.staff}
                    group={idGroupEditable}
                />
                <CreatedService
                    services={services}
                    newServiceGroup={this.handleClick}
                    newServiceFromGroup={this.newService}
                    serviceCurrent={this.state.newSetElement}
                />
                <UserSettings/>
                <UserPhoto/>
            </div>
        );
    }

    handleClick(id, newSet) {
        const { services } = this.state;
        this.setState({...this.state, editService:false});

        if(id!=null) {
            const group_workingGroup = services.services.find((item) => {return id === item.serviceGroupId});

            this.setState({...this.state, edit: true, group_workingGroup: group_workingGroup});
        } else {
            this.setState({...this.state, edit: false, group_workingGroup: {}, newSet: newSet});
        }
    }

    newService(item2, id2) {
        if(item2!=null) {
            this.setState({...this.state, editServiceItem: true, group_working: item2, idGroupEditable: id2});

        } else {
            this.setState({...this.state, editServiceItem: false, group_working: {}, idGroupEditable: id2});
        }
    }

    update(service){
        const { dispatch } = this.props;

        dispatch(servicesActions.update(service));
    };

    add(service, newSet){
        const { dispatch } = this.props;
        if(newSet) {
            this.setState({...this.state, newSetElement: service});
        }

        dispatch(servicesActions.add(JSON.stringify(service)));
    };

    _delete (id){
        const { dispatch } = this.props;

        dispatch(servicesActions._delete(id));
    }

    loadServices(idGroup){
        const { dispatch } = this.props;
        const { selectedProperties } = this.state;
        const selectedItem = selectedProperties;
        const index = selectedProperties.includes(idGroup) && selectedProperties.indexOf(idGroup);

        selectedProperties.includes(idGroup) ? selectedItem.splice(index,1) : selectedItem.push(idGroup);

        this.setState({...this.state, selectedProperties: selectedItem});

        selectedProperties.includes(idGroup) && dispatch(servicesActions.getServiceList(idGroup));
    };

    updateService(service){
        const { dispatch } = this.props;
        const { idGroupEditable } = this.state;

        dispatch(servicesActions.updateService(JSON.stringify(service), idGroupEditable.serviceGroupId));
    };

    addService(service){
        const { dispatch } = this.props;
        const { idGroupEditable } = this.state;

        dispatch(servicesActions.addService(JSON.stringify(service), idGroupEditable.serviceGroupId));
    };

    deleteServiceGroup (id){
        const { dispatch } = this.props;

        dispatch(servicesActions.deleteServiceGroup(id));
    }

    deleteService (groupId, idService){
        const { dispatch } = this.props;

        dispatch(servicesActions.deleteService(groupId, idService));
    }
}

function mapStateToProps(store) {
    const {services, staff}=store;

    return {
        services,
        staff
    };
}

const connectedMainIndexPage = connect(mapStateToProps)(ServicesPage);
export { connectedMainIndexPage as ServicesPage };