import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import '@trendmicro/react-modal/dist/react-modal.css';
import Modal from '@trendmicro/react-modal';
import { isValidEmailAddress } from '../../_helpers/validators';
import { isValidNumber } from 'libphonenumber-js';
import PhoneInput from '../PhoneInput';
import InputCounter from '../InputCounter';
import moment from 'moment';
import ReactPhoneInput from 'react-phone-input-2';
import { companyActions, materialActions } from '../../_actions';
import { AddBrand } from './AddBrand';
import { ExpenditureProduct } from './ExpenditureProduct';
import { StorehouseProduct } from './StorehouseProduct';
import {withTranslation} from "react-i18next";

class InfoProduct extends React.Component {
  constructor(props) {
    super(props);
    let client;
    if (props.client_working && props.edit) {
      client = props.client_working;
    } else if (props.client.activeClient && props.edit) {
      client = props.client.activeClient;
    } else {
      client = {
        'supplierName': '',
        'webSite': '',
        'zipCode': '',
        'phone': '',
        'countryCode': '',
        'contactPersons': [
          {
            'email': '',
            'firstName': '',
            'lastName': '',
            'phone1': '',
            'phone2': '',
          },
        ],
        'city': '',
        'description': '',
        'office': '',
        'street': '',
      };
    }
    const [year, month, day] = client.birthDate
      ? client.birthDate.slice(0, 10).split('-')
      : ['', '', ''];
    this.state={
      client: {
        ...client,
        checkOn: client.checkOn || false,
        retailOn: client.retailOn || false,
        manufacturerCode: 3,
      },
      year,
      month,
      day,
      edit: props.edit,
      clients: props.client,

    };

    this.handleChange = this.handleChange.bind(this);
    this.handleBirthdayChange = this.handleBirthdayChange.bind(this);
    this.toggleChange = this.toggleChange.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.addProduct = this.addProduct.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.toggleExProd = this.toggleExProd.bind(this);
    this.onCloseExProd = this.onCloseExProd.bind(this);
    this.toggleStorehouseProduct = this.toggleStorehouseProduct.bind(this);
    this.onCloseStorehouseProduct = this.onCloseStorehouseProduct.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(companyActions.get());
  }

  componentWillReceiveProps(newProps) {
    if (newProps.client.status === 200) {
      setTimeout(() => this.props.onClose(), 1000);
    }
    if ( JSON.stringify(this.props.alert) !== JSON.stringify(newProps.alert)) {
      this.setState({ alert: newProps.alert });
      setTimeout(() => {
        this.setState({ ...this.state, alert: [] });
      }, 3000);
    }

    if ( JSON.stringify(this.props.client) !== JSON.stringify(newProps.client)) {
      this.setState({ clients: newProps.client });
    }
    if ( JSON.stringify(this.props.client_working) !== JSON.stringify(newProps.client_working)) {
      this.setState({ client: newProps.client_working });
    }
  }

  getDayOptionList() {
    const options = [];
    for (let i = 1; i <= 31; i++) {
      options.push(i);
    }

    return options.map((item) => {
      const optionValue = String(item).length === 1 ? `0${item}` : item;
      return <option value={optionValue}>{optionValue}</option>;
    });
  }

  getMonthOptionList() {
    const options = [
      {
        value: '01',
        label: this.props.t('????????????'),
      },
      {
        value: '02',
        label: this.props.t('??????????????'),
      },
      {
        value: '03',
        label: this.props.t('????????'),
      },
      {
        value: '04',
        label: this.props.t('????????????'),
      },
      {
        value: '05',
        label: this.props.t('??????'),
      },
      {
        value: '06',
        label: this.props.t('????????'),
      },
      {
        value: '07',
        label: this.props.t('????????'),
      },
      {
        value: '08',
        label: this.props.t('????????????'),
      },
      {
        value: '09',
        label: this.props.t('????????????????'),
      },
      {
        value: '10',
        label: this.props.t('??????????????'),
      },
      {
        value: '11',
        label: this.props.t('????????????'),
      },
      {
        value: '12',
        label: this.props.t('??????????????'),
      },
    ];

    return options.map(({ value, label }) => <option value={value}>{label}</option>);
  }

  getYearOptionList() {
    const options = [];
    for (let i = parseInt(moment().format('YYYY')); i >= 1900; i--) {
      options.push(i);
    }

    return options.map((item) => <option value={item}>{item}</option>);
  }

  render() {
    const { company, material, t } = this.props;
    const { categories, brands, suppliers, units } = material;
    const { day, month, year, client, edit, alert, clients, exProdOpen, storehouseProductOpen, ex_product_working, storehouseProduct_working } = this.state;
    const companyTypeId = company.settings && company.settings.companyTypeId;


    const isValidPhone = client && client.phone && isValidNumber(client.phone.startsWith('+') ? client.phone : `+${client.phone}`);

    return (
      <Modal size="md" onClose={this.closeModal} showCloseButton={false} className="mod modal-product-details">
        <div className="">
          {client &&
                    <div>
                      <div className="modal-content">
                        <div className="modal-header">
                          {!edit ? <h4 className="modal-title">{t("?????????? ??????????")}</h4>
                            : <h4 className="modal-title">{t("???????????? ????????????")}</h4>
                          }
                          <button type="button" className="close" onClick={this.closeModal} />
                        </div>
                        <div className="form-group mr-3 ml-3">
                          <div className="row main-info">
                            <div className="col-sm-8">
                              <InputCounter title={t("????????????????????????")} placeholder={t("???????????????? ?????????????? ??????????????")} value={client.productName}
                                name="productName" handleChange={this.handleChange} maxLength={128} disabled={true}/>
                              <div className="row">
                                <div className="col-sm-4">
                                  <p>{t("?????????????? ??????????????????")}</p>
                                  <select className="custom-select" name="unitId" onChange={this.handleChange}
                                    value={client.unitId} disabled={true}>
                                    <option value="">{t("???????????????? ?????????????? ??????????????????")}</option>
                                    {units.map((brand) => <option value={brand.unitId}>{t(brand.unitName)}</option>)}
                                  </select>
                                </div>
                                <div className="col-sm-4">
                                  <InputCounter title={t("?????????????? ??????????")} placeholder={t("?????????????? ?????????????????????? ??????????")} value={String(client.nominalAmount)}
                                    name="nominalAmount" handleChange={this.handleChange} maxLength={9} disabled={true} />
                                </div>
                                <div className="col-sm-4">
                                  <InputCounter title={t("?????? ????????????")} placeholder={t("?????????????? ??????")} value={client.productCode}
                                    name="productCode" handleChange={this.handleChange} maxLength={7} disabled={true}/>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-4">
                              <p>{t("??????????????????")}</p>
                              <select className="custom-select" name="categoryId" onChange={this.handleChange}
                                value={client.categoryId} disabled={true}>
                                <option value="">{t("???????????????? ??????????????????")}</option>
                                {categories.map((category) => <option value={category.categoryId}>{category.categoryName}</option>)}
                              </select>

                              <p>{t("??????????")}</p>
                              <select className="custom-select" name="brandId" onChange={this.handleChange}
                                value={client.brandId} disabled={true}>
                                <option value="">{t("???????????????? ??????????")}</option>
                                {brands.map((brand) => <option value={brand.brandId}>{brand.brandName}</option>)}
                              </select>
                            </div>

                          </div>

                          <hr/>
                          <div className="row min-amount-and-description">
                            <div className="col-sm-4">
                              <InputCounter title={t("?????????????????????? ????????????????????")} placeholder={t("?????????????? ????????????????????")} value={client.minAmount} name="minAmount"
                                handleChange={this.handleChange} maxLength={9} disabled={true}/>
                            </div>
                            <div className="col-sm-8">
                              <InputCounter title={t("????????????????")} placeholder={t("????????????????")} value={client.description}
                                name="description" handleChange={this.handleChange} maxLength={128} disabled={true}/>
                            </div>
                          </div>

                          <div className="row">
                            <div className="check-cox-block col-sm-4">
                              <div className="check-box">
                                <label>
                                  <input className="form-check-input"
                                    checked={client.checkOn}
                                    onChange={()=>this.toggleChange('checkOn')}
                                    type="checkbox"
                                    disabled={true}/>
                                  <span className="check-box-circle" />
                                  {t("???????????????? ???????????????? ????????????")}
                                </label>
                              </div>

                              <div className="check-box">
                                <label>
                                  <input className="form-check-input"
                                    checked={client.retailOn}
                                    onChange={()=>this.toggleChange('retailOn')}
                                    type="checkbox"
                                    disabled={true}/>
                                  <span className="check-box-circle" />
                                                {t("???????????????? ?????????????? ?? ??????????????")}
                                </label>
                              </div>
                            </div>
                            <div className="col-sm-8 info-product-buttons">
                              <p className="in-storehouse"><span> {client.currentAmount}</span>{t("?????????????? ???? ????????????")}</p>
                              <p className="plus" onClick={()=>this.toggleStorehouseProduct(client)}>+ {t("??????????????????????")}</p>
                              <p className="minus" onClick={()=>this.toggleExProd(client)}>??? {t("????????????????")}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
          }
        </div>
        {exProdOpen &&
                <ExpenditureProduct
                  edit={!!ex_product_working}
                  client_working={ex_product_working}
                  addStaffEmail={this.addStaffEmail}
                  onClose={this.onCloseExProd}
                  productPageNum={this.props.productPageNum || 1}
                />
        }
        {storehouseProductOpen &&
                <StorehouseProduct
                  edit={!!storehouseProduct_working}
                  client_working={storehouseProduct_working}
                  addStaffEmail={this.addStaffEmail}
                  onClose={this.onCloseStorehouseProduct}
                  suppliers={suppliers}
                  productPageNum={this.props.productPageNum || 1}
                />
        }

      </Modal>
    );
  }
  toggleExProd(ex_product_working) {
    this.setState({ ex_product_working, exProdOpen: true });
  }

  onCloseExProd() {
    this.setState({ exProdOpen: false });
  }

  toggleStorehouseProduct(storehouseProduct_working) {
    this.setState({ storehouseProduct_working, storehouseProductOpen: true });
  }

  onCloseStorehouseProduct() {
    this.setState({ storehouseProductOpen: false });
  }

  handleBirthdayChange({ target: { name, value } }) {
    this.setState({ [name]: value });
  }

  handleChange(e) {
    const { name, value } = e.target;
    const { client } = this.state;

    const newValue = value;


    this.setState({ client: { ...client, [name]: newValue } });
  }

  toggleChange(key) {
    const { client } = this.state;

    this.setState({ client: { ...client, [key]: !this.state.client[key] } });
  }

  updateProduct(client) {
    this.props.dispatch(materialActions.toggleProduct(client, true));
  };

  addProduct() {
    const { addProduct, isModalShouldPassClient } = this.props;
    const { client, day, month, year } = this.state;
    let birthDate;
    if (day || month || year) {
      birthDate =`${year}-${month}-${day}`;
    }
    if (isModalShouldPassClient) {
      this.props.checkUser(client);
    }
    const body = JSON.parse(JSON.stringify(client));
    body.phone = body.phone.startsWith('+') ? body.phone : `+${body.phone}`;

    this.props.dispatch(materialActions.toggleProduct(client));
  };

  closeModal() {
    const { onClose } = this.props;

    return onClose();
  }
}

function mapStateToProps(state) {
  const { alert, client, company, material } = state;
  return {
    alert, client, company, material,
  };
}

InfoProduct.propTypes ={
  client_working: PropTypes.object,
  edit: PropTypes.bool.isRequired,
  isModalShouldPassClient: PropTypes.bool,
  updateProduct: PropTypes.func,
  checkUser: PropTypes.func,
  addProduct: PropTypes.func,
  onClose: PropTypes.func,
};

const connectedApp = connect(mapStateToProps)(withTranslation("common")(InfoProduct));
export { connectedApp as InfoProduct };
