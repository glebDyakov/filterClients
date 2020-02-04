import React, {PureComponent} from 'react';
import {connect} from 'react-redux';

import {calendarActions, staffActions, clientActions, servicesActions, companyActions} from '../_actions';

import '../../public/scss/calendar.scss'

import moment from 'moment';
import 'moment/locale/ru';

import {DatePicker} from "../_components/DatePicker";

import 'react-day-picker/lib/style.css';
import '../../public/css_admin/date.css'
import {access} from '../_helpers/access';
import {getWeekRange} from '../_helpers/time'
import {CalendarModals} from '../_components/modals/CalendarModals';

import TabScrollContent from './components/TabScrollContent';
import StaffChoice from './components/StaffChoice';
import TabScrollHeader from './components/TabScrollHeader';
import CalendarSwitch from "./components/CalendarSwitch";


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

function getDayRange(date) {
    return {
        from: moment(date).utc().locale('ru')
            .toDate(),
        to: moment(date).utc().locale('ru')
            .endOf('day')
            .toDate(),
    };
}

class Index extends PureComponent {
    constructor(props) {
        super(props);

        let staffFromUrl, param1, dateFrom, dateFr, dateTo, dateToType;

        dateFrom=props.match.params.dateFrom ?
            moment(props.match.params.dateFrom, 'DD-MM-YYYY').utc().toDate() :
            moment().startOf('day').utc().toDate()

        dateFr=props.match.params.dateFrom ?
            moment(props.match.params.dateFrom, 'DD-MM-YYYY') :
            moment();


        dateTo=props.match.params.dateTo ? getWeekDays(getWeekRange(dateFr).from) :
            [getDayRange(dateFr).from]
        if(!access(2)) {
            staffFromUrl = 2;
            param1 = 3;

            dateToType = 'day'


        }else {
            param1=props.match.params.selectedType ?
                props.match.params.selectedType==='workingstaff' ? 1 :(props.match.params.selectedType==='allstaff'
                    ? 2
                    :3 )
                : 1;



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
            reserved: false,
            appointmentModal: false,
            newClientModal: false,
            scrollableAppointmentAction: true,
            appointmentMarkerActionCalled: false,
            flagStaffId: true,
            appointmentSocketMessage: {},
            appointmentSocketMessageFlag: false
        };

        this.newAppointment = this.newAppointment.bind(this);
        this.refreshTable = this.refreshTable.bind(this);
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
        this.editAppointment = this.editAppointment.bind(this);
        this.changeReservedTime = this.changeReservedTime.bind(this);
        this.newReservedTime = this.newReservedTime.bind(this);
        this.deleteAppointment = this.deleteAppointment.bind(this);
        this.deleteReserve = this.deleteReserve.bind(this);
        this.approveAppointmentSetter = this.approveAppointmentSetter.bind(this);
        this.updateCalendar = this.updateCalendar.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onCloseClient = this.onCloseClient.bind(this);
        this.animateActiveAppointment = this.animateActiveAppointment.bind(this);
        this.navigateToRedLine = this.navigateToRedLine.bind(this);
        this.handleUpdateClient = this.handleUpdateClient.bind(this);
        this.updateReservedId = this.updateReservedId.bind(this);
        this.closeAppointmentFromSocket = this.closeAppointmentFromSocket.bind(this);
        this.checkAvaibleTime = this.checkAvaibleTime.bind(this);
        this.queryInitData = this.queryInitData.bind(this);
    }

    componentDidMount() {
        if (this.props.match.params.selectedType && this.props.match.params.selectedType !== 'workingstaff' && this.props.match.params.selectedType !== 'staff' && this.props.match.params.selectedType !== 'allstaff' && !this.props.match.params.dateFrom) {
            this.props.history.push('/nopage');
            return false;
        }

        if (this.props.authentication.loginChecked) {
            this.queryInitData()
        }

        document.title = "Журнал записи | Онлайн-запись";
        initializeJs();
    }

    queryInitData() {
        const {selectedDays, type, selectedDayMoment} = this.state;

        this.props.dispatch(staffActions.get());
        //this.props.dispatch(clientActions.getClientWithInfo());
        this.props.dispatch(servicesActions.getServices());
        this.props.dispatch(staffActions.getClosedDates());

        let startTime, endTime;
        if (type === 'day') {
            startTime = selectedDayMoment.startOf('day').format('x');
            endTime = selectedDayMoment.endOf('day').format('x');
        } else {
            startTime = moment(selectedDays[0]).startOf('day').format('x');
            endTime = moment(selectedDays[6]).endOf('day').format('x');
        }
        this.refreshTable(startTime, endTime);

        const { search } = this.props.location
        if (search.includes('appointmentId')) {
            this.props.dispatch(calendarActions.setScrollableAppointment(search.split('=')[1]))
        }

        this.scrollToMyRef();


        setTimeout(() => {
            const {selectedDay} = this.state;
            if (!this.props.calendar.scrollableAppointmentId && (moment(selectedDay).format('DD-MM-YYYY')=== moment().format('DD-MM-YYYY'))) {
                this.navigateToRedLine();
            }
        }, 500);
    }


    // handleSocketDispatch(payload){
    //     // this.setState({appointmentSocketMessage: payload, appointmentSocketMessageFlag: true});
    //     // this.props.dispatch(companyActions.getAppointmentsCountMarkerIncrement());
    //     if (payload.wsMessageType === 'APPOINTMENT_CREATED'){
    //         this.props.dispatch(calendarActions.getAppointmentsNewSocket(payload));
    //     }
    //
    //     // this.updateCalendar();
    //     // $('.appointment-socket-modal').modal('show')
    //
    //     const {selectedDayMoment, selectedDays, type}=this.state;
    //     let startTime, endTime;
    //
    //     if(type==='day'){
    //         startTime = selectedDayMoment.startOf('day').format('x');
    //         endTime = selectedDayMoment.endOf('day').format('x')
    //     } else {
    //         startTime = moment(selectedDays[0]).startOf('day').format('x');
    //         endTime = moment(selectedDays[6]).endOf('day').format('x');
    //     }
    //     this.props.dispatch(staffActions.getTimetableStaffs(startTime, endTime));
    //     // this.props.dispatch(calendarActions.getAppointments(startTime, endTime));
    //
    // }
    //
    // openSocketAgain(id){
    //     socket = createSocket(id);
    //     console.log("Сокет. Создан");
    //     socket.onopen = function() {
    //         console.log("Сокет2. cоединение установлено");
    //
    //         socket.send('ping');
    //
    //     };
    //
    //
    //     socket.onclose = function(event) {
    //         if (event.wasClean) {
    //             console.log('Сокет2.cоединение закрыто');
    //         } else {
    //             console.log('Сокет2.соединения как-то закрыто');
    //         }
    //         this.openSocketAgain(id);
    //     };
    //
    //     socket.onmessage = function(event) {
    //         if (event.data[0]==='{'){
    //             const finalData = JSON.parse(event.data);
    //             if ((finalData.wsMessageType === "APPOINTMENT_CREATED") || (finalData.wsMessageType === "APPOINTMENT_DELETED")){
    //                 this.handleSocketDispatch(finalData.payload);
    //             }
    //         }
    //         console.log(`Сокет.пришли данные: ${event.data}`);
    //
    //     };
    //     socket.onmessage = socket.onmessage.bind(this);
    //     socket.onclose = socket.onclose.bind(this);
    //
    //     socket.onerror = function(event) {
    //         console.error("Сокет2.ошибка", event);
    //     };
    //
    // }

    navigateToRedLine() {
        setTimeout(() => {
            const activeElem = document.getElementsByClassName("present-time")[0];
            if (activeElem) {
                activeElem.scrollIntoView();
            } else {
                this.navigateToRedLine()
            }
        }, 100);
    }

    refreshTable(startTime, endTime, updateReservedTime = true) {
        const { type } = this.state
        this.props.dispatch(staffActions.getTimetableStaffs(startTime, endTime));
        this.props.dispatch(calendarActions.getAppointments(startTime, endTime));
        if (updateReservedTime) {
            this.props.dispatch(staffActions.getTimetable(startTime, type === 'day' ? moment(endTime, 'x').add(1, 'week').startOf('day').format('x') : moment(endTime, 'x').startOf('day').format('x')));
            this.props.dispatch(calendarActions.getReservedTime(startTime, endTime));
        }
    }

    updateCalendar(updateReservedTime){
        const {selectedDayMoment, selectedDays, type}=this.state;
        let startTime, endTime;

        if(type==='day'){
            startTime = selectedDayMoment.startOf('day').format('x');
            endTime = selectedDayMoment.endOf('day').format('x')
        } else {
            startTime = moment(selectedDays[0]).startOf('day').format('x');
            endTime = moment(selectedDays[6]).endOf('day').format('x');
        }
        this.refreshTable(startTime, endTime, updateReservedTime);
        // setTimeout(()=>this.updateCalendar(), 300000)

    }

    componentDidUpdate(prevProps, prevState) {
        const { calendar } = this.props;
        const { scroll, appointmentMarkerActionCalled }=this.state;

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

        $('.notes').css({'cursor': 'default'});
        $('textarea').css({'cursor': 'default'});

        $('.add').click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            $('.buttons-container').fadeIn(400);
        });


        if (prevState.selectedDay !== this.state.selectedDay) {
            this.setState({ scrollableRedLine: true })
        }

        if (!appointmentMarkerActionCalled && calendar && calendar.scrollableAppointmentId) {
            const className = calendar.scrollableAppointmentId;
            this.animateActiveAppointment(className);
        }

    }

    scrollToMyRef () {
        const listItemHeight = parseInt($(".left-fixed-tab div:first-child").height())/92*(((parseInt(moment().format('H'))-2))*4);

        // $(".tabs-scroll").scrollTop(listItemHeight);
        // $(".left-fixed-tab").scrollTop(listItemHeight);


        if (listItemHeight) {
            this.setState({ scroll: false })
        }
    }

    animateActiveAppointment(className) {
        setTimeout(() => {
            const { scrollableAppointmentAction } = this.state;
            const activeElem = document.getElementsByClassName(className)[0];
            if (activeElem) {
                const updatedState = { appointmentMarkerActionCalled: true };
                const formattedClassName = `.${className}`;
                $(formattedClassName).addClass("custom-blick-div")
                if (scrollableAppointmentAction) {
                    activeElem.scrollIntoView();
                    updatedState.scrollableAppointmentAction = false
                }
                this.setState(updatedState)
                this.props.dispatch(calendarActions.setScrollableAppointment(null))
                setTimeout(() => { $(formattedClassName).removeClass('custom-blick-div') }, 10000);
            } else {
                this.animateActiveAppointment(className);
            }
        }, 500);
    }

    componentWillReceiveProps(newProps) {
        if (this.props.authentication.loginChecked !== newProps.authentication.loginChecked) {
            this.queryInitData()
        }

        if (JSON.stringify(this.props) !== JSON.stringify(newProps)) {
            this.setState({
                reserved: newProps.calendar.status && newProps.calendar.status===209 ? false : this.state.reserved,
                newClientModal: newProps.clients.status && newProps.clients.status===209 ? false : this.state.newClientModal
            });
        }
        // if (JSON.stringify(this.props.calendar.status) !== JSON.stringify(newProps.calendar.status)) {
        //     this.setState({ appointmentModal: newProps.calendar.status && newProps.calendar.status === 209 ? false : this.state.appointmentModal });
        // }

        const isLoading = newProps.staff.isLoading || newProps.staff.isLoadingTimetable || newProps.staff.isLoadingAvailableTime;
        if (JSON.stringify(this.props.staff) !== JSON.stringify(newProps.staff) && !isLoading) {
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

            if (this.state.typeSelected===1 && this.state.type!=='week' && newProps.staff.availableTimetable){
                this.setWorkingStaff(newProps.staff.availableTimetable, 1, newProps.staff)
            }
        }


        if (newProps.calendar.isAppointmentUpdated) {
            let startTime, endTime;
            if (this.state.type === 'day') {
                startTime = this.state.selectedDayMoment.startOf('day').format('x');
                endTime = this.state.selectedDayMoment.endOf('day').format('x');
            } else {
                startTime = moment(this.state.selectedDays[0]).startOf('day').format('x');
                endTime = moment(this.state.selectedDays[6]).endOf('day').format('x');
            }
            this.props.dispatch(calendarActions.updateAppointmentFinish())
            this.refreshTable(startTime, endTime, false);
        }

        if (newProps.calendar.refreshAvailableTimes && (this.props.calendar.refreshAvailableTimes !== newProps.calendar.refreshAvailableTimes)) {
            this.updateCalendar(false)
            this.props.dispatch(calendarActions.toggleRefreshAvailableTimes(false))
        }


        // if (newProps.authentication.user.profile.staffId && this.state.flagStaffId){
        //     this.setState({flagStaffId: false});
        //     var socket = createSocket(this.props.authentication.user.profile.staffId );
        //     console.log("Сокет. Создан");
        //     socket.onopen = function() {
        //         console.log("Сокет. Соединение установлено");
        //
        //         socket.send('ping');
        //
        //     };
        //
        //
        //     socket.onclose = function(event) {
        //         if (event.wasClean) {
        //             console.log('Сокет. cоединение закрыто');
        //         } else {
        //             console.log('Сокет. соединения как-то закрыто');
        //         }
        //         this.openSocketAgain(this.props.authentication.user.profile.staffId);
        //     };
        //
        //     socket.onmessage = function(event) {
        //         if (event.data[0]==='{'){
        //             const finalData = JSON.parse(event.data);
        //             if((finalData.wsMessageType === "APPOINTMENT_CREATED") || (finalData.wsMessageType === "APPOINTMENT_DELETED")){
        //                 this.handleSocketDispatch(finalData);
        //             }
        //         }
        //         console.log(`Сокет.пришли данные: ${event.data}`);
        //
        //     };
        //     socket.onmessage = socket.onmessage.bind(this);
        //     socket.onclose = socket.onclose.bind(this);
        //
        //     socket.onerror = function(event) {
        //         console.error("Сокет. ошибка", event);
        //     };
        // }

    }


    render() {
        const { calendar, services, clients, staff, appointments, authentication } = this.props;
        const { approvedId, staffAll, workingStaff, reserved, appointmentEdited,
            clickedTime, minutes, minutesReservedtime, staffClicked,
            selectedDay, type, appointmentModal, selectedDays, edit_appointment, infoClient,
            typeSelected, selectedStaff, reservedTimeEdited, reservedTime, reservedStuffId,
            reserveId, reserveStId, selectedDayMoment, availableTimetableMessage,
        } = this.state;
        const calendarModalsProps = {
            appointmentModal, appointmentEdited, clients, staff, edit_appointment, staffAll, services, staffClicked, adding: calendar && calendar.adding, status: calendar && calendar.status,
            clickedTime, selectedDayMoment, selectedDay, workingStaff, minutes, reserved, type, infoClient, minutesReservedtime,
            reservedTime, reservedTimeEdited, reservedStuffId, approvedId, reserveId, reserveStId,
            newReservedTime: this.newReservedTime, changeTime: this.changeTime, changeReservedTime: this.changeReservedTime,
            onClose: this.onClose, updateClient: this.updateClient, addClient: this.addClient, newAppointment: this.newAppointment,
            deleteReserve: this.deleteReserve, deleteAppointment: this.deleteAppointment, availableTimetable: workingStaff.availableTimetable,
        };
        const isLoading = this.props.calendar.isLoading || this.props.staff.isLoading || this.props.calendar.isLoadingAppointments || this.props.calendar.isLoadingReservedTime || this.props.staff.isLoadingTimetable || this.props.staff.isLoadingAvailableTime;

        return (
            <div className="calendar" ref={node => { this.node = node; }} onScroll={() => {
                if (this.state.scrollableAppointmentAction) {
                    this.setState({scrollableAppointmentAction: false})
                }
            }}>

                            <div className="row content calendar-container">
                                <StaffChoice
                                    typeSelected={typeSelected}
                                    selectedStaff={selectedStaff}
                                    availableTimetable={staffAll.availableTimetable}
                                    staff={staff && staff.staff}
                                    setWorkingStaff={this.setWorkingStaff}
                                />

                                <div className="calendar col-6">
                                    <DatePicker
                                        closedDates={staffAll.closedDates}
                                        type={type}
                                        selectedDay={selectedDay}
                                        selectedDays={selectedDays}
                                        showPrevWeek={this.showPrevWeek}
                                        showNextWeek={this.showNextWeek}
                                        handleDayChange={this.handleDayChange}
                                        handleDayClick={this.handleDayClick}
                                        handleWeekClick={this.handleWeekClick}
                                    />
                                </div>
                                <CalendarSwitch
                                type={type}
                                selectType={this.selectType}
                                />
                            </div>
                            <div className="days-container">
                                <div className="tab-pane active" id={selectedDays.length===1 ? "days_20" : "weeks"}>
                                     <div className="calendar-list">
                                        <TabScrollHeader
                                            selectedDays={selectedDays}
                                            availableTimetable={workingStaff.availableTimetable }
                                            availableTimetableMessage={availableTimetableMessage}
                                            timetable={workingStaff.timetable }
                                            closedDates={staffAll.closedDates}
                                            staff={staff && staff.staff}
                                        />
                                        <TabScrollContent
                                            timetable={staff.timetable}
                                            isClientNotComeLoading={calendar.isClientNotComeLoading}
                                            services={services}
                                            authentication={authentication}
                                            availableTimetable={workingStaff.availableTimetable}
                                            selectedDays={selectedDays}
                                            closedDates={staffAll.closedDates}
                                            clients={clients && clients.client}
                                            appointments={appointments}
                                            reservedTime={calendar && calendar.reservedTime}
                                            handleUpdateClient={this.handleUpdateClient}
                                            approveAppointmentSetter={this.approveAppointmentSetter}
                                            updateReservedId={this.updateReservedId}
                                            changeTime={this.changeTime}
                                            isLoading={isLoading}
                                        />
                                    </div>
                                </div>
                            </div>

                <CalendarModals {...calendarModalsProps} />
                {isLoading && <div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}
                {/*{appointmentSocketMessageFlag &&*/}
                {/*<AppointmentFromSocket*/}
                {/*    appointmentSocketMessageFlag={appointmentSocketMessageFlag}*/}
                {/*    appointmentSocketMessage={appointmentSocketMessage}*/}
                {/*    closeAppointmentFromSocket={this.closeAppointmentFromSocket}*/}
                {/*/>}*/}
            </div>
        );
    }
    closeAppointmentFromSocket(){
        $(".appointment-socket-modal ").addClass('appointment-socket-modal-go-away');
        setTimeout(() => {
            this.setState({ appointmentSocketMessageFlag: false });
            $(".appointment-socket-modal ").removeClass('appointment-socket-modal-go-away');
            }, 1000);

    }

    onClose(){
        this.setState({...this.state, reserved: false, appointmentModal:false});
    }

    onCloseClient(){
        this.setState({...this.state, newClientModal: false});
    }

    newAppointment(appointment, serviceId, staffId, clientId, coStaffs) {
        const {dispatch} = this.props;
        const {selectedDays, type, selectedDayMoment} = this.state;
        let startTime, endTime;

        if(type==='day'){
            appointment.forEach((currentAppointment,i) => {
                appointment[i].appointmentTimeMillis=moment(selectedDayMoment.format('DD MM YYYY')+" "+moment(appointment[i].appointmentTimeMillis, 'x').format('HH:mm'), 'DD MM YYYY HH:mm').format('x')
            });
            startTime = selectedDayMoment.startOf('day').format('x');
            endTime = selectedDayMoment.endOf('day').format('x')

        } else {
            startTime = moment(selectedDays[0]).startOf('day').format('x');
            endTime = moment(selectedDays[6]).endOf('day').format('x');
        }

        dispatch(calendarActions.addAppointment(JSON.stringify(appointment), serviceId, staffId, clientId, startTime, endTime, coStaffs));
    }

    newReservedTime(staffId, reservedTime) {
        const {dispatch} = this.props;
        const {selectedDayMoment, type, selectedDays} = this.state;

        if(type==='day'){
            reservedTime.startTimeMillis=moment(selectedDayMoment.format('DD MM YYYY')+" "+moment(reservedTime.startTimeMillis, 'x').format('HH:mm'), 'DD MM YYYY HH:mm').format('x')
            reservedTime.endTimeMillis=moment(selectedDayMoment.format('DD MM YYYY')+" "+moment(reservedTime.endTimeMillis, 'x').format('HH:mm'), 'DD MM YYYY HH:mm').format('x')
        }


        let startTime, endTime;
        if(type==='day') {
            startTime = selectedDayMoment.startOf('day').format('x');
            endTime = selectedDayMoment.endOf('day').format('x')
        } else {
            startTime =moment(selectedDays[0]).startOf('day').format('x')
            endTime = moment(selectedDays[6]).endOf('day').format('x');
        }
        dispatch(calendarActions.addReservedTime(JSON.stringify(reservedTime), staffId, startTime, endTime));
    }

    editAppointment(appointment) {
        const {dispatch} = this.props;
        const {selectedDays, type, selectedDayMoment} = this.state;
        let startTime, endTime;

        if(type==='day') {
            startTime = selectedDayMoment.startOf('day').format('x');
            endTime = selectedDayMoment.endOf('day').format('x')
        } else {
            startTime = moment(selectedDays[0]).startOf('day').format('x');
            endTime = moment(selectedDays[6]).endOf('day').format('x');
        }
        dispatch(calendarActions.editAppointmentTime(JSON.stringify(appointment), startTime, endTime));
    }

    approveAppointmentSetter(approvedId){
        this.props.dispatch(companyActions.getNewAppointments());
        this.setState({ approvedId })
    }

    deleteAppointment(id){
        const { dispatch } = this.props;

        const { selectedDays, type, selectedDayMoment } = this.state;

        if(type==='day'){
            //dispatch(calendarActions.deleteAppointment(id, selectedDayMoment.startOf('day').format('x'), selectedDayMoment.endOf('day').format('x')));
            dispatch(calendarActions.deleteAppointment(id));
        } else {
            //dispatch(calendarActions.deleteAppointment(id, moment(selectedDays[0]).startOf('day').format('x'), moment(selectedDays[6]).endOf('day').format('x')));
            dispatch(calendarActions.deleteAppointment(id));
        }

        //dispatch(companyActions.getNewAppointments());

    }

    deleteReserve(stuffId, id){
        const {dispatch} = this.props;
        const {selectedDays, type, selectedDayMoment} = this.state;
        let startTime, endTime;

        if(type==='day') {
            startTime = selectedDayMoment.startOf('day').format('x');
            endTime = selectedDayMoment.endOf('day').format('x')
        } else {
            startTime =moment(selectedDays[0]).startOf('day').format('x')
            endTime = moment(selectedDays[6]).endOf('day').format('x');
        }
        dispatch(calendarActions.deleteReservedTime(stuffId, id, startTime, endTime));
    }

    changeTime(time, staffId, number, edit_appointment, appointment){
        this.checkAvaibleTime();
        this.setState({ appointmentModal: true, clickedTime: time, minutesReservedtime:[], minutes: this.getHours(staffId, time, appointment), staffClicked:staffId, edit_appointment: edit_appointment, appointmentEdited: appointment });
    }
    checkAvaibleTime(){
        const {selectedDayMoment, selectedDays, type}=this.state;
        let startTime, endTime;

        if(type==='day'){
            startTime = selectedDayMoment.startOf('day').format('x');
            endTime = selectedDayMoment.endOf('day').format('x')
        } else {
            startTime = moment(selectedDays[0]).startOf('day').format('x');
            endTime = moment(selectedDays[6]).endOf('day').format('x');
        }
        this.props.dispatch(staffActions.getTimetableStaffs(startTime, endTime, true));
    }

    changeReservedTime(minutesReservedtime, staffId, newTime=null){
        const { selectedDay } = this.state;

        if(newTime===null) {
            this.setState({ clickedTime: minutesReservedtime, reserved: true });
        }

        return this.getHours(staffId, moment(selectedDay).format('x'));
    }

    handleUpdateClient(client) {
        this.setState({
            infoClient: client
        })
    }
    updateReservedId(reserveId, reserveStId){
        this.setState({
            reserveId,
            reserveStId
        })
    }

    handleDayChange (date) {
        const { selectedStaff } = this.state;
        const weeks = getWeekDays(getWeekRange(date).from);
        const startTime = moment(weeks[0]).startOf('day').format('x');
        const endTime = moment(weeks[6]).endOf('day').format('x');

        this.setState({
            selectedDays: weeks,
            timetableFrom: startTime,
            timetableTo:endTime
        });
        this.refreshTable(startTime, endTime)
        history.pushState(null, '', '/calendar/staff/'+JSON.parse(selectedStaff).staffId+'/'+moment(weeks[0]).format('DD-MM-YYYY')+"/"+moment(weeks[6]).format('DD-MM-YYYY'))
    };

    handleWeekClick (weekNumber, days, e) {
        const { selectedStaff } = this.state;
        const startTime = moment(days[0]).startOf('day').format('x');
        const endTime = moment(days[6]).endOf('day').format('x');

        this.setState({
            selectedDays: days,
            timetableFrom: startTime,
            timetableTo:endTime,
            type: 'week',
            scroll: true, opacity: false
        });
        history.pushState(null, '', '/calendar/staff/'+JSON.parse(selectedStaff).staffId+'/'+moment(days[0]).format('DD-MM-YYYY')+"/"+moment(days[6]).format('DD-MM-YYYY'))

        this.refreshTable(startTime, endTime);
    };

    showPrevWeek (){
        const {selectedDays, workingStaff, selectedStaff} = this.state;
        const weeks = getWeekDays(getWeekRange(moment(selectedDays[0]).subtract(7, 'days')).from);
        const statTime = moment(weeks[0]).startOf('day').format('x');
        const endTime = moment(weeks[6]).endOf('day').format('x');

        this.refreshTable(statTime, endTime);
        this.setState({
            selectedDays: weeks,
            timetableFrom: statTime,
            timetableTo: endTime,
            workingStaff: {...workingStaff, availableTimetable:[workingStaff.availableTimetable[0]]},
            type: 'week',
            scroll: true
        });

        history.pushState(null, '', '/calendar/staff/'+JSON.parse(selectedStaff).staffId+'/'+moment(weeks[0]).format('DD-MM-YYYY')+"/"+moment(weeks[6]).format('DD-MM-YYYY'))
    }

    showNextWeek (){
        const {selectedDays, workingStaff, selectedStaff} = this.state;
        const weeks = getWeekDays(getWeekRange(moment(selectedDays[0]).add(7, 'days')).from);
        const startTime = moment(weeks[0]).startOf('day').format('x');
        const endTime = moment(weeks[6]).endOf('day').format('x')
        this.refreshTable(startTime, endTime);
        this.setState({
            selectedDays: weeks,
            timetableFrom: startTime,
            timetableTo: endTime,
            workingStaff: {...workingStaff, availableTimetable:[workingStaff.availableTimetable[0]]},
            type: 'week',
            scroll: true
        });
        history.pushState(null, '', '/calendar/staff/'+JSON.parse(selectedStaff).staffId+'/'+moment(weeks[0]).format('DD-MM-YYYY')+"/"+moment(weeks[6]).format('DD-MM-YYYY'))
    }

    handleDayClick(day) {
        const {typeSelected, selectedStaff} = this.state;
        let daySelected = moment(day);
        const startTime = daySelected.startOf('day').format('x');
        const endTime = daySelected.endOf('day').format('x');

        this.refreshTable(startTime, endTime);

        this.setState({
            selectedDay: daySelected.utc().startOf('day').toDate(),
            selectedDayMoment: daySelected,
            selectedDays: [getDayRange(moment(daySelected).format()).from]
        });

        let url;
        if (typeSelected===1) {
            url = 'workingstaff/0/';
        } else if (typeSelected===2) {
            url = 'allstaff/0/'
        } else if (typeSelected===3) {
            url = `staff/${JSON.parse(selectedStaff).staffId}/`;
        }
        history.pushState(null, '', `/calendar/${url}${daySelected.startOf('day').format('DD-MM-YYYY')}`);
    }

    selectType (type){
        const {workingStaff, staffAll, typeSelected, selectedStaff} = this.state;
        let url, startTime, endTime;

        let types=typeSelected
        let newState = {
            workingStaff: {...workingStaff, availableTimetable:[]},
            scroll: true,
        }

        if (type==='day') {
            newState = {
                ...newState,
                type: 'day',
                staffFromUrl:JSON.parse(selectedStaff).staffId,
                typeSelected: typeSelected,
                selectedDay: moment().utc().startOf('day').toDate(),
                selectedDays: [getDayRange(moment().format()).from]
            };

            startTime = moment().startOf('day').format('x');
            endTime = moment().endOf('day').format('x');

            if(typeSelected===3){
                url = `staff/${JSON.parse(selectedStaff).staffId}/${moment(weeks[0]).format('DD-MM-YYYY')}`;
            }else{
                url = `workingstaff/0/${moment().format('DD-MM-YYYY')}`
            }
        } else {
            if(typeSelected===1 || typeSelected===2){
                types=3
            }
            let weeks = getWeekDays(getWeekRange(moment().format()).from);
            newState = {
                ...newState,
                typeSelected: types,
                staffFromUrl: JSON.parse((selectedStaff && selectedStaff.length!==0) ? selectedStaff : JSON.stringify(staffAll.availableTimetable[0])).staffId,
                selectedStaff: (selectedStaff && selectedStaff.length!==0) ? selectedStaff : JSON.stringify(staffAll.availableTimetable[0]),
                type: 'week',
                selectedDays: weeks
            };

            startTime = moment(weeks[0]).startOf('day').format('x');
            endTime = moment(weeks[6]).endOf('day').format('x');

            url = `staff/${JSON.parse((selectedStaff && selectedStaff.length) ? selectedStaff : JSON.stringify(staffAll.availableTimetable[0])).staffId}/${moment(weeks[0]).format('DD-MM-YYYY')}/${moment(weeks[6]).format('DD-MM-YYYY')}`;
        }
        this.setState(newState);
        this.refreshTable(startTime, endTime);
        history.pushState(null, '', `/calendar/${url}`);
    }

    setWorkingStaff(staffEl = null, typeSelected = null, staffAll = null) {
        const {workingStaff, selectedDay, type, selectedStaff, selectedDays} = this.state;
        let newState = {};
        let url;

        if(staffAll===null){
            staffAll=this.state.staffAll
        }

        if(type==='week' && typeSelected !== 3){
            const startOfDay = moment().startOf('day').format('x');
            const endOfDay = moment().endOf('day').format('x');
            this.refreshTable(startOfDay, endOfDay);

            newState = {
                workingStaff: {...workingStaff, availableTimetable:[]},
                availableTimetableMessage: '',
                type: 'day',
                typeSelected: typeSelected,
                selectedDay: moment().utc().startOf('day').toDate(),
                selectedDays: [getDayRange(moment().format()).from]
            };

            const staffUrl = typeSelected===1 ? 'workingstaff' : 'allstaff';
            url = `/calendar/${staffUrl}/0/${moment().format('DD-MM-YYYY')}`;
        } else {
            if (typeSelected === 1) {
                let staffWorking = staffEl.filter((item) => item.availableDays.length && item.availableDays.some((time) => {
                        const checkingDay = parseInt(moment(time.dayMillis, 'x').format('DD'));
                        const currentDay = parseInt(moment(selectedDay).format('DD'));
                        return checkingDay === currentDay;
                    })
                );

                newState = {
                    staffAll: staffAll,
                    workingStaff: {
                        ...workingStaff,
                        availableTimetable: staffWorking.length ? staffWorking : null
                    },
                    availableTimetableMessage: staffWorking.length ? '' : 'Нет работающих сотрудников',
                    typeSelected: typeSelected,
                    type: 'day'
                };
                url = `/calendar/workingstaff/0/${moment(selectedDay).format('DD-MM-YYYY')}`;
            } else if (typeSelected === 2) {
                newState = {
                    workingStaff: {...workingStaff, availableTimetable: staffEl},
                    availableTimetableMessage: staffEl.length ? '' : 'Нет работающих сотрудников',
                    typeSelected: typeSelected,
                    type: 'day'
                }
                url = `/calendar/allstaff/0/${moment(selectedDay).format('DD-MM-YYYY')}`;
            } else {
                let staff=selectedStaff?JSON.stringify(staffEl[0]):JSON.stringify(staffEl.filter((staff)=>staff.staffId===JSON.parse(selectedStaff).staffId));

                newState = {
                    workingStaff: {...workingStaff, availableTimetable: staffEl},
                    availableTimetableMessage: staffEl.length ? '' : 'Нет работающих сотрудников',
                    selectedStaff: selectedStaff?JSON.stringify(staffEl[0]):JSON.stringify(staffEl.filter((staff)=>staff.staffId===JSON.parse(selectedStaff).staffId)),
                    typeSelected: typeSelected,
                    staffFromUrl: JSON.parse(staff).staffId
                }
                const urlPath = selectedDays.length===1 ? moment(selectedDay).format('DD-MM-YYYY') : moment(selectedDays[0]).format('DD-MM-YYYY')+"/"+moment(selectedDays[6]).format('DD-MM-YYYY');
                url = `/calendar/staff/${JSON.parse(staff).staffId}/${urlPath}`;
            }
        }

        this.setState(newState);
        history.pushState(null, '', url);
    }

    updateClient(client){
        this.props.dispatch(clientActions.updateClient(JSON.stringify(client)));
    };

    addClient(client){
        this.props.dispatch(clientActions.addClient(JSON.stringify(client)));
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
                parseInt(moment(moment(availableDay.dayMillis, 'x').format('DD/MM/YYYY')+' '+moment(item, 'x').format('HH:mm'), 'DD/MM/YYYY HH:mm').format('x'))===parseInt(moment(moment(day, 'x').format('DD/MM/YYYY')+' '+moment(item, 'x').format('HH:mm'), 'DD/MM/YYYY HH:mm').format('x')) &&

                availableDay.availableTimes && availableDay.availableTimes.map((time)=> {

                    let currentTime=parseInt(moment(moment(day, 'x').format('DD/MM/YYYY')+' '+moment(item, 'x').format('HH:mm'), 'DD/MM/YYYY HH:mm').format('x'));

                    return (currentTime >= time.startTimeMillis && currentTime < time.endTimeMillis && currentTime>=moment().format('x'))
                        && hoursArray.splice(hoursArray.indexOf(moment(item, 'x').format('H:mm')), 1)
                })
                )
            )
        );

        return hoursArray;
    }
}

function mapStateToProps(store) {
    const {staff, client, calendar, services, authentication} = store;

    return {
        staff, clients: client, calendar, services, authentication, appointments: calendar.appointments
    };
}

export default connect(mapStateToProps)(Index);
