import React, { Component } from 'react';
import IntervalInput from '../../../_components/timeoutElements/IntervalInput';

class PercentListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };

    this.handleCollapse = this.handleCollapse.bind(this);
  }

  handleCollapse() {
    this.setState((state) => ({
      isOpen: !state.isOpen,
    }));
  }

  render() {
    const { item, handleSubmit, handleChange } = this.props;


    return (
      <>
        <li className="dropdown_item d-flex justify-content-between align-items-center">
          <div className="left-container d-flex align-items-center">
            <button onClick={this.handleCollapse}
                    className={(item.color !== '' ? item.color.toLowerCase() + 'ButtonEdit ' : '') + 'button-collapse' + (this.state.isOpen ? ' collapsed' : '')}/>
            <p className="service-group-name">{item.title}</p>
          </div>
          <label className="percent"><input value={item.amount} onChange={(e) => {
            console.log('change');
          }} placeholder="%" type="number"/></label>
        </li>

        {this.state.isOpen &&
        <ul className="nested-dropdown">
          {item.nestedItems.map((nestedItem, index) =>
            <div key={index} className="dropdown_item d-flex justify-content-between align-items-center">
              <div className="left-container d-flex align-items-center">
                <p className="service-name">{nestedItem.title}</p>
              </div>
              <label className="percent">
                <IntervalInput value={nestedItem.amount}
                               changeEvent={handleChange}
                               isNested={true}
                               typePercent={this.props.typePercent}
                               item={nestedItem}
                               placeholder="%"
                               action={handleSubmit}
                               type="number"/></label>
            </div>,
          )}
        </ul>}
      </>
    );
  }
}

export default PercentListItem;
