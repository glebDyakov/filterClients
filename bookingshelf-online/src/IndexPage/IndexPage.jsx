import React from 'react';
import { connect } from 'react-redux';
import {staffActions} from "../../../bookingshelf-online/src/_actions";
import moment from 'moment';
import 'moment-duration-format';
import 'moment/locale/ru';
import 'moment-timezone';

import DayPicker from "react-day-picker";
import MomentLocaleUtils from 'react-day-picker/moment';
import ReactPhoneInput from "react-phone-input-2";
import { isValidNumber } from 'libphonenumber-js'

class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedStaff: [],
            selectedService: [],
            interval: 15,
            group:localStorage.getItem('userInfoOnlineZapis') ? JSON.parse(localStorage.getItem('userInfoOnlineZapis')) : {},
            screen: 1,
            info: props.staff.info,
            month: moment().utc().toDate(),
            selectedDay: undefined,
            newAppointments: [],
            approveF: false,
            selectedServices: [],
            allPriceFrom: 0,
            allPriceTo: 0
        };


        this.selectStaff=this.selectStaff.bind(this);
        this.selectService=this.selectService.bind(this);
        this.handleDayClick=this.handleDayClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.isValidEmailAddress = this.isValidEmailAddress.bind(this);
        this.showNextWeek = this.showNextWeek.bind(this);
        this.showPrevWeek = this.showPrevWeek.bind(this);
        this._delete = this._delete.bind(this);
        this.roundDown = this.roundDown.bind(this);
        this.getServiceIdList = this.getServiceIdList.bind(this);

    }



    componentDidMount () {
        const {company} = this.props.match.params


        this.props.dispatch(staffActions.get(company));
        this.props.dispatch(staffActions.getInfo(company));
        this.props.dispatch(staffActions.getNearestTime(company));
        this.props.dispatch(staffActions.getServices(company));

    }

    componentWillReceiveProps(newProps) {
        if ( JSON.stringify(this.props.staff) !==  JSON.stringify(newProps.staff)) {
            if(newProps.staff.info) {
                document.title = newProps.staff.info.companyName + " | Онлайн-запись";
            }
            newProps.staff.info && moment.tz.setDefault(newProps.staff.info.timezoneId)

            let disabledDays=[];
            for(let i= parseInt(moment(moment(this.state.month).format('MMMM'), 'MMMM').startOf('month').format('D'));
                i<=parseInt(moment(moment(this.state.month).format('MMMM'), 'MMMM').endOf('month').format('D'));i++) {
                let avDay=newProps.staff && newProps.staff.timetableAvailable &&
                    newProps.staff.timetableAvailable.availableDays.filter((time, key, elements) =>{
                        return parseInt(moment(time.dayMillis, 'x').format('D'))===i && time.availableTimes.length!==0 &&
                            time.availableTimes.some((timeOne)=>parseInt(moment(timeOne.startTimeMillis, 'x').format('x'))>=parseInt(moment().utc().format('x')))
                    })

                if(avDay && avDay.length===0 || parseInt(moment(moment(this.state.month).format('MMMM')+"/"+i, 'MMMM/D').utcOffset('-4').format('x'))<
                    parseInt(moment().utcOffset('-4').startOf('day').format('x'))){
                    disabledDays.push(new Date(moment(moment(this.state.month).format('MMMM')+"/"+i, 'MMMM/D').utcOffset('-4').format('YYYY-MM-DD HH:mm').replace(/-/g, "/")))}

            }

            newProps.staff && newProps.staff.timetableAvailable && newProps.staff.timetableAvailable.availableDays.length===0 && disabledDays.push( {before: moment(this.state.month).utc().endOf('month').add(1, 'day').toDate()});

            this.setState({
                staffs: newProps.staff && newProps.staff.staff,
                newAppointments: newProps.staff.newAppointment,
                services: newProps.staff && newProps.staff.services,
                nearestTime:  newProps.staff && newProps.staff.nearestTime,
                workingStaff: newProps.staff.timetableAvailable && newProps.staff.timetableAvailable.availableDays,
                info: newProps.staff.info && newProps.staff.info, disabledDays: disabledDays,

            })
        }
    }

    selectStaff (staff){
        const {staffs, services, numbers, workingStaff, info, selectedTime, screen, group, month, newAppointment, nearestTime }=this.state;
        let staffId=staff;

        console.log('staff', staffId);


        if(staff.length===0){
            staffs && staffs.length && staffs.sort((a, b) => a.firstName.localeCompare(b.firstName)).map((staff, idStaff) =>
                nearestTime && nearestTime.map((time, id)=>{
                    if(time.staffId===staff.staffId && time.availableDays.length!==0){
                        staffId=staff
                    }
                }))
        }

        console.log('staff', staffId);

        this.setState({...this.state, selectedStaff:staffId,
            screen: 2})
    }

    componentDidUpdate() {
        initializeJs()
    }

    handleChange(e) {
        const { name, value } = e.target;
        const { group } = this.state;

        this.setState({ group: {...group, [name]: value }});
    }

    handleSave (e) {
        const { dispatch } = this.props;
        const { selectedStaff,selectedServices,group,selectedDay,selectedTime } = this.state;
        const {company} = this.props.match.params
        let resultTime = parseInt(selectedTime);
        console.log('selectedTime', selectedTime);
        console.log('selectedServices', selectedServices[0].duration);

        localStorage.setItem('userInfoOnlineZapis', JSON.stringify(group))

        const data = selectedServices.map((selectedService) => {
           const item = {...group, duration: selectedService.duration, serviceId: selectedService.serviceId,
                    appointmentTimeMillis: moment(moment(resultTime, 'x').format('HH:mm')+" "+moment(selectedDay).format('DD/MM'), 'HH:mm DD/MM').format('x')}
            resultTime += selectedService.duration * 1000;
            return item;
        });

        dispatch(staffActions.add(company, selectedStaff.staffId, '',
            JSON.stringify(data)))

        this.setState({...this.state,
            screen: 6})
    }


    handleDayClick(day, modifiers = {}) {
        if (modifiers.disabled) {
            return;
        }
        const {company} = this.props.match.params

        console.log('day', day)
        console.log('modifiers', modifiers)

        let daySelected = !modifiers.selected && moment(day);


        this.setState({
            selectedDay: daySelected ? daySelected.toDate() : this.state.selectedDay,
            screen: 4
        })
    }

    setScreen (num) {
        this.setState({
            screen: num,
        })
    }

    onCancelVisit() {
        this.setState({...this.state, approveF: true});
        setTimeout(() => this.approvedButtons.scrollIntoView({ behavior: "smooth" }), 100);
    }

    render() {
        const {selectedStaff, selectedService, selectedServices, approveF, disabledDays, selectedDay, staffs, services, numbers, workingStaff, info, selectedTime, screen, group, month, newAppointments, nearestTime }=this.state;

        const { error } = this.props.staff;
        let servicesForStaff = selectedStaff.staffId && services && services.some((service, serviceKey) =>{
            return service.staffs && service.staffs.some(st=>st.staffId===selectedStaff.staffId)
        });

        console.log(servicesForStaff);

        return (

            <div className="container_popups">
                {info &&
                <div className="modal_menu">
                    <p className="firm_name">{info && info.companyName}</p>
                    <div className="adress-phones">
                        <p>{info && info["companyAddress" + info.defaultAddress]}</p>
                    </div>
                    <span className="mobile"></span>
                    <p className="phones_firm">
                        {info.companyPhone1 && <a href={"tel:" + info.companyPhone1}>{info.companyPhone1}</a>}
                        {info.companyPhone2 && <a href={"tel:" + info.companyPhone2}>{info.companyPhone2}</a>}
                        {info.companyPhone3 && <a href={"tel:" + info.companyPhone3}>{info.companyPhone3}</a>}
                        <span className="closer"></span>
                    </p>
                    <div className="clear"></div>
                </div>

                }


                {screen === 1 && <div className="service_selection screen1">
                    <div className="title_block n">
                        <p className="modal_title">Выбор сотрудника</p>
                        {selectedStaff.staffId &&
                        <span className="next_block" onClick={() => this.setScreen(2)}>Вперед</span>}
                    </div>
                    <ul className="staff_popup">
                        {staffs && staffs.length && staffs.sort((a, b) => a.firstName.localeCompare(b.firstName)).map((staff, idStaff) =>
                            <li className={(selectedStaff.staffId && selectedStaff.staffId === staff.staffId && 'selected') + ' nb'}
                                onClick={() => this.selectStaff(staff)}
                                key={idStaff}
                            >
                                <a href="#">
                                    <div className="img_container">
                                        <img
                                            src={staff.imageBase64 ? "data:image/png;base64," + staff.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                            alt=""/>
                                        <span>{staff.firstName} <br/>{staff.lastName}</span>
                                    </div>


                                    {nearestTime && nearestTime.map((time, id)=>
                                        time.staffId===staff.staffId && time.availableDays.length!==0 &&
                                        <div className="mobile_block" key={'time'+id}>
                                            <span>Ближайшая запись</span>
                                            <div className="stars" style={{textTransform: 'capitalize'}}>{this.roundDown(parseInt(time.availableDays[0].availableTimes[0].startTimeMillis))}</div>
                                        </div>

                                    )}

                                    {nearestTime && !nearestTime.some((time, id)=>
                                        time.staffId===staff.staffId && time.availableDays.length!==0

                                    ) && <div className="mobile_block">
                                        <span style={{fontWeight: 'bold'}}>Нет записи</span>
                                    </div>


                                    }



                                </a>
                            </li>
                        )}
                    </ul>
                    <p className="skip_employee" onClick={() => this.selectStaff([])}>Пропустить выбор сотрудника</p>
                </div>
                }
                {screen === 2 && <div className="service_selection screen1">
                    <div className="title_block">
                        <span className="prev_block" onClick={()=>this.setScreen(1)}>Назад</span>
                        <p className="modal_title">Выбор услуги</p>
                        {selectedService.serviceId && <span className="next_block" onClick={()=>this.setScreen(3)}>Вперед</span>}
                    </div>
                    {selectedStaff.staffId && <div className="specialist">
                        <div>
                            <p className="img_container">
                                <img
                                    src={selectedStaff.imageBase64 ? "data:image/png;base64," + selectedStaff.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                    alt=""/>
                                <span>{selectedStaff.firstName} <br/>{selectedStaff.lastName}</span>
                            </p>
                            {/*<div className="mobile_block">*/}
                            {/*<span><strong>5.0</strong> / <strong>13</strong> отзывов</span>*/}
                            {/*<div className="stars">*/}
                            {/*<span></span>*/}
                            {/*<span></span>*/}
                            {/*<span></span>*/}
                            {/*<span></span>*/}
                            {/*<span></span>*/}
                            {/*</div>*/}
                            {/*</div>*/}
                        </div>
                        <div className="supperVisDet" >
                                <p>Выбрано услуг: <br/>
                                <p><strong>{selectedServices.length}</strong></p></p>
                                {/*<p>Стоимость<br/><strong>{this.state.allPriceFrom?this.state.allPriceFrom+'-'+this.state.allPriceTo: '0'}</strong></p>*/}
                        </div>
                    </div>}
                    <ul className="service_list">
                        {services && services.map((service, serviceKey) =>
                            selectedStaff.staffId && service.staffs && service.staffs.some(st=>st.staffId===selectedStaff.staffId) &&
                            <li
                                className={selectedService && selectedService.serviceId === service.serviceId && 'selected'}
                            >
                                <div className="service_item">
                                    <label>

                                    <p>{service.name}</p>
                                    <p><strong>{service.priceFrom}{service.priceFrom!==service.priceTo && " - "+service.priceTo} </strong> <span>{service.currency}</span>
                                        <input onChange={(e)=> this.selectService(e, service)} type="checkbox"
                                               checked={selectedServices.some(selectedService => selectedService.serviceId === service.serviceId)} />
                                        <span className="checkHelper" />
                                    </p>
                                    <span
                                        className="runtime"><strong>{moment.duration(parseInt(service.duration), "seconds").format("h[ ч] m[ мин]")}</strong></span>

                                    </label>
                                </div>
                            </li>
                        )}
                        {
                            !servicesForStaff &&  <div className="final-book">
                                <p>Нет доступных услуг</p>
                            </div>
                        }

                    </ul>

                    {!!selectedServices.length &&
                    <div className="button_block" onClick={() => selectedServices.length && this.setScreen(3)}>
                        <button class="button load">Продолжить</button>
                    </div>}
                </div>
                }
                {screen === 3 &&
                <div className="service_selection screen1">
                    <div className="title_block">
                        <span className="prev_block" onClick={()=>{
                            this.setScreen(2);
                            const serviceIdList = this.getServiceIdList(selectedServices);
                            const {company} = this.props.match.params;
                            this.props.dispatch(staffActions.getTimetableAvailable(company, selectedStaff && selectedStaff.staffId, moment().startOf('month').format('x'), moment().endOf('month').format('x'), serviceIdList));
                        }}>
                            Назад</span>
                        <p className="modal_title">Выбор даты</p>
                        {selectedDay && <span className="next_block" onClick={()=>this.setScreen(4)}>Вперед</span>}
                    </div>
                    <div className="specialist">

                        {selectedStaff.staffId &&
                        <div>
                            <p className="img_container">
                                <img
                                    src={selectedStaff.imageBase64 ? "data:image/png;base64," + selectedStaff.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                    alt=""/>
                                <span>{selectedStaff.firstName} {selectedStaff.lastName}</span>
                            </p>
                            {/*<div className="mobile_block">*/}
                            {/*<span><strong>5.0</strong> / <strong>13</strong> отзывов</span>*/}
                            {/*<div className="stars">*/}
                            {/*<span></span>*/}
                            {/*<span></span>*/}
                            {/*<span></span>*/}
                            {/*<span></span>*/}
                            {/*<span></span>*/}
                            {/*</div>*/}
                            {/*</div>*/}
                        </div>
                        }
                        {selectedService.serviceId &&
                        <div className="supperVisDet" >
                            <p>Выбрано услуг: <br/>
                                <p><strong>{selectedServices.length}</strong></p></p>
                            {/*<p>Стоимость<br/><strong>{this.state.allPriceFrom?this.state.allPriceFrom+'-'+this.state.allPriceTo: '0'}</strong></p>*/}
                        </div>
                        }

                    </div>
                    <div className="calendar_modal">
                        {parseInt(moment(month).utc().format('x'))>parseInt(moment().utc().format('x')) && <span className="arrow-left" onClick={this.showPrevWeek}/>}
                        <span className="arrow-right" onClick={this.showNextWeek}/>

                        <DayPicker
                            selectedDays={selectedDay}
                            disabledDays={disabledDays}
                            month={month}
                            onDayClick={this.handleDayClick}
                            localeUtils={MomentLocaleUtils}
                            locale={'ru'}

                        />
                        <p>
                            <span className="dark_blue_text"><span className="round"></span>Запись есть</span>
                            <span className="gray_text"><span className="round"></span>Записи нет</span>
                        </p>
                        <span className="clear"></span>


                    </div>
                </div>
                }
                {screen === 4 &&
                <div className="service_selection screen1">
                    <div className="title_block">
                        <span className="prev_block" onClick={()=> {
                            this.setScreen(3);
                            const serviceIdList = this.getServiceIdList(selectedServices);
                            const {company} = this.props.match.params;
                            this.props.dispatch(staffActions.getTimetableAvailable(company, selectedStaff && selectedStaff.staffId, moment().startOf('month').format('x'), moment().endOf('month').format('x'), serviceIdList));
                        }}>Назад</span>
                        <p className="modal_title">Выбор времени</p>
                        {selectedTime && <span className="next_block" onClick={()=>this.setScreen(5)}>Вперед</span>}
                    </div>
                    <div className="specialist">
                        {selectedStaff.staffId &&
                        <div>
                            <p className="img_container">
                                <img
                                    src={selectedStaff.imageBase64 ? "data:image/png;base64," + selectedStaff.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                    alt=""/>
                                <span>{selectedStaff.firstName} {selectedStaff.lastName}</span>
                            </p>
                            {/*<div className="mobile_block">*/}
                            {/*<span><strong>5.0</strong> / <strong>13</strong> отзывов</span>*/}
                            {/*<div className="stars">*/}
                            {/*<span></span>*/}
                            {/*<span></span>*/}
                            {/*<span></span>*/}
                            {/*<span></span>*/}
                            {/*<span></span>*/}
                            {/*</div>*/}
                            {/*</div>*/}
                        </div>
                        }
                        {selectedService.serviceId &&
                        <div className="supperVisDet" >
                            <p>Выбрано услуг: <br/>
                                <p><strong>{selectedServices.length}</strong></p></p>
                            {/*<p>Стоимость<br/><strong>{this.state.allPriceFrom?this.state.allPriceFrom+'-'+this.state.allPriceTo: '0'}</strong></p>*/}
                        </div>
                        }
                        {selectedDay &&
                        <div className="date_item_popup">
                            <strong>{moment(selectedDay).utc().locale('ru').format('DD MMMM YYYY')}</strong>
                        </div>
                        }
                    </div>
                    <div className="choise_time">

                        {workingStaff && workingStaff.map((workingStaffElement, i) =>
                            parseInt(moment(workingStaffElement.dayMillis, 'x').startOf('day').format('x'))===parseInt(moment(selectedDay).startOf('day').format('x')) &&
                            workingStaffElement.availableTimes.map((workingTime) => {
                                    const countTimes = (workingTime.endTimeMillis - workingTime.startTimeMillis) / 1000 / 60 / 15;
                                    const arrayTimes = []
                                    for( let i = 0 ; i< countTimes; i++) {
                                        arrayTimes.push(workingTime.startTimeMillis + (1000 * 60 * 15 * i))
                                    }

                                    return workingTime.startTimeMillis >= parseInt(moment().format("x")) && arrayTimes.map(arrayTime =>
                                    <div key={i} onClick={() => this.setTime(arrayTime)}>
                                        <span>{moment(arrayTime, 'x').format('HH:mm')}</span>
                                    </div>)
                                }
                            )

                        )
                        }
                    </div>
                </div>
                }
                {screen === 5 &&
                <div className="service_selection screen5">
                    <div className="title_block">
                        <span className="prev_block" onClick={()=>this.setScreen(4)}>Назад</span>
                        <p className="modal_title">Запись</p>
                    </div>
                    <div className="specialist">
                        {selectedStaff.staffId &&
                        <div>
                            <p className="img_container">
                                <img src={selectedStaff.imageBase64?"data:image/png;base64,"+selectedStaff.imageBase64:`${process.env.CONTEXT}public/img/image.png`} alt=""/>
                                <span>{selectedStaff.firstName} {selectedStaff.lastName}</span>
                            </p>
                            {/*<div className="mobile_block">*/}
                            {/*<span><strong>5.0</strong> / <strong>13</strong> отзывов</span>*/}
                            {/*<div className="stars">*/}
                            {/*<span></span>*/}
                            {/*<span></span>*/}
                            {/*<span></span>*/}
                            {/*<span></span>*/}
                            {/*<span></span>*/}
                            {/*</div>*/}
                            {/*</div>*/}
                        </div>
                        }
                        {selectedService.serviceId &&
                        <div className="supperVisDet" >
                            <p>Выбрано услуг: <br/>
                                <p><strong>{selectedServices.length}</strong></p></p>
                            {/*<p>Стоимость<br/><strong>{this.state.allPriceFrom?this.state.allPriceFrom+'-'+this.state.allPriceTo: '0'}</strong></p>*/}
                        </div>
                        }
                        {selectedDay &&
                        <div className="date_item_popup">
                            <strong>{moment(selectedDay).locale('ru').format('DD MMMM YYYY')}</strong>
                        </div>
                        }
                        {selectedTime &&
                        <div className="date_item_popup">
                            <strong>{moment(selectedTime, 'x').format('HH:mm')}</strong>
                        </div>
                        }
                    </div>
                    <p>Имя</p>
                    <input type="text" placeholder="Введите имя" name="clientName" onChange={this.handleChange}
                           value={group.clientName && group.clientName}
                           className={((group.phone && !group.clientName) ? ' redBorder' : '')}
                    />
                    <p>Телефон</p>
                    <div className="phones_country">
                        <ReactPhoneInput
                            regions={['america', 'europe']}
                            disableAreaCodes={true}

                            inputClass={((!group.phone && group.email && group.email!=='' && !isValidNumber(group.phone)) ? ' redBorder' : '')} value={ group.phone }  defaultCountry={'by'} onChange={phone => this.setState({ group: {...group, phone: phone.replace(/[() ]/g, '')} })}
                        />

                    </div>
                    <br/>
                    <p>Email</p>
                    <input type="text" placeholder="Введите email" name="email" onChange={this.handleChange}
                           onKeyUp={() => this.setState({
                               emailIsValid: this.isValidEmailAddress(group.email)
                           })}
                           value={group.email}
                           className={'' + ((group.email && group.email!=='' && !this.isValidEmailAddress(group.email)) ? ' redBorder' : '')}
                    />
                    <p>Комментарии</p>
                    <textarea placeholder="Комментарии к записи"  name="description" onChange={this.handleChange} value={group.description}/>
                    <p className="term">Нажимая кнопку &laquo;записаться&raquo;, вы соглашаетесь с <a href="#">условиями
                        пользовательского соглашения</a></p>
                    <input className={((!selectedStaff.staffId || !selectedService.serviceId || !selectedDay || (group.phone && !isValidNumber(group.phone)) || !selectedTime || !group.clientName) ? 'disabledField': '')+" book_button"} type="submit" value="ЗАПИСАТЬСЯ" onClick={
                        ()=>(selectedStaff.staffId && selectedService.serviceId && selectedDay && group.phone && isValidNumber(group.phone) && selectedTime && group.clientName) && this.handleSave()}/>
                </div>
                }

                {screen === 6 && newAppointments && !!newAppointments.length && !error && <div className="service_selection final-screen">
                    <div className="final-book">
                        <p>Запись успешно создана</p>
                    </div>
                    <div className="specialist">
                        {selectedStaff.staffId &&
                        <div>
                            <p className="img_container">
                                <img src={selectedStaff.imageBase64?"data:image/png;base64,"+selectedStaff.imageBase64:`${process.env.CONTEXT}public/img/image.png`} alt=""/>
                                <span>{selectedStaff.firstName} {selectedStaff.lastName}</span>
                            </p>
                            {/*<div className="mobile_block">*/}
                            {/*<span><strong>5.0</strong> / <strong>13</strong> отзывов</span>*/}
                            {/*<div className="stars">*/}
                            {/*<span></span>*/}
                            {/*<span></span>*/}
                            {/*<span></span>*/}
                            {/*<span></span>*/}
                            {/*<span></span>*/}
                            {/*</div>*/}
                            {/*</div>*/}
                        </div>
                        }
                        {selectedService.serviceId &&
                        <div className="supperVisDet" >
                            <p>Выбрано услуг: <br/>
                                <p><strong>{selectedServices.length}</strong></p></p>
                            {/*<p>Стоимость<br/><strong>{this.state.allPriceFrom?this.state.allPriceFrom+'-'+this.state.allPriceTo: '0'}</strong></p>*/}
                        </div>
                        }
                        {selectedDay &&
                        <div className="date_item_popup">
                            <strong>{moment(selectedDay).locale('ru').format('DD MMMM YYYY')}</strong>
                        </div>
                        }
                        {selectedTime &&
                        <div className="date_item_popup">
                            <strong>{moment(selectedTime, 'x').format('HH:mm')}</strong>
                        </div>
                        }
                    </div>
                    <input type="submit" className="cansel-visit" value="Отменить визит" onClick={() => this.onCancelVisit()}/>
                    {approveF && <div ref={(el) => {this.approvedButtons = el;}} className="approveF">
                        <button className="approveFYes"  onClick={()=>{
                            if (newAppointments.length) {
                                newAppointments.forEach((newAppointment, i) => setTimeout(() => newAppointment && newAppointment.customId && this._delete(newAppointment.customId), 1000 * i))
                            }
                        }}>Да
                        </button>
                        <button className="approveFNo" onClick={()=>this.setState({...this.state, approveF: false})}>Нет
                        </button>
                    </div>
                    }
                    <p className="skip_employee"  onClick={() => this.setScreen(2)}> Создать запись</p>

                </div>
                }
                {screen === 6 && (!error && !newAppointments.length) &&(
                    <div className="loader" >
                        <img src="data:image/gif;base64,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06pdy7at27dw/+PKnUu3rt27ePPq3cu3r9+/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPoEOLHk26tOnTqFOrXs26tevXsGPLnk27tu3buHPr3s27t+/fwIMLH068uPHjyJMrX868ufPn0KNLn069uvXr2LNr3869u/fv4MOLH0++vPnz6NOrX8++vfv38OPLn0+/vv37+PPr38+/v///AAYo4IAEFmjggQgmqOCCDDbo4IMQRijhhBRWaOGFGGao4YYcdujhhyCGKOKIJJZo4okopqjiiiy26OKLMMYo44w01mjjjTjmqOOOPPbo449ABinkkEQWaeSRSCap5P+STDbp5JNQRinllFRWaeWVWGap5ZZcdunll2CGKeaYZJZp5plopqnmmmy26eabcMYp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6quwxirrrLTWauutuOaq66689urrr8AGK+ywxBZr7LHIJqvsssw26+yz0EYr7bTUVmvttdhmq+223Hbr7bfghivuuOSWa+656Kar7rrstuvuu/DGK++89NZr77345qvvvvz26++/AAcs8MCN2QDDACqwQEINJgABABAm1EACCyoMAIP/Dfd8AEEABYwggAERbGDEBhEYIMAIBQQAwQcZb9zxxyGPXPLJKa9sj8YcewyyyCSbjLLKLN/sss4x90wz0GLNQEMQKegAwNNQRy310zqkEAQNM7zDgQYUVICBEWCHLfbYYGNQAQUacKA1116T7bbYZqOtdjtbd/3122/HnfbaduOd99l7b1XAEC1MbfjhUbcwRAHrMJDAAX5HLvYBCTDQ+OOSZ0655ek4DnnmkW9++eeg4y26VTcIgQLirLcOAApC3FDOBCFkUPrtGYQwwey131567ruPQ7vtvmcOPO/EFx/58VG9IMMKrkfP+goyvBAOCB0soPztC3QAwvXZb196//fff4O99uJnTj746Kcf+fpOEXCC9PSzfgIB33hAgPu3E+BB/vvjH+j85w39CXCA/ytgAA8YOQIuJQc+qJ8EWeeDHGxDBA5g4O0cIIILZlCDoOOgNjAIwhB2cIQfLGHkRIiUAcRggjA8XAwGkI0ASECFoJNAAGp4QxxK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3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAwocSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkypdyrSp06dQo0qdSrWq1atYs2rdyrWr169gw4odS7as2bNo06pdy7at27dw/+PKnUu3rt27ePPq3cu3r9+/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPoEOLHk26tOnTqFOrXs26tevXsGPLnk27tu3buHPr3s27t+/fwIMLH068uPHjyJMrX868ufPn0KNLn069uvXr2LNr3869u/fv4MOLH0++vPnz6NOrX8++vfv38OPLn0+/vv37+PPr38+/v///AAYo4IAEFmjggQgmqOCCDDbo4IMQRijhhBRWaOGFGGao4YYcdujhhyCGKOKIJJZo4okopqjiiiy26OKLMMYo44w01mjjjTjmqOOOPPbo449ABinkkEQWaeSRSCap5P+STDbp5JNQRinllFRWaeWVWGap5ZZcdunll2CGKeaYZJZp5plopqnmmmy26eabcMYp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6quwxirrrLTWauutuOaq66689urrr8AGK+ywxBZr7LHIJqvsssw26+yz0EYr7bTUVmvttdhmq+223Hbr7bfghivuuOSWa+656Kar7rrstuvuu/DGK++89NZr77345qvvvvz26++/AAcs8MAXfgBBAAWMIIABEWxgxAYRGCDACAUEAMH/B/cYjLDCDDsMscQUW4zxOjbAMIAKLJBQgwlAAACECTWQwIIKA8BgA6AcaEBBBRgY4fPPQAftMwYVUKABB+/kvHPPQjf9M9FGIz3ODDQEkYIOAGSt9dZcZ61DCkHQMIOeDCRwgNNoO31AAgysU/bZacf989ptf1PAEC10rffeW7cwRAF1ThBCBnIXLnQGIUxQjuCEG+64EYgrns0NQqDA9+WYA4CCEDfACUIHCzwuus8LdABCOJ+HPvrjpZ9ezQsyrJD57JevIMMLbXpAwOq8E+DBN7rzvrrv1BBwAu3IX34C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WI3WeI3YmI3auI3c2I3e+I3gGI7iOHmO5FiO5niO6JiO6riO7NiO7viO8BiP8jiP9FiP9niP+JiP+riP/NiP/viPABmQAjmQBFmQBnmQCJmQCrmQDNmQDvmQEBmREjmRFFmRFnmRGJmRGrmRHNmRHvmRIBmSIjmSJFmSJnmSKJmSKrmSLNmSLvmSMBmT8BAIACH5BAUUAEcALAAAAAAgA1gCAAf/gEeCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAwocSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkypdyrSp06dQo0qdSrWq1atYs2rdyrWr169gw4odS7as2bNo06pdy7at27dw/+PKnUu3rt27ePPq3cu3r9+/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPoEOLHk26tOnTqFOrXs26tevXsGPLnk27tu3buHPr3s27t+/fwIMLH068uPHjyJMrX868ufPn0KNLn069uvXr2LNr3869u/fv4MOLH0++vPnz6NOrX8++vfv38OPLn0+/vv37+PPr38+/v///AAYo4IAEFmjggQgmqOCCDDbo4IMQRijhhBRWaOGFGGao4YYcdujhhyCGKOKIJJZo4okopqjiiiy26OKLMMYo44w01mjjjTjmqOOOPPbo449ABinkkEQWaeSRSCap5P+STDbp5JNQRinllFRWaeWVWGap5ZZcdunll2CGKeaYZJZp5plopqnmmmy26eabcMYp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6quwxirrrLTWauutuOaq66689urrr8AGK+ywxBZr7LHIJqvsssw26+yz0EYr7bTUVmvttdhmq+223Hbr7bfghivuuOSWa+656Kar7rrstuvuu/DGK++89NZr77345qvvvvz2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"/>
                    </div>)
                }
                { screen === 6 && error && (
                    <div className="service_selection final-screen">
                            <div className="final-book">
                                <p>{error}</p>
                            </div>
                        <p className="skip_employee"  onClick={() => this.setScreen(2)}> Создать запись</p>
                    </div>
                )}
                {screen === 7 &&
                <div className="service_selection final-screen">

                    <div className="final-book">
                        <p>Запись успешно отменена</p>
                    </div>

                    <p className="skip_employee"  onClick={() => this.setScreen(2)}> Создать запись</p>

                </div>
                }
                <div className="footer_modal">
                    <p>Работает на <a href="https://online-zapis.com" target="_blank"><strong>Online-zapis.com</strong></a></p>
                </div>

            </div>

        );
    }

    isValidEmailAddress(address) {
        return !! address.match(/.+@.+/);
    }

    _delete(id) {
        this.props.dispatch(staffActions._delete(id));
        this.setScreen(7)
    }

    selectService (e, service) {
        const {selectedStaff, staffs, selectedService}=this.state;
        const {company} = this.props.match.params
        const {selectedServices} = this.state;
        const { checked } = e.target;
        if (checked) {
            selectedServices.push(service);
        } else {
            const index = selectedServices.findIndex(selectedService => selectedService.serviceId === service.serviceId)
            console.log('index', index);
            selectedServices.splice(index, 1);
        }
        console.log('selectedServices', selectedServices);

        let allPriceFrom = 0;
        let allPriceTo = 0;

        let numbers = [];
        let changedStaff = selectedStaff;

        if (selectedServices && selectedServices.length) {
            if (selectedServices && selectedServices[0] && selectedServices[0].staffs && staffs) {
                changedStaff = staffs.filter((staff) => selectedServices[0].staffs[0].staffId === staff.staffId)[0]
            }

            let totalDuration = 0;
            selectedServices.forEach(service => {
                allPriceFrom += service.priceFrom
                allPriceTo += service.priceTo
                totalDuration += service.duration
            })
            for (let i = parseInt(moment().utc().startOf('day').format('H')) * 60; i <= parseInt(moment().utc().endOf('day').format('H')) * 60; i = i + parseInt(totalDuration)) {
                numbers.push(moment(moment().utc().startOf('day').utc().format('x'), "x").add(i, 'minutes').format('x'))
            }

            const serviceIdList = this.getServiceIdList(selectedServices);

            this.props.dispatch(staffActions.getTimetableAvailable(company, selectedStaff && selectedStaff.staffId ? selectedStaff.staffId : changedStaff.staffId, moment().startOf('month').format('x'), moment().endOf('month').format('x'), serviceIdList));
        }
        this.setState({...this.state, selectedService:service, selectedServices, allPriceFrom, allPriceTo, numbers, selectedStaff: selectedStaff && selectedStaff.staffId ? selectedStaff : changedStaff,
            month:moment().startOf('month').toDate()})
    }

    getServiceIdList(selectedServices) {
        let serviceIdList = ''
        selectedServices.forEach((service, i) => {
            serviceIdList = i === 0 ? `${service.serviceId}` : `${serviceIdList},${service.serviceId}`
        });
        return serviceIdList;
    }

    setTime (time){
        this.setState({
            newAppointments: [],
            selectedTime:time,
            screen: 5
        })

    }

    showPrevWeek (){
        const {selectedStaff, staffs, selectedServices, month}=this.state;
        const {company} = this.props.match.params;

        let changedStaff = selectedServices[0].staffs && staffs ? staffs.filter((staff)=>selectedServices[0].staffs[0].staffId===staff.staffId)[0] : selectedStaff;


        this.props.dispatch(staffActions.getTimetableAvailable(company, selectedStaff && selectedStaff.staffId ? selectedStaff.staffId : changedStaff.staffId, moment(month).utc().startOf('month').subtract(1, 'month').format('x'), moment(month).utc().endOf('month').subtract(1, 'month').format('x'), this.state.selectedServices[0].serviceId));
        this.setState({...this.state, month: moment(month).utc().subtract(1, 'month').toDate()})
    }

    showNextWeek (){
        const {selectedStaff, staffs, selectedServices, month}=this.state;
        const {company} = this.props.match.params;

        let changedStaff = selectedServices[0].staffs && staffs ? staffs.filter((staff)=>selectedServices[0].staffs[0].staffId===staff.staffId)[0] : selectedStaff;


        this.props.dispatch(staffActions.getTimetableAvailable(company, selectedStaff && selectedStaff.staffId ? selectedStaff.staffId : changedStaff.staffId, moment(month).add(1, 'month').utc().startOf('month').format('x'), moment(month).add(1, 'month').utc().endOf('month').format('x'), this.state.selectedServices[0].serviceId));
        this.setState({...this.state, month: moment(month).utc().add(1, 'month').toDate()})

    }

    roundDown(number, precision) {
        let date=moment(number, 'x').locale('ru')
        let time = Math.ceil((parseInt(moment(number, 'x').locale('ru').format('m')))/ 15) * 15

        if(time===60){
            return date.add(1, 'hour').format('dddd, HH')+":00";

        }else {
            return date.format('MMMM DD, HH')+":"+moment(time, 'm').format('mm')
        }
    }

}

function mapStateToProps(store) {
    const {staff}=store;

    return {
        staff
    };
}

const connectedApp = connect(mapStateToProps)(IndexPage);
export { connectedApp as IndexPage };