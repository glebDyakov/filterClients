import moment from 'moment';
export const culcDay = (selectedDay, adaptiveVersion) => {
    if (adaptiveVersion === "desctop") {
        let date = moment(selectedDay).format('MMMM,DD')
        date = date[0].toUpperCase() + date.slice(1);
        return date.split(",").reverse().join(" ")
    }
    else {
        return moment(selectedDay).format('DD MMM YYYY');
    }

}