import React, {Component} from 'react';
import ActionModal from "../_components/modals/ActionModal";
import moment from "moment";

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
        this.setState({isOpenDeleteModal: false});
    }

    openDeleteModal() {
        this.setState({isOpenDeleteModal: true});
    }

    render() {
        const {dragHandleProps, keyService, item2, item, newService, deleteService, keyGroup} = this.props;

        return (
            <div {...dragHandleProps} className="services_items" key={keyService}
                 id={"collapseService" + keyGroup}>
                <p className="services_items_name">
                                    <span className="item-name">{item2.name}
                                        <span className="buttonsCollapse">
                                            <span
                                                className={"item-list-circle " + item.color.toLowerCase() + "ButtonEdit"}></span>
                                        </span>
</span>
                    <span
                        className="item-detail">{item2.details.length !== 0 && "(" + item2.details + ")"}
                                    </span>
                    <span className="hide-item">
                                            <span
                                                className="price">{item2.priceFrom} {item2.priceFrom !== item2.priceTo && " - " + item2.priceTo} {item2.currency}</span>
                                            <span
                                                className="timing">{moment.duration(parseInt(item2.duration), "seconds").format("h[ ч] m[ мин]")}</span>
                                            </span>
                </p>
                <div className="list-inner">
                                    <span
                                        className="services_items_price">{item2.priceFrom} {item2.priceFrom !== item2.priceTo && " - " + item2.priceTo} {item2.currency}</span>
                    <span
                        className="services_items_time">{moment.duration(parseInt(item2.duration), "seconds").format("h[ ч] m[ мин]")}</span>
                    <a className="edit_service" onClick={(e) => newService(item2, item, e, this)}/>
                    <a className="delete-icon ml-2" id="menu-delete6633" onClick={this.openDeleteModal}>
                        <img src={`${process.env.CONTEXT}public/img/delete_new.svg`} alt=""/>
                    </a>
                </div>


                {this.state.isOpenDeleteModal &&
                <ActionModal
                    title= "Удалить услугу?"
                    closeHandler={this.closeDeleteModal}
                    buttons={[{
                        handler: deleteService,
                        params: item.serviceGroupId,
                        additionalParam: item2.serviceId,
                        innerText: 'Удалить',
                        className: 'button',
                        additionalHandler: this.closeDeleteModal
                    },
                        {
                            handler: this.closeDeleteModal,
                            innerText: 'Отмена',
                            className: 'gray-button'
                        }]}
                />
                }
            </div>

        );
    }
}


export default ServiceInfo;
