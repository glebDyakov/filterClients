import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class CreatedService extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            service: null,
            services: props.services,
            serviceCurrent: props.serviceCurrent
        }

        this.newService=this.newService.bind(this)
        this.setService=this.setService.bind(this)
        this.newGroup=this.newGroup.bind(this)
    }

    componentWillReceiveProps(newProps) {
        if ( JSON.stringify(this.props) !==  JSON.stringify(newProps)) {
            this.setState({...this.state, services: newProps.services, serviceCurrent: newProps.serviceCurrent })
        }
    }

    render() {
        const {services, serviceCurrent, service}=this.state;

        let serviceSet=service || serviceCurrent

        return (
            
            <div className="modal fade modal_add_service_by_list_group" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <div className="modal-content visibleDropdown">
                        <div className="modal-header">
                            <h4 className="modal-title">Выберите группу услуг</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
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
                                <button type="button" data-toggle="modal" data-target=".modal_add_group"  data-dismiss="modal"
                                        className="button" onClick={(e)=>this.newGroup()}>Новая группа услуг
                                </button>
                                <button type="button" data-toggle="modal"
                                        data-target=".new-service-modal"  data-dismiss="modal"
                                        className="button float-right" onClick={(e)=>this.newService(e)}>Далее
                                </button>
                                {/*<span className="ellipsis">*/}
                                {/*<img src={`${process.env.CONTEXT}public/img/ellipsis.png`} alt=""/>*/}
                                {/*</span>*/}

                            </div>

                        </div>
                    </div>
                </div>
            </div>

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
    serviceCurrent: PropTypes.object

};

const connectedApp = connect(mapStateToProps)(CreatedService);
export { connectedApp as CreatedService };