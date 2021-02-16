import React, { Component } from 'react';
import moment from 'moment';
import { getFirstScreen } from "../../_helpers/common";
import { staffActions } from "../../_actions";
import { withTranslation } from "react-i18next";
import search_icon from "../../../public/img/icons/header-search.svg";

class TabTwo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: ''
        }
    }

    render() {

        const { selectedServices, info, isLoading, match, history, subcompanies, firstScreen, isStartMovingVisit, clearSelectedServices, getDurationForCurrentStaff, setScreen, flagAllStaffs, refreshTimetable, serviceGroups, selectedStaff, services, selectedService, servicesForStaff, selectService, setDefaultFlag, t } = this.props;
        const { searchValue } = this.state;
        if (info && (info.bookingPage === match.params.company) && !info.onlineZapisOn && (parseInt(moment().utc().format('x')) >= info.onlineZapisEndTimeMillis)) {
            return (
                <div className="online-zapis-off">
                    {t("Онлайн-запись отключена...")}
                    {(subcompanies.length > 1) && (
                        <button onClick={() => {
                            setScreen(0)
                            this.props.dispatch(staffActions.clearError());
                            let { company } = match.params;
                            let url = company.includes('_') ? company.split('_')[0] : company
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
                <div className="specialist">
                    <div className="specialist-block">
                        <div className="supperVisDet service_footer-block">
                            <div className="service_footer_price">
                                <p style={{
                                    color: 'white',
                                    fontSize: `${sizeWords}`,
                                    lineHeight: "49px",
                                }}>{priceFrom}{priceFrom !== priceTo && " - " + priceTo}&nbsp;</p>
                                <span>{selectedServices[0] && selectedServices[0].currency}</span>
                            </div>
                            <p style={{
                                color: 'white',
                                fontSize: "13px",
                                lineHeight: "18px",
                                letterSpacing: "0.1px",
                                paddingLeft: `${padding_left}`,
                            }}>{t("Выбрано услуг")}: {selectedServices.length}</p>
                            <p style={{
                                color: 'white',
                                fontSize: "13px",
                                lineHeight: "18px",
                                letterSpacing: "0.1px",
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
                    </div>
                </div>
            )
        }
        return info && (info.bookingPage === match.params.company) && (info.onlineZapisOn || (!info.onlineZapisOn && (parseInt(moment().utc().format('x')) < info.onlineZapisEndTimeMillis))) && (
            <div className="service_selection screen1">
                <div className="title_block service-title">
                    {(getFirstScreen(firstScreen) === 2 ? (subcompanies.length > 1) : true) &&
                        <span className="prev_block service-prev" onClick={() => {
                            if (getFirstScreen(firstScreen) === 2) {
                                if (!isStartMovingVisit) {
                                    clearSelectedServices()
                                }
                                setDefaultFlag();
                                setScreen(0);
                                let { company } = match.params;
                                let url = company.includes('_') ? company.split('_')[0] : company
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
                    <div className="row align-items-center content clients mb-2 search-block">
                        <div className="search col-12">
                            <img style={{ position: 'absolute', right: '26px' }}
                                // src={`${process.env.CONTEXT}public/img/header-search.svg`} />
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
                {/* {selectedStaff.staffId && */}
                {selectedServices[0] && serviceInfo}

                {isServiceList ? serviceGroups.length > 0 && (
                    <React.Fragment>
                        <div style={{ marginTop: "17px", }}>
                            {serviceGroups.map(serviceGroup => {
                                let { services } = serviceGroup
                                let condition =
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
                                    <ul className="service_list">
                                        <div className="service_list_name">
                                            <h3>{serviceGroup.name}</h3>
                                        </div>
                                        <div className="service_items">
                                            {finalServices
                                                .map((service, serviceKey) => {
                                                    let select = selectedServices.some(selectedService => selectedService.serviceId === service.serviceId);
                                                    if (select) {
                                                        return <li
                                                            className={selectedService && selectedService.serviceId === service.serviceId && `selected `}
                                                            style={{
                                                                backgroundColor: "rgba(62, 80, 247)"
                                                            }}
                                                        >
                                                            <div className="service_item" >
                                                                <label className="service-block">
                                                                    <p className="white_text" >{service.name}</p>
                                                                    <span className="runtime white_text" >{service.details}</span>
                                                                    <span
                                                                        className="runtime black-fone" style={{
                                                                            opacity: `1`,
                                                                            backgroundColor: "rgba(255, 255, 255, 0.07)"
                                                                        }}><strong className="white_text">{moment.duration(parseInt(getDurationForCurrentStaff(service)), "seconds").format(`h[ ${t("ч")}] m[ ${t("минут")}]`)}</strong></span>
                                                                    <div className="service-price">
                                                                        <div className="service-price-text">
                                                                            <strong className="white_text">{service.priceFrom}{service.priceFrom !== service.priceTo && " - " + service.priceTo} </strong>
                                                                            <span className="white_text">{service.currency}</span>
                                                                            <input onChange={(e) => selectService(e, service)}
                                                                                type="checkbox"
                                                                                checked={select} />
                                                                        </div>
                                                                        <button className="next_block-btn white_border"
                                                                            onClick={e => selectService({ target: { checked: !select } }, service)}
                                                                        > Выбрать</button>
                                                                    </div>
                                                                </label>
                                                            </div>
                                                        </li>
                                                    } else {
                                                        return <li
                                                            className={selectedService && selectedService.serviceId === service.serviceId && `selected `}
                                                        >
                                                            <div className="service_item" >
                                                                <label className="service-block">
                                                                    <p >{service.name}</p>
                                                                    <span className="runtime" >{service.details}</span>
                                                                    <span
                                                                        className="runtime black-fone" ><strong >{moment.duration(parseInt(getDurationForCurrentStaff(service)), "seconds").format(`h[ ${t("ч")}] m[ ${t("минут")}]`)}</strong></span>
                                                                    <div className="service-price">
                                                                        <div className="service-price-text" >
                                                                            <strong >{service.priceFrom}{service.priceFrom !== service.priceTo && " - " + service.priceTo} </strong>
                                                                            <span >{service.currency}</span>
                                                                            <input onChange={(e) => selectService(e, service)}
                                                                                type="checkbox"
                                                                                checked={select} />
                                                                        </div>
                                                                        <button className="next_block-btn"
                                                                            onClick={e => selectService({ target: { checked: !select } }, service)}
                                                                        > Выбрать</button>
                                                                    </div>
                                                                </label>
                                                            </div>
                                                        </li>
                                                    }

                                                }

                                                )}
                                        </div>

                                        {/*{!servicesForStaff && selectedStaff && selectedStaff.length === 0 && services && services.map((service, serviceKey) =>*/}
                                        {/*    <li*/}
                                        {/*        className={selectedService && selectedService.serviceId === service.serviceId && 'selected'}*/}
                                        {/*    >*/}
                                        {/*        <div className="service_item">*/}
                                        {/*            <label>*/}

                                        {/*                <p>{service.name}</p>*/}
                                        {/*                <p>*/}
                                        {/*                    <strong>{service.priceFrom}{service.priceFrom !== service.priceTo && " - " + service.priceTo} </strong>*/}
                                        {/*                    <span>{service.currency}</span>*/}
                                        {/*                    <input onChange={(e) => selectService(e, service)} type="checkbox"*/}
                                        {/*                           checked={selectedServices.some(selectedService => selectedService.serviceId === service.serviceId)}/>*/}
                                        {/*                    <span className="checkHelper"/>*/}
                                        {/*                </p>*/}
                                        {/*                <span className="runtime">{service.details}</span>*/}

                                        {/*                <span*/}
                                        {/*                    className="runtime"><strong>{moment.duration(parseInt(service.duration), "seconds").format("h[ ч] m[ мин]")}</strong></span>*/}

                                        {/*            </label>*/}
                                        {/*        </div>*/}
                                        {/*    </li>*/}
                                        {/*)}*/}


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
