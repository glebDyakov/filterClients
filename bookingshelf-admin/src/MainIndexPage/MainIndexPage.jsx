import React, {Component} from 'react';
import { connect } from 'react-redux';

import {companyActions, userActions} from '../_actions';
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



class MainIndexPage extends Component {
    constructor(props) {
        super(props);

        if(!access(-1)){
            props.history.push('/denied')
        }

        this.state = {
            authentication: props.authentication,
            company: props.company,
            isLoading: true,
            activeDay: 1,
            status: {},
            submitted: false,
            isAvatarOpened: true,
            userSettings: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeTime = this.onChangeTime.bind(this);
        this.handleChangeAddress = this.handleChangeAddress.bind(this);
        this.handleWeekPicker = this.handleWeekPicker.bind(this);
        this.onCrop = this.onCrop.bind(this)
        this.onClose = this.onClose.bind(this)
        this.onOpen = this.onOpen.bind(this);
        this.onClose2 = this.onClose2.bind(this);
    }

    componentWillReceiveProps(newProps) {
        const { dispatch } = this.props;

        if ( JSON.stringify(this.props.authentication) !==  JSON.stringify(newProps.authentication)) {

            this.setState({...this.state, authentication: newProps.authentication,

                userSettings: newProps.authentication.status && newProps.authentication.status===209 ? false : this.state.userSettings

            })
        }

        if ( JSON.stringify(this.props.company.settings) !==  JSON.stringify(newProps.company.settings)) {

            this.setState({...this.state, company: newProps.company })
        }
        if (newProps.company && newProps.company.status==='saved.settings') {
            this.setState({...this.state, status: newProps.company.status})
            setTimeout(() => {
                this.setState({...this.state, status: {}, submitted: false})
            }, 3000)
        }
    }

    handleChange(e) {
        const { name, value } = e.target;
        const { authentication, company } = this.state;

        if(name==='countryCode'){
            this.setState({...this.state, company: {...company, settings: {...company.settings, [name]: value, timezoneId: '' }}});
        }else {
            this.setState({...this.state, company: {...company, settings: {...company.settings, [name]: value }}});

        }

    }

    handleChangeAddress(e) {
        const { name, value } = e.target;
        const { authentication, company } = this.state;

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

        this.setState({...this.state,  company: {...company, settings: {...company.settings, defaultAddress: address }}});
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

    handleSubmit(e) {
        const { companyName, companyAddress, companyEmail, companyPhone, timezoneId } = this.state.company.settings;
        const { dispatch } = this.props;
        const {settings}=this.state.company;

        this.onClose();


        const phoneIndexes = [1, 2, 3];
        phoneIndexes.forEach(index => settings[`companyPhone${index}`] = settings[`companyPhone${index}`].replace(/[() ]/g, ''));

        e.preventDefault();

        this.setState({...this.state, submitted: true, isAvatarOpened: false });
        setTimeout(() => this.setState({ isAvatarOpened: true }), 100);

        if ((companyName || companyAddress || companyEmail || companyPhone) && timezoneId!=='') {
            dispatch(companyActions.add(settings, JSON.parse(localStorage.getItem('user')).menu, JSON.parse(localStorage.getItem('user')).profile));
        }
    }

    onClose() {
        this.setState({...this.state, preview: null})
    }

    onCrop(preview) {
        const {company}=this.state;

        this.setState({...this.state, company: {...company, settings: {...company.settings, imageBase64: preview.split(',')[1]}}});
    }

    componentDidMount(){
        document.title = "Настройки компании | Онлайн-запись";


        setTimeout(() => this.setState({ isLoading: false }), 4500);
        initializeJs();
    }


    render() {
        const { authentication, submitted, isLoading, activeDay, status, company, userSettings, isAvatarOpened } = this.state;

        return (
            <div>
                {/*{isLoading ? <div className="zIndex"><Pace color="rgb(42, 81, 132)" height="3"  /></div> : null}*/}
                {isLoading && <div className="loader loader-company"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}

                <div className={"container_wrapper "+(localStorage.getItem('collapse')=='true'&&' content-collapse')}>

                    {company && company.settings &&
                    <div className={"content-wrapper "+(localStorage.getItem('collapse')=='true'&&' content-collapse')}>
                        <div className="container-fluid">
                            <HeaderMain
                                onOpen={this.onOpen}
                            />

                            <form className="content retreats company_fields" name="form">
                                <div className="row">
                                    <div className="col-sm-4">
                                        <p>Название компании</p>
                                        <div className="name_company_wrapper form-control">
                                            <input type="text" className="company_input" placeholder="Например: Стоматология" name="companyName" maxLength="40"
                                                   value={company.settings.companyName} onChange={this.handleChange}/>
                                            <span className="company_counter">{company.settings.companyName.length}/40</span>
                                        </div>

                                        <p>Адрес компании</p>
                                        <div className="check-box-group2 form-control">
                                            <div className="input-text2">
                                                <input type="radio" aria-label="" name="defaultAddress1" disabled={!company.settings.companyAddress1}  checked={company.settings.defaultAddress===1} onChange={this.handleChangeAddress}/>
                                            </div>

                                            <input type="text" placeholder="" name="companyAddress1" className="company_input"
                                                   value={company.settings.companyAddress1} onChange={this.handleChange} maxLength="40"/>
                                            <span className="company_counter">{company.settings.companyAddress1.length}/40</span>
                                        </div>

                                        <p>Адрес компании</p>
                                        <div className="check-box-group2 form-control">
                                            <div className="input-text2">
                                                <input type="radio" aria-label="" name="defaultAddress2" disabled={!company.settings.companyAddress2} checked={company.settings.defaultAddress===2} onChange={this.handleChangeAddress}/>
                                            </div>

                                            <input type="text" placeholder="" name="companyAddress2" className="company_input"
                                                   value={company.settings.companyAddress2}  onChange={this.handleChange} maxLength="40"/>
                                            <span className="company_counter">{company.settings.companyAddress2.length}/40</span>
                                        </div>

                                        <p>Адрес компании</p>
                                        <div className="check-box-group2 form-control">
                                            <div className="input-text2">
                                                <input type="radio" aria-label="" name="defaultAddress3" disabled={!company.settings.companyAddress3} checked={company.settings.defaultAddress===3} onChange={this.handleChangeAddress}/>
                                            </div>

                                            <input type="text" placeholder="" name="companyAddress3" className="company_input"
                                                   value={company.settings.companyAddress3} onChange={this.handleChange} maxLength="40"/>
                                            <span className="company_counter">{company.settings.companyAddress3.length}/40</span>
                                        </div>
                                        {/*<p>Cтрана</p>*/}
                                        {/*<div className="">*/}
                                            {/*<select className="custom-select" value ={company.settings.countryCode}  name="countryCode"  onChange={this.handleChange}>*/}
                                                {/*<option value='BLR'>Беларусь</option>*/}
                                                {/*<option value='UKR'>Украина</option>*/}
                                                {/*<option value='RUS'>Россия</option>*/}
                                            {/*</select>*/}
                                        {/*</div>*/}
                                        {/*<p>Таймзона</p>*/}
                                        {/*<div className="">*/}
                                            {/*{company.settings.countryCode === 'BLR' &&*/}
                                            {/*<select className="custom-select" value={company.settings.timezoneId}*/}
                                                    {/*name="timezoneId" onChange={this.handleChange}>*/}
                                                {/*<option value=''>-</option>*/}
                                                {/*<option value='Europe/Minsk'>Europe/Minsk</option>*/}
                                            {/*</select>*/}
                                            {/*}*/}
                                            {/*{company.settings.countryCode === 'UKR' &&*/}
                                            {/*<select className="custom-select" value={company.settings.timezoneId}*/}
                                                    {/*name="timezoneId" onChange={this.handleChange}>*/}
                                                {/*<option value=''>-</option>*/}
                                                {/*<option value='Europe/Kiev'>Europe/Kiev</option>*/}
                                            {/*</select>*/}
                                            {/*}*/}
                                            {/*{company.settings.countryCode === 'RUS' &&*/}
                                            {/*<select className="custom-select" value={company.settings.timezoneId}*/}
                                                    {/*name="timezoneId" onChange={this.handleChange}>*/}
                                                {/*<option value=''>-</option>*/}
                                                {/*<option value='Europe/Moscow'>Europe/Moscow</option>*/}
                                                {/*<option value='Europe/Astrakhan'>Europe/Astrakhan</option>*/}
                                                {/*<option value='Europe/Kaliningrad'>Europe/Kaliningrad'</option>*/}
                                                {/*<option value='Europe/Kirov'>Europe/Kirov</option>*/}
                                                {/*<option value='Europe/Samara'>Europe/Samara</option>*/}
                                                {/*<option value='Europe/Saratov'>Europe/Saratov</option>*/}
                                                {/*<option value='Europe/Simferopol'>Europe/Simferopol</option>*/}
                                                {/*<option value='Europe/Ulyanovsk'>Europe/Ulyanovsk</option>*/}
                                                {/*<option value='Europe/Volgograd'>Europe/Volgograd</option>*/}
                                                {/*<option value='Asia/Anadyr'>Asia/Anadyr</option>*/}
                                                {/*<option value='Asia/Barnaul'>Asia/Barnaul</option>*/}
                                                {/*<option value='Asia/Chita'>Asia/Chita</option>*/}
                                                {/*<option value='Asia/Irkutsk'>Asia/Irkutsk</option>*/}
                                                {/*<option value='Asia/Kamchatka'>Asia/Kamchatka</option>*/}
                                                {/*<option value='Asia/Khandyga'>Asia/Khandyga</option>*/}
                                                {/*<option value='Asia/Krasnoyarsk'>Asia/Krasnoyarsk</option>*/}
                                                {/*<option value='Asia/Magadan'>Asia/Magadan</option>*/}
                                                {/*<option value='Asia/Novokuznetsk'>Asia/Novokuznetsk</option>*/}
                                                {/*<option value='Asia/Novosibirsk'>Asia/Novosibirsk</option>*/}
                                                {/*<option value='Asia/Omsk'>Asia/Omsk</option>*/}
                                                {/*<option value='Asia/Sakhalin'>Asia/Sakhalin</option>*/}
                                                {/*<option value='Asia/Srednekolymsk'>Asia/Srednekolymsk'</option>*/}
                                                {/*<option value='Asia/Tomsk'>Asia/Tomsk</option>*/}
                                                {/*<option value='Asia/Ust-Nera'>Asia/Ust-Nera</option>*/}
                                                {/*<option value='Asia/Vladivostok'>Asia/Vladivostok</option>*/}
                                                {/*<option value='Asia/Yakutsk'>Asia/Yakutsk</option>*/}
                                                {/*<option value='Asia/Yekaterinburg'>Asia/Yekaterinburg</option>*/}
                                            {/*</select>*/}
                                            {/*}*/}
                                        {/*</div>*/}


                                        {/*<p>Время работы</p>*/}
                                        {/*<div className="day-picker">*/}
                                            {/*<span className={activeDay===1 && "active-day"} onClick={()=>this.handleWeekPicker(1)}>Пн</span>*/}
                                            {/*<span  className={activeDay===2 && "active-day"} onClick={()=>this.handleWeekPicker(2)}>Вт</span>*/}
                                            {/*<span  className={activeDay===3 && "active-day"} onClick={()=>this.handleWeekPicker(3)}>Ср</span>*/}
                                            {/*<span  className={activeDay===4 && "active-day"} onClick={()=>this.handleWeekPicker(4)}>Чт</span>*/}
                                            {/*<span  className={activeDay===5 && "active-day"} onClick={()=>this.handleWeekPicker(5)}>Пт</span>*/}
                                            {/*<span  className={activeDay===6 && "active-day"} onClick={()=>this.handleWeekPicker(6)}>Сб</span>*/}
                                            {/*<span  className={activeDay===7 && "active-day"} onClick={()=>this.handleWeekPicker(7)}>Вс</span>*/}
                                        {/*</div>*/}

                                        {/*<TimePicker*/}
                                            {/*id="workStartMilis"*/}
                                            {/*value={company.settings.companyTimetables ? moment(parseInt(company.settings.companyTimetables[activeDay-1].startTimeMillis), 'x') : moment().startOf('day').add('7 hours').format('x')}*/}
                                            {/*className="col-md-4 p-0 pull-left pr-3"*/}
                                            {/*key={activeDay+"start"}*/}
                                            {/*minuteStep={15}*/}
                                            {/*showSecond={false}*/}
                                            {/*onChange={(startTimeMillis) => this.onChangeTime('startTimeMillis', moment(startTimeMillis).format('x'), activeDay-1)}*/}
                                        {/*/>*/}
                                        {/*<TimePicker*/}
                                            {/*id="workEndMilis"*/}
                                            {/*value={company.settings.companyTimetables ? moment(parseInt(company.settings.companyTimetables[activeDay-1].endTimeMillis), 'x') : moment().startOf('day').add('22 hours').format('x')}*/}
                                            {/*className="col-md-4 p-0 pull-left"*/}
                                            {/*minuteStep={15}*/}
                                            {/*key={activeDay+"end"}*/}
                                            {/*showSecond={false}*/}
                                            {/*onChange={(endTimeMillis) => this.onChangeTime('endTimeMillis', moment(endTimeMillis).format('x'), activeDay-1)}*/}
                                        {/*/>*/}
                                        <div>

                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <p>Email</p>
                                        <div className="name_company_wrapper form-control">
                                            <div className="input-text2">
                                                <input type="email" placeholder="Например: walkerfrank@gmail.com" name="companyEmail" disabled className="company_input disabledField"
                                                       value={company.settings.companyEmail} onChange={this.handleChange} maxLength="60"/>
                                            </div>
                                        </div>
                                        <p className="phone_hint_wrapper">
                                            <span>Номер телефона </span>
                                            <span className="phone_hint"> (Будет указан в автоуведомлениях)</span>
                                        </p>
                                        <div className="name_company_wrapper form-control">
                                            <div className="input-text2">
                                                <ReactPhoneInput
                                                    enableLongNumbers={true}
                                                    // disableCountryCode={true}
                                                    regions={['america', 'europe']}
                                                    placeholder=""
                                                    disableAreaCodes={true}
                                                    countryCodeEditable={true}
                                                    inputClass={(submitted && !company.settings.companyPhone1 || submitted && !isValidNumber(company.settings.companyPhone1) ? 'company_input redBorder' : 'company_input')}
                                                    value={company.settings.companyPhone1} defaultCountry={'by'} onChange={companyPhone1 => {
                                                    this.setState({
                                                        company: {
                                                            ...company,
                                                            settings: {...company.settings, companyPhone1 }
                                                        }
                                                    });
                                                }}/>
                                            </div>
                                            <span className="company_counter">{company.settings.companyPhone1.length - 2}/20</span>
                                        </div>


                                        <p className="mt-2">Номер телефона</p>
                                        <div className="name_company_wrapper form-control">
                                            <div className="input-text2">
                                                <ReactPhoneInput
                                                    enableLongNumbers={true}
                                                    // disableCountryCode={true}
                                                    regions={['america', 'europe']}
                                                    placeholder=""
                                                    className="company_input"
                                                    disableAreaCodes={true}
                                                    countryCodeEditable={false}
                                                    inputClass={(submitted && !company.settings.companyPhone2 && company.settings.companyPhone2.length!==0 && !isValidNumber(company.settings.companyPhone2) ? 'company_input redBorder' : 'company_input')}

                                                    value={company.settings.companyPhone2} defaultCountry={'by'} onChange={companyPhone2 => {
                                                    this.setState({
                                                        company: {
                                                            ...company,
                                                            settings: {...company.settings, companyPhone2 }
                                                        }
                                                    });
                                                }}/>
                                            </div>
                                            <span className="company_counter">{company.settings.companyPhone2.length - 2}/20</span>
                                        </div>
                                        <p className="mt-2">Номер телефона</p>
                                        <div className="name_company_wrapper form-control">
                                            <div className="input-text2">
                                                <ReactPhoneInput
                                                    enableLongNumbers={true}
                                                    regions={['america', 'europe']}
                                                    disableAreaCodes={true}
                                                    placeholder=""
                                                    className="company_input"
                                                    // disableCountryCode={true}
                                                    countryCodeEditable={false}
                                                    inputClass={(submitted && !company.settings.companyPhone3  && company.settings.companyPhone3.length!==0 && !isValidNumber(company.settings.companyPhone3) ? 'company_input redBorder' : 'company_input')}

                                                    value={company.settings.companyPhone3} defaultCountry={'by'} onChange={companyPhone3 => {
                                                    this.setState({
                                                        company: {
                                                            ...company,
                                                            settings: {...company.settings, companyPhone3 }
                                                        }
                                                    });
                                                }}/>
                                            </div>
                                            <span className="company_counter">{company.settings.companyPhone3.length - 2}/20</span>
                                        </div>
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
                                                                <img src={company.settings.imageBase64 && company.settings.imageBase64!==''?("data:image/png;base64,"+company.settings.imageBase64):`${process.env.CONTEXT}public/img/image.png`}/>

                                                            </div>
                                                            {isAvatarOpened &&
                                                                <Avatar
                                                                    height={180}
                                                                    cropRadius="100%"
                                                                    label=""
                                                                    onCrop={this.onCrop}
                                                                    onClose={this.onClose}
                                                                />
                                                            }
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        {status === 'saved.settings' &&
                                            <p className="alert-success p-1 rounded pl-3 mb-2">Настройки сохранены</p>
                                        }

                                        <div className="buttons-container-setting">

                                            <button type="button"  className={((status === 'saved.settings' || submitted) && 'disabledField')+' small-button'} onClick={(status !== 'saved.settings' || !submitted) && this.handleSubmit}>Сохранить</button>

                                        </div>
                                    </div>
                                </div>
                                {/*<input type="submit" className='small-button mobileButton' value="Сохранить"/>*/}
                            </form>
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
    const { alert, authentication, company } = state;
    return {
        alert, authentication, company
    };
}

const connectedMainIndexPage = connect(mapStateToProps)(MainIndexPage);
export { connectedMainIndexPage as MainIndexPage };
