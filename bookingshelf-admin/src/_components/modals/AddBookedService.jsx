import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import Modal from "@trendmicro/react-modal";
import { withTranslation } from "react-i18next";
import moment from "moment";
import PropTypes from "prop-types";

import { staffActions } from "../../_actions";

import { DatePicker } from "../DatePicker";

const AddBookedServiceModal = (props) => {
  const { t, dispatch, closeModal, timetable, searchedService } = props;
  const [state, forceUpdate] = useState(false);
  const bookingDays = Array(8)
    .fill({})
    .map((el, index) => {
      const day = moment().add(index, "days");
      const monthDay = day.format("D MMMM");
      const weekDay = day.format("dd");
      const dayStart = day.startOf("day").format("x");
      const dayEnd = day.endOf("day").format("x");

      return {
        monthDay,
        weekDay:
          (index ? "" : `${t("Сегодня")}, `) +
          weekDay[0].toUpperCase() +
          weekDay[1],
        dayInterval: [dayStart, dayEnd],
      };
    });

  useEffect(() => {
    dispatch(
      staffActions.getTimetableStaffs(...bookingDays[0].dayInterval, true)
    );
  }, []);

  useEffect(() => {
    searchedService.staffs.forEach((staff, index) => {
      const staffTimetable = timetable.find(
        (staffTimetable) => staffTimetable.staffId === staff.staffId
      );

      searchedService.staffs[index] = {
        ...searchedService.staffs[index],
        ...staffTimetable,
      };

      searchedService.staffs[
        index
      ].availableTimes = staffTimetable.availableDays?.[0]?.availableTimes.reduce(
        (acc, availableTime) => {
          const serviceDurationMillis = staff.serviceDuration * 1000;
          const endTimeBookingMillis =
            availableTime.endTimeMillis - serviceDurationMillis;
          const intervalMillis = 30 * 60 * 1000;
          let subtimeMillis = availableTime.startTimeMillis;

          while (subtimeMillis <= endTimeBookingMillis) {
            acc.push(moment(subtimeMillis, "x").format("HH:mm"));
            subtimeMillis += intervalMillis;
          }

          return acc;
        },
        []
      );

      forceUpdate(!state);
    });
  }, [timetable]);
  // console.log(timetable, searchedService);

  const bookingDayOnClick = useCallback(
    (dayInterval) =>
      dispatch(staffActions.getTimetableStaffs(...dayInterval, true)),
    []
  );

  return (
    <Modal
      size="sm"
      style={{ maxWidth: "960px" }}
      onClose={closeModal}
      showCloseButton={false}
      className="mod"
    >
      <div
        className="modal_add_booking_service"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div className="" role="document">
          <div className="modal-content visibleDropdown">
            <div className="modal-header">
              <h4 className="modal-title">{searchedService.name}</h4>
              <button
                type="button"
                className="close"
                onClick={closeModal}
                aria-label="Close"
              >
                <span aria-hidden="true" />
              </button>
            </div>

            <div className="modal-inner bg-secondary">
              <div className="p-3 mx-4 mb-4 bg-light">
                <div className="d-flex">
                  {bookingDays.map((bookingDay) => (
                    <div
                      key={bookingDay.weekDay}
                      className="p-2 border border-1 m-2"
                      onClick={() => bookingDayOnClick(bookingDay.dayInterval)}
                    >
                      <p className="p-0 m-0 font-weight-bold">
                        {bookingDay.monthDay}
                      </p>
                      <p>{bookingDay.weekDay}</p>
                    </div>
                  ))}
                  <div className="p-4 border border-1 m-auto booking-calendar">
                    {/* <DatePicker /> */}
                  </div>
                </div>
                <div>
                  {searchedService.staffs.map(
                    (staff) =>
                      staff.availableTimes && (
                        <div
                          key={staff.staffId}
                          className="d-flex align-items-center border border-left-0 border-right-0 border-bottom-0 m-2"
                        >
                          <img
                            src="/public/img/icons/Calendar.svg"
                            width="30"
                            height="30"
                          />
                          <div className="ml-3">
                            <p className="mb-4 font-weight-bold">{`${staff.firstName} ${staff.lastName}`}</p>
                            <div>
                              <span className="p-1 border border-1 mr-2">{`${staff.serviceDuration /
                                60} ${t("мин")}`}</span>
                              <span className="p-1 border border-1">{`${searchedService.priceFrom}-${searchedService.priceTo} ${searchedService.currency}`}</span>
                            </div>
                          </div>
                          <div className="m-3 ml-auto booking-timetable">
                            {staff.availableTimes.map(
                              (availableTime, index) => (
                                <span
                                  key={index}
                                  className="p-1 border border-1"
                                >
                                  {availableTime}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer justify-content-end">
              <button type="button" className="button">
                {t("Продолжить")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

AddBookedServiceModal.propTypes = {
  t: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  timetable: PropTypes.array.isRequired,
  searchedService: PropTypes.object.isRequired,
};

export const AddBookedService = connect()(
  withTranslation("common")(AddBookedServiceModal)
);
