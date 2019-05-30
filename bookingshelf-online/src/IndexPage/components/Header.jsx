import React, {PureComponent} from 'react';


class Header extends  PureComponent {

    render() {

        const {info} = this.props;


        return (
            <div className="modal_menu">
                <p className="firm_name">{info && info.companyName}</p>
                <div className="adress-phones">
                    <p>{info && info["companyAddress" + info.defaultAddress]}</p>
                </div>
                <span className="mobile"></span>
                <p className="phones_firm">
                    {info.companyPhone1 && <a href={"tel:" + info.companyPhone1}>{info.companyPhone1}</a>}
                    {info.companyPhone2 && <a href={"tel:" + info.companyPhone2}>{info.companyPhone2}</a>}
                    {info.companyPhone3 && <a href={"tel:" + info.companyPhone3}>{info.companyPhone3}</a>}
                    <span className="closer"></span>
                </p>
                <div className="clear"></div>
            </div>
        );
    }
}
export default Header;