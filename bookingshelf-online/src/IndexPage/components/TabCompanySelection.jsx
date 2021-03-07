import React, { PureComponent } from 'react';
import { staffActions } from "../../_actions";
import { connect } from 'react-redux';
import { getFirstScreen } from "../../_helpers/common";
import { withTranslation } from "react-i18next";
import skip_arrow from "../../../public/img/icons/skip-arrow-white.svg"
import { BUTTON_COLORS_BY_NUMBER } from '../../_constants/styles.constants';


class TabCompanySelection extends PureComponent {
    constructor(props) {
        super(props)
        this.getPlace = this.getPlace.bind(this);
    }
    componentDidMount() {
        const { company } = this.props.match.params

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

        const { subcompanies, selectedSubcompany, history, selectSubcompany, staffId, staffs, nearestTime, selectStaff, info, setScreen, refreshTimetable, roundDown, t } = this.props;
        return (
            <div className="service_selection screen1">
                <div className="title_block n affiliate_title" >
                    <p className="modal_title" >{t("Выберите филиал")}</p>
                </div>
                <ul className={`affiliate`}>
                    {subcompanies.sort((a, b) => a.companyId - b.companyId).map((subcompany, i) =>
                        <li className={(staffId && staffId === subcompany.companyId && 'selected') + ' nb active'}
                            onClick={() => {
                                selectSubcompany(subcompany)
                                this.props.history.push(`/${subcompany.bookingPage}`)
                            }}
                            key={i}
                        >
                            <span className="affiliate_item">

                                <div className="img_container">
                                    <img
                                        src={subcompany.imageBase64 ? "data:image/png;base64," + subcompany.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                        alt="" />

                                    <div>
                                        <div className="affiliate_name">{subcompany.companyName}</div>
                                        <div className="stars desktop_visible" >{(info.city ? (info.city + ', ') : '') + subcompany[`companyAddress${subcompany.defaultAddress}`]}</div>
                                    </div>
                                </div>

                                <button className="desktop_visible next_block-btn_arrow" style={{ backgroundColor: BUTTON_COLORS_BY_NUMBER[info.buttonColor] || undefined, }}> 
                                    {t("Выбрать")}<img src={skip_arrow} alt="skip_arrow"/>
                                </button>

                            </span>
                            <div className="stars desktop_invisible" >{(info.city ? (info.city + ', ') : '') + subcompany[`companyAddress${subcompany.defaultAddress}`]}</div>
                            {subcompany.city && (
                                <iframe
                                    style={{
                                        padding: "0px 0px 10px 0px",
                                        borderRadius: "5px"
                                    }}
                                    id={`google-map-${i}`}
                                    width="100%"
                                    height="250"
                                    frameBorder="0"
                                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAqRjBmS8aGyPsZqxDpZg9KsG9xiqgi95o
                                                    &q=${this.getPlace(subcompany)}&zoom=14`}
                                    allowFullScreen>
                                </iframe>
                            )}
                            <button className="desktop_invisible next_block-btn_arrow" style={{ backgroundColor: BUTTON_COLORS_BY_NUMBER[info.buttonColor] || undefined, }}> {t("Выбрать")} <img src={skip_arrow} alt="skip_arrow"/> </button>
                        </li>
                    )}
                </ul>
            </div>
        );
    }
}
export default connect()(withTranslation("common")(TabCompanySelection));