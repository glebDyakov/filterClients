import React, { Component } from 'react';
import moment from 'moment';

import ActionModal from '../../_components/modals/ActionModal';
import {withTranslation} from "react-i18next";

class MovementList extends Component {
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
    const { movement, deleteMovement, toggleStorehouseProduct, toggleExProd, activeUnit, t } = this.props;

    return (
      <div className="tab-content-list mb-2">
        <div className="plus-or-minus-field">
          <div className={movement.storehouseProductId ? 'plus' : 'minus'}/>
        </div>
        <div>
          <p><span
            className="mob-title">{t("Код товара")}: </span>{movement && movement.productCode}
          </p>
        </div>
        <div>
          <p className="productName">{movement && movement.productName}</p>
        </div>
        {/* <div>*/}
        {/*        <p style={{ width: "100%" }}><span className="mob-title">Описание: </span>
        {activeProduct && activeProduct.description}</p>*/}
        {/* </div>*/}
        {/* <div >*/}
        {/*        <p style={{ width: "100%" }}><span className="mob-title">Склад: </span>
        {activeStorehouse && activeStorehouse.storehouseName}</p>*/}
        {/* </div>*/}
        <div className={(movement && movement.targetTranslated) ? '' : 'movement-target-empty'}>
          <p><span
            className="mob-title">{t("Причина списания")}: </span>{movement && movement.targetTranslated}
          </p>
        </div>
        <div className={(movement && movement.retailPrice) ? '' : 'retail-price-empty'}>
          <p><span className="mob-title">{t("Цена розн")}: </span>{movement && movement.retailPrice}
          </p>
        </div>
        {/* <div className={(movement && movement.specialPrice)? "": "retail-price-empty"}>*/}
        {/*    <p><span className="mob-title">Цена спец.: </span>{movement && movement.specialPrice}</p>*/}
        {/* </div>*/}
        {/* <div  className={(movement && movement.supplierPrice)? "": "retail-price-empty"}>*/}
        {/*    <p><span className="mob-title">Цена пост.: </span>{movement && movement.supplierPrice}</p>*/}
        {/* </div>*/}
        <div>
          <p><span
            className="mob-title">{t("Единица измерения")}: </span>{activeUnit ? activeUnit.unitName : ''}
          </p>
        </div>
        <div>
          <p>
            <span className="mob-title">{t("Дата")}: </span>
            {movement && moment(movement.deliveryDateMillis
              ? movement.deliveryDateMillis
              : movement.expenditureDateMillis).format('DD.MM HH:mm')
            }
          </p>
        </div>
        {/* <div >*/}
        {/*    <p><span className="mob-title">Время: </span>{movement &&
        moment(movement.deliveryDateMillis?movement.deliveryDateMillis:movement.expenditureDateMillis)
        .format('HH:mm')}</p>*/}
        {/* </div>*/}
        <div>
          <p><span
            className="mob-title">{t("Остаток")}: </span>{movement && movement.currentAmount}
          </p>
        </div>
        <div className="delete clientEditWrapper">
          <a
            className="clientEdit"
            onClick={() => (movement.storehouseProductId) ? toggleStorehouseProduct(movement) : toggleExProd(movement)}
          />
        </div>
        <div className="delete dropdown">
          <a className="delete-icon menu-delete-icon" onClick={this.openDeleteModal}>
            <img src={`${process.env.CONTEXT}public/img/delete_new.svg`} alt=""/>
          </a>
        </div>

        {this.state.isOpenDeleteModal &&
          <ActionModal
            title={t("Удалить запись?")}
            closeHandler={this.closeDeleteModal}
            buttons={[{
              handler: deleteMovement,
              params: movement,
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

export default withTranslation("common")(MovementList);
