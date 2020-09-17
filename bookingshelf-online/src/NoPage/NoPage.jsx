import React from 'react';
import {withTranslation} from "react-i18next";


class NoPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {t} = this.props;
        return (
            <div className="page404">
                <div className="container">
                    <span className="red_center_text">404</span>
                    <p className="title">{t("Такой страницы не существует")}</p>
                    <a className="button" href="/">{t("перейти на главную")}</a>
                    <div className="clear"></div>
                </div>
            </div>
        );
    }
}

const translatedApp = withTranslation("common")(NoPage);
export {translatedApp as NoPage};

