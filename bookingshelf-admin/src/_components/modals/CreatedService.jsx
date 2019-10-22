import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from "@trendmicro/react-modal";

class CreatedService extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            service: null,
            services: props.services && props.services,
            serviceCurrent: props.serviceCurrent && props.serviceCurrent
        }

        this.newService=this.newService.bind(this)
        this.setService=this.setService.bind(this)
        this.newGroup=this.newGroup.bind(this)
        this.closeModal = this.closeModal.bind(this);

    }

    componentWillReceiveProps(newProps) {
        if ( JSON.stringify(this.props) !==  JSON.stringify(newProps)) {
            this.setState({...this.state, services: newProps.services })
        }
    }

    render() {
        const {services, serviceCurrent, service}=this.state;

        let serviceSet=service || serviceCurrent

        return (
            <Modal size="lg"  style={{maxWidth: '50%'}} onClose={this.closeModal} showCloseButton={false} className="mod">

                <div className="modal_add_service_by_list_group" tabIndex="-1" role="dialog" aria-hidden="true">
                    <div className="" role="document">
                        <div className="modal-content visibleDropdown">
                            <div className="modal-header">
                                <h4 className="modal-title">Выберите группу услуг</h4>
                                <button type="button" className="close" onClick={this.closeModal} />
                            </div>
                            <div className="modal-inner pl-4 pr-4 pb-4">
                                <div className="select-color dropdown mb-3 border-color">
                                    {
                                        serviceCurrent || service ?
                                            <a className={serviceSet.color.toLowerCase() + " "+'select-button dropdown-toggle'}
                                               data-toggle="dropdown" href="#" ><span
                                                className={serviceSet.color.toLowerCase() + " "+'color-circle'}/><span
                                                className="yellow"><span className="items-color"><span>{serviceSet.name}</span></span></span>
                                            </a>

                                            : <a className="select-button dropdown-toggle yellow"
                                                 data-toggle="dropdown" href="#"><span
                                                className="color-circle yellow"/><span
                                                className="yellow"><span className="items-color"><span>Выберите группу услуг</span> </span></span>
                                            </a>
                                    }
                                    <ul className="dropdown-menu">
                                        {
                                            services.services && services.services.map((service)=>
                                                <li className="dropdown-item"><a onClick={()=>this.setService(service)}><span
                                                    className={service.color.toLowerCase() + " "+'color-circle'}/><span className={service.color.toLowerCase()}>{service.name}</span></a>
                                                </li>
                                            )
                                        }
                                    </ul>
                                </div>

                                <div>
                                    <button type="button" className="button" onClick={(e)=>this.newGroup()}>Новая группа услуг
                                    </button>
                                    <button type="button" className="button float-right" onClick={(e)=>this.newService(e)}>Далее
                                    </button>
                                    {/*<span className="ellipsis">*/}
                                    {/*<img src={`${process.env.CONTEXT}public/img/ellipsis.png`} alt=""/>*/}
                                    {/*</span>*/}

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

        )
    }
    newGroup (e){
        this.setState({...this.state, service: null})

        this.props.newServiceGroup(null, true, e)
    }

    newService (e){
        const {services, serviceCurrent, service}=this.state;

        let cons=serviceCurrent&&services.services[services.services.length-1]

        if(service!=null || cons!=null)
        {
            return this.props.newServiceFromGroup(null, serviceCurrent?cons:service, e, this)
        }
    }

    setService (service) {
        this.setState({...this.state, service: service, serviceCurrent: null})
    }

    closeModal () {
        const {onClose} = this.props;

        return onClose()
    }

}



function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert
    };
}

CreatedService.propTypes ={
    services: PropTypes.object,
    newServiceGroup: PropTypes.func,
    newServiceFromGroup: PropTypes.func,
    serviceCurrent: PropTypes.object,
    onClose: PropTypes.func

};

const connectedApp = connect(mapStateToProps)(CreatedService);
export { connectedApp as CreatedService };