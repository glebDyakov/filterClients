import React, {Component} from 'react';
import { connect } from 'react-redux';

import {clientActions} from '../_actions';
import {HeaderMain} from "../_components/HeaderMain";

import '../../public/scss/styles.scss'
import '../../public/scss/clients.scss'

import {ClientDetails, NewClient, UserSettings, AddBlackList} from "../_components/modals";
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
            activeTab: 'clients',
            openedModal: false,
            blackListModal: false,
            userSettings: false,
            infoClient: 0

        };

        this.uploadFile = React.createRef();
        this.onFileChange = this.onFileChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setWorkingStaff = this.setWorkingStaff.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.updateClient = this.updateClient.bind(this);
        this.addClient = this.addClient.bind(this);
        this.onClose = this.onClose.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.downloadFile = this.downloadFile.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.closeBlackListModal = this.closeBlackListModal.bind(this);
        this.openBlackListModal = this.openBlackListModal.bind(this);
        this.handleFileSubmit = this.handleFileSubmit.bind(this);
    }

    componentDidMount() {

        // this.props.dispatch(clientActions.getClient());
        this.props.dispatch(clientActions.getClientWithInfo());
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

    setTab(tab){
        this.setState({
            activeTab: tab
        })

        // if(tab==='clients') {document.title = "Доступы | Онлайн-запись";}
        // if(tab==='blacklist'){document.title = "Выходные дни | Онлайн-запись"}
        // if(tab==='staff'){document.title = "Сотрудники | Онлайн-запись"}
        // if(tab==='workinghours'){document.title = "Рабочие часы | Онлайн-запись"}

        //history.pushState(null, '', '/staff/'+tab);

    }

    getData(result) {
        this.setState({data: result.data});
    }

    onFileChange(e) {
        let uploadFile = e.target.files[0]

        this.setState({ uploadFile })
        //
        // Papa.parse(csvData, {
        //     complete: this.getData
        // });
    }

    handleFileSubmit(e) {
        e.preventDefault();
        console.log(e)
        debugger
        console.log(this.state.uploadFile)
        const formData = new FormData();
        formData.append('file', this.state.uploadFile);

        debugger
        const reader = new FileReader();

        this.props.dispatch(clientActions.uploadFile(formData))
        // this.props.dispatch(clientActions.uploadFile(reader.readAsDataURL(this.state.uploadFile)))
        // this.props.dispatch(clientActions.uploadFile(this.state.uploadFile))
    }

    render() {
        const { staff } = this.props;
        const { client, client_working, edit, activeTab, blackListModal,  defaultClientsList, selectedStaffList, typeSelected, openedModal, userSettings, infoClient } = this.state;
        const isLoading = client ? client.isLoading : false;
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
                            <div className="flex-content col-xl-12">
                                <ul className="nav nav-tabs">
                                    <li className="nav-item">
                                        <a className={"nav-link"+(activeTab==='clients'?' active show':'')} data-toggle="tab" href="#tab1" onClick={()=>{this.setTab('clients')}}>Клиенты</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className={"nav-link"+(activeTab==='blacklist'?' active show':'')} data-toggle="tab" href="#tab2" onClick={()=>this.setTab('blacklist')}>Blacklist</a>
                                    </li>
                                </ul>
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
                                        {/*{access(5) &&*/}
                                        {/*<div className="export">*/}
                                        {/*    <form onSubmit={this.handleFileSubmit} encType="multipart/form-data">*/}
                                        {/*        <input onChange={this.onFileChange} type="file" className="button client-download" ref={this.uploadFile} />*/}
                                        {/*        <input type="submit" value="Загрузить" />*/}
                                        {/*    </form>*/}
                                        {/*</div>}*/}
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
                                if ((typeSelected !== 2) && selectedStaffList && selectedStaffList.length) {

                                    condition = client_user.appointments.find(appointment => selectedStaffList.find(selectedStaff => appointment.staffId === selectedStaff.staffId));

                                }
                                return condition && (activeTab === 'blacklist' ? client_user.blacklisted : !client_user.blacklisted) && (
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
                                        {client_user.country&&(client_user.country)}{client_user.city&&((client_user.country && ", ")+client_user.city)}{client_user.province&&(((client_user.country || client_user.city) &&", ")+client_user.province)}
                                    </div>
                                    <div className="delete dropdown">
                                        <div className="clientEyeDel" onClick={()=>this.openClientStats(client_user)}></div>
                                        <a className="delete-icon menu-delete-icon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <img src={`${process.env.CONTEXT}public/img/delete_new.svg`} alt=""/>
                                        </a>
                                        <div className="dropdown-menu delete-menu p-3">
                                            {activeTab === 'clients' && <button type="button" className="button delete-tab"  onClick={()=>this.deleteClient(client_user.clientId)}>Удалить</button>}
                                            {activeTab === 'blacklist' && <button type="button" className="button delete-tab"  onClick={()=>{
                                                delete client_user.appointments;
                                                this.updateClient({...client_user, blacklisted: false})
                                            }}>Удалить</button>}
                                        </div>
                                    </div>
                                </div>
                                )})}
                            <div className="tab-content">
                            {
                                (!isLoading && (!defaultClientsList.client || defaultClientsList.client.length===0)) &&
                                <div className="no-holiday">
                                                <span>
                                                    {client.error ? client.error : 'Клиенты не добавлены'}
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
                                    {activeTab==='clients' && <button type="button" className="button"  onClick={(e)=>this.handleClick(null, e)}>Новый клиент</button>}
                                    {activeTab==='blacklist' && <button type="button" className="button"
                                                                        data-target=".add-black-list-modal"
                                                                        data-toggle="modal"
                                                                        onClick={()=>this.openBlackListModal()}>Добавить в blacklist</button>}
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
                {blackListModal &&
                    <AddBlackList
                        clients={client.client}
                        updateClient={this.updateClient}
                        addClient={this.addClient}
                        onClose={this.closeBlackListModal}
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

    openBlackListModal() {
        this.setState({ blackListModal: true });
    }

    closeBlackListModal() {
        this.setState({ blackListModal: false })
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
