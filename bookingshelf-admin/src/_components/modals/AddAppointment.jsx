import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import TimePicker from "rc-time-picker";
import { AsyncTypeahead } from "react-bootstrap-typeahead";

import "rc-time-picker/assets/index.css";
import moment from "moment";
import PropTypes from "prop-types";
import { access } from "../../_helpers/access";
import { clientActions, servicesActions, staffActions } from "../../_actions";
import Modal from "@trendmicro/react-modal";
import { calendarActions } from "../../_actions/calendar.actions";
import ReactPaginate from "react-paginate";
import Paginator from "../Paginator";
import { checkIsOnAnotherVisit, isAvailableTime } from '../../_helpers/available-time';
import { clientService } from "../../_services";
import Hint from "../Hint";
import { isValidEmailAddress } from "../../_helpers/validators";
import { isValidNumber } from "libphonenumber-js";
import { compose } from "redux";
import { withTranslation } from "react-i18next";

import CheckModal from "./CheckModal";

class AddAppointment extends React.Component {
  constructor(props) {
    super(props);
    const sortedAppointment = props.appointmentEdited
      ? props.appointmentEdited.sort(
        (a, b) => a.appointmentId - b.appointmentId
      )
      : null;
    const { authentication } = props;
    let defaultPhoneValue;
    switch (
    authentication &&
    authentication.user &&
    authentication.user.countryCode
      ) {
      case "RUS":
        defaultPhoneValue = "+7";
        break;
      case "UKR":
        defaultPhoneValue = "+380";
        break;
      case "BLR":
      default:
        defaultPhoneValue = "+375";
    }
    this.state = {
      availableCoStaffs: props.staffs && props.staffs.timetable,
      coStaffs: props.appointmentEdited
        ? props.appointmentEdited[0].coStaffs || []
        : [],
      isAddCostaff:
        props.appointmentEdited &&
        props.appointmentEdited[0].coStaffs &&
        props.appointmentEdited[0].coStaffs.length > 0,
      appointmentsToDelete: [],
      serviceCurrent: [
        {
          id: -1,
          service: [],
        },
      ],
      selectedTypeahead: [],
      typeAheadOptions: {
        clientFirstName: {
          label: this.props.t("??????"),
          selectedKey: "firstName",
          options: [],
          isValid: (clientFirstNameValue) =>
            this.state.clientPhone
              ? (clientFirstNameValue && clientFirstNameValue.length) > 0
              : true,
        },
        clientPhone: {
          label: this.props.t("??????????????"),
          lableHolder: this.props.t("??????????????"),
          selectedKey: "phone",
          options: [],
          defaultValue: defaultPhoneValue,
          isValid: (clientPhoneValue) =>
            clientPhoneValue
              ? isValidNumber(clientPhoneValue)
              : this.state.clientFirstName
              ? (clientPhoneValue && clientPhoneValue.length) > 0
              : true,
        },
        clientLastName: {
          label: this.props.t("??????????????"),
          labelHolder: this.props.t("??????????????"),
          selectedKey: "lastName",
          options: [],
          isValid: () => true,
        },
        carBrand: {
          label: this.props.t("?????????? ????????"),
          selectedKey: "carBrand",
          options: [],
          isValid: () => true,
        },
        carNumber: {
          label: this.props.t("??????. ??????????"),
          selectedKey: "carNumber",
          options: [],
          isValid: () => true,
        },
        clientEmail: {
          label: "Email",
          labelHolder: `email (${this.props.t("??????????????????????")})`,
          selectedKey: "email",
          options: [],
          isValid: (clientEmailValue) =>
            clientEmailValue ? isValidEmailAddress(clientEmailValue) : true,
        },
      },
      allPrice: 0,
      servicesSearch: "",
      staffs: props.staffs,
      clients: props.clients && props.clients,
      allClients: props.clients,
      services: [props.services],
      clickedTime: props.clickedTime,
      minutes: props.minutes,
      hours: [],
      staffId: props.staffId,
      clientChecked: null,
      clientSubmit: false,
      clientSubmitModal: false,
      appointmentEdited: sortedAppointment,
      timeArrange:
        props.clickedTime !== 0
          ? this.getTimeArrange(
          props.clickedTime,
          props.minutes,
          sortedAppointment
          )
          : null,
      timeNow:
        props.clickedTime === 0 ? moment().format("x") : props.clickedTime,
      staffCurrent: props.staffId ? props.staffId : { id: -1 },
      edit_appointment: props.edit_appointment,
      appointment: [
        {
          appointmentTimeMillis:
            props.clickedTime !== 0 ? props.clickedTime : "",
          duration: "",
          description: "",
          customId: "",
        },
      ],
      editedElement: sortedAppointment,
      visitFreeMinutes: this.getVisitFreeMinutes(sortedAppointment),
      appointmentsAllPrice: 0,
    };

    this.addAppointment = this.addAppointment.bind(this);
    this.handleTypeaheadSelect = this.handleTypeaheadSelect.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleTypeaheadInputChange = this.handleTypeaheadInputChange.bind(
      this
    );
    this.getAppointments = this.getAppointments.bind(this);
    this.setStaff = this.setStaff.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.toggleVisits = this.toggleVisits.bind(this);
    this.setService = this.setService.bind(this);
    this.setTime = this.setTime.bind(this);
    this.disabledMinutes = this.disabledMinutes.bind(this);
    this.disabledHours = this.disabledHours.bind(this);
    this.getHours = this.getHours.bind(this);
    this.removeCheckedUser = this.removeCheckedUser.bind(this);
    this.checkUser = this.checkUser.bind(this);
    this.getFilteredServicesList = this.getFilteredServicesList.bind(this);
    this.handleServicesSearch = this.handleServicesSearch.bind(this);
    this.editClient = this.editClient.bind(this);
    this.getTimeArrange = this.getTimeArrange.bind(this);
    this.getDurationForCurrentStaff = this.getDurationForCurrentStaff.bind(
      this
    );
    this.getVisitFreeMinutes = this.getVisitFreeMinutes.bind(this);
    this.newClient = this.newClient.bind(this);
    this.editAppointment = this.editAppointment.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchAppointments = this.handleSearchAppointments.bind(this);
    this.updateAppointments = this.updateAppointments.bind(this);
    this.handlePageClickAppointments = this.handlePageClickAppointments.bind(
      this
    );
    this.getInfo = this.getInfo.bind(this);
    this.handleTypeaheadSearch = this.handleTypeaheadSearch.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.goToPageCalendar = this.goToPageCalendar.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleCloseSubmitModal = this.handleCloseSubmitModal(this);
    this.updateClients = this.updateClients.bind(this);
    this.renderMenuItemChildren = this.renderMenuItemChildren.bind(this);
  }

  componentDidMount() {
    const { appointmentEdited } = this.state;

    appointmentEdited && this.getInfo(appointmentEdited);
    this.props.dispatch(clientActions.getClientV2(1));
    this.props.dispatch(servicesActions.get());
    this.props.dispatch(servicesActions.getServices());
  }

  componentWillReceiveProps(newProps) {
    if (
      JSON.stringify(this.props.clients) !== JSON.stringify(newProps.clients)
    ) {
      this.setState({
        clients: newProps.clients,
        allClients: newProps.clients,
      });
    }

    if (
      this.state.shouldUpdateCheckedUser &&
      JSON.stringify(this.props.clients) !== JSON.stringify(newProps.clients)
    ) {
      const user =
        newProps.clients.client &&
        newProps.clients.client.length > 0 &&
        newProps.clients.client.find(
          (cl) => cl.phone === newProps.checkedUser.phone
        );
      let finalUser = {};
      const updatedState = { shouldUpdateCheckedUser: false };
      if (user) {
        finalUser = { ...user, appointments: [] };
        this.props.dispatch(
          clientActions.getActiveClientAppointments(user.clientId, 1)
        );
        updatedState.clientChecked = finalUser;
      }
      this.setState(updatedState);
    }

    if (
      JSON.stringify(this.props.checkedUser) !==
      JSON.stringify(newProps.checkedUser)
    ) {
      this.setState({ shouldUpdateCheckedUser: true });
    }

    if (
      newProps.clients.activeClientAppointments &&
      JSON.stringify(this.props.clients.activeClientAppointments) !==
      JSON.stringify(newProps.clients.activeClientAppointments)
    ) {
      let allPrice = 0;
      newProps.clients.activeClientAppointments &&
      newProps.clients.activeClientAppointments.forEach((appointment) => {
        allPrice += appointment.price;
      });
      this.setState({
        allPrice,
        clientChecked: {
          ...this.state.clientChecked,
          appointments: newProps.clients.activeClientAppointments,
        },
      });
    }

    if (
      newProps.clients.activeClient &&
      JSON.stringify(this.props.clients.activeClient) !==
      JSON.stringify(newProps.clients.activeClient)
    ) {
      this.setState({
        clientChecked: {
          ...this.state.clientChecked,
          ...newProps.clients.activeClient,
        },
      });
    }

    if (
      JSON.stringify(this.props.clients) === JSON.stringify(newProps.clients) ||
      newProps.randNum !== this.props.randNum
    ) {
      this.updateAvailableCoStaffs();
      this.setState(
        {
          staffs: newProps.staffs,
          minutes: newProps.minutes,
          staffId: newProps.staffId,
          timeArrange:
            newProps.clickedTime !== 0
              ? this.getTimeArrange(
              newProps.clickedTime,
              newProps.minutes,
              (newProps.appointmentEdited || []).sort(
                (a, b) => a.appointmentId - b.appointmentId
              )
              )
              : null,
          timeNow:
            newProps.clickedTime === 0
              ? moment().format("x")
              : newProps.clickedTime,
          staffCurrent: newProps.staffId ? newProps.staffId : { id: -1 },
          edit_appointment: newProps.edit_appointment,
          editedElement:
            newProps.appointmentEdited &&
            newProps.appointmentEdited.sort(
              (a, b) => a.appointmentId - b.appointmentId
            ),
        },
        () => {}
      );

      // newProps.appointmentEdited!==null&&newProps.appointmentEdited&&this.getInfo(newProps.appointmentEdited[0][0]);
    }

    // if ((JSON.stringify(this.props.services) !==  JSON.stringify(newProps.services))) {
    //     this.setState({
    //         services: [newProps.services]
    //     })
    // }
    // if ( (JSON.stringify(this.props.appointmentEdited) !==  JSON.stringify(newProps.appointmentEdited) ||
    //     JSON.stringify(this.props.clickedTime) !==  JSON.stringify(newProps.clickedTime))) {
    //     this.setState({
    //         appointment: [{appointmentTimeMillis:newProps.clickedTime!==0?newProps.clickedTime:this.state.appointment[0].clickedTime,
    //             duration: newProps.appointmentEdited?newProps.appointmentEdited[0][0].duration:this.state.appointment[0].duration,
    //             description: newProps.appointmentEdited?newProps.appointmentEdited[0][0].description:this.state.appointment[0].description,
    //             customId: newProps.appointmentEdited?newProps.appointmentEdited[0][0].customId:this.state.appointment[0].customId}],
    //     })
    // }
  }

  handleCloseSubmitModal() {
    this.setState({
      clientSubmitModal: false,
    });
  }

  handlePageClickAppointments(data) {
    const { selected } = data;
    const currentPage = selected + 1;
    this.updateAppointments(currentPage);
  }

  updateAppointments(currentPage = 1) {
    let searchValue = "";
    if (this.search.value.length >= 3) {
      searchValue = this.search.value.toLowerCase();
    }
    this.props.dispatch(
      clientActions.getActiveClientAppointments(
        this.state.clientChecked.clientId,
        currentPage,
        searchValue
      )
    );
  }

  handleSearchAppointments() {
    if (this.search.value.length >= 3) {
      this.updateAppointments();
    } else if (this.search.value.length === 0) {
      this.updateAppointments();
    }
  }

  handlePageClick(data) {
    const { selected } = data;
    const currentPage = selected + 1;
    this.updateClients(currentPage);
  }

  updateClients(currentPage = 1) {
    let searchValue = "";
    if (this.search.value.length >= 3) {
      searchValue = this.search.value.toLowerCase();
    }
    this.props.dispatch(clientActions.getClientV2(currentPage, searchValue));
  }

  updateAvailableCoStaffs(appointment = this.state.appointment) {
    const { appointmentsFromProps, reservedTimeFromProps, staff } = this.props;
    const { staffs, staffCurrent } = this.state;

    const availableCoStaffs = staffs.timetable
      .filter((item) => item.staffId !== staffCurrent.staffId)
      .filter((coStaff) => {
        const startTime = parseInt(appointment[0].appointmentTimeMillis);

        const lastAppointmentIndex = appointment.length - 1;
        const endTime =
          parseInt(appointment[lastAppointmentIndex].appointmentTimeMillis) +
          appointment[lastAppointmentIndex].duration * 1000;
        let isOwnInterval;

        if (appointment[0].coStaffs) {
          const isAlreadyCostaff = appointment[0].coStaffs.some(
            (item) => item.staffId === coStaff.staffId
          );
          if (isAlreadyCostaff) {
            const staffWithAppointments =
              appointmentsFromProps &&
              appointmentsFromProps?.find(
                (item) => item.staff.staffId === coStaff.staffId
              );
            const ownRelatedAppointments =
              staffWithAppointments &&
              staffWithAppointments.appointments &&
              staffWithAppointments.appointments
                .filter(
                  (item) =>
                    item.coappointment &&
                    appointment.some(
                      (currentAppointment) =>
                        item.appointmentId ===
                        currentAppointment.appointmentId ||
                        item.appointmentId ===
                        currentAppointment.coAppointmentId
                    )
                )
                .sort(
                  (a, b) => a.appointmentTimeMillis - b.appointmentTimeMillis
                );

            isOwnInterval = (i) =>
              ownRelatedAppointments[0].appointmentTimeMillis <= i &&
              ownRelatedAppointments[ownRelatedAppointments.length - 1]
                .appointmentTimeMillis +
              ownRelatedAppointments[ownRelatedAppointments.length - 1]
                .duration *
              1000 >
              i;
          }
        }

        return isAvailableTime(
          startTime,
          endTime,
          coStaff,
          appointmentsFromProps,
          reservedTimeFromProps,
          staff,
          isOwnInterval
        );
      });

    this.setState({ availableCoStaffs });
  }

  getOptionList(index) {
    const { appointmentsFromProps, reservedTimeFromProps, staff } = this.props;
    const { appointment, staffs, staffCurrent, edit_appointment } = this.state;
    const optionList = [];

    const booktimeStep =
      this.props.company.settings &&
      parseInt(this.props.company.settings.booktimeStep);
    for (let i = booktimeStep; i <= 54000; i += booktimeStep) {
      const hour = Math.floor(i / 3600);
      const minute = i % 3600;
      optionList.push({
        duration: i,
        label: `${hour ? `${hour} ?? ` : ""}${
          minute
            ? `${minute / 60} ${this.props.t("??????????")}`
            : `00 ${this.props.t("??????????")}`
          }`,
      });
    }

    const activeStaffTimetable = staffs.timetable.find(
      (item) => item.staffId === staffCurrent.staffId
    );

    let finalOptionList = optionList;
    if (activeStaffTimetable) {
      finalOptionList = optionList.filter((option) => {
        const startTime = parseInt(appointment[index].appointmentTimeMillis);

        const endTime =
          parseInt(appointment[index].appointmentTimeMillis) +
          option.duration * 1000;
        const lastAppointmentIndex = appointment.length - 1;
        const lastAppointmentEndTime =
          appointment[lastAppointmentIndex].appointmentTimeMillis +
          appointment[lastAppointmentIndex].duration * 1000;

        return isAvailableTime(
          startTime,
          endTime,
          activeStaffTimetable,
          [],
          // (appointmentsFromProps|| []).map(item => {
          //   return {
          //     ...item,
          //     appointments: item?.appointments && item?.appointments?.filter(localAppointment => localAppointment.intersected)
          //   }
          // }),
          reservedTimeFromProps,
          staff,
          (i) => edit_appointment && i < lastAppointmentEndTime
        );
      });
    }

    return finalOptionList.map((option) => (
      <option value={option.duration}>{option.label}</option>
    ));
  }

  getFilteredServicesList(index, extraDuration) {
    const { appointmentsFromProps, reservedTimeFromProps, staff } = this.props;
    const {
      appointment,
      staffs,
      staffId,
      staffCurrent,
      visitFreeMinutes,
      services,
      servicesSearch,
    } = this.state;
    const user = staffs.timetable.find(
      (timetable) => timetable.staffId === staffId.staffId
    );

    return (
      services[index].servicesList &&
      services[index].servicesList
        .filter(
          (service) =>
            service.staffs &&
            service.staffs.some((st) => st.staffId === staffCurrent.staffId)
        )
        .filter((service) =>
          service.name.toLowerCase().includes(servicesSearch.toLowerCase())
        )
        .filter((service) => {
          const startTime =
            parseInt(appointment[index].appointmentTimeMillis) +
            (extraDuration ? appointment[index].duration * 1000 : 0);

          const durationForCurrentStaff = this.getDurationForCurrentStaff(
            service
          );
          const endTime = startTime + durationForCurrentStaff * 1000;

          return isAvailableTime(
            startTime,
            endTime,
            user,
            [],
            // (appointmentsFromProps|| []).map(item => {
            //   return {
            //     ...item,
            //     appointments: item?.appointments && item?.appointments?.filter(localAppointment => localAppointment.intersected)
            //   }
            // }),
            reservedTimeFromProps,
            staff,
            (i) => visitFreeMinutes.some((freeMinute) => freeMinute === i)
          );
        })
        .map((service) => {
          const startTime =
            parseInt(appointment[index].appointmentTimeMillis) +
            (extraDuration ? appointment[index].duration * 1000 : 0);

          const durationForCurrentStaff = this.getDurationForCurrentStaff(
            service
          );
          const endTime = startTime + durationForCurrentStaff * 1000;

          const isAvailable = isAvailableTime(
            startTime,
            endTime,
            user,
            appointmentsFromProps,
            reservedTimeFromProps,
            staff,
            (i) => visitFreeMinutes.some((freeMinute) => freeMinute === i)
          );
          return {
            ...service,
            grey: !isAvailable
          };
        })
        .filter((service) => {
          if (index > 0) {
            return (
              this.state.serviceCurrent[0].service.currency === service.currency
            );
          }
          return true;
        })
        .filter(
          (service) =>
            service.duration >= this.props.company.settings.booktimeStep &&
            service.duration % this.props.company.settings.booktimeStep === 0
        )
    );
  }

  handleTypeaheadInputChange(name, value) {
    this.setState({ [name]: value });
  }

  handleTypeaheadSearch(name, value) {
    this.setState({ isLoadingTypeahead: true });
    clientService
      .getClientV2(1, value.replace(/[+()\- ]/g, ""), false, 5)
      .then((data) => {
        const { typeAheadOptions } = this.state;
        const newOptions = data.content && data.content;
        this.setState({
          typeAheadOptions: {
            ...typeAheadOptions,
            [name]: { ...typeAheadOptions[name], options: newOptions },
          },
          isLoadingTypeahead: false,
        });
      });
  }

  handleTypeaheadSelect(key, value) {
    let updatedState = {};
    if (value.length) {
      updatedState = {
        clientFirstName: value[0].firstName,
        clientPhone: value[0].phone,
        clientLastName: value[0].lastName,
        carBrand: value[0].carBrand,
        carNumber: value[0].carNumber,
        clientEmail: value[0].email,
      };
      this.checkUser(value[0]);
    } else {
      this.removeCheckedUser(key);
      const checkingProps = {
        clientFirstName: null,
        clientPhone: null,
        clientLastName: null,
        carBrand: null,
        carNumber: null,
        clientEmail: null,
      };
      Object.entries(checkingProps).forEach(([objKey, objValue]) => {
        if (objKey !== key) {
          updatedState[objKey] = objValue;
        }
      });
    }
    this.setState({ selectedTypeahead: value, ...updatedState });
  }

  addNewService() {
    const { appointment, serviceCurrent, services } = this.state;
    const startTime =
      parseInt(appointment[appointment.length - 1].appointmentTimeMillis) +
      appointment[appointment.length - 1].duration * 1000;
    const newAppointment = {
      duration: "",
      description: "",
      customId: "",
    };
    let appointmentMessage = this.props.t(
      "???????????????????? ???????????????? ?????? ???????? ????????????"
    );
    if (serviceCurrent[appointment.length - 1].id === -1) {
      appointmentMessage = this.props.t(`???????????????????? ?????????????? ????????????`);
      this.setState({ appointmentMessage });
      return;
    }
    const newServicesList = this.getFilteredServicesList(
      appointment.length - 1,
      true
    )
      .filter((service) => {
        return (
          this.state.serviceCurrent[0].service.currency === service.currency
        );
      })
      .filter(
        (service) =>
          service.duration >= this.props.company.settings.booktimeStep
      );

    if (newServicesList.length) {
      newAppointment.appointmentTimeMillis = startTime;
      appointment.push(newAppointment);
      services.push({
        ...services[services.length - 1],
        // servicesList: newServicesList
      });

      this.setService(
        newServicesList[0].serviceId,
        newServicesList[0],
        serviceCurrent.length,
        appointment
      );
      appointmentMessage = "";
    }
    this.updateAvailableCoStaffs(appointment);
    this.setState({ appointment, appointmentMessage, services });
  }

  removeService(index) {
    const { appointmentsToDelete, propogatedAppointmentId, appointment, serviceCurrent, services } = this.state;
    // if (appointment[index].appointmentId) {
    //   appointmentsToDelete.push(appointment[index]);
    // }
    let updatedPropogatedAppointmentId = propogatedAppointmentId;

    if (index === 0 && appointment.length !== 1) {
      if (!propogatedAppointmentId) {
        updatedPropogatedAppointmentId = appointment[0].appointmentId;
      }
      appointment[1].hasCoAppointments = true;
      delete appointment[1].coAppointmentId;

      const times = appointment.map((item) => item.appointmentTimeMillis);

      appointment.forEach((item, localIndex) => {
        if (localIndex > 0) {
          item.appointmentTimeMillis = item.appointmentTimeMillis - appointment[0].duration * 1000;
        }

        if (localIndex > 1) {
          item.coAppointmentId = appointment[1].appointmentId;
        }
      });
    }

    if (appointment.length !== 1) {
      appointment.splice(index, 1);
      serviceCurrent.splice(index, 1);
      services.splice(index, 1);
    }


    const updatedAppointments = this.getAppointments(appointment);

    this.updateAvailableCoStaffs(updatedAppointments.newAppointments);

    this.setState({
      propogatedAppointmentId: updatedPropogatedAppointmentId,
      appointmentsToDelete,
      serviceCurrent,
      services,
      appointment: updatedAppointments.newAppointments,
    })
  }

  handleDurationChange(e, appointment, index) {
    const { value } = e.target;
    appointment[index].duration = parseInt(value);

    const updatedAppointments = this.getAppointments(appointment);
    this.updateAvailableCoStaffs(updatedAppointments.newAppointments);
    this.setState({
      appointment: updatedAppointments.newAppointments,
      appointmentMessage: updatedAppointments.appointmentMessage,
    });
  }

  getVisitFreeMinutes(appointment) {
    const visitFreeMinutes = [];

    const { booktimeStep } = this.props.company.settings;
    const step = booktimeStep / 60;

    if (appointment && appointment[0]) {
      const startTime = appointment[0].appointmentTimeMillis;
      const endTime =
        appointment[appointment.length - 1].appointmentTimeMillis +
        (appointment[appointment.length - 1].duration - 900) * 1000;

      for (let i = startTime; i <= endTime; i += step * 60 * 1000) {
        visitFreeMinutes.push(i);
      }
    }
    return visitFreeMinutes;
  }

  getTimeArrange(time, minutes, appointment) {
    let timeArrange = [];

    const { booktimeStep } = this.props.company.settings;
    const step = booktimeStep / 60;

    if (appointment && appointment[0]) {
      const startTime = +appointment[0].appointmentTimeMillis;
      const endTime =
        +appointment[appointment.length - 1].appointmentTimeMillis +
        +((appointment[appointment.length - 1].duration - 900) * 1000);


      for (let i = startTime; i <= endTime; i += step * 60 * 1000) {
        const minutesIndex = minutes.findIndex(
          (minute) => minute === moment(i).format("HH:mm")
        );
        if (minutesIndex) {
          minutes.splice(minutesIndex, 1);
        }
      }
    }

    if (time && minutes.length !== 0) {
      const minuteStart = time;
      let minute = time;

      while (minutes.indexOf(moment(minute, "x").format("H:mm")) === -1) {
        minute = parseInt(minute) + step * 60 * 100;
        const bool = minutes.indexOf(moment(minute, "x").format("H:mm"));
        if (bool !== -1) {
          timeArrange = [minuteStart, minute];
          break;
        }
      }
    }
    return moment
      .duration(timeArrange[1] - parseInt(timeArrange[0]), "milliseconds")
      .format("m")
      .replace(/\s/g, "");
  }

  getInfo(appointments) {
    const { appointmentEdited, clients, services } = this.state;

    const newServices = [];
    const newServicesCurrent = [];
    appointments.forEach((appointment) => {
      services[0].servicesList.forEach((service) => {
        if (service.serviceId === appointment.serviceId) {
          newServices.push(services[0]);
          newServicesCurrent.push({
            id: service.serviceId,
            service: {
              ...service,
              duration: appointment.duration,
            },
          });
        }
      });
    });

    this.updateAvailableCoStaffs(appointmentEdited);
    if (appointments[0].clientId) {
      this.props.dispatch(
        clientActions.getActiveClient(appointments[0].clientId)
      );
      this.props.dispatch(
        clientActions.getActiveClientAppointments(appointments[0].clientId, 1)
      );
    }
    this.setState({
      appointment: appointmentEdited,
      serviceCurrent: newServicesCurrent,
      services: newServices,
    });
  }

  setTime(appointmentTimeMillis, minutes, index) {
    const { appointment, serviceCurrent, timeNow } = this.state;
    const startTime = parseInt(
      moment(
        moment(timeNow, "x").format("DD/MM/YYYY") +
        " " +
        moment(appointmentTimeMillis).format("HH:mm"),
        "DD/MM/YYYY HH:mm"
      ).format("x")
    );
    const timing = this.getTimeArrange(
      parseInt(moment(appointmentTimeMillis).format("x")),
      minutes,
      appointment
    );

    appointment[index].appointmentTimeMillis = startTime;
    serviceCurrent[index] = {
      id: -1,
      service: [],
    };

    this.setState(
      {
        appointment,
        timeArrange: timing.replace(/\s/, ""),
        serviceCurrent,
      },
      () => {
        console.log(
          this.state.timeArrange,
          this.state.serviceCurrent,
          this.state.appointment
        );
      }
    );
  }

  disabledMinutes(h, str = "start") {
    const { minutes: minutesReservedtime, reservedTime } = this.state;
    const minutesArray = [];

    if (str === "start") {
      minutesReservedtime &&
      minutesReservedtime.map((minute) => {
        if (h == minute.split(":")[0]) {
          minutesArray.push(parseInt(minute.split(":")[1]));
        }
      });
    } else if (str === "end") {
      // const minHour = parseInt(moment(reservedTime.startTimeMillis, 'x').format('H'));
      // const minMinute = parseInt(moment(reservedTime.startTimeMillis, 'x').format('mm'));
      // if (minHour === h) {
      //     const localMinutesArray = ['00', '15', '30', '45'];
      //     let findedMinute
      //     localMinutesArray.forEach(minuteItem => {
      //         const currentTime = `${h < 10 ? '0' : ''}${h}:${minuteItem}`
      //         findedMinute = minutesReservedtime && minutesReservedtime.find(reservedTime => reservedTime === currentTime)
      //
      //         if (findedMinute) {
      //             minutesArray.push(parseInt(minuteItem))
      //         } else if(parseInt(minuteItem) <= minMinute) {
      //             minutesArray.push(parseInt(minuteItem))
      //         }
      //     })
      //
      //
      // } else {
      //     minutesReservedtime && minutesReservedtime.map((minute)=>{
      //         if (h == minute.split(':')[0]) {
      //             minutesArray.push((minute.split(':')[1]))
      //         }
      //     })
      // }

      const selectedHour = parseInt(
        moment(reservedTime.startTimeMillis, "x").format("H")
      );

      const selectedMinute = parseInt(
        moment(reservedTime.startTimeMillis, "x").format("mm")
      );
      const findTime =
        minutesReservedtime &&
        minutesReservedtime.find((time) => {
          const timeHour = parseInt(time.split(":")[0]);
          const timeMinute = parseInt(time.split(":")[1]);

          if (timeHour === selectedHour) {
            return timeMinute > selectedMinute;
          }

          return timeHour > selectedHour;
        });

      for (let i = 0; i <= 45; i += 15) {
        if (
          (h !== selectedHour &&
            h === parseInt(findTime.split(":")[0]) &&
            i > findTime.split(":")[1]) ||
          (h === selectedHour && selectedMinute >= i) ||
          (h === parseInt(findTime.split(":")[0]) && findTime.split(":")[1] < i)
        ) {
          minutesArray.push(i);
        }
      }
    }

    return minutesArray;
  }

  disabledHours(str = "start") {
    const { minutes: minutesReservedtime, reservedTime } = this.state;
    const hoursArray = [];
    let firstElement = null;
    let countElements = 0;
    if (str === "start") {
      minutesReservedtime &&
      minutesReservedtime.map((minute) => {
        if (countElements == 3 && minute.split(":")[0] == firstElement) {
          hoursArray.push(parseInt(minute.split(":")[0]));
          countElements = 0;
          firstElement = null;
        }
        if (minute.split(":")[0] == firstElement) {
          countElements++;
        } else {
          countElements = 1;
        }
        if (firstElement == null) {
          countElements++;
        }
        firstElement = minute.split(":")[0];
      });
    }

    for (let i = 0; i <= 23; i++) {
      if (
        str === "end" &&
        reservedTime.startTimeMillis !== "" &&
        i < moment(reservedTime.startTimeMillis, "x").format("H")
      ) {
        const isIncluded = hoursArray.find((hour) => i === hour);
        if (!isIncluded) {
          hoursArray.push(i);
        }
      }
    }

    if (str === "end") {
      const selectedHour = parseInt(
        moment(reservedTime.startTimeMillis, "x").format("H")
      );

      const selectedMinute = parseInt(
        moment(reservedTime.startTimeMillis, "x").format("mm")
      );

      const findTime =
        minutesReservedtime &&
        minutesReservedtime.find((time) => {
          const timeHour = parseInt(time.split(":")[0]);
          const timeMinute = parseInt(time.split(":")[1]);

          if (timeHour === selectedHour) {
            return timeMinute > selectedMinute;
          }

          return timeHour > selectedHour;
        });

      const minutesArray = [];

      for (let i = 0; i <= 23; i++) {
        if (i > findTime.split(":")[0]) {
          hoursArray.push(i);
        }
        for (let j = 0; j <= 45; j += 15) {
          if (i === selectedHour && selectedMinute >= j) {
            minutesArray.push(j);
          }
        }
      }

      if (minutesArray.length === 4) {
        hoursArray.push(selectedHour);
      }
    }

    return hoursArray;
  }

  getDurationForCurrentStaff(service) {
    const { staffCurrent } = this.state;
    let durationForCurrentStaff = service.duration;
    staffCurrent &&
    staffCurrent.staffId &&
    service.staffs &&
    service.staffs.forEach((item) => {
      if (item.staffId === staffCurrent.staffId && item.serviceDuration) {
        durationForCurrentStaff = item.serviceDuration;
      }
    });
    return durationForCurrentStaff;
  }

  getServiceList(index) {
    const { services, staffCurrent, initAvailableCoStaffCheck } = this.state;

    const filteredServiceList = this.getFilteredServicesList(index, false);
    // .filter((service, key)=>
    // staffCurrent && staffCurrent.staffId && service.staffs &&
    // service.staffs.some(st=>st.staffId===staffCurrent.staffId && parseInt(service.duration) / 60 <= parseInt(timeArrange)));
    const filteredServiceListWithoutTime =
      services[index].servicesList &&
      services[index].servicesList.filter(
        (service, key) =>
          staffCurrent &&
          staffCurrent.staffId &&
          service.staffs &&
          service.staffs.some((st) => st.staffId === staffCurrent.staffId)
      );

    if (initAvailableCoStaffCheck) {
      this.updateAvailableCoStaffs();
    }

    if (filteredServiceList.length) {
      const servicesWithGroups =
        this.props.services.services &&
        this.props.services.services.map((item) => {
          return {
            ...item,
            services: [],
          };
        });

      if (this.props.services.services) {
        filteredServiceList.forEach((filteredService) => {
          const activeGroup = this.props.services.services.find(
            (item) =>
              item.services &&
              item.services.some(
                (service) => service.serviceId === filteredService.serviceId
              )
          );
          const groupIndex = servicesWithGroups.findIndex(
            (item) => item.serviceGroupId === activeGroup.serviceGroupId
          );
          if (groupIndex > -1) {
            servicesWithGroups[groupIndex].services.push(filteredService);
          }
        });
      }

      return (
        servicesWithGroups &&
        servicesWithGroups.map((item) => {
          return item.services
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .sort((a, b) => a.grey - b.grey)
            .map((service, key) => {
              const durationForCurrentStaff = this.getDurationForCurrentStaff(
                service
              );

              return (
                <React.Fragment>
                  {key === 0 && (
                    <span className="services-title">{item.name}</span>
                  )}
                  <li className="dropdown-item" key={key}>
                    <a
                      onClick={() =>
                        this.setService(service.serviceId, service, index)
                      }
                    >
                      <span
                        className={
                          service.color &&
                          service.color.toLowerCase() + " " + "color-circle"
                        }
                      />
                      <span
                        className={service.color && service.color.toLowerCase()}
                      >
                        <span className="items-color" style={service.grey ? { opacity: '0.4'} : {}}>
                          <span className="name-service">
                            {service.name} <br />
                            <span>{service.details}</span>
                          </span>
                          <span className="right-block">
                            <span className="price">
                              |&nbsp;{service.priceFrom}
                              {service.priceFrom !== service.priceTo &&
                              " - " + service.priceTo}{" "}
                              {service.currency}
                            </span>
                            &nbsp;|&nbsp;
                            <span className="timing">
                              {moment
                                .duration(
                                  parseInt(durationForCurrentStaff),
                                  "seconds"
                                )
                                .format(
                                  `h[ ${this.props.t("??")}] m[ ${this.props.t(
                                    "??????????"
                                  )}]`
                                )}
                              &nbsp;|
                            </span>
                          </span>
                        </span>
                      </span>
                    </a>
                  </li>
                </React.Fragment>
              );
            });
        })
      );
    }
    if (filteredServiceListWithoutTime.length) {
      return (
        <p className="staffAlert-noService">
          {this.props.t("?????? ?????????????????? ?????????? ?? ?????????????????? ???????????????? ??????????????")}
        </p>
      );
    }

    return (
      <p className="staffAlert-noService">
        {this.props.t(
          "?????? ?????????????????? ??????????. ???????????????? ???????????????????? ?? ???????????????????? ??????????"
        )}
      </p>
    );
  }

  getCoStaffMarkup(wrapperClassName) {
    const { staff: staffFromProps } = this.props;
    const {
      isAddCostaff,
      staffCurrent,
      coStaffs,
      availableCoStaffs,
    } = this.state;

    return (
      <div
        style={{
          width: "100%",
          float: "none",
        }}
        className={`block-style2 container ${wrapperClassName}`}
      >
        <div className="row">
          <div
            style={{ paddingTop: "4px", display: "flex", padding: 0 }}
            className="col-sm-12 mt-2"
          >
            <span className="add-helpers-text">
              {this.props.t("???????????????? ????????????????????")}
            </span>
            <Hint
              hintMessage={this.props.t(
                "?????? ???????????????? ???????????? ?????????????????????? ???????????????????????? ????????????????????????"
              )}
            />

            <span
              style={{ width: "auto", margin: "0" }}
              className="justify-content-end check-box"
            >
              <label>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={isAddCostaff}
                  onChange={() =>
                    this.setState({ isAddCostaff: !this.state.isAddCostaff })
                  }
                />
                <span
                  style={{ margin: "0 0 0 4px" }}
                  data-label-off={this.props.t("????????")}
                  data-label-on={this.props.t("??????")}
                  className="check"
                />
              </label>
            </span>
          </div>
        </div>

        {isAddCostaff && (
          <ul
            style={{
              maxHeight: "175px",
              overflow: "hidden auto",
            }}
            className="clients-list-container"
          >
            {staffFromProps &&
            staffFromProps
              .filter((item) => item.staffId !== staffCurrent.staffId)
              .filter((item) =>
                availableCoStaffs.some(
                  (availableCoStaff) =>
                    item.staffId === availableCoStaff.staffId
                )
              )
              .map((item, keyStaffs) => (
                <li className="row mt-3" key={keyStaffs}>
                  <div className="col-9">
                      <span
                        style={{ position: "static" }}
                        className="img-container"
                      >
                        <img
                          className="rounded-circle"
                          src={
                            item.imageBase64
                              ? "data:image/png;base64," + item.imageBase64
                              : `${process.env.CONTEXT}public/img/avatar.svg`
                          }
                          alt=""
                        />
                      </span>
                    <span style={{ marginLeft: "6px" }}>
                        {item.firstName} {item.lastName ? item.lastName : ""}
                      </span>
                  </div>

                  <div
                    style={{ marginTop: "15px" }}
                    className="col-3 add-helpers-container justify-content-end check-box"
                  >
                    <label>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={
                          coStaffs &&
                          coStaffs.some(
                            (staff) => staff.staffId === item.staffId
                          )
                        }
                        onChange={(e) => this.toggleChangeStaff(e, item)}
                      />
                      <span className="check-box-circle" />
                    </label>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    );
  }

  toggleChangeStaff(e, staff) {
    const { checked } = e.target;
    const { coStaffs } = this.state;

    if (checked) {
      coStaffs.push(staff);
    } else {
      const staffIndex = coStaffs.findIndex(
        (item) => item.staffId === staff.staffId
      );

      if (staffIndex !== -1) {
        coStaffs.splice(staffIndex, 1);
      }
    }

    this.setState({ coStaffs });
  }

  toggleVisits() {
    this.setState({ visits: !this.state.visits });
  }

  goToPageCalendar(appointment, appointmentStaffId) {
    $(".client-detail").modal("hide");
    const { appointmentId, appointmentTimeMillis } = appointment;

    const url =
      "/page/" +
      appointmentStaffId +
      "/" +
      moment(appointmentTimeMillis, "x")
        .locale("ru")
        .format("DD-MM-YYYY");
    this.props.history.push(url);

    this.props.dispatch(
      calendarActions.setScrollableAppointment(appointmentId)
    );
  }

  renderMenuItemChildren(option, props) {
    const { company } = this.props;
    const companyTypeId = company.settings && company.settings.companyTypeId;
    const { labelKey } = props;
    const visibleKeys = [
      "firstName",
      "lastName",
      "phone",
      "email",
      "carBrand",
      "carNumber",
    ];

    return (
      <div key={option.clientId}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={labelKey === visibleKeys[0] ? {} : { color: "grey" }}>
            {option[visibleKeys[0]]}
          </span>
          <span style={labelKey === visibleKeys[1] ? {} : { color: "grey" }}>
            {option[visibleKeys[1]]}
          </span>
        </div>
        {access(12) && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={labelKey === visibleKeys[2] ? {} : { color: "grey" }}>
              {option[visibleKeys[2]]}
            </span>
            <span style={labelKey === visibleKeys[3] ? {} : { color: "grey" }}>
              {option[visibleKeys[3]]}
            </span>
          </div>
        )}
        {companyTypeId === 2 && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={labelKey === visibleKeys[4] ? {} : { color: "grey" }}>
              {option[visibleKeys[4]]}
            </span>
            <span style={labelKey === visibleKeys[5] ? {} : { color: "grey" }}>
              {option[visibleKeys[5]]}
            </span>
          </div>
        )}
      </div>
    );
  }

  render() {
    const {
      appointmentsFromProps,
      status,
      company,
      adding,
      staff: staffFromProps,
      services: servicesFromProps,
      selectedDay,
      t,
    } = this.props;
    const {
      allPrice,
      appointment,
      appointmentMessage,
      staffCurrent,
      serviceCurrent,
      staffs,
      services,
      timeNow,
      minutes,
      clients,
      clientChecked,
      clientSubmitModal,
      clientSubmit,
      timeArrange,
      edit_appointment,
      visits,
      servicesSearch,
      coStaffs,
      selectedTypeahead,
      isAddCostaff,
      availableCoStaffs,
      typeAheadOptions,
      isLoadingTypeahead,
      isNotAvailable,
    } = this.state;

    const companyTypeId = company.settings && company.settings.companyTypeId;

    const activeStaffTimetable = staffs?.timetable?.find(
      (item) => item.staffId === staffCurrent.staffId
    );

    const pressSave = () => {
      const isAvailable = isAvailableTime(
        appointment[0].appointmentTimeMillis,
        appointment[appointment.length - 1].appointmentTimeMillis +
        appointment[appointment.length - 1].duration * 1000,
        activeStaffTimetable,
        appointmentsFromProps,
        [],
        staffFromProps
      )
      if (!edit_appointment && !isAvailable && !clientSubmitModal) {
        if (!isAvailable && !company?.settings?.existingAppointmentIgnored) {
          this.setState({ isNotAvailable: true });
        } else {
          this.setState({ clientSubmitModal: true });
        }
      } else {
        this.handleSave()
      }
    }
    const activeStaffCurrent =
      staffFromProps &&
      staffFromProps.find(
        (staffItem) => staffItem.staffId === staffCurrent.staffId
      );
    const cl = clientChecked;

    const appointmentsAllPrice =
        (appointment.reduce((prev, current) => {
          return +prev + +current.price;
        }, 0) || 0).toFixed(2);

    const servicesDisabling =
      services[0].servicesList &&
      services[0].servicesList.some((service) => {
        const durationForCurrentStaff = this.getDurationForCurrentStaff(
          service
        );
        return parseInt(durationForCurrentStaff) / 60 <= parseInt(timeArrange);
      });

    const hasAddedServices =
      staffCurrent &&
      services[0] &&
      services[0].servicesList &&
      services[0].servicesList.some(
        (serviceListItem) =>
          serviceListItem.staffs &&
          serviceListItem.staffs.some(
            (item) => item.staffId === staffCurrent.staffId
          )
      );

    return (
      <Modal
        size="lg"
        onClose={this.closeModal}
        showCloseButton={false}
        className="mod calendar_modal"
      >
        <div className="new_appointment">
          <div>
            <div className="modal-content">
              <div className="modal-header">
                {edit_appointment ? (
                  <h4 className="modal-title">{t("?????????????????????????? ????????????")}</h4>
                ) : (
                  <h4 className="modal-title">
                    {t("?????????? ????????????")},{" "}
                    {moment(timeNow, "x")
                      .locale(t("locale"))
                      .format("dddd DD MMMM, YYYY")}
                  </h4>
                )}
                <button
                  type="button"
                  className="close"
                  onClick={this.closeModal}
                />
                {/* <img src={`${process.env.CONTEXT}public/img/icons/cancel.svg`} alt="" className="close" onClick={this.closeModal}*/}
                {/*     style={{margin:"13px 5px 0 0"}}/>*/}
              </div>
              <div className="form-group form-group-addService">
                <div className="row">
                  <div className="calendar col-xl-8 pr-0">
                    <div className="appointments-container">
                      {appointment.map((appointmentItem, index) => {
                        return (
                          <div className="addApointmentEachBlock">
                            {index !== 0 && (
                              <hr className="appointments-line" />
                            )}
                            <p
                              style={{ paddingBottom: "18px" }}
                              className="title"
                            >
                              {t("????????????")} <span>{index + 1}</span>
                            </p>
                            <div className="row">
                              {minutes.length !== 0 && (
                                <div className="appointment-start">
                                  <p>{t("????????????")}</p>
                                  <TimePicker
                                    value={
                                      appointmentItem.appointmentTimeMillis &&
                                      moment(
                                        appointmentItem.appointmentTimeMillis,
                                        "x"
                                      )
                                    }
                                    clearIcon={<div />}
                                    className={
                                      staffCurrent.id && staffCurrent.id === -1
                                        ? "disabledField col-md-12 p-0"
                                        : "col-md-12 p-0"
                                    }
                                    showSecond={false}
                                    minuteStep={15}
                                    disabled={
                                      (staffCurrent.id &&
                                        staffCurrent.id === -1) ||
                                      edit_appointment
                                    }
                                    disabledHours={this.disabledHours}
                                    disabledMinutes={this.disabledMinutes}
                                    onChange={(appointmentTimeMillis) =>
                                      this.setTime(
                                        appointmentTimeMillis,
                                        minutes,
                                        index
                                      )
                                    }
                                  />
                                </div>
                              )}

                              <div className="appointment-service">
                                <p
                                  className={
                                    !servicesDisabling && "disabledField"
                                  }
                                >
                                  {t("????????????")}
                                </p>
                                <div className="select-color dropdown border-color">
                                  {serviceCurrent[index] &&
                                  serviceCurrent[index].id !== -1 ? (
                                    <a
                                      onClick={() =>
                                        this.setState({ servicesSearch: "" })
                                      }
                                      className={
                                        serviceCurrent[index].service.color &&
                                        serviceCurrent[
                                          index
                                          ].service.color.toLowerCase() +
                                        " " +
                                        "select-button dropdown-toggle"
                                      }
                                      data-toggle={"dropdown"}
                                    >
                                      <span
                                        className={
                                          serviceCurrent[index].service.color &&
                                          serviceCurrent[
                                            index
                                            ].service.color.toLowerCase() +
                                          " " +
                                          "color-circle"
                                        }
                                      />
                                      <span className="yellow">
                                        <span className="items-color">
                                          <span>
                                            {serviceCurrent[index].service.name}
                                          </span>
                                          <span className="right-block">
                                            |&nbsp;
                                            <span className="price">
                                              {
                                                serviceCurrent[index].service
                                                  .priceFrom
                                              }{" "}
                                              {serviceCurrent[index].service
                                                .priceFrom !==
                                              serviceCurrent[index].service
                                                .priceTo &&
                                              " - " +
                                              serviceCurrent[index].service
                                                .priceTo}{" "}
                                              {
                                                serviceCurrent[index].service
                                                  .currency
                                              }
                                            </span>
                                            &nbsp;|&nbsp;
                                            <span className="timing">
                                              {moment
                                                .duration(
                                                  parseInt(
                                                    appointment[index].duration
                                                  ),
                                                  "seconds"
                                                )
                                                .format(
                                                  `h[ ${t("??")}] m[ ${t(
                                                    "??????????"
                                                  )}]`
                                                )}
                                              &nbsp;|
                                            </span>
                                          </span>
                                        </span>
                                      </span>
                                    </a>
                                  ) : (
                                    <a
                                      onClick={() =>
                                        this.setState({ servicesSearch: "" })
                                      }
                                      className={
                                        !servicesDisabling || !hasAddedServices
                                          ? "disabledField select-button dropdown-toggle yellow"
                                          : "select-button dropdown-toggle yellow"
                                      }
                                      data-toggle={
                                        servicesDisabling &&
                                        hasAddedServices &&
                                        "dropdown"
                                      }
                                    >
                                      <span className="" />
                                      <span className="">
                                        <span className="items-color">
                                          <span>
                                            {hasAddedServices
                                              ? t("???????????????? ????????????")
                                              : t("???????????? ???? ??????????????????")}
                                          </span>{" "}
                                          <span></span> <span></span>
                                        </span>
                                      </span>
                                    </a>
                                  )}
                                  <ul className="dropdown-menu">
                                    <li className="dropdown-item-title">
                                      <div
                                        className="align-items-center content clients"
                                        style={{
                                          padding: "0 8px",
                                          height: "52px",
                                          boxShadow: "none",
                                        }}
                                      >
                                        <div className="search">
                                          <input
                                            type="search"
                                            placeholder={t(
                                              "?????????????? ???????????????? ????????????"
                                            )}
                                            style={{
                                              width: "185%",
                                              border: "none",
                                            }}
                                            aria-label="Search"
                                            value={servicesSearch}
                                            onChange={this.handleServicesSearch}
                                          />
                                          <button
                                            className="search-icon"
                                            type="submit"
                                          />
                                        </div>
                                      </div>
                                    </li>
                                    <li className="services_list_wrapper">
                                      <ul>{this.getServiceList(index)}</ul>
                                    </li>
                                  </ul>
                                  <div className="arrow-dropdown">
                                    <i></i>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <button
                              className="close removeService-button"
                              onClick={() => this.removeService(index)}
                            ></button>
                            <div className="row">
                              <div className="appointment-timing">
                                <p
                                  className={
                                    !servicesDisabling && "disabledField"
                                  }
                                >
                                  {t("????????????????????????")}
                                </p>
                                <select
                                  disabled={serviceCurrent[index].id === -1}
                                  className="custom-select"
                                  onChange={(e) =>
                                    this.handleDurationChange(
                                      e,
                                      appointment,
                                      index
                                    )
                                  }
                                  name="duration"
                                  value={appointment[index].duration}
                                >
                                  {this.getOptionList(index)}
                                </select>
                              </div>

                              {index !== 0 && (
                                <div className="second-service-container">
                                  {String(
                                    serviceCurrent[index].service.priceTo
                                  ) &&
                                  index !== 0 && (
                                    <div className="appointment-price">
                                      <p>{t("???????????? ????????")}</p>
                                      <input
                                        type="text"
                                        name="price"
                                        value={appointment[index].price}
                                        onChange={(e) =>
                                          this.handleChange(e, index)
                                        }
                                      />
                                    </div>
                                  )}

                                  {index !== 0 && (
                                    <div className="appointment-discont">
                                      <p>{t("?????????????? ????????????")}</p>
                                      <input
                                        type="text"
                                        placeholder="0%"
                                        name="discountPercent"
                                        value={
                                          appointment[index].discountPercent
                                        }
                                        onChange={(e) =>
                                          this.handleChange(e, index)
                                        }
                                      />
                                    </div>
                                  )}
                                </div>
                              )}

                              {index === 0 && (
                                <div className="appointment-staff add_appointment_staff">
                                  <p>{t("??????????????????????")}</p>
                                  <div className="dropdown add-staff">
                                    <a
                                      className={
                                        edit_appointment || timeArrange === 0
                                          ? "disabledField dropdown-toggle drop_menu_personal"
                                          : "dropdown-toggle drop_menu_personal"
                                      }
                                      data-toggle={
                                        !edit_appointment &&
                                        timeArrange !== 0 &&
                                        "dropdown"
                                      }
                                      aria-haspopup="true"
                                      aria-expanded="false"
                                    >
                                      {activeStaffCurrent.staffId && (
                                        <div className="img-container">
                                          <img
                                            className="rounded-circle"
                                            src={
                                              activeStaffCurrent.imageBase64
                                                ? "data:image/png;base64," +
                                                activeStaffCurrent.imageBase64
                                                : `${process.env.CONTEXT}public/img/avatar.svg`
                                            }
                                            alt=""
                                          />
                                          <span className="staff-name">
                                            {activeStaffCurrent.firstName +
                                            " " +
                                            (activeStaffCurrent.lastName
                                              ? activeStaffCurrent.lastName
                                              : "")}
                                          </span>
                                        </div>
                                      )}
                                    </a>
                                    {!edit_appointment && timeArrange !== 0 && (
                                      <ul className="dropdown-menu" role="menu">
                                        {staffs.timetable &&
                                        staffs.timetable
                                          .filter((timing) => {
                                            return timing.timetables.some(
                                              (time) => {
                                                const checkingTiming = moment(
                                                  time.startTimeMillis
                                                ).format("DD MM YYYY");
                                                const currentTiming = moment(
                                                  selectedDay
                                                ).format("DD MM YYYY");
                                                return (
                                                  checkingTiming ===
                                                  currentTiming
                                                );
                                              }
                                            );
                                          })
                                          .map((staff, key) => {
                                            const activeStaff =
                                              staffFromProps &&
                                              staffFromProps.find(
                                                (staffItem) =>
                                                  staffItem.staffId ===
                                                  staff.staffId
                                              );

                                            return (
                                              <li
                                                onClick={() =>
                                                  this.setStaff(
                                                    staff,
                                                    staff.firstName,
                                                    staff.lastName,
                                                    activeStaff.imageBase64
                                                  )
                                                }
                                                key={key}
                                              >
                                                <a>
                                                  <div className="img-container">
                                                    <img
                                                      className="rounded-circle"
                                                      src={
                                                        activeStaff.imageBase64
                                                          ? "data:image/png;base64," +
                                                          activeStaff.imageBase64
                                                          : `${process.env.CONTEXT}public/img/avatar.svg`
                                                      }
                                                      alt=""
                                                    />
                                                    <span
                                                      style={{
                                                        lineHeight: activeStaff.description
                                                          ? "8px"
                                                          : "20px",
                                                      }}
                                                      className=""
                                                    >
                                                        <p>
                                                          {staff.firstName +
                                                          " " +
                                                          (staff.lastName
                                                            ? staff.lastName
                                                            : "")}
                                                        </p>
                                                      {activeStaff.description ? (
                                                        <p
                                                          style={{
                                                            fontSize: "10px",
                                                          }}
                                                          className=""
                                                        >
                                                          {
                                                            activeStaff.description
                                                          }
                                                        </p>
                                                      ) : (
                                                        ""
                                                      )}
                                                      </span>
                                                  </div>
                                                </a>
                                              </li>
                                            );
                                          })}
                                      </ul>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="addAppointmentRow row">
                              {index === 0 && (
                                <div className="appointment-discont">
                                  <p>{t("?????????????? ????????????")}</p>
                                  <input
                                    type="text"
                                    placeholder="0%"
                                    name="discountPercent"
                                    value={appointment[index].discountPercent}
                                    onChange={(e) =>
                                      this.handleChange(e, index)
                                    }
                                  />
                                </div>
                              )}

                              {String(serviceCurrent[index].service.priceTo) &&
                              index === 0 && (
                                <div className="appointment-price">
                                  <p>{t("???????????? ????????")}</p>
                                  <input
                                    type="text"
                                    name="price"
                                    value={appointment[index].price}
                                    onChange={(e) => {
                                      this.handleChange(e, index);
                                    }}
                                  />
                                </div>
                              )}

                              {index === 0 && (
                                <React.Fragment>
                                  <div className="appointment-note">
                                    <p>{t("??????????????")}</p>
                                    <div className="company_fields">
                                      <div
                                        style={{ height: "35px" }}
                                        className="name_company_wrapper form-control"
                                      >
                                        <textarea
                                          className="company_input"
                                          placeholder={t(
                                            "???????????????? ?????? ??????????????"
                                          )}
                                          name="description"
                                          maxLength={120}
                                          value={appointment[index].description}
                                          onChange={(e) =>
                                            this.handleChange(e, index)
                                          }
                                        />
                                        <span
                                          style={{ right: "16px" }}
                                          className="company_counter"
                                        >
                                          {appointment[index].description
                                            ? appointment[index].description
                                              .length
                                            : 0}
                                          /120
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </React.Fragment>
                              )}
                            </div>
                            {status === 200 && (
                              <p className="alert-success p-1 rounded pl-3 mb-2">
                                {t("???????????? ??????????????????")}
                              </p>
                            )}
                          </div>
                        );
                      })}
                      <div
                        className="addServiceButton"
                        onClick={() => this.addNewService()}
                      >
                        <p className="text-center button-absolute">
                          {t("???????????????? ????????????")} +
                        </p>
                      </div>
                      <hr />
                      {this.getCoStaffMarkup("desktop-visible")}
                      {this.getCoStaffMarkup("mobile-visible")}
                    </div>

                    {appointmentMessage && (
                      <div
                        style={{
                          margin: "-20px 0 32px 0",
                          padding: "4px 12px",
                        }}
                        className="desktop-visible alert alert-danger"
                      >
                        {appointmentMessage}
                      </div>
                    )}
                    {adding && (
                      <img
                        style={{ width: "57px" }}
                        src="data:image/gif;base64,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06pdy7at27dw/+PKnUu3rt27ePPq3cu3r9+/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPoEOLHk26tOnTqFOrXs26tevXsGPLnk27tu3buHPr3s27t+/fwIMLH068uPHjyJMrX868ufPn0KNLn069uvXr2LNr3869u/fv4MOLH0++vPnz6NOrX8++vfv38OPLn0+/vv37+PPr38+/v///AAYo4IAEFmjggQgmqOCCDDbo4IMQRijhhBRWaOGFGGao4YYcdujhhyCGKOKIJJZo4okopqjiiiy26OKLMMYo44w01mjjjTjmqOOOPPbo449ABinkkEQWaeSRSCap5P+STDbp5JNQRinllFRWaeWVWGap5ZZcdunll2CGKeaYZJZp5plopqnmmmy26eabcMYp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6quwxirrrLTWauutuOaq66689urrr8AGK+ywxBZr7LHIJqvsssw26+yz0EYr7bTUVmvttdhmq+223Hbr7bfghivuuOSWa+656Kar7rrstuvuu/DGK++89NZr77345qvvvvz26++/AAcs8MCN2QDDACqwQEINJgABABAm1EACCyoMAIP/Dfd8AEEABYwggAERbGDEBhEYIMAIBQQAwQcZb9zxxyGPXPLJKa9sj8YcewyyyCSbjLLKLN/sss4x90wz0GLNQEMQKegAwNNQRy310zqkEAQNM7zDgQYUVICBEWCHLfbYYGNQAQUacKA1116T7bbYZqOtdjtbd/3122/HnfbaduOd99l7b1XAEC1MbfjhUbcwRAHrMJDAAX5HLvYBCTDQ+OOSZ0655ek4DnnmkW9++eeg4y26VTcIgQLirLcOAApC3FDOBCFkUPrtGYQwwey131567ruPQ7vtvmcOPO/EFx/58VG9IMMKrkfP+goyvBAOCB0soPztC3QAwvXZb196//fff4O99uJnTj746Kcf+fpOEXCC9PSzfgIB33hAgPu3E+BB/vvjH+j85w39CXCA/ytgAA8YOQIuJQc+qJ8EWeeDHGxDBA5g4O0cIIILZlCDoOOgNjAIwhB2cIQfLGHkRIiUAcRggjA8XAwGkI0ASECFoJNAAGp4QxxK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3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAwocSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkypdyrSp06dQo0qdSrWq1atYs2rdyrWr169gw4odS7as2bNo06pdy7at27dw/+PKnUu3rt27ePPq3cu3r9+/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPoEOLHk26tOnTqFOrXs26tevXsGPLnk27tu3buHPr3s27t+/fwIMLH068uPHjyJMrX868ufPn0KNLn069uvXr2LNr3869u/fv4MOLH0++vPnz6NOrX8++vfv38OPLn0+/vv37+PPr38+/v///AAYo4IAEFmjggQgmqOCCDDbo4IMQRijhhBRWaOGFGGao4YYcdujhhyCGKOKIJJZo4okopqjiiiy26OKLMMYo44w01mjjjTjmqOOOPPbo449ABinkkEQWaeSRSCap5P+STDbp5JNQRinllFRWaeWVWGap5ZZcdunll2CGKeaYZJZp5plopqnmmmy26eabcMYp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6quwxirrrLTWauutuOaq66689urrr8AGK+ywxBZr7LHIJqvsssw26+yz0EYr7bTUVmvttdhmq+223Hbr7bfghivuuOSWa+656Kar7rrstuvuu/DGK++89NZr77345qvvvvz26++/AAcs8MAXfgBBAAWMIIABEWxgxAYRGCDACAUEAMH/B/cYjLDCDDsMscQUW4zxOjbAMIAKLJBQgwlAAACECTWQwIIKA8BgA6AcaEBBBRgY4fPPQAftMwYVUKABB+/kvHPPQjf9M9FGIz3ODDQEkYIOAGSt9dZcZ61DCkHQMIOeDCRwgNNoO31AAgysU/bZacf989ptf1PAEC10rffeW7cwRAF1ThBCBnIXLnQGIUxQjuCEG+64EYgrns0NQqDA9+WYA4CCEDfACUIHCzwuus8LdABCOJ+HPvrjpZ9ezQsyrJD57JevIMMLbXpAwOq8E+DBN7rzvrrv1BBwAu3IX34C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WI3WeI3YmI3auI3c2I3e+I3gGI7iOHmO5FiO5niO6JiO6riO7NiO7viO8BiP8jiP9FiP9niP+JiP+riP/NiP/viPABmQAjmQBFmQBnmQCJmQCrmQDNmQDvmQEBmREjmRFFmRFnmRGJmRGrmRHNmRHvmRIBmSIjmSJFmSJnmSKJmSKrmSLNmSLvmSMBmT8BAIACH5BAUUAEcALAAAAAAgA1gCAAf/gEeCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAwocSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkypdyrSp06dQo0qdSrWq1atYs2rdyrWr169gw4odS7as2bNo06pdy7at27dw/+PKnUu3rt27ePPq3cu3r9+/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPoEOLHk26tOnTqFOrXs26tevXsGPLnk27tu3buHPr3s27t+/fwIMLH068uPHjyJMrX868ufPn0KNLn069uvXr2LNr3869u/fv4MOLH0++vPnz6NOrX8++vfv38OPLn0+/vv37+PPr38+/v///AAYo4IAEFmjggQgmqOCCDDbo4IMQRijhhBRWaOGFGGao4YYcdujhhyCGKOKIJJZo4okopqjiiiy26OKLMMYo44w01mjjjTjmqOOOPPbo449ABinkkEQWaeSRSCap5P+STDbp5JNQRinllFRWaeWVWGap5ZZcdunll2CGKeaYZJZp5plopqnmmmy26eabcMYp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6quwxirrrLTWauutuOaq66689urrr8AGK+ywxBZr7LHIJqvsssw26+yz0EYr7bTUVmvttdhmq+223Hbr7bfghivuuOSWa+656Kar7rrstuvuu/DGK++89NZr77345qvvvvz2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"
                      />
                    )}
                  </div>
                  <div className="block-style2 col-md-12 col-lg-12 col-xl-4">
                    <div className="calendar">
                      {!edit_appointment && (
                        <div className="addApointmentClientBlock">
                          <div className="row">
                            <div className="col-sm-12">
                              <p className="add-helpers-text mobile-visible">
                                {companyTypeId === 4
                                  ? t("???????????????????? ????????????????")
                                  : t("???????????????????? ??????????????")}{" "}
                                <Hint
                                  hintMessage={t(
                                    "?????????????? ??????????. ???????? ?????????????? ?????? ?? ????????, ?????????????????? ?????????????????????? ????????"
                                  )}
                                />
                              </p>
                              <p className="add-helpers-text mb-3 desktop-visible">
                                {companyTypeId === 4
                                  ? t("???????????????????? ????????????????")
                                  : t("???????????????????? ??????????????")}{" "}
                                <Hint
                                  hintMessage={t(
                                    "?????????????? ??????????. ???????? ?????????????? ?????? ?? ????????, ?????????????????? ?????????????????????? ????????"
                                  )}
                                />
                              </p>
                            </div>
                          </div>
                          {/* <div className="search dropdown row">*/}
                          {/*    <form className="col-sm-12 form-inline" data-toggle="dropdown">*/}
                          {/*        <input type="search" placeholder="?????????? ???? ??????????, ???????????? ??????., ????????????" aria-label="Search"  ref={input => this.search = input} onChange={this.handleSearch}/>*/}
                          {/*        <button className="search-icon" type="button"></button>*/}

                          {/*    </form>*/}
                          {/* </div>*/}
                          <div className="row">
                            <div className="col-12 py-4 py-mb-0">
                              {Object.entries({
                                clientFirstName:
                                typeAheadOptions.clientFirstName,
                                clientPhone: typeAheadOptions.clientPhone,
                              }).map(([key, value], i) => (
                                <div
                                  key={key}
                                  className={
                                    "typeahead-wrapper" +
                                    (value.isValid(this.state[key])
                                      ? ""
                                      : " redBorderWrapper")
                                  }
                                >
                                  <p
                                    style={
                                      key === "clientPhone"
                                        ? { marginTop: "14px" }
                                        : {}
                                    }
                                  >
                                    {value.label}
                                  </p>
                                  <AsyncTypeahead
                                    isLoading={isLoadingTypeahead}
                                    onClick={() =>
                                      this.handleTypeaheadSearch(
                                        key,
                                        this.state[key]
                                      )
                                    }
                                    value={this.state[key]}
                                    defaultInputValue={value.defaultValue}
                                    id={key}
                                    onInputChange={(inputValue) =>
                                      this.handleTypeaheadInputChange(
                                        key,
                                        inputValue
                                      )
                                    }
                                    onChange={(selectValue) =>
                                      this.handleTypeaheadSelect(
                                        key,
                                        selectValue
                                      )
                                    }
                                    options={value.options}
                                    labelKey={value.selectedKey}
                                    minLength={3}
                                    placeholder={`${t(
                                      "??????????????"
                                    )} ${value.label.toLowerCase()}`}
                                    onSearch={(value) =>
                                      this.handleTypeaheadSearch(key, value)
                                    }
                                    selected={selectedTypeahead}
                                    renderMenuItemChildren={
                                      this.renderMenuItemChildren
                                    }
                                  />
                                </div>
                              ))}

                              {Object.entries({
                                clientLastName: typeAheadOptions.clientLastName,
                                carBrand: typeAheadOptions.carBrand,
                                carNumber: typeAheadOptions.carNumber,
                                clientEmail: typeAheadOptions.clientEmail,
                              })
                                .filter(([key]) => {
                                  if (
                                    companyTypeId !== 2 &&
                                    (key === "carBrand" || key === "carNumber")
                                  ) {
                                    return false;
                                  }
                                  return true;
                                })
                                .map(([key, value]) => (
                                  <div
                                    key={key}
                                    className={
                                      "typeahead-wrapper" +
                                      (value.isValid(this.state[key])
                                        ? ""
                                        : " redBorderWrapper")
                                    }
                                  >
                                    <p
                                      style={
                                        key === "clientLastName"
                                          ? { marginTop: "14px" }
                                          : {}
                                      }
                                    >
                                      {value.label}
                                    </p>
                                    <AsyncTypeahead
                                      isLoading={isLoadingTypeahead}
                                      onClick={() =>
                                        this.handleTypeaheadSearch(
                                          key,
                                          this.state[key]
                                        )
                                      }
                                      value={this.state[key]}
                                      defaultInputValue={value.defaultValue}
                                      id={key}
                                      onInputChange={(inputValue) =>
                                        this.handleTypeaheadInputChange(
                                          key,
                                          inputValue
                                        )
                                      }
                                      onChange={(selectValue) =>
                                        this.handleTypeaheadSelect(
                                          key,
                                          selectValue
                                        )
                                      }
                                      options={value.options}
                                      labelKey={value.selectedKey}
                                      minLength={3}
                                      placeholder=""
                                      onSearch={(value) =>
                                        this.handleTypeaheadSearch(key, value)
                                      }
                                      selected={selectedTypeahead}
                                      renderMenuItemChildren={
                                        this.renderMenuItemChildren
                                      }
                                    />
                                  </div>
                                ))}
                            </div>
                          </div>

                          {cl && (
                            <React.Fragment>
                              <div className="buttons modal-edit-client-buttons">
                                {!edit_appointment && (
                                  <React.Fragment>
                                    <span
                                      className="button-clients"
                                      onClick={this.removeCheckedUser}
                                    >
                                      {t("?????????????? ???? ??????????????")}
                                    </span>
                                    <span
                                      className="button-clients"
                                      onClick={() => this.editClient(cl)}
                                    >
                                      {t("??????????????????????????")}
                                    </span>
                                  </React.Fragment>
                                )}

                                <span
                                  className="button-clients"
                                  onClick={() => this.toggleVisits()}
                                >
                                  {t("????????????")}
                                </span>
                              </div>

                              {visits && (
                                <div
                                  style={{ paddingTop: "34px" }}
                                  className="client-info content-pages-bg"
                                >
                                  <div className="clients-list">
                                    {/* <div className="client">*/}
                                    {/*    <span*/}
                                    {/*        className="abbreviation">{cl.firstName ? cl.firstName.substr(0, 1) : ''}</span>*/}
                                    {/*    <span*/}
                                    {/*        className="name_container">{cl.firstName} {cl.lastName}*/}
                                    {/*        {access(12) && (*/}
                                    {/*            <React.Fragment>*/}
                                    {/*                <span className="email-user">{cl.email}</span>*/}
                                    {/*                <span className="email-user">{cl.phone}</span>*/}
                                    {/*            </React.Fragment>*/}
                                    {/*        )}*/}
                                    {/*    </span>*/}
                                    {/* </div>*/}
                                    <div
                                      style={{ overflow: "hidden" }}
                                      className="row"
                                    >
                                      <div className="col-6">
                                        <strong>
                                          {cl.appointments &&
                                          cl.appointments.length}
                                        </strong>
                                        <span className="gray-text">
                                          {t("?????????? ??????????????")}
                                        </span>
                                      </div>

                                      <div className="col-6">
                                        <strong>
                                          {allPrice}{" "}
                                          {cl.appointments &&
                                          cl.appointments[0] &&
                                          cl.appointments[0].currency}
                                        </strong>
                                        <span className="gray-text">
                                          {t("?????????? ??????????????")}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <hr className="gray" />
                                  {cl.appointments &&
                                  cl.appointments.length !== 0 ? (
                                    <p
                                      style={{
                                        textAlign: "center",
                                        paddingBottom: 0,
                                      }}
                                      className="pl-4 pr-4"
                                    >
                                      {t("?????? ????????????")}
                                    </p>
                                  ) : (
                                    <p
                                      style={{
                                        textAlign: "center",
                                        paddingBottom: 0,
                                      }}
                                      className="pl-4 pr-4"
                                    >
                                      {t("?????? ??????????????")}
                                    </p>
                                  )}

                                  <hr className="gray" />
                                  <div className="last-visit-list">
                                    {cl.appointments &&
                                    cl.appointments
                                      .sort(
                                        (a, b) =>
                                          b.appointmentTimeMillis -
                                          a.appointmentTimeMillis
                                      )
                                      .map((appointment) => {
                                        const activeService =
                                          servicesFromProps &&
                                          servicesFromProps.servicesList.find(
                                            (service) =>
                                              service.serviceId ===
                                              appointment.serviceId
                                          );
                                        const activeAppointmentStaff =
                                          staffFromProps &&
                                          staffFromProps.find(
                                            (staffItem) =>
                                              staffItem.staffId ===
                                              appointment.staffId
                                          );

                                        return (
                                          <div
                                            style={{
                                              paddingTop: "4px",
                                              cursor: "pointer",
                                              borderBottom:
                                                "10px solid rgb(245, 245, 246)",
                                            }}
                                            className="visit-info row pl-4 pr-4 mb-2 d-flex justify-content-between"
                                            onClick={() =>
                                              this.goToPageCalendar(
                                                appointment,
                                                appointment.staffId
                                              )
                                            }
                                          >
                                            <div
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                              }}
                                              className="col-8"
                                            >
                                              <p className="visit-detail">
                                                  <span
                                                    style={{
                                                      whiteSpace: "normal",
                                                    }}
                                                  >
                                                    <strong>
                                                      {t("??????????")}:{" "}
                                                    </strong>
                                                    {moment(
                                                      appointment.appointmentTimeMillis,
                                                      "x"
                                                    )
                                                      .locale("ru")
                                                      .format(
                                                        "dd, DD MMMM YYYY, HH:mm"
                                                      )}
                                                  </span>
                                                <span>
                                                    <strong>
                                                      {t("??????????????????????")}:{" "}
                                                    </strong>
                                                  {appointment.staffName}
                                                  </span>
                                                <span
                                                  style={{ fontSize: "13px" }}
                                                >
                                                    {appointment.serviceName}
                                                  </span>
                                                {activeService &&
                                                activeService.details ? (
                                                  <span>
                                                      {activeService.details}
                                                    </span>
                                                ) : (
                                                  ""
                                                )}
                                                {appointment.description ? (
                                                  <span className="visit-description">
                                                      {t("??????????????")}:{" "}
                                                    {appointment.description}
                                                    </span>
                                                ) : (
                                                  ""
                                                )}
                                                {appointment.clientNotCome ? (
                                                  <span
                                                    style={{
                                                      fontSize: "14px",
                                                    }}
                                                    className="visit-description red-text"
                                                  >
                                                      {t("???????????? ???? ????????????")}
                                                    </span>
                                                ) : (
                                                  ""
                                                )}
                                                <span className="visit-price">
                                                    {t("????????")}:&nbsp;
                                                  {appointment.priceFrom !==
                                                  appointment.priceTo
                                                    ? appointment.priceFrom +
                                                    " - " +
                                                    appointment.priceTo
                                                    : appointment.price}{" "}
                                                  {appointment.currency}
                                                  </span>
                                              </p>
                                            </div>

                                            <div
                                              style={{
                                                padding: 0,
                                                textAlign: "right",
                                              }}
                                              className="col-3 d-flex flex-column justify-content-center align-items-center"
                                            >
                                              {activeAppointmentStaff &&
                                              activeAppointmentStaff.staffId && (
                                                <div
                                                  style={{
                                                    position: "static",
                                                  }}
                                                  className="img-container text-center"
                                                >
                                                  <img
                                                    className="rounded-circle"
                                                    src={
                                                      activeAppointmentStaff.imageBase64
                                                        ? "data:image/png;base64," +
                                                        activeAppointmentStaff.imageBase64
                                                        : `${process.env.CONTEXT}public/img/avatar.svg`
                                                    }
                                                    alt=""
                                                  />
                                                  {/* <span className="staff-name">{activeStaffCurrent.firstName+" "+(activeStaffCurrent.lastName ? activeStaffCurrent.lastName : '')}</span>*/}
                                                </div>
                                              )}

                                              <span className="timing text-center my-2">
                                                  {moment
                                                    .duration(
                                                      parseInt(
                                                        appointment.duration
                                                      ),
                                                      "seconds"
                                                    )
                                                    .format(
                                                      `h[ ${t("??")}] m[ ${t(
                                                        "??????????"
                                                      )}]`
                                                    )}
                                                </span>

                                              <br />
                                            </div>
                                          </div>
                                        );
                                      })}
                                    {/* <Paginator*/}
                                    {/*    finalTotalPages={2}*/}
                                    {/*    onPageChange={this.handlePageClickAppointments}*/}
                                    {/* />*/}
                                  </div>
                                  {!!cl.discountPercent && (
                                    <div
                                      style={{
                                        textAlign: "center",
                                        color: "#F46A6A",
                                        margin: "16px 0",
                                      }}
                                    >
                                      {t("???????????????????????? ???????????? ??????????????")}:{" "}
                                      {cl.discountPercent}%
                                    </div>
                                  )}
                                  <hr />

                                  <span className="closer" />
                                </div>
                              )}
                            </React.Fragment>
                          )}

                          <hr className="gray-line" />

                          <p className="appointments-all-price">
                            {t("?????????? ??????????")}:{" "}
                            {appointmentsAllPrice -
                            (appointmentsAllPrice *
                              (this.state.clientChecked
                                ? this.state.clientChecked.discountPercent
                                : 0)) /
                            100}{" "}
                            {this.state.serviceCurrent &&
                            this.state.serviceCurrent.length > 0
                              ? this.state.serviceCurrent[0].service.currency
                              : ""}
                          </p>

                          <div className="calendar_modal_buttons text-center">
                            <button
                              style={{ minWidth: "48%", margin: "0" }}
                              className={
                                "button saveservices text-center button-absolute button-save"
                              }
                              type="button"
                              onClick={() => {
                                if (
                                  status === 208 ||
                                  (!edit_appointment &&
                                    Object.entries(typeAheadOptions).some(
                                      ([key, value]) =>
                                        !value.isValid(this.state[key])
                                    )) ||
                                  serviceCurrent.some(
                                    (elem) => elem.service.length === 0
                                  ) ||
                                  !staffCurrent.staffId ||
                                  !appointment[0] ||
                                  !appointment[0].appointmentTimeMillis
                                ) {
                                  this.setState({
                                    appointmentMessage: t(
                                      "???????????????????? ?????????????? ????????????"
                                    ),
                                  });
                                } else {
                                  pressSave()
                                }
                              }}
                            >
                              {t("??????????????????")}
                            </button>
                          </div>
                          <div className="mobileButton">
                            <button
                              style={{ minWidth: "48%" }}
                              className={"button text-center button-absolute"}
                              type="button"
                              onClick={() => {
                                if (
                                  status === 208 ||
                                  (!edit_appointment &&
                                    Object.entries(typeAheadOptions).some(
                                      ([key, value]) =>
                                        !value.isValid(this.state[key])
                                    )) ||
                                  serviceCurrent.some(
                                    (elem) => elem.service.length === 0
                                  ) ||
                                  !staffCurrent.staffId ||
                                  !appointment[0] ||
                                  !appointment[0].appointmentTimeMillis
                                ) {
                                  this.setState({
                                    appointmentMessage: t(
                                      "???????????????????? ?????????????? ????????????"
                                    ),
                                  });
                                } else {
                                  pressSave()
                                }
                              }}
                            >
                              {edit_appointment
                                ? t("??????????????????")
                                : t("??????????????????")}
                            </button>
                          </div>
                        </div>
                      )}

                      {edit_appointment && (
                        <div className="addApointmentClientBlock">
                          <div className="calendar_modal_buttons text-center">
                            <button
                              style={{ minWidth: "48%", margin: "0" }}
                              className={
                                "button saveservices text-center button-absolute button-save"
                              }
                              type="button"
                              onClick={() => {
                                if (
                                  status === 208 ||
                                  (!edit_appointment &&
                                    Object.entries(typeAheadOptions).some(
                                      ([key, value]) =>
                                        !value.isValid(this.state[key])
                                    )) ||
                                  serviceCurrent.some(
                                    (elem) => elem.service.length === 0
                                  ) ||
                                  !staffCurrent.staffId ||
                                  !appointment[0] ||
                                  !appointment[0].appointmentTimeMillis
                                ) {
                                  this.setState({
                                    appointmentMessage: t(
                                      "???????????????????? ?????????????? ????????????"
                                    ),
                                  });
                                } else {
                                  pressSave()
                                }
                              }}
                            >
                              {t("??????????????????")}
                            </button>
                          </div>
                          <div className="mobileButton">
                            <button
                              style={{ minWidth: "48%" }}
                              className={"button text-center button-absolute"}
                              type="button"
                              onClick={() => {
                                if (
                                  status === 208 ||
                                  (!edit_appointment &&
                                    Object.entries(typeAheadOptions).some(
                                      ([key, value]) =>
                                        !value.isValid(this.state[key])
                                    )) ||
                                  serviceCurrent.some(
                                    (elem) => elem.service.length === 0
                                  ) ||
                                  !staffCurrent.staffId ||
                                  !appointment[0] ||
                                  !appointment[0].appointmentTimeMillis
                                ) {
                                  this.setState({
                                    appointmentMessage: t(
                                      "???????????????????? ?????????????? ????????????"
                                    ),
                                  });
                                } else {
                                  pressSave()
                                }
                              }}
                            >
                              {edit_appointment
                                ? t("??????????????????")
                                : t("??????????????????")}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* <button className="button text-center button-absolute float-right create-client" type="button"  onClick={(e)=>this.newClient(null, e)}>*/}
                      {/*    ?????????????? ??????????????*/}
                      {/* </button>*/}
                    </div>
                  </div>
                  {appointmentMessage && (
                    <div
                      style={{
                        margin: "6px 15px",
                        padding: "4px 12px",
                        width: "100%",
                      }}
                      className="mobile-visible alert alert-danger"
                    >
                      {appointmentMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {clientSubmitModal && (
          <div className="check-client-submit-container">
            <CheckModal
              closeHandler={() => this.setState({ clientSubmitModal: false })}
              submitHandler={this.handleSave}
              // buttons={[
              //   {
              //     handler: this.addAppointment,
              //     params: this.props,
              //     innerText: "??????????????????????",
              //     className: "button",
              //     additionalHandler: () => this.setState({ clientSubmitModal: false }),
              //   },
              //   {
              //     handler: () => this.setState({ clientSubmitModal: false }),
              //     innerText: t("????????????"),
              //     className: "gray-button",
              //   },
              // ]}
            />
            <div onClick={() => this.setState({ clientSubmitModal: false })}>
              <div className="check-submit-mask" />
            </div>
          </div>
        )}
        {isNotAvailable && (
          <div className="check-client-submit-container">
            <CheckModal
              title="C?????????????? ?????????????????????????????? ???????????? ????????????????????"
              closeHandler={() => this.setState({ isNotAvailable: false })}
              showSubmit={false}
            />
            <div onClick={() => this.setState({ clientSubmitModal: false })}>
              <div className="check-submit-mask" />
            </div>
          </div>
        )}
      </Modal>
    );
  }

  checkUser(client) {
    this.props.dispatch(
      clientActions.getActiveClientAppointments(client.clientId, 1)
    );
    this.setState({
      clientChecked: {
        ...client,
        appointments: this.props.clients.activeClientAppointments,
      },
    });
  }

  removeCheckedUser(skippedKey) {
    const checkingProps = {
      clientChecked: null,
      clientFirstName: null,
      clientPhone: null,
      clientLastName: null,
      carBrand: null,
      carNumber: null,
      clientEmail: null,
      selectedTypeahead: [],
    };
    const updatedState = {};
    Object.entries(checkingProps).forEach(([objKey, objValue]) => {
      if (objKey !== skippedKey) {
        updatedState[objKey] = objValue;
      }
    });
    this.setState(updatedState);
  }

  editClient(client) {
    const { handleEditClient } = this.props;
    this.closeModal();
    return handleEditClient(client);
  }

  newClient(id) {
    const { handleEditClient } = this.props;
    return handleEditClient(id, true);
  }

  handleSave() {
    const { edit_appointment, appointmentMessage } = this.state;
    if (edit_appointment) {
      this.editAppointment();
    } else {
      this.addAppointment();
    }
    if (appointmentMessage) {
      this.setState({ appointmentMessage: null });
    }
  }

  addAppointment() {
    const {
      appointment,
      clientFirstName,
      clientPhone,
      clientLastName,
      carBrand,
      carNumber,
      clientEmail,
      staffCurrent,
      serviceCurrent,
      availableCoStaffs,
      clientChecked,
      clientSubmit,
      coStaffs,
      isAddCostaff,
    } = this.state;
    const { addAppointment } = this.props;

    let clientProps = {};
    if (clientFirstName || clientPhone || clientLastName || clientEmail) {
      clientProps = {
        clientFirstName,
        clientPhone: clientPhone && `+${clientPhone.replace(/[+()\- ]/g, "")}`,
        clientLastName,
        carBrand,
        carNumber,
        clientEmail,
      };
    }
    const appointmentNew = appointment.map((item, i) => {
      return {
        ...item,
        ...clientProps,
        serviceId: serviceCurrent[i].id,
      };
    });

    this.setState({
      serviceCurrent: [
        {
          id: -1,
          service: [],
        },
      ],
      clientChecked: null,
      coStaffs: [],
      appointment: [
        {
          appointmentTimeMillis: "",
          duration: "",
          description: "",
          customId: "",
        },
      ],
    });
    setTimeout(() => this.closeModal(), 500);
    const finalCoStaffs = coStaffs.filter((item) =>
      availableCoStaffs.some(
        (availableCoStaff) => item.staffId === availableCoStaff.staffId
      )
    );
    return addAppointment(
      appointmentNew,
      "",
      staffCurrent.staffId,
      clientChecked ? clientChecked.clientId : -1,
      isAddCostaff ? finalCoStaffs : []
    );
  }

  editAppointment() {
    const { appointment, coStaffs, propogatedAppointmentId, isAddCostaff, availableCoStaffs, appointmentsToDelete, serviceCurrent, staffCurrent, clientChecked, availableCoStaff } = this.state;

    const finalCoStaffs = coStaffs.filter((item) => availableCoStaffs.some((availableCoStaff) => item.staffId === availableCoStaff.staffId));

    const appointmentNew = appointment.map((item, i) => {
      return {
        ...item,
        coStaffs: isAddCostaff ? finalCoStaffs : [],
        staffId: staffCurrent.staffId,
        serviceId: serviceCurrent[i].id,
        serviceName: serviceCurrent[i].service.name,
        duration: item.duration ? item.duration : this.getDurationForCurrentStaff(serviceCurrent[i].service),
        color: serviceCurrent[i].service.color,
        currency: serviceCurrent[i].service.currency,
      };
    });

    setTimeout(() => this.closeModal(), 500);

    // const nextUpdatingData = {
    //   appointmentNew: JSON.stringify(appointmentNew),
    //   appointmentId: propogatedAppointment.appointmentId,
    // };

    // if (propogatedAppointment) {
    //   appointment.forEach((item, i) => {
    //     this.props.dispatch(calendarActions.deleteAppointment(
    //       propogatedAppointment, true, false, (i === (appointment.length - 1)) ? nextUpdatingData : null)
    //     );
    //   });
    // } else {
      this.props.dispatch(calendarActions.editAppointment2(
        JSON.stringify(appointmentNew),
        propogatedAppointmentId ? propogatedAppointmentId : appointment[0].appointmentId)
      );
    // }
  }


  handleClick(id) {
    const { client } = this.state;

    if (id != null) {
      const client_working = client.client.find((item) => {
        return id === item.clientId;
      });

      this.setState({
        ...this.state,
        edit: true,
        client_working: client_working,
      });
    } else {
      this.setState({ ...this.state, edit: false, client_working: {} });
    }
  }

  addClient(client) {
    const { dispatch } = this.props;

    dispatch(clientActions.addClient(JSON.stringify(client)));
  }

  handleChange(e, index) {
    const { name, value } = e.target;
    const { appointment, serviceCurrent } = this.state;

    if (name === "discountPercent") {
      const result = String(value);
      const newValue =
        value >= 0 && value <= 100
          ? result.replace(/[,. ]/g, "")
          : appointment[index].discountPercent;
      appointment[index] = { ...appointment[index], [name]: newValue };
    } else if (name === "price") {
      appointment[index] = { ...appointment[index], [name]: value };
    } else {
      appointment[index] = { ...appointment[index], [name]: value };
    }

    this.setState({ appointment });
  }

  setStaff(staffId, firstName, lastName, imageBase64) {
    const { staffCurrent, serviceCurrent } = this.state;
    const newServiceCurrent = serviceCurrent.map(() => ({
      id: -1,
      service: [],
    }));
    const newStaffCurrent = {
      ...staffCurrent,
      staffId: staffId.staffId,
      firstName: firstName,
      lastName: lastName,
      imageBase64,
    };

    this.setState({
      minutes: this.getHours(staffId),
      serviceCurrent: newServiceCurrent,
      staffCurrent: newStaffCurrent,
      coStaffs: [],
    });
  }

  getAppointments(appointment) {
    const { appointmentsFromProps, reservedTimeFromProps, staff } = this.props;
    const { staffs, staffId } = this.state;
    const visitFreeMinutes = this.getVisitFreeMinutes(appointment);
    const newAppointments = [];
    const appointmentMessage = "";
    appointment.forEach((item, i) => {
      let shouldAdd = false;
      if (i !== 0) {
        const user = staffs.timetable.find(
          (timetable) => timetable.staffId === staffId.staffId
        );

        const startTime =
          parseInt(appointment[i - 1].appointmentTimeMillis) +
          appointment[i - 1].duration * 1000;
        const endTime = startTime + appointment[i].duration * 1000;

        shouldAdd = isAvailableTime(
          startTime,
          endTime,
          user,
          [],
          // appointmentsFromProps,
          reservedTimeFromProps,
          staff,
          (i) => visitFreeMinutes.some((freeMinute) => freeMinute === i)
        );

        if (shouldAdd) {
          item.appointmentTimeMillis = startTime;
        }
      }
      // if (!shouldAdd && (i === appointment.length - 1) && i !== 0) {
      //     appointmentMessage = '???????????????????? ???????????????? ?????? ???????? ????????????';
      //     return;
      // }
      newAppointments.push(item);
    });
    return { newAppointments, appointmentMessage };
  }

  setService(serviceId, service, index, appointment = this.state.appointment) {
    const { serviceCurrent } = this.state;
    appointment[index].duration = this.getDurationForCurrentStaff(service);
    appointment[index].price = service.priceFrom;
    serviceCurrent[index] = { id: serviceId, service };
    const updatedAppointments = this.getAppointments(appointment);
    this.updateAvailableCoStaffs(updatedAppointments.newAppointments);
    this.setState({
      serviceCurrent,
      appointment: updatedAppointments.newAppointments,
      appointmentMessage: updatedAppointments.appointmentMessage,
    });
  }

  getHours(idStaff) {
    const { getHours } = this.props;
    const { timeNow } = this.state;

    return getHours(timeNow, idStaff, [], false);
  }

  handleServicesSearch({ target: { value } }) {
    this.setState({
      servicesSearch: value,
    });
  }

  handleSearch() {
    if (this.search.value.length >= 3) {
      this.updateClients();
    } else if (this.search.value.length === 0) {
      this.updateClients();
    }
  }

  closeModal() {
    const { onClose } = this.props;
    this.setState({ clientChecked: null });

    return onClose();
  }
}

function mapStateToProps(state) {
  const {
    alert,
    company,
    services,
    staff: { staff },
    authentication,
    calendar: { appointments, reservedTime },
  } = state;
  return {
    alert,
    company,
    services,
    staff,
    authentication,
    appointmentsFromProps: appointments,
    reservedTimeFromProps: reservedTime,
  };
}

AddAppointment.propTypes = {
  staff: PropTypes.object,
  clients: PropTypes.object,
  addAppointment: PropTypes.func,
  handleEditClient: PropTypes.func,
  getHours: PropTypes.func,
  clickedTime: PropTypes.number,
  minutes: PropTypes.array,
  staffId: PropTypes.object,
  appointments: PropTypes.object,
  appointmentEdited: PropTypes,
  onClose: PropTypes.func,
};

const connectedApp = compose(
  connect(mapStateToProps),
  withRouter,
  withTranslation("common")
)(AddAppointment);
export { connectedApp as AddAppointment };
