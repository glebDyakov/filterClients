import React, {Component} from 'react';
import { connect } from 'react-redux';

import {staffActions} from '../_actions';
import {AddWorkTime} from "../_components/modals/AddWorkTime";
import {NewStaff} from "../_components/modals/NewStaff";

import '../../public/scss/staff.scss'

import moment from "moment";
import {NewStaffByMail} from "../_components/modals";

import 'react-day-picker/lib/style.css';
import DayPicker, { DateUtils } from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import '../../public/css_admin/date.css'
import {DatePicker} from '../_components/DatePicker'
import {getWeekRange} from '../_helpers/time'
import {access} from "../_helpers/access";
import DragDrop from "../_components/DragDrop";

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

class Index extends Component {
    constructor(props) {
        super(props);

        if(!access(9) && props.match.params.activeTab==='permissions'){
            props.history.push('/denied')
        }

        if(!access(10)){
            props.history.push('/denied')
        }

        if(props.match.params.activeTab &&
            props.match.params.activeTab!=='permissions' &&
            props.match.params.activeTab!=='workinghours' &&
            props.match.params.activeTab!=='holidays' &&
            props.match.params.activeTab!=='staff'
        ){
            props.history.push('/nopage')
        }

        if(props.match.params.activeTab==='permissions') {document.title = "Доступы | Онлайн-запись";}
        if(props.match.params.activeTab==='holidays'){document.title = "Выходные дни | Онлайн-запись"}
        if(props.match.params.activeTab==='staff'){document.title = "Сотрудники | Онлайн-запись"}
        if(!props.match.params.activeTab || props.match.params.activeTab==='workinghours'){document.title = "Рабочие часы | Онлайн-запись"}



        this.state = {
            staff: props.staff,
            edit: false,
            staff_working: {},
            closedDates: {},
            timetable: {},
            hoverRange: undefined,
            opacity: false,
            selectedDays: getWeekDays(getWeekRange(moment().format()).from),
            emailNew:'',
            emailIsValid: false,            from: null,
            to: null,
            enteredTo: null,
            activeTab: props.match.params.activeTab?props.match.params.activeTab:'workinghours',
            addWorkTime: false,
            newStaffByMail: false,
            newStaff: false,
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
        this.isValidEmailAddress = this.isValidEmailAddress.bind(this);
        this.addStaffEmail = this.addStaffEmail.bind(this);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.handleDayMouseEnter = this.handleDayMouseEnter.bind(this);
        this.handleResetClick = this.handleResetClick.bind(this);
        this.setTab = this.setTab.bind(this);
        this.handleDrogEnd = this.handleDrogEnd.bind(this);
        this.onClose = this.onClose.bind(this);
        this.queryInitData = this.queryInitData.bind(this);
    }

    componentDidMount() {
        const {selectedDays}=this.state;
        if (this.props.authentication.loginChecked) {
            this.queryInitData()
        }
        this.setState({...this.state,
            timetableFrom: moment(selectedDays[0]).startOf('day').format('x'),
            timetableTo:moment(selectedDays[6]).endOf('day').format('x')
        })
        initializeJs();
    }

    queryInitData() {
        const {selectedDays}=this.state;
        this.props.dispatch(staffActions.get());
        this.props.dispatch(staffActions.getAccess());
        this.props.dispatch(staffActions.getAccessList());
        this.props.dispatch(staffActions.getClosedDates());
        this.props.dispatch(staffActions.getTimetable(moment(selectedDays[0]).startOf('day').format('x'), moment(selectedDays[6]).endOf('day').format('x')));
    }

    componentWillReceiveProps(newProps) {
        if (this.props.authentication.loginChecked !== newProps.authentication.loginChecked) {
            this.queryInitData()
        }
        if ( JSON.stringify(this.props) !==  JSON.stringify(newProps)) {
            this.setState({staff: newProps.staff,
                addWorkTime: newProps.staff.status && newProps.staff.status===209 ? false : this.state.addWorkTime,
                newStaffByMail: newProps.staff.status && newProps.staff.status===209 ? false : this.state.newStaffByMail,
                newStaff: newProps.staff.status && newProps.staff.status===209 ? false : this.state.newStaff,
            })
        }
    }

    componentDidUpdate(nextProps, nextState, nextContext) {
        initializeJs();

    }

    setTab(tab){
        this.setState({
            activeTab: tab
        })

        if(tab==='permissions') {document.title = "Доступы | Онлайн-запись";}
        if(tab==='holidays'){document.title = "Выходные дни | Онлайн-запись"}
        if(tab==='staff'){document.title = "Сотрудники | Онлайн-запись"}
        if(tab==='workinghours'){document.title = "Рабочие часы | Онлайн-запись"}

        history.pushState(null, '', '/staff/'+tab);

    }

    handleDrogEnd(dragDropItems) {
        const updatedSortOrderStaffs = []
        dragDropItems.forEach((item, i) => {
            updatedSortOrderStaffs.push({
                staffId: item.staffId,
                sortOrder: i + 1
            })
        })
        this.props.dispatch(staffActions.update(JSON.stringify(updatedSortOrderStaffs)))
    }

    render() {
        const { staff, emailNew, emailIsValid, staff_working, edit, closedDates, timetableFrom, timetableTo, currentStaff, date, editing_object, editWorkingHours, hoverRange, selectedDays, opacity, activeTab, addWorkTime, newStaffByMail, newStaff } = this.state;

        const daysAreSelected = selectedDays.length > 0;

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

        const { from, to, enteredTo } = this.state;
        const modifiersClosed = { start: from, end: enteredTo };
        const disabledDays = { before: this.state.from };
        const selectedDaysClosed = [from, { from, to: enteredTo }];

        const dragDropItems = []
        let staffGroups = [];
        staff.staff && staff.staff.forEach((staff_user, i) => {
            let staffGroupIndex = staff.costaff && staff.costaff.findIndex(staffGroup => staffGroup.some(item => item.staffId === staff_user.staffId));

            let isGroup = staff.costaff && staff.costaff[staffGroupIndex] && staff.costaff[staffGroupIndex].length > 1
            let groupIndex;
            if (isGroup) {
                const localIndex = staffGroups.findIndex(staffGroup => staffGroup.some(staffInGroup => staffInGroup.staffId === staff_user.staffId));

                if (localIndex === -1) {
                    staffGroups.push(staff.costaff[staffGroupIndex]);
                    groupIndex = staffGroups.length - 1
                } else {
                    groupIndex = localIndex;
                }
            }
            dragDropItems.push({
                staffId: staff_user.staffId,
                id: `staff-user-${i}`,
                content: (
                    <div className="tab-content-list" key={i}>
                        {/*{staffGroup.length > i + 1 && <span className="line_connect"/>}*/}
                        <div style={{ display: 'block' }}>
                            <a style={{ paddingBottom: isGroup ? '4px' : '10px' }} key={i} onClick={(e) => this.handleClick(staff_user.staffId, false, e, this)}>
                                                <span className="img-container">
                                                    <img className="rounded-circle"
                                                         src={staff_user.imageBase64 ? "data:image/png;base64," + staff_user.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                                         alt=""/>
                                                </span>
                                <p>{`${staff_user.firstName} ${staff_user.lastName ? staff_user.lastName : ''}`}</p>
                            </a>
                            {isGroup && <p className="staff-group">Группа напарников {groupIndex + 1}</p>}
                        </div>
                        <div>
                            {staff_user.phone}
                        </div>
                        <div>
                            {staff_user.email}
                        </div>
                        <div>
                                                    <span>
                                                        {this.renderSwitch(staff_user.roleId)}
                                                    </span>
                        </div>

                        <div className="delete dropdown">

                            <a className="delete-icon menu-delete-icon"
                               data-toggle="dropdown" aria-haspopup="true"
                               aria-expanded="false">
                                {staff_user.roleId !== 4 &&
                                <img
                                    src={`${process.env.CONTEXT}public/img/delete_new.svg`}
                                    alt=""/>
                                }
                            </a>
                            {staff_user.roleId !== 4 &&
                            <div className="dropdown-menu delete-menu p-3">
                                <button type="button"
                                        className="button delete-tab"
                                        onClick={() => this.deleteStaff(staff_user.staffId)}>Удалить
                                </button>
                            </div>
                            }
                        </div>
                    </div>
                )
            })
        });

        return (
            <div className="staff"  ref={node => { this.node = node; }}>
                {this.props.staff.isLoadingStaffInit && <div className="loader loader-email"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}
                <div className="row retreats content-inner page_staff">
                    <div className="flex-content col-xl-12">
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <a className={"nav-link"+(activeTab==='workinghours'?' active show':'')} data-toggle="tab" href="#tab1" onClick={()=>{this.updateTimetable(); this.setTab('workinghours')}}>Рабочие часы</a>
                            </li>
                            <li className="nav-item">
                                <a className={"nav-link"+(activeTab==='staff'?' active show':'')} data-toggle="tab" href="#tab2" onClick={()=>this.setTab('staff')}>Сотрудники</a>
                            </li>
                            <li className="nav-item">
                                <a className={"nav-link"+(activeTab==='holidays'?' active show':'')} data-toggle="tab" href="#tab3" onClick={()=>this.setTab('holidays')}>Выходные дни</a>
                            </li>
                            {access(-1) &&
                            <li className="nav-item">
                                <a className={"nav-link"+(activeTab==='permissions'?' active show':'')} data-toggle="tab" href="#tab4" onClick={()=>this.setTab('permissions')}>Доступ</a>
                            </li>
                            }
                        </ul>
                    </div>
                </div>
                <div className="retreats">
                    <div className="tab-content">
                        <div className={"tab-pane"+(activeTab==='workinghours'?' active':'')} id="tab1">
                            <DatePicker
                                type={'week'}
                                //selectedDay={selectedDay}
                                selectedDays={selectedDays}
                                showPrevWeek={this.showPrevWeek}
                                showNextWeek={this.showNextWeek}
                                handleDayChange={this.handleDayChange}
                                handleDayClick={this.handleDayClick}
                                handleWeekClick={this.handleWeekClick}
                            />
                            <div style={{ overflowX: 'auto', position: 'relative' }}>
                                <div style={{ overflowX: 'hidden', display: 'inline-block' }} className="content-tab-date min-width-desktop">
                                    <div style={{ position: 'absolute', zIndex: 1 }} className="tab-content-inner min-width-desktop">
                                        <div className="tab-content-list">
                                            <div>

                                            </div>
                                            {
                                                timetableFrom && this.enumerateDaysBetweenDates(timetableFrom, timetableTo).map((item, weekKey)=>
                                                    <div key={weekKey}>
                                                        <p><span className="mob-date">{moment(item, "x").locale("ru").format('dd')}</span><span className="dates-full-width text-capitalize">{moment(item, "x").locale("ru").format('dddd')}</span><span>{moment(item, "x").format("DD/MM")}</span></p>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div className="tab-content-inner">
                                        <div className="tab-content-list">
                                            <div>

                                            </div>
                                            {
                                                timetableFrom && this.enumerateDaysBetweenDates(timetableFrom, timetableTo).map((item, weekKey)=>
                                                    <div>
                                                    {/*<div key={weekKey}>*/}
                                                    {/*    <p><span className="mob-date">{moment(item, "x").locale("ru").format('dd')}</span><span className="dates-full-width text-capitalize">{moment(item, "x").locale("ru").format('dddd')}</span><span>{moment(item, "x").format("DD/MM")}</span></p>*/}
                                                    {/*</div>*/}
                                                    </div>
                                                )
                                            }
                                        </div>
                                        { staff.timetable && staff.timetable.map((time, keyTime)=>
                                             <div className="tab-content-list" key={keyTime}>
                                                    <div>
                                                        <img className="rounded-circle"
                                                             src={time.imageBase64?"data:image/png;base64,"+time.imageBase64:`${process.env.CONTEXT}public/img/image.png`}  alt=""/>
                                                        <p>{time.firstName} <br/>{time.lastName ? time.lastName : ''}</p>
                                                    </div>
                                                 {
                                                     time.timetables && timetableFrom && this.enumerateDaysBetweenDates(timetableFrom, timetableTo).map((day, dayKey)=> {
                                                             let times = time.timetables.filter((timetableItem) =>
                                                                 (moment(timetableItem.startTimeMillis, "x") >= moment(day, "x").startOf('day').format('x') &&
                                                                 moment(timetableItem.endTimeMillis, "x") <= moment(day, "x").endOf('day').format('x'))
                                                                 || (timetableItem.repeat==='WEEKLY' && moment(timetableItem.startTimeMillis, "x").format('dd')===moment(day, "x").format('dd'))
                                                             );

                                                         times.sort((a,b) => {
                                                             if (a.startTimeMillis > b.startTimeMillis) {
                                                                 return 1;
                                                             }
                                                             if (a.startTimeMillis < b.startTimeMillis) {
                                                                 return -1;
                                                             }
                                                             return 0;
                                                         });



                                                             return (times.length===0 ?
                                                                 <div className="add-work-time-hover"
                                                                  key={dayKey} onClick={()=>this.setState({...this.state, currentStaff:time,
                                                                     date:moment(day, "x").format('DD/MM/YYYY'),
                                                                     editWorkingHours:false, editing_object:null, addWorkTime: true})
                                                                 }/> :
                                                             <div className="dates-container" key={dayKey}  onClick={()=>this.setState({...this.state, currentStaff:time,
                                                                 date:moment(day, "x").format('DD/MM/YYYY'),
                                                                 editWorkingHours:true, editing_object:times, addWorkTime: true})} >
                                                                 <a>
                                                                     {times.map(time=>
                                                                        <span>{moment(time.startTimeMillis, 'x').format('HH:mm')}-{moment(time.endTimeMillis, 'x').format('HH:mm')}</span>
                                                                     )}
                                                                 </a>
                                                             </div>
                                                        )}
                                                     )
                                                 }
                                                </div>



                                            )}

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={"tab-pane staff-list-tab"+(activeTab==='staff'?' active':'')} id="tab2">
                            <div className=" content tabs-container" >
                                <DragDrop
                                    dragDropItems={dragDropItems}
                                    handleDrogEnd={this.handleDrogEnd}
                                />
                            </div>
                        </div>
                        <div className={"tab-pane"+(activeTab==='holidays'?' active':'')}  id="tab3">
                            <div className="holiday-tab">
                                <div className="add-holiday p-4 mb-3">
                                    <p className="title_block">Новые выходные дни</p>
                                    <div className="form-group row">
                                        <div className="col-sm-6">
                                            <p>Начало/Конец</p>
                                            <div className="button-calendar button-calendar-inline">
                                                <input type="button" data-range="true" value={(from && from!==0 ? moment(from).format('DD.MM.YYYY') : '') + (to ? " - "+moment(to).format('DD.MM.YYYY'):'')} data-multiple-dates-separator=" - " name="date" ref={(input) => this.startClosedDate = input}/>
                                            </div>
                                            <DayPicker
                                                className="Range"
                                                fromMonth={from}
                                                selectedDays={selectedDaysClosed}
                                                disabledDays={[disabledDays, {before: moment().utc().toDate()}]}
                                                modifiers={modifiersClosed}
                                                onDayClick={this.handleDayClick}
                                                onDayMouseEnter={this.handleDayMouseEnter}
                                                localeUtils={MomentLocaleUtils}
                                                locale={'ru'}
                                            />

                                        </div>
                                        <div className="description col-sm-6">
                                            <p>Описание</p>
                                            <textarea className="form-control" rows="3" name="description" value={closedDates.description} onChange={this.handleClosedDate}/>
                                            <div className="float-right mt-3">
                                                <div className="buttons">
                                                    <button className="small-button gray-button close-holiday"
                                                            type="button" data-dismiss="modal">Отменить
                                                    </button>
                                                    <button className={((!from || !closedDates.description) ? 'disabledField': 'close-holiday')+' small-button'} type="button"
                                                            onClick={from && closedDates.description && this.addClosedDate} data-dismiss="modal"
                                                    >Добавить
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                {
                                    staff.closedDates && staff.closedDates.map((item, key)=>
                                        <div className="row holiday-list p-2 mb-2" key={key}>
                                            <div className="col">
                                        <span>
                                            Начало
                                            <strong>{moment(item.startDateMillis).format('L')}</strong>
                                        </span>
                                                <span>
                                            Количество дней
                                            <strong>{Math.round((item.endDateMillis-item.startDateMillis)/(1000*60*60*24))+1}</strong>
                                        </span>
                                                <span>
                                            Описание
                                            <strong>{item.description}</strong>
                                        </span>
                                            </div>
                                            <div className="col-1 dropdown delete-tab-holiday">
                                                <a className="delete-icon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    <img src={`${process.env.CONTEXT}public/img/delete_new.svg`} alt=""/>
                                                </a>
                                                <div className="dropdown-menu delete-menu p-3">
                                                    <button type="button" className="button delete-tab" onClick={()=>this.deleteClosedDate(item.companyClosedDateId)}>Удалить</button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                            <a className="add"/>
                            <div className="hide buttons-container">
                                <div className="p-4">
                                    <button type="button" className="button new-holiday">Новый выходной</button>
                                </div>
                                <div className="arrow"></div>
                            </div>
                        </div>
                        {access(-1) && !this.props.staff.error &&
                        <div className={"tab-pane access-tab"+(activeTab==='permissions'?' active':'')} id="tab4">
                            <div className="access">
                                <div className="tab-content-list">
                                    <div></div>
                                    <div>Низкий</div>
                                    <div>Средний</div>
                                    <div>Админ</div>
                                    <div>Владелец</div>
                                </div>
                                {
                                    staff.accessList && staff.accessList.map((itemList, index) =>
                                        <div className="tab-content-list" key={itemList.permissionCode}>
                                            <div>
                                                {itemList.name}
                                            </div>
                                            {staff.access && staff.access.map((item) => {
                                                    const checkedPermission = item.permissions.find((element) => {
                                                            return element.permissionCode === itemList.permissionCode;
                                                        }
                                                    );

                                                    return (
                                                        <div key={item.roleCode}>
                                                            <div className="check-box">
                                                                <label>
                                                                    <input
                                                                        className="form-check-input"
                                                                        checked={checkedPermission !== undefined}
                                                                        disabled={item.roleCode === 4 || index===0}
                                                                        type="checkbox"
                                                                        onChange={() => this.toggleChange(item.roleCode, itemList.permissionCode)}/>
                                                                    <span className="check"></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            )}
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        }
                        {this.props.staff.isLoadingStaff && <div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}
                        {this.props.staff.error  && <div className="errorStaff"><h2 style={{textAlign: "center", marginTop: "50px"}}>Извините, что-то пошло не так</h2></div>}
                    </div>
                </div>
                {activeTab==='staff' &&
                <a className="add"/>
                }
                {activeTab === 'staff' &&
                <div className="hide buttons-container">
                    <div className="p-4">
                        <button className="button new-staff" type="button" onClick={(e)=>this.handleClick(null, true, e)}>Пригласить сотрудника по Email</button>
                        <button className="button new-staff" type="button"  onClick={(e)=>this.handleClick(null, false, e)}>Новый сотрудник</button>

                    </div>
                    <div className="arrow"/>
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
                    />
                }
                {newStaff &&
                    <NewStaff
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

    isValidEmailAddress(address) {
        return !! address.match(/.+@.+/);
    }

    setStaff(staff){
        this.setState({...this.state, currentStaff:staff.staff})
    }

    enumerateDaysBetweenDates(startDate, endDate) {
        let dates = [],
            days = 7;

        for(let i=1; i<=days; i++){
            if(i===1){
                dates.push(moment(parseInt(startDate)).format('x'))
            }else{
                dates.push(moment(parseInt(dates[i-2])).add(1,'days').format('x'))
            }
        }

        return dates;
    };

    handleSubmit(e) {
        const { firstName, lastName, email, phone, roleId, workStartMilis, workEndMilis, onlineBooking } = this.state.staff;
        const { dispatch } = this.props;

        e.preventDefault();

        this.setState({ submitted: true });

        if (firstName || lastName || email || phone) {
            let params = JSON.stringify({ firstName, lastName, email, phone, roleId, workStartMilis, workEndMilis, onlineBooking });
            dispatch(staffActions.add(params));
        }
    }

    addStaffEmail (emailNew){
        const { dispatch } = this.props;

        dispatch(staffActions.addUSerByEmail(JSON.stringify({'email': emailNew})));


    }

    handleClick(id, email) {
        const { staff } = this.state;

        if(id!=null) {
            const staff_working = staff.staff.find((item) => {return id === item.staffId});

            this.setState({...this.state, edit: true, staff_working: staff_working, newStaff: true});
        } else {
            if(email){
                this.setState({...this.state, edit: false, staff_working: {}, newStaffByMail: true});
            }else{
                this.setState({...this.state, edit: false, staff_working: {}, newStaff: true});
            }
        }
    }

    handleClosedDate(e) {
        const { name, value } = e.target;
        const { closedDates } = this.state;


        this.setState({ closedDates: {...closedDates, [name]: value   }});
    }

    renderSwitch(param) {
        switch (param) {
            case 4:   return "Владелец";
            case 3: return "Админ";
            case 2:  return "Средний доступ";
            default:      return "Низкий доступ";
        }
    };

    updateStaff(staff){
        const { dispatch } = this.props;

        dispatch(staffActions.update(JSON.stringify([staff]), staff.staffId));
    };

    addStaff(staff){
        const { dispatch } = this.props;

        dispatch(staffActions.add(JSON.stringify(staff)));
    };

    addWorkingHours(timing, id, edit){
        const { dispatch } = this.props;
        const { editWorkingHours } = this.state;


        !editWorkingHours ?
        dispatch(staffActions.addWorkingHours(JSON.stringify(timing), id))
            : dispatch(staffActions.updateWorkingHours(JSON.stringify(timing), id))
    };

    deleteWorkingHours(id, startDay, endDay){
        const { dispatch } = this.props;
        const { timetableFrom, timetableTo } = this.state;

        dispatch(staffActions.deleteWorkingHours(id, startDay, endDay, timetableFrom, timetableTo))
    }

    addClosedDate(){
        const { dispatch } = this.props;
        const { closedDates, from, to } = this.state;

        closedDates.startDateMillis=moment(from).format('x');
        closedDates.endDateMillis=moment(to===null?moment(from):to).format('x');

        dispatch(staffActions.addClosedDates(JSON.stringify(closedDates)));

        this.setState({
            ...this.state,
            from: null,
            to: null,
            enteredTo: null,
            closedDates: {
                description: ''
            }
        });
    };

    toggleChange (roleCode, permissionCode) {
        const { staff } = this.state;
        const { dispatch } = this.props;

        const access = staff.access;
        const keyCurrent=[];

        access.find((item, key)=>{
            if(item.roleCode===roleCode){

                item.permissions.find((item2, key2)=>{
                    if(item2.permissionCode===permissionCode){
                        keyCurrent[0]=key2;
                        keyCurrent[1]='delete';
                    }
                });

                if(keyCurrent[1]!=='delete') {
                    access[key].permissions.push({"permissionCode": permissionCode})
                }else {
                    access[key].permissions.splice(keyCurrent[0], 1);
                }
            }
        });

        dispatch(staffActions.updateAccess(JSON.stringify(access)));
    }

    deleteClosedDate (id){
        const { dispatch } = this.props;

        dispatch(staffActions.deleteClosedDates(id));
    }

    deleteStaff (id){
        const { dispatch } = this.props;

        dispatch(staffActions.deleteStaff(id));
    }

    updateTimetable (){
        const {selectedDays}=this.state;
        this.props.dispatch(staffActions.getTimetable(moment(selectedDays[0]).startOf('day').format('x'), moment(selectedDays[6]).endOf('day').format('x')));

    }

    handleDayChange (date) {
        this.showCalendar();
        let weeks = getWeekDays(getWeekRange(date).from)
        this.setState({
            selectedDays: weeks,
            timetableFrom: moment(weeks[0]).startOf('day').format('x'),
            timetableTo:moment(weeks[6]).endOf('day').format('x')
        });
        this.props.dispatch(staffActions.getTimetable(moment(weeks[0]).startOf('day').format('x'), moment(weeks[6]).endOf('day').format('x')));

    };

    handleDayEnter (date) {
        const hoverRange = getWeekRange(date)
        this.setState({
            hoverRange
        });
    };

    handleDayLeave () {
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

        this.setState(prevState => ({
            opacity: !prevState.opacity,
        }));
    }

    handleOutsideClick(e) {
        this.showCalendar();
    }

    handleWeekClick (weekNumber, days, e) {
        this.setState({
            selectedDays: days,
            timetableFrom: moment(days[0]).startOf('day').format('x'),
            timetableTo:moment(days[6]).endOf('day').format('x')
        });
        this.props.dispatch(staffActions.getTimetable(moment(days[0]).startOf('day').format('x'), moment(days[6]).endOf('day').format('x')));

    };

    showPrevWeek (){
        const {selectedDays} = this.state;

        this.showCalendar();
        let weeks = getWeekDays(getWeekRange(moment(selectedDays[0]).subtract(7, 'days')).from);
        this.setState({
            selectedDays: weeks,
            timetableFrom: moment(weeks[0]).startOf('day').format('x'),
            timetableTo:moment(weeks[6]).endOf('day').format('x')
        });
        this.props.dispatch(staffActions.getTimetable(moment(weeks[0]).startOf('day').format('x'), moment(weeks[6]).endOf('day').format('x')));

    }

    showNextWeek (){
        const {selectedDays} = this.state;

        this.showCalendar();
        let weeks = getWeekDays(getWeekRange(moment(selectedDays[0]).add(7, 'days')).from);
        this.setState({
            selectedDays: weeks,
            timetableFrom: moment(weeks[0]).startOf('day').format('x'),
            timetableTo:moment(weeks[6]).endOf('day').format('x')
        });
        this.props.dispatch(staffActions.getTimetable(moment(weeks[0]).startOf('day').format('x'), moment(weeks[6]).endOf('day').format('x')));

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
        this.setState({...this.state, from: null,
            to: null,
            enteredTo: null});
    }

    onClose(){
        this.setState({...this.state, addWorkTime: false, newStaffByMail: false, newStaff: false, createdService: false});
    }
}

function mapStateToProps(store) {
    const {staff, timetable, authentication}=store;

    return {
        staff, timetable, authentication
    };
}

export default connect(mapStateToProps)(Index);
