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
        const imgSvg = (<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/1999/xlink" x="0px" y="0px"
            width="30px" height="30px" viewBox="0 0 100 100" className="img_svg" enableBackground="new 0 0 100 100" xml="preserve" >
            <path fill="#fff" d="M76.482,44.875c-0.407,0-1.44,0.14-2.502,0.47c-0.271-3.613-3.299-6.47-6.98-6.47
       c-1.68,0-3.223,0.594-4.43,1.584c-0.986-2.673-3.56-4.584-6.57-4.584c-1.751,0-3.552,0.536-5,1.572v-7.268
       c4.148-2.306,6.965-6.73,6.965-11.804c0-7.444-6.056-13.5-13.5-13.5s-13.5,6.056-13.5,13.5c0,4.994,2.732,9.354,6.775,11.688
       l0.071,31.554l-5.76-6.045c-1.55-1.551-3.6-2.405-5.772-2.405s-4.223,0.854-5.772,2.405c-3.204,3.203-3.211,8.41-0.072,11.545
       c0.052,0.059,5.269,5.875,12.712,13.318l1.211,1.215c7.058,7.096,13.152,13.225,25.35,13.225c12.629,0,16.854-6.338,20.1-12.83
       c3.122-6.244,3.158-30.156,3.158-31.17C82.965,47.678,79.936,44.875,76.482,44.875z M40.716,19.406c0-2.076,0.985-4.516,3.763-4.516
       c3.268,0,3.521,3.429,3.521,4.484v28c0,0.829,0.672,1.5,1.5,1.5s1.5-0.671,1.5-1.5v-4c0-3.302,2.99-4.5,5-4.5c2.206,0,4,1.794,4,4
       v5.5c0,0.829,0.672,1.5,1.5,1.5s1.5-0.671,1.5-1.5v-2.5c0-2.206,1.794-4,4-4s4,1.794,4,4v6.5c0,0.828,0.672,1.5,1.5,1.5
       s1.5-0.672,1.5-1.5v-3.82c0.6-0.292,1.776-0.681,2.482-0.681c1.79,0,3.482,1.458,3.482,3c0,6.716-0.512,25.168-2.842,29.829
       c-3.056,6.112-6.475,11.172-17.416,11.172c-10.95,0-16.366-5.445-23.223-12.34l-1.217-1.221
       c-7.381-7.381-12.547-13.141-12.655-13.258c-0.981-0.982-1.521-2.289-1.518-3.679c0.004-1.392,0.548-2.7,1.533-3.685
       c0.983-0.984,2.28-1.526,3.651-1.526s2.667,0.542,3.625,1.5l8.33,8.742c0.426,0.446,1.079,0.585,1.645,0.357
       c0.57-0.229,0.942-0.782,0.941-1.396L40.716,19.406z"/>
        </svg >)

        let currentDay = culcDay(selectedDay, "desctop");
        let currentDayMob = culcDay(selectedDay, "mob");

        const desctop = 720;
        const mob = 709;

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
                        <div className="specialist" onClick={event => this.openListFunc()}>
                            <div className="specialist-block">
                                {imgSvg}
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
                                                {selectedServices.map((element) =>
                                                    <div className="setvice_list_item">
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
