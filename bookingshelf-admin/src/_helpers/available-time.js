const _checkTimeForCalendarElement = (startTime, endTime, interval) => {
    return startTime <= interval && endTime > interval
}

export const checkIsOnAnotherReservedTime = (staffWithReservedTimes, interval) => {
    return staffWithReservedTimes && staffWithReservedTimes.reservedTimes && staffWithReservedTimes.reservedTimes.some(element =>
        _checkTimeForCalendarElement(element.startTimeMillis, element.endTimeMillis, interval)
    )
};

export const checkIsOnAnotherVisit = (staffWithAppointments, interval) => {
    return staffWithAppointments && staffWithAppointments.appointments && staffWithAppointments.appointments.some(element =>
        _checkTimeForCalendarElement(element.appointmentTimeMillis, (element.appointmentTimeMillis + (element.duration * 1000)), interval)

    )
};

export const isAvailableTime = (startTime, endTime, staffWithTimetable, appointments, reservedTimes, extraCheck = null) => {
    const intervals = []

    for(let i = startTime; i < endTime; i+= 15 * 60000) {
        intervals.push(i)
    }
    const staffWithAppointments = appointments && appointments.find(item => (item.staff && item.staff.staffId) === staffWithTimetable.staffId)
    const staffWithReservedTimes = reservedTimes && reservedTimes.find(item => (item.staff && item.staff.staffId) === staffWithTimetable.staffId)

    return intervals.every(interval => {
        const isOnAnotherVisit = checkIsOnAnotherVisit(staffWithAppointments, interval);
        const isOnAnotherReservedTime = checkIsOnAnotherReservedTime(staffWithReservedTimes, interval);

        return staffWithTimetable && staffWithTimetable.timetables && staffWithTimetable.timetables.some(time => {
            const isIncludedInTimetable = _checkTimeForCalendarElement(time.startTimeMillis, time.endTimeMillis, interval);

            return (isIncludedInTimetable && !isOnAnotherVisit && !isOnAnotherReservedTime) || (extraCheck && extraCheck(interval))
        })
    });
};
