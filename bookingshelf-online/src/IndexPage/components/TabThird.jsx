import React, { PureComponent } from 'react';
import moment from 'moment'
import DayPicker from "react-day-picker";
import MomentLocaleUtils from 'react-day-picker/moment';
import { withTranslation } from "react-i18next";
import arrow_down from "../../../public/img/icons/arrow_down_white.svg";
import MediaQuery from 'react-responsive'
import { culcDay } from "../../_helpers/data-calc"

class TabThird extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            openList: false,
        }
    }

    componentDidMount() {
        if (this.props.isStartMovingVisit) {
            this.props.refreshTimetable()
        }
    }

    render() {

        const { setScreen, setDefaultFlag, refreshTimetable, isStartMovingVisit, selectedDay, selectedStaff, selectedServices, getDurationForCurrentStaff, selectedService, disabledDays, month, handleDayClick, showPrevWeek, showNextWeek, t } = this.props;
        const { openList } = this.state;

        const desctop = 710;
        const mob = 709;
        const currentDay = culcDay(selectedDay, "desctop");
        const currentDayMob = culcDay(selectedDay, "mob");
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
            let margin_right2 = "53px";
            let margin_right1 = "25px";
            let sizeWords = "36px";
            const priceFrom100 = priceFrom / 100;
            const priceTo100 = priceTo / 100;
            const priceFrom1000 = priceFrom / 1000;
            const priceTo1000 = priceTo / 1000;

            if (priceFrom1000 > 1 || priceTo1000 > 1) {
                sizeWords = "24px"
                margin_right1 = "0px";
                margin_right2 = "0px";
            }
            else if (priceFrom100 > 1 || priceTo100 > 1) {
                sizeWords = "32px"
                margin_right1 = "0px";
                margin_right2 = "0px";
            }
            serviceInfo = (
                <div>
                    <MediaQuery maxWidth={mob}>
                        <div className="specialist">
                            <div className="specialist-block">

                                <div className="supperVisDet service_footer-block">

                                    <div className="service_footer_price">
                                        <p className="time_footer_p">{priceFrom}{priceFrom !== priceTo && " - " + priceTo}&nbsp;</p>
                                        <span>{selectedServices[0] && selectedServices[0].currency}</span>
                                    </div>
                                    <div className="time-footer hover" style={{
                                        // marginRight: `${margin_right}`
                                    }}>
                                        <p className="time_footer_p" onClick={event => this.setState({
                                            openList: !openList,
                                        })}>{t("Услуги")}: {selectedServices.length}
                                            <img style={{
                                                marginLeft: "7px",
                                                marginTop: "0px"
                                            }} src={arrow_down} className={openList ? "" : "arrow_rotate"} alt="arrou"></img></p>
                                    </div>
                                    <div className="time-footer">
                                        <p className="time_footer_p" >{t("Дата")}:</p>
                                        <p className="time_footer_p" >&nbsp;{t(`${currentDayMob}`)}</p>
                                    </div>
                                </div >
                                {openList && (
                                    <div className="service_list_block">
                                        <div className="setvice_list_items">
                                            {selectedServices.map((element, index) =>
                                                <div key={index} className="setvice_list_item">
                                                    <div className="cansel_btn_small"> </div>
                                                    <p>{element.name}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {!!selectedServices.length && <button disabled={!selectedDay} className={!selectedDay ? "next_block disabledField" : "next_block"} onClick={() => {
                                    if (selectedServices.length) {
                                        setScreen(4);
                                    }
                                    refreshTimetable();
                                }}>
                                    <span className="title_block_text">{t("Продолжить")}</span></button>}
                            </div>
                        </div>
                    </MediaQuery>
                    <MediaQuery minWidth={desctop}>
                        <div className="specialist">
                            <div className="specialist-block">
                                {openList ?
                                    <div className="specialist_big">
                                        <div className="service_list_block">
                                            <div className="setvice_list_items">
                                                <p>{t("Услуги:")}</p>
                                                {selectedServices.map((element) =>
                                                    <div className="setvice_list_item">
                                                        <div className="cansel_btn_small"> </div>
                                                        <p>{element.name}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="cansel_btn_big" onClick={event => this.setState({
                                                openList: !openList,
                                            })}> </div>
                                        </div>
                                    </div>
                                    :
                                    <div className="supperVisDet service_footer-block">

                                        <div className="service_footer_price">
                                            <p style={{
                                                color: 'white',
                                                fontSize: `${sizeWords}`,
                                                lineHeight: "49px",
                                            }}>{priceFrom}{priceFrom !== priceTo && " - " + priceTo}&nbsp;</p>
                                            <span>{selectedServices[0] && selectedServices[0].currency}</span>
                                        </div>
                                        <div className="time-footer hover" style={{
                                            marginRight: `${margin_right1}`
                                        }}>
                                            <p className="time-footer_desctop_p" onClick={event => this.setState({
                                                openList: !openList,
                                            })}>{t("Выбрано услуг")}: {selectedServices.length} <img src={arrow_down} className="arrow_rotate" alt="arrou"></img></p>

                                            <p className="service_footer_price_small_text" >{t("Длительность")}: {moment.duration(parseInt(duration), "seconds").format(`h[ ${t("ч")}] m[ ${t("минут")}]`)}
                                            </p>
                                        </div>
                                        <div className="time-footer" style={{
                                            marginRight: `${margin_right2}`
                                        }}>
                                            <p className="time-footer_desctop_p" >{t("Дата")}:</p>
                                            <p className="service_footer_price_small_text" >{t(`${currentDay}`)}</p>
                                        </div>
                                        {!!selectedServices.length && <button disabled={!selectedDay} className={!selectedDay ? "next_block disabledField" : "next_block"} onClick={() => {
                                            if (selectedServices.length) {
                                                setScreen(4);
                                            }
                                            refreshTimetable();
                                        }}>
                                            <span className="title_block_text">{t("Продолжить")}</span></button>}
                                    </div >
                                }
                            </div>
                        </div>
                    </MediaQuery>
                </div>
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
                {serviceInfo}
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
