import React, {PureComponent} from 'react';
import {staffActions} from "../../_actions";
import { connect } from 'react-redux';



class TabCompanySelection extends  PureComponent{
    constructor(props) {
        super(props)
        this.getPlace = this.getPlace.bind(this);
    }
    componentDidMount() {
        let {company} = this.props.match.params

        this.props.dispatch(staffActions.getInfo(company, true));
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
                        this.props.history.push(`/${selectedSubcompany.bookingPage}`)
                        //refreshTimetable();
                    }}>Далее</span>}
                </div>
                <ul className={`staff_popup`}>
                    {subcompanies.sort((a, b) => a.companyId - b.companyId).map((subcompany, i) =>
                        <li style={{ margin: '12px 0' }} className={(staffId && staffId === subcompany.companyId && 'selected') + ' nb active'}
                            onClick={() => {
                                selectSubcompany(subcompany)
                                this.props.history.push(`/${subcompany.bookingPage}`)
                            }}
                            key={i}
                        >
                            {subcompany.city && (
                                <iframe
                                    style={{ padding: '6px 12px 0'}}
                                    id={`google-map-${i}`}
                                    width="100%"
                                    height="250"
                                    frameBorder="0"
                                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAqRjBmS8aGyPsZqxDpZg9KsG9xiqgi95o
                                                    &q=${this.getPlace(subcompany)}&zoom=14`}
                                    allowFullScreen>
                                </iframe>
                            )}
                            <span className="staff_popup_item">

                                <div className="img_container">
                                    <img
                                        src={subcompany.imageBase64 ? "data:image/png;base64," + subcompany.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                        alt=""/>

                                    <div>

                                    <div style={{ fontSize: '18px', fontWeight: 'bold'}} className="staff_popup_name">{subcompany.companyName}</div>
                                        <div style={{ textAlign: 'left' }} className="mobile_block mobile-visible">
                                            <div className="stars" style={{textTransform: 'capitalize'}}>{(info.city ? (info.city + ', ') : '') + subcompany[`companyAddress${subcompany.defaultAddress}`]}</div>
                                        </div>
                                    </div>
                                </div>



                                <div className="mobile_block desktop-visible">
                                    <div className="stars" style={{textTransform: 'capitalize'}}>{(info.city ? (info.city + ', ') : '') + subcompany[`companyAddress${subcompany.defaultAddress}`]}</div>
                                </div>
                                <div style={{position: 'relative', width: '30px', height: '54px'}}>
                                    <span style={{ right: 0 }} className="next_block" />
                                </div>

                            </span>
                        </li>
                    )}
                </ul>
            </div>
        );
    }
}
export default connect()(TabCompanySelection);