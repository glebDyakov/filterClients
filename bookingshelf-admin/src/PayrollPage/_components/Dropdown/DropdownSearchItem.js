import React, {Component} from 'react';

class DropdownSearchItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children } = this.props;

    return (
      <li className="dropdown-item search-item">
        <input placeholder={children} className="search-input" type="text"/>
      </li>
    );
  }
}

export default DropdownSearchItem;
