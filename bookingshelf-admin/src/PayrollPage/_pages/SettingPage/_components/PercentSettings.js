import React, { Component } from 'react';
import PercentList from './PercentList';
import SettingContext from '../../../_context/SettingContext';

class PercentSettings extends Component {

  render() {
    const { material, services } = this.context;

    console.log(services);

    const servicesGroupsItems = services && services.map((serviceGroup) => ({
      id: serviceGroup.serviceGroupId,
      title: serviceGroup.name,
      color: serviceGroup.color,
      nestedItems: serviceGroup.services.map((service) => ({
        id: service.id,
        title: service.name,
      })),
    })) || [];

    const productsCategories = material.categories.map((category) => {
      const products = material.products.filter((product) => product.categoryId === category.categoryId);
      return {
        id: category.categoryId,
        title: category.categoryName,
        color: '',
        nestedItems: products.map((product) => ({
          id: product.productId,
          title: product.productName
        })),
      };
    });


    return (
      <div className="percent-of-sales-container">
        <div className="percent-of-sales">
          <div className="services-container col">
            <PercentList items={servicesGroupsItems}/>
          </div>
          <div className="products-container col">
            <PercentList items={productsCategories}/>
          </div>
        </div>
      </div>
    );
  }
}


PercentSettings.contextType = SettingContext;

export default PercentSettings;
