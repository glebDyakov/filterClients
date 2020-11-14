import { staffConstants } from '../_constants';

const initialState = {
  isLoading: false,
  error: false,
  isAvailableTimesChecked: false,
  isLoadingStaffInit: false,
  feedbackStaff: {
    content: [],
    totalPages: 0,
  },
};

export function staff(state = initialState, action) {
  switch (action.type) {
    case staffConstants.UPDATE_FEEDBACK_STAFF:
      return {
        ...state,
        feedbackStaff: action.feedbackStaff,
      };
    case staffConstants.STAFF_SUCCESS_TIME:
      return {
        ...state,
        status: 209,
      };
    case staffConstants.GET_FEEDBACK_SUCCESS:
      return {
        ...state,
        feedback: action.feedback,
      };
    case staffConstants.UPDATE_REQUEST:
      return {
        ...state,
        status: 208,
        adding: true,
        isLoadingStaff: true,
      };
    case staffConstants.ADD_ARRAY_WORKING_HOURS_SUCCESS_TIME:
      return {
        ...state,
        status: 209,
        addArrayWorkingHours: true,
      }
    case staffConstants.ADD_ARRAY_WORKING_HOURS_REQUEST:
      return {
        ...state,
        addArrayWorkingHours: false,
        status: 208,
        adding: true,
      }
    case staffConstants.ADD_ARRAY_WORKING_HOURS_SUCCESS:
      return {
        ...state,
        status: 200,
        adding: false,
      }
    case staffConstants.STAFF_REQUEST:
      return {
        ...state,
        status: 208,
        adding: true,
      };
    case staffConstants.ADD_SUCCESS:
      const staffCurrent=state.staff;
      staffCurrent.push(action.staff);

      return {
        ...state,
        status: 200,
        adding: false,
        staff: staffCurrent,
      };

    case staffConstants.ADD_WORKING_HOURS_SUCCESS:
      const timetableCurrent=state.timetable;

      timetableCurrent.map((staff, key)=>
        action.timing && action.timing.map((item)=>
          staff.staffId===action.id && timetableCurrent[key].timetables.push(item),
        ),
      );

      return {
        ...state,
        status: 200,
        adding: false,
        timetable: (timetableCurrent || []).sort((a, b) => a.sortOrder - b.sortOrder),
      };
    case staffConstants.UPDATE_WORKING_HOURS_SUCCESS:
      const timetableCurrent2=state.timetable;
      timetableCurrent2.map((staff, key)=>
        staff.timetables.map((item, key2)=> {
          action.timing && action.timing.map((item2) => {
            if (staff.staffId === action.id && item.staffTimetableId===item2.staffTimetableId) {
              timetableCurrent2[key].timetables[key2] = item2;
            }
            if (staff.staffId === action.id) {
              if (staff.timetables.some((item3) => item3.staffTimetableId === item2.staffTimetableId)) {
                return false;
              }

              timetableCurrent2[key].timetables.push(item2);
            }
          },
          );
        },
        ),
      );

      return {
        ...state,
        status: 200,
        adding: false,
        timetable: (timetableCurrent2 || []).sort((a, b) => a.sortOrder - b.sortOrder),
      };

    case staffConstants.UPDATE_USER_SUCCESS:
      let timetable = state.timetable;
      timetable = timetable.map((item) => {
        if (item.staffId === action.staff.staffId) {
          item = {
            ...item,
            ...action.staff,
          };
        }
        return item;
      });

      let staff = state.staff;
      staff = staff.map((item) => {
        if (item.staffId === action.staff.staffId) {
          item = {
            ...item,
            ...action.staff,
          };
        }
        return item;
      });
      return {
        ...state,
        timetable: timetable,
        staff: staff,
      };
    case staffConstants.UPDATE_SUCCESS:
      // const staff=state.staff;
      //
      // staff.find((item, key)=>{
      //     if(item.staffId===action.staff.staffId){
      //         staff[key]=action.staff;
      //     }
      // });


      return {
        ...state,
        status: 200,
        errorMessageKey: null,
        adding: false,
      };
    case staffConstants.GET:
    case staffConstants.UPDATE_ACCESS_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case staffConstants.UPDATE_ACCESS_SUCCESS:
      return {
        ...state,
        status: 200,
        access: action.access,
        isLoading: false,
      };
    case staffConstants.ADD_FAILURE:
      return {
        ...state,
        error: JSON.parse(action.error),
        step: Math.random(),
        status: 210,
        adding: false,
      };
    case staffConstants.STAFF_FAILURE_TIME:
      return {
        ...state,
        status: 209,
      };
    case staffConstants.UPDATE_FAILURE:
      return {
        ...state,
        adding: false,
        errorMessageKey: action.error.messageKey,
      };
    case staffConstants.UPDATE_ACCESS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: true,
      };
    case staffConstants.GET_SUCCESS:

      const costaffs=[];
      const st2=[];
      const staffs=action.staff;


      staffs.sort((a, b) => a.sortOrder - b.sortOrder).map((st1)=>
        st2.push(st1),
      );

      staffs.map((st)=> {
        const costaffOne=[st];
        st.costaffs && st.costaffs.map((costaff)=>
          staffs.map((staff, key)=> {
            if (costaff.staffId===staff.staffId) {
              costaffOne.push(staff);
              delete staffs[key];
            }
          }),
        );
        costaffs.push(costaffOne);
      });

      return {
        ...state,
        staff: st2,
        costaff: costaffs,
        code: Math.random(),
        isLoading: false,
        isLoadingStaff: false,
      };
    case staffConstants.GET_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    case staffConstants.GET_ACCESS_SUCCESS:
      return {
        ...state,
        access: action.access,
      };
    case staffConstants.ADD_CLOSED_DATES_SUCCESS:
      let closedDates=state.closedDates;
      closedDates ? closedDates.push(action.closedDates) : closedDates=[action.closedDates];

      return {
        ...state,
        status: 200,
        closedDates: closedDates,
      };
    case staffConstants.ADD_CLOSED_DATES_FAILURE:
      return state;
    case staffConstants.GET_CLOSED_DATES_SUCCESS:
      return {
        ...state,
        closedDates: action.closedDates,
      };

    case staffConstants.GET_TIMETABLE_REQUEST:
      return {
        ...state,
        isLoadingStaffInit: action.isLoading,
        isLoadingTimetable: action.isLoading,
      };
    case staffConstants.GET_TIMETABLE_SUCCESS:
      return {
        ...state,
        timetable: (action.timetable || []).sort((a, b) => a.sortOrder - b.sortOrder),
        isLoadingTimetable: false,
        isLoadingStaffInit: false,
      };
    case staffConstants.GET_TIMETABLE_FAILURE:
      return {
        ...state,
        isLoadingStaffInit: false,
        isLoadingTimetable: false,
        error: true,
      };
    case staffConstants.GET_AVAILABLE_TIMETABLE_REQUEST:
      return {
        ...state,
        isLoadingAvailableTime: action.isLoading,

      };
    case staffConstants.GET_AVAILABLE_TIMETABLE_SUCCESS:

      return {
        ...state,
        isLoadingAvailableTime: false,
        timetable:
          JSON.parse(JSON.stringify((action.payload.timetable || []).sort((a, b) => a.sortOrder - b.sortOrder))),
        isAvailableTimesChecked: action.payload.isAvailableTimesChecked,
      };
    case staffConstants.GET_AVAILABLE_TIMETABLE_FAILURE:
      return {
        ...state,
        isLoadingAvailableTime: false,
      };
    case staffConstants.GET_AVAILABLE_TIMETABLE_BY_STAFF_SUCCESS:
      return {
        ...state,
        timetableByStaff: action.timetableByStaff,
      };
    case staffConstants.GET_ACCESS_LIST_NAMES_SUCCESS:
      return {
        ...state,
        accessList: [
          {
            'name': 'Личный календарь',
            'permissionCode': 1,
          },
          {
            'name': 'Редактирование визитов',
            'permissionCode': 15,
          },
          {
            'name': 'Календарь других сотрудников',
            'permissionCode': 2,
          },
          {
            'name': 'Услуги',
            'permissionCode': 3,
          },
          {
            'name': 'Сотрудники',
            'permissionCode': 10,
          },
          {
            'name': 'Клиенты',
            'permissionCode': 4,
          },
          {
            'name': 'Клиенты с контактами',
            'permissionCode': 12,
          },
          {
            'name': 'Скачивание базы даных клиентов',
            'permissionCode': 5,
          },
          {
            'name': 'Импорт базы даных клиентов',
            'permissionCode': 6,
          },
          {
            'name': 'Email и SMS',
            'permissionCode': 7,
          },
          {
            'name': 'Аналитика',
            'permissionCode': 8,
          },
          {
            'name': 'Учет материалов',
            'permissionCode': 13,
          },
          {
            'name': 'Онлайн запись',
            'permissionCode': 9,
          },
          {
            'name': 'Филиалы',
            'permissionCode': 14,
          },
          {
            'name': 'Оплата',
            'permissionCode': 11,
          },
        ],
      };
    case staffConstants.DELETE_CLOSED_DATES_SUCCESS:
      return {
        ...state,
        closedDates: state.closedDates.filter((closedDates) => closedDates.companyClosedDateId !== action.id),
      };
    case staffConstants.DELETE_STAFF_SUCCESS:
      return {
        ...state,
        staff: state.staff.filter((staffElement) => staffElement.staffId !== action.id),
      };
    case staffConstants.DELETE_WORKING_HOURS_SUCCESS:
      return {
        ...state,
      };
    case staffConstants.DELETE_WORKING_HOURS_FAILURE:
      return {
        ...state,
      };
    case staffConstants.DELETE_CLOSED_DATES_FAILURE:
      return {
        ...state,
        closedDates: action.closedDates,
      };
    case staffConstants.DELETE_STAFF_FAILURE:
      return {
        ...state,
        staff: action.staff,
      };
    default:
      return state;
  }
}
