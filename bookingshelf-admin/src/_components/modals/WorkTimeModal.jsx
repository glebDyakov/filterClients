import React, { Component } from 'react';
import Modal from '@trendmicro/react-modal';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import { connect } from 'react-redux';
import { staffActions } from '../../_actions';


class WorkTimeModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      times: props.editing_object ? props.editing_object : [{}],
      countTimes: props.editing_object && props.editing_object.length > 0 ? props.editing_object : [1],
      editing_object: props.editing_object && props.editing_object,
      activeStaffId: props.activeStaffId ? props.activeStaffId : -1,
      edit: props.edit,
      selectedStaffs: props.activeStaffId ? [props.activeStaffId] : [],
      period: 0,
      days: props.date ? [moment(props.date, 'DD/MM/YYYY').day()] : [],
      date: props.date ? props.date : moment().format('DD/MM/YYYY'),
      isOpenMobileSelectStaff: true,
    };

    this.toggleSelectStaff = this.toggleSelectStaff.bind(this);
    this.clearSelectedStaffs = this.clearSelectedStaffs.bind(this);
    this.selectAllStaffs = this.selectAllStaffs.bind(this);
    this.onAddTime = this.onAddTime.bind(this);
    this.onRemoveTime = this.onRemoveTime.bind(this);
    this.onChangeTime = this.onChangeTime.bind(this);
    this.disabledHours = this.disabledHours.bind(this);
    this.disabledMinutes = this.disabledMinutes.bind(this);
    this.onSaveTime = this.onSaveTime.bind(this);
    this.toggleDays = this.toggleDays.bind(this);
  }

  toggleDays(day) {
    if (this.state.days.length > 0 && this.state.days.includes(day)) {
      this.setState((state) => {
        return {
          days: state.days.filter((item) => item !== day),
        };
      });
    } else {
      this.setState((state) => {
        state.days.push(day);
        return {
          days: state.days,
        };
      });
    }
  }

  onSaveTime() {
    const { times, date, selectedStaffs, period, days } = this.state;

    const data = selectedStaffs.map((staff) => {
      return {
        staffId: staff,
        timetables: days.flatMap((d) => {
          const startDate = moment(date, 'DD-MM-YYYY');
          const matchDay = Number(d);
          const daysToAdd = Math.ceil((startDate.day() - matchDay) / 7) * 7 + matchDay;
          const proposedDate = moment(startDate).startOf('week').add(daysToAdd - 1, 'd');

          return times.map((t) => {
            return {
              period,
              endTimeMillis: proposedDate.set({
                'hour': moment(t.endTimeMillis, 'x').get('hour'),
                'minute': moment(t.endTimeMillis, 'x').get('minute'),
              }).format('x'),
              startTimeMillis: proposedDate.set({
                'hour': moment(t.startTimeMillis, 'x').get('hour'),
                'minute': moment(t.startTimeMillis, 'x').get('minute'),
              }).format('x'),
            };
          });
        }),
      };
    });

    this.props.dispatch(staffActions.addArrayWorkingHours(data));
  }

  disabledHours(num, key, str) {
    const { times } = this.state;

    const hoursArray = [];
    const workStartMilis = 0;
    const workEndMilis = 23;
    for (let i = 0; i <= 23; i++) {
      if (i < workStartMilis || workEndMilis < i) {
        hoursArray.push(i);
      }

      if (str === 'end' && times[key] && (times[key].startTimeMillis && i < moment(times[key].startTimeMillis, 'x').format('H'))) {
        hoursArray.push(i);
      }

      if (str === 'start' && times[key] && (times[key].startTimeMillis && i >= moment(times[key].endTimeMillis, 'x').format('H'))) {
        hoursArray.push(i);
      }
    }

    if (str === 'end' && times[key]) {
      const workEndMilisH = parseInt(moment(parseInt(times[key].startTimeMillis), 'x').format('H'));
      const workEndMilisM = parseInt(moment(parseInt(times[key].startTimeMillis), 'x').format('mm'));
      if (workEndMilisM === 45) {
        hoursArray.push(workEndMilisH);
      }
    }

    times && times.map((time, keyTime) => {
      let timeEnd = parseInt(moment(time.endTimeMillis, 'x').format('k'));
      let timeStart = parseInt(moment(time.startTimeMillis, 'x').format('k'));

      if (time.startTimeMillis && keyTime !== key) {
        if (times[key] && times[key].startTimeMillis && parseInt(moment(times[key].startTimeMillis, 'x').format('k')) < parseInt(moment(time.startTimeMillis, 'x').format('k'))) {
          timeEnd = 24;
        }

        if (times[key] && times[key].endTimeMillis && parseInt(moment(times[key].endTimeMillis, 'x').format('k')) > parseInt(moment(time.endTimeMillis, 'x').format('k'))) {
          timeStart = 0;
        }

        for (let iTime = timeStart; iTime <= timeEnd; iTime++) {
          hoursArray.push(iTime);
        }
      }
    });

    return hoursArray;
  }

  disabledMinutes(h, key, str) {
    const { times } = this.state;

    const minutesArray = [];

    if (str === 'end' && times[key]) {
      const workEndMilisH = parseInt(moment(parseInt(times[key].startTimeMillis), 'x').format('H'));
      const workEndMilisM = parseInt(moment(parseInt(times[key].startTimeMillis), 'x').format('mm'));

      if (h === workEndMilisH) {
        if (workEndMilisM === 0) {
          minutesArray.push(0);
        }

        if (workEndMilisM === 15) {
          minutesArray.push(0, 15);
        }

        if (workEndMilisM === 30) {
          minutesArray.push(0, 15, 30);
        }
      }
    }

    return minutesArray;
  }


  toggleSelectStaff(staffId) {
    if (this.state.selectedStaffs.length > 0 && this.state.selectedStaffs.includes(staffId)) {
      this.setState((state) => {
        return {
          selectedStaffs: state.selectedStaffs.filter((item) => item !== staffId),
        };
      });
    } else {
      this.setState((state) => {
        state.selectedStaffs.push(staffId);
        return {
          selectedStaffs: state.selectedStaffs,
        };
      });
    }
  }

  onChangeTime(field, key, time, q, w, e) {
    const { times, date } = this.state;
    let timeVar = moment(date + ' ' + moment(time, 'x').format('HH:mm'), 'DD/MM/YYYY HH:mm');

    if (timeVar.minute() !== 0 &&
      timeVar.minute() !== 15 &&
      timeVar.minute() !== 30 &&
      timeVar.minute() !== 45
    ) {
      timeVar = timeVar.add(15 - (timeVar.minute() % 15), 'minutes');
    }

    this.setState({ times: Object.assign(times, { [key]: { ...times[key], [field]: timeVar.format('x') } }) });
  }

  onAddTime() {
    const { countTimes, times } = this.state;

    const arrayCounts = countTimes;

    if (countTimes.length < 5) {
      arrayCounts.push(1);
      this.setState({ countTimes: arrayCounts, times });
    }
  }

  onRemoveTime(index) {
    const { countTimes, deletedCountTimes } = this.state;
    if (countTimes[index].staffTimetableId) {
      deletedCountTimes.push(countTimes[index]);
    }
    countTimes.splice(index, 1);

    this.setState({ countTimes });
  }

  clearSelectedStaffs() {
    if (!this.props.edit) {
      this.setState({
        selectedStaffs: [],
      });
    }
  }

  selectAllStaffs() {
    if (this.props.staff && this.props.staff.staff && !this.props.edit) {
      this.setState({
        selectedStaffs: this.props.staff.staff.map((item) => item.staffId),
      });
    }
  }


  render() {
    const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const { times, period, edit, activeStaffId, isOpenMobileSelectStaff } = this.state;


    const staffs = this.props.staff && this.props.staff.staff && this.props.staff.staff.map((item) => {
      return {
        staffId: item.staffId,
        name: item.firstName,
        surname: item.lastName,
        image: item.imageBase64,
      };
    }).filter(staff => edit ? staff.staffId === activeStaffId : true);

    console.log(moment(this.props.date, 'DD/MM/YYYY').day());

    console.log(isOpenMobileSelectStaff);

    return (
      <Modal size="md" onClose={this.onClose} showCloseButton={false}
             className={(isOpenMobileSelectStaff ? 'scroll-hidden ' : '') + 'mod'}>

        <div className="modal-dialog add-work-time-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">{this.props.edit ? 'Редактировать часы работы' : 'Добавить часы работы'}</h4>
              <button type="button" className="close" onClick={this.props.onClose}/>
            </div>
            <div className="form-group d-flex">

              <div className="choose-staff-container col-12 col-md-3">
                <div className="staff-container-header d-flex justify-content-between align-items-center">
                  <a onClick={this.selectAllStaffs} className={'check-all' + (this.props.edit ? ' disabledField' : '')}>Выбрать
                    всех</a>
                  <a onClick={this.clearSelectedStaffs}
                     className={'clear-all' + (this.props.edit ? ' disabledField' : '')}>Очистить</a>
                </div>

                <div className="staffs-list">
                  {staffs && staffs.map((item) => (
                    <div className="staff-container-item d-flex justify-content-between align-items-center">
                      <div className="user-credit d-flex align-items-center">
                        <img className="staff-image"
                             src={item.image ? 'data:image/png;base64,' + item.image : `${process.env.CONTEXT}public/img/avatar.svg`}
                             alt=""/>
                        <p className="staff-name mb-0">{item.name} {item.surname}</p>
                      </div>
                      <div className="col-2 justify-content-end check-box">
                        <label>
                          <input disabled={this.props.edit}
                                 className={'form-check-input' + (this.props.edit ? ' disabledField' : '')}
                                 type="checkbox"
                                 checked={this.state.selectedStaffs.includes(item.staffId)}
                                 onChange={() => this.toggleSelectStaff(item.staffId)}
                          />
                          <span className="check-box-circle"></span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="work-time-container col-12 col-md-9">
                <h2 className="work-time-title">Повтор</h2>
                <div className="check-box repeat">
                  <div className="form-check-inline">
                    <input type="radio" className="form-check-input" name="radio33"
                           id="radio100" checked={period === 0} onChange={() => {
                      this.setState({ period: 0 });
                    }}/>
                    <label className="form-check-label"
                           htmlFor="radio100">Разовый</label>
                  </div>
                  <div className="form-check-inline">
                    <input type="radio" className="form-check-input" name="radio33"
                           id="radio101" checked={period === 7} onChange={() => {
                      this.setState({ period: 7 });
                    }}/>
                    <label className="form-check-label"
                           htmlFor="radio101">Повторять каждую неделю</label>
                  </div>
                  <div className="form-check-inline">
                    <input type="radio" className="form-check-input" name="radio33"
                           id="radio106" checked={period === 2} onChange={() => {
                      this.setState({ period: 2 });
                    }}
                    />
                    <label className="form-check-label"
                           htmlFor="radio106">1 через 1</label>
                  </div>
                  <div className="form-check-inline">
                    <input type="radio" className="form-check-input" name="radio33"
                           id="radio105" checked={period === 4} onChange={() => {
                      this.setState({ period: 4 });
                    }}/>
                    <label className="form-check-label"
                           htmlFor="radio105">2 через 2</label>
                  </div>

                </div>

                <div className="inline-group d-flex">
                  <div className="days">
                    <h2 className="work-time-title">Дни недели</h2>

                    <div className="days-of-week flex-column d-flex">
                      {weekDays.map((item, key) => {
                        return (
                          <div className="justify-content-end check-box">
                            <label>
                              {item}
                              <input className="form-check-input" type="checkbox"
                                     checked={this.state.days.includes(key)}
                                     onChange={() => this.toggleDays(key)}
                              />
                              <span className="check-box-circle"></span>
                            </label>
                          </div>

                        );
                      })}
                    </div>
                  </div>
                  <div className="gap w-100">
                    <h2 className="work-time-title">Промежуток</h2>
                    {this.state.countTimes.map((item, key) => {
                      return (
                        <div className="gap-item d-flex align-items-center justify-content-between">
                          <div className="time-pickers d-flex align-items-center">
                            <div className="gap-item-timepicker">
                              <p>Начало</p>
                              <TimePicker
                                id={'startTimeMillis' + key}
                                key={'startTimeMillis' + key}
                                value={item != 1 ? moment(parseInt(item.startTimeMillis), 'x') : times[key] && times[key].startTimeMillis ? moment(times[key].startTimeMillis, 'x') : ''}
                                className="col-md-12 p-0"
                                minuteStep={15}
                                hideDisabledOptions={true}
                                disabledHours={() => this.disabledHours(parseInt(moment(this.state.date, 'DD/MM/YYYY').zone('+0800').isoWeekday()) - 1, key, 'start')}
                                disabledMinutes={this.disabledMinutes}
                                showSecond={false}
                                onChange={(startTimeMillis, q, w, e) => this.onChangeTime('startTimeMillis', key, moment(startTimeMillis).format('x'), q, w, e)}
                              />
                            </div>
                            <div className="gap-item-timepicker">
                              <p>Конец</p>
                              <TimePicker
                                id={'endTimeMillis' + key}
                                value={item != 1 ? item.endTimeMillis ? moment(parseInt(item.endTimeMillis), 'x') : '' : times[key] && times[key].endTimeMillis ? moment(times[key].endTimeMillis, 'x') : ''}
                                key={'endTimeMillis' + key}
                                hideDisabledOptions={true}
                                minuteStep={15}
                                className="col-md-12 p-0"
                                showSecond={false}
                                disabledMinutes={(h) => this.disabledMinutes(h, key, 'end')}
                                disabledHours={() => this.disabledHours(parseInt(moment(this.state.date, 'DD/MM/YYYY').zone('+0800').isoWeekday()) - 1, key, 'end')}
                                onChange={(endTimeMillis) => this.onChangeTime('endTimeMillis', key, moment(endTimeMillis).format('x'))}
                              />
                            </div>
                          </div>

                          <a onClick={() => {
                            this.onRemoveTime(key);
                          }} className="delete-gap">Удалить промежуток</a>

                        </div>

                      );
                    })}
                    {this.state.countTimes.length < 5 &&
                    <a onClick={this.onAddTime} className="add-work-time">Добавить промежуток +</a>}
                  </div>
                </div>
                <div className="button-container text-center text-md-right">
                  <button onClick={this.props.onClose} className="cancel">Отменить</button>
                  <button
                    disabled={this.state.selectedStaffs.length < 1 || this.state.days.length < 1 || (this.state.countTimes.length !== this.state.times.length) || this.state.times.some((item) => !item.startTimeMillis || !item.endTimeMillis)}
                    onClick={this.onSaveTime}
                    className={'button ml-auto' + (this.state.selectedStaffs.length < 1 || this.state.days.length < 1 || (this.state.countTimes.length !== this.state.times.length) || this.state.times.some((item) => !item.startTimeMillis || !item.endTimeMillis) ? ' disabledField' : '')}
                    type="button"
                    data-dismiss="modal">Сохранить
                  </button>
                </div>
              </div>
            </div>

            {isOpenMobileSelectStaff &&
            <div className="mobile-select-staff-modal_wrapper">
              <div className="mobile-select-staff-modal">
                <div className="modal-header">
                  <h4 className="modal-title">Выбор сотрудника</h4>
                  <button onClick={() => {
                    this.setState({ isOpenMobileSelectStaff: false });
                  }} className="close"></button>
                </div>
                <div className="choose-staff-container">
                  <div className="staff-container-header d-flex justify-content-between align-items-center">
                    <a onClick={this.selectAllStaffs}
                       className={'check-all' + (this.props.edit ? ' disabledField' : '')}>Выбрать
                      всех</a>
                    <a onClick={this.clearSelectedStaffs}
                       className={'clear-all' + (this.props.edit ? ' disabledField' : '')}>Очистить</a>
                  </div>

                  <div className="staffs-list">
                    {staffs && staffs.map((item) => (
                      <div className="staff-container-item d-flex justify-content-between align-items-center">
                        <div className="user-credit d-flex align-items-center">
                          <img className="staff-image"
                               src={item.image ? 'data:image/png;base64,' + item.image : `${process.env.CONTEXT}public/img/avatar.svg`}
                               alt=""/>
                          <p className="staff-name mb-0">{item.name} {item.surname}</p>
                        </div>
                        <div className="col-1 justify-content-end check-box">
                          <label>
                            <input disabled={this.props.edit}
                                   className={'form-check-input' + (this.props.edit ? ' disabledField' : '')}
                                   type="checkbox"
                                   checked={this.state.selectedStaffs.includes(item.staffId)}
                                   onChange={() => this.toggleSelectStaff(item.staffId)}
                            />
                            <span className="check-box-circle"></span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
            }

          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  const { staff } = state;
  return {
    staff,
  };
};

export default connect(mapStateToProps)(WorkTimeModal);
