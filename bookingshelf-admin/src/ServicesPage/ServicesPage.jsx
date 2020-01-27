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
import DragDrop from "../_components/DragDrop";

class ServicesPage extends Component {
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
            collapse: localStorage.getItem('services')?JSON.parse(localStorage.getItem('services')):[],
            newSet: false,
            newSetElement: null,
            addService: false,
            addGroup: false,
            createdService: false,
            userSettings: false
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
        this.onClose = this.onClose.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.handleDrogEnd = this.handleDrogEnd.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    componentDidMount() {
        document.title = "Услуги | Онлайн-запись";
        initializeJs();
        this.props.dispatch(servicesActions.get());
        this.props.dispatch(staffActions.get());

    }

    componentWillReceiveProps(newProps) {
        if ( JSON.stringify(this.props) !==  JSON.stringify(newProps)) {
            this.setState({...this.state, services: newProps.services,
                userSettings: newProps.authentication.status && newProps.authentication.status===209 ? false : this.state.userSettings,
                addService: newProps.services.status && newProps.services.status===209 ? false : this.state.addService,
                addGroup: newProps.services.status && newProps.services.status===209 ? false : this.state.addGroup,
                createdService: newProps.services.status && newProps.services.status===209 ? false : this.state.createdService,
                staff: newProps.staff })
        }
        if ( JSON.stringify(this.props.services) !==  JSON.stringify(newProps.services)) {
            this.setState({ ...this.state, services: newProps.services, defaultServicesList:  newProps.services })
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

    handleDrogEnd(dragDropGroupsItems) {
        const updatedSortOrderStaffs = []
        dragDropGroupsItems.forEach((item, i) => {
            updatedSortOrderStaffs.push({
                serviceGroupId: item.serviceGroupId,
                sortOrder: i + 1
            })
        })
        this.props.dispatch(servicesActions.updateServiceGroups(updatedSortOrderStaffs))
    }

    render() {
        const { services, edit, group_working, staff, userSettings, selectedProperties, group_workingGroup, editService, editServiceItem, collapse, newSet, idGroupEditable, addService, addGroup, createdService, defaultServicesList, search  } = this.state;
        const isLoading = staff.isLoading || services.isLoading

        const dragDropGroupsItems = []

        services.services && services.services.forEach((item, keyGroup)=> {
            dragDropGroupsItems.push({
                serviceGroupId: item.serviceGroupId,
                id: `service-group-${keyGroup}`,
                content: (
                    <div className={item.color.toLowerCase() + " " + 'row mb-3 service_one collapsible'} key={keyGroup}>

                        <div className="col-sm-7 buttonsCollapse d-flex align-items-center">
                            <div
                                className={item.color.toLowerCase() + "ButtonEdit " + "btn btn-warning text-light float-left mr-3"}
                                onClick={() => this.onCollapse(item.serviceGroupId)}>
                                {collapse.indexOf(item.serviceGroupId) === -1 ? '-' : '+'}
                            </div>
                            <p className="title_block mt-1">{item.name} {item.description.length === 0 ? "" : ("(" + item.description + ")")}</p>
                        </div>
                        <div className="col-sm-5 d-flex justify-content-between align-items-center services_buttons">
                            <a className="edit_service" onClick={(e) => this.handleClick(item.serviceGroupId, false, e, this)}/>
                            <a className="delete-icon" id="menu-delete4564" data-toggle="dropdown"
                               aria-haspopup="true" aria-expanded="false">
                                <img src={`${process.env.CONTEXT}public/img/delete_new.svg`} alt=""/>
                            </a>
                            <div className="dropdown-menu delete-menu p-3">
                                <button type="button" className="button delete-tab"
                                        onClick={() => this._delete(item.serviceGroupId)}>Удалить
                                </button>
                            </div>
                            <a className="new-service" onClick={(e) => this.newService(null, item, e, this)}>Новая услуга</a>
                            {/*<span className="ellipsis">*/}
                            {/*<img src={`${process.env.CONTEXT}public/img/ellipsis.png`} alt=""/>*/}
                            {/*</span>*/}

                        </div>

                        {collapse.indexOf(item.serviceGroupId) === -1 && item.services && item.services.length > 0 &&
                            item.services
                                .sort((a, b) => a.duration - b.duration)
                                .map((item2, keyService) => {
                                return <div className="services_items" key={keyService} id={"collapseService" + keyGroup}>
                                    <p>
                                        <span>{item2.name}</span>
                                        <span style={{
                                            fontSize: '11px',
                                            width: '100%',
                                            display: 'inline-block'
                                        }}>{item2.details.length !== 0 && "(" + item2.details + ")"}</span>
                                        <span className="hide-item">
                                                <span>{item2.priceFrom} {item2.priceFrom !== item2.priceTo && " - " + item2.priceTo} {item2.currency}</span>
                                                <span>{moment.duration(parseInt(item2.duration), "seconds").format("h[ ч] m[ мин]")}</span>
                                                </span>
                                    </p>
                                    <div className="list-inner">
                                        <span>{item2.priceFrom} {item2.priceFrom !== item2.priceTo && " - " + item2.priceTo} {item2.currency}</span>
                                        <span>{moment.duration(parseInt(item2.duration), "seconds").format("h[ ч] m[ мин]")}</span>
                                        <a className="edit_service" onClick={(e) => this.newService(item2, item, e, this)}/>
                                        <a className="delete-icon" id="menu-delete6633"
                                           data-toggle="dropdown"
                                           aria-haspopup="true" aria-expanded="false">
                                            <img src={`${process.env.CONTEXT}public/img/delete_new.svg`} alt=""/>
                                        </a>
                                        <div className="dropdown-menu delete-menu p-3">
                                            <button type="button"
                                                    className="button delete-tab"
                                                    onClick={() => this.deleteService(item.serviceGroupId, item2.serviceId)}>Удалить
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            }
                        )}
                        {(collapse.indexOf(item.serviceGroupId) === -1 && (!item.services || item.services.length === 0)) &&
                        <div className="services_items">
                            <p>
                                Нет услуг
                            </p>
                        </div>
                        }
                    </div>
                )
            })
        })

        return (
            <div>
                {/*{this.state.isLoading ? <div className="zIndex"><Pace color="rgb(42, 81, 132)" height="3"  /></div> : null}*/}
                {isLoading && <div className="loader loader-service"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}

                <div className={"container_wrapper services "+(localStorage.getItem('collapse')=='true'&&' content-collapse')}>
                    {/*<SidebarMain/>*/}
                    <div className={"content-wrapper "+(localStorage.getItem('collapse')=='true'&&' content-collapse')}
                         style={{overflowX: isLoading?"visible":"hidden"}}>
                        <div className="container-fluid">
                            <HeaderMain
                                onOpen={this.onOpen}
                            />

                            <div className="pages-content container-fluid">

                                <div className="services_list" id="sortable_list">
                                    {
                                        (defaultServicesList.services && defaultServicesList!=="" &&
                                        // (1 &&
                                            <div className="row align-items-center content clients mb-2" style={{margin: "0 -15px", width: "calc(100% + 30px)"}}>
                                                <div className="search col-7">
                                                    <input type="search" placeholder="Введите название услуги" style={{width: "175%"}}
                                                           aria-label="Search" ref={input => this.search = input} onChange={this.handleSearch}/>
                                                    <button className="search-icon" type="submit"/>
                                                </div>
                                            </div>
                                        )
                                    }
                                    <DragDrop
                                        dragDropItems={dragDropGroupsItems}
                                        handleDrogEnd={this.handleDrogEnd}
                                    />
                                </div>
                                <a className="add"></a>
                                <div className="hide buttons-container">
                                    <div className="p-4">
                                        <button type="button"
                                                className="button" onClick={(e)=>this.handleClick(null, false, e)}>Новая группа услуг
                                        </button>
                                        <button type="button" onClick={()=>this.setState({...this.state, createdService: true})}
                                                className="button">Новая услуга
                                        </button>
                                    </div>
                                    <div className="arrow"></div>
                                </div>
                            </div>
                            <div className="tab-content">
                                {
                                    (!isLoading && (!services.services || services.services.length===0)) && !search &&
                                    <div className="no-holiday">
                                                <span>
                                                    Услуги не добавлены
                                                    <button type="button"
                                                            className="button mt-3 p-3" onClick={(e)=>this.handleClick(null, false, e)}>Добавить услугу</button>
                                                </span>
                                    </div>
                                }
                                {
                                    (!isLoading && (!services.services || services.services.length===0)) && search &&
                                    <div className="no-holiday">
                                                <span>
                                                    Услуг не найдено
                                                </span>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>

                </div>
                { addGroup &&
                    <AddGroup
                        group_workingGroup={group_workingGroup}
                        edit={edit}
                        update={this.update}
                        add={this.add}
                        newSet={newSet}
                        onClose={this.onClose}
                    />
                }

                { addService &&
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
                {userSettings &&
                <UserSettings
                    onClose={this.onClose}
                />
                }
                <UserPhoto/>
            </div>
        );
    }

    handleClick(id, newSet) {
        const { services } = this.state;
        this.setState({...this.state, editService:false});

        if(id!=null) {
            const group_workingGroup = services.services.find((item) => {return id === item.serviceGroupId});

            this.setState({...this.state, edit: true, addGroup: true, group_workingGroup: group_workingGroup});
        } else {
            this.setState({...this.state, edit: false, addGroup: true, group_workingGroup: {}, newSet: newSet});
        }
    }

    newService(item2, id2) {
        if(item2!=null) {
            this.setState({...this.state, editServiceItem: true, addService: true, group_working: item2, idGroupEditable: id2});

        } else {
            this.setState({...this.state, editServiceItem: false, addService: true, group_working: {}, idGroupEditable: id2});
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

    onClose(){
        this.setState({...this.state, addService: false, addGroup: false, createdService: false, userSettings: false});
    }

    onOpen(){

        this.setState({...this.state, userSettings: true});
    }
    handleSearch () {
        const {defaultServicesList}= this.state;

        const searchServicesList = defaultServicesList.services.filter((item)=>{
            return item.services.some(item => item.name.toLowerCase().includes(this.search.value.toLowerCase()))
                || item.services.some(item => item.details.toLowerCase().includes(this.search.value.toLowerCase()))
                // || item.name.toLowerCase().includes(this.search.value.toLowerCase())
                // || item.description.toLowerCase().includes(this.search.value.toLowerCase())

        });

        this.setState({
            search: true,
            services: {services: searchServicesList}
        });

        if(this.search.value===''){
            this.setState({
                search: true,
                services: defaultServicesList
            })
        }


    }
}

function mapStateToProps(store) {
    const {services, staff, authentication}=store;
    return {
        services,
        staff,
        authentication
    };
}

const connectedMainIndexPage = connect(mapStateToProps)(ServicesPage);
export { connectedMainIndexPage as ServicesPage };
