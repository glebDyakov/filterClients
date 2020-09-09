import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { calendarActions } from '../../_actions';
import {withTranslation} from "react-i18next";

class DeleteAppointment extends React.Component {
  constructor(props) {
    super(props);

    this.cancel = this.cancel.bind(this);
  }

  render() {
    const { t } = this.props;
    return (
      <div className="modal fade delete-notes-modal">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">{t("Удалить запись?")}</h4>
              <button type="button" className="close" data-dismiss="modal" />
              {/* <img src={`${process.env.CONTEXT}public/img/icons/cancel.svg`} alt="" className="close" data-dismiss="modal"/>*/}
            </div>
            <div className="modal-body">
              <div className="form-group">
                <button type="button" className="button" onClick={this.cancel} data-dismiss="modal">{t("Удалить")}</button>
                <button type="button" className="gray-button" data-dismiss="modal">{t("Отмена")}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  cancel() {
    const { appointmentForDeleting, dispatch } = this.props;
    dispatch(calendarActions.deleteAppointment(appointmentForDeleting));
  }
}


DeleteAppointment.propTypes ={
  appointmentForDeleting: PropTypes.object,
};

export default connect()(withTranslation("common")(DeleteAppointment));
