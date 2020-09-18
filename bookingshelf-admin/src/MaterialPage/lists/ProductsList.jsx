import React, {Component} from 'react';

import ActionModal from '../../_components/modals/ActionModal';
import {withTranslation} from "react-i18next";
import Hint from "../../_components/Hint";

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
        this.setState({isOpenDeleteModal: false});
    }

    openDeleteModal() {
        this.setState({isOpenDeleteModal: true});
    }

    getUnitName(unit) {
        const {t} = this.props;
        switch (unit) {
            case "Миллилитр":
                return t("мл");
            case "Штука":
                return t("шт");
            case "Килограмм":
                return t("кг");
            case "Грамм":
                return t("гр");
            case "Коробка":
                return t("кор");
            default:
                return "";
        }
    }

    render() {
        const {activeCategory, activeUnit, toggleProduct, deleteProduct, toggleInfoProduct, product, t} = this.props;

        return (
            <div className="tab-content-list mb-2">
                <div className="material-products-details">
                    <a onClick={() => toggleInfoProduct(product)}>
                        <p className="productName"><span
                            className="mob-title">{t("Наименование")}: </span>{product.productName}</p>
                    </a>
                </div>
                <div>
                    <p><span className="mob-title">{t("Код товара")}: </span>{product.productCode}</p>
                </div>
                <div>
                    <p><span
                        className="mob-title">{t("Категория")}: </span>{activeCategory && activeCategory.categoryName}
                    </p>
                </div>
                <div>
                    <p>
                        <span className="mob-title">{t("Номинальный объем")}: </span>
                        {product && product.nominalAmount} {activeUnit && t(activeUnit.unitName)}
                    </p>
                </div>
                <div className="overflow-visible">
                    <p><span className="mob-title">{t("Остаток")} /<span className="red-text"> {t("Резерв")}</span>
                        <Hint hintMessage={t('Товары, зарезервированные на созданные визиты.')}
                    />: </span>
                        {product.currentAmount} {t("шт")} ({product.currentNominalAmount} {activeUnit && this.getUnitName(activeUnit.unitName)}) {product.reserve > 0 ? <span className="red-text">/ {Math.round(product.reserve)} {activeUnit && this.getUnitName(activeUnit.unitName)}</span> : '/ -'}

                    </p>
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
                    title={t("Удалить товар?")}
                    closeHandler={this.closeDeleteModal}
                    buttons={[{
                        handler: deleteProduct,
                        params: product.productId,
                        innerText: t("Удалить товар?"),
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

export default withTranslation("common")(ProductsList);
