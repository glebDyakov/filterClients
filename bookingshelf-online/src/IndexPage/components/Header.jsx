import React, { PureComponent } from 'react';
import facebook from "../../../public/img/icons/header-facebook.svg";
import tiktok from "../../../public/img/icons/header-tiktok.svg";
import instagram from "../../../public/img/icons/header-instagram.svg";
import telephone from "../../../public/img/icons/header-telephone.svg";
import arrow_down from "../../../public/img/arrow_down.png";
import burger_close from "../../../public/img/icons/burger-close.svg";
// import { findSourceMap } from 'module';

class Header extends PureComponent {

    render() {

        const { info, screen, selectedSubcompany } = this.props;


        return (
            <div className="modal_menu">
                 <React.Fragment>
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
                                <img src={tiktok} alt='tiktok'/>
                                <img src={facebook} alt='facebook'/>
                                <img src={instagram} alt='instagram'/>
                            </div>
                        </div>
                        <div className="header-lang">
                            <p>RU</p>
                            <img src={arrow_down} alt="arrou"></img>
                        </div>
                        <div className="separation"></div>
                        <div className="mobile-icon-wrapper">
                            <img src={telephone} alt="telephone"/>
                        </div>
                        <div className="burger_menu">
                            <img src={burger_close} alt="telephone"/>
                        </div>
                       
                    </div>
                    </React.Fragment>
            </div>
        );
    }
}
export default Header;