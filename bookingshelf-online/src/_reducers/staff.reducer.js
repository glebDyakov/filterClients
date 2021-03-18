import { staffConstants } from '../_constants';
import moment from 'moment';
import { getCookie, deleteCookie, setCookie } from "../_helpers/cookie";

const client = getCookie('client');
const sendSmsTimer = getCookie('sendSmsTimer')
const clientCookie = (client) && JSON.parse(client);

const initialState = {
    error: '',
    staffCommentsStaff: {},
    staffCommentsTotalPages: 0,
    clientCookie,
    isLoading: false,
    subcompanies: [],
    sendSmsTimer,
    serviceGroups: [],
    superCompany: true,
    i18nLang: 'default'
}

export function staff(state = initialState, action) {
    switch (action.type) {
        case staffConstants.CLEAR_ERROR:
            return {
                ...state,
                error: ''
            }
        case staffConstants.CLEAR_STAFF_SUCCESS:
            return {
                ...state,
                staff: []
            }

        case staffConstants.CHANGE_LANG:
            return {
                ...state,
                i18Lang: action.lang,
            }
        case staffConstants.GET_SUBCOMPANIES_SUCCESS:

            let newState = {}
            if (action.subcompanies) {
                newState.subcompanies = state.subcompanies.concat(action.subcompanies);
            } else {
                newState.superCompany = false
            }

            return {
                ...state,
                ...newState
            }
        case staffConstants.GET_SERVICE_GROUPS_SUCCESS:
            const updatedServiceGroups = action.serviceGroups && action.serviceGroups.map(item => {
                return {
                    ...item,
                    services: item.services && item.services.sort((a, b) => a.sortOrder - b.sortOrder)
                }
            })
            return {
                ...state,
                isLoading: false,
                serviceGroups: (updatedServiceGroups || []).sort((a, b) => a.sortOrder - b.sortOrder)
            }
        case staffConstants.GET_SUCCESS:
            return {
                ...state,
                staff: (action.staff || []).sort((a, b) => a.sortOrder - b.sortOrder),
                isLoading: false
            };
        case staffConstants.CLIENT_LOGIN_CLEAR:
            deleteCookie('client');
            return {
                ...state,
                clientCookie: null
            }

        case staffConstants.CLEAR_MESSAGES:
            return {
                ...state,
                clientLoginMessage: '',
                commentPassword: ''
            }
        case staffConstants.CLIENT_LOGIN:
            return {
                ...state,
                isLoading: true,
                clientLoginMessage: ''
            }
        case staffConstants.CLIENT_LOGIN_SUCCESS:
            let client = {
                clientPassword: action.params.clientPassword,
                ...action.client
            }

            document.cookie = `client=${JSON.stringify(client)}`;
            return {
                ...state,
                isLoading: false,
                clientCookie: client
            }
        case staffConstants.CLIENT_LOGIN_FAILURE:
            return {
                ...state,
                clientLoginMessage: 'Вы не являетесь клиентом компании или ввели неверный пароль.',
                isLoading: false
            }

        case staffConstants.CREATE_COMMENT:
            return {
                ...state,
                commentCreated: false,
                commentPassword: '',
                isLoading: true
            }
        case staffConstants.CLEAR_SEND_SMS_TIMER:
            return {
                ...state,
                sendSmsTimer: false
            }
        case staffConstants.CREATE_COMMENT_PASSWORD_SUCCESS:
            const expires = moment().add(5 * 60 + 1, 'seconds').format("YYYY/MM/DD HH:mm:ss")
            setCookie('sendSmsTimer', expires, { 'max-age': 5 * 60 })
            return {
                ...state,
                commentPassword: 'Персональный пароль отправлен на указанный номер. Новый пароль можно будет запросить через 5 минут.',
                isLoading: false,
                sendSmsTimer: true
            }

        case staffConstants.CREATE_COMMENT_PASSWORD_FAILURE:
            return {
                ...state,
                commentPassword: action.commentPassword,
                isLoading: false
            }

        case staffConstants.CREATE_COMMENT_SUCCESS:
            let updatedComments = [action.comment];
            updatedComments = updatedComments.concat(state.staffComments)
            return {
                ...state,
                staffComments: updatedComments,
                commentCreated: true,
                isLoading: false
            }
        case staffConstants.GET_STAFF_COMMENTS_SUCCESS:
            const staffCommentsTotalPages = action.staffCommentsInfo.totalPages || 0;
            const staffComments = (action.staffCommentsInfo.content || [])
            return {
                ...state,
                staffCommentsTotalPages,
                staffCommentsStaff: action.staffCommentsStaff,
                staffComments,
                isLoading: false
            }
        case staffConstants.GET_SERVICES_SUCCESS:
            return {
                ...state,
                services: action.services,
                isLoadingServices: false
            };
        case staffConstants.GET_INFO_SUCCESS:
            let ownerCompany = {
                ...action.info,
            }

            let isOwnerCompanyAdded = state.subcompanies.find(item => item.companyId === action.info.companyId)
            if (!isOwnerCompanyAdded) {
                state.subcompanies.unshift(ownerCompany)
            }
            return {
                ...state,
                info: action.info,
                isLoading: false
            };
        case staffConstants.GET_INFO_SOCIAL_SUCCESS:
            return {
                ...state,
                info: action.info,
                isLoading: false
            };
        case staffConstants.GET_SERVICES:
            return {
                ...state,
                isLoadingServices: true
            }
        case staffConstants.GET:
        case staffConstants.GET_INFO:
        case staffConstants.GET_INFO_SOCIAL:
        case staffConstants.GET_SERVICE_GROUPS:
        case staffConstants.GET_NEAREST_TIME:
        case staffConstants.GET_APPOINTMENT_CUSTOM:
        case staffConstants.GET_TIMETABLE:
        case staffConstants.GET_TIMETABLE_AVAILABLE:
        case staffConstants.GET_STAFF_COMMENTS:
        case staffConstants.MOVE_VISIT:
        case staffConstants.DELETE_APPOINTMENT:
            return {
                ...state,
                isLoading: true
            };
        case staffConstants.GET_CLIENT_APPOINTMENTS_SUCCESS:
            return {
                ...state,
                clientAppointments: action.clientAppointments
            }
        case staffConstants.GET_TIMETABLE_SUCCESS:
            return {
                ...state,
                timetable: action.timetable,
                isLoading: false
            };
        case staffConstants.GET_TIMETABLE_AVAILABLE_SUCCESS:
            return {
                ...state,
                timetableAvailable: (action.timetableAvailable && action.timetableAvailable.length ? action.timetableAvailable : [action.timetableAvailable]),
                isLoading: false
            };
        case staffConstants.GET_FAILURE:
        case staffConstants.SET_ERROR:
            return {
                ...state,
                isLoading: false,
                error: 'Онлайн-запись отключена. Пожалуйста, свяжитесь с администратором. Приносим извинения за доставленные неудобства.'
            }
        case staffConstants.TOGGLE_MOVED_VISIT:
            return {
                ...state,
                movedVisitSuccess: action.movedVisitSuccess
            }
        case staffConstants.TOGGLE_START_MOVING_VISIT:
            let toggleStartState = {}
            if (action.fromVisitPage) {
                toggleStartState.newAppointment = action.movingVisit
            }
            return {
                ...state,
                isStartMovingVisit: action.isStartMovingVisit,
                movingVisit: action.movingVisit,
                ...toggleStartState
            }
        case staffConstants.GET_SERVICES_FAILURE:
            return {
                ...state,
                isLoading: false,
                isLoadingServices: false
            }
        case staffConstants.GET_INFO_FAILURE:
        case staffConstants.GET_INFO_SOCIAL_FAILURE:
        case staffConstants.GET_STAFF_COMMENTS_FAILURE:
        case staffConstants.CREATE_COMMENT_FAILURE:
        case staffConstants.GET_SERVICE_GROUPS_FAILURE:
        case staffConstants.GET_NEAREST_TIME_FAILURE:
        case staffConstants.GET_TIMETABLE_FAILURE:
        case staffConstants.GET_TIMETABLE_AVAILABLE_FAILURE:
        case staffConstants.DELETE_APPOINTMENT_FAILURE:
            return {
                ...state,
                isLoading: false,
                deleted: false
            }
        case staffConstants.GET_APPOINTMENT_CUSTOM_FAILURE:
            return {
                ...state,
                isLoading: false,
                deleted: false,
                error: 'Записи не существует'
            }
        case staffConstants.MOVE_VISIT_FAILURE:
            return {
                ...state,
                isLoading: false,
                deleted: false,
                error: 'Извините, это время недоступно для записи'
            }
        case staffConstants.ADD_APPOINTMENT:
            return {
                ...state,
                isLoading: true
            }
        case staffConstants.ADD_APPOINTMENT_SUCCESS:
            return {
                ...state,
                ...action.payload,
                error: '',
                isLoading: false
            };
        case staffConstants.ADD_APPOINTMENT_FAILURE:
            return {
                ...state,
                ...action.payload,
                isLoading: false
            };
        case staffConstants.DELETE_APPOINTMENT_SUCCESS:
            return {
                ...state,
                deleted: true,
                isLoading: false
            };
        case staffConstants.GET_APPOINTMENT_CUSTOM_SUCCESS:
            return {
                ...state,
                appointment: action.appointment,
                isLoading: false
            };
        case staffConstants.MOVE_VISIT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isStartMovingVisit: false,
                movedVisitSuccess: true,
                movingVisit: action.movingVisit
            }
        case staffConstants.GET_NEAREST_TIME_SUCCESS:
            return {
                ...state,
                nearestTime: action.nearestTime,
                isLoading: false
            };
        default:
            return state
    }
}
