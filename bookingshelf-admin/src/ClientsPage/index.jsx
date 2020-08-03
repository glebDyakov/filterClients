import React, {Component} from 'react';
import {connect} from 'react-redux';

import {clientActions} from '../_actions';

import '../../public/scss/clients.scss'
import moment, {now} from 'moment';
import {ClientDetails, NewClient, AddBlackList} from "../_components/modals";
import {access} from "../_helpers/access";
import StaffChoice from '../CalendarPage/components/StaffChoice'
import {servicesActions} from "../_actions/services.actions";
import Paginator from "../_components/Paginator";
import {staffActions} from "../_actions/staff.actions";
import ActionModal from "../_components/modals/ActionModal";
import UserInfo from "./UserInfo";

class Index extends Component {
    constructor(props) {
        super(props);

        if (!access(4)) {
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
            defaultClientsList: props.client,
            activeTab: 'clients',
            openedModal: false,
            blackListModal: false,
            infoClient: 0,
            clientForDel: 0,
            handleOpen: false,
            isOpenDropdownMenu: false,
        };

        this.uploadFile = React.createRef();
        this.onFileChange = this.onFileChange.bind(this);
        this.addToBlackList = this.addToBlackList.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setWorkingStaff = this.setWorkingStaff.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.updateClient = this.updateClient.bind(this);
        this.addClient = this.addClient.bind(this);
        this.openClientStats = this.openClientStats.bind(this);
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
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleOpenDropdownMenu = this.handleOpenDropdownMenu.bind(this);
        this.isLeapYear = this.isLeapYear.bind(this);
        this.calcDiff = this.calcDiff.bind(this);

    }

    handleOpenModal(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({handleOpen: !this.state.handleOpen});
    }

    handleOpenDropdownMenu() {
            // this.setState(state => {
            //     console.log(state.isOpenDropdownMenu, !state.isOpenDropdownMenu)
            //     return {isOpenDropdownMenu: !state.isOpenDropdownMenu};
            // });

        this.setState({isOpenDropdownMenu: !this.state.isOpenDropdownMenu})

    }



    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.activeTab !== prevState.activeTab) {
            this.setState({isOpenDropdownMenu: false});
        }
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({handleOpen: false});
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);

        if (this.props.authentication.loginChecked) {
            this.queryInitData()
        }
        initializeJs();

    }

    queryInitData() {
        // this.props.dispatch(clientActions.getClient());
        //this.props.dispatch(clientActions.getClientWithInfo());
        this.props.dispatch(staffActions.get());
        this.props.dispatch(clientActions.getClientV2(1));
    }

    componentWillReceiveProps(newProps) {
        if (this.props.authentication.loginChecked !== newProps.authentication.loginChecked) {
            this.queryInitData()
        }
        if (JSON.stringify(this.props.client) !== JSON.stringify(newProps.client)) {
            this.setState({
                openedModal: newProps.client && newProps.client.status && newProps.client.status === 209 ? false : this.state.openedModal,
                client: newProps.client,
                defaultClientsList: newProps.client
            })
        }


    }

    setWorkingStaff(selectedStaffList, typeSelected) {
        this.setState({selectedStaffList, typeSelected});
    }

    setTab(tab) {
        this.setState({
            activeTab: tab
        })

        this.updateClients(1, tab)


    }

    getData(result) {
        this.setState({data: result.data});
    }

    onFileChange(e) {
        let uploadFile = e.target.files[0]

        this.setState({uploadFile})
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

    onChangePage(pageOfItems) {
        this.setState({pageOfItems: pageOfItems});
    };

    handlePageClick(data) {
        const {selected} = data;
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

    isLeapYear(year) {
        return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
    }

    calcDiff(date) {
        const diff = moment(date).year(2000).diff(moment().year(2000), 'days');
        if (diff < 0) {
            return (this.isLeapYear(moment().year()) ? 366 : 365) + diff;
        } else return diff;
    }

    handleSearch() {
        if (this.search.value.length >= 3) {
            this.updateClients();
        } else if (this.search.value.length === 0) {
            this.updateClients();
        }
    }

    render() {
        const {staff} = this.props;
        const {client, client_working, edit, activeTab, blackListModal, defaultClientsList, selectedStaffList, typeSelected, openedModal, infoClient} = this.state;
        const isLoading = client ? client.isLoading : false;


        const finalClients = activeTab === 'blacklist' ? client.blacklistedClients : client.client;

        const finalTotalPages = activeTab === 'blacklist' ? client.blacklistedTotalPages : client.totalPages;

        // sort((a, b) => {
        //     if (moment(a.birthDate).year(2000).diff(moment().year(2000), 'days') >= 0) {
        //         return moment(a.birthDate).year(2000).diff(moment().year(2000), 'days') - moment(b.birthDate).year(2000).diff(moment().year(2000), 'days');
        //     }
        // })


        return (
            <div className="clients-page">
                {isLoading &&
                <div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}


                <div style={{position: 'relative'}} className="clients-page-container">
                    <div style={{zIndex: 2}}
                         className="row content clients">
                        {/*<StaffChoice*/}
                        {/*    selectedStaff={selectedStaffList && selectedStaffList[0] && JSON.stringify(selectedStaffList[0])}*/}
                        {/*    typeSelected={typeSelected}*/}
                        {/*    staff={staff.staff}*/}
                        {/*    timetable={staff.staff}*/}
                        {/*    setWorkingStaff={this.setWorkingStaff}*/}
                        {/*    hideWorkingStaff={true}*/}
                        {/*/>*/}

                        <div className="search">
                            <input type="search" placeholder="Поиск клиента"
                                   aria-label="Search" ref={input => this.search = input} onChange={this.handleSearch}/>
                            <button className="search-icon" type="submit"/>
                        </div>

                        <div className="header-tabs d-flex">
                            <a className={"nav-link" + (activeTab === 'clients' ? ' active show' : '')}
                               data-toggle="tab" href="#tab1" onClick={() => {
                                this.setTab('clients')
                            }}>Клиенты</a>
                            <a className={"nav-link" + (activeTab === 'blacklist' ? ' active show' : '')}
                               data-toggle="tab" href="#tab2" onClick={() => this.setTab('blacklist')}>Черный список</a>
                        </div>

                        <div className={"header-tabs-mob" + (this.state.isOpenDropdownMenu ? " opened" : '')}>
                            <p onClick={this.handleOpenDropdownMenu}
                               className="dropdown-button">{activeTab === 'clients' ? "Клиенты" : "Черный список"}</p>

                            {this.state.isOpenDropdownMenu && (
                                <div className="dropdown-buttons">
                                    <a className={"nav-link" + (activeTab === 'clients' ? ' active show' : '')}
                                       data-toggle="tab" href="#tab1" onClick={() => {
                                        this.setTab('clients');
                                        this.handleOpenDropdownMenu();
                                    }}>Клиенты</a>
                                    <a className={"nav-link" + (activeTab === 'blacklist' ? ' active show' : '')}
                                       data-toggle="tab" href="#tab2" onClick={() => {
                                        this.setTab('blacklist');
                                        this.handleOpenDropdownMenu();
                                    }}>Черный список</a>
                                </div>
                            )}
                        </div>


                        <div className="col-2 d-flex justify-content-end export-container">
                            {/*{access(5) &&*/}
                            {/*<div className="export">*/}
                            {/*    <form onSubmit={this.handleFileSubmit} encType="multipart/form-data">*/}
                            {/*        <input onChange={this.onFileChange} type="file" className="button client-download" ref={this.uploadFile} />*/}
                            {/*        <input type="submit" value="Загрузить" />*/}
                            {/*    </form>*/}
                            {/*</div>}*/}
                            {access(5) &&
                            <div className="export">

                                <button onClick={this.downloadFile} type="button" className="button client-download"
                                >Скачать CSV
                                </button>
                            </div>
                            }
                        </div>
                    </div>


                    <div className="final-clients">
                        <div className="tab-content-list" style={{position: "relative"}}>
                            <div className="column-header">Имя клиента</div>
                            <div className="column-header">Телефон/Email</div>
                            <div className="column-header">Адрес</div>
                            <div className="column-header">Последний визит</div>
                            <div className="column-header">Скидка</div>
                            <div className="column-header">День Рождения</div>
                        </div>

                        {finalClients && finalClients.sort((a, b) => {
                                    return this.calcDiff(a.birthDate) - this.calcDiff(b.birthDate);
                        }).map((client_user, i) => {
                                let condition = true;
                                if ((typeSelected !== 2) && selectedStaffList && selectedStaffList.length) {

                                    condition = client_user.appointments.find(appointment => selectedStaffList.find(selectedStaff => appointment.staffId === selectedStaff.staffId));

                                }
                                return condition && (activeTab === 'blacklist' ? client_user.blacklisted : !client_user.blacklisted) && (
                                    <UserInfo
                                    client_user={client_user}
                                    activeTab={activeTab}
                                    i={i}
                                    dispatch={this.props.dispatch}
                                    handleClick={this.handleClick}
                                    updateClient={this.updateClient}
                                    openClientsStats={this.openClientStats}

                                    />
                                );
                            }
                        )}
                    </div>

                    <div className="tab-content">
                        {
                            (!isLoading && (!defaultClientsList[activeTab === 'clients' ? 'client' : 'blacklistedClients'] || defaultClientsList[activeTab === 'clients' ? 'client' : 'blacklistedClients'].length === 0)) &&
                            <div className="no-holiday">
                                {(this.search && this.search.value.length > 0)
                                    ? <span>Поиск результатов не дал</span>
                                    : (
                                        <span>
                                            {client.error ? client.error : 'Клиенты не добавлены'}
                                            {activeTab === 'clients' &&
                                            <button
                                                type="button"
                                                className="button mt-3 p-3"
                                                onClick={(e) => this.handleClick(null, e)}
                                            >
                                                Добавить нового клиента
                                            </button>
                                            }
                                            {activeTab === 'blacklist' &&
                                            <button
                                                type="button"
                                                className="button mt-3 p-3"
                                                data-target=".add-black-list-modal"
                                                data-toggle="modal"
                                                onClick={this.addToBlackList}
                                            >
                                                Добавить в черный список
                                            </button>
                                            }
                                        </span>)
                                }

                            </div>
                        }
                    </div>

                    <div className="paginator-wrapper">
                        <Paginator
                            finalTotalPages={finalTotalPages}
                            onPageChange={this.handlePageClick}
                        />
                    </div>
                </div>
                <div ref={this.setWrapperRef}>
                    <a className={"add" + (this.state.handleOpen ? ' rotate' : '')} href="#"
                       onClick={this.handleOpenModal}/>
                    <div className={"buttons-container" + (this.state.handleOpen ? '' : ' hide')}>
                        <div className="buttons">
                            {activeTab === 'clients' &&
                            <button type="button" className="button" onClick={(e) => {
                                this.handleClick(null, e);
                                this.handleOpenModal();
                            }}>Новый
                                клиент</button>}
                            {activeTab === 'blacklist' && <button type="button" className="button"
                                                                  data-target=".add-black-list-modal"
                                                                  data-toggle="modal"
                                                                  onClick={this.addToBlackList}>Добавить в
                                черный список</button>}
                        </div>
                        <div className="arrow"/>
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
                <ClientDetails
                    clientId={infoClient}
                    // editClient={this.handleEditClient}
                    editClient={this.handleClick}
                />



            </div>
        );
    }

    handleSubmit(e) {
        const {firstName, lastName, email, phone, roleId, workStartMilis, workEndMilis, onlineBooking} = this.state.client;
        const {dispatch} = this.props;


        e.preventDefault();

        this.setState({submitted: true});

        if (firstName || lastName || email || phone) {
            let params = JSON.stringify({
                firstName,
                lastName,
                email,
                phone,
                roleId,
                workStartMilis,
                workEndMilis,
                onlineBooking
            });
            dispatch(clientActions.add(params));
        }
    }

    onClose() {
        this.setState({...this.state, openedModal: false});
    }

    openBlackListModal() {
        this.setState({blackListModal: true});
    }

    closeBlackListModal() {
        this.setState({blackListModal: false})
    }

    handleClick(id) {
        const {client} = this.state;

        if (id != null) {
            const client_working = client.client.find((item) => {
                return id === item.clientId
            });

            this.setState({...this.state, openedModal: true, edit: true, client_working: client_working});
        } else {
            this.setState({...this.state, openedModal: true, edit: false, client_working: {}});
        }
    }

    openClientStats(client) {

        this.setState({infoClient: client.clientId});
        $('.client-detail').modal('show')

    }

    updateClient(client, blacklisted) {
        const {dispatch} = this.props;

        dispatch(clientActions.updateClient(JSON.stringify(client), blacklisted));
    };

    addClient(client) {
        const {dispatch} = this.props;

        dispatch(clientActions.addClient(JSON.stringify(client)));
    };



    downloadFile() {
        const {dispatch} = this.props;

        dispatch(clientActions.downloadFile());
    }
}

function mapStateToProps(store) {
    const {client, authentication, staff} = store;

    return {
        client, authentication, staff
    };
}

export default connect(mapStateToProps)(Index);
