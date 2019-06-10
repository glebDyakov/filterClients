import {analiticsConstants} from '../_constants';

export function analitics(state = {}, action) {

    switch (action.type) {

        case analiticsConstants.GET_STAFFS_SUCCESS:


            return {
                ...state,
                staffs: action.staffs
            };
        case analiticsConstants.GET_RECORDS_AND_CLIENTS_SUCCESS:
            let allRecordsPercent = 0,
                allRecordsToday = 0,
                allRecordsTodayCanceled = 0,
                newClientsPercent = 0,
                newClientsToday = 0,
                permanentClientsPercent = 0,
                permanentClientsToday = 0,
                recordsOnlinePercent = 0,
                recordsOnlineToday = 0,
                recordsOnlineTodayCanceled = 0,
                recordsPercent = 0,
                recordsToday = 0,
                recordsTodayCanceled = 0;
            const countRecAndCli = action.count;
            const countLength = Object.keys(action.count).length;

            for(let i = 0; i< countLength; i++) {
                debugger
                allRecordsPercent += countRecAndCli[Object.keys(countRecAndCli)[i]].allRecordsPercent;
                allRecordsToday += countRecAndCli[Object.keys(countRecAndCli)[i]].allRecordsToday;
                allRecordsTodayCanceled += countRecAndCli[Object.keys(countRecAndCli)[i]].allRecordsTodayCanceled;
                newClientsPercent += countRecAndCli[Object.keys(countRecAndCli)[i]].newClientsPercent;
                newClientsToday += countRecAndCli[Object.keys(countRecAndCli)[i]].newClientsToday;
                permanentClientsPercent += countRecAndCli[Object.keys(countRecAndCli)[i]].permanentClientsPercent;
                permanentClientsToday += countRecAndCli[Object.keys(countRecAndCli)[i]].permanentClientsToday;
                recordsOnlinePercent += countRecAndCli[Object.keys(countRecAndCli)[i]].recordsOnlinePercent;
                recordsOnlineToday += countRecAndCli[Object.keys(countRecAndCli)[i]].recordsOnlineToday;
                recordsOnlineTodayCanceled += countRecAndCli[Object.keys(countRecAndCli)[i]].recordsOnlineTodayCanceled;
                recordsPercent += countRecAndCli[Object.keys(countRecAndCli)[i]].recordsPercent;
                recordsToday += countRecAndCli[Object.keys(countRecAndCli)[i]].recordsToday;
                recordsTodayCanceled += countRecAndCli[Object.keys(countRecAndCli)[i]].recordsTodayCanceled;
            }
            allRecordsPercent /=countLength;
            // allRecordsToday /=countLength;
            // allRecordsTodayCanceled/=countLength;
            newClientsPercent /=countLength;
            // newClientsToday/=countLength;
            permanentClientsPercent/=countLength;
            // permanentClientsToday/=countLength;
            recordsOnlinePercent/=countLength;
            // recordsOnlineToday/=countLength;
            // recordsOnlineTodayCanceled/=countLength;
            recordsPercent/=countLength;
            // recordsToday/=countLength;
            // recordsTodayCanceled/=countLength;
            return{
                ...state,
                countRecAndCli: action.count,
                counter: {
                    allRecordsPercent ,
                    allRecordsToday ,
                    allRecordsTodayCanceled,
                    newClientsPercent ,
                    newClientsToday,
                    permanentClientsPercent,
                    permanentClientsToday ,
                    recordsOnlinePercent ,
                    recordsOnlineToday ,
                    recordsOnlineTodayCanceled,
                    recordsPercent,
                    recordsToday,
                    recordsTodayCanceled,

                }
            };
            case analiticsConstants.GET_STAFFS_ANALYTICS_SUCCESS:
                let appointmentTime = 0,
                    percentWorkload = 0,
                    ratioToYesterday = 0;
                for(let i = 0; i < Object.keys(action.count).length; i++) {
                    appointmentTime += action.count[Object.keys(action.count)[i]].appointmentTime;
                    percentWorkload += action.count[Object.keys(action.count)[i]].percentWorkload;
                    ratioToYesterday += action.count[Object.keys(action.count)[i]].ratioToYesterday;

                }
                percentWorkload /= Object.keys(action.count).length;

            return{
                ...state,
                staffsAnalytic: {
                    appointmentTime,
                    percentWorkload,
                    ratioToYesterday

                }
            };

        default:
            return state
    }
}