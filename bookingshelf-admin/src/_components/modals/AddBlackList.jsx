import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactPhoneInput from "react-phone-input-2";
import { isValidNumber } from 'libphonenumber-js'
import '@trendmicro/react-modal/dist/react-modal.css';
import Modal from '@trendmicro/react-modal';

class AddBlackList extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            client: props.client_working && this.props.edit ?props.client_working: {
                "firstName": "",
                "lastName": "",
                "email": "",
                "phone": "",
                "country": "",
                "city": "",
                "province": "",
                "acceptNewsletter": true
            },
            phone: '',
            edit: props.edit,
            clients: props.client,
            isUserEditedPhone: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.toggleChange = this.toggleChange.bind(this);
        this.updateClient = this.updateClient.bind(this);
        this.addClient = this.addClient.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.isValidEmailAddress = this.isValidEmailAddress.bind(this)
    }

    componentWillReceiveProps(newProps) {
        if (newProps.client.status === 200) {
            setTimeout(() => this.props.onClose(), 1000)
        }
        if ( JSON.stringify(this.props.alert) !==  JSON.stringify(newProps.alert)) {
            this.setState({alert:newProps.alert});
            setTimeout(() => {
                this.setState({...this.state, alert: [] });
            }, 3000)
        }

        if ( JSON.stringify(this.props.client) !==  JSON.stringify(newProps.client)) {
            this.setState({clients:newProps.client});
        }
    }

    render() {
        const { clients } = this.props
        const {client, edit, activeClientId, alert, phone}=this.state;

        return (
            <Modal size="md" onClose={this.closeModal} showCloseButton={false} className="mod">
                <div className="">
                    {client  &&
                    <div>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Добавление в blacklist</h4>

                                <button type="button" className="close" onClick={this.closeModal} />
                                {/*<img src={`${process.env.CONTEXT}public/img/icons/cancel.svg`} alt="" className="close" onClick={this.closeModal}*/}
                                {/*     style={{margin:"13px 5px 0 0"}}/>*/}
                            </div>
                            <div className="form-group mr-3 ml-3">
                                <div className="row">
                                    <div className="col-sm-6 offset-3">
                                        <p className="title_block">Поиск по номеру телефона</p>
                                        <ReactPhoneInput
                                            regions={['america', 'europe']}
                                            disableAreaCodes={true}
                                            inputClass={((!isValidNumber(phone) && this.state.isUserEditedPhone) ? ' redBorder' : '')}
                                            value={phone} required="true" defaultCountry={'by'}
                                            onChange={phone => {
                                                const phoneValue = phone.replace(/[() ]/g, '');
                                                const activeClient = clients.find(client_user => !client_user.blacklisted && (client_user.phone.indexOf(phoneValue) !== -1))
                                                this.setState({
                                                    phone: phoneValue,
                                                    activeClientId: activeClient ? activeClient.clientId : '',
                                                    isUserEditedPhone: true
                                                })
                                            }
                                            }/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6 offset-3">
                                        <p className="title_block">Клиент</p>
                                        <select className="custom-select" value={activeClientId} name="roleId" onChange={this.handleChange}>
                                            {!phone && <option value={''}>Выберите клиента</option>}
                                            { clients
                                                .filter(client_user => !client_user.blacklisted && (client_user.phone.indexOf(phone) !== -1))
                                                .map(item => <option value={item.clientId}>{item.firstName + ' ' + item.lastName}</option>)
                                            }

                                        </select>
                                    </div>
                                </div>

                                {alert && alert.message && JSON.parse(alert.message).code === 9 &&
                                <p className="alert-danger p-1 rounded pl-3 mb-2">Клиент с таким номером телефона уже создан</p>
                                }

                                <button style={{ display: 'block', margin: '0 auto' }} className={((!activeClientId) ? 'disabledField': '')+' button'} type="button"
                                        onClick={activeClientId && (this.updateClient)}
                                >Добавить
                                </button>
                            </div>
                        </div>
                    </div>
                    }
                </div>
            </Modal>
        )
    }

    handleChange(e) {
        const {  value } = e.target;

        this.setState({ activeClientId: value });
    }

    isValidEmailAddress(address) {
        return !! address.match(/.+@.+/);
    }

    toggleChange () {
        const { client } = this.state;

        this.setState({ client: {...client, acceptNewsletter: !client.acceptNewsletter }});
    }

    updateClient(){
        const {updateClient, clients} = this.props;
        const {activeClientId} = this.state;
        const activeClient = clients.find(item=> item.clientId === parseInt(activeClientId))

        delete activeClient.appointments;
        activeClient.blacklisted = true;

        return updateClient(activeClient);

    };

    addClient(){
        const {addClient, isModalShouldPassClient} = this.props;
        const {client} = this.state;
        if (isModalShouldPassClient) {
            this.props.checkUser(client);
        }

        return addClient(client);
    };

    closeModal () {
        const {onClose} = this.props;

        return onClose()
    }
}

function mapStateToProps(state) {
    const { alert, client} = state;
    return {
        alert, client
    };
}

AddBlackList.propTypes ={
    client_working: PropTypes.object,
    edit: PropTypes.bool.isRequired,
    isModalShouldPassClient: PropTypes.bool,
    updateClient: PropTypes.func,
    checkUser: PropTypes.func,
    addClient: PropTypes.func,
    onClose: PropTypes.func
};

const connectedApp = connect(mapStateToProps)(AddBlackList);
export { connectedApp as AddBlackList };
