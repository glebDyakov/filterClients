import React, { PureComponent } from 'react';
import facebook from "../../../public/img/icons/header-facebook.svg";
import tiktok from "../../../public/img/icons/header-tiktok.svg";
import instagram from "../../../public/img/icons/header-instagram.svg";
import telephone from "../../../public/img/icons/header-telephone.svg";
import tiktok_white from "../../../public/img/icons/header-tiktok-white.svg";
import instagram_white from "../../../public/img/icons/header-instagram-white.svg";
import facebook_white from "../../../public/img/icons/header-facebook-white.svg";
import arrow_down from "../../../public/img/arrow_down.png";
import burger_close from "../../../public/img/icons/burger-close.svg";
import burger_open from "../../../public/img/icons/burger-open.svg";
import telephone_btn from "../../../public/img/icons/telephone_btn.svg";
import MediaQuery from 'react-responsive'
import { withTranslation } from "react-i18next";
import { BUTTON_COLORS_BY_NUMBER, DEFAULT_BUTTON_COLOR } from '../../_constants/styles.constants';
import {TABLET_WIDTH} from '../../_constants/global.constants'

class Header extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            burger: false,
            mobile: false,
            currentLang: this.props.i18n.language,
            langList: false,
            curentColor: "3752783"
        };
        this.changeBurger = this.changeBurger.bind(this);
        this.openLangList = this.openLangList.bind(this);
        this.changeLang = this.changeLang.bind(this);
        this.outsideClickListener = this.outsideClickListener.bind(this);
        this.changeColor = this.changeColor.bind(this);
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
    openLangList() {
        this.setState({
            langList: !this.state.langList,
        })
    }
    changeColor() {
        const newStyles = document.createElement('style')
        const newColor = this.props.selectedSubcompany && this.props.selectedSubcompany.bookingPage ? this.props.selectedSubcompany.buttonColor : this.props.info.buttonColor;
        const buttonColor = BUTTON_COLORS_BY_NUMBER[newColor] || DEFAULT_BUTTON_COLOR;

        document.head.append(newStyles)
        newStyles.innerHTML = ":root {" +
            "--color_button: #" + buttonColor  + ";" +
            " --color_text: #09093A;" +
            "}"
        this.setState({
            curentColor: newColor,
        })
    }
    outsideClickListener(event) {
        let flagLang = false;
        let flagBurger = false;
        let burgerBtn = false;

        if (this.state.langList) {
            event.path.forEach(element => {
                if (element.className === "header-lang") { flagLang = true }
            });
            if (!flagLang) {
                this.setState({
                    langList: false,
                })
            }
        }
        if (this.state.burger) {
            event.path.forEach(element => {
                if (element.className === "burger_menu active") { flagBurger = true }
                if (element.className === "burger_menu_btn_off") { burgerBtn = true }
            });

            if (!flagBurger && !burgerBtn) {
                this.setState({
                    burger: false,
                })
            }
        }

    }
    componentDidMount() {
        this.changeColor();
        document.addEventListener('click', this.outsideClickListener);
    }
    componentDidUpdate() {
        if (this.props.selectedSubcompany && this.state.curentColor !== this.props.selectedSubcompany.buttonColor) {
            this.changeColor();
        }

    }
    componentWillUnmount() {
        document.removeEventListener('click', this.outsideClickListener);
    }

    getSocialLink = (social) => {
        if (this.props.selectedSubcompany) {
            const link = this.props.selectedSubcompany.companySocialNetworks?.find(({ socialNetwork }) => socialNetwork.toLowerCase() === social)?.companyUrl || '';
            return link ? `https://${link}` : null;
        }

    }

    render() {
        const { info, screen, selectedSubcompany } = this.props;
        const { burger, mobile, currentLang, langList, curentColor } = this.state
        const currentTextLeng = this.props.i18n.language.toUpperCase();
        const hiddenMenu = mobile ? "hidden" : "visible";
        const currentSelectedSubcompany = selectedSubcompany && selectedSubcompany.bookingPage ? selectedSubcompany : info;
        return (
            <div className="modal_menu"
                style={{
                    overflow: `${hiddenMenu}`,
                }}>
                <React.Fragment>

                    <MediaQuery maxWidth={TABLET_WIDTH-1}>
                        <div className="firm-title">
                            <img className="logo" src={currentSelectedSubcompany.imageBase64
                                ? "data:image/png;base64," + currentSelectedSubcompany.imageBase64
                                : `${process.env.CONTEXT}public/img/image.png`}
                            />
                            <div className="firm-text">
                                <p className={"firm_name" + ((screen === 0) ? ' not-selected' : '')}>{currentSelectedSubcompany && ((screen === 0 && currentSelectedSubcompany.onlineCompanyHeader) ? currentSelectedSubcompany.onlineCompanyHeader : currentSelectedSubcompany.companyName)}</p>
                            </div>
                        </div>
                        <div className="header-lang" onClick={e => this.openLangList()}>
                            <p>{currentTextLeng}</p>
                            <img src={arrow_down} alt="arrou"></img>
                            <div className={langList ? "leng_list leng_list_active" : "leng_list"}>
                                <div className="leng_list_item" onClick={(e) => this.changeLang("ru")}>
                                    <p>Русский</p>
                                    <div className={currentLang === "ru" ? "leng_btn" : "leng_btn langNotActive"}
                                    ></div>
                                </div>
                                <div className="leng_list_item" onClick={(e) => this.changeLang("en")}>
                                    <p>English</p>
                                    <div></div>
                                    <div className={currentLang === "en" ? "leng_btn" : " leng_btn langNotActive"}></div>
                                </div>
                                <div className="leng_list_item" onClick={(e) => this.changeLang("uk")}>
                                    <p>Український</p>
                                    <div></div>
                                    <div className={currentLang === "uk" ? "leng_btn" : " leng_btn langNotActive"}></div>
                                </div>
                                <div className="leng_list_item" onClick={(e) => this.changeLang("pl")}>
                                    <p>Polski</p>
                                    <div></div>
                                    <div className={currentLang === "pl" ? "leng_btn" : " leng_btn langNotActive"}></div>
                                </div>
                            </div>
                        </div>
                        {!!screen &&
                            <div className="burger_menu_btn_off" onClick={(event) => this.changeBurger()}>
                                <img src={burger_close} alt="telephone" />
                            </div>}

                        <div className={!burger ? "burger_menu" : "burger_menu active"}>
                            <div className="burger-title">
                                <img className="logo" src={currentSelectedSubcompany.imageBase64
                                    ? "data:image/png;base64," + currentSelectedSubcompany.imageBase64
                                    : `${process.env.CONTEXT}public/img/image.png`}
                                />
                                <div className="firm-text">
                                    <p className={"firm_name" + ((screen === 0) ? ' not-selected' : '')}>{currentSelectedSubcompany && ((screen === 0 && currentSelectedSubcompany.onlineCompanyHeader) ? currentSelectedSubcompany.onlineCompanyHeader : currentSelectedSubcompany.companyName)}</p>
                                </div>
                                <div className="burger_menu_btn_on" onClick={(event) => this.changeBurger()}>
                                    <img src={burger_open} alt="telephone" />
                                </div>
                            </div>
                            <p className="adress-text"> {currentSelectedSubcompany && `${currentSelectedSubcompany.city ? (currentSelectedSubcompany.city + ', ') : ''}${currentSelectedSubcompany["companyAddress" + currentSelectedSubcompany.defaultAddress]}`}</p>
                            <div className="firm-icons">

                                <div className="text-phones">
                                    {/* <p>{currentSelectedSubcompany.companyPhone1}</p> */}
                                    <p>{currentSelectedSubcompany.companyPhone2}</p>
                                    <p>{currentSelectedSubcompany.companyPhone3}</p>
                                </div>

                                <div className="adress-phones">
                                    <div className="adress-text-wrapper">
                                        <a href={this.getSocialLink('tiktok')} rel="external" target="_blank"><img src={tiktok_white} alt='tiktok' /></a>
                                        <a href={this.getSocialLink('facebook')} rel="external" target="_blank"><img src={facebook_white} alt='facebook' /></a>
                                        <a href={this.getSocialLink('instagram')} rel="external" target="_blank"><img src={instagram_white} alt='instagram' /></a>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </MediaQuery>
                    <MediaQuery minWidth={TABLET_WIDTH}>
                        <div className="firm-title">
                            <img className="logo" src={currentSelectedSubcompany.imageBase64
                                ? "data:image/png;base64," + currentSelectedSubcompany.imageBase64
                                : `${process.env.CONTEXT}public/img/image.png`}
                            />
                            <div className="firm-text">
                                <p className={"firm_name" + ((screen === 0) ? ' not-selected' : '')}>
                                    {currentSelectedSubcompany && ((screen === 0 && currentSelectedSubcompany.onlineCompanyHeader)
                                        ? currentSelectedSubcompany.onlineCompanyHeader : currentSelectedSubcompany.companyName)}</p>
                                {!!screen && <p className="adress-text"> {currentSelectedSubcompany && `${currentSelectedSubcompany.city
                                    ? (currentSelectedSubcompany.city + ', ') : ''}${currentSelectedSubcompany["companyAddress" + currentSelectedSubcompany.defaultAddress]}`}</p>}
                            </div>
                        </div>
                        <div className={!!screen ? "firm-icons" : "firm-icons firm-icons_only_lang"}>
                            {!!screen &&
                                <div className="adress-phones">
                                    <span className="adress-icon" />
                                    <div className="adress-text-wrapper">
                                        <a href={this.getSocialLink('tiktok')} rel="external" target="_blank"><img src={tiktok} alt='tiktok' /></a>
                                        <a href={this.getSocialLink('facebook')} rel="external" target="_blank"><img src={facebook} alt='facebook' /></a>
                                        <a href={this.getSocialLink('instagram')} rel="external" target="_blank"><img src={instagram} alt='instagram' /></a>
                                    </div>
                                </div>}
                            <div className="header-lang" onClick={e => this.openLangList()}>
                                <p>{currentTextLeng}</p>
                                <img src={arrow_down} alt="arrou"></img>
                                <div className={langList ? "leng_list leng_list_active" : "leng_list"}>
                                    <div className="leng_list_item" onClick={(e) => this.changeLang("ru")}>
                                        <p>Русский</p>
                                        <div className={currentLang === "ru" ? "leng_btn" : "leng_btn langNotActive"}></div>
                                    </div>
                                    <div className="leng_list_item" onClick={(e) => this.changeLang("en")}>
                                        <p>English</p>
                                        <div></div>
                                        <div className={currentLang === "en" ? "leng_btn" : "leng_btn langNotActive"}></div>
                                    </div>
                                    <div className="leng_list_item" onClick={(e) => this.changeLang("uk")}>
                                        <p>Український</p>
                                        <div></div>
                                        <div className={currentLang === "uk" ? "leng_btn" : " leng_btn langNotActive"}></div>
                                    </div>
                                    <div className="leng_list_item" onClick={(e) => this.changeLang("pl")}>
                                        <p>Polski</p>
                                        <div></div>
                                        <div className={currentLang === "pl" ? "leng_btn" : " leng_btn langNotActive"}></div>
                                    </div>
                                </div>
                            </div>
                            {!!screen && <div className="separation"></div>}
                            {!!screen && <div className="mobile-icon-block">
                                <div className={mobile ? "mobile-icon-wrapper mobile_active" : "mobile-icon-wrapper"}>

                                    <div className="text-phones">
                                        {/* <p>{currentSelectedSubcompany.companyPhone1}</p> */}
                                        <p>{!!currentSelectedSubcompany.companyPhone2?.replace('+', '') && currentSelectedSubcompany.companyPhone2}</p>
                                        <p>{!!currentSelectedSubcompany.companyPhone3?.replace('+', '') && currentSelectedSubcompany.companyPhone3}</p>
                                    </div>

                                    <img src={telephone_btn} onClick={e => this.setState({
                                        mobile: !mobile
                                    })} alt="close" />
                                </div>
                                <img src={telephone} onClick={e => this.setState({
                                    mobile: !mobile
                                })} alt="telephone" />
                            </div>}
                        </div>
                    </MediaQuery>

                </React.Fragment>
            </div>
        );
    }
}
export default withTranslation("common")(Header);
