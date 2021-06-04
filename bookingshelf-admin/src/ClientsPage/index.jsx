import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { ClientDetails, NewClient, AddBlackList } from '../_components/modals';
import Paginator from '../_components/Paginator';
import UserInfo from './UserInfo';

import { staffActions } from '../_actions/staff.actions';
import { clientActions } from '../_actions';
import { clientService } from "../_services";

import { access } from '../_helpers/access';

import '../../public/scss/clients.scss';
import {withTranslation} from "react-i18next";
import { store } from '../_helpers';

class Index extends Component {
  
  needClean = false
  clients = [];

  constructor(props) {
    super(props);

    if (!access(4)) {
      props.history.push('/denied');
    }
    document.title = props.t('Клиенты | Онлайн-запись');

    this.state = {
      activeClients: '',
      regularClients: '',
      inactiveClients: '',
      missingClients: '',
      notvisitedClients: '',
      newClients: '',
      blacklistedClients: '',
      problemClients: '',
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
      filterEnable:false,
      checkboxFilters:
      [false,
        false,
        false,
        false,
        false,
        false,
        false,
        false],
        allClients:[],
        SortClients:[]
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
    this.activeFilterChange=this.activeFilterChange.bind(this)
    this.inActiveFilterChange=this.inActiveFilterChange.bind(this)
    this.missingFilterChange=this.missingFilterChange.bind(this)
    this.problemFilterChange=this.problemFilterChange.bind(this)
    this.blackListFilterChange=this.blackListFilterChange.bind(this)
    this.notVisitedFilterChange=this.notVisitedFilterChange.bind(this)
    this.regularFilterChange=this.regularFilterChange.bind(this)
    this.newFilterChange=this.newFilterChange.bind(this)
    
  }

  handleOpenModal(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ handleOpen: !this.state.handleOpen });
  }

  handleOpenDropdownMenu() {
    this.setState({ isOpenDropdownMenu: !this.state.isOpenDropdownMenu });
  }


  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.activeTab !== prevState.activeTab) {
      this.setState({ isOpenDropdownMenu: false });
    }
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ handleOpen: false });
    }
  }

   componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);

    if (this.props.authentication.loginChecked) {
      this.queryInitData();
    }
    initializeJs();
    
  }
 async componentWillMount(){


  const activeClients = await clientService.getClientsByType('active')
  const regularClients = await clientService.getClientsByType('regular')
  const inactiveClients = await clientService.getClientsByType('inactive')
  const missingClients = await clientService.getClientsByType('missing')
  const notvisitedClients = await clientService.getClientsByType('notvisited')
  const newClients = await clientService.getClientsByType('new')
  const blacklistedClients = await clientService.getClientsByType('blacklisted')
  const problemClients = await clientService.getClientsByType('problem')
  
  this.setState({
    activeClients: await clientService.getClientsByType('active'),
    regularClients: await clientService.getClientsByType('regular'),
    inactiveClients: await clientService.getClientsByType('inactive'),
    missingClients: await clientService.getClientsByType('missing'),
    notvisitedClients: await clientService.getClientsByType('notvisited'),
    newClients: await clientService.getClientsByType('new'),
    blacklistedClients: await clientService.getClientsByType('blacklisted'),
    problemClients: await clientService.getClientsByType('problem'),
    
  })
    

  this.setState({
    allClients: [
      ...this.state.problemClients,
      ...this.state.activeClients,
      ...this.state.inactiveClients,
      ...this.state.regularClients,
      ...this.state.missingClients,
      ...this.state.notvisitedClients,
      ...this.state.newClients,
      ...this.state.blacklistedClients
    ]
  })

  await this.setState({
    SortClients: this.state.allClients
  })

  
  }
  queryInitData() {
    // this.props.dispatch(clientActions.getClient());
    // this.props.dispatch(clientActions.getClientWithInfo());
    this.props.dispatch(staffActions.get());
    this.props.dispatch(clientActions.getClientV2(1));
  }

  componentWillReceiveProps(newProps) {
    if (this.props.authentication.loginChecked !== newProps.authentication.loginChecked) {
      this.queryInitData();
    }
    if (JSON.stringify(this.props.client) !== JSON.stringify(newProps.client)) {
      this.setState({
        openedModal: newProps.client && newProps.client.status &&
          newProps.client.status === 209 ? false : this.state.openedModal,
        client: newProps.client,
        defaultClientsList: newProps.client,
      });
    }
  }

  setWorkingStaff(selectedStaffList, typeSelected) {
    this.setState({ selectedStaffList, typeSelected });
  }

  setTab(tab) {
    this.setState({
      activeTab: tab,
    });

    this.updateClients(1, tab);
  }

  onFileChange(e) {
    const uploadFile = e.target.files[0];

    this.setState({ uploadFile });
  }

  handleFileSubmit(e) {
    e.preventDefault();
    console.log(e);
    console.log(this.state.uploadFile);
    const formData = new FormData();
    formData.append('file', this.state.uploadFile);

    this.props.dispatch(clientActions.uploadFile(formData));
  }

  onChangePage(pageOfItems) {
    this.setState({ pageOfItems: pageOfItems });
  };

  handlePageClick(data) {
    const { selected } = data;
    const currentPage = selected + 1;
    this.updateClients(currentPage);
  };

  updateClients(currentPage = 1, tab = this.state.activeTab) {
    let searchValue = '';
    if (this.search.value.length >= 3) {
      searchValue = this.search.value.toLowerCase().replace(/[+]/g, '');
    }

    const blacklisted = tab === 'blacklist';
    this.props.dispatch(clientActions.getClientV2(currentPage, searchValue, blacklisted));
  }

  addToBlackList() {
    this.updateClients(1, 'clients');
    this.openBlackListModal();
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

ChangeFilter=()=>{
  this.setState({filterEnable:!this.state.filterEnable})
  this.clients = []
  if(this.state.filterEnable){
    for(let customcheckbox of document.querySelectorAll('.customcheckboxes')) {
      customcheckbox.checked = false
    }
    this.setState({SortClients:this.state.allClients})
    
    this.setState({
      checkboxFilters: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ]
    })
    
  }
}

  SortFilterChange=(filterIndex) => {
    if(this.state.checkboxFilters[filterIndex]){
      if(this.needClean){
        this.clients = []
        this.needClean = false
      }
      if(filterIndex == 0 && this.state.activeClients !== ""){
        this.clients =  [ ...this.clients, ...this.state.activeClients ]
      }
      if(filterIndex == 1 && this.state.regularClients !== ""){
        this.clients = [ ...this.clients, ...this.state.regularClients ]
      }
      if(filterIndex == 2 && this.state.inactiveClients !== ""){
        this.clients = [ ...this.clients, ...this.state.inactiveClients ]
      }
      if(filterIndex == 3 && this.state.missingClients !== ""){
        this.clients = [ ...this.clients, ...this.state.missingClients ]
      }
      if(filterIndex == 4  && this.state.notvisitedClients !== ""){
        this.clients = [ ...this.clients, ...this.state.notvisitedClients ]
      }
      if(filterIndex == 5  && this.state.newClients !== ""){
        this.clients = [ ...this.clients, ...this.state.newClients ]
      }
      if(filterIndex == 6  && this.state.problemClients !== ""){
        this.clients = [ ...this.clients, ...this.state.problemClients ]
      }
      if(filterIndex == 7  && this.state.blacklistedClients !== ""){
        this.clients = [ ...this.clients, ...this.state.blacklistedClients ]
      }
    }
    else if(!this.state.checkboxFilters[filterIndex]){
      this.clients = []
      this.state.checkboxFilters.map((checkboxFilter, checkboxFilterIndex) => {
        if(this.state.checkboxFilters.every((value) => {
            this.needClean = true
            return value === false
          })
        ) {
          this.clients =this.state.allClients
        } else if(checkboxFilter){
          if(checkboxFilterIndex == 0 && this.state.activeClients !== ""){
            this.state.activeClients.map((activeClient) => {
              this.clients.push(activeClient)
            })
          } else if(checkboxFilterIndex == 1 && this.state.regularClients !== ""){
            this.state.regularClients.map((regularClient) => {
              this.clients.push(regularClient)
            })
          } else if(checkboxFilterIndex == 2 && this.state.inactiveClients !== ""){
            this.state.inactiveClients.map((inactiveClient) => {
              this.clients.push(inactiveClient)
            })
          } else if(checkboxFilterIndex == 3 && this.state.missingClients !== ""){
            this.state.missingClients.map((missingClient) => {
              this.clients.push(missingClient)
            })
          } else if(checkboxFilterIndex == 4  && this.state.notvisitedClients !== ""){
            this.state.notvisitedClients.map((notvisitedClient) => {
              this.clients.push(notvisitedClient)
            })
          } else if(checkboxFilterIndex == 5  && this.state.newClients !== ""){
            this.state.newClients.map((newClient) => {
              this.clients.push(newClient)
            })
          } else if(checkboxFilterIndex == 6  && this.state.problemClients !== ""){
            this.state.problemClients.map((problemClient) => {
              this.clients.push(problemClient)
            })
          } else if(checkboxFilterIndex == 7  && this.state.blacklistedClients !== ""){
            this.state.blacklistedClients.map((blacklistedClient) => {
              this.clients.push(blacklistedClient)
            })
          }
        }
      })
        
      
     
    }
     this.setState({
      SortClients: this.clients
     })
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  
  activeFilterChange(){
    if(this.state.filterEnable){
      const actualFilters = this.state.checkboxFilters
      actualFilters[0] = !this.state.checkboxFilters[0]
      this.setState({
        checkboxFilters: actualFilters
      })
      this.SortFilterChange(0)
    }
  }

  regularFilterChange=()=>{
    if(this.state.filterEnable){
      const actualFilters = this.state.checkboxFilters
      actualFilters[1] = !this.state.checkboxFilters[1]
      this.setState({
        checkboxFilters: actualFilters
      })
      this.SortFilterChange(1)
    }
  }

  inActiveFilterChange=()=>{
    if(this.state.filterEnable){
      const actualFilters = this.state.checkboxFilters
      actualFilters[2] = !this.state.checkboxFilters[2]
      this.setState({
        checkboxFilters: actualFilters
      })
      this.SortFilterChange(2)
    }
  }

  missingFilterChange=()=>{
    if(this.state.filterEnable){
      const actualFilters = this.state.checkboxFilters
      actualFilters[3] = !this.state.checkboxFilters[3]
      this.setState({
        checkboxFilters: actualFilters
      })
      this.SortFilterChange(3)
    }
  }

  notVisitedFilterChange=()=>{
    if(this.state.filterEnable){
      const actualFilters = this.state.checkboxFilters
      actualFilters[4] = !this.state.checkboxFilters[4]
      this.setState({
        checkboxFilters: actualFilters
      })
      this.SortFilterChange(4)
    }
  }

  newFilterChange=()=>{
    if(this.state.filterEnable){
      const actualFilters = this.state.checkboxFilters
      actualFilters[5] = !this.state.checkboxFilters[5]
      this.setState({
        checkboxFilters: actualFilters
      })
      this.SortFilterChange(5)
    }
  }

  problemFilterChange=()=>{
    if(this.state.filterEnable){
      const actualFilters = this.state.checkboxFilters
      actualFilters[6] = !this.state.checkboxFilters[6]
      this.setState({
        checkboxFilters: actualFilters
      })
      this.SortFilterChange(6)
    }
  }

  blackListFilterChange=()=>{
    if(this.state.filterEnable){
      const actualFilters = this.state.checkboxFilters
      actualFilters[7] = !this.state.checkboxFilters[7]
      this.setState({
        checkboxFilters: actualFilters
      })
      this.SortFilterChange(7)
    }
  }
  
  

  render() {
    const {
      client, client_working, edit, activeTab, blackListModal, defaultClientsList, selectedStaffList,
      typeSelected, openedModal, infoClient,
    } = this.state;
    const isLoading = client ? client.isLoading : false;

    const finalClients = activeTab === 'blacklist' ? client.blacklistedClients : client.client;
    const finalTotalPages = activeTab === 'blacklist' ? client.blacklistedTotalPages : client.totalPages;

    const { t } = this.props;

    const companyTypeId = this.props.company && this.props.company.settings && this.props.company.settings.companyTypeId;

    
    
    
    //console.log(clients[0].address);

    return (
      <div style={{ display: "flex"  }}>
        <div  style={{ overflow: "scroll", height: "500px", width:"350px", margin: "0px 5px" }} className="clients-page">
          <div>
            <div style={{ display: "flex"  }}>
            <input   onChange={this.ChangeFilter} type="checkbox" />
            <p className="font-weight-bold">Фильтры</p>
            </div>
            <div style={{ display: 'flex' }}>
              <input className={'customcheckboxes'} disabled={!this.state.filterEnable}  type="checkbox" onChange={this.activeFilterChange}/>
              <p className="font-weight-bold">Наиболее активные</p>
              <div className="text-light" style={{boxSizing: 'border-box', padding: '10px', textAlign: 'center', width: '30px', height: '30px', backgroundColor: 'cyan', borderRadius: '100%' }}>{ this.state.activeClients.length }</div>
            </div>
            <div style={{ display: 'flex' }}>
            <input className={'customcheckboxes'}  disabled={!this.state.filterEnable} type="checkbox" onChange={this.regularFilterChange}/>
            <p className="font-weight-bold">Постоянные</p>
            <div className="text-light" style={{ boxSizing: 'border-box', padding: '10px', textAlign: 'center', width: '30px', height: '30px', backgroundColor: 'green', borderRadius: '100%' }}>{ this.state.regularClients.length }</div>
            </div>
            <div style={{ display: 'flex' }}>
            <input className={'customcheckboxes'} disabled={!this.state.filterEnable} type="checkbox" onChange={this.inActiveFilterChange}/>
            <p className="font-weight-bold">Не активные</p>
            <div className="text-light" style={{ boxSizing: 'border-box', padding: '10px', textAlign: 'center', width: '30px', height: '30px', backgroundColor: 'orange', borderRadius: '100%' }}>{ this.state.inactiveClients.length }</div>
            </div>
            <div style={{ display: 'flex' }}>
            <input className={'customcheckboxes'} disabled={!this.state.filterEnable} type="checkbox" onChange={this.missingFilterChange}/>
            <p className="font-weight-bold">Пропавшие</p>
            <div className="text-light" style={{ boxSizing: 'border-box', padding: '10px', textAlign: 'center', width: '30px', height: '30px', backgroundColor: 'red', borderRadius: '100%' }}>{ this.state.missingClients.length }</div>
            </div>
            <div style={{ display: 'flex' }}>
            <input className={'customcheckboxes'} disabled={!this.state.filterEnable} type="checkbox" onChange={this.notVisitedFilterChange}/>
            <p className="font-weight-bold">Не посещали</p>
            <div className="text-light" style={{ boxSizing: 'border-box', padding: '10px', textAlign: 'center', width: '30px', height: '30px', backgroundColor: 'black', borderRadius: '100%' }}>{ this.state.notvisitedClients.length }</div>
            </div>
            <div style={{ display: 'flex' }}>
            <input className={'customcheckboxes'} disabled={!this.state.filterEnable} type="checkbox" onChange={this.newFilterChange}/>
            <p className="font-weight-bold">Новые клиенты</p>
            <div className="text-light" style={{ boxSizing: 'border-box', padding: '10px', textAlign: 'center', width: '30px', height: '30px', backgroundColor: 'blue', borderRadius: '100%' }}>{ this.state.newClients.length }</div>
            </div>
            <div style={{ display: 'flex' }}>
            <input className={'customcheckboxes'} disabled={!this.state.filterEnable} type="checkbox" onChange={this.problemFilterChange}/>
            <p className="font-weight-bold">Проблемные</p>
            <div className="text-light" style={{ boxSizing: 'border-box', padding: '10px', textAlign: 'center', width: '30px', height: '30px', backgroundColor: 'black', borderRadius: '100%' }}>{ this.state.problemClients.length }</div>
            </div>
            <div style={{ display: 'flex' }}>
            <input className={'customcheckboxes'} disabled={!this.state.filterEnable}  type="checkbox" onChange={this.blackListFilterChange}/>
            <p className="font-weight-bold">Черный список</p>
            <div className="text-light" style={{ boxSizing: 'border-box', padding: '10px', textAlign: 'center', width: '30px', height: '30px', backgroundColor: 'black', borderRadius: '100%' }}>{ this.state.blacklistedClients.length }</div>
            </div>
          </div>
        </div>
        <div className="clients-page">
          
          {isLoading &&
                  <div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}
          <div style={{ position: 'relative' }} className="clients-page-container">
            <div style={{ zIndex: 2 }} className="row content clients">
              {/* <StaffChoice*/}
              {/*    selectedStaff={selectedStaffList && selectedStaffList[0] && JSON.stringify(selectedStaffList[0])}*/}
              {/*    typeSelected={typeSelected}*/}
              {/*    staff={staff.staff}*/}
              {/*    timetable={staff.staff}*/}
              {/*    setWorkingStaff={this.setWorkingStaff}*/}
              {/*    hideWorkingStaff={true}*/}
              {/* />*/}
              
              <div className="search">
                
                <input type="search" placeholder={(companyTypeId === 4 ? t("Поиск пациента") : t("Поиск клиента"))}
                  aria-label="Search" ref={(input) => this.search = input} onChange={this.handleSearch}/>
                <button className="search-icon" type="submit"/>
              </div>

              <div className="header-tabs d-flex">
                
                <a className={'nav-link' + (activeTab === 'clients' ? ' active show' : '')}
                  data-toggle="tab" href="#tab1" onClick={() => {
                    this.setTab('clients');
                  }}>{companyTypeId === 4 ? t("Пациенты") : t("Клиенты")}</a>
                <a className={'nav-link' + (activeTab === 'blacklist' ? ' active show' : '')}
                  data-toggle="tab" href="#tab2" onClick={() => this.setTab('blacklist')}>{t("Черный список")}</a>
              </div>

              <div className={'header-tabs-mob' + (this.state.isOpenDropdownMenu ? ' opened' : '')}>
                <p onClick={this.handleOpenDropdownMenu}
                  className="dropdown-button">{activeTab === 'clients' ? (companyTypeId === 4 ? t("Пациенты") : t("Клиенты")) : t('Черный список')}</p>

                {this.state.isOpenDropdownMenu && (
                  <div className="dropdown-buttons">
                    <a className={'nav-link' + (activeTab === 'clients' ? ' active show' : '')}
                      data-toggle="tab" href="#tab1" onClick={() => {
                        this.setTab('clients');
                        this.handleOpenDropdownMenu();
                      }}>{companyTypeId === 4 ? t("Пациенты") : t("Клиенты")}</a>
                    <a className={'nav-link' + (activeTab === 'blacklist' ? ' active show' : '')}
                      data-toggle="tab" href="#tab2" onClick={() => {
                        this.setTab('blacklist');
                        this.handleOpenDropdownMenu();
                      }}>{t("Черный список")}</a>
                  </div>
                )}
              </div>
              
              <div className="col-2 d-flex justify-content-end export-container">
                {/* {access(5) &&*/}
                {/* <div className="export">*/}
                {/*    <form onSubmit={this.handleFileSubmit} encType="multipart/form-data">*/}
                {/*        <input onChange={this.onFileChange} type="file" className="button client-download"
                ref={this.uploadFile} />*/}
                {/*        <input type="submit" value="Загрузить" />*/}
                {/*    </form>*/}
                {/* </div>}*/}
                {access(5) &&
                  <div className="export">
                    <button onClick={this.downloadFile} type="button" className="button client-download">
                      {t("Скачать CSV")}
                    </button>
                  </div>
                }
              </div>
            </div>

            <div className="final-clients">
              <div className="tab-content-list" style={{ position: 'relative' }}>
                <div className="column-header">{companyTypeId === 4 ? t("Имя пациента") : t("Имя клиента")}</div>
                <div className="column-header">{t("Телефон/Email")}</div>
                <div className="column-header">{t("Адрес")}</div>
                <div className="column-header">{t("Последний визит")}</div>
                <div className="column-header">{t("Скидка")}</div>
                <div className="column-header">{t("День Рождения")}</div>
              </div>
                
              {finalClients && this.state.SortClients.map((client_user, i) => {
                let condition = true;
                if ((typeSelected !== 2) && selectedStaffList && selectedStaffList.length) {
                  condition = client_user.appointments.find((appointment) => selectedStaffList
                    .find((selectedStaff) => appointment.staffId === selectedStaff.staffId),
                  );
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
              },
              )}
            </div>

            <div className="tab-content">
              {(!isLoading && (!defaultClientsList[activeTab === 'clients' ? 'client' : 'blacklistedClients']
                || defaultClientsList[activeTab === 'clients' ? 'client' : 'blacklistedClients'].length === 0)) &&
                  <div className="no-holiday">
                    {(this.search && this.search.value.length > 0)
                      ? <span>{t("Поиск результатов не дал")}</span>
                      : (
                        <span>
                          {client.error ? client.error : (companyTypeId === 4 ? t("Пациенты не добавлены") : t('Клиенты не добавлены'))}
                          {activeTab === 'clients' &&
                                  <button
                                    type="button"
                                    className="button mt-3 p-3"
                                    onClick={(e) => this.handleClick(null, e)}
                                  >
                                      {companyTypeId === 4 ? t("Добавить нового пациента") : t("Добавить нового клиента")}
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
                                    {t("Добавить в черный список")}
                                  </button>
                          }
                        </span>
                      )
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
            <a className={'add' + (this.state.handleOpen ? ' rotate' : '')} href="#" onClick={this.handleOpenModal}/>
            <div className={'buttons-container' + (this.state.handleOpen ? '' : ' hide')}>
              <div className="buttons">
                {activeTab === 'clients' &&
                  <button type="button" className="button" onClick={(e) => {
                    this.handleClick(null, e);
                    this.handleOpenModal();
                  }}
                  >
                    {companyTypeId === 4 ? t("Новый пациент") : t("Новый клиент")}
                  </button>
                }
                {activeTab === 'blacklist' &&
                  <button type="button" className="button"
                    data-target=".add-black-list-modal"
                    data-toggle="modal"
                    onClick={this.addToBlackList}
                  >
                    {t("Добавить в черный список")}
                  </button>
                }
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
      </div>
    );
  }

  handleSubmit(e) {
    const {
      firstName, lastName, email, phone, roleId, workStartMilis, workEndMilis, onlineBooking,
    } = this.state.client;
    const { dispatch } = this.props;

    e.preventDefault();

    this.setState({ submitted: true });

    if (firstName || lastName || email || phone) {
      const params = JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
        roleId,
        workStartMilis,
        workEndMilis,
        onlineBooking,
      });
      dispatch(clientActions.add(params));
    }
  }

  onClose() {
    this.setState({ ...this.state, openedModal: false });
  }

  openBlackListModal() {
    this.setState({ blackListModal: true });
  }

  closeBlackListModal() {
    this.setState({ blackListModal: false });
  }

  handleClick(id) {
    const { client } = this.state;

    if (id != null) {
      const client_working = client.client.find((item) => {
        return id === item.clientId;
      });

      this.setState({ openedModal: true, edit: true, client_working: client_working });
    } else {
      this.setState({ openedModal: true, edit: false, client_working: {} });
    }
  }

  openClientStats(client) {
    this.setState({ infoClient: client.clientId });
    $('.client-detail').modal('show');
  }

  updateClient(client, blacklisted) {
    const { dispatch } = this.props;

    dispatch(clientActions.updateClient(JSON.stringify(client), blacklisted));
  };

  addClient(client) {
    const { dispatch } = this.props;

    dispatch(clientActions.addClient(JSON.stringify(client)));
  };


  downloadFile() {
    const { dispatch } = this.props;

    dispatch(clientActions.downloadFile());
  }
}

function mapStateToProps(store) {
  const { client, authentication, staff, company } = store;

  return {
    client, authentication, staff, company
  };
}

export default connect(mapStateToProps)(withTranslation("common")(Index));
