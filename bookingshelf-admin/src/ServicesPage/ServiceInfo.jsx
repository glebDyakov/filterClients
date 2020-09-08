import React, { Component } from 'react';
import moment from 'moment';

import ActionModal from '../_components/modals/ActionModal';

class ServiceInfo extends Component {
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

  getUnit(unit) {
    switch (unit) {
      case "Штука":
        return "шт";

      case "Миллилитр":
        return "мл";

      case "Килограмм":
        return "кг";

      case "Грамм":
        return "гр";

      case "Коробка":
        return "кор";

      default:
        return "";
    }
  }

  render() {
    const { dragHandleProps, keyService, item2, item, newService, deleteService, keyGroup } = this.props;


    return (
      <div {...dragHandleProps} className="services_items" key={keyService}
        id={'collapseService' + keyGroup}>
        <p className="services_items_name">
          <span className="item-name">{item2.name}
            <span className="buttonsCollapse">
              <span className={'item-list-circle ' + item.color.toLowerCase() + 'ButtonEdit'} />
            </span>

            {item2 && item2.serviceProducts &&
            // eslint-disable-next-line max-len
            <span className="item-detail"><br/>Учет материалов: {item2.serviceProducts[0].productName}, {item2.serviceProducts[0].amount} {this.getUnit(item2.serviceProducts[0].unitName)}.</span>
            }
          </span>
          {item2 && item2.details.length > 0 &&
          <span className="item-detail"><br/>Детали: {item2.details.length !== 0 && item2.details}</span>}

          <span className="hide-item">
            <span className="price">
              {item2.priceFrom} {item2.priceFrom !== item2.priceTo && ' - ' + item2.priceTo} {item2.currency}
            </span>
            <span
              className="timing">{moment.duration(parseInt(item2.duration), 'seconds').format('h[ ч] m[ мин]')}</span>
          </span>
        </p>
        <div className="list-inner">
          <span className="services_items_price">
            {item2.priceFrom} {item2.priceFrom !== item2.priceTo && ' - ' + item2.priceTo} {item2.currency}
          </span>
          <span className="services_items_time">
            {moment.duration(parseInt(item2.duration), 'seconds').format('h[ ч] m[ мин]')}
          </span>
          <a className="edit_service" onClick={(e) => newService(item2, item, e, this)}/>
          <a className="delete-icon ml-3" id="menu-delete6633" onClick={this.openDeleteModal}>
            <img src={`${process.env.CONTEXT}public/img/delete_new.svg`} alt=""/>
          </a>
        </div>

        {this.state.isOpenDeleteModal &&
          <ActionModal
            title="Удалить услугу?"
            closeHandler={this.closeDeleteModal}
            buttons={[{
              handler: deleteService,
              params: item.serviceGroupId,
              additionalParam: item2.serviceId,
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
      </div>

    );
  }
}

export default ServiceInfo;
