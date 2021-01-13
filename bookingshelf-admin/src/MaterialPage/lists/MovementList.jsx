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
      staff: undefined,
    };

    this.closeDeleteModal = this.closeDeleteModal.bind(this);
    this.openDeleteModal = this.openDeleteModal.bind(this);
    this.getStaff = this.getStaff.bind(this);
  }


  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.staffs) !== JSON.stringify(nextProps.staffs) && nextProps.movement.staffId) {
      this.setState({ staff: nextProps.staffs.find((staff) => staff.staffId === nextProps.movement.staffId) || undefined });
    }
  }

  closeDeleteModal() {
    this.setState({ isOpenDeleteModal: false });
  }

  openDeleteModal() {
    this.setState({ isOpenDeleteModal: true });
  }

  getStaff() {
    const { staffs, movement } = this.props;
    return staffs ? staffs.find((staff) => movement.staffId && staff.staffId === movement.staffId) : undefined;
  }

  componentDidMount() {
    this.setState({
      staff: this.getStaff(),
    });
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
    const { staff } = this.state;
    return (
      <div className="tab-content-list mb-2">
        <div className="plus-or-minus-field">
          <div className={movement.movementType && movement.movementType === 'ARRIVAL' ? 'plus' : 'minus'}/>
        </div>
        <div className="staff-field">
          <div className="staff-container">
            <img className="staff-image"
                 src={staff && movement.staffId && staff.imageBase64 && staff.imageBase64 !== '' ? ('data:image/png;base64,' + staff.imageBase64) : `${process.env.CONTEXT}public/img/avatar.svg`}
                 alt="staff image"/>
            <p
              className="staff-credit">{staff && movement.staffId && staff.firstName && (staff.firstName.length >= 9 ? String(staff.firstName).slice(0, 8) + '..' : staff.firstName)} {staff && movement.staffId && staff.lastName ? (staff.lastName.length >= 9 ? String(staff.lastName).slice(0, 8) + '..' : staff.lastName) : ''}</p>
          </div>
        </div>
        <div>
          <p><span
            // className="mob-title">{t('Код товара')} / <span className="red-text">{t("Партия")}</span>: </span>{movement && movement.productCode} /
            className="mob-title">{t('Код товара')} / <span
            className="red-text">ID</span>: </span>{movement && movement.productCode} /
            <p
              className="red-text code_part">{movement && movement.storehouseProductExpenditureId ? movement.storehouseProductExpenditureId : movement.storehouseProductId}</p>

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
        <div>
          <p><span
            className="mob-title">{t('Операция')}: </span>{movement && movement.targetTranslated ? movement.targetTranslated : t('Поступление')}
          </p>
        </div>

        <div>
          <p><span
            className="mob-title">{t('Количество списания / поступления')}: </span>{movement && movement.amount && (movement.amount + ' ' + (t('шт')) + ' (' + (movement && movement.nominalAmount + (activeUnit ? ' ' + this.getUnitName(activeUnit.unitName) : '') + ')'))}
          </p>
        </div>

        <div className={(movement && movement.retailPrice) ? '' : 'retail-price-empty'}>
          <p><span
            className="mob-title">{t('Цена партии. / ед. / ед. объема')}: </span>{movement && movement.retailPrice && (movement.retailPrice.toFixed(2) + ' / ' + movement.unitRetailPrice.toFixed(2) + ' / ' + movement.nominalUnitPrice)}
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
            {movement && moment(movement.date).format('DD.MM HH:mm')
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
            <p
              className="red-text">/ {Math.round(movement.reserve)} {activeUnit && this.getUnitName(activeUnit.unitName)}</p> : '/ -'}
          </p>
        </div>
        {/*<div className="delete clientEditWrapper">*/}
        {/*  <a*/}
        {/*    className="clientEdit"*/}
        {/*    onClick={() => movement.movementType && movement.movementType === "ARRIVAL"  ? toggleStorehouseProduct(movement) : toggleExProd(movement)}*/}
        {/*  />*/}
        {/*</div>*/}
        {/*<div className="delete dropdown">*/}
        {/*  <a className="delete-icon menu-delete-icon" onClick={this.openDeleteModal}>*/}
        {/*    <img src={`${process.env.CONTEXT}public/img/delete_new.svg`} alt=""/>*/}
        {/*  </a>*/}
        {/*</div>*/}

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
