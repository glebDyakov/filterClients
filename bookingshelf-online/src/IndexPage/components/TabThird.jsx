import React, {PureComponent} from 'react';
import moment from 'moment'
import DayPicker from "react-day-picker";
import MomentLocaleUtils from 'react-day-picker/moment';


class TabThird extends  PureComponent {

    componentDidMount() {
        if (this.props.isStartMovingVisit) {
            this.props.refreshTimetable()
        }
    }

    render() {

        const {setScreen,refreshTimetable, isStartMovingVisit, selectedDay,selectedStaff,selectedServices, selectedService,disabledDays,month, handleDayClick, showPrevWeek, showNextWeek } = this.props;


        let serviceInfo = null
        if (selectedService.serviceId) {
            let priceFrom = 0;
            let priceTo= 0;
            let duration = 0;
            selectedServices.forEach((service) => {
                priceFrom += parseInt(service.priceFrom)
                priceTo += parseInt(service.priceTo)
                duration += parseInt(service.duration)
            })

            serviceInfo = (
                <div style={{ display: 'inline-block' }} className="supperVisDet service_item">
                    {(selectedServices.length===1)?<p>{selectedServices[0].name}</p>:
                        (<p>Выбрано услуг: <strong className="service_item_price">{selectedServices.length}</strong></p>)}
                    <p className={selectedServices.some((service) => service.priceFrom!==service.priceTo) && 'sow'}><strong className="service_item_price">{priceFrom}{priceFrom!==priceTo && " - "+priceTo}&nbsp;</strong> <span>{selectedServices[0] && selectedServices[0].currency}</span></p>
                    <span style={{ width: '100%' }} className="runtime">
                        <strong>{moment.duration(parseInt(duration), "seconds").format("h[ ч] m[ мин]")}</strong>
                    </span>
                    <div className="supperVisDet_info">
                        <p className="supperVisDet_info_title">Список услуг:</p>
                        {selectedServices.map(service => (
                            <p>• {service.name}</p>
                        ))}
                        <span className="supperVisDet_closer" />
                    </div>
                    <img className="tap-service-icon" src={`${process.env.CONTEXT}public/img/tap-service.svg`}/>
                </div>
            )
        }
        return (
            <div className="service_selection screen1">
                <div className="title_block">
                            <span className="prev_block" onClick={()=>{
                                setScreen(isStartMovingVisit ? 1 : 2);
                                //if (!isStartMovingVisit) {
                                    refreshTimetable()
                                //}
                            }
                            }>
                                Назад</span>
                    <p className="modal_title">Выбор даты</p>
                    {selectedDay && <span className="next_block" onClick={()=>{
                        setScreen(4);
                        //if (!isStartMovingVisit) {
                            refreshTimetable()
                        //}
                    }}>Далее</span>}
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
                    {serviceInfo && serviceInfo}

                </div>
                <div className="calendar_modal">
                    {parseInt(moment(month).utc().format('x'))>parseInt(moment().utc().format('x')) && <span className="arrow-left" onClick={showPrevWeek}/>}
                    <span className="arrow-right" onClick={showNextWeek}/>

                    <DayPicker
                        selectedDays={selectedDay}
                        disabledDays={disabledDays}
                        month={new Date(moment(month).format( 'YYYY-MM' ))}
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