import React, { Component } from 'react';
import DropdownItem from './DropdownItem';

class ServiceDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpened: false,
      groupPercent: 0,
    };

    this.handleCollapse = this.handleCollapse.bind(this);
    this.changeGroupPercent = this.changeGroupPercent.bind(this);
  }

  handleCollapse() {
    this.setState((state) => {
      return {
        isOpened: !state.isOpened,
      };
    });
  }

  changeGroupPercent(e) {
    const { value } = e.target;
    if (value >= 0 && value <= 100) {
    }
  }

  render() {
    const { serviceGroup } = this.props;

    return (
      <React.Fragment>
        <DropdownItem key={serviceGroup.serviceGroupId}>
          <div
            className="dropdown_item d-flex justify-content-between align-items-center">
            <div className="left-container d-flex align-items-center">
              <button onClick={this.handleCollapse}
                      className={serviceGroup.color.toLowerCase() + 'ButtonEdit ' + 'button-collapse' + (this.state.isOpened ? ' collapsed' : '')}/>
              <p className="service-group-name">{serviceGroup.name}</p>
            </div>
            <label className="percent"><input placeholder="%" onChange={(e) => {
              this.props.changeGroupServicePercent(e, serviceGroup.serviceGroupId);
            }} value={this.props.serviceGroupPercent.percent}
                                              type="text"/></label>
          </div>

          {this.state.isOpened &&
          <div className="nested-dropdown">
            {serviceGroup.services.map((service) => {
                const servicePercent = this.props.servicesPercent.find(sp => sp.serviceId === service.serviceId) || { percent: '' };

                return (
                  <DropdownItem key={service.serviceId}>
                    <div className="dropdown_item d-flex justify-content-between align-items-center">
                      <div className="left-container d-flex align-items-center">
                        <p className="service-name">{service.name}</p>
                      </div>
                      <label className="percent"><input placeholder="%"  onChange={(e) => {
                        this.props.handleChangeServicePercent(e, service.serviceId);
                      }} value={servicePercent.percent} type="text"/></label>
                    </div>
                  </DropdownItem>);
              },
            )}
          </div>}
        </DropdownItem>
      </React.Fragment>
    );
  }
}

export default ServiceDropdown;
