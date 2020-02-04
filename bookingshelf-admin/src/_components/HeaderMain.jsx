import React from 'react';
import { connect } from 'react-redux';

import {withRouter} from "react-router";
import PropTypes from "prop-types";
import moment from "moment";
import LogoutPage from "../LogoutPage";
import {calendarActions, clientActions, companyActions, staffActions} from "../_actions";
import {UserSettings, UserPhoto} from "./modals";


class HeaderMain extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state={
            authentication: props.authentication,
            company: props.company,
            isNotificationDropdown: false
        }
        this.openModal = this.openModal.bind(this);
        this.onClose = this.onClose.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);


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
    }

    handleOutsideClick() {
        this.setState({ isNotificationDropdown: false })
    }

    render() {
        const {location, notification }=this.props;
        const {authentication, company, userSettings}=this.state;

        const { count } = company;

        let path="/"+location.pathname.split('/')[1]

        let redTitle
        if (path === '/invoices') {
            redTitle = 'Счета'
        } else {
            redTitle = authentication.user && authentication.menu && authentication.menu[0] && Object.values(authentication.menu[0]).filter((item)=>item.url==path)[0] && Object.values(authentication.menu[0]).filter((item)=>item.url==path)[0].name
        }


        return (
            <div style={{ height: 'auto' }} className="container_wrapper">
                <div style={{ height: 'auto', padding: 0 }} className="content-wrapper full-container">
                    <div className="container-fluid">
                        <div className="no-scroll row retreats">

                            <div className="col-1 mob-menu b">
                                <div>
                                    <img src={`${process.env.CONTEXT}public/img/burger_mob.svg`} alt=""/>
                                </div>
                            </div>

                            {((count && count.appointments && count.appointments.count>0) ||
                            (count && count.canceled && count.canceled.count>0) ||
                            (count && count.moved && count.moved.count>0))
                            && <div className="header-notification"> <span className="menu-notification" onClick={(event)=>this.openAppointments(event)} data-toggle="modal" data-target=".modal_counts">{parseInt(count && count.appointments && count.appointments.count)+parseInt(count && count.canceled && count.canceled.count)+parseInt(count && count.moved && count.moved.count)}</span></div>}

                            <div className="col">
                                <p className="red-title-block mob-setting ">
                                    {redTitle}
                                    </p>
                            </div>
                            <div className="mob-info dropdown">
                                <a onClick={() => {
                                    if (this.props.authentication.user.profile && (this.props.authentication.user.profile.roleId === 4)) {
                                        this.props.dispatch(companyActions.getSubcompanies());
                                    }
                                }} href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <img alt="" src={`${process.env.CONTEXT}public/img/icons/information.svg`}/>
                                </a>
                                <ul className="dropdown-menu">
                                    {(authentication && authentication.user && authentication.user.profile && authentication.user.profile.roleId === 4) ? company.subcompanies.map((subcompany, i) => {
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
                                        if (this.props.authentication.user.profile && (this.props.authentication.user.profile.roleId === 4)) {
                                            this.props.dispatch(companyActions.getSubcompanies());
                                        }
                                    }} className="bth dropdown-toggle rounded-button select-menu" data-toggle="dropdown"
                                         role="menu" aria-haspopup="true" aria-expanded="true">
                                        <p className="firm-name">{company && company.settings && company.settings.companyName}<span>{(company.settings && company.settings.city) ? (company.settings.city + ', ') : ''}{company && company.settings && company.settings["companyAddress" + company.settings.defaultAddress]}</span></p>
                                    </div>

                                    <ul className="dropdown-menu">
                                        {(authentication && authentication.user && authentication.user.profile && authentication.user.profile.roleId === 4) ? company.subcompanies.map((subcompany, i) => {
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
                                <a className="firm-name" onClick={this.openModal}>{authentication && authentication.user.profile.firstName} {authentication && authentication.user.profile.lastName ? authentication.user.profile.lastName : ''}</a>
                                <div className="img-container" data-toggle="modal" data-target=".modal_photo">
                                    <img src={authentication.user.profile.imageBase64 && authentication.user.profile.imageBase64!==''?("data:image/png;base64,"+authentication.user.profile.imageBase64):`${process.env.CONTEXT}public/img/image.png`}/>

                                </div>
                                <span className="log_in">
                                    <LogoutPage/>
                                </span>
                            </div>
                        </div>

                        {userSettings &&
                        <UserSettings
                            onClose={this.onClose}/>
                        }
                        <UserPhoto />
                    </div>
                </div>
            </div>
        );
    }


    openModal() {
        // const {onOpen} = this.props;
        //
        // return onOpen();
        this.setState({ userSettings: true })
    }
    onClose() {
        this.setState({ userSettings: false})
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
    const { alert, authentication, company, notification, calendar: {appointmentsCount} } = state;
    return {
        alert, authentication, company, notification, appointmentsCount
    };
}

HeaderMain.proptypes = {
    location: PropTypes.object.isRequired,
    onOpen: PropTypes.func
};

const connectedApp = connect(mapStateToProps)(withRouter(HeaderMain));
export { connectedApp as HeaderMain };
