import React, {Component} from 'react';
import Modal from '@trendmicro/react-modal';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import {connect} from 'react-redux';
import {staffActions} from '../../_actions';
import Hint from "../Hint";
import { DatePicker } from '../DatePicker';


class WorkTimeModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            times: props.editing_object ? props.editing_object : [{}],
            countTimes: props.editing_object && props.editing_object.length > 0 ? props.editing_object : [1],
            editing_object: props.editing_object && props.editing_object,
            activeStaffId: props.activeStaffId ? props.activeStaffId : -1,
            edit: props.edit,
            deletedCountTimes: [],
            selectedStaffs: props.activeStaffId ? [props.activeStaffId] : [],
            period: props.edit ? props.editing_object[0].period : 0,
            days: props.date ? [moment(props.date, 'DD/MM/YYYY').day()] : [],
            date: props.date ? props.date : moment().format('DD/MM/YYYY'),
            isOpenMobileSelectStaff: true,
            dateTo: new Date(moment(props.date ? moment(props.date, 'DD/MM/YYYY') : new Date()).add(7, 'days')),
            initialDateTo: new Date(moment(props.date ? moment(props.date, 'DD/MM/YYYY') : new Date()).add(7, 'days')),
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
        const {period} = this.state;
        if (this.state.days.length > 0 && this.state.days.includes(day)) {
            this.setState((state) => {
                return {
                    days: state.days.filter((item) => item !== day),
                };
            });
        } else {
            this.setState((state) => {
                if (period === 2 || period === 4) {
                    return {
                        days: [day],
                    };
                } else {
                    state.days.push(day);
                    return {
                        days: state.days,
                    };
                }
            });
        }
    }

    finalRemove(deletedCountTimes = this.state.deletedCountTimes) {
        deletedCountTimes.forEach((item, i) => {
            setTimeout(() => {
                this.onDelete(item.startTimeMillis, item.endTimeMillis, item.staffTimetableId);
            }, (i * 100));
        });
    }

    onDelete(startDay, endOfDay, staffTimetableId) {
        const {deleteWorkingHours} = this.props;
        const {selectedStaffs, period} = this.state;

        deleteWorkingHours(selectedStaffs[0], startDay, endOfDay, staffTimetableId);
    }

    onSaveTime() {
        const {times, date, selectedStaffs, period, days, edit} = this.state;

        this.finalRemove()

        const data = selectedStaffs.map((staff) => {
            return {
                staffId: staff,
                timetables: days.flatMap((d) => {
                    const startDate = moment(date, 'DD-MM-YYYY');
                    const matchDay = Number(d);
                    const daysToAdd = Math.ceil((startDate.day() - matchDay) / 7) * 7 + matchDay;


                    const updatedTimetables = [];
                    times.forEach((t) => {
                    switch (period) {
                        case 7: {
                            let proposedDate = moment(startDate).startOf('week').add((daysToAdd + 6) % 7, 'd');
                            const endDate = moment(this.state.dateTo);
                            while (moment(proposedDate) <= moment(endDate).endOf('day')) {
                                updatedTimetables.push({
                                period: 0,
                                endTimeMillis: proposedDate.set({
                                    'hour': moment(t.endTimeMillis, 'x').get('hour'),
                                    'minute': moment(t.endTimeMillis, 'x').get('minute'),
                                }).format('x'),
                                startTimeMillis: proposedDate.set({
                                    'hour': moment(t.startTimeMillis, 'x').get('hour'),
                                    'minute': moment(t.startTimeMillis, 'x').get('minute'),
                                }).format('x'),
                            });
                            proposedDate = moment(proposedDate).add(7, 'days');
                        }
                            break;
                        }

                        case 0: {
                            let proposedDate = moment(startDate).startOf('week').add((daysToAdd + 6) % 7, 'd');
                            updatedTimetables.push({
                                period: 0,
                                endTimeMillis: proposedDate.set({
                                    'hour': moment(t.endTimeMillis, 'x').get('hour'),
                                    'minute': moment(t.endTimeMillis, 'x').get('minute'),
                                }).format('x'),
                                startTimeMillis: proposedDate.set({
                                    'hour': moment(t.startTimeMillis, 'x').get('hour'),
                                    'minute': moment(t.startTimeMillis, 'x').get('minute'),
                                }).format('x'),
                            });
                            break;
                        }
                        
                        case 2: {
                            let proposedDate = moment(startDate).startOf('week').add((daysToAdd + 6) % 7, 'd');
                            const endDate = moment(this.state.dateTo);
                            while (moment(proposedDate) <= moment(endDate).endOf('day')) {
                                updatedTimetables.push({
                                period: 0,
                                endTimeMillis: proposedDate.set({
                                    'hour': moment(t.endTimeMillis, 'x').get('hour'),
                                    'minute': moment(t.endTimeMillis, 'x').get('minute'),
                                }).format('x'),
                                startTimeMillis: proposedDate.set({
                                    'hour': moment(t.startTimeMillis, 'x').get('hour'),
                                    'minute': moment(t.startTimeMillis, 'x').get('minute'),
                                }).format('x'),
                            });
                            
                            proposedDate = moment(proposedDate).add(2, 'days');
                        }
                            break;
                        }

                        case 4: {
                            let proposedDate = moment(startDate).startOf('week').add((daysToAdd + 6) % 7, 'd');
                            const endDate = moment(this.state.dateTo);
                            while (moment(proposedDate) <= moment(endDate).endOf('day')) {
                                updatedTimetables.push({
                                period: 0,
                                endTimeMillis: proposedDate.set({
                                    'hour': moment(t.endTimeMillis, 'x').get('hour'),
                                    'minute': moment(t.endTimeMillis, 'x').get('minute'),
                                }).format('x'),
                                startTimeMillis: proposedDate.set({
                                    'hour': moment(t.startTimeMillis, 'x').get('hour'),
                                    'minute': moment(t.startTimeMillis, 'x').get('minute'),
                                }).format('x'),
                            }, {
                                period: 0,
                                endTimeMillis: moment(proposedDate).add(1, 'days').set({
                                    'hour': moment(t.endTimeMillis, 'x').get('hour'),
                                    'minute': moment(t.endTimeMillis, 'x').get('minute'),
                                }).format('x'),
                                startTimeMillis: moment(proposedDate).add(1, 'days').set({
                                    'hour': moment(t.startTimeMillis, 'x').get('hour'),
                                    'minute': moment(t.startTimeMillis, 'x').get('minute'),
                                }).format('x'),
                            });
                            
                            
                            proposedDate = moment(proposedDate).add(4, 'days');
                        }
                            break;
                        }
                    
                        default:
                            break;
                    }
                    
                       
                    });
                    return updatedTimetables;
                }),
            };
        });


        if (edit) {
            this.finalRemove(this.props.editing_object)
            if (this.state.countTimes.length > 0 && this.state.times.length > 0) {
                setTimeout(() => {
                    this.props.dispatch(staffActions.addArrayWorkingHours(data));
                }, 150 * this.props.editing_object.length);
            }
            // this.props.onClose();
        } else {
            this.props.dispatch(staffActions.addArrayWorkingHours(data));
        }
    }

    disabledHours(num, key, str) {
        const {times} = this.state;

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
            timeStart = timeStart === 24 ? 0 : timeStart;

            if (time.startTimeMillis && keyTime !== key) {
                if (times[key] && times[key].startTimeMillis) {
                    let time1 = parseInt(moment(times[key].startTimeMillis, 'x').format('k'))
                    let time2 = parseInt(moment(time.startTimeMillis, 'x').format('k'))
                    time1 = time1 === 24 ? 0 : time1
                    time2 = time2 === 24 ? 0 : time2
                    if (time1 < time2) {
                        timeEnd = 24;
                    }
                }


                if (times[key] && times[key].endTimeMillis) {
                    let time1 = parseInt(moment(times[key].endTimeMillis, 'x').format('k'))
                    let time2 = parseInt(moment(time.endTimeMillis, 'x').format('k'));
                    time1 = time1 === 24 ? 0 : time1
                    time2 = time2 === 24 ? 0 : time2
                    if (time1 > time2) {
                        timeStart = 0;
                    }
                }

                for (let iTime = timeStart; iTime <= timeEnd; iTime++) {
                    hoursArray.push(iTime);
                }
            }
        });

        return hoursArray;
    }

    disabledMinutes(h, key, str) {
        const {times} = this.state;

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
        const {times, date} = this.state;
        let timeVar = moment(date + ' ' + moment(time, 'x').format('HH:mm'), 'DD/MM/YYYY HH:mm');

        if (timeVar.minute() !== 0 &&
            timeVar.minute() !== 15 &&
            timeVar.minute() !== 30 &&
            timeVar.minute() !== 45
        ) {
            timeVar = timeVar.add(15 - (timeVar.minute() % 15), 'minutes');
        }

        this.setState({times: Object.assign(times, {[key]: {...times[key], [field]: timeVar.format('x')}})});
    }

    onAddTime() {
        const {countTimes, times} = this.state;

        const arrayCounts = countTimes;

        if (countTimes.length < 5) {
            arrayCounts.push(1);
            this.setState({countTimes: arrayCounts, times});
        }
    }

    onRemoveTime(index) {
        const {countTimes, deletedCountTimes} = this.state;
        if (countTimes[index].staffTimetableId) {
            deletedCountTimes.push(countTimes[index]);
        }
        countTimes.splice(index, 1);

        this.setState({countTimes});
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
        const {workTimeModalMessage, t, staff: {status, adding}} = this.props;
        const weekDays = [
            {
              name: '????',
              key: 1
            },
            {
                name: '????',
                key: 2
              },
              {
                name: '????',
                key: 3
              },
              {
                name: '????',
                key: 4
              },
              {
                name: '????',
                key: 5
              },
              {
                name: '????',
                key: 6,
                isWeekend: true,
              },
              {
                name: '????',
                key: 0,
                isWeekend: true,
              }
            ];
        const {times, period, edit, activeStaffId, isOpenMobileSelectStaff} = this.state;


        const staffs = this.props.staff && this.props.staff.staff && this.props.staff.staff.map((item) => {
            return {
                staffId: item.staffId,
                name: item.firstName,
                surname: item.lastName,
                image: item.imageBase64,
            };
        }).filter(staff => edit ? staff.staffId === activeStaffId : true);

        return (
            <Modal size="md" onClose={this.onClose} showCloseButton={false}
                   className={(isOpenMobileSelectStaff ? 'scroll-hidden ' : '') + 'mod'}>

                <div className="modal-dialog add-work-time-modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">{this.props.edit ? t('?????????????????????????? ???????? ????????????') : t('???????????????? ???????? ????????????')}</h4>
                            <button type="button" className="close" onClick={this.props.onClose}/>
                        </div>
                        <div className="form-group d-flex">

                            {/*<div className="choose-staff-container col-12 col-md-3">*/}
                            {/*  <div className="staff-container-header d-flex justify-content-between align-items-center">*/}
                            {/*    <a onClick={this.selectAllStaffs} className={'check-all' + (this.props.edit ? ' disabledField' : '')}>??????????????*/}
                            {/*      ????????</a>*/}
                            {/*    <a onClick={this.clearSelectedStaffs}*/}
                            {/*       className={'clear-all' + (this.props.edit ? ' disabledField' : '')}>????????????????</a>*/}
                            {/*  </div>*/}

                            {/*  <div className="staffs-list">*/}
                            {/*    {staffs && staffs.map((item) => (*/}
                            {/*      <div className="staff-container-item d-flex justify-content-between align-items-center">*/}
                            {/*        <div className="user-credit d-flex align-items-center">*/}
                            {/*          <img className="staff-image"*/}
                            {/*               src={item.image ? 'data:image/png;base64,' + item.image : `${process.env.CONTEXT}public/img/avatar.svg`}*/}
                            {/*               alt=""/>*/}
                            {/*          <p className="staff-name mb-0">{item.name} {item.surname}</p>*/}
                            {/*        </div>*/}
                            {/*        <div className="col-2 justify-content-end check-box">*/}
                            {/*          <label>*/}
                            {/*            <input disabled={this.props.edit}*/}
                            {/*                   className={'form-check-input' + (this.props.edit ? ' disabledField' : '')}*/}
                            {/*                   type="checkbox"*/}
                            {/*                   checked={this.state.selectedStaffs.includes(item.staffId)}*/}
                            {/*                   onChange={() => this.toggleSelectStaff(item.staffId)}*/}
                            {/*            />*/}
                            {/*            <span className="check-box-circle"></span>*/}
                            {/*          </label>*/}
                            {/*        </div>*/}
                            {/*      </div>*/}
                            {/*    ))}*/}
                            {/*  </div>*/}
                            {/*</div>*/}

                            <div className="modal-body">

                                <div className="container-fluid work-time-container col-12 col-md-12">
                                    <h2 className="work-time-title">{t('????????????')}</h2>
                                    <div className="check-box repeat">
                                        <div className="form-check-inline">
                                            <input type="radio" className="form-check-input" name="radio33"
                                                   id="radio100" checked={period === 0} onChange={() => {
                                                this.setState({period: 0, dateTo: this.state.initialDateTo});
                                            }}/>
                                            <label className="form-check-label"
                                                   htmlFor="radio100">{t('??????????????')}</label>
                                        </div>
                                        <div className="form-check-inline">
                                            <input type="radio" className="form-check-input" name="radio33"
                                                   id="radio101" checked={period === 7} onChange={() => {
                                                this.setState({period: 7});
                                            }}/>
                                            <label className="form-check-label"
                                                   htmlFor="radio101">{t('?????????????????? ???????????? ????????????')}</label>
                                        </div>
                                        <div className="form-check-inline">
                                            <input type="radio" className="form-check-input" name="radio33"
                                                   id="radio106" checked={period === 2} onChange={() => {
                                                this.setState({
                                                    period: 2,
                                                    days: [moment(this.props.date, 'DD/MM/YYYY').day()]
                                                });
                                            }}
                                            />
                                            <label className="form-check-label"
                                                   htmlFor="radio106">{t('1 ?????????? 1')}</label>
                                            <Hint
                                                hintMessage={
                                                    t('?????????????? ?? ???????????????????? ??????')
                                                }
                                            />

                                        </div>
                                        <div className="form-check-inline">
                                            <input type="radio" className="form-check-input" name="radio33"
                                                   id="radio105" checked={period === 4} onChange={() => {
                                                this.setState({
                                                    period: 4,
                                                    days: [moment(this.props.date, 'DD/MM/YYYY').day()]
                                                });
                                            }}/>
                                            <label className="form-check-label"
                                                   htmlFor="radio105">{t('2 ?????????? 2')}</label>
                                            <Hint
                                                hintMessage={
                                                    t('?????????????? ?? ???????????????????? ??????')
                                                }
                                            />
                                        </div>
                                        
                                    </div>

                                    {!!period && <>
                                        <div className="picker-title">{t("????????, ???? ?????????????? ?????????????????? ????????????????????")}</div>
                                        <div className="picker">
                                        <DatePicker
                                            type="day"
                                            language={this.props.i18n.language}
                                            selectedDay={this.state.dateTo}
                                            handleDayClick={(day, modifiers) => {
                                                this.setState({ dateTo: day })}}
                                            disabled={!period}
                                            dayPickerProps={{
                                            disabledDays: [
                                                {
                                                    before: this.state.initialDateTo,
                                                },
                                            ],
                                            }}
                                    />
                                    <Hint
                                                hintMessage={
                                                    t('???????????????? ????????, ???? ?????????????? ???????????????????? ????????????????????')
                                                }
                                            /></div></>}
                                    <div className="inline-group d-flex">
                                        <div className="days">
                                            <h2 className="work-time-title">{t('?????? ????????????')}</h2>

                                            <div className="days-of-week flex-column d-flex">
                                                {weekDays.map(({ name, key, isWeekend }) => {
                                                    return (
                                                        <div className={`justify-content-end check-box ${isWeekend ? 'weekend-name' : ''} `}>
                                                            <label>
                                                                {t(name)}
                                                                <input className="form-check-input" type="checkbox"
                                                                       checked={this.state.days.includes(key)}
                                                                       onChange={() => this.toggleDays(key)}
                                                                />
                                                                <span className="check-box-circle"/>
                                                            </label>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="gap w-100">
                                            <h2 className="work-time-title">{t('????????????????')}</h2>
                                            {this.state.countTimes.map((item, key) => {
                                                return (
                                                    <div
                                                        className="gap-item d-flex align-items-center justify-content-between">
                                                        <div className="time-pickers d-flex align-items-center">
                                                            <div className="gap-item-timepicker">
                                                                <p>{t('????????????')}</p>
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
                                                                <p>{t('??????????')}</p>
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
                                                        }} className="delete-gap">{t('?????????????? ????????????????')}</a>

                                                    </div>

                                                );
                                            })}
                                            {this.state.countTimes.length < 5 &&
                                            <a onClick={this.onAddTime}
                                               className="add-work-time">{t('???????????????? ???????????????? +')}</a>}
                                        </div>
                                    </div>
                                    <div className="button-container text-center text-md-right">
                                        {adding &&
                                        <div>
                                            <img style={{width: '57px'}}
                                                 src="data:image/gif;base64,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06pdy7at27dw/+PKnUu3rt27ePPq3cu3r9+/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPoEOLHk26tOnTqFOrXs26tevXsGPLnk27tu3buHPr3s27t+/fwIMLH068uPHjyJMrX868ufPn0KNLn069uvXr2LNr3869u/fv4MOLH0++vPnz6NOrX8++vfv38OPLn0+/vv37+PPr38+/v///AAYo4IAEFmjggQgmqOCCDDbo4IMQRijhhBRWaOGFGGao4YYcdujhhyCGKOKIJJZo4okopqjiiiy26OKLMMYo44w01mjjjTjmqOOOPPbo449ABinkkEQWaeSRSCap5P+STDbp5JNQRinllFRWaeWVWGap5ZZcdunll2CGKeaYZJZp5plopqnmmmy26eabcMYp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6quwxirrrLTWauutuOaq66689urrr8AGK+ywxBZr7LHIJqvsssw26+yz0EYr7bTUVmvttdhmq+223Hbr7bfghivuuOSWa+656Kar7rrstuvuu/DGK++89NZr77345qvvvvz26++/AAcs8MCN2QDDACqwQEINJgABABAm1EACCyoMAIP/Dfd8AEEABYwggAERbGDEBhEYIMAIBQQAwQcZb9zxxyGPXPLJKa9sj8YcewyyyCSbjLLKLN/sss4x90wz0GLNQEMQKegAwNNQRy310zqkEAQNM7zDgQYUVICBEWCHLfbYYGNQAQUacKA1116T7bbYZqOtdjtbd/3122/HnfbaduOd99l7b1XAEC1MbfjhUbcwRAHrMJDAAX5HLvYBCTDQ+OOSZ0655ek4DnnmkW9++eeg4y26VTcIgQLirLcOAApC3FDOBCFkUPrtGYQwwey131567ruPQ7vtvmcOPO/EFx/58VG9IMMKrkfP+goyvBAOCB0soPztC3QAwvXZb196//fff4O99uJnTj746Kcf+fpOEXCC9PSzfgIB33hAgPu3E+BB/vvjH+j85w39CXCA/ytgAA8YOQIuJQc+qJ8EWeeDHGxDBA5g4O0cIIILZlCDoOOgNjAIwhB2cIQfLGHkRIiUAcRggjA8XAwGkI0ASECFoJNAAGp4QxxK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3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAwocSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkypdyrSp06dQo0qdSrWq1atYs2rdyrWr169gw4odS7as2bNo06pdy7at27dw/+PKnUu3rt27ePPq3cu3r9+/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPoEOLHk26tOnTqFOrXs26tevXsGPLnk27tu3buHPr3s27t+/fwIMLH068uPHjyJMrX868ufPn0KNLn069uvXr2LNr3869u/fv4MOLH0++vPnz6NOrX8++vfv38OPLn0+/vv37+PPr38+/v///AAYo4IAEFmjggQgmqOCCDDbo4IMQRijhhBRWaOGFGGao4YYcdujhhyCGKOKIJJZo4okopqjiiiy26OKLMMYo44w01mjjjTjmqOOOPPbo449ABinkkEQWaeSRSCap5P+STDbp5JNQRinllFRWaeWVWGap5ZZcdunll2CGKeaYZJZp5plopqnmmmy26eabcMYp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6quwxirrrLTWauutuOaq66689urrr8AGK+ywxBZr7LHIJqvsssw26+yz0EYr7bTUVmvttdhmq+223Hbr7bfghivuuOSWa+656Kar7rrstuvuu/DGK++89NZr77345qvvvvz26++/AAcs8MAXfgBBAAWMIIABEWxgxAYRGCDACAUEAMH/B/cYjLDCDDsMscQUW4zxOjbAMIAKLJBQgwlAAACECTWQwIIKA8BgA6AcaEBBBRgY4fPPQAftMwYVUKABB+/kvHPPQjf9M9FGIz3ODDQEkYIOAGSt9dZcZ61DCkHQMIOeDCRwgNNoO31AAgysU/bZacf989ptf1PAEC10rffeW7cwRAF1ThBCBnIXLnQGIUxQjuCEG+64EYgrns0NQqDA9+WYA4CCEDfACUIHCzwuus8LdABCOJ+HPvrjpZ9ezQsyrJD57JevIMMLbXpAwOq8E+DBN7rzvrrv1BBwAu3IX34C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WI3WeI3YmI3auI3c2I3e+I3gGI7iOHmO5FiO5niO6JiO6riO7NiO7viO8BiP8jiP9FiP9niP+JiP+riP/NiP/viPABmQAjmQBFmQBnmQCJmQCrmQDNmQDvmQEBmREjmRFFmRFnmRGJmRGrmRHNmRHvmRIBmSIjmSJFmSJnmSKJmSKrmSLNmSLvmSMBmT8BAIACH5BAUUAEcALAAAAAAgA1gCAAf/gEeCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAwocSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkypdyrSp06dQo0qdSrWq1atYs2rdyrWr169gw4odS7as2bNo06pdy7at27dw/+PKnUu3rt27ePPq3cu3r9+/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPoEOLHk26tOnTqFOrXs26tevXsGPLnk27tu3buHPr3s27t+/fwIMLH068uPHjyJMrX868ufPn0KNLn069uvXr2LNr3869u/fv4MOLH0++vPnz6NOrX8++vfv38OPLn0+/vv37+PPr38+/v///AAYo4IAEFmjggQgmqOCCDDbo4IMQRijhhBRWaOGFGGao4YYcdujhhyCGKOKIJJZo4okopqjiiiy26OKLMMYo44w01mjjjTjmqOOOPPbo449ABinkkEQWaeSRSCap5P+STDbp5JNQRinllFRWaeWVWGap5ZZcdunll2CGKeaYZJZp5plopqnmmmy26eabcMYp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6quwxirrrLTWauutuOaq66689urrr8AGK+ywxBZr7LHIJqvsssw26+yz0EYr7bTUVmvttdhmq+223Hbr7bfghivuuOSWa+656Kar7rrstuvuu/DGK++89NZr77345qvvvvz2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"/>
                                        </div>
                                        }
                                        {status === 200 &&
                                        <p className="alert-success text-left p-1 rounded pl-3 mb-2">{t("??????????????????")}</p>
                                        }
                                        <button onClick={this.props.onClose} className="cancel">{t('????????????????')}</button>
                                        <button
                                            disabled={this.state.selectedStaffs.length < 1 || (this.state.countTimes.length !== this.state.times.length) || this.state.times.some((item) => !item.startTimeMillis || !item.endTimeMillis)}
                                            onClick={this.onSaveTime}
                                            className={'button ml-auto' + (this.state.selectedStaffs.length < 1 || (this.state.countTimes.length !== this.state.times.length) || this.state.times.some((item) => !item.startTimeMillis || !item.endTimeMillis) ? ' disabledField' : '')}
                                            type="button"
                                            data-dismiss="modal">{t('??????????????????')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*{isOpenMobileSelectStaff &&*/}
                        {/*<div className="mobile-select-staff-modal_wrapper">*/}
                        {/*  <div className="mobile-select-staff-modal">*/}
                        {/*    <div className="modal-header">*/}
                        {/*      <h4 className="modal-title">?????????? ????????????????????</h4>*/}
                        {/*      <button onClick={() => {*/}
                        {/*        this.setState({ isOpenMobileSelectStaff: false });*/}
                        {/*      }} className="close"></button>*/}
                        {/*    </div>*/}
                        {/*    <div className="choose-staff-container">*/}
                        {/*      <div className="staff-container-header d-flex justify-content-between align-items-center">*/}
                        {/*        <a onClick={this.selectAllStaffs}*/}
                        {/*           className={'check-all' + (this.props.edit ? ' disabledField' : '')}>??????????????*/}
                        {/*          ????????</a>*/}
                        {/*        <a onClick={this.clearSelectedStaffs}*/}
                        {/*           className={'clear-all' + (this.props.edit ? ' disabledField' : '')}>????????????????</a>*/}
                        {/*      </div>*/}

                        {/*      <div className="staffs-list">*/}
                        {/*        {staffs && staffs.map((item) => (*/}
                        {/*          <div className="staff-container-item d-flex justify-content-between align-items-center">*/}
                        {/*            <div className="user-credit d-flex align-items-center">*/}
                        {/*              <img className="staff-image"*/}
                        {/*                   src={item.image ? 'data:image/png;base64,' + item.image : `${process.env.CONTEXT}public/img/avatar.svg`}*/}
                        {/*                   alt=""/>*/}
                        {/*              <p className="staff-name mb-0">{item.name} {item.surname}</p>*/}
                        {/*            </div>*/}
                        {/*            <div className="col-1 justify-content-end check-box">*/}
                        {/*              <label>*/}
                        {/*                <input disabled={this.props.edit}*/}
                        {/*                       className={'form-check-input' + (this.props.edit ? ' disabledField' : '')}*/}
                        {/*                       type="checkbox"*/}
                        {/*                       checked={this.state.selectedStaffs.includes(item.staffId)}*/}
                        {/*                       onChange={() => this.toggleSelectStaff(item.staffId)}*/}
                        {/*                />*/}
                        {/*                <span className="check-box-circle"></span>*/}
                        {/*              </label>*/}
                        {/*            </div>*/}
                        {/*          </div>*/}
                        {/*        ))}*/}
                        {/*      </div>*/}
                        {/*    </div>*/}

                        {/*  </div>*/}
                        {/*</div>*/}
                        {/*}*/}

                    </div>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    const {staff} = state;
    return {
        staff,
    };
};

export default connect(mapStateToProps)(WorkTimeModal);
