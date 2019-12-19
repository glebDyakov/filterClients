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

        const {selectedStaff,selectedService,selectedServices,selectedDay,selectedTime,newAppointments,
            setScreen,refreshTimetable,_delete, _move, setDefaultFlag, movedVisitSuccess, movingVisit} = this.props;
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
                duration += parseInt(service.duration)
            })
            newAppointments && newAppointments[0] && newAppointments[0].discountPercent && newAppointments.forEach(( appointment => {
                totalAmount += appointment.totalAmount
            }))

            serviceInfo = (
                <div style={{ display: 'inline-block' }} className="supperVisDet service_item">
                    {(selectedServices.length===1)?<p>{selectedServices[0].name}</p>:
                        (<p>Выбрано услуг: <strong>{selectedServices.length}</strong></p>)}
                    <p className={selectedServices.some((service) => service.priceFrom!==service.priceTo) && 'sow'}><strong>{priceFrom}{priceFrom!==priceTo && " - "+priceTo}&nbsp;</strong> <span>{selectedServices[0].currency}</span></p>
                    <span style={{ width: '100%' }} className="runtime">
                        <strong>{moment.duration(parseInt(duration), "seconds").format("h[ ч] m[ мин]")}</strong>
                        {newAppointments && newAppointments[0] && !!newAppointments[0].discountPercent && <span>({totalAmount} {newAppointments[0].currency})</span>}
                    </span>
                    <div className="supperVisDet_info">
                        <p className="supperVisDet_info_title">Список услуг:</p>
                        {selectedServices.map(service => (
                            <p>• {service.name}</p>
                        ))}
                        <span className="supperVisDet_closer" />
                    </div>
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
                {newAppointments && newAppointments[0] && !!newAppointments[0].discountPercent &&
                    <p style={{
                        textAlign: 'center',
                        fontSize: '18px',
                        marginBottom: '8px'
                    }}>Ваша персональная скидка составит: {newAppointments[0].discountPercent}%</p>
                }
                {<div style={{ position: 'relative', width: '210px', margin: '0 auto' }}>
                    <input style={{ backgroundColor: '#f3a410' }} type="submit" className="cansel-visit" value="Перенести визит" onClick={() => {
                        this.props.dispatch(staffActions.getClientAppointments(this.props.match.params.company))
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
                        const resultAppointments = movingVisit ? movingVisit : newAppointments
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
                <input type="submit" className="all-visits" value="Все визиты" onClick={() => this.toggleAllVisits()}/>
                {allVisits && <ClientDetails />}
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
