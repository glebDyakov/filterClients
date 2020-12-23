import React, { Component } from 'react';
import PercentListItem from './PercentListItem';
import { withTranslation } from 'react-i18next';

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
    const { items, handleSubmit, handleChange, t } = this.props;

    return (
      <ul ref={(node) => (this.list = node)}
          className="dropdown d-flex flex-column">
        <li className="dropdown_item search-item">
          <input onChange={this.handleSearch}
                 placeholder={t('Введите название категории')}
                 className="search-input"
                 type="text"/>
        </li>

        {items.filter((item) =>
          item.title.toLowerCase().includes(this.state.searchValue.toLowerCase()))
          .map((item, index) => (
            <PercentListItem handleSubmitGroup={this.props.handleSubmitGroup} typePercent={this.props.typePercent} handleChange={handleChange} handleSubmit={handleSubmit} key={index} item={item}/>
          ))}
      </ul>
    );
  }
}

export default withTranslation('common')(PercentList);
