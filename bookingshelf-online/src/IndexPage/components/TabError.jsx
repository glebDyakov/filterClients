import React, {PureComponent} from 'react';


class TabError extends  PureComponent {

    render() {

        const {setScreen,error} = this.props;


        return (
            <div className="service_selection final-screen">
                <div className="final-book">
                    <p>{error}</p>
                </div>
                <p className="skip_employee"  onClick={() => setScreen(2)}> Создать запись</p>
            </div>
        );
    }
}
export default TabError;