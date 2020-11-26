import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'react-day-picker/lib/style.css';
import DayPicker, { DateUtils } from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import moment from 'moment';

import { AddWorkTime } from '../_components/modals/AddWorkTime';
import { NewStaff } from '../_components/modals/NewStaff';
import { NewStaffByMail } from '../_components/modals';
import '../../public/css_admin/date.css';
import { DatePicker } from '../_components/DatePicker';
import DragDrop from '../_components/DragDrop';
import FeedbackStaff from '../_components/modals/FeedbackStaff';
import FeedStaff from './FeedStaff';
import StaffInfo from './StaffInfo';
import HolidayInfo from './HolidayInfo';

import { staffActions } from '../_actions';

import { getWeekRange } from '../_helpers/time';
import { access } from '../_helpers/access';

import '../../public/scss/staff.scss';
import {withTranslation} from "react-i18next";
import WorkTimeModal from '../_components/modals/WorkTimeModal';

function getWeekDays(weekStart) {
  const days = [weekStart];
  for (let i = 1; i < 7; i += 1) {
    days.push(
      moment(weekStart).utc().locale('ru')
        .add(i, 'days')
        .toDate(),
    );
  }
  return days;
}

class Index extends Component {
  constructor(props) {
    super(props);

    if (!access(9) && props.match.params.activeTab === 'permissions') {
      props.history.push('/denied');
    }

    if (!access(10)) {
      props.history.push('/denied');
    }

    if (props.match.params.activeTab &&
            props.match.params.activeTab !== 'permissions' &&
            props.match.params.activeTab !== 'workinghours' &&
            props.match.params.activeTab !== 'holidays' &&
            props.match.params.activeTab !== 'feedback' &&
            props.match.params.activeTab !== 'staff'
    ) {
      props.history.push('/nopage');
    }

    const companyTypeId = this.props.company.settings && this.props.company.settings.companyTypeId;
    const {t} = props;

    if (props.match.params.activeTab === 'permissions') {
      document.title = t('Доступы | Онлайн-запись');
    }
    if (props.match.params.activeTab === 'holidays') {
      document.title = t('Выходные дни | Онлайн-запись');
    }
    if (props.match.params.activeTab === 'staff') {
      document.title = (companyTypeId === 2 || companyTypeId === 3) ? t('Рабочие места | Онлайн-запись') : (companyTypeId === 4 ? t('Врачи | Онлайн-запись') : t('Сотрудники | Онлайн-запись'));
    }
    if (props.match.params.activeTab === 'feedback') {
      document.title = t('Отзывы | Онлайн-запись');
    }
    if (!props.match.params.activeTab || props.match.params.activeTab === 'workinghours') {
      document.title = t('Рабочие часы | Онлайн-запись');
    }


    this.state = {
      edit: false,
      staff_working: {},
      closedDates: {},
      timetable: {},
      hoverRange: undefined,
      opacity: false,
      selectedDays: getWeekDays(getWeekRange(moment().format()).from),
      emailNew: '',
      emailIsValid: false, from: null,
      to: null,
      enteredTo: null,
      activeTab: props.match.params.activeTab ? props.match.params.activeTab : 'workinghours',
      addWorkTime: false,
      newStaffByMail: false,
      newStaff: false,
      handleOpen: false,
      isOpenHeaderDropdown: false,
      workTimeModal: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.renderSwitch = this.renderSwitch.bind(this);
    this.updateStaff = this.updateStaff.bind(this);
    this.addStaff = this.addStaff.bind(this);
    this.handleClosedDate = this.handleClosedDate.bind(this);
    this.addClosedDate = this.addClosedDate.bind(this);
    this.deleteClosedDate = this.deleteClosedDate.bind(this);
    this.enumerateDaysBetweenDates = this.enumerateDaysBetweenDates.bind(this);
    this.addWorkingHours = this.addWorkingHours.bind(this);
    this.setStaff = this.setStaff.bind(this);
    this.deleteWorkingHours = this.deleteWorkingHours.bind(this);
    this.handleDayChange = this.handleDayChange.bind(this);
    this.handleDayEnter = this.handleDayEnter.bind(this);
    this.handleDayLeave = this.handleDayLeave.bind(this);
    this.handleWeekClick = this.handleWeekClick.bind(this);
    this.showCalendar = this.showCalendar.bind(this);
    this.showPrevWeek = this.showPrevWeek.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.showNextWeek = this.showNextWeek.bind(this);
    this.updateTimetable = this.updateTimetable.bind(this);
    this.deleteStaff = this.deleteStaff.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.addStaffEmail = this.addStaffEmail.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleDayMouseEnter = this.handleDayMouseEnter.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.setTab = this.setTab.bind(this);
    this.handleDrogEnd = this.handleDrogEnd.bind(this);
    this.onClose = this.onClose.bind(this);
    this.queryInitData = this.queryInitData.bind(this);
    this.handleOpenDropdownMenu = this.handleOpenDropdownMenu.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.setWorkTimeWrapperRef = this.setWorkTimeWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.closeDropdownMenu = this.closeDropdownMenu.bind(this);
    this.isLeapYear = this.isLeapYear.bind(this);
    this.calcDiff = this.calcDiff.bind(this);
    this.handleOpenHeaderDropdown = this.handleOpenHeaderDropdown.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);

    const { selectedDays } = this.state;
    if (this.props.authentication.loginChecked) {
      this.queryInitData();
    }
    this.setState({
      ...this.state,
      timetableFrom: moment(selectedDays[0]).startOf('day').format('x'),
      timetableTo: moment(selectedDays[6]).endOf('day').format('x'),
    });
    initializeJs();
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleOpenHeaderDropdown() {
    this.setState({ isOpenHeaderDropdown: !this.state.isOpenHeaderDropdown });
  }

  handleClickOutside(event) {
    if (this.state.activeTab === "workinghours") {

      if (this.workTimeWrapperRef && !this.workTimeWrapperRef.contains(event.target)) {
        this.closeDropdownMenu();
      }
    } else {
      if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
        this.closeDropdownMenu();
      }
    }



  }

  isLeapYear(year) {
    return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
  }

  calcDiff(date) {
    const diff = moment(date).diff(moment(), 'days');
    if (diff < 0) {
      return (this.isLeapYear(moment().year()) ? 366 : 365) + diff;
    } else return diff;
  }


  queryInitData() {
    const { selectedDays } = this.state;
    this.props.dispatch(staffActions.get());
    this.props.dispatch(staffActions.getFeedback(1));
    this.props.dispatch(staffActions.getAccess());
    this.props.dispatch(staffActions.getAccessList());
    this.props.dispatch(staffActions.getClosedDates());
    this.props.dispatch(staffActions.getTimetable(
      moment(selectedDays[0]).startOf('day').format('x'),
      moment(selectedDays[6]).endOf('day').format('x')),
    );
  }

  handleOpenDropdownMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ handleOpen: !this.state.handleOpen });
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  setWorkTimeWrapperRef(node) {
    this.workTimeWrapperRef = node;
  }

  closeDropdownMenu() {
    this.setState({ handleOpen: false });
  }

  componentWillReceiveProps(newProps) {
    if (this.props.authentication.loginChecked !== newProps.authentication.loginChecked) {
      this.queryInitData();
    }

    if (JSON.stringify(this.props.company) !== JSON.stringify(newProps.company)) {
      const companyTypeId = newProps.company.settings && newProps.company.settings.companyTypeId;
      if (newProps.match.params.activeTab === 'staff') {
        document.title = (companyTypeId === 2 || companyTypeId === 3)
          ? this.props.t('Рабочие места | Онлайн-запись')
          : (companyTypeId === 4 ? this.props.t('Врачи | Онлайн-запись') : this.props.t('Сотрудники | Онлайн-запись'));
      }
    }

    if (newProps.staff.addArrayWorkingHours &&
      (this.props.staff.addArrayWorkingHours !== newProps.staff.addArrayWorkingHours)) {
      this.updateTimetable();
    }

    if (this.props.staff.status !== newProps.staff.status) {
      this.setState({
        addWorkTime: newProps.staff.status && newProps.staff.status === 209 ? false : this.state.addWorkTime,
        workTimeModal: newProps.staff.status && newProps.staff.status === 209 ? false : this.state.workTimeModal,
      });
    }

    if (this.state.staff_working.staffId &&
      JSON.stringify(newProps.staff.staff) !== (JSON.stringify(this.props.staff.staff))
    ) {
      const staff_working = newProps.staff.staff.find((item) => item.staffId === this.state.staff_working.staffId);
      if (staff_working) {
        this.setState({ staff_working });
      }
    }
  }

  componentDidUpdate(nextProps, nextState, nextContext) {
    initializeJs();
  }

  setTab(tab) {
    this.setState({
      activeTab: tab,
    });

    const {t} = this.props;

    const companyTypeId = this.props.company.settings && this.props.company.settings.companyTypeId;
    if (tab === 'permissions') {
      document.title = t('Доступы | Онлайн-запись');
    }
    if (tab === 'holidays') {
      document.title = t('Выходные дни | Онлайн-запись');
    }
    if (tab === 'staff') {
      document.title = (companyTypeId === 2 || companyTypeId === 3)
        ? t('Рабочие места | Онлайн-запись')
        : (companyTypeId === 4 ? t('Врачи | Онлайн-запись') : t('Сотрудники | Онлайн-запись'));
    }
    if (tab === 'workinghours') {
      document.title = t('Рабочие часы | Онлайн-запись');
    }

    history.pushState(null, '', '/staff/' + tab);
  }

  handlePageClick(data) {
    const { selected } = data;
    const currentPage = selected + 1;
    this.props.dispatch(staffActions.getFeedback(currentPage));
  };

  handleDrogEnd(dragDropItems) {
    const updatedSortOrderStaffs = [];
    dragDropItems.forEach((item, i) => {
      updatedSortOrderStaffs.push({
        staffId: item.staffId,
        sortOrder: i + 1,
      });
    });
    this.props.dispatch(staffActions.update(JSON.stringify(updatedSortOrderStaffs)));
  }


  getItemListName(itemList) {
    const {t} = this.props;

    const companyTypeId = this.props.company.settings && this.props.company.settings.companyTypeId;
    switch (itemList.permissionCode) {
      case 2:
        return (companyTypeId === 2 || companyTypeId === 3)
          ? t('Календарь других рабочих мест')
          : (companyTypeId === 4 ? t('Календарь других врачей') : t('Календарь других сотрудников'));
      case 3:
        return (companyTypeId === 4) ? t("Пациенты"): t("Клиенты");
      case 10:
        return (companyTypeId === 2 || companyTypeId === 3) ? t('Рабочие места') : (companyTypeId === 4 ? t('Врачи') : t('Сотрудники'));
      default:
        return t(itemList.name);
    }
  }

  deleteStaff(id) {
    const { dispatch } = this.props;

    dispatch(staffActions.deleteStaff(id));
  }

  render() {
    const { staff, company, t } = this.props;
    const {
      staff_working, edit, closedDates, timetableFrom, timetableTo, currentStaff,
      date, editing_object, editWorkingHours, selectedDays, activeTab, addWorkTime, newStaffByMail, newStaff,
    } = this.state;

    const companyTypeId = company.settings && company.settings.companyTypeId;

    const { from, to, enteredTo } = this.state;
    const modifiersClosed = { start: from, end: enteredTo };
    const disabledDays = { before: this.state.from };
    const selectedDaysClosed = [from, { from, to: enteredTo }];

    const dragDropItems = [];
    const staffGroups = [];

    staff.staff && staff.staff.forEach((staff_user, i) => {
      const staffGroupIndex = staff.costaff && staff.costaff
        .findIndex((staffGroup) => staffGroup.some((item) => item.staffId === staff_user.staffId));

      const isGroup = staff.costaff && staff.costaff[staffGroupIndex] && staff.costaff[staffGroupIndex].length > 1;
      let groupIndex;
      if (isGroup) {
        const localIndex = staffGroups
          .findIndex((staffGroup) => staffGroup.some((staffInGroup) => staffInGroup.staffId === staff_user.staffId));

        if (localIndex === -1) {
          staffGroups.push(staff.costaff[staffGroupIndex]);
          groupIndex = staffGroups.length - 1;
        } else {
          groupIndex = localIndex;
        }
      }
      dragDropItems.push({
        staffId: staff_user.staffId,
        id: `staff-user-${i}`,
        getContent: (dragHandleProps) => (
          <StaffInfo
            dragHandleProps={dragHandleProps}
            i={i}
            isGroup={isGroup}
            staff_user={staff_user}
            groupIndex={groupIndex}
            handleClick={this.handleClick}
            deleteStaff={this.deleteStaff}
            renderSwitch={this.renderSwitch}
          />
        ),
      });
    });

    return (
      <div className="staff" ref={(node) => {
        this.node = node;
      }}>
        {staff.isLoadingStaffInit &&
                <div className="loader loader-email"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/>
                </div>}
        <div className="retreats content-inner page_staff">
          <div className="header-tabs-container">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <a className={'nav-link' + (activeTab === 'workinghours' ? ' active show' : '')}
                  data-toggle="tab" href="#tab1" onClick={() => {
                    this.updateTimetable();
                    this.setTab('workinghours');
                  }}>{t("Рабочие часы")}</a>
              </li>
              <li className="nav-item">
                <a className={'nav-link' + (activeTab === 'staff' ? ' active show' : '')}
                  data-toggle="tab" href="#tab2"
                  onClick={() => this.setTab('staff')}
                >
                  {(companyTypeId === 2 || companyTypeId === 3) ? t('Рабочие места') : (companyTypeId === 4 ? t('Врачи') : t('Сотрудники'))}
                </a>
              </li>
              <li className="nav-item">
                <a className={'nav-link' + (activeTab === 'holidays' ? ' active show' : '')}
                  data-toggle="tab" href="#tab3" onClick={() => this.setTab('holidays')}>{t("Выходные дни")}</a>
              </li>
              {access(-1) &&
                            <li className="nav-item">
                              <a className={'nav-link' + (activeTab === 'permissions' ? ' active show' : '')}
                                data-toggle="tab" href="#tab4" onClick={() => this.setTab('permissions')}>{t("Доступ")}</a>
                            </li>
              }
              <li className="nav-item">
                <a className={'nav-link' + (activeTab === 'feedback' ? ' active show' : '')}
                  data-toggle="tab" href="#tab5" onClick={() => this.setTab('feedback')}>{t("Отзывы")}</a>
              </li>
            </ul>

            {/*{activeTab === 'workinghours' &&*/}
            {/*<div ref={this.setWorkTimeWrapperRef}>*/}
            {/*  <a className={'add' + (this.state.handleOpen ? ' rotate' : '')} href="#"*/}
            {/*     onClick={this.handleOpenDropdownMenu}/>*/}
            {/*  <div className={'buttons-container' + (this.state.handleOpen ? '' : ' hide')}>*/}
            {/*    <div className="buttons">*/}
            {/*      <button type="button" onClick={() => {*/}
            {/*        this.setState({workTimeModal: true})*/}
            {/*      }} className="button new-holiday">*/}
            {/*        {t("Добавить часы работы")}*/}
            {/*      </button>*/}
            {/*    </div>*/}
            {/*    <div className="arrow"></div>*/}
            {/*  </div>*/}
            {/*</div>}*/}



            {activeTab === 'workinghours' &&
                        <DatePicker
                          type={'week'}
                          // selectedDay={selectedDay}
                          selectedDays={selectedDays}
                          showPrevWeek={this.showPrevWeek}
                          showNextWeek={this.showNextWeek}
                          handleDayChange={this.handleDayChange}
                          handleDayClick={this.handleDayClick}
                          handleWeekClick={this.handleWeekClick}
                          language={this.props.i18n.language}
                        />}
          </div>

          <div className="mobile-header-dropdown-container">
            <p
              onClick={this.handleOpenHeaderDropdown}
              className={'mobile-selected-tab' + (this.state.isOpenHeaderDropdown ? ' opened' : '')}
            >{(activeTab === 'workinghours' ? t('Рабочие часы')
                : (activeTab === 'staff' ? (companyTypeId === 2 || companyTypeId === 3) ? t('Рабочие места') : (companyTypeId === 4 ? t('Врачи') : t('Сотрудники'))
                  : (activeTab === 'holidays' ? t('Выходные дни')
                    : (activeTab === 'permissions' ? t('Доступ')
                      : (activeTab === 'feedback' ? t('Отзывы') : '')))))}</p>

            {this.state.isOpenHeaderDropdown &&
              <ul className="nav nav-tabs-mobile-dropdown">
                <li className="nav-item">
                  <a className={'nav-link' + (activeTab === 'workinghours' ? ' active show' : '')}
                    data-toggle="tab" href="#tab1" onClick={() => {
                      this.updateTimetable();
                      this.setTab('workinghours');
                      this.handleOpenHeaderDropdown();
                    }}>{t("Рабочие часы")}</a>
                </li>
                <li className="nav-item">
                  <a className={'nav-link' + (activeTab === 'staff' ? ' active show' : '')}
                    data-toggle="tab" href="#tab2"
                    onClick={() => {
                      this.setTab('staff');
                      this.handleOpenHeaderDropdown();
                    }}>{(companyTypeId === 2 || companyTypeId === 3) ? t('Рабочие места') : (companyTypeId === 4 ? t('Врачи') : t('Сотрудники'))}</a>
                </li>
                <li className="nav-item">
                  <a className={'nav-link' + (activeTab === 'holidays' ? ' active show' : '')}
                    data-toggle="tab" href="#tab3" onClick={() => {
                      this.setTab('holidays');
                      this.handleOpenHeaderDropdown();
                    }}>{t("Выходные дни")}</a>
                </li>
                {access(-1) &&
                  <li className="nav-item">
                    <a className={'nav-link' + (activeTab === 'permissions' ? ' active show' : '')}
                      data-toggle="tab" href="#tab4" onClick={() => {
                        this.setTab('permissions');
                        this.handleOpenHeaderDropdown();
                      }}>{t("Доступ")}</a>
                  </li>
                }
                <li className="nav-item">
                  <a className={'nav-link' + (activeTab === 'feedback' ? ' active show' : '')}
                    data-toggle="tab" href="#tab5" onClick={() => {
                      this.setTab('feedback');
                      this.handleOpenHeaderDropdown();
                    }}>{t("Отзывы")}</a>
                </li>
              </ul>}
          </div>

          {activeTab === 'workinghours' &&
            <div className="mobile-datePicker">
              <DatePicker
                type={'week'}
                // selectedDay={selectedDay}
                selectedDays={selectedDays}
                showPrevWeek={this.showPrevWeek}
                showNextWeek={this.showNextWeek}
                handleDayChange={this.handleDayChange}
                handleDayClick={this.handleDayClick}
                handleWeekClick={this.handleWeekClick}
                language={this.props.i18n.language}
              />
            </div>
          }
        </div>
        <div className="retreats">
          <div style={{ overflow: 'auto' }} className="tab-content">
            <div className={'tab-pane' + (activeTab === 'workinghours' ? ' active' : '')} id="tab1">
              <div style={{ height: "100%", overflow: 'auto', position: 'relative', zIndex: 0 }}>
                <div style={{ overflowX: 'hidden', display: 'inline-block' }}
                  className="content-tab-date min-width-desktop">
                  <div style={{ position: 'sticky', top: 0, zIndex: 5, width: '100%' }}
                    className="tab-content-inner">
                    <div className="tab-content-list">
                      <div>{companyTypeId === 4 ? t("Врачи") : t("Сотрудники")}</div>
                      {
                        timetableFrom && this.enumerateDaysBetweenDates(timetableFrom, timetableTo)
                          .map((item, weekKey) =>
                            <div key={weekKey}>
                              <p>
                                <span className="dates-full-width text-capitalize">
                                  {moment(item, 'x').format('dd')}, {moment(item, 'x').format('DD MMMM')}
                                </span>
                              </p>
                            </div>,
                          )
                      }
                    </div>
                  </div>
                  <div className="tab-content-inner">
                    {staff.timetable && staff.timetable.map((time, keyTime) => {
                      const activeStaff = staff && staff.staff && staff.staff.find((item) =>
                        ((item.staffId) === (time.staffId)));
                      return (
                        <div className="tab-content-list" key={keyTime}>
                          <div className="staff-time-schedule"
                            onClick={() => this.handleClick(time.staffId, false)}>
                            <img className="rounded-circle"
                              src={(activeStaff && activeStaff.imageBase64)
                                ? 'data:image/png;base64,' + activeStaff.imageBase64
                                : `${process.env.CONTEXT}public/img/avatar.svg`
                              }
                              alt=""/>
                            <p>{time.firstName}&nbsp;{time.lastName ? time.lastName : ''}</p>
                          </div>
                          {
                            time.timetables && timetableFrom &&
                            this.enumerateDaysBetweenDates(timetableFrom, timetableTo).map((day, dayKey) => {
                              const times = time.timetables.filter((timetableItem) =>
                                (moment(timetableItem.startTimeMillis, 'x') >=
                                  moment(day, 'x').startOf('day').format('x') &&
                                    moment(timetableItem.endTimeMillis, 'x') <=
                                    moment(day, 'x').endOf('day').format('x')) ||
                                (timetableItem.repeat === 'WEEKLY' &&
                                  moment(timetableItem.startTimeMillis, 'x').format('dd') ===
                                  moment(day, 'x').format('dd')
                                ),
                              );

                              times.sort((a, b) => {
                                if (a.startTimeMillis > b.startTimeMillis) {
                                  return 1;
                                }
                                if (a.startTimeMillis < b.startTimeMillis) {
                                  return -1;
                                }
                                return 0;
                              });


                              return (times.length === 0 ?
                                <div className="add-work-time-hover"
                                  key={dayKey} onClick={() => this.setState({
                                    ...this.state,
                                    currentStaff: time,
                                    date: moment(day, 'x').format('DD/MM/YYYY'),
                                    editWorkingHours: false,
                                    editing_object: null,
                                    workTimeModal: true,
                                  })
                                  }/> :
                                <div className="dates-container" key={dayKey}
                                  onClick={() => this.setState({
                                    ...this.state,
                                    currentStaff: time,
                                    date: moment(day, 'x').format('DD/MM/YYYY'),
                                    editWorkingHours: true,
                                    editing_object: times,
                                    workTimeModal: true,
                                  })}>
                                  <a>
                                    {times.map((time, i) =>
                                      <span key={`staff-page_dates-container-item-${i}`}>
                                        {
                                          moment(time.startTimeMillis, 'x').format('HH:mm')
                                        }-{moment(time.endTimeMillis, 'x').format('HH:mm')}
                                      </span>,
                                    )}
                                  </a>
                                </div>
                              );
                            },
                            )
                          }
                        </div>
                      );
                    },
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={'tab-pane content tabs-container staff-list-tab' + (activeTab === 'staff' ? ' active' : '')}
              id="tab2"
            >
              <div className="tab-content-list header-content-list">
                <div className="tab-content-header-item client-name"><p>{companyTypeId === 4 ? t("Врачи") : t("Сотрудники")}</p></div>
                <div className="tab-content-header-item">{t("Мобильный телефон")}</div>
                <div className="tab-content-header-item">{t("Email адрес")}</div>
                <div className="tab-content-header-item">{t("Категория доступа")}</div>
                <div className="tab-content-header-item delete">{t("Функции")}</div>
              </div>
              <div style={{ maxHeight: 'calc(100% - 120px)' }} className="h-100 content tabs-container">

                <DragDrop
                  dragDropItems={dragDropItems}
                  handleDrogEnd={this.handleDrogEnd}
                />
              </div>
            </div>
            <div className={'tab-pane' + (activeTab === 'holidays' ? ' active' : '')} id="tab3">
              <div className="holiday-tab h-100">
                <div className="addHoliday-wrapper">
                  <div className="add-holiday modal-content">
                    <div className="modal-header">
                      <p className="modal-title">{t("Настройка выходных дней")}</p>
                      <button className="close close-modal-add-holiday-js"></button>
                    </div>

                    <div className="modal-body">
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <p>{t("Начало/Конец")}</p>
                          <div className="button-calendar button-calendar-inline">
                            <input type="button" data-range="true"
                              value={
                                (from && from !== 0 ? moment(from).format('DD.MM.YYYY') : '') +
                                (to ? ' - ' + moment(to).format('DD.MM.YYYY') : '')
                              }
                              data-multiple-dates-separator=" - " name="date"
                              ref={(input) => this.startClosedDate = input}/>
                          </div>
                          <DayPicker
                            className="SelectedWeekExample"
                            fromMonth={from}
                            selectedDays={selectedDaysClosed}
                            disabledDays={[disabledDays, { before: moment().utc().toDate() }]}
                            modifiers={modifiersClosed}
                            onDayClick={this.handleDayClick}
                            onDayMouseEnter={this.handleDayMouseEnter}
                            localeUtils={MomentLocaleUtils}
                            locale={this.props.i18n.language}
                          />
                        </div>

                        <div className="description col-sm-6">
                          <p>{t("Описание")}</p>
                          <textarea
                            className="form-control" rows="3" name="description"
                            value={closedDates.description}
                            placeholder={t("Например дополнительный выходной в честь дня рождения организации")}
                            onChange={this.handleClosedDate}
                          />
                        </div>
                      </div>

                      <div className="float-right mt-3">
                        <div className="buttons">
                          <button
                            className={((!from || !closedDates.description) ? 'disabledField' : 'close-holiday')}
                            type="button"
                            onClick={from && closedDates.description && this.addClosedDate}
                            data-dismiss="modal"
                          >{t("Сохранить")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
                {
                  staff.closedDates && staff.closedDates
                    .sort((a, b) => this.calcDiff(a.startDateMillis) - this.calcDiff(b.startDateMillis))
                    .map((item, key) =>
                      <HolidayInfo
                        item={item}
                        key={key}
                        deleteClosedDate={this.deleteClosedDate}
                      />,
                    )
                }
              </div>
              <div ref={this.setWrapperRef}>
                <a className={'add' + (this.state.handleOpen ? ' rotate' : '')} href="#"
                  onClick={this.handleOpenDropdownMenu}/>
                <div className={'buttons-container' + (this.state.handleOpen ? '' : ' hide')}>
                  <div className="buttons">
                    <button type="button" onClick={this.handleOpenDropdownMenu} className="button new-holiday">
                      {t("Новый выходной")}
                    </button>
                  </div>
                  <div className="arrow"></div>
                </div>
              </div>
            </div>

            {access(-1) && !staff.error &&
              <div className={'tab-pane access-tab' + (activeTab === 'permissions' ? ' active' : '')}
                id="tab4">
                <div className="tab-content-list header-content-list">
                  <div className="tab-content-header-item"><p>{t("Категория")}</p></div>
                  <div className="tab-content-header-item">{t("Низкий доступ")}</div>
                  <div className="tab-content-header-item">{t("Средний доступ")}</div>
                  <div className="tab-content-header-item">{t("Администратор")}</div>
                  <div className="tab-content-header-item">{t("Владелец")}</div>
                </div>
                <div className="access">

                  {
                    staff.accessList && staff.accessList.map((itemList, index) => {
                      return (<div className="tab-content-list" key={itemList.permissionCode}>
                        <div>
                          {this.getItemListName(itemList)}
                        </div>
                        {staff.access && staff.access.map((item) => {
                          const checkedPermission = item.permissions.find((element) => {
                            return element.permissionCode === itemList.permissionCode;
                          },
                          );

                          return (
                            <div key={item.roleCode}>
                              <div className="check-box">
                                <label>
                                  <input
                                    className="form-check-input"
                                    checked={checkedPermission !== undefined}
                                    disabled={item.roleCode === 4 || index === 0}
                                    type="checkbox"
                                    onChange={() => this.toggleChange(item.roleCode, itemList.permissionCode)}/>
                                  <span className="check-box-circle" />
                                </label>
                              </div>
                            </div>
                          );
                        },
                        )}
                      </div>
                      );
                    },
                    )
                  }
                </div>
              </div>
            }

            <div className={'tab-pane' + (activeTab === 'feedback' ? ' active' : '')} id="tab5">
              <div className="holiday-tab">
                {staff.feedback && staff.feedback
                  .sort((a, b) => (b.averageStaffRating || 0) - (a.averageStaffRating || 0))
                  .map((feedbackStaff, i) => {
                    const activeStaff = staff.staff && staff.staff
                      .find((item) => item.staffId === feedbackStaff.staffId);

                    return (
                      <FeedStaff
                        key={`staff-page_holiday-tab-item-${i}`}
                        staff={this.props.staff}
                        activeStaff={activeStaff}
                        feedbackStaff={feedbackStaff}
                      />
                    );
                  },
                  )
                }
              </div>
            </div>
            {staff.isLoadingStaff &&
              <div className="loader">
                <img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/>
              </div>
            }
            {staff.error &&
              <div className="errorStaff">
                <h2 style={{ textAlign: 'center', marginTop: '50px' }}>{t("Извините, что-то пошло не так")}</h2>
              </div>
            }
          </div>
        </div>

        <FeedbackStaff/>
        {activeTab === 'staff' &&
          <div ref={this.setWrapperRef}>
            <a className={'add' + (this.state.handleOpen ? ' rotate' : '')} href="#"
              onClick={this.handleOpenDropdownMenu}/>
            {activeTab === 'staff' &&
              <div className={'buttons-container' + (this.state.handleOpen ? '' : ' hide')}>
                <div className="buttons">
                  {/*{!(companyTypeId === 2 || companyTypeId === 3) &&*/}
                  {/*    <button className="button new-staff" type="button"*/}
                  {/*      onClick={() => this.handleClick(null, true)}*/}
                  {/*    >*/}
                  {/*      {t("Пригласить по Email")}*/}
                  {/*    </button>*/}
                  {/*}*/}
                  <button className="button new-staff" type="button"
                    onClick={() => this.handleClick(null, false)}
                  >
                    {(companyTypeId === 2 || companyTypeId === 3) ? t('Новое рабочее место') : (companyTypeId === 4 ? t('Новый врач') : t('Новый сотрудник'))}
                  </button>

                </div>
                <div className="arrow"/>
              </div>
            }
          </div>
        }


        {addWorkTime &&
          <AddWorkTime
            addWorkingHours={this.addWorkingHours}
            deleteWorkingHours={this.deleteWorkingHours}
            currentStaff={currentStaff}
            date={date}
            editWorkingHours={editWorkingHours}
            editing_object={editing_object}
            onClose={this.onClose}
            updateTimetable={this.updateTimetable}
          />
        }

        {this.state.workTimeModal &&
        <WorkTimeModal
          t={t}
          workTimeModalMessage={this.state.workTimeModalMessage}
          onClose={() => this.setState({workTimeModal: false})}
          activeStaffId={currentStaff.staffId}
          date={date}
          deleteWorkingHours={this.deleteWorkingHours}
          editWorkingHours={editWorkingHours}
          editing_object={editing_object}
          edit={editing_object && editing_object.length > 0}
        />
        }
        {newStaff &&
          <NewStaff
            staff={staff}
            staff_working={staff_working}
            edit={edit}
            updateStaff={this.updateStaff}
            addStaff={this.addStaff}
            onClose={this.onClose}
          />
        }
        {newStaffByMail &&
          <NewStaffByMail
            addStaffEmail={this.addStaffEmail}
            onClose={this.onClose}
          />
        }
      </div>
    );
  }

  handleChangeEmail(e) {
    const { value } = e.target;

    this.setState({ ...this.state, emailNew: value });
  }

  setStaff(staff) {
    this.setState({ ...this.state, currentStaff: staff.staff });
  }

  enumerateDaysBetweenDates(startDate, endDate) {
    const dates = [];
    const days = 7;

    for (let i = 1; i <= days; i++) {
      if (i === 1) {
        dates.push(moment(parseInt(startDate)).format('x'));
      } else {
        dates.push(moment(parseInt(dates[i - 2])).add(1, 'days').format('x'));
      }
    }

    return dates;
  };

  handleSubmit(e) {
    const { firstName, lastName, email, phone, roleId, workStartMilis, workEndMilis, onlineBooking } = this.props.staff;
    const { dispatch } = this.props;

    e.preventDefault();

    this.setState({ submitted: true });

    if (firstName || lastName || email || phone) {
      const params = JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
        roleId,
        workStartMilis,
        workEndMilis,
        onlineBooking,
      });
      dispatch(staffActions.add(params));
    }
  }

  addStaffEmail(emailNew) {
    const { dispatch } = this.props;

    dispatch(staffActions.addUSerByEmail(JSON.stringify({ 'email': emailNew })));
  }

  handleClick(id, email, staff = this.props.staff) {
    if (id != null) {
      const staff_working = staff.staff.find((item) => {
        return id === item.staffId;
      });

      this.setState({ ...this.state, edit: true, staff_working: staff_working, newStaff: true });
    } else {
      if (email) {
        this.setState({ ...this.state, edit: false, staff_working: {}, newStaffByMail: true });
      } else {
        this.setState({ ...this.state, edit: false, staff_working: {}, newStaff: true });
      }
    }
  }

  handleClosedDate(e) {
    const { name, value } = e.target;
    const { closedDates } = this.state;


    this.setState({ closedDates: { ...closedDates, [name]: value } });
  }

  renderSwitch(param) {
    const {t} = this.props;

    switch (param) {
      case 4:
        return t('Владелец');
      case 3:
        return t('Админ');
      case 2:
        return t('Средний доступ');
      default:
        return t('Низкий доступ');
    }
  };

  updateStaff(staff) {
    const { dispatch } = this.props;

    const body = JSON.parse(JSON.stringify(staff));
    body.phone = body.phone && (body.phone.startsWith('+') ? body.phone : `+${body.phone}`);

    dispatch(staffActions.update(JSON.stringify([body]), staff.staffId));
  };

  addStaff(staff) {
    const { dispatch } = this.props;

    const body = JSON.parse(JSON.stringify(staff));
    body.phone = body.phone && (body.phone.startsWith('+') ? body.phone : `+${body.phone}`);
    dispatch(staffActions.add(JSON.stringify(body)));
  };

  addWorkingHours(timing, id, edit) {
    const { dispatch } = this.props;
    const { editWorkingHours } = this.state;


    !editWorkingHours ?
      dispatch(staffActions.addWorkingHours(JSON.stringify(timing), id))
      : dispatch(staffActions.updateWorkingHours(JSON.stringify(timing), id));
  };

  deleteWorkingHours(id, startDay, endDay, staffTimetableId) {
    const { dispatch } = this.props;
    const { timetableFrom, timetableTo } = this.state;

    dispatch(staffActions.deleteWorkingHours(id, startDay, endDay, timetableFrom, timetableTo, staffTimetableId));
  }

  addClosedDate() {
    const { dispatch } = this.props;
    const { closedDates, from, to } = this.state;

    closedDates.startDateMillis = moment(from).format('x');
    closedDates.endDateMillis = moment(to === null ? moment(from) : to).format('x');

    dispatch(staffActions.addClosedDates(JSON.stringify(closedDates)));

    this.setState({
      ...this.state,
      from: null,
      to: null,
      enteredTo: null,
      closedDates: {
        description: '',
      },
    });
  };

  toggleChange(roleCode, permissionCode) {
    const { staff } = this.props;
    const { dispatch } = this.props;

    const access = staff.access;
    const keyCurrent = [];

    access.find((item, key) => {
      if (item.roleCode === roleCode) {
        item.permissions.find((item2, key2) => {
          if (item2.permissionCode === permissionCode) {
            keyCurrent[0] = key2;
            keyCurrent[1] = 'delete';
          }
        });

        if (keyCurrent[1] !== 'delete') {
          access[key].permissions.push({ 'permissionCode': permissionCode });
        } else {
          access[key].permissions.splice(keyCurrent[0], 1);
        }
      }
    });

    dispatch(staffActions.updateAccess(JSON.stringify(access)));
  }

  deleteClosedDate(id) {
    const { dispatch } = this.props;

    dispatch(staffActions.deleteClosedDates(id));
  }

  updateTimetable() {
    const { selectedDays } = this.state;
    this.props.dispatch(staffActions.getTimetable(
      moment(selectedDays[0]).startOf('day').format('x'),
      moment(selectedDays[6]).endOf('day').format('x'),
    ));
  }

  handleDayChange(date) {
    this.showCalendar();
    const weeks = getWeekDays(getWeekRange(date).from);
    this.setState({
      selectedDays: weeks,
      timetableFrom: moment(weeks[0]).startOf('day').format('x'),
      timetableTo: moment(weeks[6]).endOf('day').format('x'),
    });
    this.props.dispatch(staffActions.getTimetable(
      moment(weeks[0]).startOf('day').format('x'),
      moment(weeks[6]).endOf('day').format('x'),
    ));
  };

  handleDayEnter(date) {
    const hoverRange = getWeekRange(date);
    this.setState({
      hoverRange,
    });
  };

  handleDayLeave() {
    this.setState({
      hoverRange: undefined,
    });
  };

  showCalendar() {
    if (!this.state.opacity) {
      // attach/remove event handler
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }

    this.setState((prevState) => ({
      opacity: !prevState.opacity,
    }));
  }

  handleOutsideClick(e) {
    this.showCalendar();
  }

  handleWeekClick(weekNumber, days, e) {
    this.setState({
      selectedDays: days,
      timetableFrom: moment(days[0]).startOf('day').format('x'),
      timetableTo: moment(days[6]).endOf('day').format('x'),
    });
    this.props.dispatch(staffActions.getTimetable(
      moment(days[0]).startOf('day').format('x'),
      moment(days[6]).endOf('day').format('x'),
    ));
  };

  showPrevWeek() {
    const { selectedDays } = this.state;

    this.showCalendar();
    const weeks = getWeekDays(getWeekRange(moment(selectedDays[0]).subtract(7, 'days')).from);
    this.setState({
      selectedDays: weeks,
      timetableFrom: moment(weeks[0]).startOf('day').format('x'),
      timetableTo: moment(weeks[6]).endOf('day').format('x'),
    });
    this.props.dispatch(staffActions.getTimetable(
      moment(weeks[0]).startOf('day').format('x'),
      moment(weeks[6]).endOf('day').format('x'),
    ));
  }

  showNextWeek() {
    const { selectedDays } = this.state;

    this.showCalendar();
    const weeks = getWeekDays(getWeekRange(moment(selectedDays[0]).add(7, 'days')).from);
    this.setState({
      selectedDays: weeks,
      timetableFrom: moment(weeks[0]).startOf('day').format('x'),
      timetableTo: moment(weeks[6]).endOf('day').format('x'),
    });
    this.props.dispatch(staffActions.getTimetable(
      moment(weeks[0]).startOf('day').format('x'),
      moment(weeks[6]).endOf('day').format('x'),
    ));
  }

  isSelectingFirstDay(from, to, day) {
    const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from);
    const isRangeSelected = from && to;
    return !from || isBeforeFirstDay || isRangeSelected;
  }

  handleDayClick(day) {
    const { from, to } = this.state;
    if (from && to && day >= from && day <= to) {
      this.handleResetClick();
      return;
    }
    if (this.isSelectingFirstDay(from, to, day)) {
      this.setState({
        ...this.state,
        from: day,
        to: null,
        enteredTo: day,
      });
    } else {
      this.setState({
        ...this.state,
        to: day,
        enteredTo: day,
      });
    }
  }

  handleDayMouseEnter(day) {
    const { from, to } = this.state;
    if (!this.isSelectingFirstDay(from, to, day)) {
      this.setState({
        enteredTo: day,
      });
    }
  }

  handleResetClick() {
    this.setState({
      ...this.state, from: null,
      to: null,
      enteredTo: null,
    });
  }

  onClose() {
    this.setState({
      ...this.state,
      addWorkTime: false,
      newStaffByMail: false,
      newStaff: false,
      createdService: false,
    });
  }
}

function mapStateToProps(store) {
  const { staff, company, timetable, authentication } = store;

  return {
    staff, company, timetable, authentication,
  };
}

export default connect(mapStateToProps)(withTranslation("common")(Index));
