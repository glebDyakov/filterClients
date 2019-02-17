import React from 'react';
import { connect } from 'react-redux';
import TimePicker from 'rc-time-picker';

import 'rc-time-picker/assets/index.css'
import moment from "moment";
import PropTypes from "prop-types";

class AddWorkTime extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            countTimes: props.editing_object && props.editing_object.length>0?props.editing_object:[1],
            staff: props.currentStaff,
            times: props.editing_object?props.editing_object:[],
            repeat: 'ONCE',
            allTimes:{}
        };

        this.onChangeTime=this.onChangeTime.bind(this);
        this.onSaveTime=this.onSaveTime.bind(this);
        this.onAddTime=this.onAddTime.bind(this);
        this.onDelete=this.onDelete.bind(this);
        this.disabledHours=this.disabledHours.bind(this);
        this.disabledMinutes=this.disabledMinutes.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if ( JSON.stringify(this.props) !==  JSON.stringify(newProps)) {
            this.setState({...this.state, staff: newProps.currentStaff, date: newProps.date, editWorkingHours: newProps.editWorkingHours,

                editing_object: newProps.editing_object, times: newProps.editing_object?newProps.editing_object:[{}], countTimes: newProps.editing_object?newProps.editing_object:[1], repeat:newProps.editing_object?newProps.editing_object[0].repeat:'ONCE' })

        }
    }

    disabledHours(num, key, str) {
        const {times}=this.state

        let hoursArray=[];
        // let workStartMilis=parseInt(moment(JSON.parse(localStorage.getItem('user')).companyTimetables[num].startTimeMillis, 'x').format('H'));
        // let workEndMilis=parseInt(moment(JSON.parse(localStorage.getItem('user')).companyTimetables[num].endTimeMillis, 'x').format('H'));
        let workStartMilis=0;
        let workEndMilis=23;
        for(let i=0; i<=23; i++){
            if(i<workStartMilis || workEndMilis<i){
                hoursArray.push(i);
            }

            if(str==='end' && times[key] && times[key].startTimeMillis && i<=moment(times[key].startTimeMillis, 'x').format('H')){
                hoursArray.push(i);
            }

            if(str==='start' && times[key] && times[key].startTimeMillis && i>=moment(times[key].endTimeMillis, 'x').format('H')){
                hoursArray.push(i);
            }


        }


        times && times.map((time, keyTime) => {
            let timeEnd=parseInt(moment(time.endTimeMillis, 'x').format('k'))
            let timeStart=parseInt(moment(time.startTimeMillis, 'x').format('k'))

            if(time.startTimeMillis && keyTime!==key)
            {

                if(times[key] && times[key].startTimeMillis && parseInt(moment(times[key].startTimeMillis, 'x').format('k'))<parseInt(moment(time.startTimeMillis, 'x').format('k'))){
                    timeEnd=24
                }

                if(times[key] && times[key].endTimeMillis && parseInt(moment(times[key].endTimeMillis, 'x').format('k'))>parseInt(moment(time.endTimeMillis, 'x').format('k'))){
                    timeStart=0
                }

                for (let iTime = timeStart; iTime <= timeEnd; iTime++) {
                    hoursArray.push(iTime);
                }
            }
        })

        return hoursArray;
    }

    disabledMinutes(h) {
        const {countTimes, staff, repeat, date, editWorkingHours, editing_object, times}=this.state;

        let num=parseInt(moment(date, 'DD/M').zone("+0800").isoWeekday())-1
        let minutesArray=[];

        let workEndMilisH=23;
        let workEndMilisM=45;
        // let workEndMilisH=parseInt(moment(JSON.parse(localStorage.getItem('user')).companyTimetables[num].endTimeMillis, 'x').format('H'));
        // let workEndMilisM=parseInt(moment(JSON.parse(localStorage.getItem('user')).companyTimetables[num].endTimeMillis, 'x').format('mm'));
        if(h === workEndMilisH) {
            if (workEndMilisM == '00') {
                minutesArray.push(15, 30, 45)
            }

            if (workEndMilisM === 15) {
                minutesArray.push(30, 45)
            }

            if (workEndMilisM === 30) {
                minutesArray.push(45)
            }
        }
        return minutesArray;
    }


    render() {

        const {countTimes, staff, repeat, date, editWorkingHours, editing_object, times}=this.state;

        return (
            <div className="modal fade modal_dates">
                <div className="modal-dialog modal-edit-work-time modal-dialog-centered">
                    <div className="modal-content">
                        <div className="form-group">
                            <div className="modal-header">
                                <p>{!editWorkingHours ? 'Добавить часы работы': 'Изменить рабочие часы'}</p>
                                <span>{staff && staff.firstName} {staff && staff.lastName}</span>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="form-group mr-3 ml-3">
                                <div className="check-box">
                                    <p>Повтор</p>
                                    <div className="form-check-inline">
                                        <input type="radio" className="form-check-input" name="radio22" id="radio100" checked={repeat==='ONCE'}
                                               onChange={() => this.setState({...this.state, repeat: 'ONCE' })}/>
                                        <label className="form-check-label" htmlFor="radio100">Разовый</label>
                                    </div>
                                    <div className="form-check-inline">
                                        <input type="radio" className="form-check-input" name="radio22" id="radio101" checked={repeat==='WEEKLY'}
                                               onChange={() => this.setState({...this.state, repeat: 'WEEKLY' })}/>
                                        <label className="form-check-label" htmlFor="radio101">Повторять каждую
                                            неделю</label>
                                    </div>
                                </div>
                                {countTimes && countTimes.map((item, key) =>
                                    <div key={key} className="border-bottom m-b-5">
                                        <p>Начало</p>
                                        <TimePicker
                                            id={"startTimeMillis" + key}
                                            key={"startTimeMillis" + key}
                                            value={item!=1 ? moment(parseInt(item.startTimeMillis), 'x'):times[key]&&times[key].startTimeMillis?moment(times[key].startTimeMillis, 'x'):''}
                                            className="col-md-12 p-0"
                                            minuteStep={15}
                                            hideDisabledOptions={true}
                                            disabledHours={()=>this.disabledHours(parseInt(moment(date, 'DD/M').zone("+0800").isoWeekday())-1, key, 'start')}
                                            showSecond={false}
                                            disabledMinutes={this.disabledMinutes}
                                            onChange={(startTimeMillis) => this.onChangeTime('startTimeMillis', key, moment(startTimeMillis).format('x'))}
                                        />
                                        <p>Конец</p>
                                        <TimePicker
                                            id={"endTimeMillis" + key}
                                            value={item!=1 ? item.endTimeMillis ? moment(parseInt(item.endTimeMillis), 'x'): '' :times[key]&&times[key].endTimeMillis?moment(times[key].endTimeMillis, 'x'):''}
                                            key={"endTimeMillis" + key}
                                            disabledHours={()=>this.disabledHours(parseInt(moment(date, 'DD/M').zone("+0800").isoWeekday())-1, key, 'end')}
                                            hideDisabledOptions={true}
                                            minuteStep={15}
                                            className="col-md-12 p-0"
                                            showSecond={false}
                                            disabledMinutes={this.disabledMinutes}
                                            onChange={(endTimeMillis) => this.onChangeTime('endTimeMillis', key, moment(endTimeMillis).format('x'))}
                                        />
                                    </div>
                                )}
                                {countTimes.length<=5 && <a className="add-work-time" onClick={() => this.onAddTime()}>+
                                    Добавить часы работы</a>
                                }
                                <div className="buttons">
                                    {editWorkingHours && <button className="small-button red-button" type="button" onClick={() => this.onDelete(moment(date, 'DD/MM').startOf('day').format('x'), moment(date, 'DD/MM').endOf('day').format('x'))} data-dismiss="modal">Удалить</button>}
                                    <button className="small-button gray-button" type="button" data-dismiss="modal">Отменить</button>
                                    <button className="small-button" type="button"
                                            onClick={() => this.onSaveTime()}  data-dismiss="modal">Сохранить
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        );
    }

    onAddTime(){
        const {countTimes} = this.state;

        let arrayCounts=countTimes;

        arrayCounts.push(1);
        this.setState({countTimes:arrayCounts});
    }

    onChangeTime(field, key, time) {
        const {times, repeat, staff, date} = this.state;
        this.setState({times:Object.assign(times,{[key]: {...times[key], [field]: moment(date +' '+moment(time, 'x').format('HH:mm'), 'DD/MM HH:mm').format('x')}})});
    }

    onSaveTime() {
        const {addWorkingHours} = this.props;
        const {times, repeat, staff} = this.state;

        let timing=[];
        times&&times.map(time=>timing.push({...time, repeat:repeat}));

        return addWorkingHours(timing, staff.staffId, );
    }
    onDelete(startDay, endOfDay) {
        const {deleteWorkingHours} = this.props;
        const {staff} = this.state;

        return deleteWorkingHours(staff.staffId, startDay, endOfDay);
    }
}

function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert
    };
}

AddWorkTime.propTypes ={
    addWorkingHours: PropTypes.func,
    deleteWorkingHours: PropTypes.func,
    currentStaff: PropTypes.object,
    date: PropTypes.string,
    editWorkingHours: PropTypes.bool,
    editing_object: PropTypes.object

};

const connectedApp = connect(mapStateToProps)(AddWorkTime);
export { connectedApp as AddWorkTime };