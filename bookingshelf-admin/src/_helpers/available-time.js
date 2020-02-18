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

export const getStaffListWithAppointments = ({ appointments, staffWithTimetable, staff, excludeCurrentStaff }) => {
    const staffAll = excludeCurrentStaff ? [] : [staffWithTimetable];

    const activeStaff = staff && staff.find(item => item.staffId === staffWithTimetable.staffId);
    const costaffs = activeStaff && activeStaff.costaffs;
    if (costaffs) {
        costaffs.forEach(item => {
            staffAll.push(item)
        })
    }

    return appointments && appointments.filter(item => staffAll.some(currentStaff => (item.staff && item.staff.staffId) === currentStaff.staffId))
}

export const isAvailableTime = (startTime, endTime, staffWithTimetable, appointments, reservedTimes, staff, extraCheck = null) => {
    const intervals = []

    for(let i = startTime; i < endTime; i+= 15 * 60000) {
        intervals.push(i)
    }
    const staffWithReservedTimes = reservedTimes && reservedTimes.find(item => (item.staff && item.staff.staffId) === staffWithTimetable.staffId)

    const staffListWithAppointments = getStaffListWithAppointments({ appointments, staffWithTimetable, staff });

    return intervals.every(interval => {
        const isOnAnotherVisit = staffListWithAppointments.some(staffWithAppointments => checkIsOnAnotherVisit(staffWithAppointments, interval));
        const isOnAnotherReservedTime = checkIsOnAnotherReservedTime(staffWithReservedTimes, interval);

        return staffWithTimetable && staffWithTimetable.timetables && staffWithTimetable.timetables.some(time => {
            const isIncludedInTimetable = _checkTimeForCalendarElement(time.startTimeMillis, time.endTimeMillis, interval);

            return (isIncludedInTimetable && !isOnAnotherVisit && !isOnAnotherReservedTime) || (extraCheck && extraCheck(interval))
        })
    });
};

export const getNearestAvailableTime = (startTime, endTime, timetableItems, appointments, reservedTimes, staff, extraCheck) => {
    let availableCellTime = endTime;
    endTime = endTime + (15 * 60000);
    const isNextCellAvailable = timetableItems.every(staffWithTimetable => isAvailableTime(startTime, endTime, staffWithTimetable, appointments, reservedTimes, staff, extraCheck))
    if (isNextCellAvailable) {
        availableCellTime = getNearestAvailableTime(startTime, endTime, timetableItems, appointments, reservedTimes, staff, extraCheck)
    }

    return availableCellTime
}
