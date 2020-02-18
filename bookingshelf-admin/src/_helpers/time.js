import moment from "moment";

export function roundQuarterTime(start) {
    const remainder = 15 - (start.minute() % 15);

    return moment(start).add(remainder, "minutes").format("x");
}

export function diffTime(end, start) {

    return Math.round((parseInt(end)-parseInt(start))/(1000*60*60*24));
}

export function getWeekRange(date) {
    return {
        from: moment(date).utc()
            .startOf('week')
            .toDate(),
        to: moment(date)
            .endOf('week')
            .toDate(),
    };
}

export const getCurrentCellTime = (selectedDays, selectedDaysKey, time ) => {
    const startOfSelectedDay = moment(selectedDays[selectedDaysKey]).startOf('day').format('DD/MM/YYYY');
    return parseInt(moment(startOfSelectedDay + ' ' + time, 'DD/MM/YYYY HH:mm').format('x'))
};
