import {calendarConstants} from '../_constants';

const initialState = {
    isLoading: false,
    isLoadingModalAppointment: false,
    isLoadingModalCount: false,
    isLoadingModalCanceled: false,
    appointmentsCount: [],
    appointmentsCanceled: []
};

export function calendar(state = initialState, action) {
    switch (action.type) {
        case calendarConstants.ADD_APPOINTMENT_REQUEST:
        case calendarConstants.EDIT_CALENDAR_APPOINTMENT_REQUEST:
            return {
                ...state,
                status: 208,
                adding: true,
                isLoading:true
            };
        case calendarConstants.EDIT_CALENDAR_APPOINTMENT_SUCCESS:
            return {
                ...state,
                status: 200,
                adding: false,
                isLoading:false,
                refreshAvailableTimes: true
            }
        case calendarConstants.ADD_APPOINTMENT_SUCCESS:

            let appointments = state.appointments;
            if (appointments) {
                let boolAppointments = appointments.filter((app, key) =>
                    action.appointment.filter(item => app.staff.staffId === action.staffId && app['appointments'].push(item))
                );

                if (boolAppointments.length !== 0) {
                } else {
                    action.appointment.forEach(item => appointments.push({'staff': {'staffId': action.staffId}, 'appointments': [item]}))
                }
            } else {
                appointments = action.appointment.map(item => ({'staff': {'staffId': action.staffId}, 'appointments': [item]}))
            }
            return {
                ...state,
                status: 200,
                appointments: appointments,
                adding: false,
                isLoading:false
            };
        case calendarConstants.ADD_APPOINTMENT_SUCCESS_TIME:
            $('.new_appointment').modal('hide')

            return {
                ...state,
                status: 209
            };
        case calendarConstants.START_MOVING_VISIT_SUCCESS:

            return {
                ...state,
                isStartMovingVisit: action.isStartMovingVisit
            };
        case calendarConstants.MOVE_VISIT_SUCCESS:

            return {
                ...state,
                isMoveVisit: action.isMoveVisit
            };
        case calendarConstants.UPDATE_APPOINTMENT:

            return {
                ...state,
                isAppointmentUpdated: action.isAppointmentUpdated,
                isLoading: true
            };
        case calendarConstants.UPDATE_APPOINTMENT_SUCCESS:

            return {
                ...state,
                isAppointmentUpdated: action.isAppointmentUpdated,
                isLoading: false
            };
        case calendarConstants.ADD_RESERVED_TIME_REQUEST:
            return {
                ...state,
                status: 208,
                adding: true,
                isLoading: true
            };
        case calendarConstants.ADD_RESERVED_TIME_SUCCESS:

            let reservedTimes = state.reservedTime;
            if (reservedTimes) {
                let boolReservedTimes = reservedTimes.filter((app, key) =>
                    app.staff.staffId === action.staffId && app['reservedTimes'].push(action.reservedTime)
                );

                if (boolReservedTimes.length !== 0) {
                } else {
                    reservedTimes.push({'staff': {'staffId': action.staffId}, 'reservedTimes': [action.reservedTime]})
                }
            } else {
                reservedTimes = [{'staff': {'staffId': action.staffId}, 'reservedTimes': [action.reservedTime]}];
            }

            return {
                ...state,
                status: 200,
                reservedTime: reservedTimes,
                adding: false,
                isLoading: false

            };
        case calendarConstants.ADD_RESERVED_TIME_SUCCESS_TIME:
            setTimeout(()=>$('.modal_calendar').modal('hide'), 100)

            return {
                ...state,
                status: 209
            }
        case calendarConstants.EDIT_APPOINTMENT_SUCCESS:

            let appointmentsLoaded = state.appointments;

            appointmentsLoaded.map((app, key1) =>
                app.staff.staffId === action.appointment.staffId && app['appointments'].map((appointments, key2) => {
                    if (appointments.appointmentId === action.appointment.appointmentId) {
                        appointmentsLoaded[key1]['appointments'][key2] = action.appointment
                    }
                })
            );

            return {
                ...state,
                status: 200,
                appointments: appointmentsLoaded
            };
        case calendarConstants.APPROVE_APPOINTMENT_SUCCESS:

            let appointmentsApproved = state.appointments;
            appointmentsApproved.map((app, key1) =>
                app['appointments'].map((appointments, key2) => {
                    if (appointments.appointmentId === action.id) {
                        appointmentsApproved[key1]['appointments'][key2].approved = true
                    }
                })
            );

            return {
                ...state,
                status: 200,
                appointments: appointmentsApproved
            };
        case calendarConstants.APPROVE_APPOINTMENT_SUCCESS:

            // let appointmentsApproved = state.appointments;
            // appointmentsApproved.map((app, key1) =>
            //     app['appointments'].map((appointments, key2) => {
            //         if (appointments.appointmentId === action.id) {
            //             appointmentsApproved[key1]['appointments'][key2].approved = true
            //         }
            //     })
            // );
            //
            // return {
            //     ...state,
            //     status: 200,
            //     appointments: appointmentsApproved
            // };

            return {
                ...state
            }

        case calendarConstants.SET_SCROLLABLE_APPOINTMENT:
            return {
                ...state,
                scrollableAppointmentId: action.id
            }
        case calendarConstants.DELETE_APPOINTMENT:
            return {
                ...state,
                isLoading: true
            }
        case calendarConstants.DELETE_APPOINTMENT_SUCCESS:
            // const appointmentsDeleted = state.appointments;
            //
            // appointmentsDeleted.map((app, key1) =>
            //     app['appointments'].map((appointments, key2) => {
            //         if (appointments.appointmentId === action.id) {
            //             appointmentsDeleted[key1]['appointments'].splice(key2, 1)
            //         }
            //     })
            // );

            return {
                ...state,
                isLoading: false,
                //appointments: JSON.parse(JSON.stringify(appointmentsDeleted))
            };
        case calendarConstants.DELETE_RESERVED_TIME_SUCCESS:
            const reservedDeleted = state.reservedTime;

            reservedDeleted.map((app, key1) =>
                app['reservedTimes'].map((reservedTime, key2) => {
                    if (reservedTime.reservedTimeId === action.reservedTimeId) {
                        reservedDeleted[key1]['reservedTimes'].splice(key2, 1)
                    }
                })
            );

            return {
                ...state,
                reservedTime: reservedDeleted
            };
        case calendarConstants.ADD_APPOINTMENT_FAILURE:
        case calendarConstants.EDIT_CALENDAR_APPOINTMENT_FAILURE:
        case calendarConstants.UPDATE_APPOINTMENT_FAILURE:
            return {...state, isLoading:false};
        case calendarConstants.ADD_RESERVED_TIME_FAILURE:
            return {...state, isLoading:false};
        case calendarConstants.EDIT_APPOINTMENT_FAILURE:
            return {...state};
        case calendarConstants.APPROVE_APPOINTMENT_FAILURE:
            return {...state};
        case calendarConstants.DELETE_APPOINTMENT_FAILURE:
            return {...state, isLoading: false};
        case calendarConstants.GET_APPOINTMENT_REQUEST:
            return {
                ...state,
                isLoading: true,
                isLoadingModal: true
            };
        case calendarConstants.GET_APPOINTMENT_SUCCESS:
            return {
                ...state,
                appointments: action.appointments,
                isLoading: false,
                isLoadingModal: false
            };
        case calendarConstants.GET_APPOINTMENT_NEW_SOCKET:
            let newAppointment = state.appointments;
            let newAppointmentsCount = state.appointmentsCount
            let newItem = action.payload;
            let isIncluded = false;

            let appointmentsToPush = []
            let appointmentsCountToPush = []
            if (newAppointment && newAppointment.length) {
                newAppointment.forEach(item => {
                    if (item.staff.staffId === newItem.staffId) {
                        item.appointments.push(newItem)
                        isIncluded = true;
                    }
                    appointmentsToPush.push(item)
                })
                if (!isIncluded) {
                    appointmentsToPush.push({
                        staff: {
                            staffId: newItem.staffId
                        },
                        appointments: [newItem]
                    })
                }
            } else {
                appointmentsToPush = [{
                    staff: {
                        staffId: newItem.staffId
                    },
                    appointments: [newItem]
                }]
            }
            newAppointmentsCount.forEach(item => {
                if (item.staff.staffId === newItem.staffId) {
                    item.appointments.push(newItem)
                }
                appointmentsCountToPush.push(item)
            })
            return {
                ...state,
                appointments: appointmentsToPush,
                appointmentsCount: appointmentsCountToPush,
                appointmentShouldChange: !state.appointmentShouldChange
            };
        case calendarConstants.DELETE_APPOINTMENT_NEW_SOCKET:
            newAppointmentsCount = state.appointmentsCount
            let newAppointmentsCanceled = state.appointmentsCanceled
            newAppointment = state.appointments;
            let appointmentsToDelete = action.payload.payload;

            appointmentsToDelete.forEach((newItem, i) => {
                let indexElem = newAppointment.find(item => item.staff.staffId === newItem.staffId).appointments.findIndex(item=>item.appointmentId === newItem.appointmentId)
                let indexAppointmentsCount = newAppointmentsCount.find(item => item.staff.staffId === newItem.staffId).appointments.findIndex(item=>item.appointmentId === newItem.appointmentId)
                if (indexElem) {
                    newAppointment.find(item => item.staff.staffId === newItem.staffId).appointments.splice(indexElem, 1);
                }
                if (indexAppointmentsCount) {
                    newAppointmentsCount.find(item => item.staff.staffId === newItem.staffId).appointments.splice(indexElem, 1);
                }

                if (i === 0 ){


                    newAppointmentsCanceled.push(newItem);
                }
            })

            const finalAppointments = JSON.parse(JSON.stringify(newAppointment))
            const finalAppointmentsCount = JSON.parse(JSON.stringify(newAppointmentsCount))
            const finalAppointmentsCanceled =  JSON.parse(JSON.stringify(newAppointmentsCanceled))
            return {
                ...state,
                appointments: finalAppointments,
                appointmentsCount: finalAppointmentsCount,
                appointmentsCanceled: finalAppointmentsCanceled
            };
        case calendarConstants.MOVE_APPOINTMENT_NEW_SOCKET:
            newAppointment = state.appointments;
            newAppointmentsCount = state.appointmentsCount
            let appointmentsToMove = action.payload.payload;

            appointmentsToMove.forEach(newItem => {
                if (newAppointment && newAppointment.length) {
                    newAppointment.forEach(item => {
                        if (item.staff.staffId === newItem.staffId) {
                            let appointmentIndex = item.appointments.findIndex(item => newItem.appointmentId === item.appointmentId)
                            item.appointments.splice(appointmentIndex, 1)
                            item.appointments.push(newItem)
                        }
                    })
                }
                newAppointmentsCount.forEach(item => {
                    if (item.staff.staffId === newItem.staffId) {
                        let appointmentIndex = item.appointments.findIndex(item => newItem.appointmentId === item.appointmentId)
                        item.appointments.splice(appointmentIndex, 1)
                        item.appointments.push(newItem)
                    }
                })
            })

            return {
                ...state,
                appointments: JSON.parse(JSON.stringify(newAppointment)),
                appointmentsCount: JSON.parse(JSON.stringify(newAppointmentsCount)),
            };
        case calendarConstants.TOGGLE_REFRESH_AVAILABLE_TIMES:
            return {
                ...state,
                refreshAvailableTimes: action.refreshAvailableTimes
            }
        case calendarConstants.GET_APPOINTMENT_FAILURE:
            return {
                ...state,
                isLoading: false,
                isLoadingModal: false
            };

        case calendarConstants.GET_APPOINTMENT_REQUEST_COUNT:
            return {
                ...state,
                isLoadingModalCount: true
            };
        case calendarConstants.GET_APPOINTMENT_SUCCESS_COUNT:
            return {
                ...state,
                appointmentsCount: action.appointments,
                isLoadingModalCount: false
            };
            case calendarConstants.GET_APPOINTMENT_FAILURE_COUNT:
            return {
                ...state,
                isLoadingModalCount: false
            };
        case calendarConstants.GET_APPOINTMENT_REQUEST__CANCELED:
            return {
                ...state,
                isLoadingModalCanceled: true
            };
        case calendarConstants.GET_APPOINTMENT_SUCCESS_CANCELED:
            return {
                ...state,
                appointmentsCanceled: action.appointments || [],
                isLoadingModalCanceled: false
            };
        case calendarConstants.GET_APPOINTMENT_FAILURE__CANCELED:
            return {
                ...state,
                isLoadingModalCanceled: false
            };
        case calendarConstants.GET_RESERVED_TIME_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case calendarConstants.GET_RESERVED_TIME_SUCCESS:
            return {
                ...state,
                reservedTime: action.reservedTime,
                isLoading: false
            };
        case calendarConstants.GET_RESERVED_TIME_FAILURE:
            return {
                ...state,
                isLoading: false
            };
        default:
            return state
    }
}
