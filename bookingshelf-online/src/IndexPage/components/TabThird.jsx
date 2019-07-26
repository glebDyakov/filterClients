import React, {PureComponent} from 'react';
import moment from 'moment'
import DayPicker from "react-day-picker";
import MomentLocaleUtils from 'react-day-picker/moment';


class TabThird extends  PureComponent {

    render() {

        const {setScreen,refreshTimetable,selectedDay,selectedStaff,selectedServices, selectedService,disabledDays,month, handleDayClick, showPrevWeek, showNextWeek } = this.props;


        return (
            <div className="service_selection screen1">
                <div className="title_block">
                            <span className="prev_block" onClick={()=>{
                                setScreen(2);
                                refreshTimetable()}}>
                                Назад</span>
                    <p className="modal_title">Выбор даты</p>
                    {selectedDay && <span className="next_block" onClick={()=>{
                        setScreen(4);
                        refreshTimetable()
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
                        {/*<p>Стоимость<br/><strong>{this.state.allPriceFrom?this.state.allPriceFrom+'-'+this.state.allPriceTo: '0'}</strong></p>*/}
                    </div>
                    }

                </div>
                <div className="calendar_modal">
                    {parseInt(moment(month).utc().format('x'))>parseInt(moment().utc().format('x')) && <span className="arrow-left" onClick={showPrevWeek}/>}
                    <span className="arrow-right" onClick={showNextWeek}/>

                    <DayPicker
                        selectedDays={selectedDay}
                        disabledDays={disabledDays}
                        month={new Date(moment(month).format( 'YYYY-MM-DD HH:mm:ss' ))}
                        onDayClick={handleDayClick}
                        localeUtils={MomentLocaleUtils}
                        locale={'ru'}

                    />
                    <p>
                        <span className="dark_blue_text"><span className="round"></span>Запись есть</span>
                        <span className="gray_text"><span className="round"></span>Записи нет</span>
                    </p>
                    <span className="clear"></span>


                </div>
            </div>
        );
    }
}
export default TabThird;