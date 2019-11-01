import React, {PureComponent} from 'react';
import moment from 'moment'
import DayPicker from "react-day-picker";

class TabFour extends  PureComponent {

    render() {

        const {selectedTime, setScreen, isStartMovingVisit, refreshTimetable,selectedStaff, selectedService, selectedDay, selectedServices, workingStaff, setTime} = this.props;


        return (
            <div className="service_selection screen1">
                <div className="title_block">
                            <span className="prev_block" onClick={()=> {
                                setScreen(3);
                                //if (!isStartMovingVisit) {
                                    refreshTimetable()
                                //}
                            }}>Назад</span>
                    <p className="modal_title">Выбор времени</p>
                    {selectedTime && !isStartMovingVisit && <span className="next_block" onClick={()=>{
                        setScreen(5);
                        refreshTimetable();
                    }}>Вперед</span>}
                </div>
                <div className="specialist">
                    {selectedStaff.staffId &&
                    <div>
                        <p className="img_container">
                            <img
                                src={selectedStaff.imageBase64 ? "data:image/png;base64," + selectedStaff.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                alt=""/>
                            <span>{selectedStaff.firstName} {selectedStaff.lastName}</span>
                        </p>

                    </div>
                    }
                    {selectedService.serviceId &&
                    <div className="supperVisDet" >
                        {(selectedServices.length===1)?<p>{selectedServices[0].name}</p>:
                            (<p>Выбрано услуг: <br/>
                                <p><strong>{selectedServices.length}</strong></p></p>)}

                    </div>
                    }
                    {selectedDay &&
                    <div className="date_item_popup">
                        <strong>{moment(selectedDay).utc().locale('ru').format('DD MMMM YYYY')}</strong>
                    </div>
                    }
                </div>
                <div className="choise_time">

                    {workingStaff && workingStaff.map((workingStaffElement, i) =>
                        parseInt(moment(workingStaffElement.dayMillis, 'x').startOf('day').format('x'))===parseInt(moment(selectedDay).startOf('day').format('x')) &&
                        workingStaffElement.availableTimes.map((workingTime) => {
                                const countTimes = (workingTime.endTimeMillis - workingTime.startTimeMillis) / 1000 / 60 / 15 + 1;
                                const arrayTimes = []
                                for( let i = 0 ; i< countTimes; i++) {
                                    arrayTimes.push(workingTime.startTimeMillis + (1000 * 60 * 15 * i))
                                }

                                return arrayTimes.map(arrayTime => arrayTime >= parseInt(moment().format("x")) &&
                                    <div key={i} onClick={() => setTime(arrayTime)}>
                                        <span>{moment(arrayTime, 'x').format('HH:mm')}</span>
                                    </div>)
                            }
                        )

                    )
                    }
                </div>
            </div>
        );
    }
}
export default  TabFour;