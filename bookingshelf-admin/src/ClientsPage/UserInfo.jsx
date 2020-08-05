import React, {Component} from 'react';
import moment from "moment";
import ActionModal from "../_components/modals/ActionModal";
import {clientActions} from "../_actions";
import {connect} from "react-redux";
import {withRouter} from "react-router";

class UserInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpenDeleteClientModal: false,
            defaultAppointmentsList: [],

        };

        this.closeDeleteClientModal = this.closeDeleteClientModal.bind(this);
        this.openDeleteClientModal = this.openDeleteClientModal.bind(this);
        this.deleteClient = this.deleteClient.bind(this);
        this.deleteClientFromBlacklist = this.deleteClientFromBlacklist.bind(this);
    }

    componentWillMount() {
        const {dispatch} = this.props;
        dispatch(clientActions.getActiveClientAppointments(this.props.client_user.clientId, 1));



    }


    deleteClient(id) {
        const {dispatch} = this.props;
        dispatch(clientActions.deleteClient(id));
        this.closeDeleteClientModal();
    }

    closeDeleteClientModal() {
        this.setState({isOpenDeleteClientModal: false});
    }

    openDeleteClientModal() {
        this.setState({isOpenDeleteClientModal: true});
    }

    deleteClientFromBlacklist(client_user) {
        delete client_user.appointments;
        this.props.updateClient({...client_user, blacklisted: false}, true);
        this.closeDeleteClientModal();
    }

    render() {
        const {client_user, activeTab, i, deleteClient, handleClick, openClientsStats} = this.props;
        console.log(this.state)

        return (
            <div className="tab-content-list" key={i}
                 style={{position: "relative"}}>
                <div className="cell_name-client" style={{position: "relative"}}>
                    <a onClick={() => openClientsStats(client_user)}>
                        <p> {client_user.firstName} {client_user.lastName}</p>
                    </a>
                </div>
                <div className="cell_client-email">
                    {client_user.phone}
                    <br/>
                    {client_user.email}
                </div>
                <div className="cell_client-country">
                    {client_user.country && (client_user.country)}{client_user.city && ((client_user.country && ", ") + client_user.city)}{client_user.province && (((client_user.country || client_user.city) && ", ") + client_user.province)}
                </div>

                <div className="cell_client-last-visit">
                    {this.state.defaultAppointmentsList && this.state.defaultAppointmentsList.length > 0 && moment(this.state.defaultAppointmentsList[0].appointmentTimeMillis).format("DD, dd MMMM, YYYY")}
                </div>

                <div className="cell_client-discount">
                    {client_user.discountPercent}%
                </div>

                <div
                    className={"cell_client-birthDate" + (client_user.birthDate && (0 <= moment(client_user.birthDate).year(2000).diff(moment().year(2000), 'days') && moment(client_user.birthDate).year(2000).diff(moment().year(2000), 'days') < 3) ? " red-date" : '')}>
                    {client_user.birthDate && moment(client_user.birthDate).format('DD.MM.YYYY')}
                </div>


                <div className="list-button-wrapper">
                    {client_user.blacklisted && <a className="client-in-blacklist">
                        <img src={`${process.env.CONTEXT}public/img/client-in-blacklist.svg`}
                             alt=""/>
                    </a>}

                    {!client_user.blacklisted && <a className="clientEdit"
                                                    onClick={(e) => handleClick(client_user.clientId, e, this)}/>}

                    <div className="delete dropdown">
                        <a className="delete-icon menu-delete-icon" onClick={this.openDeleteClientModal}>
                            <img src={`${process.env.CONTEXT}public/img/delete_new.svg`} alt=""/>
                        </a>
                    </div>

                    {this.state.isOpenDeleteClientModal && activeTab === 'clients' &&
                    <ActionModal
                        title="Удалить клиента?"
                        closeHandler={this.closeDeleteClientModal}
                        buttons={[{
                            handler: this.deleteClient,
                            params: client_user.clientId,
                            innerText: 'Удалить',
                            className: 'button'
                        },
                            {
                                handler: this.closeDeleteClientModal,
                                innerText: 'Отмена',
                                className: 'gray-button'
                            }]}
                    />
                    }

                    {this.state.isOpenDeleteClientModal && activeTab === 'blacklist' &&
                    <ActionModal
                        title="Удалить клиента из черного списка?"
                        closeHandler={this.closeDeleteClientModal}
                        buttons={[{
                            handler: this.deleteClientFromBlacklist,
                            params: client_user,
                            innerText: 'Удалить',
                            className: 'button'
                        },
                            {
                                handler: this.closeDeleteClientModal,
                                innerText: 'Отмена',
                                className: 'gray-button'
                            }]}
                    />
                    }

                </div>
            </div>

        );
    }
}

function mapStateToProps(state) {
    const {client} = state;

    return {
        client
    }
}


export default connect(mapStateToProps)(withRouter(UserInfo));
