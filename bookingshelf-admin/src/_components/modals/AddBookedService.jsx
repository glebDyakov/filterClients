import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import Modal from "@trendmicro/react-modal";
import { withTranslation } from "react-i18next";
import moment from "moment";
import PropTypes from "prop-types";

import { staffActions } from "../../_actions";

import { DatePicker } from "../DatePicker";

const AddBookedServiceModal = (props) => {
  const {
    t,
    i18n: { language },
    dispatch,
    closeModal,
    timetable,
    searchedService,
  } = props;
  const [activeDay, setActiveDay] = useState(0);
  const [state, forceUpdate] = useState(false);
  const [activeTimesByStaffs, setActiveTimesByStaffs] = useState([]);
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
    if (!searchedService.staffs) return;

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
    });
    // console.log(searchedService);

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
  // console.log(timetable, searchedService);
  // console.log(activeTimesByStaffs);

  const bookingDayOnClick = useCallback(
    (dayInterval) =>
      dispatch(staffActions.getTimetableStaffs(...dayInterval, true)),
    []
  );

  const handleDayChange = (date) => {
    const day = moment(date.getTime(), "x").subtract(12, "hours");
    const dayStart = day.format("x");
    const dayEnd = day.add(1, "days").format("x");

    bookingDayOnClick([dayStart, dayEnd]);
  };

  const checkTimeOnAvailability = (staffId, time) => {
    const staff = activeTimesByStaffs.find(
      (staff) => staff.staffId === staffId
    );

    return staff?.activeTimes.includes(time);
  };

  const availableTimeOnClick = (staff, availableTime) => {
    const updatedActiveTimesByStaffs = activeTimesByStaffs;

    updatedActiveTimesByStaffs.map(
      (activeTimesByStaff) => (
        activeTimesByStaff.staffId === staff.staffId &&
          (activeTimesByStaff.activeTimes.includes(availableTime)
            ? (activeTimesByStaff.activeTimes = activeTimesByStaff.activeTimes.filter(
                (activeTime) => activeTime !== availableTime
              ))
            : activeTimesByStaff.activeTimes.push(availableTime)),
        activeTimesByStaff
      )
    );

    setActiveTimesByStaffs(updatedActiveTimesByStaffs);
    forceUpdate(!state);
  };

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
                  {bookingDays.map((bookingDay, index) => (
                    <div
                      key={bookingDay.weekDay}
                      className={`p-2 border border-1 m-2 ${index ===
                        activeDay && "bg-dark"}`}
                      onClick={() => {
                        bookingDayOnClick(bookingDay.dayInterval);
                        setActiveDay(index);
                      }}
                    >
                      <p
                        className={`p-0 m-0 font-weight-bold ${index ===
                          activeDay && "text-white"}`}
                      >
                        {bookingDay.monthDay}
                      </p>
                      <p className={index === activeDay && "text-white"}>
                        {bookingDay.weekDay}
                      </p>
                    </div>
                  ))}
                  <div className="p-4 border border-1 m-auto booking-calendar">
                    <DatePicker
                      isAddBookedService
                      language={language}
                      selectedDays={new Date()}
                      handleDayChange={handleDayChange}
                    />
                  </div>
                </div>
                <div>
                  {searchedService.staffs?.map(
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
                                  className={`p-1 border border-1 ${checkTimeOnAvailability(
                                    staff.staffId,
                                    availableTime
                                  ) && "text-white bg-dark"}`}
                                  onClick={() =>
                                    availableTimeOnClick(staff, availableTime)
                                  }
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
