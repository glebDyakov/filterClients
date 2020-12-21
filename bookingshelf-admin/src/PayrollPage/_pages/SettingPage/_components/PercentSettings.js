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
      const serviceGroupPercent = this.context.payroll.serviceGroupsPercent.find((serviceGroupPercent) => serviceGroupPercent.serviceGroupId === serviceGroup.serviceGroupId);
      return {
        id: serviceGroup.serviceGroupId,
        title: serviceGroup.name,
        color: serviceGroup.color,
        amount: serviceGroupPercent ? serviceGroupPercent.percent : '',
        type: 'servicegroups',
        nestedItems: serviceGroup.services.map((service) => {
          const servicesPercent = this.context.payroll.servicesPercent.find((servicePercent) => servicePercent.serviceId === service.serviceId);
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
          const productsPercent = this.context.payroll.productsPercent.find((productPercent) => productPercent.productId === product.productId);
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

  handleSubmit(item) {
    if (item.type === 'services' || item.type === 'products') {
      const prevItem = this.getPrevItem(item.type, item.id);
      if (prevItem) {
        const newItem = {
          ...prevItem,
          percent: item.amount,
        };
        this.context.handleUpdatePercents(item.type, [newItem]);
      } else {
        const newItem = {
          percent: item.amount,
          [item.type.substr(0, item.type.length - 1) + "Id"]: item.id,
        };
        this.context.handleUpdatePercents(item.type, [newItem]);
      }
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
        [type]: state[type].map(i => i.id === item.id ? { ...i, amount: item.amount } : i),
      }));
    }
  }

  render() {
    return (
      <div className="percent-of-sales-container">
        <div className="percent-of-sales">
          <div className="services-container col">
            <PercentList typePercent="serviceGroups" handleChange={this.handleChange} handleSubmit={this.handleSubmit}
                         items={this.state.serviceGroups}/>
          </div>
          <div className="products-container col">
            <PercentList typePercent="productCategories" handleChange={this.handleChange}
                         handleSubmit={this.handleSubmit} items={this.state.productCategories}/>
          </div>
        </div>
      </div>
    );
  }
}


PercentSettings.contextType = SettingContext;

export default PercentSettings;
