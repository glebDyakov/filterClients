import React, {PureComponent} from 'react';


class TabOne extends  PureComponent{

    render() {

        const {staffId,staffs, nearestTime, selectStaff, setScreen, refreshTimetable, roundDown} = this.props;


        return(
            <div className="service_selection screen1">
                <div className="title_block n">
                    <p className="modal_title">Выбор сотрудника</p>
                    {staffId &&
                    <span className="next_block" onClick={() => {
                        setScreen(2);
                        refreshTimetable();
                    }}>Вперед</span>}
                </div>
                <ul className="staff_popup">
                    {staffs && staffs.length && staffs.sort((a, b) => a.firstName.localeCompare(b.firstName)).map((staff, idStaff) =>


                        <li className={(staffId && staffId === staff.staffId && 'selected') + ' nb'}
                            onClick={() => selectStaff(staff)}
                            key={idStaff}
                        >
                            <a href="#">
                                <div className="img_container">
                                    <img
                                        src={staff.imageBase64 ? "data:image/png;base64," + staff.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                        alt=""/>
                                    <span>{staff.firstName} <br/>{staff.lastName} <br/>
                                        <span style={{ fontSize: "11px"}}>{staff.description}</span>
                                    </span>
                                </div>


                                {nearestTime && nearestTime.map((time, id)=>
                                    time.staffId===staff.staffId && time.availableDays.length!==0 &&
                                    <div className="mobile_block" key={'time'+id}>
                                        <span>Ближайшая запись</span>
                                        <div className="stars" style={{textTransform: 'capitalize'}}>{roundDown(parseInt(time.availableDays[0].availableTimes[0].startTimeMillis))}</div>
                                    </div>

                                )}

                                {nearestTime && !nearestTime.some((time, id)=>
                                    time.staffId===staff.staffId && time.availableDays.length!==0

                                ) && <div className="mobile_block">
                                    <span style={{fontWeight: 'bold'}}>Нет записи</span>
                                </div>


                                }



                            </a>
                        </li>
                    )}
                </ul>
                <p className="skip_employee" onClick={() => selectStaff([])}>Пропустить выбор сотрудника</p>
            </div>
        );
    }
}
export default TabOne;