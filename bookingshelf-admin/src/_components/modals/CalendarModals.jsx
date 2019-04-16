import React, {Component} from 'react';
import {connect} from 'react-redux';
import {NewClient} from "./NewClient";
import {ClientDetails} from "./ClientDetails";
import {AddAppointment} from "../../_components/modals/AddAppointment";
import {ReservedTime} from "./ReservedTime";
import {UserSettings} from "./UserSettings";
import {UserPhoto} from "./UserPhoto";
import {ApproveAppointment} from "./ApproveAppointment";
import {DeleteAppointment} from "./DeleteAppointment";
import {DeleteReserve} from "./DeleteReserve";


class CalendarModals extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newClientModal: false,
            client_working: {},
            editClient: false,
            appointmentModal: false,
            clients: props.client,
            services: props.services,
            appointmentEdited: null,
            reserved: false,
            minutesReservedtime:[],
            userSettings: false,
            staffId: null

        }
        this.updateClient = this.updateClient.bind(this);
        this.addClient = this.addClient.bind(this);
        this.onCloseClient = this.onCloseClient.bind(this);
        this.onCloseAppointment = this.onCloseAppointment.bind(this);
        this.onCloseReserved = this.onCloseReserved.bind(this);
        this.handleEditClient = this.handleEditClient.bind(this);
        this.newAppointment = this.newAppointment.bind(this);
        this.newReservedTime = this.newReservedTime.bind(this);
        this.deleteReserve = this.deleteReserve.bind(this);
        this.deleteAppointment = this.deleteAppointment.bind(this);
        this.onUserSettingsClose = this.onUserSettingsClose.bind(this);
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

    deleteAppointment(id){
        this.props.deleteAppointment(id);
    }

    handleEditClient(id) {
        const { clients } = this.props;

        console.log('id', id);
        console.log('clients', clients);
        if(id!=null) {
            const client_working = clients.client.find((item) => {return id === item.clientId});

            this.setState({ editClient: true, client_working: client_working, newClientModal: true});
        } else {
            this.setState({ editClient: false, client_working: {}, newClientModal: true});
        }
    }
    newAppointment(appointment, serviceId, staffId, clientId) {

        this.props.newAppointment(appointment, serviceId, staffId, clientId);
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

    onUserSettingsClose() {
        this.setState({ userSettings :false });
        this.props.onClose();
    }

    newReservedTime(staffId, reservedTime) {
        this.props.newReservedTime(staffId, reservedTime);
    }
    changeReservedTime(minutesReservedtime, staffId, newTime=null){
        this.setState({ reserved: true })
        this.props.changeReservedTime(minutesReservedtime, staffId, newTime);
    }
    deleteReserve(stuffId, id){
        this.props.deleteReserve(stuffId, id);
    }

    render(){
        const {clients, minutes, appointmentModal: appointmentModalFromProps, infoClient, edit_appointment, staffAll,
            services, calendar, staffClicked, appointmentEdited, clickedTime, selectedDayMoment, workingStaff, numbers, type,
            reserved: reservedFromProps, minutesReservedtime, reservedTimeEdited, reservedTime, reservedStuffId, approvedId, reserveId, reserveStId, userSettings: userSettingsFromProps }
            = this.props;

        const {newClientModal, appointmentModal, reserved, userSettings, client_working, editClient} = this.state;


        return(<React.Fragment>
                    {type==='day' && workingStaff.availableTimetable && workingStaff.availableTimetable[0] &&
                    <a className="add" href="#"/>}
                    <div className="hide buttons-container">
                        <div className="p-4">
                            <button type="button"
                                    onClick={()=>this.changeTime(selectedDayMoment.startOf('day').format('x'), workingStaff.availableTimetable[0], numbers)}
                                    className="button">Новая запись
                            </button>
                            <button type="button"
                                    onClick={()=>this.changeReservedTime(selectedDayMoment.startOf('day').format('x'), workingStaff.availableTimetable[0], null)}
                                    className="button">Зарезервированное время
                            </button>
                        </div>
                        <div className="arrow"/>
                    </div>
                    {newClientModal &&
                    <NewClient
                        client_working={client_working}
                        edit={editClient}
                        updateClient={this.updateClient}
                        addClient={this.addClient}
                        onClose={this.onCloseClient}
                    />
                    }
                    {(appointmentModal || appointmentModalFromProps) &&
                    <AddAppointment
                        clients={clients}
                        staffs={staffAll}
                        randNum={Math.random()}
                        addAppointment={this.newAppointment}
                        editAppointment={this.editAppointment}
                        appointments={calendar && calendar}
                        handleEditClient={this.handleEditClient}
                        services={services}
                        clickedTime={clickedTime}
                        minutes={minutes}
                        staffId={staffClicked}
                        appointmentEdited={appointmentEdited}
                        getHours={this.changeTime}
                        edit_appointment={edit_appointment}
                        onClose={this.onCloseAppointment}

                    />
                    }
                    <ClientDetails
                        client={infoClient}
                        editClient={this.handleEditClient}
                    />
                    {(reservedFromProps || reserved) &&
                    <ReservedTime
                        staffs={staffAll}
                        minutesReservedtime={minutesReservedtime}
                        getHours={(minutesReservedtime, staffId, newTime) => this.changeReservedTime(minutesReservedtime, staffId, newTime)}
                        newReservedTime={this.newReservedTime}
                        reservedTimeEdited={reservedTimeEdited}
                        reservedTime={reservedTime}
                        clickedTime={clickedTime}
                        reservedStuffId={reservedStuffId}
                        onClose={this.onCloseReserved}
                    />
                    }
                    {(userSettingsFromProps || userSettings) &&
                    <UserSettings
                        onClose={this.onUserSettingsClose}
                    />
                    }
                    <UserPhoto/>
                    <ApproveAppointment
                        id={approvedId}
                        approve={this.approveAppointment}
                    />
                    <DeleteAppointment
                        id={approvedId}
                        cancel={this.deleteAppointment}
                    />
                    <DeleteReserve
                        id={reserveId}
                        staffId={reserveStId}
                        cancel={this.deleteReserve}
                    />

        </React.Fragment>
        );

    }


}
const connectedMainIndexPage = connect(null)(CalendarModals);
export {connectedMainIndexPage as CalendarModals};