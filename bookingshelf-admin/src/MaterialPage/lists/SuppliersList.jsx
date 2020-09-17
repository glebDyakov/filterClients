import React, { Component } from 'react';

import ActionModal from '../../_components/modals/ActionModal';
import {withTranslation} from "react-i18next";

class SuppliersList extends Component {
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
    const { supplier, openClientStats, toggleProvider, deleteSupplier, t } = this.props;

    return (
      <div className="tab-content-list mb-2">
        <div>
          <a onClick={() => openClientStats(supplier)}>
            <p>
              <span className="mob-title">{t("Поставщик")}: </span>{supplier.supplierName}
            </p>
          </a>
        </div>
        <div>
          <p>
            <span className="mob-title">{t("Описание")}: </span>{supplier.description}
          </p>
        </div>
        <div>
          <p>
            <span className="mob-title">{t("Веб-сайт")}: </span>{supplier.webSite}
          </p>
        </div>
        <div>
          <p>
            <span className="mob-title">{t("Удалить поставщика?")}: </span>{supplier.city}
          </p>
        </div>

        <div className="delete clientEditWrapper">
          <a className="clientEdit" onClick={() => toggleProvider(supplier)} />
        </div>
        <div className="delete dropdown">
          <a className="delete-icon menu-delete-icon" onClick={this.openDeleteModal}>
            <img src={`${process.env.CONTEXT}public/img/delete_new.svg`} alt=""/>
          </a>
        </div>

        {this.state.isOpenDeleteModal &&
          <ActionModal
            title={t("Удалить поставщика?")}
            closeHandler={this.closeDeleteModal}
            buttons={[{
              handler: deleteSupplier,
              params: supplier.supplierId,
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

export default withTranslation("common")(SuppliersList);
