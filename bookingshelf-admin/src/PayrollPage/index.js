import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PayrollProvider } from './_context/PayrollContext';
import { SettingProvider } from './_context/SettingContext';
import { StaffSidebarProvider } from './_context/StaffSidebarContext';
import StaffList from './_components/StaffSidebar/StaffList';
import PayrollPage from './_pages/PayrollPage';
import SettingPage from './_pages/SettingPage';
import '../../public/scss/payroll.scss';
import NavBar from './_components/NavBar';
import { materialActions, payrollActions, servicesActions } from '../_actions';
import moment from 'moment';
import { material } from '../_reducers/material.reducer';
import { withRouter } from 'react-router';
import { access } from '../_helpers/access';
import { withTranslation } from 'react-i18next';


class Index extends Component {
  constructor(props) {
    super(props);

    if (!access(13)) { // TODO: change to 16
      props.history.push('/denied');
    }

    if (props.match.params.activeTab &&
      props.match.params.activeTab !== 'setting'
    ) {
      props.history.push('/nopage');
    }

    if (props.match.params.activeTab === undefined) {
      document.title = props.t('Расчет зарплат | Онлайн-запись');
    }
    if (props.match.params.activeTab === 'setting') {
      document.title = props.t('Настройки зарплат | Онлайн-запись');
    }

    this.state = {
      activeTab: props.match.params.activeTab || '',
      selectedStaffId: 0,

      date: {
        from: moment().subtract(7, 'days').format('x'),
        to: Date.now(),
      },
    };

    this.selectStaff = this.selectStaff.bind(this);
    this.setTab = this.setTab.bind(this);
    this.queryInitData = this.queryInitData.bind(this);
    this.initStaffData = this.initStaffData.bind(this);
    this.updatePayoutType = this.updatePayoutType.bind(this);
  }

  setTab(tab) {
    this.setState({ activeTab: tab }, () => {
      if (tab === '') {
        document.title = this.props.t('Расчет зарплат | Онлайн-запись');
      }

      if (tab === 'setting') {
        document.title = this.props.t('Настройки зарплат | Онлайн-запись');
      }

      history.pushState(null, '', '/salary' + (tab !== '' ? '/' + tab : tab));
    });
  }

  selectStaff(id) {
    this.setState({ selectedStaffId: id }, () => {
      this.initStaffData(id);
    });
  }

  queryInitData() {
    this.props.dispatch(servicesActions.get());
    this.props.dispatch(materialActions.getCategories());
  }

  initStaffData(staffId) {
    const { from, to } = this.state.date;

    this.props.dispatch(payrollActions.getPayoutAnalytic(staffId, from, to));
    this.props.dispatch(payrollActions.getPeriodAnalytic(staffId, from, to));
    this.props.dispatch(payrollActions.getPayoutTypes(staffId));
  }

  componentDidMount() {
    if (this.props.authentication.loginChecked) {
      this.queryInitData();
    }

    if (this.props.authentication.user) {
      this.setState({ selectedStaffId: this.props.authentication.user.profile.staffId }, () => {
        this.initStaffData(this.state.selectedStaffId);
      });
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.authentication.user !== nextProps.authentication.user) {
      this.setState({ selectedStaffId: nextProps.authentication.user.profile.staffId }, () => {
        this.initStaffData(this.state.selectedStaffId);
      });
    }
  }

  updatePayoutType(payoutType) {
    this.props.dispatch(payrollActions.updatePayoutType(this.state.selectedStaffId, {
      ...payoutType,
      staffId: this.state.selectedStaffId,
    }));
  }


  render() {
    const { selectedStaffId, activeTab } = this.state;
    const { staff, payroll, services, material } = this.props;

    const payrollPage = !payroll.isLoadingAnalytic && !payroll.isLoadingPeriod
      ? <PayrollPage/>
      : <div className="loader salary-loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>;

    const settingsPage = !payroll.isLoadingTypes
      ? <SettingPage/>
      : <div className="loader salary-loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>;

    return (
      <div id="payroll" className="d-flex">
        <StaffSidebarProvider value={{ selectedStaffId, selectStaff: this.selectStaff, staffs: staff.staff ?? [] }}>
          <StaffList/>
        </StaffSidebarProvider>

        <div className="main-container col p-0">
          <NavBar activeTab={activeTab} setTab={this.setTab}/>

          {this.state.activeTab === '' &&
          <PayrollProvider
            value={{ analytic: payroll.payoutAnalytic, payoutPeriod: payroll.payoutByPeriod }}>
            {payrollPage}
          </PayrollProvider>}

          {this.state.activeTab === 'setting' &&
          <SettingProvider
            value={{
              serviceGroups: services.services,
              categories: material.categories,
              payoutTypes: payroll.payoutTypes,
              updatePayoutTypeStatus:
              payroll.updatePayoutTypeStatus,
              updatePayoutType: this.updatePayoutType,
            }}>
            {settingsPage}
          </SettingProvider>}
        </div>
      </div>
    );
  }
}

Index.propTypes = {};

const mapStateToProps = (state) => {
  const { payroll, staff, authentication, services, material } = state;

  return {
    payroll,
    staff,
    authentication,
    services,
    material,
  };
};

export default connect(mapStateToProps)(withRouter(withTranslation('common')(Index)));
