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
import { companyActions } from "../../_actions";

class AddProduct extends React.Component {
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
        const { company, material } = this.props;
        const { categories, brands, suppliers } = material;
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
                                {!edit ? <h4 className="modal-title">Новый товар</h4>
                                    : <h4 className="modal-title">Редактирование товара</h4>
                                }
                                <button type="button" className="close" onClick={this.closeModal} />
                                {/*<img src={`${process.env.CONTEXT}public/img/icons/cancel.svg`} alt="" className="close" onClick={this.closeModal}*/}
                                {/*     style={{margin:"13px 5px 0 0"}}/>*/}
                            </div>
                            <div className="form-group mr-3 ml-3">
                                <p className="title mb-2">Описание товара</p>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <InputCounter title="Наименование" placeholder='Например: Средний шампунь' value={client.firstName}
                                                      name="supplierName" handleChange={this.handleChange} maxLength={128} />
                                        <p>Категория</p>
                                        <select className="custom-select" name="categoryId" onChange={this.handleChange}
                                                value={client.categoryId}>
                                            <option value="">Выберите категорию</option>
                                            {categories.map(category => <option value={category.categoryId}>{category.categoryName}</option>)}
                                        </select>

                                        <p>Бренд</p>
                                        <select className="custom-select" name="booktimeStep" onChange={this.handleChange}
                                                value={client.categoryId}>
                                            <option value="">Выберите бренд</option>
                                            {brands.map(brand => <option value={brand.brandId}>{brand.brandName}</option>)}
                                        </select>
                                        <div className="check-box">
                                            <label>
                                                <input className="form-check-input"
                                                       checked={client.retailOn}
                                                       onChange={()=>this.toggleChange('appointmentDelete')}
                                                       type="checkbox"/>
                                                <span className="check" />
                                                Включить продажу в розницу
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <InputCounter title="Код товара" placeholder="Введите код" value={client.address}
                                                      name="webSite" handleChange={this.handleChange} maxLength={128} />
                                        <p>Еденица измерения</p>
                                        <select className="custom-select" name="booktimeStep" onChange={this.handleStepChange}
                                                value={client.categoryId}>
                                            <option value="">Еденицы</option>
                                            <option value={300}>5 мин</option>
                                            <option value={600}>10 мин</option>
                                            <option value={900}>15 мин</option>
                                        </select>
                                        <InputCounter title="Описание" placeholder="Описание" value={client.address}
                                                      name="webSite" handleChange={this.handleChange} maxLength={128} />
                                        <div className="check-box">
                                            <label>
                                                <input className="form-check-input"
                                                       checked={client.checkOn}
                                                       onChange={()=>this.toggleChange('appointmentDelete')}
                                                       type="checkbox"/>
                                                <span className="check" />
                                                Включить контроль склада
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <InputCounter title="Розничная цена" placeholder="Введите цену" value={client.country}
                                                              name="country" handleChange={this.handleChange} maxLength={128} />
                                            </div>
                                            <div className="col-sm-6">
                                                <InputCounter title="Специальная цена" placeholder="Введите цену" value={client.address}
                                                              name="address" handleChange={this.handleChange} maxLength={128} />
                                            </div>
                                        </div>
                                        <InputCounter title="Цена поставщика" placeholder="Введите цену" value={client.city} name="city"
                                                      handleChange={this.handleChange} maxLength={128} />
                                        <p>Поставщик</p>
                                        <select className="custom-select" name="booktimeStep" onChange={this.handleStepChange}
                                                value={client.categoryId}>
                                            <option value="">Выберите поставщика</option>
                                            {suppliers.map(supplier =><option value={supplier.supplierId}>{supplier.supplierName}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-sm-6">
                                        <InputCounter title="Минимальное количество" placeholder="Введите количество" value={client.city} name="city"
                                                      handleChange={this.handleChange} maxLength={128} />
                                    </div>
                                </div>

                                <button style={{ display: 'block', marginLeft: 'auto' }}
                                    className={((clients.adding || !client.firstName || ( (day || month || year) && !(day && month && year) ) || !isValidPhone || (client.email ? !isValidEmailAddress(client.email) : false)) ? 'disabledField': '')+' button'}
                                        disabled={clients.adding || !client.firstName || ( (day || month || year) && !(day && month && year) ) || !isValidPhone || (client.email ? !isValidEmailAddress(client.email) : false)}
                                        type="button"
                                        onClick={!clients.adding && client.firstName && isValidPhone && (edit ? this.updateClient : this.addClient)}
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

        this.setState({ client: {...client, [name]: newValue }});
    }

    toggleChange () {
        const { client } = this.state;

        this.setState({ client: {...client, acceptNewsletter: !client.acceptNewsletter }});
    }

    updateClient(){
        const {updateClient} = this.props;
        const {client, day, month, year } = this.state;
        let birthDate;
        if (day || month || year) {
            birthDate =`${year}-${month}-${day}`;
        }
        delete client.appointments;

        const body = JSON.parse(JSON.stringify(client));
        body.phone = body.phone.startsWith('+') ? body.phone : `+${body.phone}`;

        return updateClient({ ...body, birthDate });
    };

    addClient(){
        const {addClient, isModalShouldPassClient} = this.props;
        const {client, day, month, year } = this.state;
        let birthDate;
        if (day || month || year) {
            birthDate =`${year}-${month}-${day}`;
        }
        if (isModalShouldPassClient) {
            this.props.checkUser(client);
        }
        const body = JSON.parse(JSON.stringify(client));
        body.phone = body.phone.startsWith('+') ? body.phone : `+${body.phone}`;

        return addClient({ ...body, birthDate });
    };

    closeModal () {
        const {onClose} = this.props;

        return onClose()
    }
}

function mapStateToProps(state) {
    const { alert, client, company, material } = state;
    return {
        alert, client, company, material
    };
}

AddProduct.propTypes ={
    client_working: PropTypes.object,
    edit: PropTypes.bool.isRequired,
    isModalShouldPassClient: PropTypes.bool,
    updateClient: PropTypes.func,
    checkUser: PropTypes.func,
    addClient: PropTypes.func,
    onClose: PropTypes.func
};

const connectedApp = connect(mapStateToProps)(AddProduct);
export { connectedApp as AddProduct };
