import React, {PureComponent} from 'react';


class TabError extends  PureComponent {

    render() {

        const {setScreen,error,isVisitPage, companyId} = this.props;


        return (
            <div className="service_selection final-screen">
                <div className="final-book">
                    <p>{error}</p>
                </div>
                {isVisitPage ? <a href={`/online/${companyId}`} className="skip_employee" >Создать запись</a> : <p className="skip_employee"  onClick={() => setScreen(2)}> Создать запись</p>}
            </div>
        );
    }
}
export default TabError;
