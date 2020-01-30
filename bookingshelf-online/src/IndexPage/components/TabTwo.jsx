import React, {Component} from 'react';
import moment from 'moment';

class TabTwo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: ''
        }
    }

    render() {

        const {selectedServices, getDurationForCurrentStaff, setScreen, flagAllStaffs, refreshTimetable, serviceGroups, selectedStaff,services, selectedService,servicesForStaff, selectService, setDefaultFlag} = this.props;
        const { searchValue } = this.state;
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
                    <span className="prev_block" onClick={() => {
                        setScreen(1);
                        refreshTimetable();
                        setDefaultFlag();
                    }}>Назад</span>
                    <p className="modal_title">Выбор услуги</p>
                    {!!selectedServices.length && <span className="next_block" onClick={() => {
                        if (selectedServices.length) {
                            setScreen(flagAllStaffs ? 1 : 3);
                        }
                        refreshTimetable();
                    }}>Далее</span>}
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
                                <input style={{ margin: 0, paddingLeft: '38px' }} type="search" placeholder="Введите название или описание услуги"
                                       aria-label="Search" ref={input => this.search = input} onChange={(e) => this.setState({ searchValue: e.target.value })}/>
                            </div>
                        </div>
                        <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
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
                                    finalServices = finalServices.filter(service =>
                                        service.name.toLowerCase().includes(this.search.value.toLowerCase())
                                        || service.details.toLowerCase().includes(this.search.value.toLowerCase())
                                    )
                                }

                                return condition && finalServices && finalServices.length > 0 && (
                                    <ul className="service_list">
                                        <h3 style={{ fontSize: '22px', fontWeight: 'bold', textDecoration: 'underline'}}>{serviceGroup.name}</h3>
                                        {finalServices
                                            .sort((a, b) => a.duration - b.duration).map((service, serviceKey) =>
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
                                                            className="runtime"><strong>{moment.duration(parseInt(getDurationForCurrentStaff(service)), "seconds").format("h[ ч] m[ мин]")}</strong></span>

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
                ) : (
                    <div className="final-book">
                        <p>Нет доступных услуг</p>
                    </div>
                )}

                {!!selectedServices.length &&
                <div className="button_block" onClick={() => {
                    if (selectedServices.length) {
                        setScreen(flagAllStaffs ? 1 : 3);
                    }
                    refreshTimetable();
                }}>
                    <button className="button load">Продолжить</button>
                </div>}
            </div>
        );
    }
}
export default TabTwo;
