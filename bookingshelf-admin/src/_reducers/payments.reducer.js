import { paymentsConstants } from '../_constants';
import moment from 'moment';

const initialState = {
    list: []
}

export function payments(state = initialState, action) {
    switch (action.type) {
        case paymentsConstants.GET_INVOICE_LIST_SUCCESS:
            return {
                ...state,
                list: action.list
                    // [{"invoiceId":3,
                    // "totalSum":5005.00,
                    // "currency":"RUR",
                    // "createdDateMillis":1563457521000,
                    // "createdDate":"Thu 18-Jul-2019 13:45:21",
                    // "dueDateMillis":1563889521000,
                    // "dueDate":"Tue 23-Jul-2019 13:45:21",
                    // "invoiceStatus":"ISSUED",
                    // "invoicePackets":[
                    //     {"packetId":1,"amount":2.00,"startDateMillis":1562587200000,"startDate":"Mon 08-Jul-2019 12:00:00","price":185.00,"sum":370.00,"currency":"RUR","endDateMillis":1567771200000,"endDate":"Fri 06-Sep-2019 12:00:00"},
                    //     {"packetId":5,"amount":5.00,"startDateMillis":1562599900000,"startDate":"Mon 08-Jul-2019 15:31:40","price":927.00,"sum":4635.00,"currency":"RUR","endDateMillis":1575559900000,"endDate":"Thu 05-Dec-2019 15:31:40"}]}
                    //     ]
            };
        case paymentsConstants.GET_PACKETS_SUCCESS:
            return {
                ...state,
                packets: action.packets
            };
        default:
            return state
    }
}
