import React, {Component} from 'react';
import '../../public/scss/analytics.scss'
import '../../public/scss/styles.scss'
import {DatePicker} from "../_components/DatePicker";
import config from 'config';


import 'react-day-picker/lib/style.css';
import '../../public/css_admin/date.css'
import {HeaderMain} from "../_components/HeaderMain";

import {UserSettings} from "../_components/modals";
import moment from 'moment';
import {connect} from "react-redux";
import {withRouter} from "react-router";

import { analiticsActions, staffActions } from "../_actions";


function getDayRange(date) {
    return {
        from: moment(date).utc().locale('ru')
            .toDate(),
        to: moment(date).utc().locale('ru')
            .endOf('day')
            .toDate(),
    };
}

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

class AnalyticsPage extends Component{


    constructor(props) {
        super(props);

        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.handleDayChange = this.handleDayChange.bind(this);
        this.showNextWeek = this.showNextWeek.bind(this);
        this.showPrevWeek = this.showPrevWeek.bind(this);


        let dateFrom,dateTo,dateFr;
        dateFrom = moment().utc().toDate();
        dateTo = [getDayRange(moment()).from];
        dateFr = moment(getDayRange(moment()).from);
        let dateNow = moment().toDate().valueOf();
        this.props.dispatch(analiticsActions.getRecordsAndClientsCount(dateNow,0));


        this.state = {
            userSettings: false,
            type: 'day',
            selectedDay: dateFrom,
            selectedDays:dateTo,
            selectedDayMoment: dateFr,
            saveStatistics: true,
            dropdownFirst: false,
            staffs: props.staffs,
            staffAll: props.staff,
            analitics: props.analitics,
            countRecAndCli: props.countRecAndCli,
            currentSelectedStaff: {
                firstName: 'Все',
                lastName: 'Сотрудники'
            },
            chosenPeriod: 1,
            timetableFrom: 0,
            timetableTo: 0,
            allRecords:{
                done: 0,
                relative: 0,
                notVisited: 0,
                canceled: 0
            },
            onlineRecords:{
                done: 0,
                relative: 0,
                notVisited: 0,
                canceled: 0
            },
            calendarRecords:{
                done: 0,
                relative: 0,
                notVisited: 0,
                canceled: 0
            },
            recordsChar: {},
            workloadChar:{},



        };


    }
    componentDidMount() {

        this.props.dispatch(analiticsActions.getStaff());
        this.props.dispatch(staffActions.get());

    }

    setToday(){
        let today;
        today = moment().utc().toDate();
        this.setState({...this.state, selectedDay: today, dropdownFirst:false, chosenPeriod:1, type: 'day',});
        console.log("period", this.state.dateFrom )
        let todayMill = today.valueOf();

        this.props.dispatch(analiticsActions.getRecordsAndClientsCount(todayMill, 0));
        this.props.dispatch(analiticsActions.getStaffsAnalytic(this.state.currentSelectedStaff.staffId, todayMill, 0));
    }
    setYesterday(){
        let yesterday;
        yesterday = moment().subtract(1, 'days').utc().toDate();
        this.setState({...this.state, selectedDay: yesterday, dropdownFirst:false, chosenPeriod:2,type: 'day',});
        console.log("period", this.state.dateFrom)

        let yesterdayMill = yesterday.valueOf();
        this.props.dispatch(analiticsActions.getRecordsAndClientsCount(yesterdayMill,0));
        this.props.dispatch(analiticsActions.getStaffsAnalytic(this.state.currentSelectedStaff.staffId, yesterdayMill, 0));
    }
    setWeek(){

        let weeks = getWeekDays(getWeekRange(moment().format()).from);
        this.setState({...this.state, dropdownFirst:false, chosenPeriod:3, type: 'week',selectedDays: weeks});
        console.log("boooom1");


        let startDayOfWeek = moment(this.state.selectedDays[0]).format('x');
        let endDayOfWeek = parseInt(startDayOfWeek) + (1000 * 3600 * 24 * 6);
        this.props.dispatch(analiticsActions.getRecordsAndClientsCount(startDayOfWeek,endDayOfWeek));
        this.props.dispatch(analiticsActions.getStaffsAnalytic(this.state.currentSelectedStaff.staffId, startDayOfWeek, endDayOfWeek));
        debugger

    }



    onOpen(){
        this.setState({...this.state, userSettings: true});
    }
    onClose(){
        this.setState({...this.state, userSettings: false});
    }
    handleDayClick(day){

        let daySelected = moment(day);

        this.setState({
            selectedDay: daySelected.utc().startOf('day').toDate(),
            selectedDayMoment: daySelected,
            selectedDays: [getDayRange(moment(daySelected).format()).from]
        });
        let date = daySelected.valueOf();
        this.props.dispatch(analiticsActions.getRecordsAndClientsCount(date,0));
        this.props.dispatch(analiticsActions.getStaffsAnalytic(this.state.currentSelectedStaff.staffId, date, 0));
    }
    handleWeekClick (weekNumber, days, e) {

        const startTime = moment(days[0]).startOf('day').format('x');
        const endTime = moment(days[6]).endOf('day').format('x');

        this.setState({
            selectedDays: days,
            timetableFrom: startTime,
            timetableTo:endTime,
            type: 'week',

        });


    };
    handleDayChange (date) {

        const weeks = getWeekDays(getWeekRange(date).from);
        const startTime = moment(weeks[0]).startOf('day').format('x');
        const endTime = moment(weeks[6]).endOf('day').format('x');

        this.setState({
            selectedDays: weeks,
            timetableFrom: startTime,
            timetableTo:endTime

        });
        let startDayOfWeek = moment(weeks[0]).format('x');
        let endDayOfWeek = parseInt(startDayOfWeek) + (1000 * 3600 * 24 * 6);

        this.props.dispatch(analiticsActions.getRecordsAndClientsCount(startDayOfWeek,endDayOfWeek));
        this.props.dispatch(analiticsActions.getStaffsAnalytic(this.state.currentSelectedStaff.staffId, startDayOfWeek, endDayOfWeek));
    };

    showPrevWeek (){
        const {selectedDays} = this.state;
        const weeks = getWeekDays(getWeekRange(moment(selectedDays[0]).subtract(7, 'days')).from);
        const statTime = moment(weeks[0]).startOf('day').format('x');
        const endTime = moment(weeks[6]).endOf('day').format('x');


        this.setState({
            selectedDays: weeks,
            timetableFrom: statTime,
            timetableTo: endTime,
            type: 'week',
        });

        let startDayOfWeek = moment(weeks[0]).format('x');
        let endDayOfWeek = parseInt(startDayOfWeek) + (1000 * 3600 * 24 * 6);

        this.props.dispatch(analiticsActions.getRecordsAndClientsCount(startDayOfWeek,endDayOfWeek));
        this.props.dispatch(analiticsActions.getStaffsAnalytic(this.state.currentSelectedStaff.staffId, startDayOfWeek, endDayOfWeek));

    }

    showNextWeek (){
        const {selectedDays} = this.state;
        const weeks = getWeekDays(getWeekRange(moment(selectedDays[0]).add(7, 'days')).from);
        const startTime = moment(weeks[0]).startOf('day').format('x');
        const endTime = moment(weeks[6]).endOf('day').format('x')

        this.setState({
            selectedDays: weeks,
            timetableFrom: startTime,
            timetableTo: endTime,
            type: 'week',
        });
        let startDayOfWeek = moment(weeks[0]).format('x');
        let endDayOfWeek = parseInt(startDayOfWeek) + (1000 * 3600 * 24 * 6);
        this.props.dispatch(analiticsActions.getRecordsAndClientsCount(startDayOfWeek,endDayOfWeek));
        this.props.dispatch(analiticsActions.getStaffsAnalytic(this.state.currentSelectedStaff.staffId, startDayOfWeek, endDayOfWeek));
    }
    setCurrentSelectedStaff(staff){

        let resStaff = {}
        if(staff === 1){
            resStaff.firstName = "Все";
            resStaff.lastName = "сотрудники"
        }else if (staff===2){
            resStaff.firstName = "Работающие";
            resStaff.lastName = "сотрудники"
        }else{
            resStaff = staff;
            let selectedDay = this.state.selectedDay.valueOf();
            this.props.dispatch(analiticsActions.getStaffsAnalytic(staff.staffId, selectedDay, 0));

        }


        this.setState({currentSelectedStaff:resStaff })
    }



    render(){

        const {userSettings,selectedDay,selectedDays,type,saveStatistics, chosenPeriod, dropdownFirst, currentSelectedStaff} = this.state;
        const {analitics, staff} = this.props;
       
        debugger


        return(
            <div className="content-wrapper">
                <div className="container-fluid">
                    <HeaderMain
                        onOpen={this.onOpen}
                    />

                    {/*<div className="no-scroll row retreats">*/}
                    {/*    <div className="col-1 mob-menu">*/}
                    {/*        <div>*/}
                    {/*            <img src="img/burger_mob.png" alt=""/>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    <div className="col">*/}
                    {/*        <p className="red-title-block mob-setting">Аналитика</p>*/}
                    {/*    </div>*/}
                    {/*
                    {/*    <div className="col right_elements">*/}
                    {/*        <span className="time_show" id="doc_time"></span>*/}
                    {/*        <span className="notification"></span>*/}
                    {/*        <a className="setting" data-toggle="modal" data-target=".modal_user_setting"></a>*/}
                    {/*        <a className="firm-name" href="#">Cтоматология</a>*/}
                    {/*        <div className="img-container">*/}
                    {/*            <img src="img/image.png" alt=""/>*/}
                    {/*        </div>*/}
                    {/*        <span className="log_in">Выход</span>*/}
                    {/*    </div>*/}
                    {/*
                    {/*</div>*/}
                    {/*// <!--end no-scroll-->*/}
                    <div className="retreats analytics_container">
                        {/*<div className="select-date">*/}
                        {/*    <div className="select-inner">*/}
                        {/*        <span className="arrow-left"></span>*/}
                        {/*        <div className="button-calendar">*/}
                        {/*            <div className="present-calendar-date">*/}
                        {/*                <p>Сегодня</p>*/}
                        {/*                <ul className="present-dropdown">*/}
                        {/*                    <li>Сегодня</li>*/}
                        {/*                    <li>Вчера</li>*/}
                        {/*                    <li>Нeделя</li>*/}
                        {/*                </ul>*/}
                        {/*            </div>*/}
                        {/*            <input type="button" data-range="true" value="___" data-position='bottom center'*/}
                        {/*                   data-multiple-dates-separator=" - " className="datepicker-here button-cal"/>*/}
                        {/*        </div>*/}
                        {/*        <span className="arrow-right"></span>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        <div className="timeContainer" style={dropdownFirst?{borderRadius: "10px 10px 10px 0px"}:{borderRadius: "10px"}}>
                            <div className="calendar-switch">
                                <div className="choisen" onClick={()=>this.setState({dropdownFirst:!dropdownFirst})}>{chosenPeriod===1?"Сегодня":chosenPeriod===2?"Вчера":chosenPeriod===3?"Неделя":""}</div>
                                {dropdownFirst && <ul className="dropdown">
                                    <li onClick={()=>this.setToday()}>Сегодня</li>
                                    <li onClick={()=>this.setYesterday()}>Вчера</li>
                                    <li onClick={()=>this.setWeek()}>Неделя</li>
                                </ul>}
                            </div>
                            <DatePicker
                                // closedDates={staffAll.closedDates}
                                type={type}
                                selectedDay={selectedDay}
                                selectedDays={selectedDays}
                                getWeekRange={getWeekRange}
                                showPrevWeek={this.showPrevWeek}
                                showNextWeek={this.showNextWeek}
                                handleDayChange={this.handleDayChange}
                                handleDayClick={this.handleDayClick}
                                handleWeekClick={this.handleWeekClick}
                            />

                        </div>




                        {/*// <!--end select-date-->*/}
                        <div className="group-container">
                            <div className="analytics_list">
                                <div className="list-group-statistics">
                                    <strong>Всего <br/>Записей</strong>
                                    <span>
                                        {analitics.counter && analitics.counter.allRecordsToday}
                                        <span className="small">{analitics.counter && ((analitics.counter.allRecordsPercent > 0?"+":"")
                                            + analitics.counter.allRecordsPercent.toFixed(2))}% со вчера</span>
                                    </span>
                                </div>
                                <div className="visitor-statistics">
                                    <div>
                                        <span className="number-statistics">{analitics.counter && (analitics.counter.allRecordsToday - analitics.counter.allRecordsTodayCanceled)}</span>
                                        <p>Выполнено</p>
                                    </div>
                                    <div>
                                        <span className="number-statistics">{analitics.counter &&
                                        analitics.counter.allRecordsTodayCanceled}</span>
                                        <p>Отменено</p>
                                    </div>
                                </div>
                            </div>
                            {/*// <!--end analytics_list-->*/}
                            <div className="analytics_list">
                                <div className="list-group-statistics">
                                    <strong>Онлайн <br/>Записей</strong>
                                    <span>
                                        {analitics.counter && analitics.counter.recordsOnlineToday}
                                        <span className="small">{analitics.counter && ((analitics.counter.recordsOnlinePercent > 0?"+":"")
                                            + analitics.counter.recordsOnlinePercent.toFixed(2))}% со вчера</span>
                                    </span>
                                </div>
                                <div className="visitor-statistics">
                                    <div>
                                        <span className="number-statistics">{analitics.counter && (analitics.counter.recordsOnlineToday - analitics.counter.recordsOnlineTodayCanceled)}</span>
                                        <p>Выполнено</p>
                                    </div>
                                    <div>
                                        <span className="number-statistics">{analitics.counter &&
                                        analitics.counter.recordsOnlineTodayCanceled}</span>
                                        <p>Отменено</p>
                                    </div>
                                </div>
                            </div>
                            {/*// <!--end analytics_list-->*/}
                            <div className="analytics_list">
                                <div className="list-group-statistics">
                                    <strong>Записей <br/>в журнал</strong>
                                    <span>
                                        {analitics.counter && analitics.counter.recordsToday}
                                        <span className="small">{analitics.counter && ((analitics.counter.recordsPercent > 0?"+":"")
                                            + analitics.counter.recordsPercent.toFixed(2))}% со вчера</span>
                                    </span>
                                </div>
                                <div className="visitor-statistics">
                                    <div>
                                        <span className="number-statistics">
                                            {analitics.counter &&
                                            (analitics.counter.recordsToday - analitics.counter.recordsTodayCanceled)}</span>
                                        <p>Выполнено</p>
                                    </div>
                                    <div>
                                        <span className="number-statistics">{analitics.counter &&
                                        analitics.counter.recordsTodayCanceled}</span>
                                        <p>Отменено</p>
                                    </div>
                                </div>
                            </div>
                            {/*// <!--end analytics_list-->*/}
                        </div>
                        {/*// <!--end group-container-->*/}
                        <div className="group-container">
                            <div className="analytics_list tablet-right">
                                <div className="list-group-statistics">
                                    <strong>Новые <br/>Клиенты</strong>
                                    <span>
                                        {analitics.counter && analitics.counter.newClientsToday}
                                        <span className="small">{analitics.counter && ((analitics.counter.newClientsPercent > 0?"+":"")
                                            + analitics.counter.newClientsPercent.toFixed(2))}% со вчера</span>
                                    </span>
                                </div>
                            </div>
                            {/*// <!--end analytics_list-->*/}
                            <div className="analytics_list tablet-right">
                                <div className="list-group-statistics">
                                    <strong>Постоянные <br/>Клиенты</strong>
                                    <span>
                                        {analitics.counter && analitics.counter.permanentClientsToday}
                                        <span className="small">{analitics.counter && ((analitics.counter.permanentClientsPercent > 0?"+":"")
                                            + analitics.counter.permanentClientsPercent.toFixed(2))}% со вчера</span>
                                    </span>
                                </div>
                            </div>
                            {/*// <!--end analytics_list-->*/}
                            <div className="analytics_list tablet-full">
                                <div className="list-group-statistics">
                                    <div className="dropdown">
                                        <strong>Загруженность</strong>
                                        <div className="bth dropdown-toggle rounded-button select-menu"
                                             data-toggle="dropdown" role="menu" aria-haspopup="true"
                                             aria-expanded="false">
                                            <p>{currentSelectedStaff.firstName + " " + currentSelectedStaff.lastName}</p>
                                        </div>
                                        <ul className="dropdown-menu">
                                            <li onClick={()=>this.setCurrentSelectedStaff(1)}>
                                                <a ><p>Все сотрудники</p></a>
                                            </li>
                                            <li onClick={()=>this.setCurrentSelectedStaff(2)}>
                                                <a ><p>Работающие сотрудники</p></a>
                                            </li>
                                            {staff && staff.availableTimetable && staff.availableTimetable.map(staffEl =>{
                                                const activeStaff = staff && staff.staff && staff.staff.find(staffItem => staffItem.staffId === staffEl.staffId);
                                                return(
                                                    <li onClick={()=>this.setCurrentSelectedStaff(staffEl)}>
                                                        <a>
                                                        <span className="img-container">
                                                            <img className="rounded-circle"
                                                                 src={activeStaff && activeStaff.imageBase64
                                                                     ? "data:image/png;base64," +
                                                                     activeStaff.imageBase64
                                                                     // "1555020690000"
                                                                     : `${process.env.CONTEXT}public/img/image.png`}
                                                                 alt=""/>
                                                        </span>
                                                            <p>{staffEl.firstName + " " + staffEl.lastName}</p>
                                                        </a>
                                                    </li>
                                                )}
                                            )}
                                        </ul>
                                    </div>
                                    <span>
                                        {analitics.staffsAnalytic ?(((analitics.staffsAnalytic.appointmentTime)/3600000).toFixed(2)) + " ч.": "0 ч."}
                                        ({analitics.staffsAnalytic?analitics.staffsAnalytic.percentWorkload.toFixed(2):"0"}%)
                                        <span className="small">
                                            {analitics.staffsAnalytic && ((analitics.staffsAnalytic.ratioToYesterday > 0?"+":"")
                                            + ((analitics.staffsAnalytic.ratioToYesterday).toFixed(2)))}% со вчера

                                            {/*{analitics.staffsAnalytic && ((analitics.staffsAnalytic.ratioToYesterday > 0?"+":"")*/}
                                            {/*    + analitics.staffsAnalytic.ratioToYesterday.toFixed(2))}*/}
                                        </span>
                                    </span>
                                </div>
                            </div>
                            {/*// <!--end analytics_list-->*/}
                        </div>
                        {/*// <!--end group-container-->*/}
                        <div className="group-container">
                            <div className="analytics_list analytics_chart">
                                <div>
                                    <span className="title-list">Записи</span>
                                    <select className="custom-select">
                                        <option selected="">Всего записей в журнал</option>
                                        <option>Всего онлайн записей</option>
                                        <option>Всего записей</option>
                                    </select>
                                    <select className="custom-select">
                                        <option selected="">Неделя</option>
                                        <option>Месяц</option>
                                        <option>Год</option>
                                    </select>
                                </div>
                                <div className="chart-inner">
                                    <div id="container-chart" className="chart"></div>
                                </div>
                            </div>
                            {/*// <!--end analytics_chart-->*/}
                            <div className="analytics_list analytics_chart">
                                <div>
                                    <span className="title-list">Загруженность, %</span>
                                    <div className="dropdown">
                                        <div className="bth dropdown-toggle rounded-button select-menu"
                                             data-toggle="dropdown" role="menu" aria-haspopup="true"
                                             aria-expanded="false">
                                            <p>Все сотрудники</p>
                                        </div>
                                        <ul className="dropdown-menu">
                                            <li>
                                                <a href="#"><p>Все сотрудники</p></a>
                                            </li>
                                            <li>
                                                <a href="#"><p>Работающие сотрудники</p></a>
                                            </li>
                                            <li onClick={()=>setCurrentSelectedStaff()}>
                                                <a href="#">
                                                    <span className="img-container">
                                                        <img className="rounded-circle" src="img/avatars/1.jpg" alt=""/>
                                                    </span>
                                                    <p>Ольга Шубина</p>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#">
                                                    <span className="img-container">
                                                        <img className="rounded-circle" src="img/avatars/3.jpg" alt=""/>
                                                    </span>
                                                    <p>Валерия Семенова</p>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#">
                                                    <span className="img-container">
                                                        <img className="rounded-circle" src="img/avatars/2.jpg" alt=""/>
                                                    </span>
                                                    <p>Светлана Александрова</p>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#">
                                                    <span className="img-container">
                                                        <img className="rounded-circle" src="img/avatars/4.jpg" alt=""/>
                                                    </span>
                                                    <p>Николай Петров</p>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#">
                                                    <span className="img-container">
                                                        <img className="rounded-circle" src="img/avatars/5.jpg" alt=""/>
                                                    </span>
                                                    <p>Олег Смолов</p>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#">
                                                    <span className="img-container">
                                                        <img className="rounded-circle" src="img/avatars/3.jpg" alt=""/>
                                                    </span>
                                                    <p>Валерия Семенова</p>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <select className="custom-select">
                                        <option selected="">Неделя</option>
                                        <option>Месяц</option>
                                        <option>Год</option>
                                    </select>
                                </div>
                                <div className="chart-inner">
                                    <div id="container-chart2" className="chart"></div>
                                </div>
                            </div>
                            {/*// <!--end analytics_chart-->*/}
                        </div>
                        {/*// <!--end group-container-->*/}
                        <div className="group-container">
                            <div className="analytics_list save-statistics">
                                <div>
                                    <p>Желаете ли вы хранить статистику?</p>
                                    <button className={saveStatistics?"button":"button gray-button"} type="button" onClick={()=>this.setState({saveStatistics:true})}>Да</button>
                                    <button className={!saveStatistics?"button":"button gray-button"} type="button" onClick={()=>this.setState({saveStatistics:false})}>Нет</button>
                                </div>
                                <div>
                                    <span>Сколько хранить статистику</span>
                                    <select className="custom-select">
                                        <option selected="">Месяц</option>
                                        <option>Год</option>
                                        <option>12 недель</option>
                                        <option>31 дней</option>
                                        <option>Макс</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="dropdown">
                            <a className="delete-icon menu-delete float-right" data-toggle="dropdown"
                               aria-haspopup="true" aria-expanded="false">
                                Удалить всю статистику
                            </a>
                            <div className="dropdown-menu delete-menu p-3">
                                <button type="button" className="button">Да</button>
                                <button type="button" className="gray-button">Нет</button>
                            </div>
                        </div>
                    </div>
                    {/*// <!--end retreats-->*/}
                </div>
                {/*// <!--end content-->*/}
                {userSettings &&
                <UserSettings
                    onClose={this.onClose}
                />}
            </div>



        );
    }

}

function mapStateToProps(state) {
    const { analitics, staff} = state;
    debugger
    return {
        analitics, staff
    };
}

const connectedApp = connect(mapStateToProps)(withRouter(AnalyticsPage));
export { connectedApp as AnalyticsPage };
