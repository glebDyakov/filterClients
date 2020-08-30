import React, { Component } from 'react';

class StoreHouseList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { storeHouse, openClientStats, toggleStoreHouse } = this.props;

    return (
      <div className="tab-content-list mb-2">
        <div>
          <a onClick={() => openClientStats(storeHouse)}>
            <p>{storeHouse.storehouseName}</p>
          </a>
        </div>

        {/* <div className="delete clientEditWrapper">*/}
        {/*    <a className="clientEdit" onClick={() => this.toggleStoreHouse(storeHouse)}/>*/}
        {/* </div>*/}
        <div className="delete dropdown">
          {/* <div className="clientEyeDel" onClick={()=>this.toggleStoreHouse(storeHouse)}></div>*/}
          {/* <a style={{ marginRight: '24px' }} className="delete-icon menu-delete-icon"
          data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">*/}
          {/*    <img src={`${process.env.CONTEXT}public/img/delete_new.svg`} alt=""/>*/}
          {/* </a>*/}
          {/* <div className="dropdown-menu delete-menu p-3">*/}
          {/*    <button type="button" className="button delete-tab"
          onClick={()=>this.deleteStoreHouse(storeHouse.storehouseId)}>Удалить</button>*/}

          {/* </div>*/}
          <a className="clientEdit" onClick={() => toggleStoreHouse(storeHouse)} />
        </div>
      </div>
    );
  }
}

export default StoreHouseList;
