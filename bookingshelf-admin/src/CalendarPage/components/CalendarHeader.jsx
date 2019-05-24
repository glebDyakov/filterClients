import React from 'react';
import {access} from '../../_helpers/access';
import pure from 'recompose/pure';

const CalendarHeader = ({typeSelected,selectedStaff, availableTimetable, setWorkingStaff}) => (
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

                {availableTimetable && availableTimetable.sort((a, b) => a.firstName.localeCompare(b.firstName)).map(staffEl => (
                        <li>
                            <a onClick={() => setWorkingStaff([staffEl], 3)}>
                                                <span className="img-container">
                                                    <img className="rounded-circle"
                                                         src={staffEl.imageBase64
                                                             ? "data:image/png;base64," + staffEl.imageBase64
                                                             : `${process.env.CONTEXT}public/img/image.png`}
                                                         alt=""/>
                                                </span>
                                <p>{staffEl.firstName + " " + staffEl.lastName}</p>
                            </a>
                        </li>
                    )
                )}
            </ul>
        )}
    </div>
);

export default pure(CalendarHeader);