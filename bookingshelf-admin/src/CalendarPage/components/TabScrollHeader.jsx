import React, {PureComponent} from 'react';

import moment from 'moment';

class TabScrollHeader extends PureComponent {

    render() {
        const {selectedDays, availableTimetable,availableTimetableMessage, timetable, closedDates, staff  } =this.props;

        return(
            <React.Fragment>
                {selectedDays.length === 1 && (
                    <div
                        className="fixed-tab"
                        // style={{
                        //     'minWidth': (120*parseInt(timetable && timetable.length))+'px'
                        // }}
                    >
                        <div className="tab-content-list tab-content-list-first">
                            {(availableTimetable || availableTimetableMessage) && <div className="hours"><span></span></div>}

                            {availableTimetable && availableTimetable.map((workingStaffElement) => {
                                const activeStaff = staff && staff.find(staffItem => staffItem.staffId === workingStaffElement.staffId);

                                return <div>
                                     <span className="img-container">
                                         <img className="rounded-circle"
                                              src={activeStaff && activeStaff.imageBase64 ? "data:image/png;base64," + activeStaff.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                              alt=""/>
                                     </span>
                                    <p>{workingStaffElement.firstName + " " + (workingStaffElement.lastName ? workingStaffElement.lastName : '') }</p>
                                </div>
                                }
                            )

                            }
                            {availableTimetableMessage && <div><p>{availableTimetableMessage}</p></div>}
                        </div>
                    </div>

                )}
                <div className="fixed-tab"
                     //style={{'minWidth': (120*parseInt(timetable && timetable.length))+'px'}}
                >
                    <div className="tab-content-list">
                        {selectedDays.length>1 && <div className="hours"><span></span></div>}

                        {
                            selectedDays.length>1 && selectedDays.map((item, weekKey)=> {

                                    let clDate= closedDates && closedDates.some((st) =>
                                        parseInt(st.startDateMillis) <= parseInt(moment(item).format("x")) &&
                                        parseInt(st.endDateMillis) >= parseInt(moment(item).format("x")))

                                    return <div key={weekKey}
                                    >
                                        <p className="text-capitalize">{moment(item).locale("ru").format('dddd')}<span className={clDate && 'closedDate'}>{clDate ? 'выходной' : moment(item).format("DD/MM")}</span>
                                        </p>
                                    </div>
                                }
                            )
                        }
                    </div>
                </div>

            </React.Fragment>
        )
    }

}
export default TabScrollHeader;
