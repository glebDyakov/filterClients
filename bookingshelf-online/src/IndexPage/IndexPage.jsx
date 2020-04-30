import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import {staffActions} from "../../../bookingshelf-online/src/_actions";
import moment from 'moment';
import 'moment-duration-format';
import 'moment/locale/ru';
import 'moment-timezone';
import { isValidEmailAddress } from "../_helpers/validators";
import Helmet from "react-helmet";

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
import TabStaffComments from "./components/TabStaffComments";
import TabCreateComment from "./components/TabCreateComment";
import { getFirstScreen } from "../_helpers/common";

class IndexPage extends PureComponent {
    constructor(props) {
        super(props);
        const group = localStorage.getItem('userInfoOnlineZapis') ? JSON.parse(localStorage.getItem('userInfoOnlineZapis')) : { phone: ''}
        group.description = '';
        if (!group.carBrand) {
            group.carBrand = '';
        }
        if (!group.carNumber) {
            group.carNumber = '';
        }
        this.state = {
            selectedStaff: [],
            selectedSubcompany: {},
            selectedService: [],
            interval: 15,
            group: group,
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
        this.handleMoveVisit=this.handleMoveVisit.bind(this);
        this.getDurationForCurrentStaff = this.getDurationForCurrentStaff.bind(this);
        this.clearStaff=this.clearStaff.bind(this);
        this.refreshTimetable=this.refreshTimetable.bind(this);
        this.selectService=this.selectService.bind(this);
        this.selectSubcompany=this.selectSubcompany.bind(this);
        this.setStaffComments=this.setStaffComments.bind(this);
        this.handleDayClick=this.handleDayClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.isValidEmailAddress = this.isValidEmailAddress.bind(this);
        this.forceUpdateStaff = this.forceUpdateStaff.bind(this);
        this.showNextWeek = this.showNextWeek.bind(this);
        this.showPrevWeek = this.showPrevWeek.bind(this);
        this._delete = this._delete.bind(this);
        this._move = this._move.bind(this);
        this.roundDown = this.roundDown.bind(this);
        this.getServiceIdList = this.getServiceIdList.bind(this);
        this.setScreen = this.setScreen.bind(this);
        this.setTime = this.setTime.bind(this);
        this.setterPhone = this.setterPhone.bind(this);
        this.setterEmail = this.setterEmail.bind(this);
        this.setDefaultFlag = this.setDefaultFlag.bind(this);
        this.clearSelectedServices = this.clearSelectedServices.bind(this);
    }

    componentDidMount () {
        let {company} = this.props.match.params
        company = company.includes('_') ? company.split('_')[0] : company


        this.props.dispatch(staffActions.getSubcompanies(company));
        this.props.dispatch(staffActions.getInfo(company));
        if (this.props.staff.isStartMovingVisit) {
            this.setScreen(1)
        }
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
                    newProps.staff.timetableAvailable.filter(timetableItem => timetableItem.availableDays && timetableItem.availableDays.some((time, key, elements) =>{
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
                    );

                const checkingDate = parseInt(moment(moment(this.state.month).format('YYYY/MMMM')+"/"+i, 'YYYY/MMMM/D').utc().format('x'));
                const currentDate = parseInt(moment().startOf('day').format('x'));

                if(avDay && avDay.length===0 || (checkingDate < currentDate) || checkingDate > defaultBlockedTime){
                    const pushedDay = new Date(moment(moment(this.state.month).format('YYYY/MMMM')+"/"+i, 'YYYY/MMMM/D').format('YYYY-MM-DD HH:mm').replace(/-/g, "/"))
                    disabledDays.push(pushedDay)}

            }

            newProps.staff && newProps.staff.timetableAvailable && newProps.staff.timetableAvailable.every(timetableItem => timetableItem.availableDays && timetableItem.availableDays.length===0) && disabledDays.push( {before: moment(this.state.month).utc().endOf('month').add(1, 'day').toDate()});

            if (JSON.stringify(newProps.staff.newAppointment) !== JSON.stringify(this.props.staff.newAppointment)) {
                this.setState({ screen: 6})
            }

            this.setState({
                staffs: newProps.staff && newProps.staff.staff,
                newAppointments: newProps.staff.newAppointment,
                services: newProps.staff && newProps.staff.services,
                nearestTime:  newProps.staff && newProps.staff.nearestTime,
                info: newProps.staff.info && newProps.staff.info, disabledDays: disabledDays,

            })
        }
        if (newProps.staff.info && ((!newProps.staff.superCompany && (this.props.staff.superCompany !== newProps.staff.superCompany))
        || (newProps.staff.info && (!newProps.staff.info.subCompanies && (newProps.staff.info.subCompanies !== (this.props.staff.info && this.props.staff.info.subCompanies)))))) {
            this.setScreen(getFirstScreen(newProps.staff.info.firstScreen))
        }

        if (!this.state.firstScreenSet && newProps.staff.info && !newProps.staff.info.subCompanies) {
            const screen = getFirstScreen(newProps.staff.info.firstScreen)
            this.setScreen(screen)
            this.setState({ firstScreenSet: true })
            if (screen === 2) {
                this.setState({ flagAllStaffs: true})
            }
        }

    }


    componentDidUpdate(prevProps, prevState) {
        initializeJs()
        if ((prevState.screen === 0) && (this.state.screen === 1 || this.state.screen === 2)) {
            let {company} = this.props.match.params

            this.props.dispatch(staffActions.getInfo(company));
            this.props.dispatch(staffActions.get(company));
            this.props.dispatch(staffActions.getNearestTime(company));
            this.props.dispatch(staffActions.getServices(company));
            this.props.dispatch(staffActions.getServiceGroups(company));
        }
    }

    getDurationForCurrentStaff(service) {
        const { selectedStaff } = this.state
        let durationForCurrentStaff = service.duration;
        selectedStaff && selectedStaff.staffId && service.staffs && service.staffs.forEach(item => {
            if ((item.staffId === selectedStaff.staffId) && item.serviceDuration) {
                durationForCurrentStaff = item.serviceDuration
            }
        })
        return durationForCurrentStaff;
    }

    clearSelectedServices() {
        this.setState({ selectedServices: [], selectedService: [] });
    }

    clearStaff() {
        this.props.dispatch(staffActions.clearStaff());
    }

    setDefaultFlag(){
        this.setState({flagAllStaffs: false})
    }

    selectStaff (staff){
        const { isStartMovingVisit } = this.props.staff
        const { flagAllStaffs }=this.state;
        let screen = 2;

        if((staff && staff.length) === 0){
            this.setState({flagAllStaffs: true});
        }

        if (flagAllStaffs) {
            screen = 3;
            this.refreshTimetable(this.state.month, staff)
        }
        if (isStartMovingVisit) {
            screen = 3;
        }
        this.setState({selectedStaff: staff})
        this.setScreen(screen)
    }

    forceUpdateStaff(selectedStaff) {
        this.setState({ selectedStaff })
    }

    selectSubcompany(subcompany) {
        const updatedState = {}
        const firstScreen = getFirstScreen(subcompany.firstScreen)
        if (firstScreen === 2) {
            updatedState.flagAllStaffs = true
        }
        this.setState({ selectedSubcompany: subcompany, screen: firstScreen, ...updatedState })
    }

    handleChange(e) {
        const { name, value } = e.target;
        const { group } = this.state;

        this.setState({ group: {...group, [name]: value }});
    }

    handleSave (codeInfo) {
        const { dispatch } = this.props;

        const { selectedStaff,selectedServices,group,selectedDay,selectedTime } = this.state;
        const {company} = this.props.match.params
        let resultTime = parseInt(selectedTime);

        localStorage.setItem('userInfoOnlineZapis', JSON.stringify(group))

        const data = selectedServices.map((selectedService) => {
            const item = {...group, duration: this.getDurationForCurrentStaff(selectedService), serviceId: selectedService.serviceId,
                appointmentTimeMillis: moment(moment(resultTime, 'x').format('HH:mm')+" "+moment(selectedDay).format('DD/MM/YYYY'), 'HH:mm DD/MM/YYYY').format('x')}
            resultTime += this.getDurationForCurrentStaff(selectedService) * 1000;
            return item;
        });

        if (codeInfo) {
            data[0].clientActivationId = codeInfo.clientActivationId
            data[0].clientVerificationCode = codeInfo.clientVerificationCode
            dispatch(staffActions.add(company, selectedStaff.staffId, '', JSON.stringify(data)))
        } else {
            dispatch(staffActions.add(company, selectedStaff.staffId, '', JSON.stringify(data)))
        }
        this.setDefaultFlag();
    }


    handleDayClick(day, modifiers = {}) {
        const { isStartMovingVisit } = this.props.staff
        if (modifiers.disabled) {
            return;
        }

        let daySelected = !modifiers.selected && moment(day);


        this.setState({
            selectedDay: daySelected ? daySelected.toDate() : this.state.selectedDay,
            screen: 4
        })
        //if (!isStartMovingVisit) {
            this.refreshTimetable();
        //}
    }

    setStaffComments(staffId) {
        const { company } = this.props.match.params;
        this.props.dispatch(staffActions.getStaffComments(company, staffId))
    }

    setScreen (num) {
        this.setState({
            screen: num,
        })
    }


    setterPhone(phone){
        const {group} = this.state
        this.setState({ group: {...group, phone: phone.replace(/[()\- ]/g, '')} })
    }
    setterEmail(){
        const {group} = this.state
        this.setState({
            emailIsValid: this.isValidEmailAddress(group.email)
        })
    }

    render() {
        const { history, match } = this.props;
        const { selectedStaff, selectedSubcompany, flagAllStaffs, selectedService, selectedServices, approveF, disabledDays, selectedDay, staffs, services, info, selectedTime, screen, group, month, newAppointments, nearestTime }=this.state;

        const { error, isLoading: isLoadingFromProps, isLoadingServices, clientActivationId, timetableAvailable, isStartMovingVisit, movingVisit, movedVisitSuccess, subcompanies, serviceGroups, enteredCodeError, clients } = this.props.staff;

        const isLoading = isLoadingFromProps || isLoadingServices
        let servicesForStaff = selectedStaff.staffId && services && services.some((service, serviceKey) =>{
            return service.staffs && service.staffs.some(st=>st.staffId===selectedStaff.staffId)
        });

        let content;

        if (!info && !error) {
            content = <div className="online-zapis-off">
                Подождите...
            </div>
        } else if (error) {
            content =  <div className="online-zapis-off">
                {error}
                {(error.startsWith('Онлайн-запись отключена.') && subcompanies.length > 1) && (
                    <button onClick={() => {
                        this.setScreen(0)
                        this.props.dispatch(staffActions.clearError());
                        let {company} = match.params;
                        let url = company.includes('_') ? company.split('_')[0] : company
                        history.push(`/${url}`)
                    }} style={{ marginTop: '4px', marginBottom: '20px' }} className="book_button">На страницу выбора филиалов</button>
                )}
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
                        isLoading={isLoading}
                        error={error}
                        newAppointments={newAppointments}
                        handleMoveVisit={this.handleMoveVisit}
                        handleDayClick={this.handleDayClick}
                        forceUpdateStaff={this.forceUpdateStaff}
                        selectedTime={selectedTime}
                        timetableAvailable={timetableAvailable}
                        setStaffComments={this.setStaffComments}
                        setDefaultFlag={this.setDefaultFlag}
                        match={match}
                        history={history}
                        clearStaff={this.clearStaff}
                        subcompanies={subcompanies}
                        flagAllStaffs={flagAllStaffs}
                        selectedServices={selectedServices}
                        info={info}
                        movingVisit={movingVisit}
                        services={services}
                        staffId={selectedStaff.staffId }
                        staffs={staffs}
                        isStartMovingVisit={isStartMovingVisit}
                        nearestTime={nearestTime}
                        selectStaff={this.selectStaff}
                        setScreen={this.setScreen}
                        selectService={this.selectService}
                        refreshTimetable={this.refreshTimetable}
                        roundDown={this.roundDown}
                    />}
                    {screen === 'staff-comments' &&
                    <TabStaffComments
                        isLoading={isLoading}
                        setStaffComments={this.setStaffComments}
                        setDefaultFlag={this.setDefaultFlag}
                        match={match}
                        history={history}
                        clearStaff={this.clearStaff}
                        subcompanies={subcompanies}
                        flagAllStaffs={flagAllStaffs}
                        selectedServices={selectedServices}
                        info={info}
                        movingVisit={movingVisit}
                        services={services}
                        staffId={selectedStaff.staffId }
                        staffs={staffs}
                        isStartMovingVisit={isStartMovingVisit}
                        nearestTime={nearestTime}
                        selectStaff={this.selectStaff}
                        setScreen={this.setScreen}
                        selectService={this.selectService}
                        refreshTimetable={this.refreshTimetable}
                        roundDown={this.roundDown}
                    />
                    }
                    {screen === 'staff-create-comment' &&
                    <TabCreateComment
                        isLoading={isLoading}
                        setStaffComments={this.setStaffComments}
                        setDefaultFlag={this.setDefaultFlag}
                        match={match}
                        history={history}
                        clearStaff={this.clearStaff}
                        subcompanies={subcompanies}
                        flagAllStaffs={flagAllStaffs}
                        selectedServices={selectedServices}
                        info={info}
                        movingVisit={movingVisit}
                        services={services}
                        staffId={selectedStaff.staffId }
                        staffs={staffs}
                        isStartMovingVisit={isStartMovingVisit}
                        nearestTime={nearestTime}
                        selectStaff={this.selectStaff}
                        setScreen={this.setScreen}
                        selectService={this.selectService}
                        refreshTimetable={this.refreshTimetable}
                        roundDown={this.roundDown}
                    />
                    }
                    {screen === 2 &&
                    <TabTwo
                        info={info}
                        error={error}
                        isLoading={isLoading}
                        history={history}
                        match={match}
                        firstScreen={info.firstScreen}
                        isStartMovingVisit={isStartMovingVisit}
                        clearSelectedServices={this.clearSelectedServices}
                        flagAllStaffs={flagAllStaffs}
                        serviceGroups={serviceGroups}
                        subcompanies={subcompanies}
                        selectedServices={selectedServices}
                        selectedStaff={selectedStaff}
                        services={services}
                        selectedService={selectedService}
                        servicesForStaff={servicesForStaff}
                        setScreen={this.setScreen}
                        refreshTimetable={this.refreshTimetable}
                        selectService={this.selectService}
                        setDefaultFlag={this.setDefaultFlag}
                        getDurationForCurrentStaff={this.getDurationForCurrentStaff}
                    />}
                    {screen === 3 &&
                    <TabThird
                        setDefaultFlag={this.setDefaultFlag}
                        isStartMovingVisit={isStartMovingVisit}
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
                        getDurationForCurrentStaff={this.getDurationForCurrentStaff}
                    />}
                    {screen === 4 &&
                    <TabFour
                        flagAllStaffs={flagAllStaffs}
                        serviceIntervalOn={info.serviceIntervalOn}
                        isStartMovingVisit={isStartMovingVisit}
                        selectedTime={selectedTime}
                        selectedStaff={selectedStaff}
                        selectedService={selectedService}
                        selectedServices={selectedServices}
                        selectedDay={selectedDay}
                        timetableAvailable={timetableAvailable}
                        setScreen={this.setScreen}
                        refreshTimetable={this.refreshTimetable}
                        setTime={this.setTime}
                        staffs={staffs}
                        movingVisit={movingVisit}
                        selectStaff={this.selectStaff}
                        handleDayClick={this.handleDayClick}
                        getDurationForCurrentStaff={this.getDurationForCurrentStaff}
                    />}
                    {screen === 5 &&
                    <TabFive
                        info={info}
                        setDefaultFlag={this.setDefaultFlag}
                        flagAllStaffs={flagAllStaffs}
                        forceUpdateStaff={this.forceUpdateStaff}
                        enteredCodeError={enteredCodeError}
                        serviceId={selectedService.serviceId}
                        clientActivationId={clientActivationId}
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
                        getDurationForCurrentStaff={this.getDurationForCurrentStaff}
                    />
                    }

                    {screen === 6 && ((newAppointments && !!newAppointments.length) || movedVisitSuccess) && !error &&
                    <TabSix
                        info={info}
                        match={match}
                        movedVisitSuccess={movedVisitSuccess}
                        movingVisit={movingVisit}
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
                        _move={this._move}
                        setScreen={this.setScreen}
                        refreshTimetable={this.refreshTimetable}
                        setDefaultFlag={this.setDefaultFlag}
                        getDurationForCurrentStaff={this.getDurationForCurrentStaff}
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

        const title = `Онлайн-запись в ${info ? info.companyName : ''}`;
        const description = `${title}. Вы можете записаться онлайн используя нашу страницу и виджет онлайн-записи. Онлайн-запись доступна круглосуточно.`
        return (
          <React.Fragment>
            {info && info.companyName && <Helmet>
                <meta name="title" content={title} />
                <meta name="description" content={description} />
                <meta property="og:description" content={description} />
                <meta name="twitter:description" content={description} />
            </Helmet>}
            <div className="container_popups">

                {info && <Header selectedSubcompany={selectedSubcompany} screen={screen} info={info}/>}

                <div className="service_selection_wrapper">
                    {content}
                    {isLoading && (<div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>)}
                </div>
                <Footer/>
            </div>
          </React.Fragment>
        );
    }

    isValidEmailAddress(address) {
        return isValidEmailAddress(address);
    }

    _delete(id) {
        this.props.dispatch(staffActions._delete(id));
        this.setScreen(7)
    }

    _move(visit) {
        this.props.dispatch(staffActions.toggleStartMovingVisit(true, visit));
        this.props.dispatch(staffActions.toggleMovedVisitSuccess(false));
        this.setScreen(1)
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
        //let changedStaff = selectedStaff;

        if (selectedServices && selectedServices.length) {

            // if (selectedServices && selectedServices[0] && selectedServices[0].staffs && staffs) {
            //     changedStaff = staffs.filter((staff) => selectedServices[0].staffs[0].staffId === staff.staffId)[0]
            // }

            // if(this.state.flagAllStaffs){
            // selectedServices && selectedServices[0] && selectedServices[0].staffs && selectedServices[0].staffs.map((staff, idStaff) =>
            //     nearestTime && nearestTime.map((time, id)=>{
            //         if(time.staffId===staff.staffId && time.availableDays.length!==0){
            //             if (changedStaff.length === 0){
            //                 changedStaff = time;
            //             } else if(time.availableDays[0].availableTimes[0].startTimeMillis < changedStaff.availableDays[0].availableTimes[0].startTimeMillis){
            //                 changedStaff = time;
            //             }
            //         }
            // }))} else {
            //     if (selectedServices && selectedServices[0] && selectedServices[0].staffs && staffs) {
            //             changedStaff = staffs.filter((staff) => selectedServices[0].staffs[0].staffId === staff.staffId)[0]
            //         }
            // }
            // let imgChangedStaff = staffs && staffs.find(item => item.staffId === changedStaff.staffId).imageBase64;
            // changedStaff.imageBase64 = imgChangedStaff;

            let totalDuration = 0;
            selectedServices.forEach(service => {
                allPriceFrom += service.priceFrom
                allPriceTo += service.priceTo
                totalDuration += this.getDurationForCurrentStaff(service)
            })
            for (let i = parseInt(moment().utc().startOf('day').format('H')) * 60; i <= parseInt(moment().utc().endOf('day').format('H')) * 60; i = i + parseInt(totalDuration)) {
                numbers.push(moment(moment().utc().startOf('day').utc().format('x'), "x").add(i, 'minutes').format('x'))
            }

        }
        this.setState({selectedService:service, selectedServices, allPriceFrom, allPriceTo, numbers,
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

    handleMoveVisit(time = this.state.selectedTime) {
        const { dispatch } = this.props
        const { movingVisit, staff } = this.props.staff
        const { selectedStaff} = this.state;
        let coStaffs;
        if (movingVisit[0].coStaffs && movingVisit[0].staffId !== selectedStaff.staffId) {
            const updatedCoStaff = staff.find(item => item.staffId === movingVisit[0].staffId)
            const oldStaffIndex = movingVisit[0].coStaffs.findIndex(item => item.staffId === selectedStaff.staffId)
            coStaffs = [
                ...movingVisit[0].coStaffs,
            ]
            if (oldStaffIndex !== -1) {
                movingVisit[0].coStaffs.splice(oldStaffIndex, 1)
                coStaffs.push(updatedCoStaff)
            }

        }
        dispatch(staffActions._move(movingVisit, time, selectedStaff.staffId, this.props.match.params.company, coStaffs));
        this.setState({ screen: 6, selectedTime: time })
    }

    setTime (time, shouldMove){
        const { flagAllStaffs } = this.state;

        if (shouldMove) {
            this.handleMoveVisit(time)
        } else {
            const updatedState = {}
            let screen = 5;

            if (flagAllStaffs) {
                screen = 1;
            }

            this.setState({
                newAppointments: [],
                selectedTime:time,
                screen,
                ...updatedState
            });
        }

    }

    refreshTimetable(newMonth = this.state.month, selectedStaff = this.state.selectedStaff) {
        const { movingVisit } = this.props.staff
        const { selectedServices, services, flagAllStaffs } = this.state;
        let serviceIdList = this.getServiceIdList(selectedServices);
        const {company} = this.props.match.params;
        let appointmentsIdList = ''
        let staffsIdList = '';
        if (movingVisit && movingVisit[0]) {
            serviceIdList = ''
            movingVisit.forEach((visit, i) => {
                appointmentsIdList += `${i === 0 ? '' : ','}${visit.appointmentId}`
                const activeService = services.find(item => item.serviceId === visit.serviceId)
                const activeSelectedService = selectedServices.find(item => item.serviceId === visit.serviceId)
                if (activeService && !activeSelectedService) {
                    this.selectService({target: {checked: true}}, activeService)
                }
                serviceIdList += `${i === 0 ? '' : ','}${visit.serviceId}`

            })

            if (movingVisit[0].coStaffs) {
                staffsIdList = selectedStaff.staffId === movingVisit[0].staffId ? '' : `,${movingVisit[0].staffId}`
                movingVisit[0].coStaffs.forEach(item => {
                    staffsIdList += item.staffId === selectedStaff.staffId ? '' : `,${item.staffId}`
                })
            }

        }

        if (serviceIdList) {
            this.props.dispatch(staffActions.getTimetableAvailable(
                company,
                flagAllStaffs ? null : selectedStaff.staffId,
                moment(newMonth).startOf('month').format('x'),
                moment(newMonth).endOf('month').format('x'),
                serviceIdList,
                appointmentsIdList,
                staffsIdList
            ));
        }
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
