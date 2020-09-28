import React, { Component } from 'react';

import ActionModal from '../../_components/modals/ActionModal';
import {withTranslation} from "react-i18next";

class CategoryList extends Component {
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
    const { openClientStats, deleteCategory, category, toggleCategory, t } = this.props;

    return (
      <div className="tab-content-list mb-2">
        <div>
          <a onClick={() => openClientStats(category)}>
            <p>{category.categoryName}</p>
          </a>
        </div>

        <div className="delete clientEditWrapper">
          <a className="clientEdit" onClick={() => toggleCategory(category)}/>
        </div>
        <div className="delete dropdown">
          <a className="delete-icon menu-delete-icon" onClick={this.openDeleteModal}>
            <img src={`${process.env.CONTEXT}public/img/delete_new.svg`} alt=""/>
          </a>
        </div>

        {this.state.isOpenDeleteModal &&
          <ActionModal
            title={t("Удалить категорию?")}
            closeHandler={this.closeDeleteModal}
            buttons={[{
              handler: deleteCategory,
              params: category.categoryId,
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

export default withTranslation("common")(CategoryList);
