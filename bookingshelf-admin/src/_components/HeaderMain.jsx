import React from 'react';
import { connect } from 'react-redux';

import {withRouter} from "react-router";
import PropTypes from "prop-types";
import moment from "moment";
import {LogoutPage} from "../LogoutPage";
import {userActions} from "../_actions";

class HeaderMain extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            authentication: props.authentication,
            company: props.company
        }
        this.openModal = this.openModal.bind(this);


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

    render() {
        const {location}=this.props;
        const {authentication, company}=this.state;

        let path="/"+location.pathname.split('/')[1]

        return (
            <div className={"no-scroll row retreats "+(localStorage.getItem('collapse')==='true'&&' content-collapse')}>

                <div className="col-1 mob-menu b">
                    <div>
                        <img src={`${process.env.CONTEXT}public/img/burger_mob.png`} alt=""/>
                    </div>
                </div>
                <div className="header-notification">
                    <span className="menu-notification" data-toggle="modal" data-target=".modal_counts">{company.count && company.count.count}</span>
                </div>
                <div className="col">
                    <p className="red-title-block mob-setting">
                        {authentication.user && Object.values(authentication.menu[0]).filter((item)=>item.url==path)[0] && Object.values(authentication.menu[0]).filter((item)=>item.url==path)[0].name }
                        </p>
                </div>
                <div className="mob-info dropdown">
                    <a href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img alt="" src={`${process.env.CONTEXT}public/img/icons/information.svg`}/>
                    </a>
                    <ul className="dropdown-menu">

                        {company && company.settings && company.settings.defaultAddress !== 1 && company.settings.length!=='' &&
                        <li>
                            <p className="firm-name">{company && company.settings && company.settings.companyName}<span>{company && company.settings && company.settings.companyAddress1}</span>
                            </p>
                        </li>
                        }
                        {company && company.settings && company.settings.defaultAddress !== 2 && company.settings.companyAddress2.length!=='' &&
                        <li>
                            <p className="firm-name">{company && company.settings && company.settings.companyName}<span>{company && company.settings && company.settings.companyAddress2}</span>
                            </p>
                        </li>
                        }
                        {company && company.settings && company.settings.defaultAddress !== 3 && company.settings.companyAddress3.length>0 &&
                        <li>
                            <p className="firm-name">{company && company.settings && company.settings.companyName}<span>{company && company.settings && company.settings.companyAddress3}</span>
                            </p>
                        </li>
                        }
                    </ul>
                </div>
                <div className="col firm-chosen">
                    <div className="dropdown">
                        <div className="bth dropdown-toggle rounded-button select-menu" data-toggle="dropdown"
                             role="menu" aria-haspopup="true" aria-expanded="true">
                            <p className="firm-name">{company && company.settings && company.settings.companyName}<span>{company && company.settings && company.settings["companyAddress" + company.settings.defaultAddress]}</span></p>
                        </div>

                        <ul className="dropdown-menu">

                            {company && company.settings && company.settings.defaultAddress !== 1 && company.settings.length!=='' &&
                                    <li>
                                        <p className="firm-name">{company && company.settings && company.settings.companyName}<span>{company && company.settings && company.settings.companyAddress1}</span>
                                        </p>
                                    </li>
                            }
                            {company && company.settings && company.settings.defaultAddress !== 2 && company.settings.companyAddress2.length!=='' &&
                                    <li>
                                        <p className="firm-name">{company && company.settings && company.settings.companyName}<span>{company && company.settings && company.settings.companyAddress2}</span>
                                        </p>
                                    </li>
                            }
                            {company && company.settings && company.settings.defaultAddress !== 3 && company.settings.companyAddress3.length>0 &&
                            <li>
                                <p className="firm-name">{company && company.settings && company.settings.companyName}<span>{company && company.settings && company.settings.companyAddress3}</span>
                                </p>
                            </li>
                            }
                        </ul>
                    </div>
                </div>
                <div className="col right_elements">
                    <span className="time_show" id="doc_time">{moment().format('HH:mm')}</span>
                    <span className="notification"/>
                    <a className="setting" onClick={this.openModal}/>
                    <a className="firm-name" onClick={this.openModal}>{authentication && authentication.user.profile.firstName} {authentication && authentication.user.profile.lastName}</a>
                    <div className="img-container" data-toggle="modal" data-target=".modal_photo">
                        <img src={authentication.user.profile.imageBase64 && authentication.user.profile.imageBase64!==''?("data:image/png;base64,"+authentication.user.profile.imageBase64):`${process.env.CONTEXT}public/img/image.png`}/>

                    </div>
                    <span className="log_in">
                        <LogoutPage/>
                    </span>
                </div>


            </div>
        );
    }


    openModal() {
        const {onOpen} = this.props;

        console.log('onOpen1')

        return onOpen();
    }
}

function mapStateToProps(state) {
    const { alert, authentication, company } = state;
    return {
        alert, authentication, company
    };
}

HeaderMain.proptypes = {
    location: PropTypes.object.isRequired,
    onOpen: PropTypes.func
};

const connectedApp = connect(mapStateToProps)(withRouter(HeaderMain));
export { connectedApp as HeaderMain };