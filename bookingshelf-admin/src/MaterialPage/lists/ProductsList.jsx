import React, { Component } from 'react';

import ActionModal from '../../_components/modals/ActionModal';

class ProductsList extends Component {
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
    const { activeCategory, activeUnit, toggleProduct, deleteProduct, toggleInfoProduct, product } = this.props;

    return (
      <div className="tab-content-list mb-2" >
        <div className="material-products-details">
          <a onClick={() => toggleInfoProduct(product)}>
            <p className="productName"><span className="mob-title">Наименование: </span>{product.productName}</p>
          </a>
        </div>
        <div >
          <p><span className="mob-title">Код товара: </span>{product.productCode}</p>
        </div>
        <div >
          <p><span className="mob-title">Категория: </span>{activeCategory && activeCategory.categoryName}</p>
        </div>
        <div>
          <p>
            <span className="mob-title">Номинальный объем: </span>
            {product && product.nominalAmount} {activeUnit && activeUnit.unitName}
          </p>
        </div>
        <div >
          <p><span className="mob-title">Остаток: </span>{product.currentAmount}</p>
        </div>
        <div className="delete clientEditWrapper">
          <a className="clientEdit" onClick={() => toggleProduct(product)}/>
        </div>
        <div className="delete dropdown">
          <a className="delete-icon menu-delete-icon" onClick={this.openDeleteModal}>
            <img src={`${process.env.CONTEXT}public/img/delete_new.svg`} alt=""/>
          </a>
        </div>
        {this.state.isOpenDeleteModal &&
          <ActionModal
            title="Удалить товар?"
            closeHandler={this.closeDeleteModal}
            buttons={[{
              handler: deleteProduct,
              params: product.productId,
              innerText: 'Удалить',
              className: 'button',
              additionalHandler: this.closeDeleteModal,
            },
            {
              handler: this.closeDeleteModal,
              innerText: 'Отмена',
              className: 'gray-button',
            }]}
          />
        }
      </div>
    );
  }
}

export default ProductsList;
