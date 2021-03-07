import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from "react-i18next";


class TabCanceled extends PureComponent {

    render() {

        const { selectedSubcompany, t } = this.props;
        return (
            <div className="service_selection submit_screen">

                <div className="final-book submit_screen_text" >
                    <p>{t("Запись успешно отменена")}</p>
                </div>

                {/*{isVisitPage ? <a href={`/online/${companyId}`} className="skip_employee" >Создать запись</a> : <p className="skip_employee"  onClick={() => setScreen(2)}> Создать запись</p>}*/}
                {/* надо будет поменять ссылку на эту */}  {/* <a href={`/online/${companyId}`} className="skip_employee" >{t("Создать запись")}</a> */}
                <a href={`/online/${selectedSubcompany.bookingPage}`} className="skip_employee" >{t("Создать запись")}</a>


            </div>
        );
    }
}
export default withTranslation("common")(TabCanceled);
