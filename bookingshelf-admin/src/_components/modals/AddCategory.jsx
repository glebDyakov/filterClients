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
import { materialActions } from "../../_actions/material.actions";

class AddCategory extends React.Component {
    constructor(props) {
        super(props);
        let client;
        if (props.client_working && props.edit) {
            client = props.client_working
        } else if (props.client.activeClient && props.edit) {
            client = props.client.activeClient
        } else {
            client = {
                "categoryName": ""
            }
        }
        const [year, month, day] = client.birthDate
            ? client.birthDate.slice(0, 10).split('-')
            : ['' , '' , '']
        this.state={
            client: {
                ...client,
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
        const { company } = this.props;
        const { day, month, year, client, edit, alert, clients }=this.state;

        return (
            <div>
                <Modal style={{ zIndex: 99999}} size="xs" onClose={this.closeModal} showCloseButton={false} className="mod">
                    <div className="">
                        {client  &&
                        <div>
                            <div className="modal-content">
                                <div className="modal-header">
                                    {!edit ? <h4 className="modal-title">Новая категория</h4>
                                        : <h4 className="modal-title">Редактирование категории</h4>
                                    }
                                    <button type="button" className="close" onClick={this.closeModal} />
                                    {/*<img src={`${process.env.CONTEXT}public/img/icons/cancel.svg`} alt="" className="close" onClick={this.closeModal}*/}
                                    {/*     style={{margin:"13px 5px 0 0"}}/>*/}
                                </div>
                                <div className="form-group mr-3 ml-3">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <InputCounter title="Название категории" placeholder="Например: Лаки" value={client.categoryName}
                                                          name="categoryName" handleChange={this.handleChange} maxLength={128} />
                                        </div>
                                    </div>

                                    <button className={(!client.categoryName ? 'disabledField': '')+' button'}
                                            disabled={!client.categoryName}
                                            type="button"
                                            onClick={client.categoryName && (edit ? this.updateClient : this.addClient)}
                                    >Сохранить
                                    </button>
                                </div>
                            </div>
                        </div>
                        }
                    </div>
                </Modal>
            </div>
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

    toggleChange () {
        const { client } = this.state;

        this.setState({ client: {...client, acceptNewsletter: !client.acceptNewsletter }});
    }

    updateClient(){
        const { addClient } = this.props;
        const { client } = this.state;

        this.props.dispatch(materialActions.toggleCategory(client, true))
    };

    addClient(){
        const { addClient } = this.props;
        const { client } = this.state;

        this.props.dispatch(materialActions.toggleCategory(client))
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

AddCategory.propTypes ={
    client_working: PropTypes.object,
    edit: PropTypes.bool.isRequired,
    isModalShouldPassClient: PropTypes.bool,
    updateClient: PropTypes.func,
    checkUser: PropTypes.func,
    addClient: PropTypes.func,
    onClose: PropTypes.func
};

const connectedApp = connect(mapStateToProps)(AddCategory);
export { connectedApp as AddCategory };
