import React, {Component} from 'react';
import moment from "moment";
import ActionModal from "../_components/modals/ActionModal";
import {clientActions} from "../_actions";
import {connect} from "react-redux";
import {withRouter} from "react-router";

class StaffInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpenDeleteStaffModal: false,

        };

        this.closeDeleteStaffModal = this.closeDeleteStaffModal.bind(this);
        this.openDeleteStaffModal = this.openDeleteStaffModal.bind(this);

    }

    closeDeleteStaffModal() {
        this.setState({isOpenDeleteStaffModal: false});
    }

    openDeleteStaffModal() {
        this.setState({isOpenDeleteStaffModal: true});
    }

    render() {
        const {dragHandleProps, i, isGroup, staff_user, groupIndex, handleClick, deleteStaff, renderSwitch} = this.props;
        console.log(this.state)

        return (
            <div {...dragHandleProps} className="tab-content-list" key={i}>
                {/*{staffGroup.length > i + 1 && <span className="line_connect"/>}*/}
                <div className="client-name">
                    <a style={{paddingBottom: isGroup ? '4px' : '10px', cursor: 'grab'}} key={i}>
                                                <span className="img-container">
                                                    <img className="rounded-circle"
                                                         src={staff_user.imageBase64 ? "data:image/png;base64," + staff_user.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                                         alt=""/>
                                                </span>
                        <p>{`${staff_user.firstName} ${staff_user.lastName ? staff_user.lastName : ''}`}</p>
                    </a>
                    {isGroup && <p className="staff-group">Группа напарников {groupIndex + 1}</p>}
                </div>
                <div>
                    {staff_user.phone}
                </div>
                <div>
                    {staff_user.email}
                </div>
                <div>
                            <span>
                                {renderSwitch(staff_user.roleId)}
                            </span>
                </div>
                <div className="delete dropdown">
                    <a className="clientEdit" onClick={() => handleClick(staff_user.staffId, false)}/>
                    {staff_user.roleId !== 4 &&

                    <a className="delete-icon menu-delete-icon" onClick={this.openDeleteStaffModal}>
                        <img
                            src={`${process.env.CONTEXT}public/img/delete_new.svg`}
                            alt=""/>
                    </a>
                    }

                </div>

                {this.state.isOpenDeleteStaffModal && staff_user.roleId !== 4 &&
                <ActionModal
                    title="Удалить сотрудника?"
                    closeHandler={this.closeDeleteStaffModal}
                    buttons={[{
                        handler: deleteStaff,
                        params: staff_user.staffId,
                        innerText: 'Удалить',
                        className: 'button',
                        additionalHandler: this.closeDeleteStaffModal
                    },
                        {
                            handler: this.closeDeleteStaffModal,
                            innerText: 'Отмена',
                            className: 'gray-button'
                        }]}
                />
                }
            </div>

        );
    }
}

function mapStateToProps(state) {
    const {staff} = state;

    return {
        staff
    }
}


export default connect(mapStateToProps)(withRouter(StaffInfo));
