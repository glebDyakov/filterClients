import React, { Component } from 'react';
import moment from 'moment';
import { getFirstScreen } from "../../_helpers/common";
import { staffActions } from "../../_actions";
import { withTranslation } from "react-i18next";
import search_icon from "../../../public/img/icons/header-search.svg";
import mobile_gray_cansel from "../../../public/img/icons/mobile_gray_cansel.svg"
import arrow_down_white from "../../../public/img/icons/arrow_down_white.svg";
import MediaQuery from 'react-responsive'
import arrow_down from "../../../public/img/icons/arrow_down_white.svg";
class TabTwo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            openList: false,
            catigor: [],
            visibleSearch: false,
        }
        this.priceText = this.priceText.bind(this);
    }
    startOpenservice = false;
    priceText(priceFrom, priceTo, currency, white) {
        const desctop = 720;
        const mob = 709;
        let whiteClass = "";
        white ? whiteClass = "white_text" : whiteClass = "";
        const { t } = this.props;
        if (priceFrom !== priceTo) {
            return (<React.Fragment>
                <MediaQuery maxWidth={mob}>
                <div className="price_service">
                    <div className="price_service_item">
                        <strong className={whiteClass}>{priceFrom}</strong>
                        <span className={whiteClass}>{currency}</span>
                    </div>
                    <strong className={whiteClass}>-&nbsp;</strong>
                    <div className="price_service_item">
                        <strong className={whiteClass}>{priceFrom !== priceTo && priceTo} </strong>
                        <span className={whiteClass}>{currency}</span>
                    </div>
                </div>
                    </MediaQuery>
                <MediaQuery minWidth={desctop}>
                        <strong className={whiteClass}>{priceFrom}</strong>
                        <span className={whiteClass}>{currency}</span>
                    <strong className={whiteClass}>-&nbsp;</strong>
                        <strong className={whiteClass}>{priceFrom !== priceTo && priceTo} </strong>
                        <span className={whiteClass}>{currency}</span>
                </MediaQuery>
                

            </React.Fragment>
            )
        } else {
            return (<React.Fragment>
                <strong className={whiteClass}>{priceFrom}</strong>
                <span className={whiteClass}>{currency}</span>
            </React.Fragment>
            )
        }
    }
    render() {

        const { selectedServices, info, isLoading, match, history, subcompanies, firstScreen, isStartMovingVisit, clearSelectedServices, getDurationForCurrentStaff, setScreen, flagAllStaffs, refreshTimetable, serviceGroups, selectedStaff, services, selectedService, servicesForStaff, selectService, setDefaultFlag, t } = this.props;
        const { searchValue, openList, catigor, visibleSearch } = this.state;
        const desctop = 720;
        const mob = 709;
        let servicesSum = 0;

        serviceGroups.map((serviceGroup) => {

            const { services } = serviceGroup
            const condition =
                services && services.some(service => selectedStaff.staffId && service.staffs && service.staffs.some(st => st.staffId === selectedStaff.staffId)) ||
                flagAllStaffs

            let finalServices

            if (flagAllStaffs) {
                if (selectedServices && selectedServices.length) {
                    finalServices = services && services.filter(service => service.staffs && service.staffs.some(st => selectedServices.some(selectedServ => selectedServ.staffs && selectedServ.staffs.some(selectedServStaff => st.staffId === selectedServStaff.staffId))))
                } else {
                    finalServices = services && services.filter(service => service.staffs && service.staffs.length > 0)
                }
            } else {
                finalServices = services && services.filter(service => service.staffs && service.staffs.length > 0 && service.staffs.some(localStaff => localStaff.staffId === selectedStaff.staffId))
            }

            if (searchValue && searchValue.length > 0) {
                finalServices = finalServices && finalServices.filter(service =>
                    service.name.toLowerCase().includes(this.search.value.toLowerCase())
                    || service.details.toLowerCase().includes(this.search.value.toLowerCase())
                    || serviceGroup.name.toLowerCase().includes(this.search.value.toLowerCase())
                )
            }

            if (condition && info && finalServices && finalServices.length > 0) {
                finalServices = finalServices.filter(service => info.booktimeStep <= service.duration && service.duration % info.booktimeStep === 0);
            }

            if (finalServices) {
                servicesSum += finalServices.length;
                if (servicesSum >= 10) {
                    this.startOpenservice = true;
                } else {
                    this.startOpenservice = false;
                }
            }
        })



        if (info && (info.bookingPage === match.params.company) && !info.onlineZapisOn && (parseInt(moment().utc().format('x')) >= info.onlineZapisEndTimeMillis)) {
            return (
                <div className="online-zapis-off">
                    {t("Онлайн-запись отключена...")}
                    {(subcompanies.length > 1) && (
                        <button onClick={() => {
                            setScreen(0)
                            this.props.dispatch(staffActions.clearError());
                            const { company } = match.params;
                            const url = company.includes('_') ? company.split('_')[0] : company
                            history.push(`/${url}`)
                        }} style={{ marginTop: '4px', marginBottom: '20px' }}
                            className="book_button">{t("На страницу выбора филиалов")}</button>
                    )}
                </div>
            )
        }
        const userNameStyle = {}
        if ((selectedStaff.firstName && selectedStaff.firstName.length > 15) || (selectedStaff.lastName && selectedStaff.lastName > 15)) {
            userNameStyle.fontSize = '13px'
        }
        const isServiceList = serviceGroups && serviceGroups.some(serviceGroup => {
            let { services } = serviceGroup
            const hasActiveServices = services && services.some(service => service.staffs && service.staffs.length > 0);
            return hasActiveServices &&
                (services && services.some(service => selectedStaff.staffId && service.staffs && service.staffs.some(st => st.staffId === selectedStaff.staffId)) ||
                    (!servicesForStaff && selectedStaff && selectedStaff.length === 0)
                )
        })





        let serviceInfo = null;
        let padding_left = "21px";
        let padding_right = "39px";
        let sizeWords = "36px";
        if (selectedService.serviceId) {
            let priceFrom = 0;
            let priceTo = 0;
            let duration = 0;
            selectedServices.forEach((service) => {
                priceFrom += parseInt(service.priceFrom)
                priceTo += parseInt(service.priceTo)
                duration += parseInt(getDurationForCurrentStaff(service))
            })

            const priceFrom100 = priceFrom / 100;
            const priceTo100 = priceTo / 100;
            const priceFrom1000 = priceFrom / 1000;
            const priceTo1000 = priceTo / 1000;

            if (priceFrom1000 > 1 || priceTo1000 > 1) {
                sizeWords = "24px"
                padding_left = "0px";
                padding_right = "0px";
            }
            else if (priceFrom100 > 1 || priceTo100 > 1) {
                sizeWords = "32px"
                padding_left = "0px";
                padding_right = "0px";
            }

            serviceInfo = (
                <div>
                    <MediaQuery maxWidth={mob}>
                        <div className="specialist">
                            <div className="specialist-block">
                                <div className="supperVisDet service_footer-block">
                                    <div className="service_footer_price">
                                        <p className="service_footer_price_text">{priceFrom}{priceFrom !== priceTo && " - " + priceTo}&nbsp;</p>
                                        <span>{selectedServices[0] && selectedServices[0].currency}</span>
                                    </div>
                                    <p className="service_footer_price_small_text" style={{
                                        fontWeight: "400",
                                        paddingLeft: `${padding_left}`,
                                    }} onClick={event => this.setState({
                                        openList: !openList,
                                    })}>{t("Услуги")}: {selectedServices.length}
                                        <img alt="arrow_down_white" className={openList ? "" : "arrow_rotate"} src={arrow_down_white}></img>
                                    </p>
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
                                {!!selectedServices.length && <button className="next_block" onClick={() => {
                                    if (selectedServices.length) {
                                        setScreen(3);
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
                                                <p>{t("Услуги:")}Услуги:</p>
                                                {selectedServices.map((element, index) =>
                                                    <div key={index} className="setvice_list_item">
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
                                        <p className="service_footer_price_small_text" style={{
                                            paddingLeft: `${padding_left}`,
                                        }} onClick={event => this.setState({
                                            openList: !openList,
                                        })}>{t("Выбрано услуг")}: {selectedServices.length} <img src={arrow_down} className="arrow_rotate" alt="arrou"></img></p>
                                        <p className="service_footer_price_small_text" style={{
                                            paddingRight: `${padding_right}`,
                                        }} >{t("Длительность")}: {moment.duration(parseInt(duration), "seconds").format(`h[ ${t("ч")}] m[ ${t("минут")}]`)}
                                        </p>
                                        {!!selectedServices.length && <button className="next_block" onClick={() => {
                                            if (selectedServices.length) {
                                                setScreen(3);
                                            }
                                            refreshTimetable();
                                        }}>
                                            <span className="title_block_text">{t("Продолжить")}</span></button>}
                                    </div >
                                }
                            </div>
                        </div>
                    </MediaQuery>
                </div >
            )
        }
        return info && (info.bookingPage === match.params.company) && (info.onlineZapisOn || (!info.onlineZapisOn && (parseInt(moment().utc().format('x')) < info.onlineZapisEndTimeMillis))) && (
            <div className="service_selection screen1">

                <MediaQuery maxWidth={mob}>
                    {visibleSearch ?
                        (<div className="title_block service-title">

                            <div className="row align-items-center content clients mb-2 search-block">
                                <div className="search col-12">
                                    <img
                                        src={search_icon} />
                                    <input style={{
                                        margin: "auto", width: "240px", height: "34px",
                                        fontFamily: "Open Sans",
                                        fontStyle: "normal",
                                        fontWeight: "normal",
                                        marginLeft: "21px",
                                        fontSize: "13px",
                                        lineHeight: "18px",
                                        color: "rgba(9, 9, 58, 1)",
                                        opacity: "0.7",
                                        border: "0",
                                    }} type="search"
                                        placeholder={t("Название услуги, категории")}
                                        aria-label="Search" ref={input => this.search = input}
                                        onChange={(e) => this.setState({ searchValue: e.target.value })} />
                                </div>
                            </div>
                            <img onClick={e => this.setState({
                                visibleSearch: !visibleSearch,
                            })} src={mobile_gray_cansel} alt="mobile_gray_cansel" />
                        </div>)
                        : (<div className="title_block service-title">
                            {(getFirstScreen(firstScreen) === 2 ? (subcompanies.length > 1) : true) &&
                                <span className="prev_block service-prev" onClick={() => {
                                    if (getFirstScreen(firstScreen) === 2) {
                                        if (!isStartMovingVisit) {
                                            clearSelectedServices()
                                        }
                                        setDefaultFlag();
                                        setScreen(0);
                                        const { company } = match.params;
                                        const url = company.includes('_') ? company.split('_')[0] : company
                                        history.push(`/${url}`)
                                    } else {
                                        setScreen(1);
                                        refreshTimetable();
                                        setDefaultFlag();
                                        if (!isStartMovingVisit) {
                                            clearSelectedServices()
                                        }
                                    }
                                }}><span className="title_block_text">{t("Назад")}</span></span>}
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "175px",
                            }}>
                                <p className="modal_title">{t("Выберите услугу")}</p>
                                <div className="desktop_invisible" onClick={e => this.setState({
                                    visibleSearch: !visibleSearch,
                                })}>
                                    <img className="media_search" alt="search" src={search_icon} />
                                </div>
                            </div></div>)}

                </MediaQuery>
                <MediaQuery minWidth={desctop}>
                    <div className="title_block service-title">
                        {(getFirstScreen(firstScreen) === 2 ? (subcompanies.length > 1) : true) &&
                            <span className="prev_block service-prev" onClick={() => {
                                if (getFirstScreen(firstScreen) === 2) {
                                    if (!isStartMovingVisit) {
                                        clearSelectedServices()
                                    }
                                    setDefaultFlag();
                                    setScreen(0);
                                    const { company } = match.params;
                                    const url = company.includes('_') ? company.split('_')[0] : company
                                    history.push(`/${url}`)
                                } else {
                                    setScreen(1);
                                    refreshTimetable();
                                    setDefaultFlag();
                                    if (!isStartMovingVisit) {
                                        clearSelectedServices()
                                    }
                                }
                            }}><span className="title_block_text">{t("Назад")}</span></span>}
                        <p className="modal_title">{t("Выберите услугу")}</p>
                        <div className="row align-items-center content clients mb-2 search-block desktop_visible">
                            <div className="search col-12">
                                <img

                                    src={search_icon} />
                                <input style={{
                                    margin: "auto", width: "240px", height: "34px",
                                    fontFamily: "Open Sans",
                                    fontStyle: "normal",
                                    fontWeight: "normal",
                                    fontSize: "13px",
                                    lineHeight: "18px",
                                    color: "rgba(9, 9, 58, 1)",
                                    opacity: "0.7",
                                    borderRadius: "2px",
                                }} type="search"
                                    placeholder={t("Название услуги, категории")}
                                    aria-label="Search" ref={input => this.search = input}
                                    onChange={(e) => this.setState({ searchValue: e.target.value })} />
                            </div>
                        </div>
                    </div>
                </MediaQuery>


                {/* {selectedStaff.staffId && */}
                { selectedServices[0] && serviceInfo}

                {
                    isServiceList ? serviceGroups.length > 0 && (
                        <React.Fragment>
                            <div className="service_list_items">
                                {serviceGroups.map((serviceGroup, index) => {

                                    const { services } = serviceGroup
                                    const condition =
                                        services && services.some(service => selectedStaff.staffId && service.staffs && service.staffs.some(st => st.staffId === selectedStaff.staffId)) ||
                                        flagAllStaffs

                                    let finalServices

                                    if (flagAllStaffs) {
                                        if (selectedServices && selectedServices.length) {
                                            finalServices = services && services.filter(service => service.staffs && service.staffs.some(st => selectedServices.some(selectedServ => selectedServ.staffs && selectedServ.staffs.some(selectedServStaff => st.staffId === selectedServStaff.staffId))))
                                        } else {
                                            finalServices = services && services.filter(service => service.staffs && service.staffs.length > 0)
                                        }
                                    } else {
                                        finalServices = services && services.filter(service => service.staffs && service.staffs.length > 0 && service.staffs.some(localStaff => localStaff.staffId === selectedStaff.staffId))
                                    }

                                    if (searchValue && searchValue.length > 0) {
                                        finalServices = finalServices && finalServices.filter(service =>
                                            service.name.toLowerCase().includes(this.search.value.toLowerCase())
                                            || service.details.toLowerCase().includes(this.search.value.toLowerCase())
                                            || serviceGroup.name.toLowerCase().includes(this.search.value.toLowerCase())
                                        )
                                    }

                                    if (condition && info && finalServices && finalServices.length > 0) {
                                        finalServices = finalServices.filter(service => info.booktimeStep <= service.duration && service.duration % info.booktimeStep === 0);
                                    }
                                    return condition && finalServices && finalServices.length > 0 && (
                                        <ul className="service_list" key={index}>
                                            <div style={{
                                                borderBottom: "1px solid rgba(172, 172, 172, 0.2)",
                                                paddingBottom: "9px",
                                                marginBottom: "18px",
                                            }}>
                                                <div style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center"
                                                }}>
                                                    <div className="service_list_name">
                                                        <h3>{serviceGroup.name}</h3>
                                                    </div>

                                                    <div className="minus_hover" onClick={event => {
                                                        const newArray = catigor;
                                                        newArray[index] = !newArray[index]
                                                        this.setState({
                                                            catigor: newArray.concat()
                                                        })
                                                    }}>
                                                        {this.startOpenservice ? (!catigor[index] ?
                                                            <div>
                                                                <div className="minus"></div>
                                                                <div className="minus minus_rotate"></div>
                                                            </div> : <div>
                                                                <div className=" minus"></div>
                                                            </div>) : (catigor[index] ? <div>
                                                                <div className="minus"></div>
                                                                <div className="minus minus_rotate"></div>
                                                            </div> : <div>
                                                                    <div className="minus"></div>
                                                                </div>)}
                                                    </div>
                                                </div>

                                                <div
                                                    className={this.startOpenservice ? (catigor[index] ? "service_items service_items_active" : "service_items") : (!catigor[index] ? "service_items service_items_active" : "service_items")}
                                                >
                                                    {finalServices
                                                        .map((service, serviceKey, array) => {
                                                            const select = selectedServices.some(selectedService => selectedService.serviceId === service.serviceId);

                                                            if (select) {
                                                                return <li key={serviceKey}
                                                                    className={(selectedService && selectedService.serviceId === service.serviceId && `selected`) + (array.length === 1 && " service_items_grow")}
                                                                    style={{
                                                                        backgroundColor: "rgba(62, 80, 247)"
                                                                    }}>
                                                                    <div className="service_item" >
                                                                        <label className="service-block">
                                                                            <MediaQuery maxWidth={mob}>
                                                                                <div className="service_half_block">
                                                                                    <p className="white_text" >{service.name}</p>
                                                                                    <span className="white_text" >{service.details}</span>
                                                                                </div>
                                                                                <div className="service_half_block">
                                                                                    <span
                                                                                        className="runtime black-fone runtime_back" ><strong className="white_text">{moment.duration(parseInt(getDurationForCurrentStaff(service)), "seconds").format(`h[ ${t("ч")}] m[ ${t("минут")}]`)}</strong></span>
                                                                                    <div className="service-price">
                                                                                        <div className="service-price-text">

                                                                                            {this.priceText(service.priceFrom, service.priceTo, service.currency, true)}
                                                                                            <input onChange={(e) => selectService(e, service)}
                                                                                                type="checkbox"
                                                                                                checked={select} />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </MediaQuery>
                                                                            <MediaQuery minWidth={desctop}>
                                                                                <p className="white_text" >{service.name}</p>
                                                                                <span className="runtime white_text" >{service.details}</span>
                                                                                <span
                                                                                    className="runtime black-fone runtime_back" ><strong className="white_text">{moment.duration(parseInt(getDurationForCurrentStaff(service)), "seconds").format(`h[ ${t("ч")}] m[ ${t("минут")}]`)}</strong></span>
                                                                                <div className="service-price">
                                                                                    <div className="service-price-text">
                                                                                        {this.priceText(service.priceFrom, service.priceTo, service.currency, true)}
                                                                                        <input onChange={(e) => selectService(e, service)}
                                                                                            type="checkbox"
                                                                                            checked={select} />
                                                                                    </div>
                                                                                    <button className="next_block-btn white_border "
                                                                                        onClick={e => selectService({ target: { checked: !select } }, service)}
                                                                                    >  {t("Выбрано")}</button>
                                                                                </div>
                                                                            </MediaQuery>
                                                                        </label>
                                                                    </div>
                                                                </li>
                                                            } else {
                                                                return <li key={serviceKey}
                                                                    className={(selectedService && selectedService.serviceId === service.serviceId && `selected `) + (array.length === 1 && " service_items_grow")}>
                                                                    <div className="service_item" >
                                                                        <label className="service-block">
                                                                            <MediaQuery maxWidth={mob}>
                                                                                <div className="service_half_block">
                                                                                    <p >{service.name}</p>
                                                                                    <span  ><p >{service.details}</p></span>
                                                                                </div>
                                                                                <div className="service_half_block">
                                                                                    <span
                                                                                        className="runtime black-fone" ><strong >{moment.duration(parseInt(getDurationForCurrentStaff(service)), "seconds").format(`h[ ${t("ч")}] m[ ${t("минут")}]`)}</strong></span>
                                                                                    <div className="service-price">
                                                                                        <div className="service-price-text" >
                                                                                            {this.priceText(service.priceFrom, service.priceTo, service.currency, false)}
                                                                                            <input onChange={(e) => selectService(e, service)}
                                                                                                type="checkbox"
                                                                                                checked={select} />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                            </MediaQuery>
                                                                            <MediaQuery minWidth={desctop}>
                                                                                <p >{service.name}</p>
                                                                                <span className="runtime" >{service.details}</span>
                                                                                <span
                                                                                    className="runtime black-fone" ><strong >{moment.duration(parseInt(getDurationForCurrentStaff(service)), "seconds").format(`h[ ${t("ч")}] m[ ${t("минут")}]`)}</strong></span>
                                                                                <div className="service-price">
                                                                                    <div className="service-price-text" >
                                                                                        {this.priceText(service.priceFrom, service.priceTo, service.currency, false)}
                                                                                        <input onChange={(e) => selectService(e, service)}
                                                                                            type="checkbox"
                                                                                            checked={select} />
                                                                                    </div>
                                                                                    <button className="next_block-btn "
                                                                                        onClick={e => selectService({ target: { checked: !select } }, service)}
                                                                                    > {t("Выбрать")}</button>
                                                                                </div>
                                                                            </MediaQuery>
                                                                        </label>
                                                                    </div>
                                                                </li>
                                                            }

                                                        }

                                                        )}
                                                </div>
                                            </div>
                                        </ul>
                                    )
                                })
                                }
                            </div>
                        </React.Fragment>
                    ) : (!isLoading &&
                        <div className="final-book">
                            <p>{t("Нет доступных услуг")}</p>
                        </div>
                        )
                }

                {
                    !!selectedServices.length &&
                    <div className="button_block" onClick={() => {
                        if (selectedServices.length) {
                            setScreen(3);
                        }
                        refreshTimetable();
                    }}>
                    </div>
                }

            </div >
        );
    }
}

export default withTranslation("common")(TabTwo);
