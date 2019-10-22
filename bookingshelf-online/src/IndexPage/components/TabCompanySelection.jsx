import React, {PureComponent} from 'react';


class TabCompanySelection extends  PureComponent{
    constructor(props) {
        super(props)
        this.getPlace = this.getPlace.bind(this);
    }

    getPlace(subcompany) {
        let country = ''
        switch (subcompany.countryCode) {
            case 'BLR':
                country = 'Belarus'
                break;
            case 'UKR':
                country = 'Ukraine'
                break;
            case 'RUS':
                country = 'Russian'
                break;
            default:
        }
        return `${country}, ${subcompany.city}, ${subcompany[`companyAddress${subcompany.defaultAddress}`]}`;
    }

    render() {

        const { subcompanies, selectedSubcompany, history, selectSubcompany, staffId,staffs, nearestTime, selectStaff, info, setScreen, refreshTimetable, roundDown} = this.props;

        return(
            <div className="service_selection screen1">
                <div className="title_block n">
                    <p className="modal_title">Выберите филиал</p>
                    {staffId &&
                    <span className="next_block" onClick={() => {
                        setScreen(1);
                        //refreshTimetable();
                    }}>Вперед</span>}
                </div>
                <ul className={`staff_popup staff_popup_large`}>
                    {subcompanies.sort((a, b) => a.companyId - b.companyId).map((subcompany, i) =>
                        <li className={(staffId && staffId === subcompany.companyId && 'selected') + ' nb'}
                            onClick={() => {
                                selectSubcompany(subcompany)
                                this.props.history.push(`/${subcompany.bookingPage}`)
                            }}
                            key={i}
                        >
                            <span className="staff_popup_item">
                                <div className="img_container">
                                    {subcompany.city ? (
                                        <iframe
                                            width="100%"
                                            height="300"
                                            frameBorder="0"
                                            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAqRjBmS8aGyPsZqxDpZg9KsG9xiqgi95o
                                                &q=${this.getPlace(subcompany)}`}
                                            allowFullScreen>
                                        </iframe>
                                    ) : (<img
                                            src={subcompany.imageBase64 ? "data:image/png;base64," + subcompany.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                            alt=""/>
                                    )
                                    }
                                    <span className="staff_popup_name">{subcompany.companyName}</span>
                                </div>



                                <div className="mobile_block">
                                    <div className="stars" style={{textTransform: 'capitalize'}}>{(info.city ? (info.city + ', ') : '') + subcompany[`companyAddress${subcompany.defaultAddress}`]}</div>
                                </div>
                            </span>
                        </li>
                    )}
                </ul>
            </div>
        );
    }
}
export default TabCompanySelection;