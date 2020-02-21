import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {withRouter} from "react-router-dom";
import {ClientDetails} from "./ClientDetails";
import {staffActions} from "../../_actions";

class TabSix extends  PureComponent {
    constructor(props){
        super(props);

        this.state = {
            approveF: false,
        };
        this.onCancelVisit = this.onCancelVisit.bind(this);
        this.setterApproveF = this.setterApproveF.bind(this);
        this.toggleAllVisits = this.toggleAllVisits.bind(this);
    }
    toggleAllVisits() {
        this.setState({ allVisits: !this.state.allVisits });
    }
    onCancelVisit() {
        this.setState({...this.state, approveF: true});
        setTimeout(() => this.approvedButtons.scrollIntoView({ behavior: "smooth" }), 100);
    }
    setterApproveF(){
        this.setState({...this.state, approveF: false})
    }
    render() {

        const {selectedStaff,selectedService,selectedServices,selectedDay,selectedTime,newAppointments, getDurationForCurrentStaff,
            setScreen,refreshTimetable, info,_delete, _move, setDefaultFlag, movedVisitSuccess, movingVisit} = this.props;
        const {approveF, allVisits} = this.state;

        let serviceInfo = null
        if (selectedService.serviceId) {
            let priceFrom = 0;
            let priceTo= 0;
            let duration = 0;
            let totalAmount = 0
            selectedServices.forEach((service) => {
                priceFrom += parseInt(service.priceFrom)
                priceTo += parseInt(service.priceTo)
                duration += parseInt(getDurationForCurrentStaff(service))
            })
            newAppointments && newAppointments[0] && newAppointments[0].discountPercent && newAppointments.forEach(( appointment => {
                totalAmount += appointment.totalAmount
            }))

            serviceInfo = (
                <div style={{ display: 'inline-block' }} className="supperVisDet service_item">
                    {(selectedServices.length===1)?<p>{selectedServices[0].name}</p>:
                        (<p>Выбрано услуг: <strong className="service_item_price">{selectedServices.length}</strong></p>)}
                    <p className={selectedServices.some((service) => service.priceFrom!==service.priceTo) && 'sow'}><strong className="service_item_price">{priceFrom}{priceFrom!==priceTo && " - "+priceTo}&nbsp;</strong> <span>{selectedServices[0] && selectedServices[0].currency}</span></p>
                    <span style={{ width: '100%' }} className="runtime">
                        <strong>{moment.duration(parseInt(duration), "seconds").format("h[ ч] m[ мин]")}</strong>
                        {newAppointments && newAppointments[0] && priceFrom===priceTo && !!newAppointments[0].discountPercent && <span>({totalAmount} {newAppointments[0].currency})</span>}
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
            <div className="service_selection final-screen">

                <div className="final-book">
                    <p>Запись успешно {movedVisitSuccess ? 'перенесена' : 'создана'}</p>
                </div>
                <div className="specialist">
                    {selectedStaff.staffId &&
                    <div>
                        <p className="img_container">
                            <img src={selectedStaff.imageBase64 ? "data:image/png;base64,"+selectedStaff.imageBase64 : `${process.env.CONTEXT}public/img/image.png`} alt=""/>
                            <span>{selectedStaff.firstName} {selectedStaff.lastName}</span>
                        </p>
                    </div>
                    }

                    {/*{selectedService.serviceId &&*/}
                    {/*<div className="supperVisDet" >*/}
                    {/*    */}

                    {/*</div>*/}
                    {/*}*/}
                    {serviceInfo}
                    {selectedDay &&
                    <div className="date_item_popup">
                        <strong>{moment(selectedDay).locale('ru').format('DD MMMM YYYY')}</strong>
                    </div>
                    }
                    {selectedTime &&
                    <div className="date_item_popup">
                        <strong>{moment(selectedTime, 'x').format('HH:mm')}</strong>
                    </div>
                    }
                </div>

                <p style={{
                    textDecoration: 'underline',
                    textAlign: 'center',
                    fontSize: '12px',
                    marginBottom: '8px'
                }}>Цены указаны на основе прайс-листа. Окончательная стоимость формируется на месте оказания услуги.</p>

                {info && info.appointmentMessage && <p style={{
                    color: 'red',
                    textDecoration: 'underline',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: '13px',
                    marginBottom: '8px'
                }}>{info.appointmentMessage}</p>}

                {newAppointments && newAppointments[0] && !!newAppointments[0].discountPercent &&
                    <p style={{
                        textAlign: 'center',
                        fontSize: '18px',
                        marginBottom: '8px'
                    }}>Ваша персональная скидка составит: {newAppointments[0].discountPercent}%</p>
                }
                {!(movingVisit && movingVisit[0] && movingVisit[0].coStaffs && movingVisit[0].coStaffs.length > 0) && <div style={{ position: 'relative', width: '210px', margin: '0 auto' }}>
                    <input style={{ backgroundColor: '#f3a410' }} type="submit" className="cansel-visit" value="Перенести визит" onClick={() => {
                        const clientId = (!(newAppointments && newAppointments[0]) && movingVisit) ? movingVisit[0].clientId : newAppointments[0].clientId;
                        this.props.dispatch(staffActions.getClientAppointments(this.props.match.params.company, clientId, 1))
                        _move((!(newAppointments && newAppointments[0]) && movingVisit) ? movingVisit : newAppointments.sort((a, b) => a.appointmentId - b.appointmentId))
                    }}/>
                    <span className="move-white" />
                </div>}
                <div style={{ position: 'relative', width: '210px',  margin: '0 auto' }}>
                    <input style={{ backgroundColor: '#d41316', marginTop: '16px' }} type="submit" className="cansel-visit" value="Отменить визит" onClick={() => this.onCancelVisit()}/>
                    <span className="cancel-white" />
                </div>
                {approveF && <div ref={(el) => {this.approvedButtons = el;}} className="approveF">
                    <button className="approveFYes"  onClick={()=>{
                        const resultAppointments = (movingVisit && movingVisit.length > 0) ? movingVisit : newAppointments
                        if (resultAppointments.length ) {
                            if (resultAppointments[0] && resultAppointments[0].customId ) {
                                _delete(resultAppointments[0].customId)
                            }
                            this.props.dispatch(staffActions.toggleStartMovingVisit(false, []));
                            this.props.dispatch(staffActions.toggleMovedVisitSuccess(false));
                        }
                    }}>Да
                    </button>
                    <button className="approveFNo" onClick={()=>this.setterApproveF()}>Нет
                    </button>
                </div>
                }
                {/*<input type="submit" className="all-visits" value="Все визиты" onClick={() => this.toggleAllVisits()}/>*/}
                {/*{allVisits && <ClientDetails />}*/}
                {/*<p className="skip_employee"  onClick={() => {*/}
                {/*    setScreen(2);*/}
                {/*    refreshTimetable();*/}
                {/*    setDefaultFlag();*/}
                {/*}}> Создать запись</p>*/}
                <a href={`/online/${this.props.match.params.company}`} onClick={() => {
                    this.props.dispatch(staffActions.toggleMovedVisitSuccess(false));
                }} className="skip_employee" >Создать запись</a>
            </div>
        );
    }
}
export default connect()(withRouter(TabSix));
