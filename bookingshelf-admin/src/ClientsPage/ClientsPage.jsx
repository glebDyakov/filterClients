import React, {Component} from 'react';
import { connect } from 'react-redux';

import {clientActions} from '../_actions';
import {HeaderMain} from "../_components/HeaderMain";

import '../../public/scss/styles.scss'
import '../../public/scss/clients.scss'

import {ClientDetails, NewClient, UserSettings} from "../_components/modals";
import {UserPhoto} from "../_components/modals/UserPhoto";
import Pace from "react-pace-progress";
import {access} from "../_helpers/access";
import StaffChoice from '../CalendarPage/components/StaffChoice'

class ClientsPage extends Component {
    constructor(props) {
        super(props);

        if(!access(4)){
            props.history.push('/denied')
        }
        document.title = "Клиенты | Онлайн-запись";


        this.state = {
            client: props.client,
            edit: false,
            client_working: {},
            selectedStaffList: [],
            typeSelected: 2,
            search: false,
            defaultClientsList:  props.client,
            isLoading: true,
            openedModal: false,
            userSettings: false,
            infoClient: 0

        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.setWorkingStaff = this.setWorkingStaff.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.updateClient = this.updateClient.bind(this);
        this.addClient = this.addClient.bind(this);
        this.onClose = this.onClose.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.downloadFile = this.downloadFile.bind(this);
        this.onOpen = this.onOpen.bind(this);
    }

    componentDidMount() {

        // this.props.dispatch(clientActions.getClient());
        this.props.dispatch(clientActions.getClientWithInfo());
        setTimeout(() => this.setState({ isLoading: false }), 800);
        initializeJs();

    }

    componentWillReceiveProps(newProps) {
        if ( JSON.stringify(this.props.client) !==  JSON.stringify(newProps.client)) {
            this.setState({ openedModal: newProps.client && newProps.client.status && newProps.client.status===209 ? false : this.state.openedModal, client: newProps.client, defaultClientsList:  newProps.client })
        }

        if (JSON.stringify(this.props) !== JSON.stringify(newProps)) {
            this.setState({
                userSettings: newProps.authentication && newProps.authentication.status && newProps.authentication.status===209 ? false : this.state.userSettings
            });
        }
    }

    setWorkingStaff(selectedStaffList, typeSelected) {
        this.setState({ selectedStaffList, typeSelected });
    }

    render() {
        const { staff } = this.props;
        const { client, client_working, edit, defaultClientsList, selectedStaffList, typeSelected, isLoading, openedModal, userSettings, infoClient } = this.state;
        return (
            <div className="clients-page">
                {/*{this.state.isLoading ? <div className="zIndex"><Pace color="rgb(42, 81, 132)" height="3"  /></div> : null}*/}
                {isLoading && <div className="loader loader-client"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}


                <div className={"container_wrapper "+(localStorage.getItem('collapse')=='true'&&' content-collapse')}>
                    <div className={"content-wrapper "+(localStorage.getItem('collapse')=='true'&&' content-collapse')}>
                        <div className="container-fluid">
                            <HeaderMain
                                onOpen={this.onOpen}
                            />
                            <div>

                            </div>
                            {
                                (defaultClientsList.client && defaultClientsList!=="" &&
                                <div className="row align-items-center content clients mb-2">
                                    <StaffChoice
                                      selectedStaff={JSON.stringify(selectedStaffList[0])}
                                      typeSelected={typeSelected}
                                      staff={staff.staff}
                                      availableTimetable={staff.staff}
                                      setWorkingStaff={this.setWorkingStaff}
                                      hideWorkingStaff={true}
                                    />
                                    <div className="search col-7">
                                        <input type="search" placeholder="Искать по имени, email, номеру телефона"
                                               aria-label="Search" ref={input => this.search = input} onChange={this.handleSearch}/>
                                        <button className="search-icon" type="submit"/>
                                    </div>
                                    <div className="col-2 d-flex justify-content-end">
                                        {access(5) &&
                                        <div className="export">

                                            <button   onClick={this.downloadFile} type="button" className="button client-download"
                                               >Экспорт в CSV
                                            </button>
                                        </div>
                                        }
                                    </div>
                                </div>
                                )}
                            { client.client && client.client.map((client_user, i) =>{
                                let condition = true;
                                if (selectedStaffList && selectedStaffList.length) {
                                    condition = client_user.appointments.find(appointment => selectedStaffList.find(selectedStaff => appointment.staffId === selectedStaff.staffId));
                                }
                                return condition && (
                                <div className="tab-content-list mb-2" key={i} style={{position: "relative"}}>
                                    <div style={{position: "relative"}}>
                                        <a onClick={(e)=>this.handleClick(client_user.clientId, e, this)}>
                                            <span className="abbreviation">{client_user.firstName.substr(0, 1)}</span>
                                            <p> {client_user.firstName} {client_user.lastName}</p>
                                        </a>
                                        <div className="clientEye" style={{position: "absolute"}} onClick={()=>this.openClientStats(client_user)}></div>
                                    </div>
                                    <div>
                                        {client_user.email}
                                    </div>
                                    <div>
                                        {client_user.phone}
                                    </div>
                                    <div>
                                        {client_user.country&&(client_user.country)}{client_user.city&&(", "+client_user.city)}{client_user.province&&(", "+client_user.province)}
                                    </div>
                                    <div className="delete dropdown">
                                        <div className="clientEyeDel" onClick={()=>this.openClientStats(client_user)}></div>
                                        <a className="delete-icon menu-delete-icon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <img src={`${process.env.CONTEXT}public/img/delete_new.svg`} alt=""/>
                                        </a>
                                        <div className="dropdown-menu delete-menu p-3">
                                            <button type="button" className="button delete-tab"  onClick={()=>this.deleteClient(client_user.clientId)}>Удалить</button>
                                        </div>
                                    </div>
                                </div>
                                )})}
                            <div className="tab-content">
                            {
                                (!isLoading && (!defaultClientsList.client || defaultClientsList.client.length===0)) &&
                                <div className="no-holiday">
                                                <span>
                                                    Клиенты не добавлены
                                                    <button type="button"
                                                            className="button mt-3 p-3"
                                                            onClick={(e)=>this.handleClick(null, e)} >Добавить нового клиента</button>
                                                </span>
                                </div>
                            }
                            </div>
                            <a className="add"/>
                            <div className="hide buttons-container">
                                <div className="p-4">
                                    <button type="button" className="button"  onClick={(e)=>this.handleClick(null, e)}>Новый клиент</button>
                                </div>
                                <div className="arrow"/>
                            </div>
                        </div>
                    </div>

                </div>
                {openedModal &&
                    <NewClient
                        client_working={client_working}
                        edit={edit}
                        updateClient={this.updateClient}
                        addClient={this.addClient}
                        onClose={this.onClose}
                    />
                }
                {userSettings &&
                <UserSettings
                    onClose={this.onClose}
                />
                }
                <ClientDetails
                    client={infoClient}
                    // editClient={this.handleEditClient}
                    editClient={this.handleClick}
                />
                <UserPhoto/>
            </div>
        );
    }

    handleSearch () {
        const {defaultClientsList}= this.state;

        const searchClientList=defaultClientsList.client.filter((item)=>{
            return item.email.toLowerCase().includes(this.search.value.toLowerCase()) ||
            item.firstName.toLowerCase().includes(this.search.value.toLowerCase()) ||
            item.phone.toLowerCase().includes(this.search.value.toLowerCase())
        });

        this.setState({
            search: true,
            client: {client: searchClientList}
        });

        if(this.search.value===''){
            this.setState({
                search: true,
                client: defaultClientsList
            })
        }
    }

    handleSubmit(e) {
        const { firstName, lastName, email, phone, roleId, workStartMilis, workEndMilis, onlineBooking } = this.state.client;
        const { dispatch } = this.props;

        e.preventDefault();

        this.setState({ submitted: true });

        if (firstName || lastName || email || phone) {
            let params = JSON.stringify({ firstName, lastName, email, phone, roleId, workStartMilis, workEndMilis, onlineBooking });
            dispatch(clientActions.add(params));
        }
    }

    onClose(){
        this.setState({...this.state, openedModal: false, userSettings: false});
    }

    onOpen(){
        this.setState({...this.state, userSettings: true});
    }

    handleClick(id) {
        const { client } = this.state;

        if(id!=null) {
            const client_working = client.client.find((item) => {return id === item.clientId});

            this.setState({...this.state, openedModal: true, edit: true, client_working: client_working});
        } else {
            this.setState({...this.state, openedModal: true, edit: false, client_working: {}});
        }
    }
    openClientStats(client){

        this.setState({...this.state, infoClient: client});
        $('.client-detail').modal('show')

    }

    updateClient(client){
        const { dispatch } = this.props;

        dispatch(clientActions.updateClient(JSON.stringify(client)));
    };

    addClient(client){
        const { dispatch } = this.props;

        dispatch(clientActions.addClient(JSON.stringify(client)));
    };

    deleteClient (id){
        const { dispatch } = this.props;

        dispatch(clientActions.deleteClient(id));
    }

    downloadFile (){
        const { dispatch } = this.props;

        dispatch(clientActions.downloadFile());
    }
}

function mapStateToProps(store) {
    const {client, authentication, staff}=store;

    return {
        client, authentication, staff
    };
}

const connectedClientsPage = connect(mapStateToProps)(ClientsPage);
export { connectedClientsPage as ClientsPage };
