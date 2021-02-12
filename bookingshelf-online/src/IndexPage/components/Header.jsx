import React, { PureComponent } from 'react';
import facebook from "../../../public/img/icons/header-facebook.svg";
import tiktok from "../../../public/img/icons/header-tiktok.svg";
import instagram from "../../../public/img/icons/header-instagram.svg";
import telephone from "../../../public/img/icons/header-telephone.svg";
import arrow_down from "../../../public/img/arrow_down.png";
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
                            {/* {!(screen === 0) && ( */}
                            {/* <React.Fragment> */}

                            <p className="adress-text"> <span className="awesome-icon"></span>  {info && `${info.city ? (info.city + ', ') : ''}${info["companyAddress" + info.defaultAddress]}`}</p>
                        </div>
                    </div>
                    <div className="firm-icons">
                        <div className="adress-phones">
                            <span className="adress-icon" />
                            <div className="adress-text-wrapper">
                                {/* <p className="adress-text">{info && `${info.city ? (info.city + ', ') : ''}${info["companyAddress" + info.defaultAddress]}`}</p> */}
                                {/* <span className="closer" /> */}
                                <img src={tiktok} alt='tiktok'/>
                                <img src={facebook} alt='facebook'/>
                                <img src={instagram} alt=''/>
                            </div>
                        </div>
                        <div className="header-lang">
                            <p>RU</p>
                            <img src={arrow_down} alt="arrou"></img>
                        </div>
                        <div className="separation"></div>
                        <div className="mobile-icon-wrapper">
                            <img src={telephone} alt="telephone"/>
                            {/* <span className="mobile" src={telephone} /> */}
                        </div>
                        {/*
                        <p className="phones_firm">*/}
                           {/*{info.companyPhone1 && info.companyPhone1.length > 4 && <a href={"tel:" + info.companyPhone1}>{info.companyPhone1}</a>}*/}
                         {/*    {info.companyPhone2 && info.companyPhone2.length > 4 && <a href={"tel:" + info.companyPhone2}>{info.companyPhone2}</a>}
                            {info.companyPhone3 && info.companyPhone3.length > 4 && <a href={"tel:" + info.companyPhone3}>{info.companyPhone3}</a>}
                            <span className="closer" />
                        </p>
                        <div className="clear" />  */}
                        {/* </React.Fragment> */}
                        {/* )} */}
                       
                    </div>
                    </React.Fragment>
            </div>
        );
    }
}
export default Header;