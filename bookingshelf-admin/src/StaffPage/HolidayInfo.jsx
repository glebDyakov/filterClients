import React, { Component } from 'react';
import moment from 'moment';

import ActionModal from '../_components/modals/ActionModal';
import {withTranslation} from "react-i18next";

class HolidayInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenDeleteModal: false,
    };

    this.closeDeleteModal = this.closeDeleteModal.bind(this);
    this.openDeleteModal = this.openDeleteModal.bind(this);
  }

  closeDeleteModal() {
    this.setState({ isOpenDeleteModal: false });
  }

  openDeleteModal() {
    this.setState({ isOpenDeleteModal: true });
  }

  render() {
    const { item, key, deleteClosedDate, t } = this.props;

    return (
      <div className="row holiday-list" key={key}>
        <div className="col flex-column d-flex flex-md-row">
          <span>
            <strong>{t("Начало")}</strong>
            {moment(item.startDateMillis).format('L')}
          </span>
          <span>
            <strong>{t("Количество дней")}</strong>
            {Math.round((item.endDateMillis - item.startDateMillis) / (1000 * 60 * 60 * 24)) + 1}
          </span>
          <span>
            <strong>{t("Описание")}</strong>
            {item.description}
          </span>
        </div>
        <div className="dropdown delete-tab-holiday">
          <a className="delete-icon" onClick={this.openDeleteModal}>
            <img src={`${process.env.CONTEXT}public/img/delete_new.svg`}
              alt=""/>
          </a>
        </div>

        {this.state.isOpenDeleteModal &&
          <ActionModal
            title={t("Удалить выходные дни?")}
            closeHandler={this.closeDeleteModal}
            buttons={[{
              handler: deleteClosedDate,
              params: item.companyClosedDateId,
              innerText: t('Удалить'),
              className: 'button',
              additionalHandler: this.closeDeleteModal,
            },
            {
              handler: this.closeDeleteModal,
              innerText: t('Отмена'),
              className: 'gray-button',
            }]}
          />
        }
      </div>

    );
  }
}


export default withTranslation("common")(HolidayInfo);
