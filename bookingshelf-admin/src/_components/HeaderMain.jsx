import React from 'react';
import { connect } from 'react-redux';

import {withRouter} from "react-router";
import PropTypes from "prop-types";
import moment from "moment";
import LogoutPage from "../LogoutPage";
import {calendarActions, clientActions, companyActions, staffActions} from "../_actions";
import { UserSettings, UserPhoto, ClientDetails, NewClient } from "./modals";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { clientService } from "../_services";
import { isValidNumber } from "libphonenumber-js";
import { isValidEmailAddress } from "../_helpers/validators";
import { access } from "../_helpers/access";


class HeaderMain extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state={
            authentication: props.authentication,
            company: props.company,
            search: '',
            selectedTypeahead: [],
            typeAheadOptions: {
                clientFirstName: {
                    label: 'Имя',
                    selectedKey: 'firstName',
                    options: [],
                },
            },
            isNotificationDropdown: false
        };

        this.openModal = this.openModal.bind(this);
        this.onClose = this.onClose.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.updateClients = this.updateClients.bind(this);
        this.handleUpdateClient = this.handleUpdateClient.bind(this);
        this.handleEditClient = this.handleEditClient.bind(this);
        this.onCloseClient = this.onCloseClient.bind(this);
        this.updateClient = this.updateClient.bind(this);
        this.addClient = this.addClient.bind(this);
        this.handleSearchOutsideClick = this.handleSearchOutsideClick.bind(this);
    }

    componentDidMount() {
        $('.mob-menu').click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            $('.sidebar').slideDown();
        });
    }

    componentWillReceiveProps(newProps) {
        if ( JSON.stringify(this.props) !==  JSON.stringify(newProps)) {
            this.setState({ authentication: newProps.authentication,
            })

        }
        if ( JSON.stringify(this.props.company) !==  JSON.stringify(newProps.company)) {
            this.setState({
                company: newProps.company
            })

        }
    }

    componentDidUpdate() {
        if(this.state.isNotificationDropdown) {
            document.addEventListener('click', this.handleOutsideClick, false);
        } else {
            document.removeEventListener('click', this.handleOutsideClick, false);
        }
        if(this.state.isSearchDropdown) {
            document.addEventListener('click', this.handleSearchOutsideClick, false);
        } else {
            document.removeEventListener('click', this.handleSearchOutsideClick, false);
        }
    }

    handleSearchOutsideClick() {
        this.setState({ isSearchDropdown: false, search: '' })
    }

    handleEditClient(client, isModalShouldPassClient) {
        if(client) {
            this.setState({ editClient: true, client_working: client, isModalShouldPassClient, newClientModal: true });
        } else {
            this.setState({ editClient: false, client_working: null, isModalShouldPassClient, newClientModal: true });
        }
    }

    handleOutsideClick() {
        this.setState({ isNotificationDropdown: false })
    }

    checkUser(client){
        this.props.dispatch(clientActions.getActiveClientAppointments(client.clientId, 1))
        this.setState({ clientChecked: { ...client, appointments: this.props.clients.activeClientAppointments} });
    }

    removeCheckedUser(skippedKey){
        const checkingProps = { clientChecked: null, clientFirstName: null, clientPhone: null, clientLastName: null, clientEmail: null, selectedTypeahead: [] }
        const updatedState = {}
        Object.entries(checkingProps).forEach(([objKey , objValue]) => {
            if (objKey !== skippedKey) {
                updatedState[objKey] = objValue
            }
        });
        this.setState(updatedState);
    }

    handleSearch ({ target: { value }}) {
        const search = value;
        if (search.length >= 3) {
            this.updateClients(value);
            this.setState({ isSearchDropdown: true })
        } else if (search.length === 0) {
            this.updateClients(value);
        }
        this.setState({ search })
    }

    updateClients(search) {
        const currentPage = 1;
        let searchValue = '';
        if (search.length >= 3) {
            searchValue = search.toLowerCase()
        }
        this.props.dispatch(clientActions.getClientV2(currentPage, searchValue));
    }

    handleUpdateClient(client) {
        this.setState({
            infoClient: client
        })
    }

    renderMenuItemChildren(option = {}) {
        const visibleKeys = ['firstName', 'lastName', 'phone', 'email'];

        return (
            <div onClick={() => {
                $('.header-client-detail').modal('show')
                this.handleUpdateClient(option.clientId)
            }} className="search-wrapper">
                <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                    <span>{option[visibleKeys[0]]}</span>
                    <span>{option[visibleKeys[1]]}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                    <span>{option[visibleKeys[2]]}</span>
                    <span>{option[visibleKeys[3]]}</span>
                </div>
            </div>
        );
    }

    onCloseClient(){
        this.setState({ newClientModal: false });
    }

    render() {
        const { location, staff, clients } = this.props;
        const { authentication, newClientModal, client_working, editClient, isModalShouldPassClient, company, search, infoClient, collapse, isSearchDropdown }=this.state;


        const { count } = company;

        const activeStaff = staff && staff.find(item =>
            ((item.staffId) === (authentication.user && authentication.user.profile && authentication.user.profile.staffId)));

        let staffType;
        if (authentication.user && authentication.user.profile && authentication.user.profile.roleId) {
            switch (authentication.user.profile.roleId) {
                case 1:
                case 2:
                    staffType = 'Сотрудник'
                    break;
                case 3:
                    staffType = 'Админ'
                    break;
                case 4:
                    staffType = 'Владелец'
                    break;
                default:
            }
        }


        return (
            <div style={{ height: 'auto' }} className="container_wrapper">
                <div style={{ height: 'auto', padding: 0 }} className="content-wrapper full-container">
                    <div className="container-fluid">
                        <div id="header-layout" className={"no-scroll row retreats" + (localStorage.getItem('collapse') === 'true' ? ' collapsed-header' : '')}>

                            <div className="col-1 mob-menu b">
                                <div>
                                    <img src={`${process.env.CONTEXT}public/img/burger_mob.svg`} alt=""/>
                                </div>
                            </div>

                            {((count && count.appointments && count.appointments.count>0) ||
                            (count && count.canceled && count.canceled.count>0) ||
                            (count && count.moved && count.moved.count>0))
                            && <div className="header-notification">
                                <span className="menu-notification" onClick={(event)=>this.openAppointments(event)} data-toggle="modal" data-target=".modal_counts">{parseInt(count && count.appointments && count.appointments.count)+parseInt(count && count.canceled && count.canceled.count)+parseInt(count && count.moved && count.moved.count)}</span>
                            </div>}

                            <div style={{ marginLeft: '34px' }} className="col search-col">
                                <div className="search-header search col-12">
                                    <input type="search" placeholder="Поиск по имени, номеру тел., имейлу"
                                           aria-label="Search" value={search} onChange={this.handleSearch}/>
                                    <button className="search-icon" type="submit"/>
                                </div>
                                {isSearchDropdown && search.length >= 3 && clients.client && (
                                    <div className="search-content-wrapper">
                                        {clients.client.map(item => this.renderMenuItemChildren(item))}
                                    </div>)}
                            </div>

                            <div className="mob-info dropdown">
                                <a onClick={() => {
                                    this.props.dispatch(companyActions.getSubcompanies());
                                }} href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <img alt="" src={`${process.env.CONTEXT}public/img/icons/information.svg`}/>
                                </a>
                                <ul className="dropdown-menu">
                                    {true ? company.subcompanies.map((subcompany, i) => {
                                        return (
                                            <div onClick={() => {
                                                this.props.dispatch(companyActions.switchSubcompany(subcompany))
                                            }}>
                                                {subcompany.defaultAddress === 1 && subcompany.companyAddress1.length > 0 &&
                                                <li>
                                                    <p className="firm-name">{subcompany.companyName}<span>{subcompany.city ? (subcompany.city + ', ') : ''}{subcompany.companyAddress1}</span>
                                                    </p>
                                                </li>
                                                }
                                                {subcompany.defaultAddress === 2 && subcompany.companyAddress2.length > 0 &&
                                                <li>
                                                    <p className="firm-name">{subcompany.companyName}<span>{subcompany.city ? (subcompany.city + ', ') : ''}{subcompany.companyAddress2}</span>
                                                    </p>
                                                </li>
                                                }
                                                {subcompany.defaultAddress === 3 && subcompany.companyAddress3.length> 0 &&
                                                <li>
                                                    <p className="firm-name">{subcompany.companyName}<span>{subcompany.city ? (subcompany.city + ', ') : ''}{subcompany.companyAddress3}</span>
                                                    </p>
                                                </li>
                                                }
                                            </div>
                                        )
                                    }) : (
                                            <React.Fragment>
                                                {company && company.settings && company.settings.defaultAddress === 1 && company.settings.companyAddress1.length > 0 &&
                                                <li>
                                                    <p className="firm-name">{company && company.settings && company.settings.companyName}<span>{company && company.settings && company.settings.companyAddress1}</span>
                                                    </p>
                                                </li>
                                                }
                                                {company && company.settings && company.settings.defaultAddress === 2 && company.settings.companyAddress2.length > 0 &&
                                                <li>
                                                    <p className="firm-name">{company && company.settings && company.settings.companyName}<span>{company && company.settings && company.settings.companyAddress2}</span>
                                                    </p>
                                                </li>
                                                }
                                                {company && company.settings && company.settings.defaultAddress === 3 && company.settings.companyAddress3.length>0 &&
                                                <li>
                                                    <p className="firm-name">{company && company.settings && company.settings.companyName}<span>{company && company.settings && company.settings.companyAddress3}</span>
                                                    </p>
                                                </li>
                                                }
                                            </React.Fragment>
                                        )

                                    }
                                </ul>
                            </div>
                            <div className="col firm-chosen">
                                <div className="dropdown">
                                    <div onClick={() => {
                                        this.props.dispatch(companyActions.getSubcompanies());
                                    }} className="bth dropdown-toggle rounded-button select-menu" data-toggle="dropdown"
                                         role="menu" aria-haspopup="true" aria-expanded="true">
                                        <p className="firm-name">{company && company.settings && company.settings.companyName}<span>{(company.settings && company.settings.city) ? (company.settings.city + ', ') : ''}{company && company.settings && company.settings["companyAddress" + company.settings.defaultAddress]}</span></p>
                                    </div>

                                    <ul className="dropdown-menu">
                                        {true ? company.subcompanies.map((subcompany, i) => {
                                            return (
                                               <div onClick={() => {
                                                       this.props.dispatch(companyActions.switchSubcompany(subcompany))
                                               }}>
                                                   {subcompany.defaultAddress === 1 && subcompany.companyAddress1.length > 0 &&
                                                   <li>
                                                       <p className="firm-name">{subcompany.companyName}<span>{subcompany.city ? (subcompany.city + ', ') : ''}{subcompany.companyAddress1}</span>
                                                       </p>
                                                   </li>
                                                   }
                                                   {subcompany.defaultAddress === 2 && subcompany.companyAddress2.length > 0 &&
                                                   <li>
                                                       <p className="firm-name">{subcompany.companyName}<span>{subcompany.city ? (subcompany.city + ', ') : ''}{subcompany.companyAddress2}</span>
                                                       </p>
                                                   </li>
                                                   }
                                                   {subcompany.defaultAddress === 3 && subcompany.companyAddress3.length> 0 &&
                                                   <li>
                                                       <p className="firm-name">{subcompany.companyName}<span>{subcompany.city ? (subcompany.city + ', ') : ''}{subcompany.companyAddress3}</span>
                                                       </p>
                                                   </li>
                                                   }
                                               </div>
                                            )
                                        }) : (
                                            <React.Fragment>
                                                {company && company.settings && company.settings.defaultAddress === 1 && company.settings.companyAddress1.length > 0 &&
                                                <li>
                                                    <p className="firm-name">{company && company.settings && company.settings.companyName}<span>{company && company.settings && company.settings.companyAddress1}</span>
                                                    </p>
                                                </li>
                                                }
                                                {company && company.settings && company.settings.defaultAddress === 2 && company.settings.companyAddress2.length > 0 &&
                                                <li>
                                                    <p className="firm-name">{company && company.settings && company.settings.companyName}<span>{company && company.settings && company.settings.companyAddress2}</span>
                                                    </p>
                                                </li>
                                                }
                                                {company && company.settings && company.settings.defaultAddress === 3 && company.settings.companyAddress3.length>0 &&
                                                <li>
                                                    <p className="firm-name">{company && company.settings && company.settings.companyName}<span>{company && company.settings && company.settings.companyAddress3}</span>
                                                    </p>
                                                </li>
                                                }
                                            </React.Fragment>
                                        )

                                        }


                                    </ul>
                                </div>
                            </div>
                            <div className="col right_elements">
                                <span className="time_show" id="doc_time">{moment().format('HH:mm')}</span>
                                <div style={{ position: "relative" }}>
                                    <span className="notification" onClick={() => {
                                        $('#__replain_widget').addClass('__replain_widget_show')
                                        $('#__replain_widget_iframe').contents().find(".btn-img").click()
                                        $("#__replain_widget_iframe").contents().find(".hide-chat").bind("click", function() {
                                            $('#__replain_widget').removeClass('__replain_widget_show')
                                        });
                                    }}/>
                                </div>
                                <a className="setting" onClick={this.openModal}/>
                                <a className="firm-name" onClick={this.openModal}>
                                    {authentication && authentication.user.profile.firstName} {authentication && authentication.user.profile.lastName ? authentication.user.profile.lastName : ''}
                                    <p style={{ fontSize: '11px' }}>{staffType}</p>
                                </a>
                                <div className="img-container" data-toggle="modal" data-target=".modal_photo">
                                    <img src={activeStaff && activeStaff.imageBase64 && authentication.user.profile.imageBase64!==''?("data:image/png;base64,"+activeStaff.imageBase64):`${process.env.CONTEXT}public/img/image.png`}/>

                                </div>
                                <span className="log_in">
                                    <LogoutPage/>
                                </span>
                            </div>
                        </div>

                        <UserSettings onClose={this.onClose}/>
                        <ClientDetails
                            wrapper={"header-client-detail"}
                            clientId={infoClient}
                            editClient={this.handleEditClient}
                        />
                        {newClientModal &&
                        <NewClient
                            client_working={client_working}
                            edit={editClient}
                            isModalShouldPassClient={isModalShouldPassClient}
                            updateClient={this.updateClient}
                            checkUser={this.checkUser}
                            addClient={this.addClient}
                            onClose={this.onCloseClient}
                        />
                        }

                        <UserPhoto />
                    </div>
                </div>
            </div>
        );
    }

    updateClient(client, blacklisted){
        const { dispatch } = this.props;

        dispatch(clientActions.updateClient(JSON.stringify(client), blacklisted));
    };

    addClient(client){
        const { dispatch } = this.props;

        dispatch(clientActions.addClient(JSON.stringify(client)));
    };


    openModal() {
        // const {onOpen} = this.props;
        //
        // return onOpen();

        $('.modal_user_setting').modal('show');
    }
    onClose() {
        $('.modal_user_setting').modal('hide');
    }
    openAppointments(){
        this.props.dispatch(staffActions.get());
        // this.props.dispatch(clientActions.getClientWithInfo())
        this.props.dispatch(calendarActions.getAppointmentsCount(moment().startOf('day').format('x'), moment().add(7, 'month').endOf('month').format('x')));
        this.props.dispatch(calendarActions.getAppointmentsCanceled(moment().startOf('day').format('x'), moment().add(7, 'month').endOf('month').format('x')));

        // this.props.dispatch(calendarActions.getAppointmentsCount(moment().startOf('day').format('x'), moment().add(7, 'month').endOf('month').format('x')));
        // this.props.dispatch(calendarActions.getAppointmentsCanceled(moment().startOf('day').format('x'), moment().add(7, 'month').endOf('month').format('x')));
        // this.props.dispatch(companyActions.getNewAppointments());
    }
}

function mapStateToProps(state) {
    const { alert, authentication, company, client, notification, calendar: {appointmentsCount}, staff } = state;
    return {
        alert, authentication, company, clients: client, notification, appointmentsCount, staff: staff.staff
    };
}

HeaderMain.proptypes = {
    location: PropTypes.object.isRequired,
    onOpen: PropTypes.func
};

const connectedApp = connect(mapStateToProps)(withRouter(HeaderMain));
export { connectedApp as HeaderMain };
