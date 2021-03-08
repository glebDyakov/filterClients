import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from '@trendmicro/react-modal';
import {withTranslation} from "react-i18next";

class CreatedService extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
      service: null,
      services: props.services && props.services,
      serviceCurrent: props.serviceCurrent && props.serviceCurrent,
    };

    this.newService=this.newService.bind(this);
    this.setService=this.setService.bind(this);
    this.newGroup=this.newGroup.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if ( JSON.stringify(this.props.services) !== JSON.stringify(newProps.services)) {
      this.setState({ ...this.state, services: newProps.services });
    }
  }

  render() {
    const { services, serviceCurrent, service }=this.state;
    const { t } = this.props;
    const serviceSet=service || serviceCurrent;

    return (
      <Modal size="lg" style={{ maxWidth: '480px' }} onClose={this.closeModal} showCloseButton={false} className="mod">

        <div className="modal_add_service_by_list_group" tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="" role="document">
            <div className="modal-content visibleDropdown">
              <div className="modal-header">
                <h4 className="modal-title">{t("Выберите группу услуг")}</h4>
                <button type="button" className="close" onClick={this.closeModal} />
              </div>
              <div className="modal-body">
                <div className="select-color dropdown mb-3 border-color">
                  {
                    serviceCurrent || service ?
                      <a className={serviceSet.color.toLowerCase() + ' '+'select-button dropdown-toggle'}
                        data-toggle="dropdown" href="#" ><span
                          className={serviceSet.color.toLowerCase() + ' '+'color-circle'}/><span
                          className="yellow"><span className="items-color"><span>{serviceSet.name}</span></span></span>
                      </a>

                      : <a className="select-button dropdown-toggle yellow"
                        data-toggle="dropdown" href="#"><span
                          className="color-circle yellow"/><span
                          className="yellow"><span className="items-color"><span>{t("Выберите группу услуг")}</span> </span></span>
                      </a>
                  }
                  <ul className="dropdown-menu">
                    {
                      services.services && services.services.map((service)=>
                        <li className="dropdown-item"><a onClick={()=>this.setService(service)}><span
                          className={service.color.toLowerCase() + ' '+'color-circle'}/><span className={service.color.toLowerCase()}>{service.name}</span></a>
                        </li>,
                      )
                    }
                  </ul>
                </div>

                <div className="d-flex justify-content-center align-items-center flex-column">
                  <button type="button" className="button-next" onClick={(e)=>this.newService(e)}>{t("Далее")}
                  </button>
                  <button type="button" className="button-new" onClick={(e)=>this.newGroup()}>{t("Новая группа услуг")}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </Modal>

    );
  }
  newGroup(e) {
    this.setState({ ...this.state, service: null });

    this.props.newServiceGroup(null, false, e);
  }

  newService(e) {
    const { services, serviceCurrent, service }=this.state;

    const cons=serviceCurrent&&services.services[services.services.length-1];

    if (service!=null || cons!=null) {
      return this.props.newServiceFromGroup(null, serviceCurrent?cons:service, e, this);
    }
  }

  setService(service) {
    this.setState({ ...this.state, service: service, serviceCurrent: null });
  }

  closeModal() {
    const { onClose } = this.props;

    return onClose();
  }
}


function mapStateToProps(state) {
  const { alert } = state;
  return {
    alert,
  };
}

CreatedService.propTypes ={
  services: PropTypes.object,
  newServiceGroup: PropTypes.func,
  newServiceFromGroup: PropTypes.func,
  serviceCurrent: PropTypes.object,
  onClose: PropTypes.func,

};

const connectedApp = connect(mapStateToProps)(withTranslation("common")(CreatedService));
export { connectedApp as CreatedService };
