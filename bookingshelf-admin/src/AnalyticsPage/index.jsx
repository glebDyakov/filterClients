import React, {Component} from 'react';
import '../../public/scss/analytics.scss'
import {DatePicker} from "../_components/DatePicker";
import {getWeekRange} from '../_helpers/time'
import { Line } from 'react-chartjs-2';

import 'react-day-picker/lib/style.css';
import '../../public/css_admin/date.css'
import moment from 'moment';
import {connect} from "react-redux";
import {withRouter} from "react-router";

import { analiticsActions } from "../_actions";
import Hint from "../_components/Hint";


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

class Index extends Component{


    constructor(props) {
        super(props);

        this.handleDayClick = this.handleDayClick.bind(this);
        this.handleDayChange = this.handleDayChange.bind(this);
        this.showNextWeek = this.showNextWeek.bind(this);
        this.showPrevWeek = this.showPrevWeek.bind(this);
        this.statsForYear = this.statsForYear.bind(this);
        this.getChartData = this.getChartData.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.queryInitData = this.queryInitData.bind(this);


        let dateFrom,dateTo,dateFr, dateNow;

        dateFrom = moment().utc().toDate();
        dateTo = [getDayRange(moment()).from];
        dateFr = moment(getDayRange(moment()).from);


        dateNow = moment().utc().startOf('day');



        // let dataToChartStaff = moment().utc().format('x');
        // let dataFromChartStaff = moment().subtract(1, 'week').utc().format('x');

        let dataToChartStaff = moment().endOf('day').format('x');
        let dataFromChartStaff = moment(dateNow - (3600 * 1000 * 6 * 24)).startOf('day').format('x');





        this.state = {
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
                firstName: 'Работающие',
                lastName: 'сотрудники'
            },
            currentSelectedStaffChart: {
                firstName: 'Работающие',
                lastName: 'сотрудники'
            },
            initChartData: false,
            chosenPeriod: 1,
            dateArray: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            recordsArray: [],
            charStatsFor: 'recordsToday',
            dateArrayChart: [],
            recordsArrayChart: [],
            dataToChartStaff: dataToChartStaff,
            dataFromChartStaff: dataFromChartStaff,
            chartFirstDateTo: dataToChartStaff,
            chartFirstDateFrom: dataFromChartStaff,

        };



    }

    componentDidMount() {
        if (this.props.authentication.loginChecked) {
            this.queryInitData()
        }
        const { pathname } = this.props.location;
        if (pathname === '/analytics') {
            document.title = "Аналитика | Онлайн-запись";
        }
    }
    
    queryInitData() {
        const dateNow = moment().utc().startOf('day');
        const dateNowEnd = moment().utc().endOf('day');
        let dateNowMill = dateNow.valueOf();
        let dateNowEndMill = dateNowEnd.valueOf();

        dateNowMill = parseInt(dateNowMill) - (3600 * 3 * 1000);
        dateNowEndMill = parseInt(dateNowEndMill) - (3600 * 3 * 1000);
        this.props.dispatch(analiticsActions.getRecordsAndClientsCount(dateNowMill,dateNowEndMill));
        this.props.dispatch(analiticsActions.getStaffsAnalyticForAll(dateNowMill, dateNowEndMill));
        this.getChartData()
    }

    getChartData() {
        let dateNow = moment().endOf('day').format('x');
        let dateWeekBefore = moment(dateNow - (3600 * 1000 * 6 * 24)).startOf('day').format('x');
        let dateMonthBefore = moment(dateNow - (3600 * 1000 * 31 * 24)).startOf('day').format('x');

        this.props.dispatch(analiticsActions.getRecordsAndClientsChartCount(dateWeekBefore,dateNow));
        this.props.dispatch(analiticsActions.getStaffsAnalyticForAllChart(dateWeekBefore,dateNow));
        this.props.dispatch(analiticsActions.getFinancialAnalyticChart(dateMonthBefore, dateNow));
    }


    toggleDropdown(dropdownKey) {
        this.setState({ [dropdownKey]: !this.state[dropdownKey] });
    }
    handleOutsideClick() {
        this.setState({
            isFinancialDropdown: false
        })
    }

    setToday(){
        let today, todayEnd;
        today = moment().utc().startOf('day');
        todayEnd = moment().utc().endOf('day');
        this.setState({...this.state, selectedDay: today, dropdownFirst:false, chosenPeriod:1, type: 'day',});
        let todayMill = today.valueOf();
        let todayEndMill = todayEnd.valueOf();

        todayMill = parseInt(todayMill) - (3600 * 3 * 1000);
        todayEndMill = parseInt(todayEndMill) - (3600 * 3 * 1000);

        this.props.dispatch(analiticsActions.getRecordsAndClientsCount(todayMill, todayEndMill));

        if (this.state.currentSelectedStaff.lastName === 'сотрудники'){
            this.props.dispatch(analiticsActions.getStaffsAnalyticForAll(todayMill, todayEndMill))
        }else{
        this.props.dispatch(analiticsActions.getStaffsAnalytic(this.state.currentSelectedStaff.staffId, todayMill, todayEndMill));
        }
    }
    setYesterday(){

        let yesterday;
        yesterday = moment().subtract(1, 'days').utc().toDate();
        this.setState({...this.state, selectedDay: yesterday, dropdownFirst:false, chosenPeriod:2,type: 'day',});

        let yesterdayMill = moment().subtract(1, 'days').utc().startOf('day').format('x')
        let yesterdayMillEnd = moment().subtract(1, 'days').utc().endOf('day').format('x')

        yesterdayMill = parseInt(yesterdayMill) - (3600 * 3 * 1000);
        yesterdayMillEnd = parseInt(yesterdayMillEnd) - (3600 * 3 * 1000);

        this.props.dispatch(analiticsActions.getRecordsAndClientsCount(yesterdayMill,yesterdayMillEnd));

        if (this.state.currentSelectedStaff.lastName === 'сотрудники'){
            this.props.dispatch(analiticsActions.getStaffsAnalyticForAll(yesterdayMill, yesterdayMillEnd))
        }else {
            this.props.dispatch(analiticsActions.getStaffsAnalytic(this.state.currentSelectedStaff.staffId, yesterdayMill, yesterdayMillEnd));
        }
    }
    setWeek(){

        let weeks = getWeekDays(getWeekRange(moment().format()).from);
        this.setState({...this.state, dropdownFirst:false, chosenPeriod:3, type: 'week',selectedDays: weeks});

        // let startDayOfWeek = moment(this.state.selectedDays[0]).startOf('day').format('x');
        let startDayOfWeek = moment(weeks[0]).startOf('day').format('x');
        let endDayOfWeek = parseInt(startDayOfWeek) + (1000 * 3600 * 24 * 6);

        this.props.dispatch(analiticsActions.getRecordsAndClientsCount(startDayOfWeek,endDayOfWeek));

        if (this.state.currentSelectedStaff.lastName === 'сотрудники'){
            this.props.dispatch(analiticsActions.getStaffsAnalyticForAll(startDayOfWeek, endDayOfWeek))
        }else {
            this.props.dispatch(analiticsActions.getStaffsAnalytic(this.state.currentSelectedStaff.staffId, startDayOfWeek, endDayOfWeek));
        }
    }

    handleDayClick(day){
        let daySelected = moment(day);

        this.setState({
            selectedDay: daySelected.utc().startOf('day').toDate(),
            selectedDayMoment: daySelected,
            selectedDays: [getDayRange(moment(daySelected).format()).from]
        });
        let date = daySelected.valueOf();
        let dateStart = daySelected.startOf('day').valueOf();
        let dateEnd = daySelected.endOf('day').valueOf();
        dateStart = parseInt(dateStart) - (3600 * 3 * 1000);
        dateEnd = parseInt(dateEnd) - (3600 * 3 * 1000);
        this.props.dispatch(analiticsActions.getRecordsAndClientsCount(dateStart,dateEnd));

        if (this.state.currentSelectedStaff.lastName === 'сотрудники'){
            this.props.dispatch(analiticsActions.getStaffsAnalyticForAll(dateStart, dateEnd))
        }else {
        this.props.dispatch(analiticsActions.getStaffsAnalytic(this.state.currentSelectedStaff.staffId, dateStart, dateEnd));}
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

        if (this.state.currentSelectedStaff.lastName === 'сотрудники'){
            this.props.dispatch(analiticsActions.getStaffsAnalyticForAll(startDayOfWeek, endDayOfWeek))
        }else {
        this.props.dispatch(analiticsActions.getStaffsAnalytic(this.state.currentSelectedStaff.staffId, startDayOfWeek, endDayOfWeek));}
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

        this.props.dispatch(analiticsActions.getRecordsAndClientsCount(statTime,endTime));
        if (this.state.currentSelectedStaff.lastName === 'сотрудники'){
            this.props.dispatch(analiticsActions.getStaffsAnalyticForAll(startDayOfWeek, endDayOfWeek))
        }else {
        this.props.dispatch(analiticsActions.getStaffsAnalytic(this.state.currentSelectedStaff.staffId, statTime, endTime));}

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

        if (this.state.currentSelectedStaff.lastName === 'сотрудники'){
            this.props.dispatch(analiticsActions.getStaffsAnalyticForAll(startTime, endTime))
        }else {
        this.props.dispatch(analiticsActions.getStaffsAnalytic(this.state.currentSelectedStaff.staffId, startTime, endTime));}
    }
    setCurrentSelectedStaff(staff) {
        const {type} = this.state;
        let selectedDay = this.state.selectedDay.valueOf();
        let resStaff = {}

        let selectedWeekStart = moment(this.state.selectedDay).startOf('week').format('x');
        let selectedWeekEnd =  moment(this.state.selectedDay).endOf('week').format('x');

        if (staff === 2) {
            resStaff.firstName = "Работающие ";
            resStaff.lastName = "сотрудники";

            if (type === 'week') {
                this.props.dispatch(analiticsActions.getStaffsAnalyticForAll(selectedWeekStart, selectedWeekEnd))
            } else {
                this.props.dispatch(analiticsActions.getStaffsAnalyticForAll(selectedDay, 0));
            }

        } else {
            resStaff = staff;


            if (type === 'week') {
                this.props.dispatch(analiticsActions.getStaffsAnalytic(staff.staffId, selectedWeekStart, selectedWeekEnd));
            }
            else{
                    this.props.dispatch(analiticsActions.getStaffsAnalytic(staff.staffId, selectedDay, 0));
                }

        }

        this.setState({currentSelectedStaff:resStaff })
    }

    setCurrentSelectedStaffChart(staff){

        const {dataFromChartStaff, dataToChartStaff} = this.state;
        let resStaff = {}
        if (staff===2){
            resStaff.firstName = "Работающие";
            resStaff.lastName = "сотрудники";
            this.props.dispatch(analiticsActions.getStaffsAnalyticForAllChart(dataFromChartStaff, dataToChartStaff));
        }else{
            resStaff = staff;
            this.props.dispatch(analiticsActions.getStaffsAnalyticChart(staff.staffId, dataFromChartStaff, dataToChartStaff));
        }


        this.setState({currentSelectedStaffChart:resStaff });
    }

    statsForYear(analitics){

        const {charStatsFor} = this.state;
        let dateArray = [],
            recordsArray = [],
            lenght = Object.keys(analitics.countRecAndCliChart).length,
            dateNormal = '';

        switch (charStatsFor) {
            case 'allRecordsToday':
                for(let i = 0; i < lenght-1; i++){
                    dateNormal = moment(Object.keys(analitics.countRecAndCliChart)[i]).format("D MMM YYYY")
                    dateArray.push(dateNormal);
                    recordsArray.push(analitics.countRecAndCliChart[Object.keys(analitics.countRecAndCliChart)[i]].allRecordsToday);

                }
                break;
            case 'recordsToday':
                for(let i = 0; i < lenght-1; i++){
                    dateNormal = moment(Object.keys(analitics.countRecAndCliChart)[i]).format("D MMM YYYY")
                    dateArray.push(dateNormal);
                    recordsArray.push(analitics.countRecAndCliChart[Object.keys(analitics.countRecAndCliChart)[i]].recordsToday);

                }
                break;
            case 'recordsOnlineToday':
                for(let i = 0; i < lenght-1; i++){
                    dateNormal = moment(Object.keys(analitics.countRecAndCliChart)[i]).format("D MMM YYYY")
                    dateArray.push(dateNormal);
                    recordsArray.push(analitics.countRecAndCliChart[Object.keys(analitics.countRecAndCliChart)[i]].recordsOnlineToday);

                }
                break;

        }

        this.setState({dateArray:dateArray, recordsArray:recordsArray});

    }
    componentWillReceiveProps(newProps) {
        if (this.props.authentication.loginChecked !== newProps.authentication.loginChecked) {
            this.queryInitData()
        }
        if (JSON.stringify(this.props.analitics && this.props.analitics.countRecAndCliChart) !== JSON.stringify(newProps.analitics.countRecAndCliChart)) {
            this.statsForYear(newProps.analitics)
        }
        if(this.state.initChartData && JSON.stringify(newProps.analitics.countRecAndCliChart)) {

            this.setState({ initChartData: true })
        }
        if ((JSON.stringify( this.props.analitics.charStatsFor) !== JSON.stringify(newProps.analitics.charStatsFor))){
            const {chartFirstDateFrom, chartFirstDateTo} = this.state;
            this.props.dispatch(analiticsActions.getRecordsAndClientsChartCount(chartFirstDateFrom,chartFirstDateTo));
        }



    }
    componentDidUpdate(prevProps, prevState, snapshot) {


        if (this.props.analitics && this.props.analitics.countRecAndCliChart && (this.state.charStatsFor !== prevState.charStatsFor)) {
            this.statsForYear(this.props.analitics);
        }

        if (this.state.initChartData) {
            this.statsForYear(this.props.analitics);
            this.setState({ initChartData: false})
        }
        if(this.state.isFinancialDropdown) {
            document.addEventListener('click', this.handleOutsideClick, false);
        } else {
            document.removeEventListener('click', this.handleOutsideClick, false);
        }
    }


    render(){

        const {isLoadingFirst, isLoadingSecond} = this.props.analitics;
        const {selectedDay,selectedDays,type,saveStatistics, chosenPeriod, dropdownFirst, currentSelectedStaff, currentSelectedStaffChart} = this.state;
        const dateArray = this.props.analitics.countRecAndCliChart.dateArrayChartFirst;
        const recordsArray = this.props.analitics.countRecAndCliChart.recordsArrayChartFirst;

        const dateArrayChart = this.props.analitics.staffsAnalyticChart.dateArrayChart;
        const recordsArrayChart = this.props.analitics.staffsAnalyticChart.recordsArrayChart;

        const dateFinancialChart = this.props.analitics.financialAnalyticChart.dateArrayChart;
        const recordsFinancialChart = this.props.analitics.financialAnalyticChart.recordsArrayChart;

        const {analitics, staff} = this.props;
        const chartOptions = {
            fill: false,
            lineTension: 0,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: 'rgba(75,192,192,1)',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 10,
        }

        const data = {
           labels: dateArray,
           datasets: [
               {
                   ...chartOptions,
                   data: recordsArray
               }
           ]
        };
        const dataStaff = {
            labels: dateArrayChart,
            datasets: [
                {
                    ...chartOptions,
                    data: recordsArrayChart
                }
            ]
        };

        const dataFinancial = {
            labels: dateFinancialChart,
            datasets: [
                {
                    ...chartOptions,
                    data: recordsFinancialChart
                }
            ]
        };

       const options = {
           legend: {
               display: false,
           },
           scales: {
               xAxes: [{
                   gridLines: {
                       display: false,
                       drawBorder: false
                   }
               }],
               yAxes: [{
                   gridLines: {
                       drawBorder: false
                   }
               }]
           }
       };


        return(
            <div className="retreats analytics_container">

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
                                <span className="number-statistics">{analitics.counter && (analitics.counter.approvedAllRecordsToday)}</span>
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
                                <span className="number-statistics">{analitics.counter && (analitics.counter.approvedRecordsOnlineToday)}</span>
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
                                    (analitics.counter.approvedRecordsToday)}</span>
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
                            <strong>Без <br/>клиентов</strong>
                            <span>
                                {analitics.counter && analitics.counter.withoutClientToday}
                                <span className="small">{analitics.counter && ((analitics.counter.withoutClientPercent > 0?"+":"")
                                    + analitics.counter.withoutClientPercent.toFixed(2))}% со вчера</span>
                            </span>
                        </div>
                    </div>
                    {/*// <!--end analytics_list-->*/}

                    {/*// <!--end analytics_list-->*/}
                    <div style={{ margin: '15px 0 0 15px' }} className="analytics_list tablet-full">
                        <div className="list-group-statistics">
                            <strong>Клиенты <br/>не пришли</strong>
                            <span>
                                {analitics.counter && analitics.counter.clientNotComeToday}
                                <span className="small">{analitics.counter && ((analitics.counter.clientNotComePercent > 0?"+":"")
                                    + analitics.counter.clientNotComePercent.toFixed(2))}% со вчера</span>
                            </span>
                        </div>
                    </div>
                    {/*// <!--end analytics_list-->*/}
                </div>
                <div className="group-container">

                    <div style={{ width: '100%', marginRight: 0 }} className="analytics_list tablet-full">
                        <div className="list-group-statistics">
                            <div className="dropdown">
                                <strong>Загруженность</strong>
                                <div className="bth dropdown-toggle rounded-button select-menu"
                                     data-toggle="dropdown" role="menu" aria-haspopup="true"
                                     aria-expanded="false">
                                    <p>{currentSelectedStaff.firstName + " " + currentSelectedStaff.lastName}</p>
                                </div>
                                <ul className="dropdown-menu">
                                    <li onClick={()=>this.setCurrentSelectedStaff(2)}>
                                        <a ><p>Работающие сотрудники</p></a>
                                    </li>
                                    {staff && staff.timetable && staff.timetable.map(staffEl =>{
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
                            <select className="custom-select" onChange={(e)=>this.setTypeDataOfChar(e)}>
                                <option>Всего записей в журнал</option>
                                <option>Всего онлайн записей</option>
                                <option selected>Всего записей</option>
                            </select>
                            <select className="custom-select" onChange={(e)=>this.setCharData(e)}>
                                <option selected="">Неделя</option>
                                <option>Месяц</option>
                                {/*<option>Год</option>*/}
                            </select>
                        </div>
                        <div className="chart-inner">
                            <div id="container-chart" className="chart" style={{position:"relative"}}>
                                {!!isLoadingFirst && <div className="loader" style={{position: "absolute", left: "50%", transform: "translateX(-50%)"}}><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}
                                {!isLoadingFirst &&
                                <Line
                                    data={data}
                                    options={options}
                                />}
                            </div>
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
                                    <p>{currentSelectedStaffChart.firstName + " " + currentSelectedStaffChart.lastName}</p>
                                </div>
                                <ul className="dropdown-menu">
                                    <li onClick={()=>this.setCurrentSelectedStaffChart(2)}>
                                        <a ><p>Работающие сотрудники</p></a>
                                    </li>
                                    {staff && staff.timetable && staff.timetable.map(staffEl =>{
                                        const activeStaff = staff && staff.staff && staff.staff.find(staffItem => staffItem.staffId === staffEl.staffId);
                                        return(
                                            <li onClick={()=>this.setCurrentSelectedStaffChart(staffEl)}>
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
                            <select className="custom-select" onChange={(e)=>this.setCharDataStaff(e)}>
                                <option selected="" >Неделя</option>
                                <option>Месяц</option>
                                {/*<option>Год</option>*/}
                            </select>
                        </div>
                        <div className="chart-inner">
                            <div id="container-chart2" className="chart" style={{position:"relative"}}>
                                {!!isLoadingSecond && <div className="loader" style={{position: "absolute", left: "50%", transform: "translateX(-50%)"}}><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}
                                {!isLoadingSecond && <Line
                                    data={dataStaff}
                                    options={options}
                                />}
                            </div>
                        </div>
                    </div>
                    {/*// <!--end analytics_chart-->*/}
                </div>
                {/*// <!--end group-container-->*/}

                <div style={{width: '99.9%'}} className="analytics_list analytics_chart">
                    <div style={{display: 'flex', justifyContent: 'flex-start'}}>
                        <span style={{ width: 'auto'}} className="title-list">Финансовая аналитика</span>
                        <Hint hintMessage="Сумма стоимости визитов в журнале записи" />
                    </div>
                    <div className="chart-inner">
                        <div id="container-chart" className="chart" style={{position:"relative"}}>
                            {!!isLoadingFirst && <div className="loader" style={{position: "absolute", left: "50%", transform: "translateX(-50%)"}}><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}
                            {!isLoadingFirst &&
                            <Line
                                data={dataFinancial}
                                options={options}
                            />}
                        </div>
                    </div>
                </div>

                {!!0 &&
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
                </div>}
                {!!0 &&
                <div className="dropdown">
                    <a className="delete-icon menu-delete float-right" data-toggle="dropdown"
                       aria-haspopup="true" aria-expanded="false">
                        Удалить всю статистику
                    </a>
                    <div className="dropdown-menu delete-menu p-3">
                        <button type="button" className="button">Да</button>
                        <button type="button" className="gray-button">Нет</button>
                    </div>
                </div>}


            </div>

        );
    }
    setCharData(e){

        let dataFrom, dataTo;

        const {name, value} = e.target;

        dataTo = moment().endOf('day').format('x');

        switch(value){
            case 'Неделя':
                dataFrom = moment(dataTo - (3600 * 1000 * 6 * 24)).startOf('day').format('x');
                break;
            case 'Месяц':
                dataFrom = moment(dataTo - (3600 * 1000 * 31 * 24)).startOf('day').format('x');
                break;
            case 'Год':
                dataFrom = moment().subtract(1, 'year').utc().format('x');
                break;
        }

            this.setState({chartFirstDateFrom: dataFrom, chartFirstDateTo: dataTo})
            this.props.dispatch(analiticsActions.getRecordsAndClientsChartCount(dataFrom,dataTo));


    }
    setTypeDataOfChar(e){
        const {name, value} = e.target;
        let type = '';
        switch(value){
            case 'Всего записей в журнал':
                type = 'recordsToday';
                break;
            case 'Всего онлайн записей':
                type = 'recordsOnlineToday';
                break;
            case 'Всего записей':
                type = 'allRecordsToday';
                break;
        }
        this.props.dispatch(analiticsActions.updateChartStatsFor(type));


    }

    setCharDataStaff(e){
        let dataFrom, dataTo;

        const {name, value} = e.target;
        const {currentSelectedStaffChart} = this.state

        dataTo = moment().endOf('day').format('x');

        switch(value){
            case 'Неделя':
                dataFrom = moment(dataTo - (3600 * 1000 * 6 * 24)).startOf('day').format('x');
                break;
            case 'Месяц':
                dataFrom = moment(dataTo - (3600 * 1000 * 31 * 24)).startOf('day').format('x');
                break;
            case 'Год':
                dataFrom = moment().subtract(1, 'year').utc().format('x');
                break;
        }
        this.setState({dataFromChartStaff: dataFrom, dataToChartStaff: dataTo})
        if (this.state.currentSelectedStaffChart.firstName === 'Работающие'){
            this.props.dispatch(analiticsActions.getStaffsAnalyticForAllChart(dataFrom, dataTo));
        }else{
            this.props.dispatch(analiticsActions.getStaffsAnalyticChart(currentSelectedStaffChart.staffId, dataFrom, dataTo));
        }
    }

}

function mapStateToProps(state) {
    const { analitics, staff, authentication} = state;
    return {
        analitics, staff, authentication
    };
}

export default connect(mapStateToProps)(withRouter(Index));
