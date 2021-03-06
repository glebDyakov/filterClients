import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import Modal from '@trendmicro/react-modal';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import PropTypes from 'prop-types';

import { DatePicker } from '../DatePicker';
import { AddAppointmentNew } from './AddAppointmentNew';
import useStaffs from '../../_hooks/useStaffs';
import useServices from '../../_hooks/useServices';
import useSWR from 'swr';
import { staffService } from '../../_services';
import Loader from '../../_components/Loader';
import { DAY_MINUTES } from '../../_constants/global.constants';
import { calendarActions } from '../../_actions';

const AddBookedServiceModal = ({ t, i18n: { language }, closeModal, searchedService, clients, dispatch }) => {
  const [activeDay, setActiveDay] = useState(new Date());
  const [timeTrigger, setTimeTrigger] = useState(false);
  const [bookingDays, setBookingDays] = useState([]);
  const [isTimeLoaded, setIsTimeLoaded] = useState(false);

  const { data: time } = useSWR(['availableTimetableStaffs', timeTrigger], async () => {
    const from = moment(activeDay)
      .startOf('day')
      .format('x');
    const to = moment(activeDay)
      .add(2, 'months')
      .endOf('day')
      .format('x');
    const result = await staffService.getTimetableStaffs(from, to);
    return result;
  });

  useEffect(() => {
    if (time) {
    const days = [];
      (time || []).forEach((item) => {
        if ((searchedService.staffs || []).find((staff) => staff.staffId === item.staffId)) {
          const serviceDurationMillis = searchedService.duration * 1000;
          item.availableDays.forEach((day) => {
            const hasTime = day.availableTimes.reduce(
              (acc, time) => acc || time.endTimeMillis - time.startTimeMillis >= serviceDurationMillis,
              false
            );
            if (hasTime && !days.includes(day.dayMillis) && days.length < 8) {
              const indexOfMaxValue = days.indexOf(Math.max(...days));
              if (indexOfMaxValue === -1 || days[indexOfMaxValue] < day.dayMillis) {
                days.push(day.dayMillis);
              } else {
                days[indexOfMaxValue] = day.dayMillis;
              }
            }
          });
        }
      });

      const data = days
        .sort((a, b) => a - b)
        .map((el) => {
          const day = moment(el, 'x');
          const monthDay = day.format('D MMMM');
          const weekDay = day.format('dd');
          const dayStart = day.startOf('day').format('x');
          const dayEnd = day.endOf('day').format('x');

          return {
            day: new Date(day),
            monthDay,
            weekDay:
              (moment(day)
                .startOf('day')
                .isSame(moment().startOf('day'))
                ? `${t('??????????????')}, `
                : '') +
              weekDay[0].toUpperCase() +
              weekDay[1],
            dayInterval: [dayStart, dayEnd],
          };
        });

      setBookingDays([...data]);

      if (!isTimeLoaded) {
        setActiveDay(data.length && data[0] ? new Date(moment(data[0].day).startOf('day')) : new Date());
        setIsTimeLoaded(true);
      }
    }
  }, [time]);

  const [showNextModal, setShowNextModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const staffs = useStaffs();
  const services = useServices();

  const bookingDayOnClick = (bookingDay) => {
    setActiveDay(bookingDay.day);
  };

  const availableTimeOnClick = (staff, availableTime) => {
    setSelectedStaff(staff);
    setSelectedTime(availableTime);
  };

  const addAppointment = (appointment, serviceId, staffId, clientId, coStaffs) =>
    dispatch(calendarActions.addAppointment(JSON.stringify(appointment), serviceId, staffId, clientId, '', '', coStaffs));

  const showPrevModal = useCallback(() => setShowNextModal(false), []);

  const getAvailableTimes = (staffId) => {
    const staff = (time || []).find((staff) => staffId === staff.staffId);
    if (staff) {
      const day = staff.availableDays.find((day) => moment(day.dayMillis, 'x').startOf('day').isSame(moment(activeDay).startOf('day')));
      if (day) {
        const availableTimes = [];
         day.availableTimes.forEach((item) => {
          const duration = searchedService.duration * 1000;
          const hasTime = item.endTimeMillis - item.startTimeMillis >= duration;
          if (hasTime) {
            let start = item.startTimeMillis;
            while (start <= item.endTimeMillis) {
              availableTimes.push(moment(start, 'x').format('HH:mm'));
              start += duration;
            }
          }
        });

        return availableTimes;
      }
      return null;
    }
    return null;
  }

  return (
    <>
      <Modal size="sm" style={{ maxWidth: '1100px' }} onClose={closeModal} showCloseButton={false} className="mod">
        <div className="modal_add_booking_service" tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="" role="document">
            <div className="modal-content visibleDropdown">
              <div className="modal-header">
              <div className="d-flex align-items-center service-info">
                <span className={`color-circle ${searchedService.color.toLowerCase()}`}/>
                <div>
                  <h4 className="modal-title">{searchedService.name}</h4>
                  {!!searchedService.details && <div className="service-details">{searchedService.details}</div>}
                </div>
              </div>
              <img className="close_btn" src={`${process.env.CONTEXT}public/img/icons/cancel.svg`} onClick={closeModal} alt={t("??????????????")}></img>
              </div>
              

              <div className="modal-inner bg-modals">
                <div className="p-3 bg-white search__modal_block">
                  {time ? (
                    <div className="d-flex">
                      <div className="modal__inner_header days-list">
                        {bookingDays.map((bookingDay, index) => {
                          const isActiveDay = moment(bookingDay.day)
                            .startOf('day')
                            .isSame(moment(activeDay).startOf('day'));

                          return (
                            <div
                              key={bookingDay.dayInterval[0]}
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
                          selectedDay={activeDay}
                          type="day"
                          handleDayClick={(day) => {
                            setActiveDay(day);
                            setTimeTrigger(day);
                            setIsTimeLoaded(false);
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <Loader />
                  )}
                  <div>
                    {searchedService.staffs?.map((staff) => {
                        const availableTimes = getAvailableTimes(staff.staffId);
                        if (availableTimes) {
                          const staffData = staffs.staff.find((item) => item.staffId === staff.staffId);
                          return (
                            <div key={staff.staffId} className="staff-item staff_item_mobile">
                              <img
                                className="staff-image"
                                src={
                                  staffData?.imageBase64
                                    ? 'data:image/png;base64,' + staffData.imageBase64
                                    : `${process.env.CONTEXT}public/img/avatar.svg`
                                }
                              />
                              <div className="staff-info ">
                                <p className="staff-name font-weight-bold">{`${staffData.firstName} ${staffData.lastName}`}</p>
                                <div className="staff-service-info-wrap">
                                  <div className="staff-service-info">{`${staff.serviceDuration / 60} ${t('??????????')}`}</div>
                                  <div className="staff-service-info">{`${searchedService.priceFrom} - ${searchedService.priceTo} ${searchedService.currency}`}</div>
                                </div>
                              </div>
                              <div
                                className={
                                  'm-3 ml-auto booking-timetable' +
                                  `${availableTimes.length <= 4 ? ' timetable_grid_four_elements' : ''}` +
                                  `${
                                    availableTimes.length > 4 && availableTimes.length < 7
                                      ? ' timetable_grid_seven_elements'
                                      : ''
                                  }`
                                }
                              >
                                {availableTimes.map((availableTime, index) => (
                                  <span
                                    key={availableTime + index}
                                    className={`timetable-item border border-1 ${selectedStaff?.staffId === staff.staffId &&
                                      availableTime === selectedTime &&
                                      'text-white selected-time'}`}
                                    onClick={() => availableTimeOnClick({ ...staffData, availableTimes }, availableTime)}
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
                  {t('????????????????????')}
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
          services={services}
          clickedTime={
            selectedTime
              ? +moment(activeDay)
                  .startOf('day')
                  .set({ hour: selectedTime.split(':')[0], minute: selectedTime.split(':')[1], seconds: 0 })
                  .format('x')
              : null
          }
          minutes={selectedStaff.availableTimes ? DAY_MINUTES.filter((item) => !selectedStaff.availableTimes.includes(item)) : []}
          staffId={selectedStaff}
          selectedDayMoment={moment(activeDay).startOf('day')}
          selectedDay={new Date(moment(activeDay).startOf('day'))}
          disableStaff
          selectedService={searchedService}
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
  searchedService: PropTypes.object.isRequired,
};

export const AddBookedService = connect()(withTranslation('common')(AddBookedServiceModal));
