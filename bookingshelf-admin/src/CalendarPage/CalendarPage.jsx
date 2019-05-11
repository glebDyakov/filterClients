import React, {Component} from 'react';
import {connect} from 'react-redux';

import {calendarActions, staffActions, clientActions, servicesActions, companyActions} from '../_actions';
import {HeaderMain} from "../_components/HeaderMain";

import '../../public/scss/calendar.scss'
import '../../public/scss/styles.scss'

import moment from 'moment';
import 'moment/locale/ru';
import 'moment-duration-format';

import {DatePicker} from "../_components/DatePicker";
import Pace from "react-pace-progress";

import 'react-day-picker/lib/style.css';
import '../../public/css_admin/date.css'
import {access} from "../_helpers/access";
import {CalendarModals} from "../_components/modals/CalendarModals";
import {userActions} from "../_actions/user.actions";


function getWeekDays(weekStart) {
    const days = [weekStart];
    for (let i = 1; i < 7; i += 1) {
        days.push(
            moment(weekStart).utc().locale('ru')
                .add(i, 'days')
                .toDate()
        );
    }
    return days;
}

function getWeekRange(date) {
    return {
        from: moment(date).locale('ru')
            .startOf('week')
            .toDate(),
        to: moment(date).locale('ru')
            .endOf('week')
            .toDate(),
    };
}

function getDayRange(date) {
    return {
        from: moment(date).utc().locale('ru')
            .toDate(),
        to: moment(date).utc().locale('ru')
            .endOf('day')
            .toDate(),
    };
}

class CalendarPage extends Component {
    constructor(props) {
        super(props);

        let staffFromUrl, param1, dateFrom, dateFr, dateTo, dateToType;

        if(!access(2)) {
            staffFromUrl = 2;
            param1 = 3;

            dateFrom = moment().utc().toDate();

            dateFr = moment(getDayRange(moment()).from);

            dateTo = [getDayRange(moment()).from]

            dateToType = 'day'


        }else {
            param1=props.match.params.selectedType ?
                props.match.params.selectedType==='workingstaff' ? 1 :(props.match.params.selectedType==='allstaff'
                    ? 2
                    :3 )
                : 1;

            dateFrom=props.match.params.dateFrom ?
                moment(props.match.params.dateFrom, 'DD-MM-YYYY').utc().toDate() :
                moment().utc().startOf('day').toDate()

            dateFr=props.match.params.dateFrom ?
                moment(props.match.params.dateFrom, 'DD-MM-YYYY') :
                moment();


            dateTo=props.match.params.dateTo ? getWeekDays(getWeekRange(dateFr).from) :
                [getDayRange(dateFr).from]

            dateToType=props.match.params.dateTo ? 'week' :
                'day'

            staffFromUrl=props.match.params.selectedType==='staff' ? parseInt(props.match.params.staffNum) :
                null;
        }

        if(!access(2) && props.match.params.selectedType && props.match.params.staffNum && props.match.params.dateFrom && props.match.params.selectedType!=='staff'){
            props.history.push('/denied')
        }

        this.state = {
            timetableFrom: 0,
            timetableTo: 0,
            staffAll: props.staff,
            workingStaff: [],
            clickedTime: 0,
            minutes:[],
            minutesReservedtime:[],
            isLoading: true,
            opacity: false,
            closedDates: {},

            selectedDay: dateFrom,
            selectedDayMoment: dateFr,
            type: dateToType,
            typeSelected: param1,
            selectedDays: dateTo,
            reservedTimeEdited: null,
            selectedStaff: [],
            staffFromUrl: staffFromUrl,
            pressedDragAndDrop: true,
            scroll: true,
            reservedTime: null,
            reservedStuffId: null,
            userSettings: false,
            reserved: false,
            appointmentModal: false,
            newClientModal: false
        };

        this.newAppointment = this.newAppointment.bind(this);
        this.setWorkingStaff = this.setWorkingStaff.bind(this);
        this.changeTime = this.changeTime.bind(this);
        this.getHours = this.getHours.bind(this);
        this.updateClient = this.updateClient.bind(this);
        this.addClient = this.addClient.bind(this);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.handleDayChange = this.handleDayChange.bind(this);
        this.handleWeekClick = this.handleWeekClick.bind(this);
        this.selectType = this.selectType.bind(this);
        this.showNextWeek = this.showNextWeek.bind(this);
        this.showPrevWeek = this.showPrevWeek.bind(this);
        this.scrollToMyRef = this.scrollToMyRef.bind(this);
        this.scrollTop = this.scrollTop.bind(this);
        this.getHours24 = this.getHours24.bind(this);
        this.editAppointment = this.editAppointment.bind(this);
        this.changeReservedTime = this.changeReservedTime.bind(this);
        this.newReservedTime = this.newReservedTime.bind(this);
        this.deleteAppointment = this.deleteAppointment.bind(this);
        this.deleteReserve = this.deleteReserve.bind(this);
        this.approveAppointmentSetter = this.approveAppointmentSetter.bind(this);
        this.updateCalendar = this.updateCalendar.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onCloseClient = this.onCloseClient.bind(this);
        this.onOpen = this.onOpen.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(userActions.checkLogin());
        if (this.props.match.params.selectedType && this.props.match.params.selectedType!=='workingstaff' && this.props.match.params.selectedType!=='staff' && this.props.match.params.selectedType!=='allstaff' && !this.props.match.params.dateFrom){
            this.props.history.push('/nopage');
            return false;
        }

        const {selectedDays, type, selectedDayMoment}=this.state;

        document.title = "Журнал записи | Онлайн-запись";

        this.props.dispatch(staffActions.get());
        this.props.dispatch(clientActions.getClientWithInfo());
        this.props.dispatch(servicesActions.getServices());
        this.props.dispatch(staffActions.getClosedDates());


        if(type==='day'){
            this.props.dispatch(staffActions.getTimetableStaffs(selectedDayMoment.startOf('day').format('x'), selectedDayMoment.endOf('day').format('x')));
            this.props.dispatch(calendarActions.getAppointments(selectedDayMoment.startOf('day').format('x'), selectedDayMoment.endOf('day').format('x')));
            this.props.dispatch(calendarActions.getReservedTime(selectedDayMoment.startOf('day').format('x'), selectedDayMoment.endOf('day').format('x')));
        }else {
            this.props.dispatch(staffActions.getTimetableStaffs(moment(selectedDays[0]).startOf('day').format('x'), moment(selectedDays[6]).endOf('day').format('x')));
            this.props.dispatch(calendarActions.getAppointments(moment(selectedDays[0]).startOf('day').format('x'), moment(selectedDays[6]).endOf('day').format('x')));
            this.props.dispatch(calendarActions.getReservedTime(moment(selectedDays[0]).startOf('day').format('x'), moment(selectedDays[6]).endOf('day').format('x')));
        }

        this.getHours24();

        setTimeout(() => this.setState({ isLoading: false }), 4500);
        setTimeout(()=>this.updateCalendar(), 300000)

        initializeJs();

        this.scrollToMyRef();
    }

    updateCalendar(){
        const {dispatch}=this.props;
        const {selectedDayMoment, selectedDays, type}=this.state;


        if(type==='day'){
           dispatch(staffActions.getTimetableStaffs(selectedDayMoment.startOf('day').format('x'), selectedDayMoment.endOf('day').format('x')));
           dispatch(calendarActions.getAppointments(selectedDayMoment.startOf('day').format('x'), selectedDayMoment.endOf('day').format('x')));
           dispatch(calendarActions.getReservedTime(selectedDayMoment.startOf('day').format('x'), selectedDayMoment.endOf('day').format('x')));
        }else {
           dispatch(staffActions.getTimetableStaffs(moment(selectedDays[0]).startOf('day').format('x'), moment(selectedDays[6]).endOf('day').format('x')));
           dispatch(calendarActions.getAppointments(moment(selectedDays[0]).startOf('day').format('x'), moment(selectedDays[6]).endOf('day').format('x')));
           dispatch(calendarActions.getReservedTime(moment(selectedDays[0]).startOf('day').format('x'), moment(selectedDays[6]).endOf('day').format('x')));
        }
        setTimeout(()=>this.updateCalendar(), 300000)

    }

    componentDidUpdate(prevProps, newProps) {
        const { scroll }=this.state;

        if(scroll){
            this.scrollToMyRef()
        }

        // $('.tabs-scroll').scroll(function () {
        //     $(".left-fixed-tab").scrollTop($(".tabs-scroll").scrollTop());
        //     $(".tabs-scroll").scrollTop($(".tabs-scroll").scrollTop());
        //     $(".fixed-tab").scrollLeft($(".tabs-scroll").scrollLeft());
        //
        // });

        $('.msg-client-info').css({'visibility': 'visible', 'cursor': 'default'})

        $('.calendar-list .tabs-scroll .tab-content-list div').css({'cursor': 'cell'});
        $('.notes').css({'cursor': 'default'});
        $('.notes-title').css({'cursor': 'grabbing'});
        $('.expired').css({'cursor': 'not-allowed'});
        $('textarea').css({'cursor': 'default'});

        $('.add').click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            $('.buttons-container').fadeIn(400);
        });
    }

    scrollToMyRef () {
        const listItemHeight =  parseInt($(".left-fixed-tab div:first-child").height())/92*(((parseInt(moment().format('H'))-2))*4);

        // $(".tabs-scroll").scrollTop(listItemHeight);
        // $(".left-fixed-tab").scrollTop(listItemHeight);


        if(listItemHeight!==0) {
            this.setState({
                ...this.state,
                scroll: false
            })
        }
    }

    scrollTop () {
        const listItemHeight =  parseInt($(".left-fixed-tab div:first-child").height())/64*(((parseInt(moment().format('H')))-7)*4);

        // $(".tabs-scroll").scrollTop();
        // $(".left-fixed-tab").scrollTop();
    }

    componentWillReceiveProps(newProps) {
        if (JSON.stringify(this.props) !== JSON.stringify(newProps)) {
            this.setState({
                userSettings: newProps.authentication.status && newProps.authentication.status===209 ? false : this.state.userSettings,
                reserved: newProps.calendar.status && newProps.calendar.status===209 ? false : this.state.reserved,
                newClientModal: newProps.clients.status && newProps.clients.status===209 ? false : this.state.newClientModal
            });
        }
        if (JSON.stringify(this.props.calendar.status) !== JSON.stringify(newProps.calendar.status)) {
            this.setState({
                appointmentModal: newProps.calendar.status && newProps.calendar.status === 209 ? false : this.state.appointmentModal
            });
        }


        if (JSON.stringify(this.props.staff) !== JSON.stringify(newProps.staff)) {
            if(this.state.typeSelected===3 || this.state.typeSelected===2 || this.state.type==='week') {
                this.setState({
                    staffAll: newProps.staff,
                    opacity: false,
                    typeSelected: this.state.typeSelected===1?3:this.state.typeSelected,
                    selectedStaff: this.state.staffFromUrl!==null && newProps.staff && newProps.staff.availableTimetable
                        ?JSON.stringify(newProps.staff.availableTimetable.filter((staff)=>staff.staffId===(!access(2) ? newProps.authentication.user.profile.staffId : this.state.staffFromUrl))[0])
                        :[],
                    workingStaff: this.state.typeSelected===3 || this.state.type === 'week'
                        ? {availableTimetable: newProps.staff.availableTimetable && newProps.staff.availableTimetable.filter((staff)=>staff.staffId===
                                (!access(2) ? newProps.authentication.user.profile.staffId : (this.state.staffFromUrl===null
                                ? JSON.parse(this.state.selectedStaff).staffId
                                :this.state.staffFromUrl)))
                            }
                        : newProps.staff
                });
            }

            if (this.state.typeSelected===1 && this.state.type!=='week'){
                newProps.staff.availableTimetable && this.setWorkingStaff(newProps.staff.availableTimetable, 1, newProps.staff)
            }
        }

    }


    render() {
        const { calendar, services, clients } = this.props;
        const { approvedId, staffAll, workingStaff, reserved,
            clickedTime, numbers, minutes, minutesReservedtime, staffClicked,
            selectedDay, type, appointmentModal, selectedDays, edit_appointment, infoClient,
            typeSelected, selectedStaff, reservedTimeEdited, reservedTime, reservedStuffId,
            reserveId, reserveStId, selectedDayMoment, userSettings
        } = this.state;

        let datePickerProps;
        let selectedDaysText;

        if (type === 'day') {
            const clDates = staffAll.closedDates && staffAll.closedDates.some((st) =>
                parseInt(moment(st.startDateMillis, 'x').startOf('day').format("x")) <= parseInt(moment(selectedDays[0]).startOf('day').format("x")) &&
                parseInt(moment(st.endDateMillis, 'x').endOf('day').format("x")) >= parseInt(moment(selectedDays[0]).endOf('day').format("x")));

            selectedDaysText = (
                <React.Fragment>
                    {moment(selectedDay).format('dd, DD MMMM ')}
                    {clDates && <span style={{color: 'red', textTransform: 'none', marginLeft: '5px'}}> (выходной)</span>}
                </React.Fragment>
            );
            datePickerProps = {
                type,
                selectedDaysText,
                onLeftArrowClick: ()=>this.handleDayClick(moment(selectedDay).subtract(1, 'day'), {}),
                onRightArrowClick: ()=>this.handleDayClick(moment(selectedDay).add(1, 'day'), {}),
                onDayClick: this.handleDayClick,
                selectedDays: selectedDay
            };
        } else {
            selectedDaysText = (
                moment(selectedDays[0]).startOf('day').format('DD.MM.YYYY') +' - '+ moment(selectedDays[6]).endOf('day').format('DD.MM.YYYY')
            );
            datePickerProps = {
                type,
                selectedDaysText,
                onLeftArrowClick: this.showPrevWeek,
                onRightArrowClick: this.showNextWeek,
                onDayClick: this.handleDayChange,
                selectedDays: selectedDays,
                onWeekClick: this.handleWeekClick,
                getWeekRange
            };
        }
        const calendarModalsProps = {
            appointmentModal, clients, edit_appointment, staffAll, calendar, services, staffClicked,
            clickedTime, selectedDayMoment, selectedDay, workingStaff, numbers, minutes, reserved, type, infoClient, minutesReservedtime,
            reservedTime, reservedTimeEdited, reservedStuffId, approvedId, reserveId, reserveStId, userSettings,
            newReservedTime: this.newReservedTime, changeTime: this.changeTime, changeReservedTime: this.changeReservedTime,
            onClose: this.onClose, updateClient: this.updateClient, addClient: this.addClient, newAppointment: this.newAppointment,
            deleteReserve: this.deleteReserve, deleteAppointment: this.deleteAppointment
        };


        return (
            <div className="calendar" ref={node => { this.node = node; }}>
                {this.state.isLoading && <div className="zIndex"><Pace color="rgb(42, 81, 132)" height="3"  /></div>}

                <div className={"container_wrapper "+(localStorage.getItem('collapse')=='true'&&' content-collapse')}>
                    <div className={"content-wrapper  full-container "+(localStorage.getItem('collapse')=='true'&&' content-collapse')}>
                        <div className="container-fluid">
                            <HeaderMain onOpen={this.onOpen} />
                            <div className="row content calendar-container">
                                <div className="staff_choise col-3">
                                    {access(2) && (
                                        <div
                                            className="bth dropdown-toggle dropdown rounded-button select-menu" role="menu"
                                            data-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                        >
                                            {typeSelected && !!selectedStaff.length && typeSelected===3 && (
                                                <span className="img-container">
                                                    <img
                                                        className="rounded-circle"
                                                        src={JSON.parse(selectedStaff).imageBase64
                                                            ? "data:image/png;base64," + JSON.parse(selectedStaff).imageBase64
                                                            : `${process.env.CONTEXT}public/img/image.png`}
                                                        alt=""
                                                    />
                                                </span>
                                            )}
                                            {typeSelected && typeSelected===1 && < p> Работающие сотрудники </p>}
                                            {typeSelected && !!selectedStaff.length && typeSelected===3 && (
                                                <p>{JSON.parse(selectedStaff).firstName + " " + JSON.parse(selectedStaff).lastName}</p>)
                                            }
                                            {typeSelected && typeSelected===2 && < p> Все сотрудники </p>}

                                        </div>
                                    )}
                                    {!access(2) && selectedStaff && selectedStaff.length && (
                                        <div className="bth rounded-button select-menu" >
                                            <span className="img-container">
                                                <img
                                                    className="rounded-circle"
                                                    src={JSON.parse(selectedStaff).imageBase64
                                                        ? "data:image/png;base64," + JSON.parse(selectedStaff).imageBase64
                                                        : `${process.env.CONTEXT}public/img/image.png`}
                                                    alt=""
                                                />
                                            </span>
                                            <p>{JSON.parse(selectedStaff).firstName + " " + JSON.parse(selectedStaff).lastName}</p>
                                        </div>
                                    )}
                                    {access(2) && (
                                        <ul className="dropdown-menu">
                                            <li>
                                                <a onClick={() => this.setWorkingStaff(staffAll.availableTimetable, 2)}>
                                                    <p>Все сотрудники</p>
                                                </a>
                                            </li>
                                            <li>
                                                <a onClick={() => this.setWorkingStaff(staffAll.availableTimetable, 1)}>
                                                    <p>Работающие сотрудники</p>
                                                </a>
                                            </li>

                                            {staffAll.availableTimetable && staffAll.availableTimetable.sort((a, b) => a.firstName.localeCompare(b.firstName)).map(staffEl => (
                                                <li>
                                                    <a onClick={() => this.setWorkingStaff([staffEl], 3)}>
                                                        <span className="img-container">
                                                            <img className="rounded-circle"
                                                                 src={staffEl.imageBase64
                                                                     ? "data:image/png;base64," + staffEl.imageBase64
                                                                     : `${process.env.CONTEXT}public/img/image.png`}
                                                                 alt=""/>
                                                        </span>
                                                        <p>{staffEl.firstName + " " + staffEl.lastName}</p>
                                                    </a>
                                                </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                                </div>

                                <div className="calendar col-6"><DatePicker {...datePickerProps} /></div>
                                <div className="tab-day-week tab-content col-3">
                                    <ul className="nav nav-tabs">
                                        <li className="nav-item no-bg">
                                            <a
                                                className={type==='day'&&' active show '+"nav-link"}
                                                onClick={()=>this.selectType('day')}
                                                data-toggle="tab"
                                            >
                                                День
                                            </a>
                                        </li>
                                        <li className="nav-item no-bg">
                                            <a
                                                className={type==='week'&&' active show '+"nav-link"}
                                                onClick={()=>this.selectType('week')}
                                            >
                                                Неделя
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="days-container">
                                <div className="tab-pane active" id={selectedDays.length===1 ? "days_20" : "weeks"}>
                                    <div className="calendar-list">
                                        {selectedDays.length === 1 && (
                                            <div
                                                className="fixed-tab"
                                                style={{
                                                    'minWidth': (120*parseInt(workingStaff.timetable && workingStaff.timetable.length))+'px'
                                                }}
                                            >
                                            <div className="tab-content-list">
                                                <div className="hours"><span></span></div>

                                                {workingStaff.availableTimetable && workingStaff.availableTimetable.sort((a, b) => a.firstName.localeCompare(b.firstName)).map((workingStaffElement) => {
                                                        return <div>

                                                                     <span className="img-container">
                                                                         <img className="rounded-circle"
                                                                              src={workingStaffElement.imageBase64 ? "data:image/png;base64," + workingStaffElement.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                                                              alt=""/>
                                                                     </span>
                                                            <p>{workingStaffElement.firstName + " " + workingStaffElement.lastName}</p>
                                                        </div>
                                                    }
                                                )
                                                }
                                            </div>
                                        </div>

                                        )}
                                        <div className="fixed-tab" style={{'minWidth': (120*parseInt(workingStaff.timetable && workingStaff.timetable.length))+'px'}}>
                                            <div className="tab-content-list">
                                                <div className="hours"><span></span></div>

                                                {
                                                    selectedDays.length>1 && selectedDays.map((item, weekKey)=> {

                                                        let clDate=staffAll.closedDates &&staffAll.closedDates.some((st) =>
                                                            parseInt(st.startDateMillis) <= parseInt(moment(item).format("x")) &&
                                                            parseInt(st.endDateMillis) >= parseInt(moment(item).format("x")))

                                                            return <div key={weekKey}
                                                                 >
                                                                <p className="text-capitalize">{moment(item).locale("ru").format('dddd')}<span className={clDate && 'closedDate'}>{clDate ? 'выходной' : moment(item).format("DD/MM")}</span>
                                                                </p>
                                                            </div>
                                                        }
                                                    )
                                                }
                                            </div>
                                        </div>
                                        {/*{workingStaff.availableTimetable &&*/}
                                        <div className="left-fixed-tab">
                                            <div>
                                                {numbers && numbers.map((time) =>
                                                    <div className="tab-content-list ">
                                                        {moment(time, "x").format('mm') === '00' ?
                                                            <div className={"hours" + " "}>
                                                                <span>{moment(time, "x").format('HH:mm')}</span></div>
                                                            : <div className="hours minutes">
                                                                <span>{moment(time, "x").format('HH:mm')}</span></div>
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {/*}*/}

                                        <div className="tabs-scroll"
                                             // style={{'minWidth': (120*parseInt(workingStaff.availableTimetable && workingStaff.availableTimetable.length))+'px'}}
                                        >
                                            {numbers && numbers.map((time, key) =>
                                                <div className={(
                                                    (time>=moment().subtract(15, "minutes").format("x")
                                                    && time<=moment().format("x")) ? '':'')+"tab-content-list"} key={key}>
                                                    <div className="expired"><span/></div>
                                                    {workingStaff.availableTimetable && selectedDays.map((day) => workingStaff.availableTimetable.sort((a, b) => a.firstName.localeCompare(b.firstName)).map((workingStaffElement, staffKey) => {
                                                        let currentTime= parseInt(moment(moment(day).format('DD/MM')+' '+moment(time, 'x').format('HH:mm'), 'DD/MM HH:mm').format('x'));
                                                        let appointment = calendar && calendar.appointments &&
                                                            calendar.appointments.map((appointmentStaff) =>
                                                                appointmentStaff.appointments &&
                                                                appointmentStaff.staff.staffId === workingStaffElement.staffId &&
                                                                    appointmentStaff.appointments.filter((appointment)=>{
                                                                        return currentTime <= parseInt(appointment.appointmentTimeMillis)
                                                                             && parseInt(moment(moment(day).format('DD/MM')+' '+moment(numbers[key + 1], 'x').format('HH:mm'), 'DD/MM HH:mm').format('x')) > parseInt(appointment.appointmentTimeMillis)
                                                                     })
                                                            );

                                                            let reservedTime = calendar && calendar.reservedTime &&
                                                            calendar.reservedTime.map((reserve) =>
                                                                reserve.reservedTimes &&
                                                                reserve.staff.staffId === workingStaffElement.staffId &&
                                                                reserve.reservedTimes.filter((reservedTime)=>{
                                                                    return currentTime <= parseInt(reservedTime.startTimeMillis)
                                                                        && parseInt(moment(moment(day).format('DD/MM')+' '+moment(numbers[key + 1], 'x').format('HH:mm'), 'DD/MM HH:mm').format('x')) > parseInt(reservedTime.startTimeMillis)
                                                                })
                                                            );

                                                            appointment = appointment && appointment.filter(Boolean)
                                                            reservedTime = reservedTime && reservedTime.filter(Boolean)

                                                        let clDate = staffAll.closedDates && staffAll.closedDates.some((st) =>
                                                            parseInt(moment(st.startDateMillis, 'x').startOf('day').format("x")) <= parseInt(moment(day).startOf('day').format("x")) &&
                                                            parseInt(moment(st.endDateMillis, 'x').endOf('day').format("x")) >= parseInt(moment(day).endOf('day').format("x")))


                                                        let workingTimeEnd=null;
                                                        let notExpired = workingStaffElement && workingStaffElement.availableDays && workingStaffElement.availableDays.length!==0 &&
                                                            workingStaffElement.availableDays.some((availableDay)=>
                                                                parseInt(moment(moment(availableDay.dayMillis, 'x').format('DD/MM')+' '+moment(time, 'x').format('HH:mm'), 'DD/MM HH:mm').format('x'))===currentTime &&
                                                                availableDay.availableTimes && availableDay.availableTimes.some((workingTime)=>{
                                                                    workingTimeEnd=workingTime.endTimeMillis;
                                                                    return currentTime>=parseInt(moment().format("x")) &&
                                                                        currentTime>=parseInt(moment(moment(workingTime.startTimeMillis, 'x').format('DD/MM')+' '+moment(workingTime.startTimeMillis, 'x').format('HH:mm'), 'DD/MM HH:mm').format('x')) &&
                                                                        currentTime<parseInt(moment(moment(workingTime.endTimeMillis, 'x').format('DD/MM')+' '+moment(workingTime.endTimeMillis, 'x').format('HH:mm'), 'DD/MM HH:mm').format('x'))}

                                                                ));
                                                        let resultMarkup;
                                                        if(appointment && appointment[0] && appointment[0].length > 0) {
                                                            let totalDuration = appointment[0][0].duration;
                                                            let appointmentServices = [];
                                                            appointmentServices.push(appointment[0][0].serviceName);
                                                            if (appointment[0][0].hasCoAppointments) {
                                                                calendar.appointments.forEach(staffAppointment => staffAppointment.appointments.forEach(currentAppointment => {
                                                                    if (currentAppointment.coAppointmentId === appointment[0][0].appointmentId) {
                                                                        totalDuration += currentAppointment.duration;
                                                                        appointmentServices.push(currentAppointment.serviceName)
                                                                    }
                                                                }))
                                                            }
                                                            resultMarkup = (
                                                                <div
                                                                    className={currentTime <= moment().format("x")
                                                                    && currentTime >= moment().subtract(15, "minutes").format("x") ? 'present-time ' : ''}
                                                                >
                                                                    <div
                                                                        className={"notes " + appointment[0][0].color.toLowerCase() + "-color " + (parseInt(moment(currentTime).format("H")) >= 20 && 'notes-bottom')}
                                                                        style={{display: appointment[0][0].coAppointmentId ? 'none' : 'block'}}
                                                                        key={appointment[0][0].appointmentId + "_" + key}
                                                                        id={appointment[0][0].appointmentId + "_" + workingStaffElement.staffId + "_" + appointment[0][0].duration + "_" + appointment[0][0].appointmentTimeMillis + "_" + moment(appointment[0][0].appointmentTimeMillis, 'x').add(appointment[0][0].duration, 'seconds').format('x')}
                                                                    >
                                                                        <p className="notes-title">
                                                                            {!appointment[0][0].online &&
                                                                            <span className="pen"
                                                                                  title="Запись через журнал"/>}
                                                                            {/*<span className="men"*/}
                                                                            {/*title="Постоянный клиент"/>*/}
                                                                            {appointment[0][0].online &&
                                                                            <span className="globus"
                                                                                  title="Онлайн-запись"/>}

                                                                            <span className="delete"
                                                                                  data-toggle="modal"
                                                                                  data-target=".delete-notes-modal"
                                                                                  title="Отменить встречу"
                                                                                  onClick={() => this.approveAppointmentSetter(appointment[0][0].appointmentId)}/>
                                                                            {appointment[0][0].hasCoAppointments && <span className="super-visit" title="Мультивизит"/>}
                                                                            <span
                                                                                className="service_time">{moment(appointment[0][0].appointmentTimeMillis, 'x').format('HH:mm')} -
                                                                                {moment(appointment[0][0].appointmentTimeMillis, 'x').add(totalDuration, 'seconds').format('HH:mm')}</span>
                                                                        </p>
                                                                        <p className="notes-container"
                                                                           style={{height: ((totalDuration / 60 / 15) - 1) * 20 + "px"}}>
                                                                            <textarea>{appointment[0][0].serviceName}</textarea>

                                                                        </p>
                                                                        <div className="msg-client-info">
                                                                            {clients && clients.client && clients.client.map((client) => (
                                                                                 client.clientId === appointment[0][0].clientId &&
                                                                                    <div className="msg-inner">
                                                                                        <p className="new-text">Запись</p>
                                                                                        <p className="client-name-book">Клиент</p>
                                                                                        <p className="name">{client.firstName} {client.lastName}</p>
                                                                                        <p>{client.phone}</p>

                                                                                        <p className="client-name-book">{appointmentServices.length > 1 ? 'Список услуг' : 'Услуга'}</p>
                                                                                        {appointmentServices.map(service =>
                                                                                            <p>{service}</p>)}
                                                                                        <p>{moment(appointment[0][0].appointmentTimeMillis, 'x').format('HH:mm')} -
                                                                                            {moment(appointment[0][0].appointmentTimeMillis, 'x').add(totalDuration, 'seconds').format('HH:mm')}</p>
                                                                                        <p>{workingStaffElement.firstName} {workingStaffElement.lastName}</p>

                                                                                        <a
                                                                                            className="a-client-info"
                                                                                            data-target=".client-detail"
                                                                                            title="Просмотреть клиента"
                                                                                            onClick={(e) => {
                                                                                                $('.client-detail').modal('show')
                                                                                                this.setState({
                                                                                                    infoClient: client
                                                                                                });


                                                                                            }}>Просмотреть клиента</a>
                                                                                    </div>))
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        } else if ( reservedTime && reservedTime[0] && reservedTime[0].length > 0 ) {
                                                            resultMarkup = (
                                                                <div className='reserve'>
                                                                    <div className="notes color-grey"
                                                                         style={{backgroundColor: "darkgrey"}}>

                                                                        <p className="notes-title"
                                                                           style={{cursor: 'default'}}>
                                                                                <span className=""
                                                                                      title="Онлайн-запись"/>
                                                                            <span
                                                                                className="service_time"
                                                                            >{moment(reservedTime[0][0].startTimeMillis, 'x').format('HH:mm')}
                                                                                -
                                                                                {moment(reservedTime[0][0].endTimeMillis, 'x').format('HH:mm')}</span>

                                                                        </p>
                                                                        <p className="notes-container"
                                                                           style={{height: (parseInt(((moment.utc(reservedTime[0][0].endTimeMillis - reservedTime[0][0].startTimeMillis, 'x').format('x') / 60000 / 15) - 1) * 20)) + "px"}}>
                                                                            <textarea
                                                                                style={{color: '#5d5d5d'}}>{reservedTime[0][0].description}</textarea>
                                                                            <span className="delete-notes"
                                                                                  style={{right: '5px'}}
                                                                                  data-toggle="modal"
                                                                                  data-target=".delete-reserve-modal"
                                                                                  title="Удалить"
                                                                                  onClick={() => this.setState({
                                                                                      ...this.state,
                                                                                      reserveId: reservedTime[0][0].reservedTimeId,
                                                                                      reserveStId: workingStaffElement.staffId
                                                                                  })}
                                                                            />
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )
                                                        } else {
                                                            resultMarkup = (
                                                                <div
                                                                    id={currentTime <= moment().format("x") && currentTime >= moment().subtract(15, "minutes").format("x") ? 'present-time ' : ''}
                                                                    className={`col-tab ${currentTime <= moment().format("x")
                                                                    && currentTime >= moment().subtract(15, "minutes").format("x") ? 'present-time ' : ''}
                                                                            ${currentTime < parseInt(moment().format("x")) ? '' : ""}
                                                                            ${notExpired ? '' : "expired"}
                                                                            ${clDate ? 'closedDateTick' : ""}`}
                                                                    time={currentTime}
                                                                    timeEnd={workingTimeEnd}
                                                                    staff={workingStaffElement.staffId}
                                                                    onClick={() => notExpired && this.changeTime(currentTime, workingStaffElement, numbers, false, null)}
                                                                ><span
                                                                    className="fade-time">{moment(time, 'x').format("HH:mm")}</span>
                                                                </div>
                                                            )
                                                        }
                                                        return resultMarkup;

                                                    }))
                                                }

                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <CalendarModals {...calendarModalsProps} />

            </div>
        );
    }


    onClose(){
        this.setState({...this.state, userSettings: false, reserved: false, appointmentModal:false});
    }

    onCloseClient(){
        this.setState({...this.state, newClientModal: false});
    }

    onOpen(){
        console.log("onOpen")

        this.setState({...this.state, userSettings: true});
    }

    newAppointment(appointment, serviceId, staffId, clientId) {
        const {dispatch} = this.props;
        const {selectedDays, type, selectedDayMoment} = this.state;

        if(type==='day'){
            appointment.appointmentTimeMillis=moment(selectedDayMoment.format('DD MM')+" "+moment(appointment.appointmentTimeMillis, 'x').format('HH:mm'), 'DD MM HH:mm').format('x')

            dispatch(calendarActions.addAppointment(JSON.stringify(appointment), serviceId, staffId, clientId, selectedDayMoment.startOf('day').format('x'), selectedDayMoment.endOf('day').format('x')));
        }else {
            dispatch(calendarActions.addAppointment(JSON.stringify(appointment), serviceId, staffId, clientId, moment(selectedDays[0]).startOf('day').format('x'), moment(selectedDays[6]).endOf('day').format('x')));
        }

    }

    newReservedTime(staffId, reservedTime) {
        const {dispatch} = this.props;
        const {selectedDayMoment, type} = this.state;

        if(type==='day'){
            reservedTime.startTimeMillis=moment(selectedDayMoment.format('DD MM')+" "+moment(reservedTime.startTimeMillis, 'x').format('HH:mm'), 'DD MM HH:mm').format('x')
            reservedTime.endTimeMillis=moment(selectedDayMoment.format('DD MM')+" "+moment(reservedTime.endTimeMillis, 'x').format('HH:mm'), 'DD MM HH:mm').format('x')
        }else {
        }
        dispatch(calendarActions.addReservedTime(JSON.stringify(reservedTime), staffId));
    }

    editAppointment(appointment) {
        const {dispatch} = this.props;
        const {selectedDays, type, selectedDayMoment} = this.state;

        if(type==='day'){
            dispatch(calendarActions.editAppointmentTime(JSON.stringify(appointment), selectedDayMoment.startOf('day').format('x'), selectedDayMoment.endOf('day').format('x')));
        }else {
            dispatch(calendarActions.editAppointmentTime(JSON.stringify(appointment), moment(selectedDays[0]).startOf('day').format('x'), moment(selectedDays[6]).endOf('day').format('x')));
        }
    }

    approveAppointmentSetter(id){
        this.props.dispatch(companyActions.getNewAppointments());

        this.setState({ approvedId:id })
    }

    deleteAppointment(id){
        const { dispatch, calendar } = this.props;

        const { selectedDays, type, selectedDayMoment } = this.state;
        let activeAppointment = {};
        let countTimeout = 0;
        calendar.appointments.forEach(staffAppointment => staffAppointment.appointments.forEach(currentAppointment => {
            if (currentAppointment.appointmentId === id) {
                activeAppointment = currentAppointment;
            }
        }));

        if(type==='day'){
            dispatch(calendarActions.deleteAppointment(id, selectedDayMoment.startOf('day').format('x'), selectedDayMoment.endOf('day').format('x')));

            if (activeAppointment.hasCoAppointments) {
                calendar.appointments.forEach(staffAppointment => staffAppointment.appointments.forEach(currentAppointment => {
                    if (activeAppointment.appointmentId === currentAppointment.coAppointmentId) {
                        countTimeout += 1000;
                        setTimeout(() => dispatch(calendarActions.deleteAppointment(currentAppointment.appointmentId, selectedDayMoment.startOf('day').format('x'), selectedDayMoment.endOf('day').format('x'))), countTimeout)
                    }
                }))
            }
        } else {
            dispatch(calendarActions.deleteAppointment(id, moment(selectedDays[0]).startOf('day').format('x'), moment(selectedDays[6]).endOf('day').format('x')));

            if (activeAppointment.hasCoAppointments) {
                calendar.appointments.forEach(staffAppointment => staffAppointment.appointments.forEach(currentAppointment => {
                    if (activeAppointment.appointmentId === currentAppointment.coAppointmentId) {
                        countTimeout += 1000;
                        setTimeout(() => dispatch(calendarActions.deleteAppointment(currentAppointment.coAppointmentId, moment(selectedDays[0]).startOf('day').format('x'), moment(selectedDays[6]).endOf('day').format('x'))), countTimeout)
                    }
                }))
            }
        }

        dispatch(companyActions.getNewAppointments());

    }

    deleteReserve(stuffId, id){
        const {dispatch} = this.props;

        const {selectedDays, type, selectedDayMoment} = this.state;

        if(type==='day'){
            dispatch(calendarActions.deleteReservedTime(stuffId, id, selectedDayMoment.startOf('day').format('x'), selectedDayMoment.endOf('day').format('x')));
        }else {
            dispatch(calendarActions.deleteReservedTime(stuffId, id, moment(selectedDays[0]).startOf('day').format('x'), moment(selectedDays[6]).endOf('day').format('x')));
        }
    }

    changeTime(time, staffId, number, edit_appointment, appointment){
        this.setState({...this.state, appointmentModal: true, clickedTime: time, minutesReservedtime:[], minutes: this.getHours(staffId, time, appointment), staffClicked:staffId, edit_appointment: edit_appointment, appointmentEdited: appointment});
    }

    changeReservedTime(minutesReservedtime, staffId, newTime=null){
        const {selectedDays, type, selectedDayMoment} = this.state;

        if(newTime===null) {
            this.setState({ clickedTime: minutesReservedtime, reserved: true });

        }

        return this.getHours(staffId, selectedDayMoment.format('x'));
    }

    handleDayChange (date) {
        const {selectedStaff} = this.state;

        let weeks = getWeekDays(getWeekRange(date).from);
        this.setState({
            ...this.state,
            selectedDays: weeks,
            timetableFrom: moment(weeks[0]).startOf('day').format('x'),
            timetableTo:moment(weeks[6]).endOf('day').format('x')
        });
        this.props.dispatch(staffActions.getTimetableStaffs(moment(weeks[0]).startOf('day').format('x'), moment(weeks[6]).endOf('day').format('x')));
        this.props.dispatch(calendarActions.getAppointments(moment(weeks[0]).startOf('day').format('x'), moment(weeks[6]).endOf('day').format('x')));
        this.props.dispatch(calendarActions.getReservedTime(moment(weeks[0]).startOf('day').format('x'), moment(weeks[6]).endOf('day').format('x')));
        history.pushState(null, '', '/calendar/staff/'+JSON.parse(selectedStaff).staffId+'/'+moment(weeks[0]).format('DD-MM-YYYY')+"/"+moment(weeks[6]).format('DD-MM-YYYY'))

    };

    handleWeekClick (weekNumber, days, e) {
        const {workingStaff, selectedStaff} = this.state;

        this.setState({
            ...this.state,
            selectedDays: days,
            timetableFrom: moment(days[0]).startOf('day').format('x'),
            timetableTo:moment(days[6]).endOf('day').format('x'), type: 'week',
            scroll: true, opacity: false
        });
        history.pushState(null, '', '/calendar/staff/'+JSON.parse(selectedStaff).staffId+'/'+moment(days[0]).format('DD-MM-YYYY')+"/"+moment(days[6]).format('DD-MM-YYYY'))

        this.props.dispatch(staffActions.getTimetableStaffs(moment(days[0]).startOf('day').format('x'), moment(days[6]).endOf('day').format('x')));
        this.props.dispatch(calendarActions.getAppointments(moment(days[0]).startOf('day').format('x'), moment(days[6]).endOf('day').format('x')));
        this.props.dispatch(calendarActions.getReservedTime(moment(days[0]).startOf('day').format('x'), moment(days[6]).endOf('day').format('x')));

    };

    showPrevWeek (){
        const {selectedDays, workingStaff, selectedStaff} = this.state;

        let weeks = getWeekDays(getWeekRange(moment(selectedDays[0]).subtract(7, 'days')).from);

        this.props.dispatch(staffActions.getTimetableStaffs(moment(weeks[0]).startOf('day').format('x'), moment(weeks[6]).endOf('day').format('x')));
        this.props.dispatch(calendarActions.getAppointments(moment(weeks[0]).startOf('day').format('x'), moment(weeks[6]).endOf('day').format('x')));
        this.props.dispatch(calendarActions.getReservedTime(moment(weeks[0]).startOf('day').format('x'), moment(weeks[6]).endOf('day').format('x')));
        this.setState({
            selectedDays: weeks,
            timetableFrom: moment(weeks[0]).startOf('day').format('x'),
            timetableTo:moment(weeks[6]).endOf('day').format('x'),
            workingStaff: {...workingStaff, availableTimetable:[workingStaff.availableTimetable[0]]}, type: 'week',
            scroll: true
        });

        history.pushState(null, '', '/calendar/staff/'+JSON.parse(selectedStaff).staffId+'/'+moment(weeks[0]).format('DD-MM-YYYY')+"/"+moment(weeks[6]).format('DD-MM-YYYY'))

    }

    showNextWeek (){
        const {selectedDays, workingStaff, selectedStaff} = this.state;

        let weeks = getWeekDays(getWeekRange(moment(selectedDays[0]).add(7, 'days')).from);

        this.props.dispatch(staffActions.getTimetableStaffs(moment(weeks[0]).startOf('day').format('x'), moment(weeks[6]).endOf('day').format('x')));
        this.props.dispatch(calendarActions.getAppointments(moment(weeks[0]).startOf('day').format('x'), moment(weeks[6]).endOf('day').format('x')));
        this.props.dispatch(calendarActions.getReservedTime(moment(weeks[0]).startOf('day').format('x'), moment(weeks[6]).endOf('day').format('x')));
        this.setState({
            selectedDays: weeks,
            timetableFrom: moment(weeks[0]).startOf('day').format('x'),
            timetableTo:moment(weeks[6]).endOf('day').format('x'),
            workingStaff: {...workingStaff, availableTimetable:[workingStaff.availableTimetable[0]]}, type: 'week',
            scroll: true
        });
        history.pushState(null, '', '/calendar/staff/'+JSON.parse(selectedStaff).staffId+'/'+moment(weeks[0]).format('DD-MM-YYYY')+"/"+moment(weeks[6]).format('DD-MM-YYYY'))

    }

    handleDayClick(day) {
        const {typeSelected, staffAll, workingStaff, selectedStaff} = this.state;
        let daySelected = moment(day);

        this.props.dispatch(staffActions.getTimetableStaffs(daySelected.startOf('day').format('x'), daySelected.endOf('day').format('x')));
        this.props.dispatch(calendarActions.getAppointments(daySelected.startOf('day').format('x'), daySelected.endOf('day').format('x')));
        this.props.dispatch(calendarActions.getReservedTime(daySelected.startOf('day').format('x'), daySelected.endOf('day').format('x')));

        this.getHours24();

        this.setState({
            ...this.state,
            selectedDay: daySelected.utc().startOf('day').toDate(),
            selectedDayMoment: daySelected,
            selectedDays: [getDayRange(moment(daySelected).format()).from]
        });

        typeSelected===1 && history.pushState(null, '', '/calendar/workingstaff/0/'+daySelected.startOf('day').format('DD-MM-YYYY'))
        typeSelected===2 && history.pushState(null, '', '/calendar/allstaff/0/'+daySelected.startOf('day').format('DD-MM-YYYY'))
        typeSelected===3 && history.pushState(null, '', '/calendar/staff/'+JSON.parse(selectedStaff).staffId+'/'+daySelected.startOf('day').format('DD-MM-YYYY'))
    }

    selectType (type){
        const {workingStaff, staffAll, typeSelected, selectedStaff} = this.state;

        let types=typeSelected



        if(type==='day') {


            this.setState({...this.state, workingStaff: {...workingStaff, availableTimetable:[]}, type: 'day', staffFromUrl:JSON.parse(selectedStaff).staffId, scroll: true, typeSelected: typeSelected, selectedDay: moment().utc().startOf('day').toDate(), selectedDays: [getDayRange(moment().format()).from]});

            this.props.dispatch(staffActions.getTimetableStaffs(moment().startOf('day').format('x'), moment().endOf('day').format('x')));
            this.props.dispatch(calendarActions.getAppointments(moment().startOf('day').format('x'), moment().endOf('day').format('x')));
            this.props.dispatch(calendarActions.getReservedTime(moment().startOf('day').format('x'), moment().endOf('day').format('x')));

            if(typeSelected===3){
                history.pushState(null, '', '/calendar/staff/'+JSON.parse(selectedStaff).staffId+'/'+moment(weeks[0]).format('DD-MM-YYYY'));
            }else{
                history.pushState(null, '', '/calendar/workingstaff/0/'+moment().format('DD-MM-YYYY'))
            }
        }else{
            if(typeSelected===1 || typeSelected===2){
                types=3
            }
            let weeks = getWeekDays(getWeekRange(moment().format()).from);
            this.setState({...this.state, workingStaff: {...workingStaff, availableTimetable:[]}, typeSelected: types, staffFromUrl:JSON.parse(selectedStaff.length!==0 ? selectedStaff : JSON.stringify(staffAll.availableTimetable[0])).staffId, selectedStaff: selectedStaff.length!==0 ? selectedStaff : JSON.stringify(staffAll.availableTimetable[0]), type: 'week', scroll: true, selectedDays: weeks});

            this.props.dispatch(staffActions.getTimetableStaffs(moment(weeks[0]).startOf('day').format('x'),
                moment(weeks[6]).endOf('day').format('x')));
            this.props.dispatch(calendarActions.getAppointments(moment(weeks[0]).startOf('day').format('x'),
                moment(weeks[6]).endOf('day').format('x')));
            this.props.dispatch(calendarActions.getReservedTime(moment(weeks[0]).startOf('day').format('x'),
                moment(weeks[6]).endOf('day').format('x')));

                history.pushState(null, '', '/calendar/staff/'+JSON.parse(selectedStaff.length!==0 ? selectedStaff : JSON.stringify(staffAll.availableTimetable[0])).staffId+'/'+moment(weeks[0]).format('DD-MM-YYYY')+"/"+moment(weeks[6]).format('DD-MM-YYYY'));

        }
    }

    setWorkingStaff(staffEl = null, typeSelected = null, staffAll = null) {
        const {workingStaff, selectedDay, type, selectedStaff, selectedDays} = this.state;


        if(staffAll===null){
            staffAll=this.state.staffAll
        }

        if(type==='week' && typeSelected !== 3){
            this.props.dispatch(staffActions.getTimetableStaffs(moment().startOf('day').format('x'), moment().endOf('day').format('x')));
            this.props.dispatch(calendarActions.getAppointments(moment().startOf('day').format('x'), moment().endOf('day').format('x')));
            this.props.dispatch(calendarActions.getReservedTime(moment().startOf('day').format('x'), moment().endOf('day').format('x')));

            this.setState({ workingStaff: {...workingStaff, availableTimetable:[]}, type: 'day', typeSelected: typeSelected, selectedDay: moment().utc().startOf('day').toDate(), selectedDays: [getDayRange(moment().format()).from]});
            typeSelected===1 ? history.pushState(null, '', '/calendar/workingstaff/0/'+moment().format('DD-MM-YYYY'))
            : history.pushState(null, '', '/calendar/allstaff/0/'+moment().format('DD-MM-YYYY'));

        }else {
            if (typeSelected === 1) {



                let staffWorking = staffEl.filter((item) => item.availableDays.length !== 0 &&
                    item.availableDays.some((time) => {

                            time.availableTimes.some((timing) => {

                            })
                            return parseInt(moment(time.dayMillis, 'x').format('DD')) === parseInt(moment(selectedDay).format('DD'))

                        }
                    ));

                this.setState({
                    staffAll: staffAll,
                    workingStaff: {
                        ...workingStaff,
                        availableTimetable: staffWorking.length === 0 ? null : staffWorking
                    },
                    typeSelected: typeSelected,
                    type: 'day'
                });
                history.pushState(null, '', '/calendar/workingstaff/0/'+moment(selectedDay).format('DD-MM-YYYY'));

            } else if (typeSelected === 2) {

                this.setState({
                    workingStaff: {...workingStaff, availableTimetable: staffEl},
                    typeSelected: typeSelected,
                    type: 'day'
                });

                history.pushState(null, '', '/calendar/allstaff/0/'+moment(selectedDay).format('DD-MM-YYYY'));


            } else {
                let staff=selectedStaff?JSON.stringify(staffEl[0]):JSON.stringify(staffEl.filter((staff)=>staff.staffId===JSON.parse(selectedStaff).staffId));



                this.setState({
                    workingStaff: {...workingStaff, availableTimetable: staffEl},
                    selectedStaff: selectedStaff?JSON.stringify(staffEl[0]):JSON.stringify(staffEl.filter((staff)=>staff.staffId===JSON.parse(selectedStaff).staffId)),
                    typeSelected: typeSelected,
                    staffFromUrl: JSON.parse(staff).staffId
                });

                if(selectedDays.length===1){
                    history.pushState(null, '', '/calendar/staff/'+JSON.parse(staff).staffId+'/'+moment(selectedDay).format('DD-MM-YYYY'));
                }else {
                    history.pushState(null, '', '/calendar/staff/'+JSON.parse(staff).staffId+'/'+moment(selectedDays[0]).format('DD-MM-YYYY')+"/"+moment(selectedDays[6]).format('DD-MM-YYYY'));
                }


            }
        }
    }

    updateClient(client){
        const { dispatch } = this.props;

        dispatch(clientActions.updateClient(JSON.stringify(client)));
    };

    addClient(client){
        const { dispatch } = this.props;

        dispatch(clientActions.addClient(JSON.stringify(client)));
    };

    getHours(idStaff, timeClicked){
        const {workingStaff}=this.state


        let hoursArray=[];
        let day=timeClicked;

        let numbers =[]

        for (let i = 0; i < 24*60; i = i + 15) {
            numbers.push(moment().startOf('day').add(i, 'minutes').format('x'))
        }

        numbers.map((time) =>
            hoursArray.push(moment(time, 'x').format('H:mm'))
        );


        numbers.map((item)=>
            workingStaff.availableTimetable.map((timing)=>
                timing.staffId===idStaff.staffId && timing.availableDays.map((availableDay)=>
                    parseInt(moment(moment(availableDay.dayMillis, 'x').format('DD/MM')+' '+moment(item, 'x').format('HH:mm'), 'DD/MM HH:mm').format('x'))===parseInt(moment(moment(day, 'x').format('DD/MM')+' '+moment(item, 'x').format('HH:mm'), 'DD/MM HH:mm').format('x')) &&

                    availableDay.availableTimes && availableDay.availableTimes.map((time)=> {

                        let currentTime=parseInt(moment(moment(day, 'x').format('DD/MM')+' '+moment(item, 'x').format('HH:mm'), 'DD/MM HH:mm').format('x'));

                        return (currentTime >= time.startTimeMillis && currentTime < time.endTimeMillis && currentTime>=moment().format('x'))
                        && hoursArray.splice(hoursArray.indexOf(moment(item, 'x').format('H:mm')), 1)
                    })
                )
            )
        );

        return hoursArray;
    }

    getHours24 (){
        let numbers =[]

        for (let i = 0; i < 24*60; i = i + 15) {
            numbers.push(moment().startOf('day').add(i, 'minutes').format('x'))
        }

        this.setState({
            ...this.state,
            numbers: numbers
        })
    }


}

function mapStateToProps(store) {
    const {staff, client, calendar, services, authentication} = store;

    return {
        staff, clients: client, calendar, services, authentication
    };
}


const connectedMainIndexPage = connect(mapStateToProps)(CalendarPage);
export {connectedMainIndexPage as CalendarPage};