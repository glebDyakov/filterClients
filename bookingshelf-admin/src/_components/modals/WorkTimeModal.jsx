import React, { Component } from 'react';
import Modal from '@trendmicro/react-modal';
import moment from 'moment';

class WorkTimeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staffCurrent: null,
    };
  }

  setStaff(staffId, firstName, lastName, imageBase64) {
    const { staffCurrent } = this.state;
    const newStaffCurrent = {
      ...staffCurrent,
      staffId: staffId.staffId,
      firstName: firstName,
      lastName: lastName,
      imageBase64,
    };

    this.setState({
      staffCurrent: newStaffCurrent,
    });
  }


  render() {
    const { activeStaffCurrent } = this.state;

    return (
      <Modal size="md" onClose={this.closeModal} showCloseButton={false} className="mod">

        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" onClick={this.closeModal}/>
            </div>
            <div className="form-group mr-3 ml-3">
              <div className="appointment-staff add_appointment_staff">
                <p>{t('Исполнитель')}</p>
                <div className="dropdown add-staff">
                  <a
                    className='dropdown-toggle drop_menu_personal'
                    data-toggle='dropdown'
                    aria-haspopup="true" aria-expanded="false">
                    {
                      activeStaffCurrent.staffId &&
                      <div className="img-container">
                        <img className="rounded-circle"
                             src={activeStaffCurrent.imageBase64 ? 'data:image/png;base64,' + activeStaffCurrent.imageBase64 : `${process.env.CONTEXT}public/img/avatar.svg`}
                             alt=""/>
                        <span
                          className="staff-name">{activeStaffCurrent.firstName + ' ' + (activeStaffCurrent.lastName ? activeStaffCurrent.lastName : '')}</span>
                      </div>
                    }
                  </a>
                  <ul className="dropdown-menu" role="menu">
                    {
                      staffs.timetable && staffs.timetable
                        .filter((timing) => {
                          return timing.timetables.some((time) => {
                            const checkingTiming = moment(time.startTimeMillis).format('DD MM YYYY');
                            const currentTiming = moment(selectedDay).format('DD MM YYYY');
                            return checkingTiming === currentTiming;
                          });
                        })
                        .map((staff, key) => {
                            const activeStaff = staffFromProps && staffFromProps.find((staffItem) => staffItem.staffId === staff.staffId);

                            return (
                              <li
                                onClick={() => this.setStaff(staff, staff.firstName, staff.lastName, activeStaff.imageBase64)}
                                key={key}>
                                <a>
                                  <div
                                    className="img-container">
                                    <img
                                      className="rounded-circle"
                                      src={activeStaff.imageBase64 ? 'data:image/png;base64,' + activeStaff.imageBase64 : `${process.env.CONTEXT}public/img/avatar.svg`}
                                      alt=""/>
                                    <span
                                      style={{ lineHeight: activeStaff.description ? '8px' : '20px' }}
                                      className="">
                                                    <p>{staff.firstName + ' ' + (staff.lastName ? staff.lastName : '')}</p>
                                      {activeStaff.description ?
                                        <p style={{ fontSize: '10px' }}
                                           className="">{activeStaff.description}</p> : ''}

                                                  </span>
                                  </div>
                                </a>
                              </li>);
                          },
                        )
                    }

                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default WorkTimeModal;
