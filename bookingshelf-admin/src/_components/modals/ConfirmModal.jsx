import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { calendarActions } from "../../_actions";
import { withTranslation } from "react-i18next";

const ConfirmModal = ({ t, closeHandler, submitHandler, title, value }) => (
      <div className="check-notes-modal confirm-modal">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">{t(title)}</h4>
              <button type="button" className="close" data-dismiss="modal" onClick={closeHandler}/>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <button
                  type="button"
                  className="button"
                  onClick={() => submitHandler(value)}
                  data-dismiss="modal"
                >
                  {t("Да")}
                </button>
                <button
                  type="button"
                  className="gray-button"
                  data-dismiss="modal"
                  onClick={closeHandler}
                >
                  {t("Нет")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );


export default connect()(withTranslation("common")(ConfirmModal));
