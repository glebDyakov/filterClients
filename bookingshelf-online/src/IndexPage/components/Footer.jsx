import React, {PureComponent} from 'react';
import {withTranslation} from "react-i18next";


class Footer extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const {t} = this.props;
        return (
            <div className="footer_modal">
                <p>{t("Работает на")} <a href="https://online-zapis.com"
                                         target="_blank"><strong>Online-zapis.com</strong></a></p>
            </div>
        );
    }
}

export default withTranslation("common")(Footer);