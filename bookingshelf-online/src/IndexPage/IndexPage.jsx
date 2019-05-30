import React, {PureComponent} from 'react';
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
import TabOne from "./components/TabOne";
import TabTwo from "./components/TabTwo";
import TabThird from "./components/TabThird";
import TabFour from "./components/TabFour";
import TabFive from "./components/TabFive";
import TabSix from "./components/TabSix";
import Header from "./components/Header";
import TabError from "./components/TabError";
import TabCanceled from "./components/TabCanceled";
import Footer from "./components/Footer";

class IndexPage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedStaff: [],
            selectedService: [],
            interval: 15,
            group:localStorage.getItem('userInfoOnlineZapis') ? JSON.parse(localStorage.getItem('userInfoOnlineZapis')) : { phone: ''},
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
        this.refreshTimetable=this.refreshTimetable.bind(this);
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
        this.setScreen = this.setScreen.bind(this);
        this.setTime = this.setTime.bind(this);
        this.setterPhone = this.setterPhone.bind(this);
        this.setterEmail = this.setterEmail.bind(this);





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
                        const checkingDay = parseInt(moment(time.dayMillis, 'x').format('D'));
                        const checkingDayTimesArray = time.availableTimes;

                        return checkingDay ===i && checkingDayTimesArray.length!==0 &&
                            time.availableTimes.some((timeOne)=>{
                                const countTimes = (timeOne.endTimeMillis - timeOne.startTimeMillis) / 1000 / 60 / 15 + 1;
                                const arrayTimes = []
                                for( let i = 0 ; i< countTimes; i++) {
                                    arrayTimes.push(timeOne.startTimeMillis + (1000 * 60 * 15 * i))
                                }

                                return arrayTimes.some(intervalTime => {
                                    const intervalTimeMillis =parseInt(moment(intervalTime, 'x').format('x'))
                                    const currentUserTimeMillis = parseInt(moment().utc().format('x'))
                                    return intervalTimeMillis >= currentUserTimeMillis;
                                })
                            })
                    })

                const checkingDate = parseInt(moment(moment(this.state.month).format('MMMM')+"/"+i, 'MMMM/D').utc().format('x'));
                const currentDate = parseInt(moment().utcOffset('-4').startOf('day').format('x'));

                if(avDay && avDay.length===0 || (checkingDate < currentDate)){
                    const pushedDay = new Date(moment(moment(this.state.month).format('MMMM')+"/"+i, 'MMMM/D').utcOffset('-4').format('YYYY-MM-DD HH:mm').replace(/-/g, "/"))
                    disabledDays.push(pushedDay)}

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


        if(staff.length===0){
            staffs && staffs.length && staffs.sort((a, b) => a.firstName.localeCompare(b.firstName)).map((staff, idStaff) =>
                nearestTime && nearestTime.map((time, id)=>{
                    if(time.staffId===staff.staffId && time.availableDays.length!==0){
                        staffId=staff
                    }
                }))
        }

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

        let daySelected = !modifiers.selected && moment(day);


        this.setState({
            selectedDay: daySelected ? daySelected.toDate() : this.state.selectedDay,
            screen: 4
        })
        this.refreshTimetable();
    }

    setScreen (num) {
        this.setState({
            screen: num,
        })
    }


    setterPhone(phone){
        const {group} = this.state
        this.setState({ group: {...group, phone: phone.replace(/[() ]/g, '')} })
    }
    setterEmail(){
        const {group} = this.state
        this.setState({
            emailIsValid: this.isValidEmailAddress(group.email)
        })
    }

    render() {
        const {selectedStaff, selectedService, selectedServices, approveF, disabledDays, selectedDay, staffs, services, numbers, workingStaff, info, selectedTime, screen, group, month, newAppointments, nearestTime }=this.state;

        const { error, isLoading } = this.props.staff;

        let servicesForStaff = selectedStaff.staffId && services && services.some((service, serviceKey) =>{
            return service.staffs && service.staffs.some(st=>st.staffId===selectedStaff.staffId)
        });

        return (

            <div className="container_popups">

                {info && <Header info={info}/>}

                <div className="service_selection_wrapper">
                    {screen === 1 &&
                    <TabOne
                        staffId={selectedStaff.staffId }
                        staffs={staffs}
                        nearestTime={nearestTime}
                        selectStaff={this.selectStaff}
                        setScreen={this.setScreen}
                        refreshTimetable={this.refreshTimetable}
                        roundDown={this.roundDown}
                    />}
                    {screen === 2 &&
                    <TabTwo
                        selectedServices={selectedServices}
                        selectedStaff={selectedStaff}
                        services={services}
                        selectedService={selectedService}
                        servicesForStaff={servicesForStaff}
                        setScreen={this.setScreen}
                        refreshTimetable={this.refreshTimetable}
                        selectService={this.selectService}
                    />}
                    {screen === 3 &&
                    <TabThird
                        selectedDay={selectedDay}
                        selectedStaff={selectedStaff}
                        selectedServices={selectedServices}
                        selectedService={selectedService}
                        disabledDays={disabledDays}
                        month={month}
                        MomentLocaleUtils={MomentLocaleUtils}
                        setScreen={this.setScreen}
                        refreshTimetable={this.refreshTimetable}
                        handleDayClick={this.handleDayClick}

                    />}
                    {screen === 4 &&
                    <TabFour
                        selectedTime={selectedTime}
                        selectedStaff={selectedStaff}
                        selectedService={selectedService}
                        selectedServices={selectedServices}
                        selectedDay={selectedDay}
                        workingStaff={workingStaff}
                        setScreen={this.setScreen}
                        refreshTimetable={this.refreshTimetable}
                        setTime={this.setTime}

                    />}
                    {screen === 5 &&
                    <TabFive
                        serviceId={selectedService.serviceId}
                        selectedStaff={selectedStaff}
                        selectedDay={selectedDay}
                        selectedServices={selectedServices}
                        selectedTime={selectedTime}
                        group={group}
                        setScreen={this.setScreen}
                        refreshTimetable={this.refreshTimetable}
                        handleChange={this.handleChange}
                        isValidEmailAddress={this.isValidEmailAddress}
                        setterPhone={this.setterPhone}
                        setterEmail={this.setterEmail}
                        handleSave={this.handleSave}

                    />

                    }

                    {screen === 6 && newAppointments && !!newAppointments.length && !error &&
                    <TabSix
                        selectedStaff={selectedStaff}
                        selectedService={selectedService}
                        selectedServices={selectedServices}
                        selectedDay={selectedDay}
                        selectedTime={selectedTime}
                        approveF={approveF}
                        newAppointments={newAppointments}
                        // onCancelVisit={this.onCancelVisit}
                        // approvedButtons={this.approvedButtons}
                        _delete={this._delete}
                        setScreen={this.setScreen}
                        refreshTimetable={this.refreshTimetable}
                        // setterApproveF={this.setterApproveF}
                    />}

                    { screen === 6 && error &&
                    <TabError
                        error={error}
                        setScreen={this.setScreen}
                    />}
                    {screen === 7 &&
                    <TabCanceled
                        setScreen={this.setScreen}
                    />
                    }
                    {isLoading && (<div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>)}
                </div>
                <Footer/>
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
        const {selectedStaff, staffs}=this.state;
        const {selectedServices} = this.state;
        const { checked } = e.target;

        if (checked) {
            selectedServices.push(service);
        } else {
            const index = selectedServices.findIndex(selectedService => selectedService.serviceId === service.serviceId)
            selectedServices.splice(index, 1);
        }

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

    refreshTimetable(newMonth = this.state.month) {
        const { selectedServices, selectedStaff } = this.state;
        const serviceIdList = this.getServiceIdList(selectedServices);
        const {company} = this.props.match.params;
        this.props.dispatch(staffActions.getTimetableAvailable(company, selectedStaff && selectedStaff.staffId, moment(newMonth).startOf('month').format('x'), moment(newMonth).endOf('month').format('x'), serviceIdList));
    }

    showPrevWeek (){
        const {month}=this.state;


        const newMonth= moment(month).subtract(1, 'month').toDate()
        this.setState({...this.state, month: newMonth})
        this.refreshTimetable(newMonth)
    }

    showNextWeek (){
        const { month }=this.state;

        const newMonth = moment(month).add(1, 'month').toDate()
        this.setState({...this.state, month: newMonth})
        this.refreshTimetable(newMonth)
    }

    roundDown(number, precision) {
        let date=moment(number, 'x').locale('ru')
        let time = Math.ceil((parseInt(moment(number, 'x').locale('ru').format('m')))/ 15) * 15

        if(time===60){
            return date.add(1, 'hour').format('MMMM DD, dd, HH')+":00";

        }else {
            return date.format('MMMM DD, dd,  HH')+":"+moment(time, 'm').format('mm')
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