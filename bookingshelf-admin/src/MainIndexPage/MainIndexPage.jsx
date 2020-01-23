import React, {Component} from 'react';
import { connect } from 'react-redux';

import {companyActions, notificationActions, userActions} from '../_actions';
import {SidebarMain} from "../_components/SidebarMain";
import {HeaderMain} from "../_components/HeaderMain";
import { parseNumber, formatNumber, isValidNumber } from 'libphonenumber-js'
import ReactWeeklyDayPicker from "react-weekly-day-picker";

import '../../public/scss/styles.scss'
import ReactPhoneInput from "react-phone-input-2";
import {UserSettings} from "../_components/modals";
import {UserPhoto} from "../_components/modals/UserPhoto";
import Pace from 'react-pace-progress'
import TimePicker from "rc-time-picker/es/TimePicker";
import moment from "moment";
import Avatar from "react-avatar-edit";
import TimezonePicker from 'react-bootstrap-timezone-picker';
import 'react-bootstrap-timezone-picker/dist/react-bootstrap-timezone-picker.min.css';
import {access} from "../_helpers/access";
import {notification} from "../_reducers/notification.reducer";



class MainIndexPage extends Component {
    constructor(props) {
        super(props);

        if(!access(-1)){
            props.history.push('/denied')
        }

        this.state = {
            authentication: props.authentication,
            company: props.company,
            subcompanies: props.company.subcompanies,
            isLoading: true,
            adding: false,
            activeDay: 1,
            status: {},
            submitted: false,
            isAvatarOpened: true,
            userSettings: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleNotificationChange = this.handleNotificationChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeTime = this.onChangeTime.bind(this);
        this.handleChangeAddress = this.handleChangeAddress.bind(this);
        this.handleChangePhone = this.handleChangePhone.bind(this);
        this.handleWeekPicker = this.handleWeekPicker.bind(this);
        this.onCrop = this.onCrop.bind(this)
        this.onClose = this.onClose.bind(this)
        this.onOpen = this.onOpen.bind(this);
        this.onClose2 = this.onClose2.bind(this);
        this.changeSound = this.changeSound.bind(this);
    }

    componentWillReceiveProps(newProps) {
        const { dispatch } = this.props;

        if ( JSON.stringify(this.props.authentication) !==  JSON.stringify(newProps.authentication)) {

            this.setState({authentication: newProps.authentication,

                userSettings: newProps.authentication.status && newProps.authentication.status===209 ? false : this.state.userSettings

            })
        }

        if ( JSON.stringify(this.props.company.settings) !==  JSON.stringify(newProps.company.settings)) {

            this.setState({ company: newProps.company })
        }
        if ( JSON.stringify(this.props.company.subcompanies) !==  JSON.stringify(newProps.company.subcompanies)) {

            this.setState({ subcompanies: newProps.company.subcompanies })
        }
        if (newProps.company && newProps.company.status==='saved.settings') {
            this.setState({status: newProps.company.status})
            setTimeout(() => {
                this.setState({status: {}, submitted: false, saved: null})
            }, 3000)
        }

        if (JSON.stringify(this.props.notification) !== JSON.stringify(newProps.notification)) {
            this.setState({ notification : newProps.notification.notification })
        }
    }

    handleChange(e, i) {
        const { name, value } = e.target;
        const { subcompanies } = this.state;
        const newSubcompanies = subcompanies;
        newSubcompanies[i][name] = value

        this.setState({...this.state, subcompanies: newSubcompanies });
    }

    handleNotificationChange({ target: { name, value }}, i) {
        const { subcompanies } = this.state
        const newSubcompanies = subcompanies
        newSubcompanies[i][name] = value
        this.setState({
            subcompanies: newSubcompanies
        })
    }

    handleChangeAddress(e, i) {
        const { name, value } = e.target;
        const { subcompanies } = this.state;

        let address;

        if(name==='defaultAddress1' && value){
            address=1
        }

        if(name==='defaultAddress2' && value){
            address=2
        }

        if(name==='defaultAddress3' && value){
            address=3
        }
        const newSubcompanies = subcompanies
        newSubcompanies[i].defaultAddress = address

        this.setState({...this.state, subcompanies: newSubcompanies});
    }

    handleChangePhone(e, i) {
        const { name, value } = e.target;
        const { subcompanies } = this.state;

        let phone;

        if(name==='defaultPhone1' && value){
            phone=1
        }

        if(name==='defaultPhone2' && value){
            phone=2
        }

        if(name==='defaultPhone3' && value){
            phone=3
        }
        const newSubcompanies = subcompanies
        newSubcompanies[i].defaultPhone = phone

        this.setState({...this.state, subcompanies: newSubcompanies});
    }

    handleWeekPicker(num){
        this.setState({...this.state, activeDay: num});

    }

    onChangeTime(field, time, activeDay) {
        const {company} = this.state;

        let times=company.settings.companyTimetables

        times[activeDay][field]=parseInt(time)

        this.setState({...this.state, company: {...company, settings: {...company.settings, companyTimetables:times}}});
    }

    handleSubmit(e, subcompany, i) {
        const { companyName, companyAddress, companyEmail, companyPhone, timezoneId } = subcompany;
        const { dispatch } = this.props;


        this.onClose();


        const phoneIndexes = [1, 2, 3];
        phoneIndexes.forEach(index => subcompany[`companyPhone${index}`] = subcompany[`companyPhone${index}`].replace(/[() ]/g, ''));

        e.preventDefault();

        this.setState({...this.state, submitted: true, isAvatarOpened: false, saved: i });
        setTimeout(() => this.setState({ isAvatarOpened: true }), 100);

        if ((companyName || companyAddress || companyEmail || companyPhone) && timezoneId!=='') {
            dispatch(companyActions.updateSubcompany(subcompany));
        }
        dispatch(notificationActions.updateSubcompanySMS_EMAIL(JSON.stringify({template: subcompany.template}), subcompany.companyId))
    }

    onClose() {
        this.setState({...this.state, preview: null})
    }

    onCrop(preview, i) {
        const {subcompanies}=this.state;
        const newSubcompanies = subcompanies
        newSubcompanies[i].imageBase64 = preview.split(',')[1]
        this.setState({...this.state, subcompanies: newSubcompanies});
    }

    componentDidMount(){
        document.title = "Настройки компании | Онлайн-запись";
        if (this.props.authentication.user.profile && (this.props.authentication.user.profile.roleId === 4)) {
            this.props.dispatch(companyActions.getSubcompanies());
        }

        this.props.dispatch(notificationActions.getSMS_EMAIL())
        setTimeout(() => this.setState({ isLoading: false }), 800);
        initializeJs();
    }

    changeSound(e){
        this.setState({sound: e.target.checked});
    }


    render() {
        const { adding, authentication, submitted, isLoading, activeDay, saved, notification, status, company, userSettings, isAvatarOpened, subcompanies } = this.state;

        return (
            <div>
                {isLoading && <div className="loader loader-company"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}

                <div className={"container_wrapper "+(localStorage.getItem('collapse')=='true'&&' content-collapse')}>

                    {company && company.settings &&
                    <div className={"content-wrapper "+(localStorage.getItem('collapse')=='true'&&' content-collapse')}>
                        <div className="container-fluid">
                            <HeaderMain
                                onOpen={this.onOpen}
                            />

                            {subcompanies[0] && <form className="content retreats company_fields" name="form">
                                <div className="row">
                                    <div className="col-sm-4">
                                        <p>Заголовок компании</p>
                                        <div className="name_company_wrapper form-control">
                                            <input type="text" className="company_input" name="onlineCompanyHeader" maxLength="40"
                                                   value={subcompanies[0].onlineCompanyHeader} onChange={(e) => this.handleChange(e, 0)}/>
                                                <span className="company_counter">{subcompanies[0].onlineCompanyHeader.length}/40</span>

                                        </div>
                                        <div className="buttons-container-setting">
                                            {<button type="button"  className={((saved === 0 && (status === 'saved.settings' || submitted)) && 'disabledField')+' small-button'} onClick={(e) => {
                                                if (saved !== 0 && (status !== 'saved.settings' || !submitted)) {
                                                    this.handleSubmit(e, subcompanies[0], 0)
                                                }
                                            }
                                            }>Сохранить</button>}
                                        </div>

                                    </div>

                                </div>

                            </form>}
                            {subcompanies.map((subcompany, i) => (
                                <form className="content retreats company_fields" name="form">
                                    <h3 style={{ textAlign: 'center' }}>Филиал {i + 1}</h3>
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <p>Название компании</p>
                                            <div className="name_company_wrapper form-control">
                                                <input type="text" className="company_input" placeholder="Например: Стоматология" name="companyName" maxLength="40"
                                                       value={subcompany.companyName} onChange={(e) => this.handleChange(e, i)}/>
                                                <span className="company_counter">{subcompany.companyName.length}/40</span>
                                            </div>

                                            <p>Адрес компании</p>
                                            <div className="check-box-group2 form-control">
                                                <div className="input-text2">
                                                    <input type="radio" aria-label="" name="defaultAddress1" disabled={!subcompany.companyAddress1}  checked={subcompany.defaultAddress===1} onChange={(e) => this.handleChangeAddress(e, i)}/>
                                                </div>

                                                <input type="text" placeholder="" name="companyAddress1" className="company_input"
                                                       value={subcompany.companyAddress1} onChange={(e) => this.handleChange(e, i)} maxLength="40"/>
                                                <span className="company_counter">{subcompany.companyAddress1.length}/40</span>
                                            </div>

                                            <p>Адрес компании</p>
                                            <div className="check-box-group2 form-control">
                                                <div className="input-text2">
                                                    <input type="radio" aria-label="" name="defaultAddress2" disabled={!subcompany.companyAddress2} checked={subcompany.defaultAddress===2} onChange={(e) => this.handleChangeAddress(e, i)}/>
                                                </div>

                                                <input type="text" placeholder="" name="companyAddress2" className="company_input"
                                                       value={subcompany.companyAddress2}  onChange={(e) => this.handleChange(e, i)} maxLength="40"/>
                                                <span className="company_counter">{subcompany.companyAddress2.length}/40</span>
                                            </div>

                                            <p>Адрес компании</p>
                                            <div className="check-box-group2 form-control">
                                                <div className="input-text2">
                                                    <input type="radio" aria-label="" name="defaultAddress3" disabled={!subcompany.companyAddress3} checked={subcompany.defaultAddress===3} onChange={(e) => this.handleChangeAddress(e, i)}/>
                                                </div>

                                                <input type="text" placeholder="" name="companyAddress3" className="company_input"
                                                       value={subcompany.companyAddress3} onChange={(e) => this.handleChange(e, i)} maxLength="40"/>
                                                <span className="company_counter">{subcompany.companyAddress3.length}/40</span>
                                            </div>

                                            <p className="mt-2">Город</p>
                                            <div className="name_company_wrapper form-control">
                                                <input type="text" className="company_input" placeholder="" name="city" maxLength="40"
                                                       value={subcompany.city} onChange={(e) => this.handleChange(e, i)}/>
                                                <span className="company_counter">{subcompany.city.length}/40</span>
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <p>Email</p>
                                            <div className="name_company_wrapper form-control">
                                                <div className="input-text2">
                                                    <input type="email" placeholder="Например: walkerfrank@gmail.com" name="companyEmail" disabled className="company_input disabledField"
                                                           value={subcompany.companyEmail} onChange={(e) => this.handleChange(e, i)} maxLength="60"/>
                                                </div>
                                            </div>
                                            <p className="phone_hint_wrapper">
                                                <span>Номер телефона владельца </span>
                                                {subcompany.defaultPhone===1 && <span className="phone_hint"> (Будет указан в автоуведомлениях)</span>}
                                            </p>
                                            <div className="name_company_wrapper form-control">
                                                <div className="check-box-group2 input-text2">
                                                    {/*<div className="input-text2">*/}
                                                    {/*    <input type="radio" aria-label="" name="defaultPhone1" disabled={!(subcompany.companyPhone1 && subcompany.companyPhone1.length > 4)}  checked={subcompany.defaultPhone===1} onChange={(e) => this.handleChangePhone(e, i)}/>*/}
                                                    {/*</div>*/}
                                                    <ReactPhoneInput
                                                        enableLongNumbers={true}
                                                        // disableCountryCode={true}
                                                        regions={['america', 'europe']}
                                                        placeholder=""
                                                        disableAreaCodes={true}
                                                        countryCodeEditable={true}
                                                        inputClass={(submitted && !subcompany.companyPhone1 || submitted && !isValidNumber(subcompany.companyPhone1) ? 'company_input redBorder' : 'company_input')}
                                                        value={subcompany.companyPhone1} defaultCountry={'by'} onChange={companyPhone1 => {
                                                            const newSubcompanies = subcompanies;
                                                            newSubcompanies[i].companyPhone1 = companyPhone1
                                                            this.setState({
                                                                subcompanies: newSubcompanies
                                                            });
                                                    }}/>
                                                </div>
                                                <span className="company_counter">{subcompany.companyPhone1.length - 2}/20</span>
                                            </div>


                                            <p className="phone_hint_wrapper">
                                                <span>Номер телефона </span>
                                                {subcompany.defaultPhone===2 && <span className="phone_hint"> (Будет указан в автоуведомлениях)</span>}
                                            </p>
                                            <div className="name_company_wrapper form-control">
                                                <div className="check-box-group2 input-text2">
                                                    <div className="input-text2">
                                                        <input type="radio" aria-label="" name="defaultPhone2" disabled={!(subcompany.companyPhone2 && subcompany.companyPhone2.length > 4)}  checked={subcompany.defaultPhone===2} onChange={(e) => this.handleChangePhone(e, i)}/>
                                                    </div>
                                                    <ReactPhoneInput
                                                        enableLongNumbers={true}
                                                        // disableCountryCode={true}
                                                        regions={['america', 'europe']}
                                                        placeholder=""
                                                        className="company_input"
                                                        disableAreaCodes={true}
                                                        countryCodeEditable={false}
                                                        inputClass={(submitted && !subcompany.companyPhone2 && subcompany.companyPhone2.length!==0 && !isValidNumber(subcompany.companyPhone2) ? 'company_input redBorder' : 'company_input')}

                                                        value={subcompany.companyPhone2} defaultCountry={'by'} onChange={companyPhone2 => {
                                                        const newSubcompanies = subcompanies;
                                                        newSubcompanies[i].companyPhone2 = companyPhone2
                                                        this.setState({
                                                            subcompanies: newSubcompanies
                                                        });
                                                    }}/>
                                                </div>
                                                <span className="company_counter">{subcompany.companyPhone2.length - 2}/20</span>
                                            </div>
                                            <p className="phone_hint_wrapper">
                                                <span>Номер телефона </span>
                                                {subcompany.defaultPhone===3 && <span className="phone_hint"> (Будет указан в автоуведомлениях)</span>}
                                            </p>
                                            <div className="name_company_wrapper form-control">
                                                <div className="check-box-group2 input-text2">
                                                    <div className="input-text2">
                                                        <input type="radio" aria-label="" name="defaultPhone3" disabled={!(subcompany.companyPhone3 && subcompany.companyPhone3.length > 4)}  checked={subcompany.defaultPhone===3} onChange={(e) => this.handleChangePhone(e, i)}/>
                                                    </div>
                                                    <ReactPhoneInput
                                                        enableLongNumbers={true}
                                                        regions={['america', 'europe']}
                                                        disableAreaCodes={true}
                                                        placeholder=""
                                                        className="company_input"
                                                        // disableCountryCode={true}
                                                        countryCodeEditable={false}
                                                        inputClass={(submitted && !subcompany.companyPhone3  && subcompany.companyPhone3.length!==0 && !isValidNumber(subcompany.companyPhone3) ? 'company_input redBorder' : 'company_input')}

                                                        value={subcompany.companyPhone3} defaultCountry={'by'} onChange={companyPhone3 => {
                                                        const newSubcompanies = subcompanies;
                                                        newSubcompanies[i].companyPhone3 = companyPhone3
                                                        this.setState({
                                                            subcompanies: newSubcompanies
                                                        });
                                                    }}/>
                                                </div>
                                                <span className="company_counter">{subcompany.companyPhone3.length - 2}/20</span>
                                            </div>
                                            <p>Вид деятельности</p>
                                            <select className="custom-select" onChange={(e) => this.handleNotificationChange(e, i)} name="template"
                                                    value={subcompany && subcompany.template}>
                                                <option value={1}>Сфера услуг</option>
                                                <option value={2}>Коворкинг</option>
                                            </select>
                                        </div>
                                        <div className="col-sm-4">
                                            <p>Фото компании</p>
                                            <div className="upload_container">
                                                <div className="setting image_picker">
                                                    <div className="settings_wrap">
                                                        <label className="drop_target">
                                                            {/*<span/>*/}

                                                            <div className="image_preview">
                                                                <div className="existed-image">
                                                                    <img src={subcompany.imageBase64 && subcompany.imageBase64!==''?("data:image/png;base64,"+subcompany.imageBase64):`${process.env.CONTEXT}public/img/image.png`}/>

                                                                </div>
                                                                {isAvatarOpened &&
                                                                    <Avatar
                                                                        height={180}
                                                                        cropRadius="100%"
                                                                        label=""
                                                                        onCrop={(e) => this.onCrop(e, i)}
                                                                        onClose={this.onClose}
                                                                    />
                                                                }
                                                            </div>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            {saved === i && status === 'saved.settings' &&
                                                <p className="alert-success p-1 rounded pl-3 mb-2">Настройки сохранены</p>
                                            }

                                            <div className="buttons-container-setting">

                                                {(adding && (i === subcompanies.length - 1)) ? null : <button type="button"  className={((saved === i && (status === 'saved.settings' || submitted)) && 'disabledField')+' small-button'} onClick={(e) => {
                                                    if (saved !== i && (status !== 'saved.settings' || !submitted)) {
                                                        this.handleSubmit(e, subcompany, i)
                                                    }
                                                }
                                                }>Сохранить</button>}

                                            </div>
                                        </div>
                                    </div>
                                </form>
                                )
                            )}

                            <button style={{ display: 'block', margin: '0.5rem auto' }} type="button"  className={' small-button'} onClick={() => {
                                if (!adding) {
                                    const newSubcompanies = subcompanies
                                    newSubcompanies.push({
                                        city: '',
                                        companyName: '',
                                        companyAddress1: '',
                                        companyAddress2: '',
                                        companyAddress3: '',
                                        companyPhone1: company.settings.companyPhone1.slice(0, 4),
                                        companyPhone2: company.settings.companyPhone2.slice(0, 4),
                                        companyPhone3: company.settings.companyPhone3.slice(0, 4),
                                    })
                                    this.setState({ adding: true, subcompanies: newSubcompanies  })
                                } else {
                                    this.props.dispatch(companyActions.addSubcompany({
                                        countryCode: company.settings.countryCode,
                                        timezoneId: company.settings.timezoneId,
                                        ...subcompanies[subcompanies.length - 1]
                                    }))
                                    this.setState({ adding: false })
                                }
                            }}>
                                {adding ? 'Сохранить новый филиал' : 'Добавить филиал'}
                            </button>

                        </div>
                    </div>
                    }

                </div>
                {userSettings &&
                <UserSettings
                    onClose={this.onClose2}
                />
                }
                <UserPhoto/>
            </div>

        );
    }


    onClose2(){
        this.setState({...this.state, userSettings: false});
    }

    onOpen(){

        this.setState({...this.state, userSettings: true});
    }
}

function mapStateToProps(state) {
    const { alert, authentication, notification, company } = state;
    return {
        alert, authentication, notification, company
    };
}

const connectedMainIndexPage = connect(mapStateToProps)(MainIndexPage);
export { connectedMainIndexPage as MainIndexPage };
