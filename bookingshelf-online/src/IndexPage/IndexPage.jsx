import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import {staffActions} from "../../../bookingshelf-online/src/_actions";
import moment from 'moment';
import 'moment-duration-format';
import 'moment/locale/ru';
import 'moment-timezone';

import TabCompanySelection from "./components/TabCompanySelection";
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
            selectedSubcompany: {},
            selectedService: [],
            interval: 15,
            group:localStorage.getItem('userInfoOnlineZapis') ? JSON.parse(localStorage.getItem('userInfoOnlineZapis')) : { phone: ''},
            screen: 0,
            info: props.staff.info,
            month: moment().utc().toDate(),
            selectedDay: undefined,
            newAppointments: [],
            approveF: false,
            selectedServices: [],
            allPriceFrom: 0,
            allPriceTo: 0,
            flagAllStaffs: false
        };


        this.selectStaff=this.selectStaff.bind(this);
        this.clearStaff=this.clearStaff.bind(this);
        this.refreshTimetable=this.refreshTimetable.bind(this);
        this.selectService=this.selectService.bind(this);
        this.selectSubcompany=this.selectSubcompany.bind(this);
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
        this.setDefaultFlag = this.setDefaultFlag.bind(this);





    }



    componentDidMount () {
        let {company} = this.props.match.params
        company = company.includes('_') ? company.split('_')[0] : company


        this.props.dispatch(staffActions.getSubcompanies(company));
        this.props.dispatch(staffActions.getInfo(company));
    }

    componentWillReceiveProps(newProps) {
        if ( JSON.stringify(this.props.staff) !==  JSON.stringify(newProps.staff)) {
            if(newProps.staff.info) {
                document.title = newProps.staff.info.companyName + " | Онлайн-запись";
            }
            newProps.staff.info && moment.tz.setDefault(newProps.staff.info.timezoneId)

            let disabledDays=[];
            const defaultBlockedTime = (newProps.staff.info && !newProps.staff.info.onlineZapisOn && newProps.staff.info.onlineZapisEndTimeMillis)
                ? newProps.staff.info.onlineZapisEndTimeMillis
                : parseInt(moment().utc().add(6, 'month').format('x'))
            const monthMoment = moment(moment(this.state.month).format('MMMM'), 'MMMM')
            const year = parseInt(moment(this.state.month).format('YYYY'))
            const month = parseInt(moment(this.state.month).format('MM'))

            const firstDayOfMonth = parseInt(monthMoment.startOf('month').format('D'))
            let lastDayOfMonth = parseInt(monthMoment.endOf('month').format('D'))

            if ((year % 4 === 0) && month === 2) {
                lastDayOfMonth++;
            }
            for(let i=firstDayOfMonth; i<=lastDayOfMonth;i++) {
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

                const checkingDate = parseInt(moment(moment(this.state.month).format('YYYY/MMMM')+"/"+i, 'YYYY/MMMM/D').utc().format('x'));
                const currentDate = parseInt(moment().startOf('day').format('x'));

                if(avDay && avDay.length===0 || (checkingDate < currentDate) || checkingDate > defaultBlockedTime){
                    const pushedDay = new Date(moment(moment(this.state.month).format('YYYY/MMMM')+"/"+i, 'YYYY/MMMM/D').format('YYYY-MM-DD HH:mm').replace(/-/g, "/"))
                    disabledDays.push(pushedDay)}

            }

            newProps.staff && newProps.staff.timetableAvailable && newProps.staff.timetableAvailable.availableDays.length===0 && disabledDays.push( {before: moment(this.state.month).utc().endOf('month').add(1, 'day').toDate()});

            if (JSON.stringify(newProps.staff.newAppointment) !== JSON.stringify(this.props.staff.newAppointment)) {
                this.setState({ screen: 6})
            }

            this.setState({
                staffs: newProps.staff && newProps.staff.staff,
                newAppointments: newProps.staff.newAppointment,
                services: newProps.staff && newProps.staff.services,
                nearestTime:  newProps.staff && newProps.staff.nearestTime,
                workingStaff: newProps.staff.timetableAvailable && newProps.staff.timetableAvailable.availableDays,
                info: newProps.staff.info && newProps.staff.info, disabledDays: disabledDays,

            })
        }
        if ((!newProps.staff.superCompany && (this.props.staff.superCompany !== newProps.staff.superCompany))
        || (newProps.staff.info && (!newProps.staff.info.subCompanies && (newProps.staff.info.subCompanies !== (this.props.staff.info && this.props.staff.info.subCompanies))))) {
            this.setScreen(1)
        }
    }


    componentDidUpdate(prevProps, prevState) {
        initializeJs()
        if (prevState.screen === 0 && this.state.screen === 1) {
            let {company} = this.props.match.params

            this.props.dispatch(staffActions.getInfo(company));
            this.props.dispatch(staffActions.get(company));
            this.props.dispatch(staffActions.getNearestTime(company));
            this.props.dispatch(staffActions.getServices(company));
        }
    }

    clearStaff() {
        this.props.dispatch(staffActions.clearStaff());
    }

    setDefaultFlag(){
        this.setState({flagAllStaffs: false})
    }

    selectStaff (staff){
        const {staffs, services, numbers, workingStaff, info, selectedTime, screen, group, month, newAppointment, nearestTime }=this.state;
        let staffId=staff;
        if(staff.length === 0){
            this.setState({flagAllStaffs: true});
        }

        // if(staff.length===0){
        //     staffs && staffs.length && staffs.sort((a, b) => a.firstName.localeCompare(b.firstName)).map((staff, idStaff) =>
        //         nearestTime && nearestTime.map((time, id)=>{
        //             if(time.staffId===staff.staffId && time.availableDays.length!==0){
        //                 staffId=staff
        //             }
        //         }))
        // }
        this.setState({selectedStaff:staffId, screen: 2})
    }

    selectSubcompany(subcompany) {
        this.setState({ selectedSubcompany: subcompany, screen: 1 })
    }


    handleChange(e) {
        const { name, value } = e.target;
        const { group } = this.state;

        this.setState({ group: {...group, [name]: value }});
    }

    handleSave (codeInfo) {
        const { dispatch } = this.props;
        const { clientActivationId, clientVerificationCode } = this.props.staff;

        const { selectedStaff,selectedServices,group,selectedDay,selectedTime } = this.state;
        const {company} = this.props.match.params
        let resultTime = parseInt(selectedTime);

        localStorage.setItem('userInfoOnlineZapis', JSON.stringify(group))

        const data = selectedServices.map((selectedService) => {
            const item = {...group, duration: selectedService.duration, serviceId: selectedService.serviceId,
                appointmentTimeMillis: moment(moment(resultTime, 'x').format('HH:mm')+" "+moment(selectedDay).format('DD/MM/YYYY'), 'HH:mm DD/MM/YYYY').format('x')}
            resultTime += selectedService.duration * 1000;
            return item;
        });

        if (codeInfo) {
            data[0].clientActivationId = clientActivationId
            data[0].clientVerificationCode = clientVerificationCode
            dispatch(staffActions.add(company, selectedStaff.staffId, '', JSON.stringify(data)))
            this.setState({ ...this.state, screen: 6 })
        } else {
            dispatch(staffActions.add(company, selectedStaff.staffId, '', JSON.stringify(data)))
        }
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
        const { history, match } = this.props;
        const {selectedStaff, selectedSubcompany, selectedService, selectedServices, approveF, disabledDays, selectedDay, staffs, services, numbers, workingStaff, info, selectedTime, screen, group, month, newAppointments, nearestTime }=this.state;

        const { error, isLoading, clientActivationId, clientVerificationCode, subcompanies } = this.props.staff;

        let servicesForStaff = selectedStaff.staffId && services && services.some((service, serviceKey) =>{
            return service.staffs && service.staffs.some(st=>st.staffId===selectedStaff.staffId)
        });

        let content;

        if (info && !info.onlineZapisOn && (parseInt(moment().utc().format('x')) >= info.onlineZapisEndTimeMillis)) {
            content = (
                <div className="online-zapis-off">
                    Онлайн-запись для этой компании отключена
                </div>
            )
        } else if (!info && !error) {
            content = <div className="online-zapis-off">
                Подождите...
            </div>
        } else if (error) {
            content =  <div className="online-zapis-off">
                {error}
            </div>
        } else {
            content = (
                <React.Fragment>
                    {screen === 0 &&
                    <TabCompanySelection
                        match={match}
                        history={history}
                        selectSubcompany={this.selectSubcompany}
                        selectedSubcompany={selectedSubcompany}
                        subcompanies={subcompanies}
                        info={info}
                        staffId={selectedStaff.staffId }
                        staffs={staffs}
                        nearestTime={nearestTime}
                        selectStaff={this.selectStaff}
                        setScreen={this.setScreen}
                        refreshTimetable={this.refreshTimetable}
                        roundDown={this.roundDown}
                    />}
                    {screen === 1 &&
                    <TabOne
                        match={match}
                        history={history}
                        clearStaff={this.clearStaff}
                        subcompanies={subcompanies}
                        info={info}
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
                        setDefaultFlag={this.setDefaultFlag}
                    />}
                    {screen === 3 &&
                    <TabThird
                        selectedDay={selectedDay}
                        selectedStaff={selectedStaff}
                        selectedServices={selectedServices}
                        selectedService={selectedService}
                        disabledDays={disabledDays}
                        month={month}
                        setScreen={this.setScreen}
                        refreshTimetable={this.refreshTimetable}
                        handleDayClick={this.handleDayClick}
                        showPrevWeek={this.showPrevWeek}
                        showNextWeek={this.showNextWeek}
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
                        clientActivationId={clientActivationId}
                        clientVerificationCode={clientVerificationCode}
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
                        setDefaultFlag={this.setDefaultFlag}
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
                </React.Fragment>
            )
        }

        return (

            <div className="container_popups">

                {info && <Header selectedSubcompany={selectedSubcompany} screen={screen} info={info}/>}

                <div className="service_selection_wrapper">
                    {content}
                    {isLoading && (<div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>)}
                </div>
                <Footer/>
            </div>

        );
    }

    isValidEmailAddress(address) {
        return !! (address && address.match(/.+@.+/));
    }

    _delete(id) {
        this.props.dispatch(staffActions._delete(id));
        this.setScreen(7)
    }

    selectService (e, service) {
        const {selectedStaff, staffs}=this.state;
        const {selectedServices, nearestTime} = this.state;
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

            // if (selectedServices && selectedServices[0] && selectedServices[0].staffs && staffs) {
            //     changedStaff = staffs.filter((staff) => selectedServices[0].staffs[0].staffId === staff.staffId)[0]
            // }

            if(this.state.flagAllStaffs){
            selectedServices && selectedServices[0] && selectedServices[0].staffs.map((staff, idStaff) =>
                nearestTime && nearestTime.map((time, id)=>{
                    if(time.staffId===staff.staffId && time.availableDays.length!==0){
                        if (changedStaff.length === 0){
                            changedStaff = time;
                        } else if(time.availableDays[0].availableTimes[0].startTimeMillis < changedStaff.availableDays[0].availableTimes[0].startTimeMillis){
                            changedStaff = time;
                        }
                    }
            }))} else {
                if (selectedServices && selectedServices[0] && selectedServices[0].staffs && staffs) {
                        changedStaff = staffs.filter((staff) => selectedServices[0].staffs[0].staffId === staff.staffId)[0]
                    }
            }
            let imgChangedStaff = staffs && staffs.find(item => item.staffId === changedStaff.staffId).imageBase64;
            changedStaff.imageBase64 = imgChangedStaff;

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
        this.setState({selectedService:service, selectedServices, allPriceFrom, allPriceTo, numbers, selectedStaff: selectedStaff && selectedStaff.staffId ? selectedStaff : changedStaff,
            month:moment().utc().startOf('month').toDate()})

        if(selectedServices.length === 0 && this.state.flagAllStaffs){
            this.setState({selectedStaff: []})
        }
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
            return date.add(1, 'hour').format('MMMM DD');

        }else {
            return date.format('MMMM DD')
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
