import React, { Component } from 'react';
import moment from 'moment';

import ActionModal from '../../_components/modals/ActionModal';
import { withTranslation } from 'react-i18next';
import Hint from '../../_components/Hint';

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

  getUnitName(unit) {
    const { t } = this.props;
    switch (unit) {
      case 'Миллилитр':
        return t('мл');
      case 'Штука':
        return t('шт');
      case 'Килограмм':
        return t('кг');
      case 'Грамм':
        return t('гр');
      case 'Коробка':
        return t('кор');
      case 'Сантиметр':
        return t('см');
      default:
        return '';
    }
  }

  render() {
    const { movement, deleteMovement, toggleStorehouseProduct, toggleExProd, activeUnit, t } = this.props;
    console.log(movement);
    return (
      <div className="tab-content-list mb-2">
        <div className="plus-or-minus-field">
          <div className={movement.storehouseProductId ? 'plus' : 'minus'}/>
        </div>
        <div>
          <p><span
            className="mob-title">{t('Код товара')}: </span>{movement && movement.productCode}
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
            className="mob-title">{t('Причина списания')}: </span>{movement && movement.targetTranslated}
          </p>
        </div>

        <div className={(movement && movement.retailPrice) ? '' : 'retail-price-empty'}>
          <p><span
            className="mob-title">{t('Цена ед. / ед. объема')}: </span>{movement && (movement.retailPrice && movement.retailPrice + ' / ' + movement.nominalUnitPrice && movement.nominalUnitPrice)}
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
            className="mob-title">{t('Единица измерения')}: </span>{activeUnit ? t(activeUnit.unitName) : ''}
          </p>
        </div>
        <div>
          <p>
            <span className="mob-title">{t('Дата')}: </span>
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
        <div className="overflow-visible reserve-title">
          <p><span
            className="mob-title">{t('Остаток')} /<span className="red-text"> {t('Резерв')}</span>
                        <Hint hintMessage={t('Товары, зарезервированные на созданные визиты.')}
                        />: </span>{movement && movement.currentAmount} {t('шт')} ({movement && movement.currentNominalAmount} {activeUnit && this.getUnitName(activeUnit.unitName)}) {movement.reserve > 0 ?
            <span
              className="red-text">/ {Math.round(movement.reserve)} {activeUnit && this.getUnitName(activeUnit.unitName)}</span> : '/ -'}
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
          title={t('Удалить запись?')}
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

export default withTranslation('common')(MovementList);
