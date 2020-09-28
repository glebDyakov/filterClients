import React, {PureComponent} from 'react';
import { withRouter } from 'react-router-dom';


class TabCanceled extends  PureComponent {

    render() {

        const {setScreen, isVisitPage, companyId, t} = this.props;

        return (
            <div className="service_selection final-screen">

                <div className="final-book">
                    <p>{t("Запись успешно отменена")}</p>
                </div>

                {/*{isVisitPage ? <a href={`/online/${companyId}`} className="skip_employee" >Создать запись</a> : <p className="skip_employee"  onClick={() => setScreen(2)}> Создать запись</p>}*/}
                <a href={`/online/${this.props.match.params.company}`} className="skip_employee" >{t("Создать запись")}</a>
            </div>
        );
    }
}
export default withRouter(TabCanceled);
