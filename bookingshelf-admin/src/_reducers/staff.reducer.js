import {clientConstants, staffConstants, userConstants} from '../_constants';
import {store} from '../_helpers/store';

export function staff(state= {}, action) {
    switch (action.type) {
        case staffConstants.STAFF_SUCCESS_TIME:
            setTimeout(()=>$('.new-mail').modal('hide'), 100)

            return {
                ...state,
                status: 209
            };
        case staffConstants.STAFF_REQUEST:
            return {
                ...state,
                status: 208,
                adding: true
            };
        case staffConstants.ADD_SUCCESS:
            const staffCurrent=state.staff;
            staffCurrent.push(action.staff);

            return {
                ...state,
                status: 200,
                adding: false,
                staff: staffCurrent
            };

        case staffConstants.ADD_WORKING_HOURS_SUCCESS:
            const timetableCurrent=state.timetable;

            timetableCurrent.map((staff,key)=>
                action.timing.map(item=>
                    staff.staffId===action.id && timetableCurrent[key].timetables.push(item)
                )
            );

            return {
                ...state,
                status: 200,
                timetable: timetableCurrent
            };
        case staffConstants.UPDATE_WORKING_HOURS_SUCCESS:
            let timetableCurrent2=state.timetable;
            timetableCurrent2.map((staff, key)=>
                staff.timetables.map((item, key2)=> {
                        action.timing.map((item2) => {
                                if (staff.staffId === action.id && item.staffTimetableId===item2.staffTimetableId) {
                                    timetableCurrent2[key].timetables[key2] = item2
                                }
                                if(staff.staffId === action.id) {
                                    if (staff.timetables.some((item3) => item3.staffTimetableId === item2.staffTimetableId)) {
                                        return false;
                                    }

                                    timetableCurrent2[key].timetables.push(item2)
                                }

                            }
                        )
                    }
                )
            );

            return {
                ...state,
                status: 200,
                timetable: timetableCurrent2
            };
        case staffConstants.UPDATE_SUCCESS:
            const staff=state.staff;

            staff.find((item, key)=>{
                if(item.staffId===action.staff.staffId){
                    staff[key]=action.staff;
                }
            });


            return {
                ...state,
                status: 200,
                adding: false,
                staff: staff
            };
        case staffConstants.UPDATE_ACCESS_SUCCESS:
            return {
                ...state,
                status: 200,
                access: action.access
            };
        case staffConstants.ADD_FAILURE:
            return {
                ...state,
                error: JSON.parse(action.error),
                step: Math.random(),
                status: 210,
                adding: false
            };
        case staffConstants.STAFF_FAILURE_TIME:
            return {
                ...state,
                status: 209
            };
        case staffConstants.UPDATE_FAILURE:
            return state;
        case staffConstants.UPDATE_ACCESS_FAILURE:
            return state;
        case staffConstants.GET_SUCCESS:
            return {
                ...state,
                staff: action.staff,
                code: Math.random()
            };
        case staffConstants.GET_ACCESS_SUCCESS:
            return {
                ...state,
                access: action.access
            };
        case staffConstants.ADD_CLOSED_DATES_SUCCESS:
            let closedDates=state.closedDates;
            closedDates ? closedDates.push(action.closedDates) : closedDates=[action.closedDates];

            return {
                ...state,
                status: 200,
                closedDates: closedDates
            };
        case staffConstants.ADD_CLOSED_DATES_FAILURE:
            return state;
        case staffConstants.GET_CLOSED_DATES_SUCCESS:
            return {
                ...state,
                closedDates: action.closedDates
            };
        case staffConstants.GET_TIMETABLE_SUCCESS:
            return {
                ...state,
                timetable: action.timetable
            };
        case staffConstants.GET_AVAILABLE_TIMETABLE_SUCCESS:
            return {
                ...state,
                availableTimetable: action.availableTimetable
            };
        case staffConstants.GET_AVAILABLE_TIMETABLE_BY_STAFF_SUCCESS:
            return {
                ...state,
                availableTimetableByStaff: action.availableTimetableByStaff
            };
        case staffConstants.GET_ACCESS_LIST_NAMES_SUCCESS:
            return {
                ...state,
                accessList: [
                    {
                        "name": 'Личный календарь',
                        "permissionCode": 1
                    },
                    {
                        "name": 'Календарь других сотрудников',
                        "permissionCode": 2
                    },
                    {
                        "name": 'Услуги',
                        "permissionCode": 3
                    },
                    {
                        "name": 'Сотрудники',
                        "permissionCode": 10
                    },
                    {
                        "name": 'Клиенты',
                        "permissionCode": 4
                    },
                    {
                        "name": 'Скачивание базы даных клиентов',
                        "permissionCode": 5
                    },
                    {
                        "name": 'Импорт базы даных клиентов',
                        "permissionCode": 6
                    },
                    {
                        "name": 'Email и SMS',
                        "permissionCode": 7
                    },
                    {
                        "name": 'Аналитика',
                        "permissionCode": 8
                    },
                    {
                        "name": 'Онлайн запись',
                        "permissionCode": 9
                    }
                ]
            };
        case staffConstants.DELETE_CLOSED_DATES_SUCCESS:
            return {
                ...state,
                closedDates: state.closedDates.filter(closedDates => closedDates.companyClosedDateId !== action.id)
            };
        case staffConstants.DELETE_STAFF_SUCCESS:
            return {
                ...state,
                staff: state.staff.filter(staffElement => staffElement.staffId !== action.id)
            };
        case staffConstants.DELETE_WORKING_HOURS_SUCCESS:
            return {
                ...state
            };
        case staffConstants.DELETE_WORKING_HOURS_FAILURE:
            return {
                ...state
            };
        case staffConstants.DELETE_CLOSED_DATES_FAILURE:
            return {
                ...state,
                closedDates: action.closedDates
            };
        case staffConstants.DELETE_STAFF_FAILURE:
            return {
                ...state,
                staff: action.staff
            };
        default:
            return state
    }
}