import React, {Component} from 'react';
import DropdownSearchItem from "./Dropdown/DropdownSearchItem";
import Dropdown from "./Dropdown/Dropdown";
import DropdownListItems from "./Dropdown/DropdownListItems";
import DropdownItem from "./Dropdown/DropdownItem";

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
            <Dropdown onClose={() => {
              this.setState({isOpenServicesDropdown: false})
            }}>
              <DropdownSearchItem>
                Введите название категории
              </DropdownSearchItem>
              <DropdownListItems>
                <DropdownItem>
                  <div className="dropdown-item d-flex justify-content-between align-items-center">
                    <div className="left-container d-flex align-items-center">
                      <button className="button-collapse"/>
                      <p className="service-group-name">text</p>
                    </div>
                    <label className="percent"><input disabled value="50%" type="text"/></label>
                  </div>
                </DropdownItem>
                {/* map and create dromdown items  */}
              </DropdownListItems>
            </Dropdown>}
            <label className="percent mr-4 text-center"><span>%</span>
              <input placeholder="%" type="text" min="0" max="100"/>
            </label>
          </div>
          <div className="products-container col">
            <label className="products">Все товары
              <a onClick={this.handleOpenProductsDropdown} className="product-select">Женские крема со второй
                строчкой</a>
            </label>

            {this.state.isOpenProductsDropdown &&
            <Dropdown onClose={() => {
              this.setState({isOpenProductsDropdown: false})
            }}>
              <DropdownSearchItem>
                Введите название категории
              </DropdownSearchItem>
              <DropdownListItems>
                <DropdownItem>
                  <div className="dropdown-item d-flex justify-content-between align-items-center">
                    <div className="left-container d-flex align-items-center">
                      <button className="button-collapse"/>
                      <p className="service-group-name">text</p>
                    </div>
                    <label className="percent"><input disabled value="50%" type="text"/></label>
                  </div>
                </DropdownItem>
                {/* map and create dromdown items  */}
              </DropdownListItems>
            </Dropdown>}

            <label className="percent text-center"><span>%</span>
              <input placeholder="%" type="number" min="0" max="100"/>

            </label>


          </div>
        </div>

        <a className="delete-button">Удалить -</a>
      </div>
    );
  }
}

export default PercentOfSales;
