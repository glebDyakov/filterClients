import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';

class StaffList extends Component {
  render() {
    const {t} = this.props;

    return (
      <div className="staffs-list-wrapper col p-0">
        <div className="staffs-list">

          <div className="list-item header-item d-flex align-items-center">
            <h2 className="title mb-0">Выбор сотрубника</h2>
            <button className='close'></button>
          </div>

          {/*// LIST OF STAFFS*/}

          <div className="list-item d-flex align-items-center">
            <img className="staff-image" src={`${process.env.CONTEXT}public/img/avatar.svg`} alt="Staff image"/>
            <div className="staff-credit">
              <div className="staff-name">Максим Сорочинский</div>
              <div className="staff-role">{t("Администратор")}</div>
            </div>
          </div>
          <div className="list-item d-flex align-items-center">
            <img className="staff-image" src={`${process.env.CONTEXT}public/img/avatar.svg`} alt="Staff image"/>
            <div className="staff-credit">
              <div className="staff-name">Максим Сорочинский</div>
              <div className="staff-role">{t("Администратор")}</div>
            </div>
          </div>
          <div className="list-item d-flex align-items-center">
            <img className="staff-image" src={`${process.env.CONTEXT}public/img/avatar.svg`} alt="Staff image"/>
            <div className="staff-credit">
              <div className="staff-name">Максим Сорочинский</div>
              <div className="staff-role">{t("Администратор")}</div>
            </div>
          </div>
          <div className="list-item d-flex align-items-center">
            <img className="staff-image" src={`${process.env.CONTEXT}public/img/avatar.svg`} alt="Staff image"/>
            <div className="staff-credit">
              <div className="staff-name">Максим Сорочинский</div>
              <div className="staff-role">{t("Администратор")}</div>
            </div>
          </div>
          <div className="list-item d-flex align-items-center">
            <img className="staff-image" src={`${process.env.CONTEXT}public/img/avatar.svg`} alt="Staff image"/>
            <div className="staff-credit">
              <div className="staff-name">Максим Сорочинский</div>
              <div className="staff-role">{t("Администратор")}</div>
            </div>
          </div>
          <div className="list-item d-flex align-items-center">
            <img className="staff-image" src={`${process.env.CONTEXT}public/img/avatar.svg`} alt="Staff image"/>
            <div className="staff-credit">
              <div className="staff-name">Максим Сорочинский</div>
              <div className="staff-role">{t("Администратор")}</div>
            </div>
          </div>
          <div className="list-item d-flex align-items-center">
            <img className="staff-image" src={`${process.env.CONTEXT}public/img/avatar.svg`} alt="Staff image"/>
            <div className="staff-credit">
              <div className="staff-name">Максим Сорочинский</div>
              <div className="staff-role">{t("Администратор")}</div>
            </div>
          </div>
          <div className="list-item d-flex align-items-center">
            <img className="staff-image" src={`${process.env.CONTEXT}public/img/avatar.svg`} alt="Staff image"/>
            <div className="staff-credit">
              <div className="staff-name">Максим Сорочинский</div>
              <div className="staff-role">{t("Администратор")}</div>
            </div>
          </div>
          <div className="list-item d-flex align-items-center">
            <img className="staff-image" src={`${process.env.CONTEXT}public/img/avatar.svg`} alt="Staff image"/>
            <div className="staff-credit">
              <div className="staff-name">Максим Сорочинский</div>
              <div className="staff-role">{t("Администратор")}</div>
            </div>
          </div>
          <div className="list-item d-flex align-items-center">
            <img className="staff-image" src={`${process.env.CONTEXT}public/img/avatar.svg`} alt="Staff image"/>
            <div className="staff-credit">
              <div className="staff-name">Максим Сорочинский</div>
              <div className="staff-role">{t("Администратор")}</div>
            </div>
          </div>
          <div className="list-item d-flex align-items-center">
            <img className="staff-image" src={`${process.env.CONTEXT}public/img/avatar.svg`} alt="Staff image"/>
            <div className="staff-credit">
              <div className="staff-name">Максим Сорочинский</div>
              <div className="staff-role">{t("Администратор")}</div>
            </div>
          </div>
          <div className="list-item d-flex align-items-center">
            <img className="staff-image" src={`${process.env.CONTEXT}public/img/avatar.svg`} alt="Staff image"/>
            <div className="staff-credit">
              <div className="staff-name">Максим Сорочинский</div>
              <div className="staff-role">{t("Администратор")}</div>
            </div>
          </div>
          <div className="list-item d-flex align-items-center">
            <img className="staff-image" src={`${process.env.CONTEXT}public/img/avatar.svg`} alt="Staff image"/>
            <div className="staff-credit">
              <div className="staff-name">Максим Сорочинский Крокодил Крокодит Крокодила Крокодилович</div>
              <div className="staff-role">{t("Администратор")}</div>
            </div>
          </div>
          <div className="list-item d-flex align-items-center">
            <img className="staff-image" src={`${process.env.CONTEXT}public/img/avatar.svg`} alt="Staff image"/>
            <div className="staff-credit">
              <div className="staff-name">Максим Сорочинский</div>
              <div className="staff-role">{t("Администратор")}</div>
            </div>
          </div>
          <div className="list-item d-flex align-items-center">
            <img className="staff-image" src={`${process.env.CONTEXT}public/img/avatar.svg`} alt="Staff image"/>
            <div className="staff-credit">
              <div className="staff-name">Максим Сорочинский</div>
              <div className="staff-role">{t("Администратор")}</div>
            </div>
          </div>
          {/*// END LIST OF STAFFS*/}
        </div>
      </div>
    );
  }
}

export default withTranslation("common")(StaffList);
