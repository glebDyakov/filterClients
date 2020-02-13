import React, {Component} from 'react';
import { connect } from 'react-redux';

import {clientActions} from '../_actions';

import '../../public/scss/clients.scss'

import {ClientDetails, NewClient, AddBlackList} from "../_components/modals";
import {access} from "../_helpers/access";
import StaffChoice from '../CalendarPage/components/StaffChoice'
import {servicesActions} from "../_actions/services.actions";
import Paginator from "../_components/Paginator";

class Index extends Component {
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
            infoClient: 0

        };

        this.uploadFile = React.createRef();
        this.onFileChange = this.onFileChange.bind(this);
        this.addToBlackList = this.addToBlackList.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setWorkingStaff = this.setWorkingStaff.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.updateClient = this.updateClient.bind(this);
        this.addClient = this.addClient.bind(this);
        this.onClose = this.onClose.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.downloadFile = this.downloadFile.bind(this);
        this.closeBlackListModal = this.closeBlackListModal.bind(this);
        this.openBlackListModal = this.openBlackListModal.bind(this);
        this.handleFileSubmit = this.handleFileSubmit.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.updateClients = this.updateClients.bind(this);
        this.queryInitData = this.queryInitData.bind(this);
    }

    componentDidMount() {
        if (this.props.authentication.loginChecked) {
            this.queryInitData()
        }
        initializeJs();
    }

    queryInitData() {
        // this.props.dispatch(clientActions.getClient());
        //this.props.dispatch(clientActions.getClientWithInfo());
        this.props.dispatch(clientActions.getClientV2(1));
        this.props.dispatch(servicesActions.getServices());
    }

    componentWillReceiveProps(newProps) {
        if (this.props.authentication.loginChecked !== newProps.authentication.loginChecked) {
            this.queryInitData()
        }
        if ( JSON.stringify(this.props.client) !==  JSON.stringify(newProps.client)) {
            this.setState({ openedModal: newProps.client && newProps.client.status && newProps.client.status===209 ? false : this.state.openedModal, client: newProps.client, defaultClientsList:  newProps.client })
        }
    }

    setWorkingStaff(selectedStaffList, typeSelected) {
        this.setState({ selectedStaffList, typeSelected });
    }

    setTab(tab){
        this.setState({
            activeTab: tab
        })

        this.updateClients(1, tab);
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
        console.log(this.state.uploadFile)
        const formData = new FormData();
        formData.append('file', this.state.uploadFile);

        const reader = new FileReader();

        this.props.dispatch(clientActions.uploadFile(formData))
        // this.props.dispatch(clientActions.uploadFile(reader.readAsDataURL(this.state.uploadFile)))
        // this.props.dispatch(clientActions.uploadFile(this.state.uploadFile))
    }

    onChangePage (pageOfItems) {
        this.setState({ pageOfItems: pageOfItems });
    };
    handlePageClick(data) {
        const { selected } = data;
        const currentPage = selected + 1;
        this.updateClients(currentPage);
    };

    updateClients(currentPage = 1, tab = this.state.activeTab) {
        let searchValue = ''
        if (this.search.value.length >= 3) {
            searchValue = this.search.value.toLowerCase()
        }

        const blacklisted = tab === 'blacklist';
        this.props.dispatch(clientActions.getClientV2(currentPage, searchValue, blacklisted));
    }

    addToBlackList() {
        this.updateClients(1, 'clients')
        this.openBlackListModal()
    }

    handleSearch () {
        if (this.search.value.length >= 3) {
            this.updateClients();
        } else if (this.search.value.length === 0) {
            this.updateClients();
        }
    }

    render() {
        const { staff } = this.props;
        const { client, client_working, edit, activeTab, blackListModal,  defaultClientsList, selectedStaffList, typeSelected, openedModal, infoClient } = this.state;
        const isLoading = client ? client.isLoading : false;

        const finalClients = activeTab === 'blacklist' ? client.blacklistedClients : client.client

        const finalTotalPages = activeTab === 'blacklist' ? client.blacklistedTotalPages : client.totalPages

        return (
            <div className="clients-page">
                {isLoading && <div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}
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


                <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', zIndex: 1 }} className="row align-items-center content clients mb-2">
                        <StaffChoice
                            selectedStaff={selectedStaffList && selectedStaffList[0] && JSON.stringify(selectedStaffList[0])}
                            typeSelected={typeSelected}
                            staff={staff.staff}
                            timetable={staff.staff}
                            setWorkingStaff={this.setWorkingStaff}
                            hideWorkingStaff={true}
                        />
                        <div className="search col-7">
                            <input type="search" placeholder="Поиск по имени, номеру тел., имейлу"
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


                    <div className="final-clients">
                        {finalClients && finalClients.map((client_user, i) =>{
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
                                                this.updateClient({...client_user, blacklisted: false}, true)
                                            }}>Удалить</button>}
                                        </div>
                                    </div>
                                </div>
                            )}
                        )}
                    </div>

                    <div className="tab-content">
                        {
                            (!isLoading && (!defaultClientsList[activeTab === 'clients' ? 'client' : 'blacklistedClients'] || defaultClientsList[activeTab === 'clients' ? 'client' : 'blacklistedClients'].length===0)) &&
                            <div className="no-holiday">
                                {(this.search && this.search.value.length > 0)
                                    ? <span>Поиск результатов не дал</span>
                                    : (
                                        <span>
                                            {client.error ? client.error : 'Клиенты не добавлены'}
                                            {activeTab==='clients' &&
                                                <button
                                                    type="button"
                                                    className="button mt-3 p-3"
                                                    onClick={(e)=>this.handleClick(null, e)}
                                                >
                                                    Добавить нового клиента
                                                </button>
                                            }
                                            {activeTab==='blacklist' &&
                                                <button
                                                    type="button"
                                                    className="button mt-3 p-3"
                                                    data-target=".add-black-list-modal"
                                                    data-toggle="modal"
                                                    onClick={this.addToBlackList}
                                                >
                                                    Добавить в blacklist
                                                </button>
                                            }
                                        </span>)
                                }

                            </div>
                        }
                    </div>

                    <Paginator
                        finalTotalPages={finalTotalPages}
                        onPageChange={this.handlePageClick}
                    />
                </div>
                <a className="add"/>
                <div className="hide buttons-container">
                    <div className="p-4">
                        {activeTab==='clients' && <button type="button" className="button"  onClick={(e)=>this.handleClick(null, e)}>Новый клиент</button>}
                        {activeTab==='blacklist' && <button type="button" className="button"
                                                            data-target=".add-black-list-modal"
                                                            data-toggle="modal"
                                                            onClick={this.addToBlackList}>Добавить в blacklist</button>}
                    </div>
                    <div className="arrow"/>
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
                        isLoading={isLoading}
                        clients={client}
                        updateClient={this.updateClient}
                        addClient={this.addClient}
                        onClose={this.closeBlackListModal}
                    />
                }
                <ClientDetails
                    clientId={infoClient}
                    // editClient={this.handleEditClient}
                    editClient={this.handleClick}
                />
            </div>
        );
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
        this.setState({...this.state, openedModal: false});
    }

    openBlackListModal() {
        this.setState({ blackListModal: true });
    }

    closeBlackListModal() {
        this.setState({ blackListModal: false })
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

        this.setState({ infoClient: client.clientId });
        $('.client-detail').modal('show')

    }

    updateClient(client, blacklisted){
        const { dispatch } = this.props;

        dispatch(clientActions.updateClient(JSON.stringify(client), blacklisted));
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

export default connect(mapStateToProps)(Index);
