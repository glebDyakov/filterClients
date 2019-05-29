import React, {PureComponent} from 'react';
import {access} from "../../_helpers/access";

class CalendarHeader extends PureComponent {

    render(){
        const {typeSelected,selectedStaff, availableTimetable, setWorkingStaff, staff}= this.props;

        return(
            <div className="staff_choise col-3">
                {access(2) && (
                    <div
                        className="bth dropdown-toggle dropdown rounded-button select-menu" role="menu"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        {typeSelected && !!selectedStaff.length && typeSelected===3 && (
                            <span className="img-container">
                                                    <img
                                                        className="rounded-circle"
                                                        src={JSON.parse(selectedStaff).imageBase64
                                                            ? "data:image/png;base64," + JSON.parse(selectedStaff).imageBase64
                                                            : `${process.env.CONTEXT}public/img/image.png`}
                                                        alt=""
                                                    />
                                                </span>
                        )}
                        {typeSelected && typeSelected===1 && < p> Работающие сотрудники </p>}
                        {typeSelected && !!selectedStaff.length && typeSelected===3 && (
                            <p>{JSON.parse(selectedStaff).firstName + " " + JSON.parse(selectedStaff).lastName}</p>)
                        }
                        {typeSelected && typeSelected===2 && < p> Все сотрудники </p>}

                    </div>
                )}
                {!access(2) && selectedStaff && selectedStaff.length && (
                    <div className="bth rounded-button select-menu" >
                                            <span className="img-container">
                                                <img
                                                    className="rounded-circle"
                                                    src={JSON.parse(selectedStaff).imageBase64
                                                        ? "data:image/png;base64," + JSON.parse(selectedStaff).imageBase64
                                                        : `${process.env.CONTEXT}public/img/image.png`}
                                                    alt=""
                                                />
                                            </span>
                        <p>{JSON.parse(selectedStaff).firstName + " " + JSON.parse(selectedStaff).lastName}</p>
                    </div>
                )}
                {access(2) && (
                    <ul className="dropdown-menu">
                        <li>
                            <a onClick={() => setWorkingStaff(availableTimetable, 2)}>
                                <p>Все сотрудники</p>
                            </a>
                        </li>
                        <li>
                            <a onClick={() => setWorkingStaff(availableTimetable, 1)}>
                                <p>Работающие сотрудники</p>
                            </a>
                        </li>

                        {availableTimetable && availableTimetable.sort((a, b) => a.firstName.localeCompare(b.firstName)).map(staffEl =>{
                            const activeStaff = staff && staff.find(staffItem => staffItem.staffId === staffEl.staffId);
                            return(
                                <li>
                                    <a onClick={() => setWorkingStaff([activeStaff], 3)}>
                                                        <span className="img-container">
                                                            <img className="rounded-circle"
                                                                 src={activeStaff && activeStaff.imageBase64
                                                                     ? "data:image/png;base64," + activeStaff.imageBase64
                                                                     : `${process.env.CONTEXT}public/img/image.png`}
                                                                 alt=""/>
                                                        </span>
                                        <p>{staffEl.firstName + " " + staffEl.lastName}</p>
                                    </a>
                                </li>
                            )}
                        )}
                    </ul>
                )}
            </div>
        );
    }
}
export default CalendarHeader;