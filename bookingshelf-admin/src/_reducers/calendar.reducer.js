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
            return {
                ...state,
                status: 208,
                adding: true,
                isLoading: action.isLoading
            };
        case calendarConstants.EDIT_CALENDAR_APPOINTMENT_REQUEST:
        case calendarConstants.EDIT_APPOINTMENT_2_REQUEST:
            return {
                ...state,
                status: 208,
                adding: true,
                isLoading: true
            };
        case calendarConstants.EDIT_CALENDAR_APPOINTMENT_SUCCESS:
        case calendarConstants.EDIT_APPOINTMENT_2_SUCCESS:
            return {
                ...state,
                status: 200,
                adding: false,
                isLoading:false,
                refreshAvailableTimes: true
            }
        case calendarConstants.ADD_APPOINTMENT_SUCCESS:

            // let appointments = state.appointments;
            // if (appointments) {
            //     let boolAppointments = appointments.filter((app, key) =>
            //         action.appointment.filter(item => app.staff.staffId === action.staffId && app['appointments'].push(item))
            //     );
            //
            //     if (boolAppointments.length !== 0) {
            //     } else {
            //         action.appointment.forEach(item => appointments.push({'staff': {'staffId': action.staffId}, 'appointments': [item]}))
            //     }
            // } else {
            //     appointments = action.appointment.map(item => ({'staff': {'staffId': action.staffId}, 'appointments': [item]}))
            // }
            return {
                ...state,
                status: 200,
                // appointments: appointments,
                adding: false,
                isLoading:false
            };
        case calendarConstants.ADD_APPOINTMENT_SUCCESS_TIME:

            return {
                ...state,
                status: 209
            };

        case calendarConstants.UPDATE_APPOINTMENT_CHECKBOX:
            return {
                ...state,
                isClientNotComeLoading: true
            }
        case calendarConstants.UPDATE_APPOINTMENT_CHECKBOX_SUCCESS:
            let staffIndex = state.appointments.findIndex(item => item.staff.staffId === action.appointment[0].staffId)
            if (staffIndex !== -1) {
                let appointmentIndex = state.appointments[staffIndex].appointments.findIndex(item => item.appointmentId === action.appointment[0].appointmentId)
                state.appointments[staffIndex].appointments[appointmentIndex] = {
                    ...state.appointments[staffIndex].appointments[appointmentIndex],
                    clientNotCome: action.appointment[0].clientNotCome
                }
            }
            return {
                ...state,
                appointments: JSON.parse(JSON.stringify(state.appointments)),
                isClientNotComeLoading: false
            }
        case calendarConstants.UPDATE_APPOINTMENT_CHECKBOX_FAILURE:
            return {
                ...state,
                isClientNotComeLoading: false
            }

        case calendarConstants.UPDATE_APPOINTMENT:

            return {
                ...state,
                isAppointmentUpdated: action.isAppointmentUpdated,
                isLoading: action.isLoading
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
                reservedTime: JSON.parse(JSON.stringify(reservedDeleted))
            };
        case calendarConstants.ADD_APPOINTMENT_FAILURE:
        case calendarConstants.EDIT_CALENDAR_APPOINTMENT_FAILURE:
        case calendarConstants.UPDATE_APPOINTMENT_FAILURE:
        case calendarConstants.EDIT_APPOINTMENT_2_FAILURE:
            return {...state, isLoading:false, adding: false, status: null};
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
                isLoadingAppointments: action.isLoading,
                isLoadingModal: action.isLoading,
            };
        case calendarConstants.GET_APPOINTMENT_SUCCESS:
            return {
                ...state,
                appointments: action.appointments,
                isLoadingAppointments: false,
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
                appointmentsCount: appointmentsCountToPush
            };
        case calendarConstants.MAKE_VISUAL_DELETING:
            newAppointmentsCount = state.appointmentsCount
            newAppointmentsCanceled = state.appointmentsCanceled
            newAppointment = state.appointments;

            newItem = action.appointment

            let indexElem = newAppointment.find(item => item.staff.staffId === newItem.staffId).appointments.findIndex(item=>item.appointmentId === newItem.appointmentId)
            let activeAppointmentsCount = newAppointmentsCount.find(item => item.staff.staffId === newItem.staffId)
            let indexAppointmentsCount = activeAppointmentsCount ? activeAppointmentsCount.appointments.findIndex(item=>item.appointmentId === newItem.appointmentId) : -1
            if (indexElem !== -1) {
                newAppointment.find(item => item.staff.staffId === newItem.staffId).appointments.splice(indexElem, 1);
            }
            if (indexAppointmentsCount !== -1) {
                newAppointmentsCount.find(item => item.staff.staffId === newItem.staffId).appointments.splice(indexAppointmentsCount, 1);
            }

            newAppointmentsCanceled.push(newItem);
            finalAppointments = JSON.parse(JSON.stringify(newAppointment))
            finalAppointmentsCount = JSON.parse(JSON.stringify(newAppointmentsCount))
            finalAppointmentsCanceled =  JSON.parse(JSON.stringify(newAppointmentsCanceled))
            return {
                ...state,
                appointments: finalAppointments,
                appointmentsCount: finalAppointmentsCount,
                appointmentsCanceled: finalAppointmentsCanceled,
                deletingVisualVisit: action.appointment
            };
        case calendarConstants.CANCEL_VISUAL_DELETING:
            newAppointment = state.appointments;
            newAppointmentsCount = state.appointmentsCount
            newAppointmentsCanceled = state.appointmentsCanceled
            newItem = state.deletingVisualVisit;
            isIncluded = false;

            appointmentsToPush = []
            appointmentsCountToPush = []
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

            let indexAppointmentCanceled = newAppointment.findIndex(item=>item.appointmentId === newItem.appointmentId)
            if (indexElem !== -1) {
                newAppointmentsCanceled.splice(indexAppointmentCanceled, 1);
            }

            finalAppointments = JSON.parse(JSON.stringify(newAppointment))
            finalAppointmentsCount = JSON.parse(JSON.stringify(newAppointmentsCount))
            finalAppointmentsCanceled =  JSON.parse(JSON.stringify(newAppointmentsCanceled))
            return {
                ...state,
                appointments: finalAppointments,
                appointmentsCount: finalAppointmentsCount,
                appointmentsCanceled: finalAppointmentsCanceled,
                deletingVisualVisit: null
            };
        case calendarConstants.CLEAR_VISUAL_DELETING:
            return {
                ...state,
                deletingVisualVisit: null
            }
        case calendarConstants.DELETE_APPOINTMENT_NEW_SOCKET:
            newAppointmentsCount = state.appointmentsCount
            let newAppointmentsCanceled = state.appointmentsCanceled
            newAppointment = state.appointments;
            let appointmentsToDelete = action.payload.payload;

            appointmentsToDelete.forEach((newItem, i) => {
                let indexElem = newAppointment.find(item => item.staff.staffId === newItem.staffId).appointments.findIndex(item=>item.appointmentId === newItem.appointmentId)
                let activeAppointmentsCount = newAppointmentsCount.find(item => item.staff.staffId === newItem.staffId)
                let indexAppointmentsCount = activeAppointmentsCount ? activeAppointmentsCount.appointments.findIndex(item=>item.appointmentId === newItem.appointmentId) : -1
                if (indexElem !== -1) {
                    newAppointment.find(item => item.staff.staffId === newItem.staffId).appointments.splice(indexElem, 1);
                }
                if (indexAppointmentsCount !== -1) {
                    newAppointmentsCount.find(item => item.staff.staffId === newItem.staffId).appointments.splice(indexAppointmentsCount, 1);
                }

                if (i === 0 ){

                    newAppointmentsCanceled.push(newItem);
                }
            })
            let finalAppointments = JSON.parse(JSON.stringify(newAppointment))
            let finalAppointmentsCount = JSON.parse(JSON.stringify(newAppointmentsCount))
            let finalAppointmentsCanceled =  JSON.parse(JSON.stringify(newAppointmentsCanceled))
            return {
                ...state,
                appointments: finalAppointments,
                appointmentsCount: finalAppointmentsCount,
                appointmentsCanceled: finalAppointmentsCanceled
            };

        case calendarConstants.CLEAR_VISUAL_MOVE:
            return {
                ...state,
                prevVisualVisit: null
            }
        case calendarConstants.MAKE_VISUAL_MOVE:
        case calendarConstants.CANCEL_VISUAL_MOVE:
            newAppointment = state.appointments;
            newAppointmentsCount = state.appointmentsCount
            let { prevVisualVisit } = state

            if (prevVisualVisit) {
                newItem = {
                    ...prevVisualVisit
                }
            } else {
                newItem = {
                    ...action.movingVisit
                };

                newItem.appointmentTimeMillis = action.movingVisitMillis;
                newItem.staffId = action.movingVisitStaffId;
            }

            if (newAppointment && newAppointment.length) {
                newAppointment.forEach(item => {

                    let appointmentIndex = item.appointments && item.appointments.findIndex(item => newItem.appointmentId === item.appointmentId)
                    if (appointmentIndex > -1) {
                        item.appointments.splice(appointmentIndex, 1)
                    }
                    if (item.staff.staffId === newItem.staffId) {
                        item.appointments.push(newItem)
                    }
                })
            }
            newAppointmentsCount.forEach(item => {
                let appointmentIndex = item.appointments && item.appointments.findIndex(item => newItem.appointmentId === item.appointmentId)
                if (appointmentIndex > -1) {
                    item.appointments.splice(appointmentIndex, 1)
                }
                if (item.staff.staffId === newItem.staffId) {
                    item.appointments.push(newItem)
                }
            })

            return {
                ...state,
                appointments: JSON.parse(JSON.stringify(newAppointment)),
                appointmentsCount: JSON.parse(JSON.stringify(newAppointmentsCount)),
                prevVisualVisit: state.prevVisualVisit ? null : action.movingVisit
            }
        case calendarConstants.MOVE_APPOINTMENT_NEW_SOCKET:
            newAppointment = state.appointments;
            newAppointmentsCount = state.appointmentsCount
            let appointmentsToMove = action.payload.payload;

            appointmentsToMove.forEach(newItem => {
                if (newAppointment && newAppointment.length) {
                    newAppointment.forEach(item => {

                        let appointmentIndex = item.appointments && item.appointments.findIndex(item => newItem.appointmentId === item.appointmentId)
                        if (appointmentIndex > -1) {
                            item.appointments.splice(appointmentIndex, 1)
                        }
                        if (item.staff.staffId === newItem.staffId) {
                            item.appointments.push(newItem)
                        }
                    })
                }
                newAppointmentsCount.forEach(item => {
                    let appointmentIndex = item.appointments && item.appointments.findIndex(item => newItem.appointmentId === item.appointmentId)
                    if (appointmentIndex > -1) {
                        item.appointments.splice(appointmentIndex, 1)
                    }
                    if (item.staff.staffId === newItem.staffId) {
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
                isLoadingAppointments: false,
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
                appointmentsCount: action.appointments || [],
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
                isLoadingReservedTime: true
            }
        case calendarConstants.GET_RESERVED_TIME_SUCCESS:
            return {
                ...state,
                reservedTime: action.reservedTime,
                isLoadingReservedTime: false
            };
        case calendarConstants.GET_RESERVED_TIME_FAILURE:
            return {
                ...state,
                isLoadingReservedTime: false
            };
        default:
            return state
    }
}
