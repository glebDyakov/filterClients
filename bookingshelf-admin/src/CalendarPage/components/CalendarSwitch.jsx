import React, { PureComponent } from 'react';

class CalendarSwitch extends PureComponent {
  render() {
    const { type, selectType } = this.props;

    return (
      <div className="tab-day-week tab-content col-3">
        <ul className="nav nav-tabs">
          <li className="nav-item no-bg">
            <a
              className={'nav-link' + (type==='day' ? ' active show' : '')}
              onClick={()=>selectType('day')}
              data-toggle="tab"
            >
                            День
            </a>
          </li>
          <li className="nav-item no-bg">
            <a
              className={'nav-link' + (type==='week' ? ' active show' : '')}
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
