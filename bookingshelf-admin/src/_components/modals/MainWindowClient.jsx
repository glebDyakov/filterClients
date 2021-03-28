import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import '@trendmicro/react-modal/dist/react-modal.css';
import Modal from '@trendmicro/react-modal';
import { withTranslation } from 'react-i18next';
import { NewClient } from './NewClient';
import { ClientDetails } from './ClientDetails';
class MainWindowClient extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    render() {

        return (
            // <Modal style={{ zIndex: 99999 }} size="md" onClose={this.closeModal} showCloseButton={false} className="mod">
                <div>
                    {this.props.screen === "edit" && <NewClient
                    client_working={this.props.client_working}
                    edit={this.props.edit}
                    isModalShouldPassClient={this.props.isModalShouldPassClient}
                    updateClient={this.props.updateClient}
                    checkUser={this.props.checkUser}
                    addClient={this.props.addClient}
                    onClose={this.props.onClose}
                />}
                {this.props.screen === "details" && <ClientDetails
                    wrapper={this.props.wrapper}
                    clientId={this.props.clientId}
                    editClient={this.props.editClient}
                />}
                </div>

                
            // </Modal>
        );
    }

}
const connectedApp = (withTranslation('common')(MainWindowClient));
export { connectedApp as MainWindowClient };
