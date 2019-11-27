import React, {Component} from 'react';
import moment from 'moment'

class TabTwo extends Component {

    render() {

        const {selectedServices, setScreen,refreshTimetable, serviceGroups, selectedStaff,services, selectedService,servicesForStaff, selectService, setDefaultFlag} = this.props;
        const userNameStyle = {}
        if ((selectedStaff.firstName && selectedStaff.firstName.length > 15) || (selectedStaff.lastName && selectedStaff.lastName > 15)) {
            userNameStyle.fontSize = '13px'
        }
        const isServiceList = serviceGroups.some(serviceGroup => {
            let { services } = serviceGroup
            return services && services.some(service => selectedStaff.staffId && service.staffs && service.staffs.some(st => st.staffId === selectedStaff.staffId)) ||
                !servicesForStaff && selectedStaff && selectedStaff.length === 0
        })

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
                        setScreen(3);
                        refreshTimetable()
                    }}>Вперед</span>}
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
                    <div className="supperVisDet">
                        {(selectedServices.length === 1) ? <p>{selectedServices[0].name && selectedServices[0].name.length > 85 ? `${selectedServices[0].name.slice(0, 85)}...` : selectedServices[0].name}</p> :
                            (<p>Выбрано услуг: <br/>
                                <p><strong>{selectedServices.length}</strong></p></p>)}
                        <div className="supperVisDet_info">
                            <p className="supperVisDet_info_title">Список услуг:</p>
                            {selectedServices.map(service => (
                                <p>{service.name}</p>
                            ))}
                            <span className="supperVisDet_closer" />
                        </div>
                    </div>

                </div>}
                {isServiceList ? serviceGroups.map(serviceGroup => {
                    let { services } = serviceGroup
                    let condition =
                        services && services.some(service => selectedStaff.staffId && service.staffs && service.staffs.some(st => st.staffId === selectedStaff.staffId)) ||
                        !servicesForStaff && selectedStaff && selectedStaff.length === 0
                    return condition && (
                        <ul className="service_list">
                            <h3 style={{ fontSize: '22px', fontWeight: 'bold', textDecoration: 'underline'}}>{serviceGroup.name}</h3>
                            {services && services.sort((a, b) => a.duration - b.duration).map((service, serviceKey) =>
                                selectedStaff.staffId && service.staffs && service.staffs.some(st => st.staffId === selectedStaff.staffId) &&
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
                                                className="runtime"><strong>{moment.duration(parseInt(service.duration), "seconds").format("h[ ч] m[ мин]")}</strong></span>

                                        </label>
                                    </div>
                                </li>
                            )}
                            {!servicesForStaff && selectedStaff && selectedStaff.length === 0 && services && services.map((service, serviceKey) =>
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
                                                className="runtime"><strong>{moment.duration(parseInt(service.duration), "seconds").format("h[ ч] m[ мин]")}</strong></span>

                                        </label>
                                    </div>
                                </li>
                            )}



                        </ul>
                    )
                }) : (
                    <div className="final-book">
                        <p>Нет доступных услуг</p>
                    </div>
                )}

                {!!selectedServices.length &&
                <div className="button_block" onClick={() => {
                    selectedServices.length && setScreen(3);
                    refreshTimetable();
                }}>
                    <button className="button load">Продолжить</button>
                </div>}
            </div>
        );
    }
}
export default TabTwo;
