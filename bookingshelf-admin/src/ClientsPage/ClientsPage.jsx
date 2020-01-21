import React, {Component} from 'react';
import { connect } from 'react-redux';

import {clientActions} from '../_actions';
import {HeaderMain} from "../_components/HeaderMain";

import '../../public/scss/styles.scss'
import '../../public/scss/clients.scss'

import {ClientDetails, NewClient, UserSettings, AddBlackList} from "../_components/modals";
import {UserPhoto} from "../_components/modals/UserPhoto";
import {access} from "../_helpers/access";
import StaffChoice from '../CalendarPage/components/StaffChoice'
import ReactPaginate from 'react-paginate';
import {servicesActions} from "../_actions/services.actions";

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
        this.onChangePage = this.onChangePage.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.updateClients = this.updateClients.bind(this);
    }

    componentDidMount() {

        // this.props.dispatch(clientActions.getClient());
        //this.props.dispatch(clientActions.getClientWithInfo());
        this.props.dispatch(clientActions.getClientV2(1));
        this.props.dispatch(servicesActions.getServices());
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

    handleSearch () {
        if (this.search.value.length >= 3) {
            this.updateClients();
        } else if (this.search.value.length === 0) {
            this.updateClients();
        }
    }

    render() {
        const { staff } = this.props;
        const { client, client_working, edit, activeTab, blackListModal,  defaultClientsList, selectedStaffList, typeSelected, openedModal, userSettings, infoClient } = this.state;
        const isLoading = client ? client.isLoading : false;

        const finalClients = activeTab === 'blacklist' ? client.blacklistedClients : client.client

        const finalTotalPages = activeTab === 'blacklist' ? client.blacklistedTotalPages : client.totalPages

        return (
            <div className="clients-page">
                {/*{this.state.isLoading ? <div className="zIndex"><Pace color="rgb(42, 81, 132)" height="3"  /></div> : null}*/}
                {isLoading && <div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}


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


                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', zIndex: 2 }} className="row align-items-center content clients mb-2">
                                    <StaffChoice
                                        selectedStaff={selectedStaffList && selectedStaffList[0] && JSON.stringify(selectedStaffList[0])}
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

                                <div className="row align-items-center content clients mb-2">
                                    <StaffChoice
                                        selectedStaff={selectedStaffList && selectedStaffList[0] && JSON.stringify(selectedStaffList[0])}
                                        typeSelected={typeSelected}
                                        staff={staff.staff}
                                        availableTimetable={staff.staff}
                                        setWorkingStaff={this.setWorkingStaff}
                                        hideWorkingStaff={true}
                                    />
                                    <div className="search col-7">
                                        <input type="search" placeholder="Искать по имени, email, номеру телефона"
                                               aria-label="Search" ref={input => this.search2 = input} onChange={this.handleSearch}/>
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


                                <div style={{ maxHeight: 'calc(100vh - 225px)', overflowY: 'auto' }}>
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
                                        (!isLoading && (!defaultClientsList.client || defaultClientsList.client.length===0)) &&
                                        <div className="no-holiday">
                                            {(this.search && this.search.value.length > 0)
                                                ? <span>Поиск результатов не дал</span>
                                                : <span>
                                            {client.error ? client.error : 'Клиенты не добавлены'}
                                                    <button type="button"
                                                            className="button mt-3 p-3"
                                                            onClick={(e)=>this.handleClick(null, e)} >Добавить нового клиента</button>
                                      </span>}

                                        </div>
                                    }
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'center'}}>
                                    {finalTotalPages > 1 &&
                                    <ReactPaginate
                                        previousLabel={'⟨'}
                                        nextLabel={'⟩'}
                                        breakLabel={'...'}
                                        pageCount={finalTotalPages}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={5}
                                        onPageChange={this.handlePageClick}
                                        subContainerClassName={'pages pagination'}
                                        breakClassName={'page-item'}
                                        breakLinkClassName={'page-link'}
                                        containerClassName={'pagination'}
                                        pageClassName={'page-item'}
                                        pageLinkClassName={'page-link'}
                                        previousClassName={'page-item'}
                                        previousLinkClassName={'page-link'}
                                        nextClassName={'page-item'}
                                        nextLinkClassName={'page-link'}
                                        activeClassName={'active'}
                                    />
                                    }
                                </div>
                            </div>
                            <a className="add"/>
                            <div className="hide buttons-container">
                                <div className="p-4">
                                    {activeTab==='clients' && <button type="button" className="button"  onClick={(e)=>this.handleClick(null, e)}>Новый клиент</button>}
                                    {activeTab==='blacklist' && <button type="button" className="button"
                                                                        data-target=".add-black-list-modal"
                                                                        data-toggle="modal"
                                                                        onClick={()=>{
                                                                            this.updateClients(1, 'clients')
                                                                            this.openBlackListModal()
                                                                        }}>Добавить в blacklist</button>}
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
                        isLoading={isLoading}
                        clients={client}
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
                    clientId={infoClient}
                    // editClient={this.handleEditClient}
                    editClient={this.handleClick}
                />
                <UserPhoto/>
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

const connectedClientsPage = connect(mapStateToProps)(ClientsPage);
export { connectedClientsPage as ClientsPage };
