import React, { PureComponent } from 'react';
import {withTranslation} from "react-i18next";

class CalendarSwitch extends PureComponent {
  render() {
    const { type, selectType, language, t } = this.props;

    return (
      <div className="tab-day-week tab-content col-3">
        <ul className="nav nav-tabs">
          <li className="nav-item no-bg">
            <a
              className={'nav-link' + (type==='day' ? ' active show' : '')}
              onClick={()=>selectType('day')}
              data-toggle="tab"
            >
                            {t("День")}
            </a>
          </li>
          <li className="nav-item no-bg">
            <a
              className={'nav-link' + (type==='week' ? ' active show' : '')}
              onClick={()=>selectType('week')}
            >
                            {t("Неделя")}
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

export default withTranslation("common")(CalendarSwitch);
