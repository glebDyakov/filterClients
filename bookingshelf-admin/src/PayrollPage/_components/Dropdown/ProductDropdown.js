import React, { Component } from 'react';
import DropdownItem from './DropdownItem';
import DropdownListItems from './DropdownListItems';

class ProductDropdownItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpened: false,
    };
    this.handleCollapse = this.handleCollapse.bind(this);
  }

  handleCollapse() {
    this.setState((state) => {
      return {
        isOpened: !state.isOpened,
      };
    });
  }
  render() {
    const { category, products } = this.props;

    return (
      <React.Fragment>
        <DropdownItem>
          <div onClick={this.handleCollapse} className="dropdown-item d-flex justify-content-between align-items-center">
            <div className="left-container d-flex align-items-center">
              <button className={'button-collapse' + (this.state.isOpened ? ' collapsed' : '')}/>
              <p className="service-group-name">{category.categoryName}</p>
            </div>
            <label className="percent"><input disabled value="50%" type="text"/></label>
          </div>
        </DropdownItem>

        {this.state.isOpened &&
        <div className="nested-dropdown">
          {products.filter(p => p.categoryId === category.categoryId).map((product) =>
            <DropdownListItems key={product.productId}>
              <div className="dropdown-item d-flex justify-content-between align-items-center">
                <div className="left-container d-flex align-items-center">
                  <p className="service-name">{product.productName}</p>
                </div>
                <label className="percent"><input disabled value="50%" type="text"/></label>
              </div>
            </DropdownListItems>,
          )}
        </div>}
      </React.Fragment>
    );
  }
}

export default ProductDropdownItem;
