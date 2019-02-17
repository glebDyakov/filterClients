import React from 'react';
import { connect } from 'react-redux';

class EditStaff extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {path}=this.props
        return (
            <div className="modal fade new-staff-modal modal-adit-staff" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="form-group">
                            <div className="modal-header">
                                <h5 className="modal-title">Редактирование сотрудника</h5>
                                <span>Ольга Жилина</span>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <div className="container-fluid">
                                    <div className="retreats">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <p>Имя</p>
                                                <input type="text" placeholder="Например: Олег"/>
                                                <p>Номер телефона</p>
                                                <input type="tel" placeholder="Например: +44-56-77-543-22"/>
                                                <p>Доступ</p>
                                                <select className="custom-select">
                                                    <option selected>Средний</option>
                                                    <option value="Низкий">Низкий</option>
                                                    <option value="Админ">Админ</option>
                                                </select>
                                                <p>Начало работы</p>
                                                <select className="custom-select">
                                                    <option selected>02/12/15</option>
                                                    <option value="03/12/15">03/12/15</option>
                                                    <option value="04/12/15">04/12/15</option>
                                                    <option value="05/12/15">05/12/15</option>
                                                </select>
                                            </div>
                                            <div className="col-md-4">
                                                <p>Фамилия</p>
                                                <input type="text" placeholder="Например: Жилин"/>
                                                <p>Email</p>
                                                <input type="email" placeholder="Например: walkerfrank@gmail.com"/>
                                                <div className="check-box">
                                                    <label>
                                                        <input className="form-check-input" checked type="checkbox"/>
                                                        <span className="check"></span>
                                                        Включить онлайн запись
                                                    </label>
                                                </div>
                                                <p>Конец работы</p>
                                                <select className="custom-select">
                                                    <option selected>12/06/18</option>
                                                    <option value="13/06/18">13/16/18</option>
                                                    <option value="14/06/18">14/06/18</option>
                                                    <option value="15/06/18">15/06/18</option>
                                                </select>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="upload_container">
                                                    <div className="setting image_picker">
                                                        <div className="settings_wrap">
                                                            <label className="drop_target">
                                                                <span className="rounded-circle image_preview"></span>
                                                                <input className="inputFile" type="file"/>
                                                                <a className="upload">Загрузить фото</a>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-center">Дата создания: 09/04/18</p>
                                                <div className="buttons">
                                                    <button className="small-button gray-button"
                                                            type="button">Отменить
                                                    </button>
                                                    <button className="small-button" type="button">Сохранить</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert
    };
}

const connectedApp = connect(mapStateToProps)(EditStaff);
export { connectedApp as EditStaff };