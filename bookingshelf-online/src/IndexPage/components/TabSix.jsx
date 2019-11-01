import React, {PureComponent} from 'react';
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
    render() {

        const {selectedStaff,selectedService,selectedServices,selectedDay,selectedTime,newAppointments,
            setScreen,refreshTimetable,_delete, _move, setDefaultFlag, movedVisitSuccess, movingVisit} = this.props;
        const {approveF, allVisits} = this.state;

        let serviceInfo = null
        if (selectedService.serviceId) {
            let priceFrom = 0;
            let priceTo= 0;
            let duration = 0;
            selectedServices.forEach((service) => {
                priceFrom += parseInt(service.priceFrom)
                priceTo += parseInt(service.priceTo)
                duration += parseInt(service.duration)
            })

            serviceInfo = (
                <div className="service_item">
                    {(selectedServices.length===1)?<p>{selectedServices[0].name}</p>:
                        (<p>Выбрано услуг: <strong>{selectedServices.length}</strong></p>)}
                    <p className={selectedServices.some((service) => service.priceFrom!==service.priceTo) && 'sow'}><strong>{priceFrom}{priceFrom!==priceTo && " - "+priceTo} </strong> <span>{selectedServices[0].currency}</span></p>
                    <span className="runtime"><strong>{moment.duration(parseInt(duration), "seconds").format("h[ ч] m[ мин]")}</strong></span>
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
                <div style={{ position: 'relative', width: '210px', margin: '0 auto' }}>
                    <input style={{ backgroundColor: '#f3a410' }} type="submit" className="cansel-visit" value="Перенести визит" onClick={() => {
                        _move((!(newAppointments && newAppointments[0]) && movingVisit) ? movingVisit : newAppointments[0])
                    }}/>
                    <span className="move-white" />
                </div>
                <div style={{ position: 'relative', width: '210px',  margin: '0 auto' }}>
                    <input style={{ backgroundColor: '#d41316', marginTop: '16px' }} type="submit" className="cansel-visit" value="Отменить визит" onClick={() => this.onCancelVisit()}/>
                    <span className="cancel-white" />
                </div>
                {approveF && <div ref={(el) => {this.approvedButtons = el;}} className="approveF">
                    <button className="approveFYes"  onClick={()=>{
                        const resultAppointments = movingVisit ? [movingVisit] : newAppointments
                        if (resultAppointments.length ) {
                            resultAppointments.forEach((newAppointment, i) => setTimeout(() => newAppointment && newAppointment.customId && _delete(newAppointment.customId), 1000 * i))
                            this.props.dispatch(staffActions.toggleStartMovingVisit(false, {}));
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
    onCancelVisit() {
        this.setState({...this.state, approveF: true});
        setTimeout(() => this.approvedButtons.scrollIntoView({ behavior: "smooth" }), 100);
    }
    setterApproveF(){
        this.setState({...this.state, approveF: false})
    }
}
export default withRouter(TabSix);
