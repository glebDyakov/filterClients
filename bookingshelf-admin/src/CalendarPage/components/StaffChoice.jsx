import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import {access} from "../../_helpers/access";

class StaffChoice extends PureComponent {

    render(){
        const {typeSelected,selectedStaff,hideWorkingStaff, timetable, setWorkingStaff, staff, company}= this.props;
        const currentSelectedStaff = selectedStaff && !!selectedStaff.length && staff && staff.find(staffItem => staffItem.staffId === JSON.parse(selectedStaff).staffId);
        const companyTypeId = company.settings && company.settings.companyTypeId;

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
                        {typeSelected && typeSelected===1 && < p>{(companyTypeId === 2 || companyTypeId === 3) ? 'Доступные рабочие места' : 'Работающие сотрудники'}</p>}
                        {typeSelected && !!currentSelectedStaff && typeSelected===3 && (
                            <p>{currentSelectedStaff.firstName + " " + (currentSelectedStaff.lastName ? currentSelectedStaff.lastName : '')}</p>)
                        }
                        {typeSelected && typeSelected===2 && < p>{(companyTypeId === 2 || companyTypeId === 3) ? 'Все рабочие места' : 'Все сотрудники'} </p>}

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
                        <p>{currentSelectedStaff.firstName + " " + (currentSelectedStaff.lastName ? currentSelectedStaff.lastName : '')}</p>
                    </div>
                )}
                {access(2) && (
                    <ul className="dropdown-menu">
                        <li>
                            <a onClick={() => setWorkingStaff(timetable, 2)}>
                                <p>Все {(companyTypeId === 2 || companyTypeId === 3) ? 'рабочие места' : 'сотрудники'}</p>
                            </a>
                        </li>
                        {!hideWorkingStaff && <li>
                            <a onClick={() => setWorkingStaff(timetable, 1)}>
                                <p>{(companyTypeId === 2 || companyTypeId === 3) ? 'Доступные рабочие места' : 'Работающие сотрудники'}</p>
                            </a>
                        </li>}

                        {timetable && timetable.map(staffEl =>{
                            const activeStaff = staff && staff.find(staffItem => staffItem.staffId === staffEl.staffId);
                            const activeStaffEl = timetable.filter(item => item.staffId === staffEl.staffId)
                            return(
                                <li>
                                    <a onClick={() => setWorkingStaff(activeStaffEl, 3)}>
                                                        <span className="img-container">
                                                            <img className="rounded-circle"
                                                                 src={activeStaff && activeStaff.imageBase64
                                                                     ? "data:image/png;base64," +
                                                                     activeStaff.imageBase64
                                                                     // "1555020690000"
                                                                     : `${process.env.CONTEXT}public/img/image.png`}
                                                                 alt=""/>
                                                        </span>
                                        <p>{staffEl.firstName + " " + (staffEl.lastName ? staffEl.lastName : '')}</p>
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

function mapStateToProps(state) {
    const { company } = state;
    return {
        company
    };
}

export default connect(mapStateToProps)(StaffChoice);
