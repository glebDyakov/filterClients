import React, { PureComponent } from 'react';
import facebook from "../../../public/img/icons/header-facebook.svg";
import tiktok from "../../../public/img/icons/header-tiktok.svg";
import instagram from "../../../public/img/icons/header-instagram.svg";
import telephone from "../../../public/img/icons/header-telephone.svg";
import tiktok_white from "../../../public/img/icons/header-tiktok-white.svg";
import instagram_white from "../../../public/img/icons/header-instagram-white.svg";
import facebook_white from "../../../public/img/icons/header-facebook-white.svg";
import arrow_down from "../../../public/img/arrow_down.png";
import arrow_down_white from "../../../public/img/icons/arrow_down_white.svg";
import burger_close from "../../../public/img/icons/burger-close.svg";
import burger_open from "../../../public/img/icons/burger-open.svg";
import rus_img from "../../../public/img/icons/rus.jpg";
import eng_img from "../../../public/img/icons/eng.jpg";
import telephone_btn from "../../../public/img/icons/telephone_btn.svg";
import MediaQuery from 'react-responsive'
import { withTranslation } from "react-i18next";
// import { findSourceMap } from 'module';

class Header extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            burger: true,
            mobile: false,
            currentLang: this.props.i18n.language,
        };
        this.changeBurger = this.changeBurger.bind(this);
        this.changeLang = this.changeLang.bind(this);
    }
    changeLang(lang) {
        const { i18n } = this.props;

        i18n.changeLanguage(lang);
        this.setState({
            currentLang: lang,
        })
    }
    changeBurger() {
        this.setState({
            burger: !this.state.burger,
        })
    }
    render() {

        const { info, screen, selectedSubcompany } = this.props;
        const { burger, mobile, currentLang } = this.state
        const currentTextLeng = this.props.i18n.language.toUpperCase();
        const desctop = 710;
        const mob = 709;
        let hiddenMenu;

        mobile ? hiddenMenu = "hidden" : hiddenMenu = "visible";
        return (
            <div className="modal_menu"
                style={{
                    overflow: `${hiddenMenu}`,
                }}>
                <React.Fragment>

                    <MediaQuery maxWidth={mob}>
                        <div className="firm-title">
                            <img className="logo" src={info.imageBase64
                                ? "data:image/png;base64," + info.imageBase64
                                : `${process.env.CONTEXT}public/img/image.png`}
                            />
                            <div className="firm-text">
                                <p className={"firm_name" + ((screen === 0) ? ' not-selected' : '')}>{info && ((screen === 0 && info.onlineCompanyHeader) ? info.onlineCompanyHeader : info.companyName)}</p>
                            </div>
                        </div>
                        <div className="header-lang" >
                            <p>{currentTextLeng}</p>
                            <img src={arrow_down} alt="arrou"></img>
                        </div>
                        <div className="burger_menu_btn_off">
                            <img onClick={(event) => this.changeBurger()} src={burger_close} alt="telephone" />
                        </div>

                        <div className={burger ? "burger_menu" : "burger_menu active"}>
                            <div className="burger-title">
                                <img className="logo" src={info.imageBase64
                                    ? "data:image/png;base64," + info.imageBase64
                                    : `${process.env.CONTEXT}public/img/image.png`}
                                />
                                <div className="firm-text">
                                    <p className={"firm_name" + ((screen === 0) ? ' not-selected' : '')}>{info && ((screen === 0 && info.onlineCompanyHeader) ? info.onlineCompanyHeader : info.companyName)}</p>
                                </div>
                                <div className="header-lang">
                                    <p>{currentTextLeng}</p>
                                    <img src={arrow_down_white} alt="arrou"></img>
                                    <div className="leng_list">
                                        <div className="leng_list_item" onClick={(e) => changeLang("ru")}>
                                            <img src={rus_img} alt="" />
                                            <p>Русский</p>
                                            <div className={currentLang === "ru" ? "leng_btn" : "leng_btn langNotActive"}
                                            ></div>
                                        </div>
                                        <div className="leng_list_item" onClick={(e) => changeLang("en")}>
                                            <img src={eng_img} alt="" />
                                            <p>English</p>
                                            <div></div>
                                            <div className={currentLang === "en" ? "leng_btn" : " leng_btn langNotActive"}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="burger_menu_btn_on">
                                    <img onClick={(event) => this.changeBurger()} src={burger_open} alt="telephone" />
                                </div>
                            </div>
                            <p className="adress-text"> {info && `${info.city ? (info.city + ', ') : ''}${info["companyAddress" + info.defaultAddress]}`}</p>
                            <div className="firm-icons">
                                {selectedSubcompany.companyPhone1 && (
                                    <div className="text-phones">
                                        <p>{selectedSubcompany.companyPhone1}</p>
                                        <p>{selectedSubcompany.companyPhone2}</p>
                                        <p>{selectedSubcompany.companyPhone3}</p>
                                    </div>
                                )}

                                <div className="adress-phones">
                                    <div className="adress-text-wrapper">
                                        <img src={tiktok_white} alt='tiktok' />
                                        <img src={facebook_white} alt='facebook' />
                                        <img src={instagram_white} alt='instagram' />
                                    </div>
                                </div>


                            </div>
                        </div>
                    </MediaQuery>
                    <MediaQuery minWidth={desctop}>
                        <div className="firm-title">
                            <img className="logo" src={info.imageBase64
                                ? "data:image/png;base64," + info.imageBase64
                                : `${process.env.CONTEXT}public/img/image.png`}
                            />
                            <div className="firm-text">
                                <p className={"firm_name" + ((screen === 0) ? ' not-selected' : '')}>{info && ((screen === 0 && info.onlineCompanyHeader) ? info.onlineCompanyHeader : info.companyName)}</p>
                                <p className="adress-text"> {info && `${info.city ? (info.city + ', ') : ''}${info["companyAddress" + info.defaultAddress]}`}</p>
                            </div>
                        </div>
                        <div className="firm-icons">
                            <div className="adress-phones">
                                <span className="adress-icon" />
                                <div className="adress-text-wrapper">
                                    <img src={tiktok} alt='tiktok' />
                                    <img src={facebook} alt='facebook' />
                                    <img src={instagram} alt='instagram' />
                                </div>
                            </div>
                            <div className="header-lang">
                                <p>{currentTextLeng}</p>
                                <img src={arrow_down} alt="arrou"></img>
                                <div className="leng_list">
                                    <div className="leng_list_item" onClick={(e) => this.changeLang("ru")}>
                                        <img src={rus_img} alt="" />
                                        <p>Русский</p>
                                        <div className={currentLang === "ru" ? "leng_btn" : "leng_btn langNotActive"}></div>
                                    </div>
                                    <div className="leng_list_item" onClick={(e) => this.changeLang("en")}>
                                        <img src={eng_img} alt="" />
                                        <p>English</p>
                                        <div></div>
                                        <div className={currentLang === "en" ? "leng_btn" : "leng_btn langNotActive"}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="separation"></div>
                            <div className="mobile-icon-block">
                                <div className={mobile ? "mobile-icon-wrapper mobile_active" : "mobile-icon-wrapper"}>
                                    <div>
                                        <p>{selectedSubcompany.companyPhone1}</p>
                                        <p>{selectedSubcompany.companyPhone2}</p>
                                        <p>{selectedSubcompany.companyPhone3}</p>
                                    </div>

                                    <img src={telephone_btn} onClick={e => this.setState({
                                        mobile: !mobile
                                    })} alt="close" />
                                </div>
                                <img src={telephone} onClick={e => this.setState({
                                    mobile: !mobile
                                })} alt="telephone" />
                            </div>
                        </div>
                    </MediaQuery>

                </React.Fragment>
            </div>
        );
    }
}
export default withTranslation("common")(Header);