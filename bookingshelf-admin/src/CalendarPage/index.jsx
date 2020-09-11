import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { isMobile } from 'react-device-detect';

import { DatePicker } from '../_components/DatePicker';
import { CalendarModals } from '../_components/modals/CalendarModals';
import TabScrollContent from './components/TabScrollContent';
import StaffChoice from './components/StaffChoice';
import TabScrollHeader from './components/TabScrollHeader';
import CalendarSwitch from './components/CalendarSwitch';

import { cellActions } from '../_actions/cell.actions';
import {
  calendarActions,
  staffActions,
  clientActions,
  servicesActions,
  appointmentActions,
} from '../_actions';

import { getCurrentCellTime } from '../_helpers';
import { access } from '../_helpers/access';
import { getWeekRange } from '../_helpers/time';
import {
  checkIsOnAnotherReservedTime,
  checkIsOnAnotherVisit,
  getStaffListWithAppointments,
} from '../_helpers/available-time';

import 'react-day-picker/lib/style.css';
import '../../public/css_admin/date.css';
import '../../public/scss/calendar.scss';


function getWeekDays(weekStart) {
  const days = [weekStart];
  for (let i = 1; i < 7; i += 1) {
    days.push(
      moment(weekStart).locale('ru')
        .add(i, 'days')
        .toDate(),
    );
  }

  console.log(days);
  return days;
}

function getDayRange(date) {
  return {
    from: moment(date).locale('ru')
      .toDate(),
    to: moment(date).locale('ru')
      .endOf('day')
      .toDate(),
  };
}

class Index extends PureComponent {
  constructor(props) {
    super(props);
    let staffFromUrl; let param1; let dateToType;

    const dateFr=props.match.params.dateFrom ?
      moment(props.match.params.dateFrom, 'DD-MM-YYYY') :
      moment();


    const dateTo=props.match.params.dateTo ? getWeekDays(getWeekRange(dateFr).from) :
      [getDayRange(dateFr).from];

    if (!access(2)) {
      staffFromUrl = 2;
      param1 = 3;

      dateToType = 'day';
    } else {
      param1=props.match.params.selectedType
        ? props.match.params.selectedType==='workingstaff'
          ? 1
          :(props.match.params.selectedType==='allstaff' ? 2 : 3)
        : 1;

      dateToType=props.match.params.dateTo ? 'week' : 'day';

      staffFromUrl=props.match.params.selectedType==='staff' ? parseInt(props.match.params.staffNum) :
        null;
    }

    if (!access(2) && props.match.params.selectedType && props.match.params.staffNum &&
      props.match.params.dateFrom && props.match.params.selectedType!=='staff') {
      props.history.push('/denied');
    }

    this.state = {
      workingStaff: [],
      clickedTime: 0,
      minutes: [],
      minutesReservedtime: [],
      opacity: false,
      closedDates: {},
      type: dateToType,
      typeSelected: param1,
      selectedDays: dateTo,
      reservedTimeEdited: null,
      selectedStaff: [],
      staffFromUrl: staffFromUrl,
      reservedStuffId: null,
      reserved: false,
      appointmentModal: false,
      newClientModal: false,
      scrollableAppointmentAction: true,
      appointmentMarkerActionCalled: false,
      scrolledToRight: false,
    };

    this.newAppointment = this.newAppointment.bind(this);
    this.checkForCostaffs = this.checkForCostaffs.bind(this);
    this.getByStaffKey = this.getByStaffKey.bind(this);
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
    this.getCellTime = this.getCellTime.bind(this);
    this.editAppointment = this.editAppointment.bind(this);
    this.changeReservedTime = this.changeReservedTime.bind(this);
    this.newReservedTime = this.newReservedTime.bind(this);
    this.updateAppointmentForDeleting = this.updateAppointmentForDeleting.bind(this);
    this.changeTimeFromCell = this.changeTimeFromCell.bind(this);
    this.updateCalendar = this.updateCalendar.bind(this);
    this.moveVisit = this.moveVisit.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onCloseClient = this.onCloseClient.bind(this);
    this.animateActiveAppointment = this.animateActiveAppointment.bind(this);
    this.navigateToRedLine = this.navigateToRedLine.bind(this);
    this.handleUpdateClient = this.handleUpdateClient.bind(this);
    this.closeAppointmentFromSocket = this.closeAppointmentFromSocket.bind(this);
    this.queryInitData = this.queryInitData.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.scrollHandler = this.scrollHandler.bind(this);
  }

  componentDidMount() {
    if (this.props.match.params.selectedType && this.props.match.params.selectedType !== 'workingstaff' &&
      this.props.match.params.selectedType !== 'staff' && this.props.match.params.selectedType !== 'allstaff' &&
      !this.props.match.params.dateFrom) {
      this.props.history.push('/nopage');
      return false;
    }


    this.props.dispatch(cellActions.togglePayload({ selectedDays: this.state.selectedDays }));

    if (this.props.authentication.loginChecked) {
      this.queryInitData();
    }

    document.title = 'Журнал записи | Онлайн-запись';
    initializeJs();
  }

  queryInitData() {
    const { selectedDays } = this.state;
    const { startTime, endTime } = this.getSelectedTimeRange(selectedDays);

    this.getTimetable(null, moment(selectedDays[0]), true);


    const { search } = this.props.location;
    if (search.includes('appointmentId')) {
      this.props.dispatch(calendarActions.setScrollableAppointment(search.split('=')[1]));
    }

    if (this.props.staff.timetable) {
      this.initAvailableTime(this.props.staff, this.props.authentication);
    }

    this.props.dispatch(staffActions.get());
    this.props.dispatch(staffActions.getClosedDates());
    this.refreshTable(startTime, endTime);

    this.props.dispatch(servicesActions.get());
    this.props.dispatch(servicesActions.getServices());

    setTimeout(() => {
      if (!this.props.scrollableAppointmentId &&
        (moment(selectedDays[0]).format('DD-MM-YYYY') === moment().format('DD-MM-YYYY'))
      ) {
        this.navigateToRedLine();
      }
    }, 500);
  }

  getSelectedTimeRange(selectedDays = (this.props.selectedDays || this.state.selectedDays), type = this.state.type) {
    return {
      startTime: moment(selectedDays[0]).startOf('day').format('x'),
      endTime: moment(selectedDays[type === 'day' ? 0 : 6]).endOf('day').format('x'),
    };
  }

  getTimetable(prevDay, newDay, forceSet) {
    const prevMonth = prevDay && moment(prevDay).format('MM YYYY');
    const newMonth = moment(newDay).format('MM YYYY');
    if ((prevMonth !== newMonth) || forceSet) {
      this.props.dispatch(staffActions.getTimetable(
        moment(newDay).subtract(1, 'week').startOf('month').format('x'),
        moment(newDay).add(1, 'week').endOf('month').format('x'),
      ));
    }
  }

  navigateToRedLine() {
    setTimeout(() => {
      const activeElem = document.getElementsByClassName('present-time-line-shadow')[0];
      if (activeElem) {
        activeElem.scrollIntoView();
      } else {
        this.navigateToRedLine();
      }
    }, 100);
  }

  refreshTable(startTime, endTime, updateReservedTime = true, isLoading = true) {
    // this.props.dispatch(staffActions.getTimetableStaffs(startTime, endTime, false, isLoading));
    this.props.dispatch(calendarActions.getAppointments(startTime, endTime, isLoading));

    if (updateReservedTime) {
      this.props.dispatch(calendarActions.getReservedTime(startTime, endTime));
    }
  }

  updateCalendar(updateReservedTime, isLoading = true) {
    const { startTime, endTime } = this.getSelectedTimeRange();
    this.refreshTable(startTime, endTime, updateReservedTime, isLoading);
  }

  componentDidUpdate(prevProps, prevState) {
    const { scrollableAppointmentId } = this.props;
    const { appointmentMarkerActionCalled }=this.state;

    $('.msg-client-info').css({ 'visibility': 'visible', 'cursor': 'default' });

    $('.notes').css({ 'cursor': 'default' });
    $('textarea').css({ 'cursor': 'default' });


    if (prevState.typeSelected !== this.state.typeSelected) {
      this.setWorkingStaff();
    }
    if (!appointmentMarkerActionCalled && scrollableAppointmentId) {
      this.animateActiveAppointment(scrollableAppointmentId);
    }
  }

  animateActiveAppointment(className) {
    setTimeout(() => {
      const { scrollableAppointmentAction } = this.state;
      const activeElem = document.getElementsByClassName(className)[0];
      if (activeElem) {
        const updatedState = { appointmentMarkerActionCalled: true };
        const formattedClassName = `.${className}`;
        $(formattedClassName).addClass('custom-blick-div');
        if (scrollableAppointmentAction) {
          activeElem.scrollIntoView();
          updatedState.scrollableAppointmentAction = false;
        }
        this.setState(updatedState);
        this.props.dispatch(calendarActions.setScrollableAppointment(null));
        setTimeout(() => {
          $(formattedClassName).removeClass('custom-blick-div');
        }, 10000);
      } else {
        this.animateActiveAppointment(className);
      }
    }, 500);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.authentication.loginChecked !== newProps.authentication.loginChecked) {
      this.queryInitData();
    }

    if (JSON.stringify(this.props) !== JSON.stringify(newProps)) {
      this.setState({
        reserved: newProps.status && newProps.status===209 ? false : this.state.reserved,
        newClientModal: newProps.clients.status && newProps.clients.status===209 ? false : this.state.newClientModal,
      });
    }

    // const isLoading = newProps.staff.isLoading || newProps.staff.isLoadingTimetable
    // || newProps.staff.isLoadingAvailableTime;
    if ((newProps.selectedDays[0] !== this.props.selectedDays[0]) ||
      (JSON.stringify(this.props.staff.timetable) !== JSON.stringify(newProps.staff.timetable))) {
      this.initAvailableTime(newProps.staff, newProps.authentication, newProps.selectedDays);
    }


    if (newProps.isAppointmentUpdated) {
      const { startTime, endTime } = this.getSelectedTimeRange();

      this.props.dispatch(calendarActions.updateAppointmentFinish());
      this.refreshTable(startTime, endTime, false, false);
    }

    if (newProps.refreshAvailableTimes && (this.props.refreshAvailableTimes !== newProps.refreshAvailableTimes)) {
      this.updateCalendar(false, false);
      this.props.dispatch(calendarActions.toggleRefreshAvailableTimes(false));
    }
  }

  initAvailableTime(staff, authentication, selectedDays) {
    const { timetable } = staff;
    if (this.state.typeSelected===3 || this.state.typeSelected===2 || this.state.type==='week') {
      const updatedWorkingStaff = this.state.typeSelected===3 || this.state.type === 'week'
        ? { timetable: timetable && timetable.filter((staff)=>staff.staffId===
          (!access(2)
            ? (authentication.user && authentication.user.profile.staffId)
            : (this.state.staffFromUrl===null
              ? JSON.parse(this.state.selectedStaff).staffId
              :this.state.staffFromUrl)
          )),
        }
        : staff;
      if (this.state.type === 'week' && updatedWorkingStaff && updatedWorkingStaff.timetable) {
        for (let i = 0; i < 6; i++) {
          updatedWorkingStaff.timetable.push(updatedWorkingStaff.timetable[0]);
        }
      }
      this.setState({
        opacity: false,
        typeSelected: this.state.typeSelected===1?3:this.state.typeSelected,
        selectedStaff: this.state.staffFromUrl!==null && timetable
          ? JSON.stringify(timetable.filter((staff)=>staff.staffId===(!access(2)
            ? (authentication.user && authentication.user.profile.staffId)
            : this.state.staffFromUrl))[0])
          : [],
        workingStaff: updatedWorkingStaff,
      });
    }

    if ((this.state.typeSelected===1 || this.state.typeSelected === 2) && this.state.type!=='week' && timetable) {
      this.setWorkingStaff(timetable, this.state.typeSelected, timetable, selectedDays);
    }
  }

  getByStaffKey(staffKey) {
    return this.state.workingStaff.timetable[staffKey].staffId;
  }

  moveVisit({ movingVisit, movingVisitDuration, selectedDaysKey, staffKey, prevVisitStaffId, time }) {
    const { appointments, reservedTimeFromProps, staff, selectedDays } = this.props;
    const { workingStaff } = this.state;
    const movingVisitStaffId = workingStaff.timetable[staffKey].staffId;
    const movingVisitMillis = getCurrentCellTime(selectedDays, selectedDaysKey, time);
    this.props.dispatch(appointmentActions.makeMovingVisitQuery({
      staff: staff.staff,
      appointments,
      reservedTimes: reservedTimeFromProps,
      timetable: staff.timetable,
      movingVisit,
      movingVisitDuration,
      movingVisitStaffId,
      movingVisitMillis,
      prevVisitStaffId,
    }));
  }

  getCellTime({ selectedDaysKey, time }) {
    const selectedDays = this.props.selectedDays.length ? this.props.selectedDays : this.state.selectedDays;
    return getCurrentCellTime(selectedDays, selectedDaysKey, time);
  }

  checkForCostaffs({ appointments, staffKey, currentTime }) {
    const { staff } = this.props.staff;
    const { workingStaff } = this.state;
    const staffWithTimetable = workingStaff.timetable[staffKey];

    const staffListWithAppointments = getStaffListWithAppointments(
      { appointments, staffWithTimetable, staff, excludeCurrentStaff: true },
    );
    const isOnAnotherVisit = staffListWithAppointments && staffListWithAppointments
      .some((staffWithAppointments) => checkIsOnAnotherVisit(staffWithAppointments, currentTime));
    return !isOnAnotherVisit;
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  scrollHandler() {
    const childrens = $($('.tab-content-list')[0]).children();
    const countCols = childrens.length - 1;
    const widthTabConent = $('.days-container').width();

    if (countCols > 7) {
      const countColsToWidth = parseInt(widthTabConent / childrens[1].offsetWidth);
      const countPlus = countColsToWidth * (childrens[1].offsetWidth - 5);
      const allWidth = $('.tab-content-list').width() -
        ((childrens[1].offsetWidth + 5) * countColsToWidth) - (countCols > 10 ? 200 : 0);


      // console.log(this.wrapperRef.scrollLeft, allWidth, countPlus);
      if (this.wrapperRef.scrollLeft < allWidth) {
        this.wrapperRef.scrollLeft += countPlus;


        if (this.wrapperRef.scrollLeft > allWidth) {
          this.setState({ scrolledToRight: true });
        }
      } else {
        this.wrapperRef.scrollLeft = 0;
        this.setState({ scrolledToRight: false });
      }
    } else {
      this.setState({ scrolledToRight: !this.state.scrolledToRight }, () => {
        this.wrapperRef.scrollLeft = this.state.scrolledToRight ? 9999 : 0;
      });
    }
  }


  render() {
    const {
      authentication, company, services, clients, staff, status, adding, isLoadingCalendar,
      isLoadingAppointments, isLoadingReservedTime, selectedDays,
    } = this.props;
    const {
      appointmentForDeleting, workingStaff, reserved, appointmentEdited,
      clickedTime, minutes, minutesReservedtime, staffClicked,
      type, appointmentModal, edit_appointment, infoClient,
      typeSelected, selectedStaff, reservedTimeEdited, reservedStuffId, timetableMessage,
    } = this.state;
    const calendarModalsProps = {
      appointmentModal, appointmentEdited, clients, staff, edit_appointment, services, staffClicked, adding, status,
      clickedTime, selectedDayMoment: moment(selectedDays[0]), selectedDay: selectedDays[0], workingStaff,
      minutes, reserved, type, infoClient, minutesReservedtime,
      reservedTimeEdited, reservedStuffId, appointmentForDeleting,
      newReservedTime: this.newReservedTime, changeTime: this.changeTime, moveVisit: this.moveVisit,
      getByStaffKey: this.getByStaffKey, changeReservedTime: this.changeReservedTime,
      onClose: this.onClose, updateClient: this.updateClient, addClient: this.addClient,
      newAppointment: this.newAppointment, deleteAppointment: this.deleteAppointment, timetable: workingStaff.timetable,
    };

    const companyTypeId = company.settings && company.settings.companyTypeId;
    const path='/'+ location && location.pathname.split('/')[1];

    let redTitle;
    if (path === '/invoices') {
      redTitle = 'Счета';
    } else {
      redTitle = '';
      if (authentication.user && authentication.menu && authentication.menu[0]) {
        const titleKey = Object.keys(authentication.menu[0]).find((key)=>authentication.menu[0][key].url === path);
        if (titleKey) {
          redTitle = authentication.menu[0][titleKey].name;
        }
        if (redTitle === 'Сотрудники') {
          redTitle = (companyTypeId === 2 || companyTypeId === 3) ? 'Рабочие места' : 'Сотрудники';
        }
      }
    }
    const isLoading = isLoadingCalendar || this.props.staff.isLoading || isLoadingAppointments ||
      isLoadingReservedTime || this.props.staff.isLoadingTimetable || this.props.staff.isLoadingAvailableTime;

    return (
      <React.Fragment>
        {/* <p className="red-title-block mob-setting">*/}
        {/*    {redTitle}*/}
        {/* </p>*/}
        <div className="calendar" ref={(node) => {
          this.node = node;
        }} onScroll={() => {
          if (this.state.scrollableAppointmentAction) {
            this.setState({ scrollableAppointmentAction: false });
          }
        }}>
          <div className="row content calendar-container">
            <StaffChoice
              typeSelected={typeSelected}
              selectedStaff={selectedStaff}
              timetable={staff.timetable}
              staff={staff && staff.staff}
              setWorkingStaff={this.setWorkingStaff}
            />

            <div className="calendar col-6">
              <DatePicker
                closedDates={staff.closedDates}
                type={type}
                selectedDay={selectedDays[0]}
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
          <div className={'days-container ' + (isMobile ? 'days-container-mobile' : 'days-container-desktop')}>

            <button
              onClick={this.scrollHandler}
              className={'scroll-button' + (!this.state.scrolledToRight ? '' : ' scrolled')}
            />

            <div className="tab-pane active" id={selectedDays.length===1 ? 'days_20' : 'weeks'}>
              <div ref={this.setWrapperRef} className="calendar-list">

                <TabScrollHeader
                  selectedDays={selectedDays}
                  timetable={workingStaff.timetable }
                  timetableMessage={timetableMessage}
                  closedDates={staff.closedDates}
                  staff={staff && staff.staff}
                  type={type}
                />

                {company.settings && (
                  <TabScrollContent
                    company={company}
                    checkForCostaffs={this.checkForCostaffs}
                    getCellTime={this.getCellTime}
                    type={type}
                    timetable={staff.timetable}
                    availableTimetable={workingStaff.timetable}
                    closedDates={staff.closedDates}
                    clients={clients && clients.client}
                    handleUpdateClient={this.handleUpdateClient}
                    updateAppointmentForDeleting={this.updateAppointmentForDeleting}
                    changeTime={this.changeTime}
                    changeTimeFromCell={this.changeTimeFromCell}
                    moveVisit={this.moveVisit}
                    selectedDays={selectedDays}
                  />)
                }
              </div>
            </div>
          </div>

          <CalendarModals {...calendarModalsProps} />
          {isLoading &&
            <div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>
          }
        </div>
      </React.Fragment>
    );
  }
  closeAppointmentFromSocket() {
    $('.appointment-socket-modal ').addClass('appointment-socket-modal-go-away');
    setTimeout(() => {
      $('.appointment-socket-modal ').removeClass('appointment-socket-modal-go-away');
    }, 1000);
  }

  onClose() {
    this.setState({ ...this.state, reserved: false, appointmentModal: false });
  }

  onCloseClient() {
    this.setState({ ...this.state, newClientModal: false });
  }

  newAppointment(appointment, serviceId, staffId, clientId, coStaffs) {
    const { dispatch, selectedDays } = this.props;
    const { type } = this.state;
    const { startTime, endTime } = this.getSelectedTimeRange();

    if (type==='day') {
      appointment.forEach((currentAppointment, i) => {
        appointment[i].appointmentTimeMillis =
          moment(moment(selectedDays[0]).format('DD MM YYYY') + ' ' +
            moment(appointment[i].appointmentTimeMillis, 'x').format('HH:mm'), 'DD MM YYYY HH:mm').format('x');
      });
    }

    dispatch(calendarActions.addAppointment(
      JSON.stringify(appointment), serviceId, staffId, clientId, startTime, endTime, coStaffs),
    );
  }

  newReservedTime(staffId, reservedTime) {
    const { dispatch, selectedDays } = this.props;
    const { type } = this.state;

    if (type==='day') {
      reservedTime.startTimeMillis=moment(moment(selectedDays[0]).format('DD MM YYYY')+' '
        +moment(reservedTime.startTimeMillis, 'x').format('HH:mm'), 'DD MM YYYY HH:mm').format('x');
      reservedTime.endTimeMillis=moment(moment(selectedDays[0]).format('DD MM YYYY')+' '
        +moment(reservedTime.endTimeMillis, 'x').format('HH:mm'), 'DD MM YYYY HH:mm').format('x');
    }

    const { startTime, endTime } = this.getSelectedTimeRange();

    dispatch(calendarActions.addReservedTime(JSON.stringify(reservedTime), staffId, startTime, endTime));
  }

  editAppointment(appointment) {
    const { dispatch } = this.props;
    const { startTime, endTime } = this.getSelectedTimeRange();

    dispatch(calendarActions.editAppointmentTime(JSON.stringify(appointment), startTime, endTime));
  }

  updateAppointmentForDeleting(appointmentForDeleting) {
    this.setState({ appointmentForDeleting });
  }

  changeTimeFromCell(timeProps, ...rest) {
    const { selectedDays } = this.props;
    const { workingStaff } = this.state;
    const { staffKey, selectedDaysKey, time } = timeProps;
    const currentTime = getCurrentCellTime(selectedDays, selectedDaysKey, time);
    const workingStaffElement = workingStaff.timetable[staffKey];
    this.changeTime(currentTime, workingStaffElement, ...rest);
  }

  changeTime(time, staffId, number, edit_appointment, appointment) {
    this.setState(
      {
        appointmentModal: true, clickedTime: time, minutesReservedtime: [],
        minutes: this.getHours(staffId, time, appointment), staffClicked: staffId, edit_appointment: edit_appointment,
        appointmentEdited: appointment,
      });
  }

  changeReservedTime(minutesReservedtime, staffId, newTime=null) {
    const { selectedDays } = this.props;

    if (newTime===null) {
      this.setState({ clickedTime: minutesReservedtime, reserved: true });
    }

    return this.getHours(staffId, moment(selectedDays[0]).format('x'));
  }

  handleUpdateClient(client) {
    this.setState({
      infoClient: client,
    });
  }

  handleDayChange(date) {
    const { selectedDays } = this.props;
    const { selectedStaff } = this.state;

    const weeks = getWeekDays(getWeekRange(date).from);

    const startTime = moment(weeks[0]).startOf('day').format('x');
    const endTime = moment(weeks[6]).endOf('day').format('x');

    this.props.dispatch(cellActions.togglePayload({ selectedDays: weeks }));

    this.refreshTable(startTime, endTime);
    this.getTimetable(selectedDays[0], date);
    history.pushState(null, '', '/calendar/staff/'+JSON.parse(selectedStaff).staffId+'/'
      +moment(weeks[0]).format('DD-MM-YYYY')+'/'+moment(weeks[6]).format('DD-MM-YYYY'));
  };

  handleWeekClick(weekNumber, selectedDays, e) {
    const { selectedStaff } = this.state;
    const startTime = moment(days[0]).startOf('day').format('x');
    const endTime = moment(days[6]).endOf('day').format('x');

    this.props.dispatch(cellActions.togglePayload({ selectedDays }));
    this.setState({
      selectedDays,
      type: 'week',
      opacity: false,
    });
    history.pushState(null, '', '/calendar/staff/'+JSON.parse(selectedStaff).staffId+'/'
      +moment(selectedDays[0]).format('DD-MM-YYYY')+'/'+moment(selectedDays[6]).format('DD-MM-YYYY'));

    this.refreshTable(startTime, endTime);
  };

  showPrevWeek() {
    const { selectedDays } = this.props;
    const { selectedStaff } = this.state;
    const weeks = getWeekDays(getWeekRange(moment(selectedDays[0]).subtract(7, 'days')).from);
    const statTime = moment(weeks[0]).startOf('day').format('x');
    const endTime = moment(weeks[6]).endOf('day').format('x');

    this.refreshTable(statTime, endTime);
    this.getTimetable(selectedDays[0], weeks[0]);

    this.props.dispatch(cellActions.togglePayload({ selectedDays: weeks }));

    history.pushState(null, '', '/calendar/staff/'+JSON.parse(selectedStaff).staffId+'/'
      +moment(weeks[0]).format('DD-MM-YYYY')+'/'+moment(weeks[6]).format('DD-MM-YYYY'));
  }

  showNextWeek() {
    const { selectedDays } = this.props;
    const { selectedStaff } = this.state;
    const weeks = getWeekDays(getWeekRange(moment(selectedDays[0]).add(7, 'days')).from);
    const startTime = moment(weeks[0]).startOf('day').format('x');
    const endTime = moment(weeks[6]).endOf('day').format('x');
    this.refreshTable(startTime, endTime);
    this.getTimetable(selectedDays[0], weeks[6]);

    this.props.dispatch(cellActions.togglePayload({ selectedDays: weeks }));
    history.pushState(null, '', '/calendar/staff/'+JSON.parse(selectedStaff).staffId+'/'
      +moment(weeks[0]).format('DD-MM-YYYY')+'/'+moment(weeks[6]).format('DD-MM-YYYY'));
  }

  handleDayClick(day) {
    const { selectedDays } = this.props;
    const { typeSelected, selectedStaff } = this.state;
    const weeks = [getDayRange(moment(day).format()).from];
    const { startTime, endTime } = this.getSelectedTimeRange(weeks);

    this.getTimetable(selectedDays[0], day);
    this.refreshTable(startTime, endTime);

    this.props.dispatch(cellActions.togglePayload({ selectedDays: weeks }));

    let url;
    if (typeSelected===1) {
      url = 'workingstaff/0/';
    } else if (typeSelected===2) {
      url = 'allstaff/0/';
    } else if (typeSelected===3) {
      url = `staff/${JSON.parse(selectedStaff).staffId}/`;
    }
    history.pushState(null, '', `/calendar/${url}${moment(weeks[0]).startOf('day').format('DD-MM-YYYY')}`);
  }

  selectType(type) {
    const { staff } = this.props;
    const { typeSelected, selectedStaff, selectedDays: prevSelectedDays } = this.state;
    let url;
    const prevDay = prevSelectedDays[0];

    let types=typeSelected;
    let newState = {
      // workingStaff: {...workingStaff, timetable:[]},
    };

    let selectedDays;

    if (type==='day') {
      selectedDays = [getDayRange(moment(prevDay).format()).from];
      newState = {
        ...newState,
        type: 'day',
        staffFromUrl: JSON.parse(selectedStaff).staffId,
        typeSelected: typeSelected,
      };

      if (typeSelected===3) {
        url = `staff/${JSON.parse(selectedStaff).staffId}/${moment(weeks[0]).format('DD-MM-YYYY')}`;
      } else {
        url = `workingstaff/0/${moment().format('DD-MM-YYYY')}`;
      }

      this.getTimetable(prevDay, selectedDays[0]);
    } else {
      if (typeSelected===1 || typeSelected===2) {
        types=3;
      }
      const currentWorkingStaff = staff.timetable[0];
      selectedDays = getWeekDays(getWeekRange(moment(prevDay).format()).from);
      newState = {
        ...newState,
        typeSelected: types,
        staffFromUrl: JSON.parse((selectedStaff && selectedStaff.length!==0)
          ? selectedStaff
          : JSON.stringify(currentWorkingStaff)).staffId,
        selectedStaff: (selectedStaff && selectedStaff.length!==0)
          ? selectedStaff
          : JSON.stringify(currentWorkingStaff),
        type: 'week',
      };

      this.getTimetable(prevDay, selectedDays[0]);

      url = `staff/${JSON.parse((selectedStaff && selectedStaff.length)
        ? selectedStaff
        : JSON.stringify(currentWorkingStaff)).staffId}` +
        `/${moment(selectedDays[0]).format('DD-MM-YYYY')}/${moment(selectedDays[6]).format('DD-MM-YYYY')}`;
    }
    const { startTime, endTime } = this.getSelectedTimeRange(selectedDays, type);

    this.setState(newState, () => this.props.dispatch(cellActions.togglePayload({ selectedDays })));
    this.refreshTable(startTime, endTime);
    history.pushState(null, '', `/calendar/${url}`);
  }

  setWorkingStaff(
    staffEl = null, typeSelected = this.state.typeSelected, timetable = this.props.staff.timetable,
    selectedDays = this.props.selectedDays,
  ) {
    const { workingStaff, type, selectedStaff } = this.state;
    let newState = {};
    let url;

    if (typeSelected === 1) {
      const staffWorking = timetable.filter((item) => item.timetables && item.timetables.some((time) => {
        const checkingDay = moment(time.startTimeMillis, 'x').format('DD MM YYYY');
        const currentDay = moment(selectedDays[0]).format('DD MM YYYY');

        return checkingDay === currentDay;
      }));

      newState = {
        workingStaff: {
          ...workingStaff,
          timetable: staffWorking.length ? staffWorking : null,
        },
        timetableMessage: staffWorking.length ? '' : 'Нет работающих сотрудников',
        typeSelected: typeSelected,
        type: 'day',
      };
      url = `/calendar/workingstaff/0/${moment(selectedDays[0]).format('DD-MM-YYYY')}`;
    } else if (typeSelected === 2) {
      newState = {
        workingStaff: { ...workingStaff, timetable: timetable },
        timetableMessage: timetable.length ? '' : 'Нет работающих сотрудников',
        typeSelected: typeSelected,
        type: 'day',
      };
      url = `/calendar/allstaff/0/${moment(selectedDays[0]).format('DD-MM-YYYY')}`;
    } else {
      staffEl = staffEl ? staffEl : [JSON.parse(selectedStaff)];
      const staff=selectedStaff
        ? JSON.stringify(staffEl[0])
        : JSON.stringify(timetable.filter((staff)=>staff.staffId===JSON.parse(selectedStaff).staffId));

      if (type === 'week') {
        staffEl.push(staffEl[0]);
        staffEl.push(staffEl[0]);
        staffEl.push(staffEl[0]);
        staffEl.push(staffEl[0]);
        staffEl.push(staffEl[0]);
        staffEl.push(staffEl[0]);

        for (let i = 0; i < 6; i++) {
        }
      }

      newState = {
        workingStaff: { ...workingStaff, timetable: staffEl },
        timetableMessage: staffEl.length ? '' : 'Нет работающих сотрудников',
        selectedStaff: selectedStaff
          ? JSON.stringify(staffEl[0])
          : JSON.stringify(staffEl.filter((staff)=>staff.staffId===JSON.parse(selectedStaff).staffId)),
        typeSelected: typeSelected,
        staffFromUrl: JSON.parse(staff).staffId,
      };
      const urlPath = selectedDays.length===1
        ? moment(selectedDays[0]).format('DD-MM-YYYY')
        : moment(selectedDays[0]).format('DD-MM-YYYY')+'/'+
        moment(selectedDays[6]).format('DD-MM-YYYY');
      url = `/calendar/staff/${JSON.parse(staff).staffId}/${urlPath}`;
    }

    this.setState(newState,
      () => type==='week' && typeSelected !== 3 &&
        this.props.dispatch(cellActions.togglePayload(
          { selectedDays: [getDayRange(moment(selectedDays[0]).format()).from] },
        )));
    history.pushState(null, '', url);
  }

  updateClient(client) {
    this.props.dispatch(clientActions.updateClient(JSON.stringify(client)));
  };

  addClient(client) {
    this.props.dispatch(clientActions.addClient(JSON.stringify(client)));
  };

  getHours(idStaff, timeClicked) {
    const { appointments, reservedTimeFromProps } = this.props;
    const { workingStaff, type }=this.state;

    const hoursArray=[];
    const day=timeClicked;

    const numbers =[];

    for (let i = 0; i < 24*60; i = i + 15) {
      numbers.push(moment().startOf('day').add(i, 'minutes').format('x'));
    }

    numbers.map((time) =>
      hoursArray.push(moment(time, 'x').format('H:mm')),
    );
    const timetable = type === 'day' ? workingStaff.timetable : [workingStaff.timetable[0]];
    const dayPart = moment(day, 'x').format('DD/MM/YYYY')+' ';
    const subtractWeek = moment().subtract(1, 'week').format('x');

    const newStaff = appointments && appointments
      .find((item) => (item.staff && item.staff.staffId) === idStaff.staffId);
    const staffWithReservedTime = reservedTimeFromProps && reservedTimeFromProps
      .find((item) => (item.staff && item.staff.staffId) === idStaff.staffId);
    numbers.forEach((item)=> {
      const currentTime=parseInt(moment(dayPart+moment(item, 'x').format('HH:mm'), 'DD/MM/YYYY HH:mm').format('x'));
      const hoursPart = moment(item, 'x').format('HH:mm');
      const formattedDayPart = parseInt(moment(dayPart +
        moment(item, 'x').format('HH:mm'), 'DD/MM/YYYY HH:mm').format('x'));

      timetable.forEach((timing) =>
        timing.staffId === idStaff.staffId && timing.timetables.forEach((time) => {
          if (
            parseInt(moment(moment(time.startTimeMillis, 'x').format('DD/MM/YYYY') + ' ' +
              hoursPart, 'DD/MM/YYYY HH:mm').format('x')) === formattedDayPart
          ) {
            const isOnAnotherVisit = checkIsOnAnotherVisit(newStaff, currentTime);
            if (!isOnAnotherVisit) {
              const isOnAnotherReservedTime = checkIsOnAnotherReservedTime(staffWithReservedTime, currentTime);

              if (!isOnAnotherReservedTime) {
                if (currentTime >= time.startTimeMillis && currentTime <
                  time.endTimeMillis && currentTime >= subtractWeek
                ) {
                  hoursArray.splice(hoursArray.indexOf(moment(item, 'x').format('H:mm')), 1);
                }
              }
            }
          }
        }),
      );
    });

    return hoursArray;
  }
}

function mapStateToProps(store) {
  const {
    company,
    staff,
    client,
    services,
    authentication,
    calendar: {
      appointments,
      reservedTime,
      refreshAvailableTimes,
      scrollableAppointmentId,
      status,
      adding,
      isAppointmentUpdated,
      isLoading: isLoadingCalendar,
      isLoadingAppointments,
      isLoadingReservedTime,
    },
    cell: {
      selectedDays,
    },
  } = store;

  return {
    company,
    selectedDays,
    appointments,
    reservedTimeFromProps: reservedTime,
    staff: {
      ...staff,
      timetable: staff.timetable && staff.timetable.filter((item) => item.adminBooking),
    },
    clients: client,
    services,
    authentication,
    refreshAvailableTimes,
    scrollableAppointmentId,
    status,
    adding,
    isAppointmentUpdated,
    isLoadingCalendar,
    isLoadingAppointments,
    isLoadingReservedTime,
  };
}

export default connect(mapStateToProps)(Index);
