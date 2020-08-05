import React from 'react';
import {connect} from 'react-redux';
import {managersService} from '../../_services/index';
class settingsSidebar extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        managersService.getAllManagers().then(value => value.json())
            .then(json => console.log(json));
    }

    render() {
        return (
            <div className="modal fade settingsSidebar-modal" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title">Настройки</h2>
                            <button type="button" className="close" data-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <h4 className="choise-theme-title">Выберите тему:</h4>
                            <div className="theme-container">
                                <p className="theme-name">Белая</p>
                                <span className="image-white-theme"></span>
                            </div>
                            <div className="theme-container">
                                <p className="theme-name">Темная</p>
                                <span className="image-dark-theme"></span>
                            </div>

                            <hr/>

                            <h4 className="manager-title">Ваш менеджер</h4>

                            <div className="manager-container">

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
}

const connectedApp = connect(mapStateToProps)(settingsSidebar);
export {connectedApp as settingsSidebar};