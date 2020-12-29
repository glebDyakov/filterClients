import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

class TableHeader extends Component {
  render() {
    const { t } = this.props;
    return (
      <thead>
      <tr>
        <td className="table-header-title text-center">{t('Время начала')}</td>
        <td className="table-header-title text-center">{t('Время услуги')}</td>
        <td className="table-header-title">{t('Услуга')}</td>
        <td className="table-header-title">% {t('от услуги')}</td>
        <td className="table-header-title">{t('Товар')}</td>
        <td className="table-header-title">% {t('от товара')}</td>
        <td className="table-header-title">{t('Доход Сотруд')}</td>
        <td className="table-header-title">{t('Доход Компании')}</td>
      </tr>
      </thead>
    );
  }
}

export default withTranslation("common")(TableHeader);
