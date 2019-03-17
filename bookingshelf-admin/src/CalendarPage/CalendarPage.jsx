import React, {Component} from 'react';
import {connect} from 'react-redux';

import {calendarActions, staffActions, clientActions, servicesActions, companyActions} from '../_actions';
import {SidebarMain} from "../_components/SidebarMain";
import {HeaderMain} from "../_components/HeaderMain";
import {AddAppointment} from "../_components/modals/AddAppointment";
import {ReservedTime} from "../_components/modals/ReservedTime";

import '../../public/scss/calendar.scss'
import '../../public/scss/styles.scss'

import moment from 'moment';
import 'moment/locale/ru';
import 'moment-duration-format';

import {roundQuarterTime} from "../_helpers";
import {NewClient, UserSettings} from "../_components/modals";
import {UserPhoto} from "../_components/modals/UserPhoto";
import {ClientDetails} from "../_components/modals/ClientDetails";
import {ApproveAppointment} from "../_components/modals/ApproveAppointment";
import {DeleteAppointment} from "../_components/modals/DeleteAppointment";
import {DeleteReserve} from "../_components/modals/DeleteReserve";
import Pace from "react-pace-progress";

import 'react-day-picker/lib/style.css';
import DayPicker from "react-day-picker";
import MomentLocaleUtils from 'react-day-picker/moment';
import '../../public/css_admin/date.css'
import {access} from "../_helpers/access";
import * as ReactDOM from "react-dom";


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
            clients: props.client,
            calendar: props.calendar,
            workingStaff: [],
            services: props.services,
            clickedTime: 0,
            minutes:[],
            minutesReservedtime:[],
            editClient: false,
            client_working: {},
            isLoading: true,
            hoverRange: undefined,
            opacity: false,
            closedDates: {},

            selectedDay: dateFrom,
            selectedDayMoment: dateFr,
            type: dateToType,
            typeSelected: param1,
            selectedDays: dateTo,
            appointmentEdited: null,
            reservedTimeEdited: null,
            selectedStaff: [],
            staffFromUrl: staffFromUrl,
            pressedDragAndDrop: true,
            scroll: true,
            reservedTime: null,
            reservedStuffId: null
        };

        this.newAppointment = this.newAppointment.bind(this);
        this.setWorkingStaff = this.setWorkingStaff.bind(this);
        this.changeTime = this.changeTime.bind(this);
        this.getHours = this.getHours.bind(this);
        this.updateClient = this.updateClient.bind(this);
        this.addClient = this.addClient.bind(this);
        this.handleEditClient = this.handleEditClient.bind(this);
        this.showCalendar = this.showCalendar.bind(this);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.handleDayChange = this.handleDayChange.bind(this);
        this.handleDayEnter = this.handleDayEnter.bind(this);
        this.handleDayLeave = this.handleDayLeave.bind(this);
        this.handleWeekClick = this.handleWeekClick.bind(this);
        this.selectType = this.selectType.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.showNextWeek = this.showNextWeek.bind(this);
        this.showPrevWeek = this.showPrevWeek.bind(this);
        this.scrollToMyRef = this.scrollToMyRef.bind(this);
        this.scrollTop = this.scrollTop.bind(this);
        this.getHours24 = this.getHours24.bind(this);
        this.editAppointment = this.editAppointment.bind(this);
        this.changeReservedTime = this.changeReservedTime.bind(this);
        this.newReservedTime = this.newReservedTime.bind(this);
        this.approveAppointment = this.approveAppointment.bind(this);
        this.deleteAppointment = this.deleteAppointment.bind(this);
        this.deleteReserve = this.deleteReserve.bind(this);
        this.approveAppointmentSetter = this.approveAppointmentSetter.bind(this);
        this.updateCalendar = this.updateCalendar.bind(this);
    }

    componentDidMount() {
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
        const {dispatch}=this.props;
        const {calendar, selectedDays, type, scroll, selectedDayMoment}=this.state;
        const _state=this


        let notes, start;
        let note;
        let pressed=false;
        let app=calendar.appointments

        if(scroll){
            this.scrollToMyRef()
        }

        if(this.state.opacity) {
            console.log(this.state.opacity);
            document.addEventListener('click', this.handleOutsideClick, false);
        } else {
            console.log(this.state.opacity);
            document.removeEventListener('click', this.handleOutsideClick, false);
        }


        $('.tabs-scroll').scroll(function () {
            $(".left-fixed-tab").scrollTop($(".tabs-scroll").scrollTop());
            $(".tabs-scroll").scrollTop($(".tabs-scroll").scrollTop());
            $(".fixed-tab").scrollLeft($(".tabs-scroll").scrollLeft());

        });

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



        $('.tabs-scroll .tab-content-list > div').mousedown(function (clickPos) {
                if(!$(this).hasClass('reserve') && !$(this).hasClass('expired') && !$(clickPos.target).hasClass('a-client-info')) {
                    let xMousePos = $(".tabs-scroll").scrollLeft();
                    let yMousePos = $(".tabs-scroll").scrollTop();
                    let lastScrolledLeft = $(".tabs-scroll").scrollLeft();
                    let lastScrolledTop = $(".tabs-scroll").scrollTop();
                    let cursorX = clickPos.pageX;
                    let cursorY = clickPos.pageY;
                    notes = $('.notes', this);
                    note = ReactDOM.findDOMNode(this)
                    notes.css({'visibility': 'none'})
                    $('.msg-client-info').css({'visibility': 'hidden'})


                    $('div').removeClass('pressedTime');
                    $(this).addClass('pressedTime');

                    $(window).mousemove(function (pos) {
                        xMousePos = parseInt($(".tabs-scroll").scrollLeft()) - parseInt(lastScrolledLeft);
                        yMousePos = parseInt($(".tabs-scroll").scrollTop()) - parseInt(lastScrolledTop);

                        cursorX = pos.pageX;
                        cursorY = pos.pageY;

                        notes.css('left', (xMousePos + pos.pageX - clickPos.pageX + 20) + 'px').css('top', (yMousePos + pos.pageY - clickPos.pageY + 20) + 'px');
                        $('.calendar-list .tabs-scroll .tab-content-list div').css({'cursor': 'grabbing'});
                        $('textarea').css({'cursor': 'grabbing'});
                    });

                    $(".tabs-scroll").scroll(function (event) {
                        xMousePos = parseInt($(".tabs-scroll").scrollLeft()) - parseInt(lastScrolledLeft);
                        yMousePos = parseInt($(".tabs-scroll").scrollTop()) - parseInt(lastScrolledTop);

                        notes.css('left', (xMousePos + cursorX - clickPos.pageX + 20) + 'px').css('top', (yMousePos + cursorY - clickPos.pageY + 20) + 'px');
                        $('.calendar-list .tabs-scroll .tab-content-list div').css({'cursor': 'grabbing'});
                        $('textarea').css({'cursor': 'grabbing'});

                    });
                }


        }).mouseup(function () {
            $(window).off("mousemove");
            $(".tabs-scroll").off("scroll");
            if (notes.length > 0) {
                if ($('.notes', this).length > 0) {
                    $(notes).css({left: 0, top: 0});
                    $('.calendar-list .tabs-scroll .tab-content-list div').css({'cursor': 'cell'});
                    $('div').removeClass('pressedTime');
                    $('div.col-tab').off('mouseenter');
                } else {

                    if((parseInt(moment.duration(parseInt($(this).attr('timeEnd'))-parseInt($(this).attr('time')), 'milliseconds').format("m"))*60>=parseInt(notes.attr('id').split('_')[2])
                        && !$(this).hasClass('expired') && $(this).hasClass('col-tab'))
                        || (parseInt(notes.attr('id').split('_')[3])<=parseInt($(this).attr('time')) &&
                            parseInt($(this).attr('time'))<=parseInt(notes.attr('id').split('_')[4]) && $(this).hasClass('col-tab'))
                        || (parseInt(notes.attr('id').split('_')[3])>=parseInt($(this).attr('timeEnd')) &&
                            parseInt($(this).attr('timeEnd'))<=parseInt(notes.attr('id').split('_')[4]) && !$(this).hasClass('expired') && $(this).hasClass('col-tab'))
                    ){

                        $('.calendar-list .tabs-scroll .tab-content-list div').css({'cursor': 'cell'});
                        $('div').removeClass('pressedTime');
                        $('div.col-tab').off('mouseenter');

                        calendar.appointments && calendar.appointments.map((appointmentStaff, key1) =>
                            appointmentStaff.appointments &&
                            appointmentStaff.staff.staffId === parseInt(notes.attr('id').split('_')[1]) &&
                            appointmentStaff.appointments.filter((appointment, key2)=> {

                                if(appointment.appointmentId===
                                    parseInt(notes.attr('id').split('_')[0])){
                                    let appointmentNew={...appointment, appointmentTimeMillis: parseInt($(this).attr('time')), staffId:parseInt($(this).attr('staff'))};
                                    if(parseInt($(this).attr('staff'))!==parseInt(notes.attr('id').split('_')[1])){
                                        delete app[key1]['appointments'][key2];
                                        app.filter((a, key)=>a.staff.staffId===parseInt($(this).attr('staff')) && app[key]['appointments'].push(appointmentNew))
                                    }else{app[key1]['appointments'][key2] = appointmentNew}


                                    _state.setState({
                                        ..._state.state,
                                        calendar:{
                                            ..._state.state.calendar,
                                            appointments: app

                                        }

                                    })

                                    if(type==='day'){
                                        dispatch(calendarActions.editAppointmentTime(JSON.stringify(appointmentNew), selectedDayMoment.startOf('day').format('x'), selectedDayMoment.endOf('day').format('x')))
                                    }else {
                                        dispatch(calendarActions.editAppointmentTime(JSON.stringify(appointmentNew), moment(selectedDays[0]).startOf('day').format('x'), moment(selectedDays[6]).endOf('day').format('x')))
                                    }
                                }
                            }));

                    }else {
                        $(notes).css({left: 0, top: 0});
                        $('div').removeClass('pressedTime');
                        $('div.col-tab').off('mouseenter');
                    }
                }
                $('.notes', this).css({left: 0, top: 0});
                $('.tabs-scroll').scroll(function () {
                    $(".left-fixed-tab").scrollTop($(".tabs-scroll").scrollTop());
                });
                setTimeout( () =>{
                    $('.msg-client-info').css({'visibility': 'visible'})
                }, 1000)

                $('.calendar-list .tabs-scroll .tab-content-list div').css({'cursor': 'cell'});
                $('.notes').css({'cursor': 'default'});
                $('.expired').css({'cursor': 'not-allowed'});
                $('textarea').css({'cursor': 'default'});
                $('.notes-title').css({'cursor': 'grabbing'});


            }

            pressed = false;
        });



        $('.tabs-scroll .tab-content-list > div').mousedown(function (clickPos) {
            start=$(this).attr('time')
            notes = $('.notes', this);
            $('.col-tab').on('mouseenter', function () {
                if (notes.length > 0) {
                } else {

                    $(this).addClass('pressedTime');
                }
            });

        }).mouseup(function () {
            if (notes.length > 0) {

            } else {
                if(start!==$(this).attr('time') && !$(this).hasClass('expired') && $(this).hasClass('col-tab')) {
                    $('.modal_calendar').modal('show');

                    _state.setState({
                        ..._state.state,
                        reservedTime: {
                            startTimeMillis: start,
                            endTimeMillis: $(this).attr('time'),
                        },
                        reservedStuffId: parseInt($(this).attr('staff'))
                    })
                    $('div.col-tab').off('mouseenter');

                    $('div').removeClass('pressedTime');

                }else {
                    $('div.col-tab').off('mouseenter');
                    $('div').removeClass('pressedTime');
                }
            }
            $('.calendar-list .tabs-scroll .tab-content-list div').css({'cursor': 'cell'});
            $('.notes').css({'cursor': 'default'});
            $('.expired').css({'cursor': 'not-allowed'});
            $('textarea').css({'cursor': 'default'});

        });
    }

    scrollToMyRef () {
        const listItemHeight =  parseInt($(".left-fixed-tab div:first-child").height())/92*(((parseInt(moment().format('H'))-2))*4);

        $(".tabs-scroll").scrollTop(listItemHeight);
        $(".left-fixed-tab").scrollTop(listItemHeight);


        if(listItemHeight!==0) {
            this.setState({
                ...this.state,
                scroll: false
            })
        }
    }

    scrollTop () {
        const listItemHeight =  parseInt($(".left-fixed-tab div:first-child").height())/64*(((parseInt(moment().format('H')))-7)*4);

        $(".tabs-scroll").scrollTop();
        $(".left-fixed-tab").scrollTop();
    }

    componentWillReceiveProps(newProps) {
        if (JSON.stringify(this.props) !== JSON.stringify(newProps)) {
            this.setState({
                ...this.state,
                calendar: newProps.calendar,
                clients: newProps.client,
                services: newProps.services
            });
        }


        if (JSON.stringify(this.props.staff) !== JSON.stringify(newProps.staff)) {
            if(this.state.typeSelected===3 || this.state.typeSelected===2 || this.state.type==='week') {
                this.setState({
                    ...this.state,
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

        const {approvedId, staffAll, clients, calendar, workingStaff, appointmentEdited,
            services, clickedTime, hoverRange, numbers, minutes, minutesReservedtime, staffClicked, editClient, client_working,
            selectedDay, type, selectedDays, opacity, edit_appointment, infoClient, typeSelected, selectedStaff, reservedTimeEdited, pressedDragAndDrop, reservedTime, reservedStuffId, reserveId, reserveStId, selectedDayMoment} = this.state;

        console.log(selectedDays)

        const daysAreSelected = selectedDays && selectedDays.length > 0;

        const modifiers = {
            hoverRange,
            selectedRange: daysAreSelected && {
                from: selectedDays[0],
                to: selectedDays[6],
            },
            hoverRangeStart: hoverRange && hoverRange.from,
            hoverRangeEnd: hoverRange && hoverRange.to,
            selectedRangeStart: daysAreSelected && selectedDays[0],
            selectedRangeEnd: daysAreSelected && selectedDays[6],
        };


        let clDates = staffAll.closedDates && staffAll.closedDates.some((st) =>
            parseInt(moment(st.startDateMillis, 'x').startOf('day').format("x")) <= parseInt(moment(selectedDays[0]).startOf('day').format("x")) &&
            parseInt(moment(st.endDateMillis, 'x').endOf('day').format("x")) >= parseInt(moment(selectedDays[0]).endOf('day').format("x")))


        return (
            <div className="calendar" ref={node => { this.node = node; }}>
                {this.state.isLoading ? <div className="zIndex"><Pace color="rgb(42, 81, 132)" height="3"  /></div> : null}

                <div className={"container_wrapper "+(localStorage.getItem('collapse')=='true'&&' content-collapse')}>

                    <div className={"content-wrapper  full-container "+(localStorage.getItem('collapse')=='true'&&' content-collapse')}>
                        <div className="container-fluid">
                            <HeaderMain/>

                            <div className="row content calendar-container">
                                <div className="staff_choise col-3">
                                    {access(2) &&
                                    <div className="bth dropdown-toggle dropdown rounded-button select-menu" role="menu"
                                         data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        {typeSelected && selectedStaff.length!==0 && typeSelected===3 &&
                                            <span className="img-container">
                                            <img className="rounded-circle"
                                                 src={JSON.parse(selectedStaff).imageBase64 ? "data:image/png;base64," + JSON.parse(selectedStaff).imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                                 alt=""/>
                                        </span>}
                                        {typeSelected && typeSelected===1 && < p> Работающие сотрудники </p>}
                                        {typeSelected && selectedStaff.length!==0 && typeSelected===3 && < p>{JSON.parse(selectedStaff).firstName + " " + JSON.parse(selectedStaff).lastName} </p>}
                                            {typeSelected && typeSelected===2 && < p> Все сотрудники </p>}

                                    </div>
                                    }
                                    {!access(2) && selectedStaff && selectedStaff.length!=0 &&
                                    <div className="bth rounded-button select-menu" >
                                            <span className="img-container">
                                            <img className="rounded-circle"
                                                 src={JSON.parse(selectedStaff).imageBase64 ? "data:image/png;base64," + JSON.parse(selectedStaff).imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                                 alt=""/>

                                        </span>
                                        <p> {JSON.parse(selectedStaff).firstName + " " + JSON.parse(selectedStaff).lastName} </p>
                                    </div>
                                    }
                                    {access(2) &&
                                    <ul className="dropdown-menu">

                                        <li>
                                            <a onClick={() => this.setWorkingStaff(staffAll.availableTimetable, 2)}><p>Все сотрудники</p></a>
                                        </li>

                                        <li>
                                            < a onClick={() => this.setWorkingStaff(staffAll.availableTimetable, 1)}>
                                                <p>Работающие сотрудники</p></a>
                                        </li>


                                        {staffAll.availableTimetable && staffAll.availableTimetable.sort((a, b) => a.firstName.localeCompare(b.firstName)).map((staffEl) =>
                                                <li>
                                                    <a onClick={() => this.setWorkingStaff([staffEl], 3)}>
                                        <span className="img-container">
                                            <img className="rounded-circle"
                                                 src={staffEl.imageBase64 ? "data:image/png;base64," + staffEl.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                                 alt=""/>
                                        </span>
                                                        <p>{staffEl.firstName + " " + staffEl.lastName}</p>
                                                    </a>
                                                </li>
                                        )}
                                    </ul>
                                    }
                                </div>
                                <div className="calendar col-6">
                                    <div className="select-date">


                                        {type==='day'?<div className="select-inner">
                                                <span className="arrow-left" onClick={()=>this.handleDayClick(moment(selectedDay).subtract(1, 'day'), {})}/>
                                                <div className="button-calendar" >

                                                        <span
                                                            className="dates-full-width date-num" style={{textTransform: 'capitalize'}}  onClick={()=>this.showCalendar(true)}>{moment(selectedDay).format('dd, DD MMMM ')} {clDates ?
                                                            <span style={{color: 'red', textTransform: 'none', marginLeft: '5px'}}> (выходной)</span> : ''}</span>
                                                    <div className={(!opacity && 'visibility ')+" SelectedWeekExample"}>
                                                        <i className="datepicker--pointer"></i>
                                                        <DayPicker
                                                            showOutsideDays
                                                            selectedDays={selectedDay}
                                                            onDayClick={this.handleDayClick}
                                                            localeUtils={MomentLocaleUtils}
                                                            locale={'ru'}
                                                        />
                                                    </div>
                                                </div>
                                                <span className="arrow-right" onClick={()=>this.handleDayClick(moment(selectedDay).add(1, 'day'), {})}/>
                                            </div>
                                            :<div className="select-inner">
                                                <span className="arrow-left" onClick={this.showPrevWeek}/>

                                                <div className="button-calendar" >

                                                    <span
                                                        className="dates-full-width text-capitalize date-num"  onClick={()=>this.showCalendar(true)}>{moment(selectedDays[0]).startOf('day').format('DD.MM.YYYY') +' - '+ moment(selectedDays[6]).endOf('day').format('DD.MM.YYYY')}</span>
                                                    <div className={(!opacity && 'visibility ')+" SelectedWeekExample"}>
                                                        <i className="datepicker--pointer"></i>
                                                        <DayPicker
                                                            selectedDays={selectedDays}
                                                            showOutsideDays
                                                            modifiers={modifiers}
                                                            onDayClick={this.handleDayChange}
                                                            onDayMouseEnter={this.handleDayEnter}
                                                            onDayMouseLeave={this.handleDayLeave}
                                                            onWeekClick={this.handleWeekClick}
                                                            localeUtils={MomentLocaleUtils}
                                                            locale={'ru'}
                                                        />
                                                    </div>
                                                </div>
                                                <span className="arrow-right" onClick={this.showNextWeek}/>
                                            </div>}
                                    </div>
                                </div>
                                <div className="tab-day-week tab-content col-3">
                                    <ul className="nav nav-tabs">
                                        <li className="nav-item no-bg">
                                            <a className={type==='day'&&' active show '+"nav-link"} onClick={()=>this.selectType('day')} data-toggle="tab">День</a>
                                        </li>
                                        <li className="nav-item no-bg">
                                            <a className={type==='week'&&' active show '+"nav-link"} onClick={()=>this.selectType('week')}>Неделя</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="days-container">
                                <div className="tab-pane active" id={selectedDays.length===1 ? "days_20" : "weeks"}>
                                    <div className="calendar-list">
                                        {selectedDays.length === 1 && <div className="fixed-tab"  style={{'minWidth': (120*parseInt(workingStaff.timetable && workingStaff.timetable.length))+'px'}}>
                                            <div className="tab-content-list">
                                                <div className="hours"><span></span></div>

                                                {workingStaff.availableTimetable && workingStaff.availableTimetable.sort((a, b) => a.firstName.localeCompare(b.firstName)).map((workingStaffElement) => {

                                                        let clDate = staffAll.closedDates && staffAll.closedDates.some((st) =>
                                                            parseInt(st.startDateMillis) <= parseInt(moment(selectedDays[0]).format("x")) &&
                                                            parseInt(st.endDateMillis) >= parseInt(moment(selectedDays[0]).format("x")))

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

                                        }
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

                                                        console.log('clDate');
                                                        console.log(staffAll.closedDates);
                                                        console.log(day);
                                                        console.log(moment(day).startOf('day').format("x"));
                                                        console.log(moment(day).endOf('day').format("x"));

                                                            return (appointment && appointment[0] && appointment[0].length > 0 ? <div
                                                                        className={currentTime<=moment().format("x")
                                                                        && currentTime>=moment().subtract(15, "minutes").format("x") ? 'present-time ':''}
                                                                    >
                                                                        <div className={"notes "+ appointment[0][0].color.toLowerCase()+"-color "+(parseInt(moment(currentTime).format("H"))>=20 && 'notes-bottom')}
                                                                             key={appointment[0][0].appointmentId+"_"+key}
                                                                             id={appointment[0][0].appointmentId+"_"+workingStaffElement.staffId+"_"+appointment[0][0].duration+"_"+appointment[0][0].appointmentTimeMillis+"_"+moment(appointment[0][0].appointmentTimeMillis, 'x').add(appointment[0][0].duration, 'seconds').format('x')}
                                                                             >
                                                                            <p className="notes-title">
                                                                                {!appointment[0][0].online &&
                                                                                <span className="pen"
                                                                                      title="Запись через журнал" />}
                                                                                {/*<span className="men"*/}
                                                                                      {/*title="Постоянный клиент"/>*/}
                                                                                {appointment[0][0].online &&
                                                                                <span className="globus"
                                                                                      title="Онлайн-запись" />}
                                                                                {appointment[0][0].approved &&
                                                                                <span className="submitted"
                                                                                      title="Встреча подтверждена"/>
                                                                                }

                                                                                {!appointment[0][0].approved && <span className="submit"
                                                                                          data-toggle="modal"
                                                                                          data-target=".save-notes-modal"
                                                                                          title="Подтвердить встречу" onClick={()=>this.approveAppointmentSetter(appointment[0][0].appointmentId)}/>}
                                                                               <span className="delete"
                                                                                      data-toggle="modal"
                                                                                      data-target=".delete-notes-modal"
                                                                                      title="Отменить встречу"  onClick={() => this.approveAppointmentSetter(appointment[0][0].appointmentId)}/>


                                                                                <span className="service_time">{moment(appointment[0][0].appointmentTimeMillis, 'x').format('HH:mm')} -
                                                                                    {moment(appointment[0][0].appointmentTimeMillis, 'x').add(appointment[0][0].duration, 'seconds').format('HH:mm')}</span>
                                                                            </p>
                                                                            <p className="notes-container" style={{height: ((appointment[0][0].duration/60 / 15)-1) * 20 + "px"}}>
                                                                                <textarea>{appointment[0][0].serviceName}</textarea>

                                                                            </p>
                                                                            <div className="msg-client-info">
                                                                                {   clients && clients.client && clients.client.map((client)=>client.clientId===appointment[0][0].clientId &&
                                                                                    <div className="msg-inner">
                                                                                        <p className="new-text">Запись</p>
                                                                                        <p className="client-name-book">Клиент</p>
                                                                                        <p className="name">{client.firstName} {client.lastName}</p>
                                                                                        <p>{client.phone}</p>

                                                                                        <p className="client-name-book">Услуга</p>
                                                                                        <p>{appointment[0][0].serviceName}</p>
                                                                                        <p>{moment(appointment[0][0].appointmentTimeMillis, 'x').format('HH:mm')} -
                                                                                            {moment(appointment[0][0].appointmentTimeMillis, 'x').add(appointment[0][0].duration, 'seconds').format('HH:mm')}</p>
                                                                                        <p>{workingStaffElement.firstName} {workingStaffElement.lastName}</p>

                                                                                        <a
                                                                                           className="a-client-info"
                                                                                           data-target=".client-detail"
                                                                                           title="Просмотреть клиента" onClick={(e)=>{
                                                                                               $('.client-detail').modal('show')
                                                                                               this.setState({...this.state, infoClient: client});


                                                                                        }}>Просмотреть
                                                                                            клиента</a>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    :

                                                                    reservedTime && reservedTime[0] && reservedTime[0].length > 0 ?
                                                                    <div className='reserve'>
                                                                        <div className="notes color-grey"
                                                                             style={{backgroundColor:"darkgrey"}}>

                                                                            <p className="notes-title" style={{cursor: 'default'}}>
                                                                                <span className=""
                                                                                      title="Онлайн-запись" />
                                                                                <span
                                                                                className="service_time"
                                                                               >{moment(reservedTime[0][0].startTimeMillis, 'x').format('HH:mm')}
                                                                                -
                                                                                {moment(reservedTime[0][0].endTimeMillis, 'x').format('HH:mm')}</span>

                                                                            </p>
                                                                            <p className="notes-container" style={{height: (parseInt(((moment.utc(reservedTime[0][0].endTimeMillis - reservedTime[0][0].startTimeMillis, 'x').format('x')/60000/15)-1)*20)) + "px"}}>
                                                                                <textarea style={{color: '#5d5d5d'}}>{reservedTime[0][0].description}</textarea>
                                                                                <span className="delete-notes"
                                                                                      style={{right: '5px'}}
                                                                                      data-toggle="modal"
                                                                                      data-target=".delete-reserve-modal"
                                                                                      title="Удалить"  onClick={() => this.setState({...this.state, reserveId: reservedTime[0][0].reservedTimeId, reserveStId: workingStaffElement.staffId})}
                                                                                />
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                : <div
                                                                        id={currentTime<=moment().format("x") && currentTime>=moment().subtract(15, "minutes").format("x") ? 'present-time ':''}
                                                                        className={`col-tab ${currentTime<=moment().format("x")
                                                                            && currentTime>=moment().subtract(15, "minutes").format("x") ? 'present-time ':''}
                                                                            ${currentTime<parseInt(moment().format("x"))?'':""}
                                                                            ${notExpired?'':"expired"}
                                                                            ${clDate?'closedDateTick':""}`}
                                                                        data-toggle={notExpired?"modal":''}
                                                                        data-target=".new_appointment"
                                                                        time={currentTime}
                                                                        timeEnd={workingTimeEnd}
                                                                        staff={workingStaffElement.staffId}
                                                                        onClick={()=>notExpired && this.changeTime(currentTime, workingStaffElement, numbers, false, null)}
                                                                    ><span className="fade-time">{moment(time, 'x').format("HH:mm")}</span></div>
                                                            )


                                                        })
                                                    )
                                                    }

                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            </div>
                            {type==='day' && workingStaff.availableTimetable && workingStaff.availableTimetable[0] &&
                            <a className="add" href="#"/>}
                            <div className="hide buttons-container">
                                <div className="p-4">
                                    <button type="button" data-toggle="modal" data-target=".new_appointment"
                                            onClick={()=>this.changeTime(selectedDayMoment.startOf('day').format('x'), workingStaff.availableTimetable[0], numbers)}
                                            className="button">Новая запись
                                    </button>
                                    <button type="button" data-toggle="modal" data-target=".modal_calendar"
                                            onClick={()=>this.changeReservedTime(selectedDayMoment.startOf('day').format('x'), workingStaff.availableTimetable[0], null)}
                                            className="button">Зарезервированное время
                                    </button>
                                </div>
                                <div className="arrow"/>
                            </div>
                        </div>
                    </div>
                </div>
                <AddAppointment
                    clients={clients}
                    staffs={staffAll}
                    addAppointment={this.newAppointment}
                    editAppointment={this.editAppointment}
                    appointments={calendar && calendar}
                    handleEditClient={this.handleEditClient}
                    services={services}
                    clickedTime={clickedTime}
                    minutes={minutes}
                    staffId={staffClicked}
                    appointmentEdited={appointmentEdited}
                    getHours={this.changeTime}
                    edit_appointment={edit_appointment}
                />
                <ReservedTime
                    staffs={staffAll}
                    minutesReservedtime={minutesReservedtime}
                    getHours={this.changeReservedTime}
                    newReservedTime={this.newReservedTime}
                    reservedTimeEdited={reservedTimeEdited}
                    reservedTime={reservedTime}
                    clickedTime={clickedTime}
                    reservedStuffId={reservedStuffId}
                />
                <NewClient
                    client_working={client_working}
                    edit={editClient}
                    updateClient={this.updateClient}
                    addClient={this.addClient}
                />
                <ClientDetails
                    client={infoClient}
                    editClient={this.handleEditClient}
                />
                <UserSettings
                    keys={{int:Math.random()}}
                />
                <UserPhoto/>
                <ApproveAppointment
                    id={approvedId}
                    approve={this.approveAppointment}
                />
                <DeleteAppointment
                    id={approvedId}
                    cancel={this.deleteAppointment}
                />
                <DeleteReserve
                    id={reserveId}
                    staffId={reserveStId}
                    cancel={this.deleteReserve}
                />
            </div>
        );
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

        this.setState({...this.state, approvedId:id})
    }

    approveAppointment(id){
        const {dispatch} = this.props;

        dispatch(calendarActions.approveAppointment(id));
        dispatch(companyActions.getNewAppointments());
    }

    deleteAppointment(id){
        const {dispatch} = this.props;

        const {selectedDays, type, selectedDayMoment} = this.state;

        if(type==='day'){
            dispatch(calendarActions.deleteAppointment(id, selectedDayMoment.startOf('day').format('x'), selectedDayMoment.endOf('day').format('x')));
        }else {
            dispatch(calendarActions.deleteAppointment(id, moment(selectedDays[0]).startOf('day').format('x'), moment(selectedDays[6]).endOf('day').format('x')));
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
        this.setState({...this.state, clickedTime: time, minutesReservedtime:[], minutes: this.getHours(staffId, time, appointment), staffClicked:staffId, edit_appointment: edit_appointment, appointmentEdited: appointment});
    }

    changeReservedTime(minutesReservedtime, staffId, newTime=null){
        const {selectedDays, type, selectedDayMoment} = this.state;

        if(newTime===null) {
            this.setState({...this.state, clickedTime: minutesReservedtime});

        }

        return this.getHours(staffId, selectedDayMoment.format('x'));
    }

    handleDayChange (date) {
        const {selectedStaff} = this.state;
        this.showCalendar(false);

        this.showCalendar(false);
        let weeks = getWeekDays(getWeekRange(date).from)
        this.setState({
            ...this.state,
            selectedDays: weeks,
            timetableFrom: moment(weeks[0]).startOf('day').format('x'),
            timetableTo:moment(weeks[6]).endOf('day').format('x'),
            opacity: false
        });
        this.props.dispatch(staffActions.getTimetableStaffs(moment(weeks[0]).startOf('day').format('x'), moment(weeks[6]).endOf('day').format('x')));
        this.props.dispatch(calendarActions.getAppointments(moment(weeks[0]).startOf('day').format('x'), moment(weeks[6]).endOf('day').format('x')));
        this.props.dispatch(calendarActions.getReservedTime(moment(weeks[0]).startOf('day').format('x'), moment(weeks[6]).endOf('day').format('x')));
        history.pushState(null, '', '/calendar/staff/'+JSON.parse(selectedStaff).staffId+'/'+moment(weeks[0]).format('DD-MM-YYYY')+"/"+moment(weeks[6]).format('DD-MM-YYYY'))

    };

    handleDayEnter (date) {
        this.setState({
            ...this.state,
            hoverRange: getWeekRange(date),
        });
    };

    handleDayLeave () {
        this.setState({
            ...this.state,
            hoverRange: undefined,
        });
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
        this.showCalendar(false);
        let weeks = getWeekDays(getWeekRange(moment(selectedDays[0]).subtract(7, 'days')).from);

        this.props.dispatch(staffActions.getTimetableStaffs(moment(weeks[0]).startOf('day').format('x'), moment(weeks[6]).endOf('day').format('x')));
        this.props.dispatch(calendarActions.getAppointments(moment(weeks[0]).startOf('day').format('x'), moment(weeks[6]).endOf('day').format('x')));
        this.props.dispatch(calendarActions.getReservedTime(moment(weeks[0]).startOf('day').format('x'), moment(weeks[6]).endOf('day').format('x')));
        this.setState({
            selectedDays: weeks,
            timetableFrom: moment(weeks[0]).startOf('day').format('x'),
            timetableTo:moment(weeks[6]).endOf('day').format('x'),
            workingStaff: {...workingStaff, availableTimetable:[workingStaff.availableTimetable[0]]}, type: 'week',
            scroll: true, opacity: false
        });

        history.pushState(null, '', '/calendar/staff/'+JSON.parse(selectedStaff).staffId+'/'+moment(weeks[0]).format('DD-MM-YYYY')+"/"+moment(weeks[6]).format('DD-MM-YYYY'))

    }

    showNextWeek (){
        const {selectedDays, workingStaff, selectedStaff} = this.state;
        this.showCalendar(false);
        let weeks = getWeekDays(getWeekRange(moment(selectedDays[0]).add(7, 'days')).from);

        this.props.dispatch(staffActions.getTimetableStaffs(moment(weeks[0]).startOf('day').format('x'), moment(weeks[6]).endOf('day').format('x')));
        this.props.dispatch(calendarActions.getAppointments(moment(weeks[0]).startOf('day').format('x'), moment(weeks[6]).endOf('day').format('x')));
        this.props.dispatch(calendarActions.getReservedTime(moment(weeks[0]).startOf('day').format('x'), moment(weeks[6]).endOf('day').format('x')));
        this.setState({
            selectedDays: weeks,
            timetableFrom: moment(weeks[0]).startOf('day').format('x'),
            timetableTo:moment(weeks[6]).endOf('day').format('x'),
            workingStaff: {...workingStaff, availableTimetable:[workingStaff.availableTimetable[0]]}, type: 'week',
            scroll: true, opacity: false
        });
        history.pushState(null, '', '/calendar/staff/'+JSON.parse(selectedStaff).staffId+'/'+moment(weeks[0]).format('DD-MM-YYYY')+"/"+moment(weeks[6]).format('DD-MM-YYYY'))

    }

    handleDayClick(day, { selected }) {
        const {typeSelected, staffAll, workingStaff, selectedStaff} = this.state;
        let daySelected=selected ? moment() : moment(day)
        this.showCalendar(false);

        this.props.dispatch(staffActions.getTimetableStaffs(daySelected.startOf('day').format('x'), daySelected.endOf('day').format('x')));
        this.props.dispatch(calendarActions.getAppointments(daySelected.startOf('day').format('x'), daySelected.endOf('day').format('x')));
        this.props.dispatch(calendarActions.getReservedTime(daySelected.startOf('day').format('x'), daySelected.endOf('day').format('x')));

        this.getHours24();

        this.setState({
            ...this.state,
            selectedDay: daySelected.utc().startOf('day').toDate(),
            selectedDayMoment: daySelected,
            selectedDays: [getDayRange(moment(daySelected).format()).from],
            opacity: false
        })

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

    showCalendar(opacity) {

        this.setState({...this.state,
            opacity: opacity
        });
    }

    handleOutsideClick(e) {
        this.showCalendar(false);
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

            this.setState({...this.state, workingStaff: {...workingStaff, availableTimetable:[]}, type: 'day', typeSelected: typeSelected, selectedDay: moment().utc().startOf('day').toDate(), selectedDays: [getDayRange(moment().format()).from]});
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
                    ...this.state,
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
                    ...this.state,
                    workingStaff: {...workingStaff, availableTimetable: staffEl},
                    typeSelected: typeSelected,
                    type: 'day'
                });

                history.pushState(null, '', '/calendar/allstaff/0/'+moment(selectedDay).format('DD-MM-YYYY'));


            } else {
                let staff=selectedStaff?JSON.stringify(staffEl[0]):JSON.stringify(staffEl.filter((staff)=>staff.staffId===JSON.parse(selectedStaff).staffId));



                this.setState({
                    ...this.state,
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

    handleEditClient(id) {
        const { clients } = this.state;

        if(id!=null) {
            const client_working = clients.client.find((item) => {return id === item.clientId});

            this.setState({...this.state, editClient: true, client_working: client_working});
        } else {
            this.setState({...this.state, editClient: false, client_working: {}});
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
    const {staff, client, timetable, calendar, services, authentication} = store;

    return {
        staff, client, timetable, calendar, services, authentication
    };
}


const connectedMainIndexPage = connect(mapStateToProps)(CalendarPage);
export {connectedMainIndexPage as CalendarPage};