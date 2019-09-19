import React, {PureComponent} from 'react';
import {access} from "../../_helpers/access";

class StaffChoice extends PureComponent {

    render(){
        const {typeSelected,selectedStaff,hideWorkingStaff, availableTimetable, setWorkingStaff, staff}= this.props;
        const currentSelectedStaff = selectedStaff && !!selectedStaff.length && staff && staff.find(staffItem => staffItem.staffId === JSON.parse(selectedStaff).staffId);

        return(
            <div className="staff_choise col-3">
                {access(2) && (
                    <div
                        className="bth dropdown-toggle dropdown rounded-button select-menu" role="menu"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        {typeSelected && !!currentSelectedStaff && typeSelected===3 && (
                            <span className="img-container">
                                                    <img
                                                        className="rounded-circle"
                                                        src={currentSelectedStaff.imageBase64
                                                            ? "data:image/png;base64," + currentSelectedStaff.imageBase64
                                                            : `${process.env.CONTEXT}public/img/image.png`}
                                                        alt=""
                                                    />
                                                </span>
                        )}
                        {typeSelected && typeSelected===1 && < p> Работающие сотрудники </p>}
                        {typeSelected && !!currentSelectedStaff && typeSelected===3 && (
                            <p>{currentSelectedStaff.firstName + " " + currentSelectedStaff.lastName}</p>)
                        }
                        {typeSelected && typeSelected===2 && < p> Все сотрудники </p>}

                    </div>
                )}
                {!access(2) && currentSelectedStaff && (
                    <div className="bth rounded-button select-menu">
                        <span className="img-container">
                            <img
                                className="rounded-circle"
                                src={currentSelectedStaff.imageBase64
                                    ? "data:image/png;base64," + currentSelectedStaff.imageBase64
                                    : `${process.env.CONTEXT}public/img/image.png`}
                                alt=""
                            />
                        </span>
                        <p>{currentSelectedStaff.firstName + " " + currentSelectedStaff.lastName}</p>
                    </div>
                )}
                {access(2) && (
                    <ul className="dropdown-menu">
                        <li>
                            <a onClick={() => setWorkingStaff(availableTimetable, 2)}>
                                <p>Все сотрудники</p>
                            </a>
                        </li>
                        {!hideWorkingStaff && <li>
                            <a onClick={() => setWorkingStaff(availableTimetable, 1)}>
                                <p>Работающие сотрудники</p>
                            </a>
                        </li>}

                        {availableTimetable && availableTimetable.sort((a, b) => a.firstName.localeCompare(b.firstName)).map(staffEl =>{
                            const activeStaff = staff && staff.find(staffItem => staffItem.staffId === staffEl.staffId);
                            return(
                                <li>
                                    <a onClick={() => setWorkingStaff([activeStaff], 3)}>
                                                        <span className="img-container">
                                                            <img className="rounded-circle"
                                                                 src={activeStaff && activeStaff.imageBase64
                                                                     ? "data:image/png;base64," +
                                                                     activeStaff.imageBase64
                                                                     // "1555020690000"
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
export default StaffChoice;