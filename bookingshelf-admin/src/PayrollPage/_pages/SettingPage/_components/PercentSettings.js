import React, { Component } from 'react';
import PercentList from './PercentList';
import SettingContext from '../../../_context/SettingContext';

class PercentSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      serviceGroups: [],
      productCategories: [],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.getPrevItem = this.getPrevItem.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.initData = this.initData.bind(this);
    this.handleSubmitGroup = this.handleSubmitGroup.bind(this);

  }

  componentDidMount() {
    this.initData();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (JSON.stringify(this.context) !== JSON.stringify(nextContext)) {
      this.initData(nextContext);
    }
  }

  initData(context = this.context) {
    const { material, services } = context;

    const servicesGroupsItems = services && services.map((serviceGroup) => {
      const serviceGroupPercent = context.payroll.serviceGroupsPercent.find((serviceGroupPercent) => serviceGroupPercent.serviceGroupId === serviceGroup.serviceGroupId);
      return {
        id: serviceGroup.serviceGroupId,
        title: serviceGroup.name,
        color: serviceGroup.color,
        amount: serviceGroupPercent ? serviceGroupPercent.percent : '',
        type: 'servicegroups',
        nestedItems: serviceGroup.services.map((service) => {
          const servicesPercent = context.payroll.servicesPercent.find((servicePercent) => servicePercent.serviceId === service.serviceId);
          return {
            nestedId: serviceGroup.serviceGroupId,
            id: service.serviceId,
            title: service.name,
            amount: servicesPercent ? servicesPercent.percent : '',
            type: 'services',
          };
        }),
      };
    }) || [];

    const productsCategories = material.categories.map((category) => {
      const products = material.products.filter((product) => product.categoryId === category.categoryId);
      return {
        id: category.categoryId,
        title: category.categoryName,
        color: '',
        amount: '',

        type: 'category',
        nestedItems: products.map((product) => {
          const productsPercent = context.payroll.productsPercent.find((productPercent) => productPercent.productId === product.productId);
          return {
            id: product.productId,
            title: product.productName,
            amount: productsPercent ? productsPercent.percent : '',
            type: 'products',
          };
        }),
      };
    });

    this.setState({
      serviceGroups: servicesGroupsItems,
      productCategories: productsCategories,
    });
  }

  getPrevItem(type, id) {
    switch (type) {
      case 'services':
        return this.context.payroll.servicesPercent.find((service) => service.serviceId === id);
      case 'servicegroups':
        return this.context.payroll.serviceGroupsPercent.find((serviceGroup) => serviceGroup.serviceGroupId === id);
      case 'products':
        return this.context.payroll.productsPercent.find((product) => product.productId === id);
    }
  }

  getIdType(type) {
    switch (type) {
      case 'servicegroups':
        return 'serviceGroupId';
      default:
        return type.substr(0, type.length - 1) + 'Id';
    }
  }

  getSubmitNestedItem(item) {
    const prevItem = this.getPrevItem(item.type, item.id);

    if (prevItem) {
      return {
        ...prevItem,
        percent: item.amount,
      };
    } else {
      return {
        percent: item.amount,
        [this.getIdType(item.type)]: item.id,
      };
    }
  }

  handleSubmit(item, type = 'services') {
    if (item.type === 'services' || item.type === 'products') {
      const newItem = this.getSubmitNestedItem(item);

      this.context.handleUpdatePercents(item.type, [newItem]);
    }
  }

  getType(type) {
    switch (type) {
      case 'servicegroups':
        return 'services';
      case 'category':
        return 'products';
    }
  }

  handleSubmitGroup(item, type) {
    const items = item.nestedItems.map(i => this.getSubmitNestedItem(i));
    const itemType = this.getType(type);
    if (itemType === 'services') {
      this.context.handleUpdatePercents('servicegroups', [this.getSubmitNestedItem(item)]);
      this.context.handleUpdatePercents('services', items);
    } else {
      this.context.handleUpdatePercents(this.getType(type), items);
    }
  }

  handleChange(type, item, isNested = false) {
    console.log(item);
    if (isNested) {
      this.setState((state) => ({
        [type]: state[type].map(group => {
          return {
            ...group,
            nestedItems: group.nestedItems.map(nestedItem => item.id === nestedItem.id ? {
                ...nestedItem,
                amount: item.amount,
              } : nestedItem,
            ),
          };
        }),
      }));
    } else {
      this.setState((state) => ({
        [type]: state[type].map(i => i.id === item.id ? {
          ...i,
          amount: item.amount,
          nestedItems: item.nestedItems.map(ni => ({ ...ni, amount: item.amount })),
        } : i),
      }));
    }
  }

  render() {
    return (
      <div className="percent-of-sales-container">
        <div className="percent-of-sales">
          <div className="services-container col">
            {(this.context.payroll.servicesSaveStatus === 200
              || this.context.payroll.serviceGroupsSaveStatus === 200)
            && <p className="alert-success p-1 rounded pl-3 mb-2">Сохранено</p>}
            <PercentList typePercent="serviceGroups" handleChange={this.handleChange}
                         handleSubmitGroup={this.handleSubmitGroup} handleSubmit={this.handleSubmit}
                         items={this.state.serviceGroups}/>
          </div>
          <div className="products-container col">
            {(this.context.payroll.productsSaveStatus === 200)
            && <p className="alert-success p-1 rounded pl-3 mb-2">Сохранено</p>}
            <PercentList typePercent="productCategories" handleChange={this.handleChange}
                         handleSubmitGroup={this.handleSubmitGroup} handleSubmit={this.handleSubmit}
                         items={this.state.productCategories}/>
          </div>
        </div>
      </div>
    );
  }
}


PercentSettings.contextType = SettingContext;

export default PercentSettings;
