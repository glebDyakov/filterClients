import React, {PureComponent} from 'react';
import {withTranslation} from "react-i18next";
import "./Footer.scss";

class Footer extends PureComponent {
    constructor(props) {
        super(props);

        this.changeLang = this.changeLang.bind(this);
    }

    changeLang(lang){
        const {i18n} = this.props;

        i18n.changeLanguage(lang);
    }

    render() {
        const {t} = this.props;
        return (
            <div className="footer_modal d-flex justify-content-between align-items-center px-2">
                <p>{t("Работает на")} <a href="https://online-zapis.com"
                                         target="_blank"><strong>Online-zapis.com</strong></a></p>

                <select onChange={(e) => {
                    this.changeLang(e.target.value)
                }} value={this.props.i18n.language.toLowerCase() } className="custom-select">
                    <option value="ru">RU</option>
                    <option value="en">EN</option>
                    <option value="uk">UA</option>
                    <option value="pl">PL</option>
                </select>
            </div>
        );
    }
}

export default withTranslation("common")(Footer);