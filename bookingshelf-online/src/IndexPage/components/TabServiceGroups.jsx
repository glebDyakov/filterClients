import React, {PureComponent} from 'react';
import {staffActions} from "../../_actions";
import { connect } from 'react-redux';


class TabServiceGroups extends  PureComponent{
    componentDidMount() {
        let {company} = this.props.match.params

        this.props.dispatch(staffActions.getServiceGroups(company));
    }

    render() {

        const {selectedServiceGroup,staffs, subcompanies, history, match, clearStaff, nearestTime, selectServiceGroup, serviceGroups, info, setScreen, refreshTimetable, roundDown} = this.props;


        return(
            <div className="service_selection screen1">
                <div className="title_block n">
                    {subcompanies.length > 1 && (
                        <span className="prev_block" onClick={() => {
                            clearStaff()
                            setScreen(0);
                            let {company} = match.params;
                            let url = company.includes('_') ? company.split('_')[0] : company
                            history.push(`/${url}`)

                        }}>К выбору филиала</span>
                    )}
                    <p className="modal_title">Выбор группы услуг</p>
                    {selectedServiceGroup.serviceGroupId &&
                    <span className="next_block" onClick={() => {
                        setScreen(1);
                    }}>Вперед</span>}
                </div>
                <ul className={`staff_popup`}>
                    {serviceGroups.map((serviceGroup, idStaff) =>


                        <li className={(selectedServiceGroup.serviceGroupId === serviceGroup.serviceGroupId && 'selected') + ' nb'}
                            onClick={() => selectServiceGroup(serviceGroup)}
                            key={idStaff}
                        >
                            <span className="staff_popup_item">
                                <div className="img_container">
                                    <img
                                        src={serviceGroup.imageBase64 ? "data:image/png;base64," + serviceGroup.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                        alt=""/>
                                    <span className="staff_popup_name">{serviceGroup.name}<br/>
                                        <span style={{ fontSize: "13px"}}>{serviceGroup.description}</span>
                                    </span>
                                </div>


                                {/*{nearestTime && nearestTime.map((time, id)=>*/}
                                {/*    time.staffId===staff.staffId && time.availableDays.length!==0 &&*/}
                                {/*    <React.Fragment>*/}
                                {/*        <div className="mobile_block mobile-visible" key={'time'+id}>*/}
                                {/*            <span>Ближ. запись</span>*/}
                                {/*            <div className="stars" style={{textTransform: 'capitalize'}}>{roundDown(parseInt(time.availableDays[0].availableTimes[0].startTimeMillis))}</div>*/}
                                {/*        </div>*/}
                                {/*        <div className="mobile_block desktop-visible" key={'time'+id}>*/}
                                {/*            <span className="nearest_appointment">Ближайшая запись</span>*/}
                                {/*            <div className="stars" style={{textTransform: 'capitalize'}}>{roundDown(parseInt(time.availableDays[0].availableTimes[0].startTimeMillis))}</div>*/}
                                {/*        </div>*/}
                                {/*    </React.Fragment>*/}

                                {/*)}*/}

                                {/*{nearestTime && !nearestTime.some((time, id)=>*/}
                                {/*    time.staffId===staff.staffId && time.availableDays.length!==0*/}

                                {/*) && <div className="mobile_block">*/}
                                {/*    <span style={{fontWeight: 'bold'}}>Нет записи</span>*/}
                                {/*</div>*/}


                                {/*}*/}



                            </span>
                        </li>
                    )}
                </ul>
            </div>
        );
    }
}
export default connect()(TabServiceGroups);