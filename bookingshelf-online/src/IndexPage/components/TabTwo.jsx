import React, { Component } from 'react';
import moment from 'moment';
import { getFirstScreen } from "../../_helpers/common";
import { staffActions } from "../../_actions";
import { withTranslation } from "react-i18next";
import search_icon from "../../../public/img/icons/header-search.svg";
import mobile_gray_cansel from "../../../public/img/icons/mobile_gray_cansel.svg"
import MediaQuery from 'react-responsive'
import { CURSOR_ICON } from '../../_constants/svg.constants';
import { BUTTON_COLORS_BY_NUMBER } from '../../_constants/styles.constants'
import {TABLET_WIDTH} from '../../_constants/global.constants'
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
        this.openListFunc = this.openListFunc.bind(this);
        this.openCatigor = this.openCatigor.bind(this);
        this.searchOpen = this.searchOpen.bind(this);
    }
    startOpenservice = false;

    canselMobSearch() {
        if (this.state.visibleSearch) {
            const newArray = [];

            for (let i = 0; i < this.props.serviceGroups.length; i++) {
                newArray.push(false)
            }
            this.setState({
                visibleSearch: !this.state.visibleSearch,
                searchValue: "",
                catigor: newArray.concat()
            })
        } else {
            this.setState({
                visibleSearch: !this.state.visibleSearch,
                searchValue: ""
            })
        }

    }
    searchOpen(e) {
        const newArray = [];

        for (let i = 0; i < this.props.serviceGroups.length; i++) {
            if (e.target.value != "") {
                newArray.push(true)
            }
            else {
                newArray.push(false)
            }
        }

        this.setState({ searchValue: e.target.value, catigor: newArray.concat() })
    }
    openCatigor(index) {
        const newArray = this.state.catigor;
        newArray[index] = !newArray[index]
        this.setState({
            catigor: newArray.concat()
        })
    }
    openListFunc(event) {
        if (event.target.className !== "cansel_btn_small") {
            this.setState({
                openList: !this.state.openList,
            })
        }
    }
    priceText(priceFrom, priceTo, currency, white, footer) {
       
        let whiteClass = "";
        white ? whiteClass = "white_text" : whiteClass = "";
        const { t } = this.props;
        if (priceFrom !== priceTo) {
            if (footer) {
                return (<React.Fragment>
                    <MediaQuery maxWidth={TABLET_WIDTH-1}>
                        <React.Fragment>
                            <div className="price_footer_service_item">
                                <div className="price_footer_service_half">
                                    <strong>{priceFrom}</strong>
                                    <span >{currency}</span>
                                </div>
                            </div>
                            <p>-&nbsp;</p>
                            <div className="price_footer_service_item">
                                <div className="price_footer_service_half">
                                    <strong>{priceTo} </strong>
                                    <span >{currency}</span>
                                </div>
                            </div>
                        </React.Fragment>

                    </MediaQuery>
                    <MediaQuery minWidth={TABLET_WIDTH}>
                        <div className="price_service_half">
                            <strong className={whiteClass}>{priceFrom}</strong>
                            <span className={whiteClass}>{currency}</span>
                        </div>
                        <p>-&nbsp;</p>
                        <div className="price_service_half">
                            <strong className={whiteClass}>{priceTo} </strong>
                            <span className={whiteClass}>{currency}</span>
                        </div>
                    </MediaQuery>
                </React.Fragment>
                )
            } else {
                return (<React.Fragment>
                    <MediaQuery maxWidth={TABLET_WIDTH-1}>
                        <div className="price_service">
                            <div className="price_service_item">
                                <div className="price_service_half">
                                    <strong className={whiteClass}>{priceFrom}</strong>
                                    <span className={whiteClass}>{currency}</span>
                                </div>
                            </div>

                            <p className={whiteClass}>-&nbsp;</p>
                            <div className="price_service_item">
                                <div className="price_service_half">
                                    <strong className={whiteClass}>{priceTo} </strong>
                                    <span className={whiteClass}>{currency}</span>
                                </div>
                            </div>
                        </div>
                    </MediaQuery>
                    <MediaQuery minWidth={TABLET_WIDTH}>
                        <div className="price_service_half">
                            <strong className={whiteClass}>{priceFrom}</strong>
                            <span className={whiteClass}>{currency}</span>
                        </div>
                        <p className={whiteClass}>-&nbsp;</p>
                        <div className="price_service_half">
                            <strong className={whiteClass}>{priceTo} </strong>
                            <span className={whiteClass}>{currency}</span>
                        </div>
                    </MediaQuery>
                </React.Fragment>
                )
            }

        } else {
            if (footer) {
                return (<React.Fragment>
                    <div className="price_footer_service_item">
                        <div className="price_footer_service_half">
                            <p>{priceFrom}</p>
                            <span >{currency}</span>
                        </div>
                    </div>
                </React.Fragment>
                )
            } else {
                return (<React.Fragment>
                    <div className="price_service_half">
                        <strong className={whiteClass}>{priceFrom}</strong>
                        <span className={whiteClass}>{currency}</span>
                    </div>
                </React.Fragment>
                )
            }

        }
    }
    render() {

        const { selectedServices, info, isLoading, match, history, subcompanies, firstScreen, isStartMovingVisit, clearSelectedServices, getDurationForCurrentStaff, setScreen, flagAllStaffs, refreshTimetable, serviceGroups, selectedStaff, services, selectedService, servicesForStaff, selectService, setDefaultFlag, t } = this.props;
        const { searchValue, openList, catigor, visibleSearch } = this.state;
        
        const defaultHeight = 310;
        let heightService = "0";
        let heightServiceMob = "0";
        let transit;
        let servicesSum = 0;

        serviceGroups.map((serviceGroup, index) => {

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
            if (searchValue && searchValue.length > 0) {
                finalServices = finalServices && finalServices.filter(service =>
                    service.name.toLowerCase().includes(this.search.value.toLowerCase())
                    || service.details.toLowerCase().includes(this.search.value.toLowerCase())
                    || serviceGroup.name.toLowerCase().includes(this.search.value.toLowerCase())
                )
            }
        })



        if (info && (info.bookingPage === match.params.company) && !info.onlineZapisOn && (parseInt(moment().utc().format('x')) >= info.onlineZapisEndTimeMillis)) {
            return (
                <div className="online-zapis-off">
                    <p>{t("Онлайн-запись отключена. Пожалуйста, свяжитесь с администратором. Приносим извинения за доставленные неудобства.")}</p>
                    {(subcompanies.length > 1) && (
                        <button onClick={() => {
                            setScreen(0)
                            this.props.dispatch(staffActions.clearError());
                            const { company } = match.params;
                            const url = company.includes('_') ? company.split('_')[0] : company
                            history.push(`/${url}`)
                        }}
                            className="online_zapis_off_btn">{t("На страницу выбора филиалов")}</button>
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
        let sizeWords = "23px";
        if (selectedService.serviceId) {
            let priceFrom = 0;
            let priceTo = 0;
            let duration = 0;
            selectedServices.forEach((service) => {
                priceFrom += Number(service.priceFrom)
                priceTo += Number(service.priceTo)
                duration += Number(getDurationForCurrentStaff(service))
            })

            const priceFrom100 = priceFrom / 100;
            const priceTo100 = priceTo / 100;
            const priceFrom1000 = priceFrom / 1000;
            const priceTo1000 = priceTo / 1000;

            if (priceFrom1000 > 1 || priceTo1000 > 1) {
                sizeWords = "20px"
            }
            else if (priceFrom100 > 1 || priceTo100 > 1) {
                sizeWords = "22px"
            }
            serviceInfo = (
                <div>
                    <MediaQuery maxWidth={TABLET_WIDTH-1}>
                        <div className="specialist" onClick={event => this.openListFunc(event)}>

                            <div className="specialist-block">
                                {CURSOR_ICON}
                                <div className="supperVisDet service_footer-block">
                                    <div className="service_footer_price">
                                        {this.priceText(priceFrom, priceTo, selectedServices[0] && selectedServices[0].currency, false, true)}
                                    </div>

                                    <div className="time-footer hover service_grow">
                                        <p className="time_footer_p" onClick={event => this.setState({
                                            openList: !openList,
                                        })}>{t("Услуги")}: {selectedServices.length}
                                        </p>
                                        <p className="service_footer_price_small_text" >{t("Длительность")}: {moment.duration(parseInt(duration), "seconds").format(`h[ ${t("ч")}] m[ ${t("минут")}]`)}
                                        </p>

                                    </div>
                                </div >
                                {openList && (

                                    <div className="service_list_block">
                                        <div className="setvice_list_items">
                                            {selectedServices.map((element, index) =>
                                                <div key={index} className="setvice_list_item">
                                                    <div className="cansel_btn_small" onClick={e => selectService({ target: { checked: !selectedServices.some(selectedService => selectedService.serviceId === element.serviceId) } }, element)}> </div>
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
                    <MediaQuery minWidth={TABLET_WIDTH}>
                        <div className="specialist" onClick={event => this.openListFunc(event)}>

                            <div className="specialist-block">
                                {CURSOR_ICON}
                                {openList ?
                                    <div className="specialist_big">
                                        <div className="service_list_block">
                                            <div className="setvice_list_items">
                                                <p className="text_underline">{selectedStaff.firstName} {selectedStaff.lastName ? selectedStaff.lastName : ''}</p>
                                                <p>{t("Услуги")}:</p>
                                                {selectedServices.map((element, index) =>
                                                    <div key={index} className="setvice_list_item">
                                                        <div className="cansel_btn_small" onClick={e => selectService({ target: { checked: !selectedServices.some(selectedService => selectedService.serviceId === element.serviceId) } }, element)}> </div>
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
                                        <p className="service_footer_price_small_text" onClick={event => this.setState({
                                            openList: !openList,
                                        })}>{t("Выбрано услуг")}: {selectedServices.length}</p>
                                        <p className="service_footer_price_small_text"  >{t("Длительность")}: {moment.duration(parseInt(duration), "seconds").format(`h[ ${t("ч")}] m[ ${t("минут")}]`)}
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
            <div className="service_selection screen2">
                <div className={selectedServices[0]?"service_selection_block_two service_selection_block_one_select":"service_selection_block_two"}>
                    <MediaQuery maxWidth={TABLET_WIDTH-1}>
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
                                            onChange={(e) => this.searchOpen(e)} />
                                    </div>
                                </div>
                                <img onClick={e => this.canselMobSearch()} src={mobile_gray_cansel} alt="mobile_gray_cansel" />
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
                                    <div className="TABLET_WIDTH_invisible" onClick={e => this.setState({
                                        visibleSearch: !visibleSearch,
                                    })}>
                                        <img className="media_search" alt="search" src={search_icon} />
                                    </div>
                                </div></div>)}

                    </MediaQuery>
                    <MediaQuery minWidth={TABLET_WIDTH}>
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
                            <div className="row align-items-center content clients mb-2 search-block TABLET_WIDTH_visible">
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
                                        onChange={(e) => this.searchOpen(e)} />
                                </div>
                            </div>
                        </div>
                    </MediaQuery>


                    {/* {selectedStaff.staffId && */}
                    {selectedServices[0] && serviceInfo}

                    {
                        isServiceList ? serviceGroups.length > 0 && (
                            <React.Fragment>
                                <div className="service_list_items">
                                    {serviceGroups.map((serviceGroup, index, array) => {

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
                                            heightService = String(Math.ceil(finalServices.length / 2) * defaultHeight);
                                            heightServiceMob=String(finalServices.length * defaultHeight);
                                            transit = (finalServices.length * 0.1) + 0.3;
                                        }


                                        return condition && finalServices && finalServices.length > 0 && (
                                            <ul className="service_list" key={index}>
                                                <div>
                                                    <div onClick={event => this.openCatigor(index)} className="service_header">
                                                        <div className="service_list_name">
                                                            <h3>{serviceGroup.name}</h3>
                                                        </div>

                                                        <div className="minus_hover" >
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
                                                    <MediaQuery maxWidth={TABLET_WIDTH-1}>
                                                        <div className="service_items"
                                                            style={this.startOpenservice
                                                                ? (catigor[index] ? { maxHeight: `${heightServiceMob}`, transition: `max-height ${transit}s linear ` } : { maxHeight: "0px", borderBottom: "1px solid rgba(172, 172, 172, 0.2)", transition: `max-height ${transit}s linear ` })
                                                                : (!catigor[index] ? { maxHeight: `${heightServiceMob}`, transition: `max-height ${transit}s linear ` } : { maxHeight: "0px", borderBottom: "1px solid rgba(172, 172, 172, 0.2)", transition: `max-height ${transit}s linear ` })}
                                                        >
                                                            {finalServices
                                                                .map((service, serviceKey) => {
                                                                    const select = selectedServices.some(selectedService => selectedService.serviceId === service.serviceId);

                                                                    if (select) {
                                                                        return <li key={serviceKey}
                                                                            className={(selectedService && selectedService.serviceId === service.serviceId && `selected`) + (finalServices.length === 1 && " service_items_grow")}
                                                                            style={{
                                                                                backgroundColor: "var(--color_button)"
                                                                            }}
                                                                        >
                                                                            <div className="service_item" >
                                                                                <label className="service-block">
                                                                                    <div className="service_half_block">
                                                                                        <p className="white_text" >{service.name}</p>
                                                                                        <span className="white_text" >{service.details}</span>
                                                                                    </div>
                                                                                    <div className="service_half_block">
                                                                                        <span
                                                                                            className="runtime black-fone runtime_back" ><strong className="white_text">{moment.duration(parseInt(getDurationForCurrentStaff(service)), "seconds").format(`h[ ${t("ч")}] m[ ${t("минут")}]`)}</strong></span>
                                                                                        <div className="service-price">
                                                                                            <div className={String(service.priceFrom).length > 4 ? "service-price-text service-price-text_column" : "service-price-text"}>

                                                                                                {this.priceText(service.priceFrom, service.priceTo, service.currency, true, false)}
                                                                                                <input onChange={(e) => selectService(e, service)}
                                                                                                    type="checkbox"
                                                                                                    checked={select} />
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>


                                                                                </label>
                                                                            </div>
                                                                        </li>
                                                                    } else {
                                                                        return <li key={serviceKey}
                                                                            className={(selectedService && selectedService.serviceId === service.serviceId && `selected `) + (finalServices.length === 1 && " service_items_grow")}
                                                                        >
                                                                            <div className="service_item" >
                                                                                <label className="service-block">
                                                                                    <div className="service_half_block">
                                                                                        <p >{service.name}</p>
                                                                                        <span  ><p >{service.details}</p></span>
                                                                                    </div>
                                                                                    <div className="service_half_block">
                                                                                        <span
                                                                                            className="runtime black-fone" ><strong >{moment.duration(parseInt(getDurationForCurrentStaff(service)), "seconds").format(`h[ ${t("ч")}] m[ ${t("минут")}]`)}</strong></span>
                                                                                        <div className="service-price">
                                                                                            <div className={String(service.priceFrom).length > 4 ? "service-price-text service-price-text_column" : "service-price-text"}>
                                                                                                {this.priceText(service.priceFrom, service.priceTo, service.currency, false, false)}
                                                                                                <input onChange={(e) => selectService(e, service)}
                                                                                                    type="checkbox"
                                                                                                    checked={select} />
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </label>
                                                                            </div>
                                                                        </li>
                                                                    }
                                                                }
                                                                )}
                                                        </div>
                                                    </MediaQuery>
                                                    <MediaQuery minWidth={TABLET_WIDTH}>
                                                        <div className="service_items"
                                                            style={this.startOpenservice
                                                                ? (catigor[index] ? { maxHeight: `${heightService}`, transition: `max-height ${transit}s linear ` } : { maxHeight: "0px", borderBottom: "1px solid rgba(172, 172, 172, 0.2)", transition: `max-height ${transit}s linear ` })
                                                                : (!catigor[index] ? { maxHeight: `${heightService}`, transition: `max-height ${transit}s linear ` } : { maxHeight: "0px", borderBottom: "1px solid rgba(172, 172, 172, 0.2)", transition: `max-height ${transit}s linear ` })}
                                                        >
                                                            {finalServices
                                                                .map((service, serviceKey) => {
                                                                    const select = selectedServices.some(selectedService => selectedService.serviceId === service.serviceId);

                                                                    if (select) {
                                                                        return <li key={serviceKey}
                                                                            className={(selectedService && selectedService.serviceId === service.serviceId && `selected`) + (finalServices.length === 1 && " service_items_grow")}
                                                                            style={{
                                                                                backgroundColor: "var(--color_button)"
                                                                            }}
                                                                        >
                                                                            <div className="service_item" >
                                                                                <label className="service-block">
                                                                                    <div className="name_service_block">
                                                                                        <div className="name_service_text">
                                                                                            <p className="white_text">{service.name}</p>

                                                                                        </div>
                                                                                        <span
                                                                                            className="runtime black-fone runtime_back" ><strong className="white_text">{moment.duration(parseInt(getDurationForCurrentStaff(service)), "seconds").format(`h[ ${t("ч")}] m[ ${t("минут")}]`)}</strong></span>
                                                                                    </div>
                                                                                    <span className="runtime white_text" >{service.details}</span>

                                                                                    <div className="service-price">
                                                                                        <div className={String(service.priceFrom).length > 4 ? "service-price-text service-price-text_column" : "service-price-text"}>
                                                                                            {this.priceText(service.priceFrom, service.priceTo, service.currency, true, false)}
                                                                                            <input onChange={(e) => selectService(e, service)}
                                                                                                type="checkbox"
                                                                                                checked={select} />
                                                                                        </div>
                                                                                        <button className="next_block-btn white_border "
                                                                                            onClick={e => selectService({ target: { checked: !select } }, service)}
                                                                                        >  {t("Выбрано")}</button>
                                                                                    </div>

                                                                                </label>
                                                                            </div>
                                                                        </li>
                                                                    } else {
                                                                        return <li key={serviceKey}
                                                                            className={(selectedService && selectedService.serviceId === service.serviceId && `selected `) + (finalServices.length === 1 && " service_items_grow")}
                                                                        >
                                                                            <div className="service_item" >
                                                                                <label className="service-block">

                                                                                    <div className="name_service_block">
                                                                                        <div className="name_service_text">
                                                                                            <p >{service.name}</p>
                                                                                        </div>
                                                                                        <span
                                                                                            className="runtime black-fone" ><strong >{moment.duration(parseInt(getDurationForCurrentStaff(service)), "seconds").format(`h[ ${t("ч")}] m[ ${t("минут")}]`)}</strong></span>
                                                                                    </div>
                                                                                    <span className="runtime" >{service.details}</span>
                                                                                    <div className="service-price">
                                                                                        <div className={String(service.priceFrom).length > 4 ? "service-price-text service-price-text_column" : "service-price-text"}>
                                                                                            {this.priceText(service.priceFrom, service.priceTo, service.currency, false, false)}
                                                                                            <input onChange={(e) => selectService(e, service)}
                                                                                                type="checkbox"
                                                                                                checked={select} />
                                                                                        </div>
                                                                                        <button className="next_block-btn "
                                                                                            onClick={e => selectService({ target: { checked: !select } }, service)}
                                                                                            style={{ backgroundColor: BUTTON_COLORS_BY_NUMBER[info.buttonColor] || undefined, }}
                                                                                        > {t("Выбрать")}</button>
                                                                                    </div>
                                                                                </label>
                                                                            </div>
                                                                        </li>
                                                                    }
                                                                }
                                                                )}
                                                        </div>
                                                    </MediaQuery>

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
                </div>
            </div >
        );
    }
}

export default withTranslation("common")(TabTwo);
