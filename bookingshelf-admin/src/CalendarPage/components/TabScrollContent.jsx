import React from 'react';
import moment from 'moment';
import pure from 'recompose/pure';
import TabScrollLeftMenu from "./TabScrollLeftMenu";
import AppointmentCell from "./AppointmentCell";
import ReservedCell from "./ReservedCell";
import DefaultCell from "./DefaultCell";

const TabScroll = ({numbers, availableTimetable,selectedDays, closedDates, client, appointments,reservedTime,handleUpdateClient, approveAppointmentSetter,updateReservedId,changeTime }) => {
    const sortedAvailableTimetable = availableTimetable && availableTimetable.sort((a, b) => a.firstName.localeCompare(b.firstName));

    return(
        <div className="tabs-scroll"
            // style={{'minWidth': (120*parseInt(workingStaff.availableTimetable && workingStaff.availableTimetable.length))+'px'}}
        >
            {numbers && numbers.map((time, key) =>
                <div className="tab-content-list" key={key}>
                    <TabScrollLeftMenu time={time}/>
                    {sortedAvailableTimetable && selectedDays.map((day) => sortedAvailableTimetable.map((workingStaffElement, staffKey) => {
                        let currentTime= parseInt(moment(moment(day).format('DD/MM')+' '+moment(time, 'x').format('HH:mm'), 'DD/MM HH:mm').format('x'));
                        let appointment = appointments &&
                            appointments.map((appointmentStaff) =>
                                appointmentStaff.appointments &&
                                (appointmentStaff.staff && appointmentStaff.staff.staffId) === (workingStaffElement && workingStaffElement.staffId) &&
                                appointmentStaff.appointments.filter((appointment)=>{
                                    return currentTime <= parseInt(appointment.appointmentTimeMillis)
                                        && parseInt(moment(moment(day).format('DD/MM')+' '+moment(numbers[key + 1], 'x').format('HH:mm'), 'DD/MM HH:mm').format('x')) > parseInt(appointment.appointmentTimeMillis)
                                })
                            );

                        let reservedTime = reservedTime &&
                            reservedTime.map((reserve) =>
                                reserve.reservedTimes &&
                                reserve.staff.staffId === workingStaffElement.staffId &&
                                reserve.reservedTimes.filter((reservedTime)=>{
                                    return currentTime <= parseInt(reservedTime.startTimeMillis)
                                        && parseInt(moment(moment(day).format('DD/MM')+' '+moment(numbers[key + 1], 'x').format('HH:mm'), 'DD/MM HH:mm').format('x')) > parseInt(reservedTime.startTimeMillis)
                                })
                            );

                        appointment = appointment && appointment.filter(Boolean)
                        reservedTime = reservedTime && reservedTime.filter(Boolean)

                        let clDate = closedDates && closedDates.some((st) =>
                            parseInt(moment(st.startDateMillis, 'x').startOf('day').format("x")) <= parseInt(moment(day).startOf('day').format("x")) &&
                            parseInt(moment(st.endDateMillis, 'x').endOf('day').format("x")) >= parseInt(moment(day).endOf('day').format("x")))


                        let workingTimeEnd=null;
                        let notExpired = workingStaffElement && workingStaffElement.availableDays && workingStaffElement.availableDays.length!==0 &&
                            workingStaffElement.availableDays.some((availableDay)=>
                                parseInt(moment(moment(availableDay.dayMillis, 'x').format('DD/MM')+' '+moment(time, 'x').format('HH:mm'), 'DD/MM HH:mm').format('x'))===currentTime &&
                                availableDay.availableTimes && availableDay.availableTimes.some((workingTime)=>{
                                    workingTimeEnd=workingTime.endTimeMillis;
                                    return currentTime>=parseInt(moment().format("x")) &&
                                        currentTime>=parseInt(moment(moment(workingTime.startTimeMillis, 'x').format('DD/MM')+' '+moment(workingTime.startTimeMillis, 'x').format('HH:mm'), 'DD/MM HH:mm').format('x')) &&
                                        currentTime<parseInt(moment(moment(workingTime.endTimeMillis, 'x').format('DD/MM')+' '+moment(workingTime.endTimeMillis, 'x').format('HH:mm'), 'DD/MM HH:mm').format('x'))}

                                ));
                        let resultMarkup;
                        if(appointment && appointment[0] && appointment[0].length > 0) {


                            resultMarkup = <AppointmentCell
                                appointment={appointment}
                                appointments={appointments}
                                workingStaffElement={workingStaffElement}
                                handleUpdateClient={handleUpdateClient}
                                approveAppointmentSetter={approveAppointmentSetter}
                                currentTime={currentTime}
                                key={key}
                                client={client}
                            />


                        } else if ( reservedTime && reservedTime[0] && reservedTime[0].length > 0 ) {
                            resultMarkup = <ReservedCell
                                reservedTime={reservedTime[0][0]}
                                staffId={workingStaffElement.staffId}
                                updateReservedId={updateReservedId}
                                />


                        } else {
                            resultMarkup =(
                                <DefaultCell
                                currentTime={currentTime}
                                notExpired={notExpired}
                                workingStaffElement={workingStaffElement}
                                numbers={numbers}
                                time={time}
                                clDate={clDate}
                                changeTime={changeTime}
                                />
                            )
                        }
                        return resultMarkup;

                    }))
                    }

                </div>
            )}

        </div>
    );
}

export default pure(TabScroll);
