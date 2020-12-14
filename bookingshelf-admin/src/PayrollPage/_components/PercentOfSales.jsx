import React, { Component } from 'react';
import DropdownSearchItem from './Dropdown/DropdownSearchItem';
import Dropdown from './Dropdown/Dropdown';
import DropdownListItems from './Dropdown/DropdownListItems';
import ServiceDropdown from './Dropdown/ServiceDropdown';
import ProductDropdown from './Dropdown/ProductDropdown';

class PercentOfSales extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpenServicesDropdown: false,
      isOpenProductsDropdown: false,

      servicesPercent: props.servicesPercent,
      serviceGroupsPercent: props.serviceGroupsPercent,

    };

    this.handleOpenServicesDropdown = this.handleOpenServicesDropdown.bind(this);
    this.handleOpenProductsDropdown = this.handleOpenProductsDropdown.bind(this);
    this.changeServicePercent = this.changeServicePercent.bind(this);
    this.changeGroupServicePercent = this.changeGroupServicePercent.bind(this);
    this.getServiceGroupPercent = this.getServiceGroupPercent.bind(this);
  }

  handleOpenServicesDropdown() {
    this.setState(state => {
      return { isOpenServicesDropdown: !state.isOpenServicesDropdown };
    });
  }

  handleOpenProductsDropdown() {
    this.setState(state => {
      return { isOpenProductsDropdown: !state.isOpenProductsDropdown };
    });
  }

  changeServicePercent(e, serviceId) {
    const { value } = e.target;
    if (value >= 0 && value <= 100 || value === '') {
      this.state.servicesPercent.some((sp) => sp.serviceId === serviceId)
        ? this.setState((state) => {
          const servicesPercent = state.servicesPercent.map(sp => sp.serviceId === serviceId
            ? {
              ...sp,
              percent: value === '' ? 0 : parseInt(value, 10),
            }
            : sp);

          return {
            servicesPercent,
          };
        })
        : this.setState((state) => {
          const servicesPercent = state.servicesPercent;

          servicesPercent.push({
            serviceId,
            percent: value,
          });

          return {
            servicesPercent,
          };
        });
    }
  }

  changeGroupServicePercent(e, serviceGroupId) {
    const { value } = e.target;
    if (value >= 0 && value <= 100 || value === '') {
      this.state.serviceGroupsPercent.some((sp) => sp.serviceGroupId === serviceGroupId)
        ? this.setState((state) => {
          const serviceGroupsPercent = state.serviceGroupsPercent.map((sp) => sp.serviceGroupId === serviceGroupId
            ? {
              ...sp,
              percent: value === '' ? 0 : parseInt(value, 10),
            }
            : sp);

          return {
            serviceGroupsPercent,
          };
        })
        : this.setState((state) => {
          const serviceGroupsPercent = state.serviceGroupsPercent;

          serviceGroupsPercent.push({
            serviceGroupId,
            percent: value,
          });

          return {
            serviceGroupsPercent,
          };
        });


      this.props.serviceGroups.filter(sg => sg.serviceGroupId === serviceGroupId)
        .flatMap(sg => sg.services)
        .map(service => this.changeServicePercent(e, service.serviceId));
    }
  }

  getServiceGroupPercent(serviceGroup) {
    return this.state.serviceGroupsPercent.find(sp => sp.serviceGroupId === serviceGroup.serviceGroupId) || { percent: '' };
  }

  render() {
    return (
      <div className="percent-of-sales-container">
        <div className="percent-of-sales">
          <div className="services-container col">
            <label className="services">Все услуги
              <a onClick={this.handleOpenServicesDropdown}
                 className="service-select">Выберите услугу</a>
            </label>

            {this.state.isOpenServicesDropdown &&
            <Dropdown onClose={() => {
              this.setState({ isOpenServicesDropdown: false });
            }}>
              <DropdownSearchItem>
                Введите название категории
              </DropdownSearchItem>
              <DropdownListItems>
                {this.props.serviceGroups && this.props.serviceGroups.map((serviceGroup) =>
                  <ServiceDropdown
                    key={serviceGroup.serviceGroupId}
                    serviceGroup={serviceGroup}
                    servicesPercent={this.state.servicesPercent}
                    serviceGroupPercent={this.getServiceGroupPercent(serviceGroup)}
                    handleChangeServicePercent={this.changeServicePercent}
                    changeGroupServicePercent={this.changeGroupServicePercent}
                  />)}
              </DropdownListItems>
            </Dropdown>}
            <label className="percent mr-4 text-center"><span>%</span>
              <input placeholder="%" type="text" min="0" max="100"/>
            </label>
          </div>
          <div className="products-container col">
            <label className="products">Все товары
              <a onClick={this.handleOpenProductsDropdown} className="product-select">Выберите товар</a>
            </label>

            {this.state.isOpenProductsDropdown &&
            <Dropdown onClose={() => {
              this.setState({ isOpenProductsDropdown: false });
            }}>
              <DropdownSearchItem>
                Введите название категории
              </DropdownSearchItem>
              <DropdownListItems>
                {this.props.material.categories.map((category) =>
                  <ProductDropdown
                    key={category.categoryId}
                    category={category}
                    products={this.props.material.products}
                  />,
                )}
              </DropdownListItems>
            </Dropdown>}
            <label className="percent text-center"><span>%</span>
              <input placeholder="%" type="number" min="0" max="100"/>
            </label>
          </div>
        </div>
      </div>
    );
  }
}

export default PercentOfSales;
