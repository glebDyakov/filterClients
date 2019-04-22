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
            newAppointment: false,
            approveF: false
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


            this.setState({...this.state,
                staffs: newProps.staff && newProps.staff.staff,
                newAppointment: newProps.staff.newAppointment,
                services: newProps.staff && newProps.staff.services,
                nearestTime:  newProps.staff && newProps.staff.nearestTime,
                workingStaff: newProps.staff.timetableAvailable && newProps.staff.timetableAvailable.availableDays,
                info: newProps.staff.info && newProps.staff.info, disabledDays: disabledDays,

            })
        }
    }

    selectStaff (staff){
        this.setState({...this.state, selectedStaff:staff,
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
        const { selectedStaff,selectedService,group,selectedDay,selectedTime } = this.state;
        const {company} = this.props.match.params

        localStorage.setItem('userInfoOnlineZapis', JSON.stringify(group))

        dispatch(staffActions.add(company, selectedStaff.staffId, selectedService.serviceId,
            JSON.stringify({...group, duration: selectedService.duration,
                appointmentTimeMillis: moment(moment(selectedTime, 'x').format('HH:mm')+" "+moment(selectedDay).format('DD/MM'), 'HH:mm DD/MM').format('x')})));

        this.setState({...this.state,
            screen: 6})
    }


    handleDayClick(day, modifiers = {}) {
        if (modifiers.disabled) {
            return;
        }
        const {company} = this.props.match.params

        let daySelected = modifiers.selected ? undefined : moment(day);


        this.setState({
            ...this.state,
            selectedDay: daySelected.toDate(),
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
        this.approvedButtons.scrollIntoView({ behavior: "smooth" });
    }

    render() {
        const {selectedStaff, selectedService, approveF, disabledDays, selectedDay, staffs, services, numbers, workingStaff, info, selectedTime, screen, group, month, newAppointment, nearestTime }=this.state;

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
                    </div>}
                    <ul className="service_list">
                        {services && services.map((service, serviceKey) =>
                            selectedStaff.staffId && service.staffs && service.staffs.some(st=>st.staffId===selectedStaff.staffId) &&
                            <li onClick={() => this.selectService(service)}
                                className={selectedService && selectedService.serviceId === service.serviceId && 'selected'}
                            >
                                <a className="service_item" href="#">
                                    <p>{service.name}</p>
                                    <p><strong>{service.priceFrom}{service.priceFrom!==service.priceTo && " - "+service.priceTo} </strong> <span>{service.currency}</span></p>
                                    <span
                                        className="runtime"><strong>{moment.duration(parseInt(service.duration), "seconds").format("h[ ч] m[ мин]")}</strong></span>
                                </a>
                            </li>
                        )}
                        {
                            !servicesForStaff &&  <div className="final-book">
                                <p>Нет доступных услуг</p>
                            </div>
                        }

                    </ul>
                </div>
                }
                {screen === 3 &&
                <div className="service_selection screen1">
                    <div className="title_block">
                        <span className="prev_block" onClick={()=>this.setScreen(2)}>Назад</span>
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
                        <div className="service_item">
                            <p>{selectedService.name}</p>
                            <p className={selectedService.priceFrom!==selectedService.priceTo && 'sow'}><strong>{selectedService.priceFrom}{selectedService.priceFrom!==selectedService.priceTo && " - "+selectedService.priceTo} </strong> <span>{selectedService.currency}</span></p>
                            <span
                                className="runtime"><strong>{moment.duration(parseInt(selectedService.duration), "seconds").format("h[ ч] m[ мин]")}</strong></span>
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
                        <span className="prev_block" onClick={()=>this.setScreen(3)}>Назад</span>
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
                        <div className="service_item">
                            <p>{selectedService.name}</p>
                            <p className={selectedService.priceFrom!==selectedService.priceTo && 'sow'}><strong>{selectedService.priceFrom}{selectedService.priceFrom!==selectedService.priceTo && " - "+selectedService.priceTo} </strong> <span>{selectedService.currency}</span></p>
                            <span
                                className="runtime"><strong>{moment.duration(parseInt(selectedService.duration), "seconds").format("h[ ч] m[ мин]")}</strong></span>
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
                            workingStaffElement.availableTimes.map((workingTime) =>
                                workingTime.startTimeMillis >= parseInt(moment().format("x")) &&
                                <div key={i} onClick={() => this.setTime(workingTime.startTimeMillis)}>
                                    <span>{moment(workingTime.startTimeMillis, 'x').format('HH:mm')}</span></div>
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
                        <div className="service_item">
                            <p>{selectedService.name}</p>
                            <p className={selectedService.priceFrom!==selectedService.priceTo && 'sow'}><strong>{selectedService.priceFrom}{selectedService.priceFrom!==selectedService.priceTo && " - "+selectedService.priceTo} </strong> <span>{selectedService.currency}</span></p>
                            <span className="runtime"><strong>{moment.duration(parseInt(selectedService.duration), "seconds").format("h[ ч] m[ мин]")}</strong></span>
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

                {screen === 6 &&
                <div className="service_selection final-screen">
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
                        <div className="service_item">
                            <p>{selectedService.name}</p>
                            <p className={selectedService.priceFrom!==selectedService.priceTo && 'sow'}><strong>{selectedService.priceFrom}{selectedService.priceFrom!==selectedService.priceTo && " - "+selectedService.priceTo} </strong> <span>{selectedService.currency}</span></p>
                            <span className="runtime"><strong>{moment.duration(parseInt(selectedService.duration), "seconds").format("h[ ч] m[ мин]")}</strong></span>
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
                        <button className="approveFYes"  onClick={()=>newAppointment && newAppointment.customId && this._delete(newAppointment.customId)}>Да
                        </button>
                        <button className="approveFNo" onClick={()=>this.setState({...this.state, approveF: false})}>Нет
                        </button>
                    </div>
                    }
                    <p className="skip_employee"  onClick={() => this.setScreen(2)}> Создать запись</p>

                </div>
                }
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

    selectService (service) {
        const {selectedStaff, staffs, selectedService}=this.state;
        const {company} = this.props.match.params

        let numbers = [];
        let changedStaff = service.staffs && staffs ? staffs.filter((staff)=>service.staffs[0].staffId===staff.staffId)[0] : selectedStaff;

        for (let i = parseInt(moment().utc().startOf('day').format('H'))*60; i <= parseInt(moment().utc().endOf('day').format('H'))*60; i = i + parseInt(service.duration)) {
            numbers.push(moment(moment().utc().startOf('day').utc().format('x'), "x").add(i, 'minutes').format('x'))
        }

        this.setState({
            ...this.state,

        });

        this.props.dispatch(staffActions.getTimetableAvailable(company, selectedStaff && selectedStaff.staffId ? selectedStaff.staffId : changedStaff.staffId, moment.utc().startOf('month').format('x'), moment().endOf('month').format('x'), service.serviceId));

        this.setState({...this.state, selectedService:service, numbers: numbers, selectedStaff: selectedStaff && selectedStaff.staffId ? selectedStaff : changedStaff,
            screen: 3, month:moment.utc().startOf('month').toDate()})
    }

    setTime (time){
        this.setState({...this.state, selectedTime:time,
            screen: 5})

    }

    showPrevWeek (){
        const {selectedStaff, staffs, selectedService, month}=this.state;
        const {company} = this.props.match.params;

        let changedStaff = selectedService.staffs && staffs ? staffs.filter((staff)=>selectedService.staffs[0].staffId===staff.staffId)[0] : selectedStaff;


        this.props.dispatch(staffActions.getTimetableAvailable(company, selectedStaff && selectedStaff.staffId ? selectedStaff.staffId : changedStaff.staffId, moment(month).utc().startOf('month').subtract(1, 'month').format('x'), moment(month).utc().endOf('month').subtract(1, 'month').format('x'), selectedService.serviceId));
        this.setState({...this.state, month: moment(month).utc().subtract(1, 'month').toDate()})
    }

    showNextWeek (){
        const {selectedStaff, staffs, selectedService, month}=this.state;
        const {company} = this.props.match.params;

        let changedStaff = selectedService.staffs && staffs ? staffs.filter((staff)=>selectedService.staffs[0].staffId===staff.staffId)[0] : selectedStaff;


        this.props.dispatch(staffActions.getTimetableAvailable(company, selectedStaff && selectedStaff.staffId ? selectedStaff.staffId : changedStaff.staffId, moment(month).add(1, 'month').utc().startOf('month').format('x'), moment(month).add(1, 'month').utc().endOf('month').format('x'), selectedService.serviceId));
        this.setState({...this.state, month: moment(month).utc().add(1, 'month').toDate()})

    }

    roundDown(number, precision) {
        let date=moment(number, 'x').locale('ru')
        let time = Math.ceil((parseInt(moment(number, 'x').locale('ru').format('m')))/ 15) * 15

        if(time===60){
            return date.add(1, 'hour').format('dddd, HH')+":00";

        }else {
            return date.format('dddd, HH')+":"+moment(time, 'm').format('mm')
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