import React, { Component } from 'react';
import PercentListItem from './PercentListItem';

class PercentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
    };

    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(e) {
    const { value } = e.target;
    this.setState((state) => ({
      searchValue: value,
    }));
  }

  render() {
    const { items, handleSubmit, handleChange } = this.props;

    return (
      <ul ref={(node) => (this.list = node)}
          className="dropdown d-flex flex-column">
        <li className="dropdown_item search-item">
          <input onChange={this.handleSearch}
                 placeholder="Введите название категории"
                 className="search-input"
                 type="text"/>
        </li>

        {items.filter((item) =>
          item.title.toLowerCase().includes(this.state.searchValue.toLowerCase()))
          .map((item, index) => (
            <PercentListItem typePercent={this.props.typePercent} handleChange={handleChange} handleSubmit={handleSubmit} key={index} item={item}/>
          ))}
      </ul>
    );
  }
}

export default PercentList;
