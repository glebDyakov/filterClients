import React, {Component} from 'react';
import moment from 'moment';
import { getFirstScreen } from "../../_helpers/common";
import { staffActions } from "../../_actions";
import {withTranslation} from "react-i18next";

class TabTwo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: ''
        }
    }

    render() {

        const {selectedServices, info, isLoading, match, history, subcompanies, firstScreen, isStartMovingVisit, clearSelectedServices, getDurationForCurrentStaff, setScreen, flagAllStaffs, refreshTimetable, serviceGroups, selectedStaff,services, selectedService,servicesForStaff, selectService, setDefaultFlag ,t} = this.props;
        const { searchValue } = this.state;
        if (info && (info.bookingPage === match.params.company) && !info.onlineZapisOn && (parseInt(moment().utc().format('x')) >= info.onlineZapisEndTimeMillis)) {
            return (
                <div className="online-zapis-off">
                    {t("Онлайн-запись отключена...")}
                    {(subcompanies.length > 1) && (
                        <button onClick={() => {
                            setScreen(0)
                            this.props.dispatch(staffActions.clearError());
                            let {company} = match.params;
                            let url = company.includes('_') ? company.split('_')[0] : company
                            history.push(`/${url}`)
                        }} style={{ marginTop: '4px', marginBottom: '20px' }} className="book_button">{t("На страницу выбора филиалов")}</button>
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

        let serviceInfo = null
        if (selectedService.serviceId) {
            let priceFrom = 0;
            let priceTo= 0;
            let duration = 0;
            selectedServices.forEach((service) => {
                priceFrom += parseInt(service.priceFrom)
                priceTo += parseInt(service.priceTo)
                duration += parseInt(getDurationForCurrentStaff(service))
            })

            serviceInfo = (
                <div style={{ display: 'inline-block' }} className="supperVisDet service_item">
                    {(selectedServices.length===1)?<p>{selectedServices[0].name}</p>:
                        (<p>{t("Выбрано услуг")}: <strong className="service_item_price">{selectedServices.length}</strong></p>)}
                    <p className={selectedServices.some((service) => service.priceFrom!==service.priceTo) && 'sow'}><strong className="service_item_price">{priceFrom}{priceFrom!==priceTo && " - "+priceTo}&nbsp;</strong> <span>{selectedServices[0] && selectedServices[0].currency}</span></p>
                    <span style={{ width: '100%' }} className="runtime">
                        <strong>{moment.duration(parseInt(duration), "seconds").format(`h[ ч] m[ ${t("минут")}]`)}</strong>
                    </span>
                    <div className="supperVisDet_info">
                        <p className="supperVisDet_info_title">{t("Список услуг")}:</p>
                        {selectedServices.map(service => (
                            <p>• {service.name}</p>
                        ))}
                        <span className="supperVisDet_closer" />
                    </div>
                    <img className="tap-service-icon" src={`${process.env.CONTEXT}public/img/tap-service.svg`}/>
                </div>
            )
        }

        return  info && (info.bookingPage === match.params.company) && (info.onlineZapisOn || (!info.onlineZapisOn && (parseInt(moment().utc().format('x')) < info.onlineZapisEndTimeMillis))) && (
            <div className="service_selection screen1">
                <div className="title_block">
                    {(getFirstScreen(firstScreen) === 2 ? (subcompanies.length > 1) : true) && <span className="prev_block" onClick={() => {
                        if (getFirstScreen(firstScreen) === 2) {
                            if (!isStartMovingVisit) {
                                clearSelectedServices()
                            }
                            setDefaultFlag();
                            setScreen(0);
                            let {company} = match.params;
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
                    <p className="modal_title">{t("Выбор услуги")}</p>
                    {!!selectedServices.length && <span className="next_block" onClick={() => {
                        if (selectedServices.length) {
                            setScreen(3);
                        }
                        refreshTimetable();
                    }}><span className="title_block_text">{t("Далее")}</span></span>}
                </div>
                {selectedStaff.staffId && <div className="specialist">
                    <div>
                        <p className="img_container">
                            <img
                                src={selectedStaff.imageBase64 ? "data:image/png;base64," + selectedStaff.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                alt=""/>
                            <span style={userNameStyle}>{selectedStaff.firstName} <br/>{selectedStaff.lastName ? selectedStaff.lastName : ''}</span>
                        </p>

                    </div>
                    {serviceInfo && serviceInfo}

                </div>}

                {isServiceList ? serviceGroups.length > 0 && (
                    <React.Fragment>
                        <div className="row align-items-center content clients mb-2 search-block">
                            <div className="search col-12">
                                <img style={{ position: 'absolute', left: '20px' }} src={`${process.env.CONTEXT}public/img/search-icon.svg`} />
                                <input style={{ margin: 0, paddingLeft: '38px' }} type="search" placeholder={t("Введите название или описание услуги")}
                                       aria-label="Search" ref={input => this.search = input} onChange={(e) => this.setState({ searchValue: e.target.value })}/>
                            </div>
                        </div>
                        <div style={{ maxHeight: `calc(100% - ${flagAllStaffs ? 90 : 200}px)`, overflowY: 'auto' }}>
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
                                    )
                                }

                                return condition && finalServices && finalServices.length > 0 && (
                                    <ul className="service_list">
                                        <h3 style={{ fontSize: '22px', fontWeight: 'bold', textDecoration: 'underline'}}>{serviceGroup.name}</h3>
                                        {finalServices
                                            .map((service, serviceKey) =>
                                            <li
                                                className={selectedService && selectedService.serviceId === service.serviceId && 'selected'}
                                            >
                                                <div className="service_item">
                                                    <label>

                                                        <p>{service.name}</p>
                                                        <p>
                                                            <strong>{service.priceFrom}{service.priceFrom !== service.priceTo && " - " + service.priceTo} </strong>
                                                            <span>{service.currency}</span>
                                                            <input onChange={(e) => selectService(e, service)} type="checkbox"
                                                                   checked={selectedServices.some(selectedService => selectedService.serviceId === service.serviceId)}/>
                                                            <span className="checkHelper"/>
                                                        </p>
                                                        <span className="runtime">{service.details}</span>

                                                        <span
                                                            className="runtime"><strong>{moment.duration(parseInt(getDurationForCurrentStaff(service)), "seconds").format(`h[ ч] m[ ${t("минут")}]`)}</strong></span>

                                                    </label>
                                                </div>
                                            </li>
                                        )}

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
                )}

                {!!selectedServices.length &&
                <div className="button_block" onClick={() => {
                    if (selectedServices.length) {
                        setScreen(3);
                    }
                    refreshTimetable();
                }}>
                    <button style={{ marginTop: '4px', marginBottom: '20px' }} className="button load">{t("Продолжить")}</button>
                </div>}
            </div>
        );
    }
}

export default withTranslation("common")(TabTwo);
