import React, { PureComponent } from 'react';
import moment from 'moment'
import DayPicker from "react-day-picker";
import MomentLocaleUtils from 'react-day-picker/moment';
import { withTranslation } from "react-i18next";
import MediaQuery from 'react-responsive'
import { culcDay } from "../../_helpers/data-calc"
import { imgSvg } from "../../_helpers/svg"
class TabThird extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            openList: false,
        }
        this.openListFunc = this.openListFunc.bind(this);
    }
    openListFunc() {
        this.setState({
            openList: !this.state.openList,
        })
    }
    componentDidMount() {
        if (this.props.isStartMovingVisit) {
            this.props.refreshTimetable()
        }
    }

    render() {

        const { setScreen, setDefaultFlag, refreshTimetable, isStartMovingVisit, selectedDay, selectedStaff, selectedServices, getDurationForCurrentStaff, selectedService, disabledDays, month, handleDayClick, showPrevWeek, showNextWeek, t } = this.props;
        const { openList } = this.state;


        let currentDay = culcDay(selectedDay, "desctop");

        const desctop = 600;
        const mob = 599;

        let serviceInfo = null
        if (selectedService.serviceId) {
            let priceFrom = 0;
            let priceTo = 0;
            let duration = 0;
            selectedServices.forEach((service) => {
                priceFrom += Number(service.priceFrom)
                priceTo += Number(service.priceTo)
                duration += Number(getDurationForCurrentStaff(service))
            })
            let margin_right2 = "53px";
            let margin_right1 = "25px";
            let sizeWords = "28px";
            const priceFrom100 = priceFrom / 100;
            const priceTo100 = priceTo / 100;
            const priceFrom1000 = priceFrom / 1000;
            const priceTo1000 = priceTo / 1000;

            if (priceFrom1000 > 1 || priceTo1000 > 1) {
                sizeWords = "22px"
                margin_right1 = "0px";
                margin_right2 = "0px";
            }
            else if (priceFrom100 > 1 || priceTo100 > 1) {
                sizeWords = "25px"
                margin_right1 = "0px";
                margin_right2 = "0px";
            }
            serviceInfo = (
                <div>
                    <MediaQuery maxWidth={mob}>
                        <div className="specialist" onClick={event => this.openListFunc()}>
                            <div className="specialist-block">
                            {imgSvg}
                                <div className="supperVisDet service_footer-block">

                                    <div className="service_footer_price">
                                        {priceFrom === priceTo
                                            ? (<React.Fragment>
                                                <div className="price_footer_service_item">
                                                    <div className="price_footer_service_half">
                                                        <p>{priceFrom}</p>
                                                        <span >{selectedServices[0] && selectedServices[0].currency}</span>
                                                    </div>
                                                </div>
                                            </React.Fragment>)
                                            : (<React.Fragment>
                                                <div className="price_footer_service_item">
                                                    <div className="price_footer_service_half">
                                                        <p><p>{t("от")}</p>{priceFrom}</p>
                                                        <span >{selectedServices[0] && selectedServices[0].currency}</span>
                                                    </div>
                                                </div>
                                                <div className="price_footer_service_item">
                                                    <div className="price_footer_service_half">
                                                        <p><p>{t("до")}</p>{priceTo} </p>
                                                        <span >{selectedServices[0] && selectedServices[0].currency}</span>
                                                    </div>
                                                </div>
                                            </React.Fragment>)
                                        }

                                       
                                    </div>
                                    <div className="time-footer hover" style={{
                                        // marginRight: `${margin_right}`
                                    }}>
                                        <p className="time_footer_p" onClick={event => this.setState({
                                            openList: !openList,
                                        })}>{t("Услуги")}: {selectedServices.length}
                                        </p>
                                        <p className="service_footer_price_small_text" >{t("Длительность")}: {moment.duration(parseInt(duration), "seconds").format(`h[ ${t("ч")}] m[ ${t("минут")}]`)}
                                        </p>

                                    </div>
                                    <div className="time-footer">
                                        <p className="time_footer_p" >{t("Дата")}:</p>
                                        <p className="time_footer_p" >{t(`${currentDay}`)}</p>
                                    </div>
                                </div >
                                {openList && (
                                    <div className="service_list_block">
                                        <div className="setvice_list_items">
                                            {selectedServices.map((element, index) =>
                                                <div key={index} className="setvice_list_item">
                                                    <div className="service_circle">
                                                        <div className="service_circle_center"></div>
                                                    </div>
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
                        <div className="specialist" onClick={event => this.openListFunc()}>

                            <div className="specialist-block">
                                {imgSvg}
                                {openList ?
                                    <div className="specialist_big">
                                        <div className="service_list_block">
                                            <div className="setvice_list_items">
                                                <p className="text_underline">{selectedStaff.firstName} {selectedStaff.lastName ? selectedStaff.lastName : ''}</p>
                                                <p>{t("Услуги")}:</p>
                                                {selectedServices.map((element,index) =>
                                                    <div key={index} className="setvice_list_item">
                                                        <div className="service_circle">
                                                            <div className="service_circle_center"></div>
                                                        </div>
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
                                            })}>{t("Выбрано услуг")}: {selectedServices.length} </p>

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
