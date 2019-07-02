import React, {Component} from 'react';
import moment from 'moment'

class TabTwo extends Component {

    render() {

        const {selectedServices, setScreen,refreshTimetable,selectedStaff,services, selectedService,servicesForStaff, selectService} = this.props;


        return (
            <div className="service_selection screen1">
                <div className="title_block">
                    <span className="prev_block" onClick={() => {
                        setScreen(1);
                        refreshTimetable()
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
                            <span>{selectedStaff.firstName} <br/>{selectedStaff.lastName}</span>
                        </p>

                    </div>
                    <div className="supperVisDet">
                        {(selectedServices.length === 1) ? <p>{selectedServices[0].name}</p> :
                            (<p>Выбрано услуг: <br/>
                                <p><strong>{selectedServices.length}</strong></p></p>)}

                    </div>
                </div>}
                <ul className="service_list">
                    {services && services.map((service, serviceKey) =>
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
                                    <span
                                        className="runtime"><strong>{moment.duration(parseInt(service.duration), "seconds").format("h[ ч] m[ мин]")}</strong></span>

                                </label>
                            </div>
                        </li>
                    )}
                    {
                        !servicesForStaff && <div className="final-book">
                            <p>Нет доступных услуг</p>
                        </div>
                    }

                </ul>

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
