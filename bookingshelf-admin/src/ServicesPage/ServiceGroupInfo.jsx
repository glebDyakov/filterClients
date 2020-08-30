import React, { Component } from 'react';
import ActionModal from '../_components/modals/ActionModal';
import DragDrop from '../_components/DragDrop';

class ServiceGroupInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpenDeleteModal: false,

    };

    this.closeDeleteModal = this.closeDeleteModal.bind(this);
    this.openDeleteModal = this.openDeleteModal.bind(this);
  }

  closeDeleteModal() {
    this.setState({ isOpenDeleteModal: false });
  }

  openDeleteModal() {
    this.setState({ isOpenDeleteModal: true });
  }

  render() {
    const { onCollapse, services, item, keyGroup, dragHandleProps, collapse, handleClick, _delete, dragDropServicesItems, handleServicesDrogEnd, newService } = this.props;

    return (
      <div className={item.color.toLowerCase() + `${(services.services.length - 1) !== keyGroup ? ' mb-3' : ''}` + ' service_one collapsible' + (collapse.indexOf(item.serviceGroupId) === -1 ? ' opened' : '')}
        key={keyGroup}>

        <div className="service-content">
          <span {...dragHandleProps} className="drag-controller"/>

          <div className="col-sm-7 buttonsCollapse d-flex align-items-center">
            <div
              className={item.color.toLowerCase() + 'ButtonEdit ' + 'btn btn-warning text-light float-left mr-3' + (collapse.indexOf(item.serviceGroupId) === -1 ? ' opened' : '')}
              onClick={() => onCollapse(item.serviceGroupId)}>
            </div>
            <p className="title_block mt-1">{item.name} {item.description.length === 0 ? '' : ('(' + item.description + ')')}</p>
          </div>

          <div className="header-right-container">
            <div
              className="col-sm-5 d-flex justify-content-between align-items-center services_buttons">
              <a className="edit_service"
                onClick={(e) => handleClick(item.serviceGroupId, false, e, this)}/>
              <a className="delete-icon" id="menu-delete4564" onClick={this.openDeleteModal}>
                <img src={`${process.env.CONTEXT}public/img/delete_new.svg`} alt=""/>
              </a>

            </div>
            <a className="new-service" onClick={(e) => newService(null, item, e, this)}>Новая
                            услуга</a>
          </div>
        </div>

        {this.state.isOpenDeleteModal &&
                <ActionModal
                  title= "Удалить группу услуг?"
                  closeHandler={this.closeDeleteModal}
                  buttons={[{
                    handler: _delete,
                    params: item.serviceGroupId,
                    innerText: 'Удалить',
                    className: 'button',
                    additionalHandler: this.closeDeleteModal,
                  },
                  {
                    handler: this.closeDeleteModal,
                    innerText: 'Отмена',
                    className: 'gray-button',
                  }]}
                />
        }

        <DragDrop
          dragDropItems={dragDropServicesItems}
          handleDrogEnd={(result) => handleServicesDrogEnd(result, item.serviceGroupId)}
        />

        {(collapse.indexOf(item.serviceGroupId) === -1 && (!item.services || item.services.length === 0)) &&
                <div className="services_items d-flex justify-content-center w-100">
                  <p className="not-services">Нет услуг</p>
                </div>
        }
      </div>
    );
  }
}


export default ServiceGroupInfo;
