import React, {Component} from 'react';

class DropdownSearchItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children, onChange } = this.props;


    return (
      <li className="dropdown_item search-item">
        <input onChange={onChange} placeholder={children} className="search-input" type="text"/>
      </li>
    );
  }
}

export default DropdownSearchItem;
