import React, { Component } from 'react';
import DropdownItem from './DropdownItem';

class ServiceDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpened: this.props.isOpened,
      servicesPercent: this.props.servicesPercent,
      serviceGroupsPercent: this.props.serviceGroupsPercent,
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

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.servicesPercent) !== JSON.stringify(nextProps.servicesPercent)) {
      this.setState({
        servicesPercent: nextProps.servicesPercent,
      });
    }

    if (JSON.stringify(this.props.serviceGroupsPercent) !== JSON.stringify(nextProps.serviceGroupsPercent)) {
      this.setState({
        serviceGroupsPercent: nextProps.serviceGroupsPercent,
      });
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
              const servicePercent = this.state.servicesPercent.find((sp) => sp.serviceId === service.serviceId) || { percent: '' };

              return (
                <DropdownItem key={service.serviceId}>
                  <div className="dropdown_item d-flex justify-content-between align-items-center">
                    <div className="left-container d-flex align-items-center">
                      <p className="service-name">{service.name}</p>
                    </div>
                    <label className="percent"><input placeholder="%" onChange={(e) => {
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
