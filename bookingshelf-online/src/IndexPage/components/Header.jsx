import React, {PureComponent} from 'react';


class Header extends  PureComponent {

    render() {

        const {info, screen, selectedSubcompany} = this.props;


        return (
            <div className="modal_menu">

                <img className="logo" src={info.imageBase64
                    ? "data:image/png;base64," + info.imageBase64
                    : `${process.env.CONTEXT}public/img/image.png`}
                />
                <p className={"firm_name" + ((screen === 0) ? ' not-selected' : '')}>{info && ((screen === 0 && info.onlineCompanyHeader) ? info.onlineCompanyHeader : info.companyName)}</p>
                {!(screen === 0) && (
                    <React.Fragment>
                        <div className="adress-phones">
                            <span className="adress-icon" />
                            <div className="adress-text-wrapper">
                                <p className="adress-text">{info && `${info.city ? (info.city + ', ') : ''}${info["companyAddress" + info.defaultAddress]}`}</p>
                                <span className="closer" />
                            </div>
                        </div>
                        <div className="mobile-icon-wrapper">
                            <span className="mobile" />
                        </div>
                        <p className="phones_firm">
                            {info.companyPhone1 && info.companyPhone1.length > 4 && <a href={"tel:" + info.companyPhone1}>{info.companyPhone1}</a>}
                            {info.companyPhone2 && info.companyPhone2.length > 4 && <a href={"tel:" + info.companyPhone2}>{info.companyPhone2}</a>}
                            {info.companyPhone3 && info.companyPhone3.length > 4 && <a href={"tel:" + info.companyPhone3}>{info.companyPhone3}</a>}
                            <span className="closer" />
                        </p>
                        <div className="clear" />
                    </React.Fragment>
                )}
            </div>
        );
    }
}
export default Header;