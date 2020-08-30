import React, { PureComponent } from 'react';

class CalendarSwitch extends PureComponent {
  render() {
    const { type, selectType } = this.props;

    return (
      <div className="tab-day-week tab-content col-3">
        <ul className="nav nav-tabs">
          <li className="nav-item no-bg">
            <a
              className={type==='day'&&' active show '+'nav-link'}
              onClick={()=>selectType('day')}
              data-toggle="tab"
            >
                            День
            </a>
          </li>
          <li className="nav-item no-bg">
            <a
              className={type==='week'&&' active show '+'nav-link'}
              onClick={()=>selectType('week')}
            >
                            Неделя
            </a>
          </li>
        </ul>
      </div>
    );
  }
}
export default CalendarSwitch;
