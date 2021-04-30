import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import Modal from '@trendmicro/react-modal';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import PropTypes from 'prop-types';

import {
  staffActions,
  //  calendarActions
} from '../../_actions';

import { DatePicker } from '../DatePicker';
import { AddAppointmentNew } from './AddAppointmentNew';
import useStaffs from '../../_hooks/useStaffs';
import useServices from '../../_hooks/useServices';

const AddBookedServiceModal = ({ t, i18n: { language }, dispatch, closeModal, timetable, searchedService, clients }) => {
  const [activeDay, setActiveDay] = useState(new Date());
  const [activeTimesByStaffs, setActiveTimesByStaffs] = useState([]);
  const [showNextModal, setShowNextModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const staffs = useStaffs();
  const services = useServices();
  const [bookingDays] = useState(
    Array(8)
      .fill({})
      .map((el, index) => {
        const day = moment().add(index, 'days');
        const monthDay = day.format('D MMMM');
        const weekDay = day.format('dd');
        const dayStart = day.startOf('day').format('x');
        const dayEnd = day.endOf('day').format('x');

        return {
          day: new Date(day),
          monthDay,
          weekDay: (index ? '' : `${t('Сегодня')}, `) + weekDay[0].toUpperCase() + weekDay[1],
          dayInterval: [dayStart, dayEnd],
        };
      })
  );

  useEffect(() => {
    dispatch(staffActions.getTimetableStaffs(...bookingDays[0].dayInterval, true));
  }, []);

  useEffect(() => {
    if (!searchedService.staffs) return;
    searchedService.staffs.forEach((staff, index) => {
      const staffTimetable = timetable?.find((staffTimetable) => staffTimetable.staffId === staff.staffId);

      searchedService.staffs[index] = {
        ...searchedService.staffs[index],
        ...staffTimetable,
      };

      searchedService.staffs[index].availableTimes = staffTimetable?.availableDays?.[0]?.availableTimes.reduce((acc, availableTime) => {
        const serviceDurationMillis = staff.serviceDuration * 1000;
        const endTimeBookingMillis = availableTime.endTimeMillis - serviceDurationMillis;
        const intervalMillis = 30 * 60 * 1000;
        let subtimeMillis = availableTime.startTimeMillis;

        while (subtimeMillis <= endTimeBookingMillis) {
          acc.push(moment(subtimeMillis, 'x').format('HH:mm'));
          subtimeMillis += intervalMillis;
        }

        return acc;
      }, []);
    });

    setActiveTimesByStaffs(
      searchedService.staffs.reduce(
        (acc, staff) => (
          staff.availableTimes &&
            acc.push({
              staffId: staff.staffId,
              activeTimes: [],
            }),
          acc
        ),
        []
      )
    );
  }, [timetable]);

  const getTimetableStaffs = (dayInterval) => dispatch(staffActions.getTimetableStaffs(...dayInterval, true));

  const bookingDayOnClick = (bookingDay, index) => {
    getTimetableStaffs(bookingDay.dayInterval);
    setActiveDay(bookingDay.day);
  };

  const handleDayChange = useCallback((date) => {
    const day = moment(date.getTime(), 'x').subtract(12, 'hours');
    const dayStart = day.format('x');
    const dayEnd = day.add(1, 'days').format('x');

    getTimetableStaffs([dayStart, dayEnd]);
  }, []);

  const checkTimeOnAvailability = (staffId, time) =>
    activeTimesByStaffs.find((staff) => staff.staffId === staffId)?.activeTimes.includes(time);

  const availableTimeOnClick = (staff, availableTime) => {
    setSelectedStaff(staff);
    setSelectedTime(availableTime);
  };

  const addAppointment = (appointment, serviceId, staffId, clientId, coStaffs) => console.log('qwe');
  // dispatch(
  //   calendarActions.addAppointment(
  //     JSON.stringify(appointment),
  //     serviceId,
  //     staffId,
  //     clientId,
  //     // startTime,
  //     // endTime,
  //     coStaffs
  //   )
  // );

  const showPrevModal = useCallback(() => setShowNextModal(false), []);

  return (
    <>
      <Modal size="sm" style={{ maxWidth: '1100px' }} onClose={closeModal} showCloseButton={false} className="mod">
        <div className="modal_add_booking_service" tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="" role="document">
            <div className="modal-content visibleDropdown">
              <div className="modal-header">
                <h4 className="modal-title">{searchedService.name}</h4>
                <button type="button" className="close" onClick={closeModal} aria-label="Close">
                  <span aria-hidden="true" />
                </button>
              </div>

              <div className="modal-inner bg-modals">
                <div className="p-3 bg-white">
                  <div className="d-flex">
                    <div className="modal__inner_header days-list">
                      {bookingDays.map((bookingDay, index) => {
                        const isActiveDay = moment(bookingDay.day)
                          .startOf('day')
                          .isSame(moment(activeDay).startOf('day'));

                        return (
                          <div
                            key={bookingDay.weekDay}
                            className={`border border-1 days-list-item ${isActiveDay && 'selected-day'}`}
                            onClick={() => bookingDayOnClick(bookingDay, index)}
                          >
                            <p className={`p-0 m-0 font-weight-bold ${isActiveDay && 'text-white'}`}>{bookingDay.monthDay}</p>
                            <p className={isActiveDay && 'text-white'}>{bookingDay.weekDay}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="border-1 booking-calendar">
                      <DatePicker
                        showArrows={false}
                        language={language}
                        handleDayChange={handleDayChange}
                        selectedDay={activeDay}
                        type="day"
                        handleDayClick={(day) => setActiveDay(day)}
                      />
                    </div>
                  </div>
                  <div>
                    {searchedService.staffs?.map((staff) => {
                      if (staff.availableTimes) {
                        const staffData = staffs.staff.find((item) => item.staffId === staff.staffId);
                        return (
                          <div
                            key={staff.staffId}
                            className="staff-item"
                          >
                            <img className="staff-image" src={staffData?.imageBase64 ? 'data:image/png;base64,' + staffData.imageBase64 : ''} />
                            <div className="staff-info ">
                              <p className="staff-name font-weight-bold">{`${staff.firstName} ${staff.lastName}`}</p>
                              <div className="staff-service-info-wrap">
                                <div className="staff-service-info">{`${staff.serviceDuration / 60} ${t('мин')}`}</div>
                                <div className="staff-service-info">{`${searchedService.priceFrom}-${searchedService.priceTo} ${searchedService.currency}`}</div>
                              </div>
                            </div>
                            <div className="m-3 ml-auto booking-timetable">
                              {staff.availableTimes.map((availableTime, index) => (
                                <span
                                  key={availableTime + index}
                                  className={`timetable-item border border-1 ${selectedStaff?.staffId === staff.staffId &&
                                    availableTime === selectedTime &&
                                    'text-white selected-time'}`}
                                  onClick={() => availableTimeOnClick(staff, availableTime)}
                                >
                                  {availableTime}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              </div>
              <div className="modal-footer justify-content-end">
                <button type="button" className="button" onClick={() => setShowNextModal(true)} disabled={!selectedTime}>
                  {t('Продолжить')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {showNextModal && (
        <AddAppointmentNew
          isAddBookedService
          onClose={closeModal}
          searchedServiceName={searchedService.name}
          addAppointment={addAppointment}
          showPrevModal={showPrevModal}
          clients={clients}
          staff={staffs.staff}
          staffs={staffs}
          randNum={Math.random()}
          // adding={adding}
          // status={status}
          services={services}
          clickedTime={selectedTime ? +moment(activeDay).startOf('day').set({"hour": selectedTime.split(':')[0], "minute": selectedTime.split(':')[1], "seconds": 0}).format('x') : null}
          minutes={selectedStaff.availableTimes ? selectedStaff.availableTimes : []}
          staffId={selectedStaff}
          selectedDayMoment={moment(activeDay).startOf('day')}
          selectedDay={new Date(moment(activeDay).startOf('day'))}
          // getHours={this.changeTime}
        />
      )}
    </>
  );
};

AddBookedServiceModal.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  timetable: PropTypes.array.isRequired,
  searchedService: PropTypes.object.isRequired,
};

export const AddBookedService = connect()(withTranslation('common')(AddBookedServiceModal));
