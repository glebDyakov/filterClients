import React, {Component} from 'react';
import DropdownGroup from './DropdownItem/DropdownGroup';
import Hint from "../../_components/Hint";

class PercentOfSales extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpenServicesDropdown: false,
      isOpenProductsDropdown: false,
    }

    this.handleOpenServicesDropdown = this.handleOpenServicesDropdown.bind(this);
    this.handleOpenProductsDropdown = this.handleOpenProductsDropdown.bind(this);
  }

  handleOpenServicesDropdown() {
    this.setState(state => {
      return {isOpenServicesDropdown: !state.isOpenServicesDropdown};
    });
  }

  handleOpenProductsDropdown() {
    this.setState(state => {
      return {isOpenProductsDropdown: !state.isOpenProductsDropdown};
    });
  }

  render() {
    return (
      <div className="percent-of-sales-container">
        <div className="percent-of-sales">
          <div className="services-container col">
            <label className="services">Все услуги
              <a onClick={this.handleOpenServicesDropdown} className="service-select">Укладка волос феном(короткие)</a>
            </label>

            {this.state.isOpenServicesDropdown &&
            <ul className="dropdown">
              <li className="dropdown-item search-item">
                <input placeholder="Введите название категории" className="search-input" type="text"/>
              </li>

              <li className="dropdown-item"><DropdownGroup/></li>
              <li className="dropdown-item"><DropdownGroup/></li>
              <li className="dropdown-item"><DropdownGroup/></li>
              <li className="dropdown-item"><DropdownGroup/></li>
              <li className="dropdown-item"><DropdownGroup/></li>
              <li className="dropdown-item"><DropdownGroup/></li>
              <li className="dropdown-item"><DropdownGroup/></li>
              <li className="dropdown-item"><DropdownGroup/></li>
              <li className="dropdown-item"><DropdownGroup/></li>
            </ul>}
            <label className="percent mr-4 text-center">%
              <input placeholder="%" type="number" min="0" max="100"/>
            </label>
            <Hint customLeft={-15} hintMessage={"message"} />
          </div>
          <div className="products-container col">
            <label className="products">Все товары
              <a onClick={this.handleOpenProductsDropdown} className="product-select">Женские крема со второй
                строчкой</a>
            </label>

            {this.state.isOpenProductsDropdown &&
            <ul className="dropdown">
              <li className="dropdown-item search-item">
                <input placeholder="Введите название категории" className="search-input" type="text"/>
              </li>

              <li className="dropdown-item"><DropdownGroup/></li>
              <li className="dropdown-item"><DropdownGroup/></li>
              <li className="dropdown-item"><DropdownGroup/></li>
              <li className="dropdown-item"><DropdownGroup/></li>
            </ul>}

            <label className="percent text-center">%
              <input placeholder="%" type="number" min="0" max="100"/>
            </label>
            <Hint customLeft={-15} hintMessage={"message"} />


          </div>
        </div>

        <a className="delete-button">Удалить -</a>
      </div>
    );
  }
}

export default PercentOfSales;
