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
      servicesPercent: props.servicesPercent,
      serviceGroupsPercent: props.serviceGroupsPercent,

      productsPercent: props.productsPercent,
    };

    this.changeServicePercent = this.changeServicePercent.bind(this);
    this.changeGroupServicePercent = this.changeGroupServicePercent.bind(this);
    this.getServiceGroupPercent = this.getServiceGroupPercent.bind(this);
    this.changeProductsPercent = this.changeProductsPercent.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.servicesPercent) !== JSON.stringify(nextProps.servicesPercent)) {
      this.setState({
        servicesPercent: nextProps.servicesPercent,
      });
    }
    if (JSON.stringify(this.props.serviceGroupsPercent) !== JSON.stringify(nextProps.serviceGroupsPercent)) {
      this.setState({
        serviceGroupsPercent: nextProps.serviceGroupsPercent,
      });
    }

    if (JSON.stringify(this.props.productsPercent) !== JSON.stringify(nextProps.productsPercent)) {
      this.setState({
        productsPercent: nextProps.productsPercent,
      });
    }
  }

  changeProductsPercent(e, productId) {
    const { value } = e.target;
    if (value >= 0 && value <= 100 || value === '') {
      this.state.productsPercent.some((sp) => sp.productId === productId)
        ? this.setState((state) => {
          const productsPercent = state.productsPercent.map(sp => sp.productId === productId
            ? {
              ...sp,
              percent: value === '' ? 0 : parseInt(value, 10),
            }
            : sp);

          return {
            productsPercent,
          };
        })
        : this.setState((state) => {
          const productsPercent = state.productsPercent;

          productsPercent.push({
            productId,
            percent: value,
          });

          return {
            productsPercent,
          };
        });
    }
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
            <button onClick={() => {
              this.props.handleSubmitPercents('percentServices', this.state.servicesPercent);
              this.props.handleSubmitPercents('percentServiceGroups', this.state.serviceGroupsPercent);
            }}>save
            </button>

            <Dropdown>
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
            </Dropdown>
          </div>
          <div className="products-container col">

            <button onClick={() => {
              this.props.handleSubmitPercents('percentProducts', this.state.productsPercent);
            }}>save
            </button>
            <Dropdown>
              <DropdownSearchItem>
                Введите название категории
              </DropdownSearchItem>
              <DropdownListItems>
                {this.props.material.categories.map((category) =>
                  <ProductDropdown
                    key={category.categoryId}
                    category={category}
                    products={this.props.material.products}
                    productsPercent={this.state.productsPercent}
                    handleChangeProductPercent={this.changeProductsPercent}
                  />,
                )}
              </DropdownListItems>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }
}

export default PercentOfSales;
