import React, {PureComponent} from 'react';
import {withTranslation} from "react-i18next";


class Footer extends PureComponent {
    constructor(props) {
        super(props);

        this.changeLang = this.changeLang.bind(this);
    }

    changeLang(lang){
        const {i18n} = this.props;

        i18n.changeLanguage(lang);
        localStorage.setItem("lang", lang);

    }

    render() {
        const {t} = this.props;
        return (
            <div className="footer_modal d-flex justify-content-between align-items-center px-5">
                <p>{t("Работает на")} <a href="https://online-zapis.com"
                                         target="_blank"><strong>Online-zapis.com</strong></a></p>

                <select onChange={(e) => {
                    this.changeLang(e.target.value)
                }} value={localStorage.getItem("lang") && localStorage.getItem("lang")} className="w-25 custom-select">
                    <option value="ru">Русский</option>
                    <option value="en">Английский</option>
                    <option value="ua">Украинский</option>
                    <option value="pl">Польский</option>
                </select>
            </div>
        );
    }
}

export default withTranslation("common")(Footer);