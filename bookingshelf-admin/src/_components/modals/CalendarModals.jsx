import React, {Component} from 'react';
import {connect} from 'react-redux';
import {NewClient} from "./NewClient";
import {ClientDetails} from "./ClientDetails";
import {AddAppointment} from "../../_components/modals/AddAppointment";
import {ReservedTime} from "./ReservedTime";
import DeleteAppointment from "./DeleteAppointment";
import DeleteReserve from "./DeleteReserve";
import {MoveVisit} from "./MoveVisit";
import moment from 'moment';
import {staffActions} from "../../_actions";


class CalendarModals extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newClientModal: false,
            editClient: false,
            appointmentModal: false,
            clients: props.client,
            services: props.services,
            appointmentEdited: null,
            reserved: false,
            minutesReservedtime:[],
            staffId: null

        }
        this.updateClient = this.updateClient.bind(this);
        this.checkUser = this.checkUser.bind(this);
        this.addClient = this.addClient.bind(this);
        this.changeTime = this.changeTime.bind(this);
        this.onCloseClient = this.onCloseClient.bind(this);
        this.onCloseAppointment = this.onCloseAppointment.bind(this);
        this.onCloseReserved = this.onCloseReserved.bind(this);
        this.handleEditClient = this.handleEditClient.bind(this);
        this.newAppointment = this.newAppointment.bind(this);
        this.newReservedTime = this.newReservedTime.bind(this);
        this.checkAvaibleTime = this.checkAvaibleTime.bind(this);
    }
    updateClient(client){
        this.props.updateClient(client);
    };
    addClient(client){
        this.props.addClient(client);
    };
    onCloseClient(){
        this.setState({newClientModal: false});
    }

    handleEditClient(client, isModalShouldPassClient) {
        if(client) {
            this.setState({ editClient: true, client_working: client, isModalShouldPassClient, newClientModal: true});
        } else {
            this.setState({ editClient: false, client_working: null, isModalShouldPassClient, newClientModal: true});
        }
    }
    newAppointment(appointment, serviceId, staffId, clientId, coStaffs) {
        this.props.newAppointment(appointment, serviceId, staffId, clientId, coStaffs);
    }

    changeTime(time, staffId, number, edit_appointment, appointment) {
        this.setState({ appointmentModal: true, minutesReservedtime:[] });
        this.props.changeTime(time, staffId, number, edit_appointment, appointment);
    }
    onCloseAppointment(){
        this.setState({ appointmentModal:false });
        this.props.onClose();
    }

    onCloseReserved(){
        this.setState({ reserved :false });
        this.props.onClose();
    }

    newReservedTime(staffId, reservedTime) {
        this.props.newReservedTime(staffId, reservedTime);
    }
    changeReservedTime(minutesReservedtime, staffId, newTime=null){
        // this.checkAvaibleTime();
        this.setState({ reserved: true })
        return this.props.changeReservedTime(minutesReservedtime, staffId, newTime);
    }

    checkUser(checkedUser) {
        this.setState({ checkedUser, appointmentModal: true })
    }
    checkAvaibleTime(){
        const {selectedDayMoment, selectedDays, type} = this.props;
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

    render(){
        const {clients, minutes, appointmentModal: appointmentModalFromProps, infoClient, edit_appointment, adding, status,
            services, staffClicked, appointmentEdited, clickedTime, selectedDayMoment, selectedDay, workingStaff, numbers, type, staff,
            reserved: reservedFromProps, getByStaffKey, moveVisit, minutesReservedtime, reservedTimeEdited, reservedStuffId, appointmentForDeleting
        } = this.props;

        const {newClientModal, appointmentModal, reserved, editClient, checkedUser, client_working, isModalShouldPassClient} = this.state;

        return(<React.Fragment>
                    {type==='day' && workingStaff.timetable && workingStaff.timetable[0] &&
                    <a className="add" href="#"/>}
                    <div className="hide buttons-container">
                        <div className="p-4">
                            <button type="button"
                                    onClick={()=>this.changeTime(selectedDayMoment.startOf('day').format('x'), workingStaff.timetable[0], numbers)}
                                    className="button">Новая запись
                            </button>
                            <button type="button"
                                    onClick={()=>this.changeReservedTime(selectedDayMoment.startOf('day').format('x'), workingStaff.timetable[0], null)}
                                    className="button">Зарезервированное время
                            </button>
                        </div>
                        <div className="arrow"/>
                    </div>
                    {newClientModal &&
                    <NewClient
                        client_working={client_working}
                        edit={editClient}
                        isModalShouldPassClient={isModalShouldPassClient}
                        updateClient={this.updateClient}
                        checkUser={this.checkUser}
                        addClient={this.addClient}
                        onClose={this.onCloseClient}
                    />
                    }
                    {(appointmentModal || appointmentModalFromProps) &&
                    <AddAppointment
                        clients={clients}
                        checkedUser={checkedUser}
                        staff={staff && staff.staff}
                        staffs={staff}
                        randNum={Math.random()}
                        addAppointment={this.newAppointment}
                        editAppointment={this.editAppointment}
                        adding={adding}
                        status={status}
                        handleEditClient={this.handleEditClient}
                        services={services}
                        clickedTime={clickedTime}
                        minutes={minutes}
                        staffId={staffClicked}
                        selectedDayMoment={selectedDayMoment}
                        selectedDay={selectedDay}
                        appointmentEdited={appointmentEdited}
                        getHours={this.changeTime}
                        edit_appointment={edit_appointment}
                        onClose={this.onCloseAppointment}
                        type={type}
                    />
                    }
                    <ClientDetails
                        clientId={infoClient}
                        editClient={this.handleEditClient}
                    />
                    {(reservedFromProps || reserved) &&
                    <ReservedTime
                        timetable={workingStaff.timetable}
                        staffs={staff}
                        minutesReservedtime={minutesReservedtime}
                        getHours={(minutesReservedtime, staffId, newTime) => this.changeReservedTime(minutesReservedtime, staffId, newTime)}
                        staff={staff && staff.staff}
                        newReservedTime={this.newReservedTime}
                        reservedTimeEdited={reservedTimeEdited}
                        clickedTime={clickedTime}
                        reservedStuffId={reservedStuffId}
                        onClose={this.onCloseReserved}
                    />
                    }
                    <MoveVisit getByStaffKey={getByStaffKey} moveVisit={moveVisit} />
                    <DeleteAppointment
                        appointmentForDeleting={appointmentForDeleting}
                    />
                    <DeleteReserve />

        </React.Fragment>
        );

    }


}
const connectedMainIndexPage = connect(null)(CalendarModals);
export {connectedMainIndexPage as CalendarModals};
