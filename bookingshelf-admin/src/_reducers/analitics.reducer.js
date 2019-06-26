import {analiticsConstants} from '../_constants';
import moment from 'moment';

const initialState = {
    charStatsFor: 'allRecordsToday',
    countRecAndCliChart: {
        dateArrayChartFirst: [],
        recordsArrayChartFirst: []
    },
    staffsAnalyticChart: {
        dateArrayChart: [],
        recordsArrayChart: []
    },
    isLoadingFirst: false,
    isLoadingSecond: false,

}

export function analitics(state = initialState, action) {

    switch (action.type) {

        case analiticsConstants.GET_RECORDS_AND_CLIENTS_UPDATE_CHART:
            return {
                ...state,
                charStatsFor: action.charStatsFor
            };


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
                recordsTodayCanceled = 0,
                approvedAllRecordsToday = 0,
                approvedRecordsOnlineToday = 0,
                approvedRecordsToday = 0;
            const countRecAndCli = action.count;
            const countLength = Object.keys(action.count).length;

            let dateNormalCheck = moment(Object.keys(action.count)[0]).format("D MMM");
            let dateTodayCheck = moment().format("D MMM");

            for(let i = 0; i< countLength; i++) {
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
                if((moment(Object.keys(countRecAndCli)[i]).format('x') < moment().format('x')) && (dateNormalCheck !== dateTodayCheck)){
                    approvedAllRecordsToday += countRecAndCli[Object.keys(countRecAndCli)[i]].allRecordsToday - countRecAndCli[Object.keys(countRecAndCli)[i]].allRecordsTodayCanceled;
                    approvedRecordsOnlineToday += countRecAndCli[Object.keys(countRecAndCli)[i]].recordsOnlineToday - countRecAndCli[Object.keys(countRecAndCli)[i]].recordsOnlineTodayCanceled;
                    approvedRecordsToday += countRecAndCli[Object.keys(countRecAndCli)[i]].recordsToday - countRecAndCli[Object.keys(countRecAndCli)[i]].recordsTodayCanceled;
                }
            }
            allRecordsPercent /=countLength;
            newClientsPercent /=countLength;
            permanentClientsPercent/=countLength;
            recordsOnlinePercent/=countLength;
            recordsPercent/=countLength;


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
                    approvedAllRecordsToday,
                    approvedRecordsOnlineToday,
                    approvedRecordsToday

                }
            };
        case analiticsConstants.GET_RECORDS_AND_CLIENTS_TODAY_SUCCESS:


            dateNormal = moment(Object.keys(action.approvedCount)[0]).format("D MMM");
            let dateToday = moment().format("D MMM");
            if(dateNormal === dateToday) {
                approvedAllRecordsToday = action.approvedCount[Object.keys(action.approvedCount)[0]].allRecordsToday;
                approvedRecordsOnlineToday = action.approvedCount[Object.keys(action.approvedCount)[0]].recordsOnlineToday;
                approvedRecordsToday = action.approvedCount[Object.keys(action.approvedCount)[0]].recordsToday;
            }
            return{
                ...state,
                counter: {
                    ...state.counter,
                    approvedAllRecordsToday,
                    approvedRecordsOnlineToday,
                    approvedRecordsToday
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


        case analiticsConstants.GET_RECORDS_AND_CLIENTS_CHART_SUCCESS:
            const {charStatsFor} = state;
            let dateArrayChartFirst = [],
                recordsArrayChartFirst = [],
                lengthChartFirst = Object.keys(action.count).length,
                dateNormalChartFirst = '';

            switch (charStatsFor) {
                case 'allRecordsToday':
                    for(let i = 0; i < lengthChartFirst; i++){
                        dateNormalChartFirst = moment(Object.keys(action.count)[i]).format("D MMM")
                        dateArrayChartFirst.push(dateNormalChartFirst);
                        recordsArrayChartFirst.push(action.count[Object.keys(action.count)[i]].allRecordsToday);

                    }
                    break;
                case 'recordsToday':
                    for(let i = 0; i < lengthChartFirst; i++){
                        dateNormalChartFirst = moment(Object.keys(action.count)[i]).format("D MMM")
                        dateArrayChartFirst.push(dateNormalChartFirst);
                        recordsArrayChartFirst.push(action.count[Object.keys(action.count)[i]].recordsToday);

                    }
                    break;
                case 'recordsOnlineToday':
                    for(let i = 0; i < lengthChartFirst; i++){
                        dateNormalChartFirst = moment(Object.keys(action.count)[i]).format("D MMM")
                        dateArrayChartFirst.push(dateNormalChartFirst);
                        recordsArrayChartFirst.push(action.count[Object.keys(action.count)[i]].recordsOnlineToday);

                    }
                    break;

            }

            return{
                ...state,
                isLoadingFirst: false,
                countRecAndCliChart: {
                    dateArrayChartFirst,
                    recordsArrayChartFirst
                }
            };
        case analiticsConstants.GET_STAFFS_ANALYTICS_FOR_ALL_SUCCESS:
                appointmentTime = 0;
                percentWorkload = 0;
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
                    ratioToYesterday,
                },
                isLoadingSecond: false
            };
        case analiticsConstants.GET_STAFFS_ANALYTICS_CHART_SUCCESS:
            let dateArrayChart = [], recordsArrayChart = [], dateNormal = '';

            let length = Object.keys(action.count).length;

            for(i = 0; i < length; i++){
                dateNormal = moment(Object.keys(action.count)[i]).format("D MMM");
                dateArrayChart.push(dateNormal);
                recordsArrayChart.push(action.count[Object.keys(action.count)[i]].percentWorkload);
            }

            return{
                ...state,
                isLoadingSecond: false,
                staffsAnalyticChart:{
                    dateArrayChart,
                    recordsArrayChart
                }

            };
        case analiticsConstants.GET_STAFFS_ANALYTICS_FOR_ALL_CHART_SUCCESS:
            dateArrayChart= [];
            recordsArrayChart = [];
            dateNormal = '';
            length = Object.keys(action.count).length;
            let i=0;
            for(i = 0; i < length; i++){
                dateNormal = moment(Object.keys(action.count)[i]).format("D MMM");
                dateArrayChart.push(dateNormal);
                recordsArrayChart.push(action.count[Object.keys(action.count)[i]].percentWorkload);
            }
            return{

                ...state,
                isLoadingSecond: false,
                staffsAnalyticChart:{
                    dateArrayChart,
                    recordsArrayChart
                }
            };
            case analiticsConstants.GET_RECORDS_AND_CLIENTS_CHART_REQUEST:
            return{
                ...state,
                isLoadingFirst: true

            };
        case analiticsConstants.GET_RECORDS_AND_CLIENTS_CHART_FAILURE:
            return{
                ...state,
                isLoadingFirst: false

            };
        case analiticsConstants.GET_STAFFS_ANALYTICS_CHART_REQUEST:


            return {
                ...state,
                isLoadingSecond: true
            };
            case analiticsConstants.GET_STAFFS_ANALYTICS_CHART_FAILURE:
            return {
                ...state,
                isLoadingSecond: false
            };
            case analiticsConstants.GET_STAFFS_ANALYTICS_FOR_ALL_CHART_REQUEST:
            return {
                ...state,
                isLoadingSecond: true
            };
            case analiticsConstants.GET_STAFFS_ANALYTICS_FOR_ALL_CHART_FAILURE:
            return {
                ...state,
                isLoadingSecond: false
            };

        default:
            return state
    }
}
