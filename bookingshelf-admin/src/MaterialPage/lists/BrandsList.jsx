import React, { Component } from 'react';

import ActionModal from '../../_components/modals/ActionModal';

class BrandsList extends Component {
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
    const { brand, openClientStats, toggleBrand, deleteBrand } = this.props;

    return (
      <div className="tab-content-list mb-2">
        <div>
          <a onClick={() => openClientStats(brand)}>
            <p>{brand.brandName}</p>
          </a>
        </div>

        <div className="delete clientEditWrapper">
          <a className="clientEdit" onClick={() => toggleBrand(brand)}/>
        </div>
        <div className="delete dropdown">
          <a className="delete-icon menu-delete-icon" onClick={this.openDeleteModal}>
            <img src={`${process.env.CONTEXT}public/img/delete_new.svg`}
              alt=""/>
          </a>
        </div>
        {this.state.isOpenDeleteModal &&
          <ActionModal
            title="Удалить бренд?"
            closeHandler={this.closeDeleteModal}
            buttons={[{
              handler: deleteBrand,
              params: brand.brandId,
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

export default BrandsList;
