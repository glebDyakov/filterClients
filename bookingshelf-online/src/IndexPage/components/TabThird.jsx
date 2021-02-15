import React, { PureComponent } from 'react';
import moment from 'moment'
import DayPicker from "react-day-picker";
import MomentLocaleUtils from 'react-day-picker/moment';
import { withTranslation } from "react-i18next";
import arrow_down from "../../../public/img/icons/arrow_down_white.svg";


class TabThird extends PureComponent {

    componentDidMount() {
        if (this.props.isStartMovingVisit) {
            this.props.refreshTimetable()
        }
    }




    render() {

        const { setScreen, setDefaultFlag, refreshTimetable, isStartMovingVisit, selectedDay, selectedStaff, selectedServices, getDurationForCurrentStaff, selectedService, disabledDays, month, handleDayClick, showPrevWeek, showNextWeek, t } = this.props;


        let serviceInfo = null
        if (selectedService.serviceId) {
            let priceFrom = 0;
            let priceTo = 0;
            let duration = 0;
            selectedServices.forEach((service) => {
                priceFrom += parseInt(service.priceFrom)
                priceTo += parseInt(service.priceTo)
                duration += parseInt(getDurationForCurrentStaff(service))
            })
            let margin_right = "22px";
            let sizeWords = "36px";
            const priceFrom100 = priceFrom / 100;
            const priceTo100 = priceTo / 100;
            const priceFrom1000 = priceFrom / 1000;
            const priceTo1000 = priceTo / 1000;

            if (priceFrom1000 > 1 || priceTo1000 > 1) {
                sizeWords = "24px"
                margin_right = "0px";
            }
            else if (priceFrom100 > 1 || priceTo100 > 1) {
                sizeWords = "32px"
                margin_right = "0px";
            }
            serviceInfo = (
                <div className="supperVisDet service_footer-block">
                    {/* {(selectedServices.length === 1) ?  */}
                    {/* <p style={{ color: 'white' }}>{selectedServices[0].name}</p>  */}
                    {/* : */}
                    {/* <div className={selectedServices.some((service) => service.priceFrom !== service.priceTo) && 'sow service_footer_price'}> */}
                    <div className="service_footer_price">
                        <p style={{
                            color: 'white',
                            fontSize: `${sizeWords}`,
                            lineHeight: "49px",
                        }}>{priceFrom}{priceFrom !== priceTo && " - " + priceTo}&nbsp;</p>
                        <span>{selectedServices[0] && selectedServices[0].currency}</span>
                    </div>
                    <div className="time-footer" style={{
                        marginRight: `${margin_right}`
                    }}>
                        <p style={{
                            color: 'white',
                            fontSize: "13px",
                            lineHeight: "29px",
                            letterSpacing: "0.1px",
                        }}>{t("Выбрано услуг")}: {selectedServices.length} <img src={arrow_down} alt="arrou"></img></p>
                        {/* } */}


                        <p style={{
                            color: 'white',
                            fontSize: "13px",
                            lineHeight: "18px",
                            letterSpacing: "0.1px",
                        }} >{t("Длительность")}: {moment.duration(parseInt(duration), "seconds").format(`h[ ${t("ч")}] m[ ${t("минут")}]`)}
                        </p>
                    </div>
                    <div className="time-footer" style={{
                        marginRight: `${margin_right}`
                    }}>
                        <p style={{
                            color: 'white',
                            fontSize: "13px",
                            lineHeight: "18px",
                            letterSpacing: "0.1px",
                        }} >{t("Дата")}:</p>
                        <p style={{
                            color: 'white',
                            fontSize: "13px",
                            lineHeight: "18px",
                            letterSpacing: "0.1px",
                            opacity: "0",
                        }} >Еще не выбрана</p>
                    </div>
                    {!!selectedServices.length && <button className="next_block" onClick={() => {
                        if (selectedServices.length) {
                            setScreen(3);
                        }
                        refreshTimetable();
                    }}>
                        <span className="title_block_text">{t("Продолжить")}</span></button>}
                </div >
            )
        }
        return (
            <div className="service_selection screen1">
                <div className="title_block data_title">
                    <span className="prev_block" onClick={() => {
                        setScreen(isStartMovingVisit ? 1 : 2);
                        if (isStartMovingVisit) {
                            setDefaultFlag()
                        }
                    }
                    }><span className="title_block_text">{t("Назад")}</span>
                    </span>
                    <p className="modal_title">{t("Выберите дату")}</p>
                </div>
                <div className="specialist">
                    <div className="specialist-block">
                       
                        {serviceInfo && serviceInfo}
                    </div>
                </div>
                <div className="calendar_modal">
                    {parseInt(moment(month).utc().format('x')) > parseInt(moment().utc().format('x')) && <span className="arrow-left" onClick={showPrevWeek} />}
                    <span className="arrow-right" onClick={showNextWeek} />

                    <DayPicker
                        selectedDays={selectedDay}
                        disabledDays={disabledDays}
                        month={new Date(moment(month).format('YYYY-MM'))}
                        onDayClick={handleDayClick}
                        localeUtils={MomentLocaleUtils}
                        locale={this.props.i18n.language.toLowerCase()}

                    />
                    <div className="calendar_mark">
                        <span className="dark_blue_text"><span className="round"></span><p>{t("Запись есть")}</p></span>
                        <span className="gray_text"><span className="round"></span><p>{t("Записи нет")}</p></span>
                    </div>
                    <span className="clear"></span>


                </div>
            </div>
        );
    }
}


export default withTranslation("common")(TabThird)
