import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import '@trendmicro/react-modal/dist/react-modal.css';
import Modal from '@trendmicro/react-modal';
import {isValidEmailAddress} from "../../_helpers/validators";
import {isValidNumber} from "libphonenumber-js";
import PhoneInput from "../PhoneInput";
import InputCounter from "../InputCounter";
import moment from "moment";
import ReactPhoneInput from "react-phone-input-2";
import { companyActions, materialActions } from "../../_actions";

class AddProvider extends React.Component {
    constructor(props) {
        super(props);
        let client;
        if (props.client_working && props.edit) {
            client = props.client_working
        } else if (props.client.activeClient && props.edit) {
            client = props.client.activeClient
        } else {
            client = {
                "supplierName": "",
                "webSite": "",
                "zipCode": "",
                "phone": "",
                "countryCode": "",
                contactPersons: [
                    {
                        "email": "",
                        "firstName": "",
                        "lastName": "",
                        "phone1": "",
                        "phone2": ""
                    }
                ],
                "city": "",
                "description": "",
                "office": '',
                "street": '',
            }
        }
        const [year, month, day] = client.birthDate
            ? client.birthDate.slice(0, 10).split('-')
            : ['' , '' , '']
        this.state={
            client: {
                ...client,
                birthDate: client.birthDate ? moment(client.birthDate).format('DD.MM.YYYY') : null
            },
            year,
            month,
            day,
            edit: props.edit,
            clients: props.client
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleContactChange = this.handleContactChange.bind(this);
        this.handleBirthdayChange = this.handleBirthdayChange.bind(this);
        this.toggleChange = this.toggleChange.bind(this);
        this.updateClient = this.updateClient.bind(this);
        this.addClient = this.addClient.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(companyActions.get())
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

    getDayOptionList() {
        const options = []
        for(let i = 1; i <= 31; i++) {
            options.push(i)
        }

        return options.map(item => {
            const optionValue = String(item).length === 1 ? `0${item}` : item;
            return <option value={optionValue}>{optionValue}</option>
        });
    }

    getMonthOptionList() {
        const options = [
            {
                value: '01',
                label: "январь"
            },
            {
                value: '02',
                label: "февраль"
            },
            {
                value: '03',
                label: "март"
            },
            {
                value: '04',
                label: "апрель"
            },
            {
                value: '05',
                label: "май"
            },
            {
                value: '06',
                label: "июнь"
            },
            {
                value: '07',
                label: "июль"
            },
            {
                value: '08',
                label: "август"
            },
            {
                value: '09',
                label: "сентябрь"
            },
            {
                value: '10',
                label: "октябрь"
            },
            {
                value: '11',
                label: "ноябрь"
            },
            {
                value: '12',
                label: "декабрь"
            }
        ];

        return options.map(({ value, label }) => <option value={value}>{label}</option>);
    }

    getYearOptionList() {
        const options = []
        for(let i = parseInt(moment().format('YYYY')); i >= 1900; i--) {
            options.push(i)
        }

        return options.map(item => <option value={item}>{item}</option>);
    }

    render() {
        const { company } = this.props;
        const { day, month, year, client, edit, alert, clients }=this.state;
        const companyTypeId = company.settings && company.settings.companyTypeId

        const isValidPhone = client.phone && isValidNumber(client.phone.startsWith('+') ? client.phone : `+${client.phone}`);

        return (
            <Modal style={{ zIndex: 99999}} size="md" onClose={this.closeModal} showCloseButton={false} className="mod">
                <div className="">
                    {client  &&
                    <div>
                        <div className="modal-content">
                            <div className="modal-header">
                                {!edit ? <h4 className="modal-title">Новый поставщик</h4>
                                    : <h4 className="modal-title">Редактирование поставщика</h4>
                                }
                                <button type="button" className="close" onClick={this.closeModal} />
                                {/*<img src={`${process.env.CONTEXT}public/img/icons/cancel.svg`} alt="" className="close" onClick={this.closeModal}*/}
                                {/*     style={{margin:"13px 5px 0 0"}}/>*/}
                            </div>
                            <div className="form-group mr-3 ml-3">
                                <p className="title mb-2">Общая информация</p>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <InputCounter title="Наименование" placeholder='Например: ООО "Поставка Бест"' value={client.supplierName}
                                                      name="supplierName" handleChange={this.handleChange} maxLength={128} />

                                        <InputCounter title="Веб-сайт" placeholder="www.website.com" value={client.webSite}
                                                      name="webSite" handleChange={this.handleChange} maxLength={128} />
                                    </div>
                                    <div className="col-sm-6">
                                        <p>Описание</p>
                                        <textarea style={{ height: '108px' }} placeholder="Например: Поставщик шампуней" value={client.description}
                                                  name="description" onChange={this.handleChange} maxLength={128} />
                                    </div>
                                </div>

                                <p className="title mb-2">Адрес</p>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <p>Страна</p>
                                        <select className={"custom-select"} value={client.countryCode} name="countryCode" onChange={this.handleChange}>
                                            <option value=''>Выберите страну</option>
                                            <option value='BLR'>Беларусь</option>
                                            <option value='UKR'>Украина</option>
                                            <option value='RUS'>Россия</option>
                                        </select>
                                        <InputCounter title="Улица" placeholder="Введите улицу" value={client.street}
                                                      name="street" handleChange={this.handleChange} maxLength={128} />
                                    </div>
                                    <div className="col-sm-6">
                                        <InputCounter title="Город" placeholder="Введите город" value={client.city} name="city"
                                                      handleChange={this.handleChange} maxLength={128} />

                                        <div className="row">
                                            <div className="col-sm-6">
                                                <InputCounter title="Здание, офис" placeholder="Дом 205" value={client.office}
                                                              name="office" handleChange={this.handleChange} maxLength={128} />
                                            </div>
                                            <div className="col-sm-6">
                                                <InputCounter title="Почтовый код" placeholder="Введите код" value={client.zipCode}
                                                              name="zipCode" handleChange={this.handleChange} maxLength={128} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <p className="title mb-2">Контакты</p>
                                {client.contactPersons && client.contactPersons.map((contactPerson, index) =>
                                    <React.Fragment>
                                        {(client.contactPersons.length > 1) && <p>Контакт {index + 1}</p>}
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <InputCounter title="Имя" placeholder="" value={contactPerson.firstName}
                                                              name="firstName"handleChange={(e) => this.handleContactChange(e, index)} maxLength={128} />
                                            </div>
                                            <div className="col-sm-6">
                                                <InputCounter title="Фамилия" placeholder="" value={contactPerson.lastName}
                                                              name="lastName"  handleChange={(e) => this.handleContactChange(e, index)} maxLength={128} />
                                            </div>
                                            <div className="col-sm-6">
                                                <p>Номер телефона 1</p>
                                                <ReactPhoneInput
                                                    defaultCountry={'by'}
                                                    country={'by'}
                                                    regions={['america', 'europe']}
                                                    placeholder=""
                                                    value={client.contactPersons[index].phone1}
                                                    onChange={phone => {
                                                        const updatedClient = { ...client };
                                                        updatedClient.contactPersons[index].phone1 = phone.replace(/[() ]/g, '')
                                                        this.setState({ client: updatedClient })
                                                    }}
                                                />
                                            </div>
                                            <div className="col-sm-6">
                                                <p>Номер телефона 2</p>
                                                <ReactPhoneInput
                                                    defaultCountry={'by'}
                                                    country={'by'}
                                                    regions={['america', 'europe']}
                                                    placeholder=""
                                                    value={client.contactPersons[index].phone2}
                                                    onChange={phone => {
                                                        const updatedClient = { ...client };
                                                        updatedClient.contactPersons[index].phone2 = phone.replace(/[() ]/g, '')
                                                        this.setState({ client: updatedClient })
                                                    }}
                                                />
                                            </div>
                                            <div className="col-sm-6">
                                                <InputCounter type="email" placeholder="mail@example.com" value={client.contactPersons[index].email}
                                                              name="email" title="Email"
                                                              handleKeyUp={() => this.setState({
                                                                  emailIsValid: isValidEmailAddress(client.contactPersons[index].email)
                                                              })}
                                                              extraClassName={'' + (!isValidEmailAddress(client.contactPersons[index].email) && client.contactPersons[index].email!=='' ? ' redBorder' : '')}
                                                              handleChange={(e) => this.handleContactChange(e, index)} maxLength={128} />
                                            </div>
                                        </div>
                                    </React.Fragment>
                                )}
                                <p style={{ cursor: 'pointer', textDecoration: 'underline' }} className="mb-2"
                                onClick={() => {
                                    const updatedClient = { ...client}
                                    updatedClient.contactPersons.push({
                                        "email": "",
                                        "firstName": "",
                                        "lastName": "",
                                        "phone1": "",
                                        "phone2": ""
                                    })
                                    this.setState({ client: updatedClient })
                                }}>Добавить блок контакты</p>


                                <button style={{ display: 'block', marginLeft: 'auto' }}
                                    className={((clients.adding || !client.firstName || ( (day || month || year) && !(day && month && year) ) || !isValidPhone || (client.email ? !isValidEmailAddress(client.email) : false)) ? '': '')+' button'}
                                        disabled={false}
                                        type="button"
                                        onClick={(edit ? this.updateClient : this.addClient)}
                                >Сохранить
                                </button>
                            </div>
                        </div>
                    </div>
                    }
                </div>
            </Modal>
        )
    }

    handleBirthdayChange({ target: { name, value } }) {
        this.setState({ [name]: value })
    }

    handleChange(e) {
        const { name, value } = e.target;
        const { client } = this.state;

        let newValue = value

        if (name === 'discountPercent') {
            const result = String(value)
            newValue = (value >= 0 && value <= 100) ? result.replace(/[,. ]/g, '') : this.state.client.discountPercent
        }

        this.setState({ client: {...client, [name]: newValue }});
    }

    handleContactChange(e, index) {
        const { name, value } = e.target;
        const { client } = this.state;

        const updatedClient = { ...client };
        updatedClient.contactPersons[index][name] = value
        this.setState({ client: updatedClient })
    }

    toggleChange () {
        const { client } = this.state;

        this.setState({ client: {...client, acceptNewsletter: !client.acceptNewsletter }});
    }

    updateClient(){
        const { addClient } = this.props;
        const { client } = this.state;

        this.props.dispatch(materialActions.toggleSupplier(client, true))
    };

    addClient(){
        const { addClient } = this.props;
        const { client } = this.state;

        this.props.dispatch(materialActions.toggleSupplier(client))
    };

    closeModal () {
        const {onClose} = this.props;

        return onClose()
    }
}

function mapStateToProps(state) {
    const { alert, client, company } = state;
    return {
        alert, client, company
    };
}

AddProvider.propTypes ={
    client_working: PropTypes.object,
    edit: PropTypes.bool.isRequired,
    isModalShouldPassClient: PropTypes.bool,
    updateClient: PropTypes.func,
    checkUser: PropTypes.func,
    addClient: PropTypes.func,
    onClose: PropTypes.func
};

const connectedApp = connect(mapStateToProps)(AddProvider);
export { connectedApp as AddProvider };
