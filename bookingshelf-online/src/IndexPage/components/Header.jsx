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
import MediaQuery from 'react-responsive'
// import { findSourceMap } from 'module';

class Header extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            burger: true,
        };
        this.changeBurger = this.changeBurger.bind(this);
    }

    changeBurger() {
        this.setState({
            burger: !this.state.burger,
        })
    }
    render() {

        const { info, screen, selectedSubcompany } = this.props;
        const { burger } = this.state
        const desctop = 710;
        const mob = 709;

        return (
            <div className="modal_menu">
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
                        <div className="header-lang">
                            <p>RU</p>
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
                                    <p>RU</p>
                                    <img src={arrow_down_white} alt="arrou"></img>
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
                                <p>RU</p>
                                <img src={arrow_down} alt="arrou"></img>
                            </div>
                            <div className="separation"></div>
                            <div className="mobile-icon-wrapper">
                                <img src={telephone} alt="telephone" />
                            </div>
                        </div>
                    </MediaQuery>

                </React.Fragment>
            </div>
        );
    }
}
export default Header;