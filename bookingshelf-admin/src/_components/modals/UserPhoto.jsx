import React from 'react';
import {connect} from 'react-redux';
import {userActions} from "../../_actions";
import Avatar from "react-avatar-edit";

class UserPhoto extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            authentication: props.authentication
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.onCrop = this.onCrop.bind(this)
        this.onClose = this.onClose.bind(this)
    }

    componentWillReceiveProps(newProps) {
        if (JSON.stringify(this.props.authentication) !== JSON.stringify(newProps.authentication)) {
            this.setState({...this.state, authentication: newProps.authentication})
        }
    }

    onClose() {
        this.setState({preview: null})
    }

    onCrop(preview) {
        const {authentication} = this.state;

        this.setState({
            ...this.state,
            authentication: {
                ...authentication,
                user: {
                    ...authentication.user,
                    profile: {...authentication.user.profile, imageBase64: preview.split(',')[1]}
                }
            }
        });
    }

    handleSubmit(e) {
        const {alert} = this.props;
        const {authentication} = this.state;

        const {dispatch} = this.props;

        e.preventDefault();

        dispatch(
            userActions.updateProfile(authentication.user.profile)
        );
    }

    render() {
        const {staff} = this.props
        const {authentication} = this.state;

        const activeStaff = staff && staff.find(item =>
            ((item.staffId) === (authentication.user && authentication.user.profile && authentication.user.profile.staffId)));

        return (

            <div className="modal fade modal_photo">
                <div className="modal-dialog modal-dialog-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title">Фото профиля</h2>
                            <button type="button" className="close" data-dismiss="modal"></button>
                        </div>
                            <div className="modal-body">
                                <div className="upload_container">
                                    <div className="setting image_picker">
                                        <div className="settings_wrap">
                                            <label className="drop_target">
                                                <div className="image_preview">
                                                    <div className="existed-image">
                                                        <img
                                                            src={activeStaff && activeStaff.imageBase64 && activeStaff.imageBase64 !== '' ? ("data:image/png;base64," + activeStaff.imageBase64) : `${process.env.CONTEXT}public/img/image.png`}/>

                                                    </div>
                                                    <Avatar
                                                        height={180}
                                                        cropRadius="100%"
                                                        label=""
                                                        onCrop={this.onCrop}
                                                        onClose={this.onClose}
                                                    />
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="buttons-container-setting">
                                    <button type="button" className="small-button" onClick={this.handleSubmit}
                                            data-dismiss="modal">Сохранить
                                    </button>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const {alert, authentication, staff} = state;
    return {
        alert, authentication, staff: staff.staff
    };
}

const connectedApp = connect(mapStateToProps)(UserPhoto);
export {connectedApp as UserPhoto};
