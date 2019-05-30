import React, {PureComponent} from 'react';


class TabCanceled extends  PureComponent {

    render() {

        const {setScreen} = this.props;

        return (
            <div className="service_selection final-screen">

                <div className="final-book">
                    <p>Запись успешно отменена</p>
                </div>

                <p className="skip_employee"  onClick={() => setScreen(2)}> Создать запись</p>

            </div>
        );
    }
}
export default TabCanceled;