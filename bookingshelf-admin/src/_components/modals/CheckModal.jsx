import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { calendarActions } from "../../_actions";
import { withTranslation } from "react-i18next";

class CheckModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { t, closeHandler, submitHandler, showSubmit, title } = this.props;
    return (
      <div className="check-notes-modal">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">{t(title || "Это время занято, вы уверены что хотите создать еще один визит?")}</h4>
              <button type="button" className="close" data-dismiss="modal" onClick={closeHandler}/>
            </div>
            <div className="modal-body">
              <div className="form-group">
                {showSubmit && <button
                  type="button"
                  className="button"
                  onClick={submitHandler}
                  data-dismiss="modal"
                >
                  {t("Подтвердить")}
                </button>}
                <button
                  type="button"
                  className="gray-button"
                  data-dismiss="modal"
                  onClick={closeHandler}
                >
                  {t("Отмена")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CheckModal.defaultProps = {
  showSubmit: true,
};

export default connect()(withTranslation("common")(CheckModal));
