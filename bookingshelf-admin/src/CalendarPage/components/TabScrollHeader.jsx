import React, { PureComponent } from 'react';

import moment from 'moment';
import { withTranslation } from 'react-i18next';

class TabScrollHeader extends PureComponent {
  render() {
    const { selectedDays, timetable, timetableMessage, closedDates, staff, type, t } =this.props;

    return (
      <React.Fragment>
        {type && type === 'day' && selectedDays.length === 1 && (
          <div
            className="fixed-tab"
            // style={{
            //     'minWidth': (120*parseInt(timetable && timetable.length))+'px'
            // }}
          >
            <div className="tab-content-list tab-content-list-first">
              {(timetable || timetableMessage) && <div className="cell hours"><span /></div>}

              {timetable && timetable.map((workingStaffElement, i) => {
                const activeStaff = staff && staff.find((staffItem) =>
                  staffItem.staffId === workingStaffElement.staffId);

                return <div key={`tab-scroll-header-${i}`} className="cell">
                  <span className="img-container">
                    <img className="rounded-circle"
                      src={activeStaff && activeStaff.imageBase64
                        ? 'data:image/png;base64,' + activeStaff.imageBase64
                        : `${process.env.CONTEXT}public/img/avatar.svg`
                      }
                      alt=""/>
                  </span>
                  <p>{(workingStaffElement.firstName.length >= 15 ? workingStaffElement.firstName.substr(0, 13) + "..." : workingStaffElement.firstName) + ' ' +
                    (workingStaffElement.lastName ? (workingStaffElement.lastName.length >= 15 ? workingStaffElement.lastName.substr(0, 13) + "..." : workingStaffElement.lastName) : '') }
                  </p>
                </div>;
              },
              )

              }
              {timetableMessage && <div className="cell"><p>{timetableMessage}</p></div>}
            </div>
          </div>

        )}

        {type && type === 'week' &&
          <div className="fixed-tab"
            // style={{'minWidth': (120*parseInt(timetable && timetable.length))+'px'}}
          >
            <div className="tab-content-list">
              {selectedDays.length>1 && <div className="cell hours"><span></span></div>}

              {
                selectedDays.length > 1 && selectedDays.map((item, weekKey)=> {
                  const clDate= closedDates && closedDates.some((st) => {
                    return moment(item).add('1', 'minute').isBetween(moment(st.startDateMillis)
                      .startOf('day'), moment(st.endDateMillis).endOf('day'));
                  });

                  return <div
                    className={'cell' + (moment(item).format('DD') ===
                      moment().format('DD') ? ' day-active' : '') }
                    key={weekKey}
                  >
                    <p className="text-capitalize">
                      {moment(item).format('dd')},&nbsp;
                      <span className={`text-capitalize ${clDate && 'closedDate'}`}>
                        {clDate
                          ?
                          <p>{moment(item).format('DD MMMM')}
                            <p className="closedDate-color">&nbsp;({t("????????????????")})</p>
                          </p>
                          : moment(item).format('DD MMMM')}
                      </span>
                    </p>
                  </div>;
                })
              }
            </div>
          </div>
        }

      </React.Fragment>
    );
  }
}
export default withTranslation("common")(TabScrollHeader);
