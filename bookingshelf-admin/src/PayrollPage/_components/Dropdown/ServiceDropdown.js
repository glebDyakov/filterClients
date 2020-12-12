import React, { Component } from 'react';
import DropdownListItems from './DropdownListItems';
import DropdownItem from './DropdownItem';

class ServiceDropdownItem extends Component {
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
    const { serviceGroup } = this.props;

    return (
      <React.Fragment>
        <DropdownItem key={serviceGroup.serviceGroupId}>
          <div onClick={this.handleCollapse}
               className="dropdown-item d-flex justify-content-between align-items-center">
            <div className="left-container d-flex align-items-center">
              <button
                className={serviceGroup.color.toLowerCase() + 'ButtonEdit ' + 'button-collapse' + (this.state.isOpened ? ' collapsed' : '')}/>
              <p className="service-group-name">{serviceGroup.name}</p>
            </div>
            <label className="percent"><input disabled value="50%" type="text"/></label>
          </div>

          {this.state.isOpened &&
          <div className="nested-dropdown">
            {serviceGroup.services.map((service) =>
              <DropdownItem key={service.serviceId}>
                <div className="dropdown-item d-flex justify-content-between align-items-center">
                  <div className="left-container d-flex align-items-center">
                    <p className="service-name">{service.name}</p>
                  </div>
                  <label className="percent"><input disabled value="50%" type="text"/></label>
                </div>
              </DropdownItem>,
            )}
          </div>}
        </DropdownItem>
      </React.Fragment>
    );
  }
}

export default ServiceDropdownItem;
