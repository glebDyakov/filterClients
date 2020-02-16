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
            newAppointment = state.appointments
            newItem = action.appointment[0]

            updatedAppointments = []
            newAppointment.forEach(localAppointment => {
                const item = []
                localAppointment.appointments.forEach(appointment => {
                    if (appointment.appointmentId === newItem.appointmentId) {
                        appointment.clientNotCome = newItem.clientNotCome
                    }
                    item.push(appointment)
                });

                updatedAppointments.push({ staff: localAppointment.staff, appointments: item })
            });

            return {
                ...state,
                appointments: updatedAppointments,
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
                // isAppointmentUpdated: action.isAppointmentUpdated,
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
                let boolReservedTimes = reservedTimes.filter((app) =>
                    app.staff.staffId === action.staffId && app.reservedTimes.push(action.reservedTime)
                );

                if (boolReservedTimes.length === 0) {
                    reservedTimes.push({ staff: { staffId: action.staffId }, reservedTimes: [action.reservedTime] })
                }
            } else {
                reservedTimes = [{ staff: { staffId: action.staffId }, reservedTimes: [action.reservedTime] }];
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

            const reservedTime = []
            reservedDeleted.map(app => {

                const item = []
                app.reservedTimes.forEach((localReservedTime) => {
                    if (localReservedTime.reservedTimeId !== action.reservedTimeId) {
                        item.push(localReservedTime)
                    }
                })
                reservedTime.push({ staff: app.staff, reservedTimes: item } )
            });

            return {
                ...state,
                reservedTime
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
            return {...state, isLoading: false, currentTime: null};
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

            let updatedAppointments = []
            newAppointment.forEach(localAppointment => {
                const item = []
                localAppointment.appointments.forEach(appointment => {
                    if (appointment.appointmentId !== newItem.appointmentId) {
                        item.push(appointment)
                    }
                });

                updatedAppointments.push({ staff: localAppointment.staff, appointments: item })
            });

            let updatedAppointmentsCount = []
            newAppointmentsCount.forEach(localAppointment => {
                const item = []
                localAppointment.appointments.forEach(appointment => {
                    if (appointment.appointmentId !== newItem.appointmentId) {
                        item.push(appointment)
                    }
                });

                updatedAppointmentsCount.push({ staff: localAppointment.staff, appointments: item })
            });

            newAppointmentsCanceled.push(newItem);

            return {
                ...state,
                appointments: updatedAppointments,
                appointmentsCount: updatedAppointmentsCount,
                appointmentsCanceled: newAppointmentsCanceled,
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

            updatedAppointments = []
            newAppointment.forEach(localAppointment => {
                const item = []
                localAppointment.appointments.forEach(appointment => {
                    item.push(appointment)
                });

                if (localAppointment.staff.staffId === newItem.staffId) {
                    item.push(newItem)
                }

                updatedAppointments.push({ staff: localAppointment.staff, appointments: item })
            });

            updatedAppointmentsCount = []
            newAppointmentsCount.forEach(localAppointment => {
                const item = []
                localAppointment.appointments.forEach(appointment => {
                    item.push(appointment)
                });

                if (localAppointment.staff.staffId === newItem.staffId) {
                    item.push(newItem)
                }

                updatedAppointmentsCount.push({ staff: localAppointment.staff, appointments: item })
            });


            let updatedAppointmentsCanceled = []
            newAppointment.forEach(localAppointment => {
                if (localAppointment.appointmentId !== newItem.appointmentId) {
                    updatedAppointmentsCount.push(localAppointment)
                }
            })

            return {
                ...state,
                currentTime: newItem.appointmentTimeMillis,
                appointments: updatedAppointments,
                appointmentsCount: updatedAppointmentsCount,
                appointmentsCanceled: updatedAppointmentsCanceled,
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

            updatedAppointments = []
            newAppointment.forEach(localAppointment => {
                const item = []
                localAppointment.appointments.forEach(appointment => {
                    if (appointmentsToDelete.every(newItem => appointment.appointmentId !== newItem.appointmentId)) {
                        item.push(appointment)
                    }
                });

                updatedAppointments.push({ staff: localAppointment.staff, appointments: item })
            });

            updatedAppointmentsCount = []
            newAppointmentsCount.forEach(localAppointment => {
                const item = []
                localAppointment.appointments.forEach(appointment => {
                    if (appointmentsToDelete.every(newItem => appointment.appointmentId !== newItem.appointmentId)) {
                        item.push(appointment)
                    }
                });

                updatedAppointmentsCount.push({ staff: localAppointment.staff, appointments: item })
            });

            newAppointmentsCanceled.push(appointmentsToDelete[0]);

            let finalAppointmentsCanceled =  JSON.parse(JSON.stringify(newAppointmentsCanceled))
            return {
                ...state,
                appointments: updatedAppointments,
                appointmentsCount: updatedAppointmentsCount,
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
                newItem.coStaffs = action.coStaffs;
            }

            updatedAppointments = []
            newAppointment.forEach(localAppointment => {
                const item = []
                localAppointment.appointments.forEach(appointment => {
                    if (appointment.appointmentId !== newItem.appointmentId) {
                        item.push(appointment)
                    }
                });

                if (localAppointment.staff.staffId === newItem.staffId) {
                    item.push(newItem)
                }

                if (newItem.coStaffs && newItem.coStaffs.some(costaff => costaff.staffId === localAppointment.staff.staffId)) {
                    item.push( {
                        ...newItem,
                        coappointment: true
                    })
                }

                updatedAppointments.push({ staff: localAppointment.staff, appointments: item })
            });

            updatedAppointmentsCount = []
            updatedAppointmentsCount.forEach(localAppointment => {
                const item = []
                localAppointment.appointments.forEach(appointment => {
                    if (appointment.appointmentId !== newItem.appointmentId) {
                        item.push(appointment)
                    }
                });

                if (localAppointment.staff.staffId === newItem.staffId) {
                    item.push(newItem)
                }

                if (newItem.coStaffs && newItem.coStaffs.some(costaff => costaff.staffId === localAppointment.staff.staffId)) {
                    item.push( {
                        ...newItem,
                        coappointment: true
                    })
                }

                updatedAppointmentsCount.push({ staff: localAppointment.staff, appointments: item })
            });

            return {
                ...state,
                currentTime: newItem.appointmentTimeMillis,
                appointments: updatedAppointments,
                appointmentsCount: updatedAppointmentsCount,
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
