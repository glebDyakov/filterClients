import React, { PureComponent } from 'react';
import { withTranslation } from "react-i18next";
import "./Footer.scss";

class Footer extends PureComponent {
    constructor(props) {
        super(props);

        this.changeLang = this.changeLang.bind(this);
    }

    changeLang(lang) {
        const { i18n } = this.props;

        i18n.changeLanguage(lang);
    }

    render() {
        const { t } = this.props;
        return (
            <div className="footer_modal d-flex justify-content-between align-items-center px-2">
                <p>{t("Программа онлайн записи")} <a rel="nofollow" href="https://online-zapis.com"
                    target="_blank">Online-zapis.com</a></p>
            </div>
        );
    }
}

export default withTranslation("common")(Footer);