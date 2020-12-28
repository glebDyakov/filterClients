import React, { Component } from 'react';
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
import { withRouter } from 'react-router';
import { access } from '../_helpers/access';
import { withTranslation } from 'react-i18next';
import MobileHandler from './_components/StaffSidebar/MobileHandler';


class Index extends Component {
  constructor(props) {
    super(props);

    if (!access(16)) { // TODO: change to 16
      props.history.push('/denied');
    }

    if (props.match.params.activeTab &&
      props.match.params.activeTab !== 'settings'
    ) {
      props.history.push('/nopage');
    }

    if (props.match.params.activeTab === undefined) {
      document.title = props.t('Расчет зарплат | Онлайн-запись');
    }
    if (props.match.params.activeTab === 'settings') {
      document.title = props.t('Настройки зарплат | Онлайн-запись');
    }

    this.state = {
      activeTab: props.match.params.activeTab || '',
      selectedStaffId: 0,

      date: {
        from: moment().subtract(6, 'days').toDate(),
        to: moment().toDate(),
        enteredTo: moment().toDate(),
      },

      isOpenMobileSelectStaff: false,

      percent: {
        servicesPercent: [],
        serviceGroupsPercent: [],
        productsPercent: [],
      },
    };

    this.selectStaff = this.selectStaff.bind(this);
    this.setTab = this.setTab.bind(this);
    this.queryInitData = this.queryInitData.bind(this);
    this.initStaffData = this.initStaffData.bind(this);
    this.handleSelectDate = this.handleSelectDate.bind(this);
    this.updatePayoutTypes = this.updatePayoutTypes.bind(this);
    this.handleDispatchPercents = this.handleDispatchPercents.bind(this);
  }

  handleSelectDate(date, isPeriod = false) {
    this.setState({ date }, () => {
      if (isPeriod) {
        this.initStaffData(this.state.selectedStaffId);
      }
    });
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
    this.props.dispatch(materialActions.getProducts());
  }

  initStaffData(staffId) {
    const { from, to } = this.state.date;

    this.props.dispatch(payrollActions.getPayoutAnalytic(staffId, moment(from).format('x'), moment(to).format('x')));
    this.props.dispatch(payrollActions.getPeriodAnalytic(staffId, moment(from).format('x'), moment(to).format('x')));
    this.props.dispatch(payrollActions.getPayoutTypes(staffId));
    this.props.dispatch(payrollActions.getServicesPercent(staffId));
    this.props.dispatch(payrollActions.getServiceGroupsPercent(staffId));
    this.props.dispatch(payrollActions.getProductsPercent(staffId));
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
    if (this.props.authentication.loginChecked !== nextProps.authentication.loginChecked) {
      this.queryInitData();
    }

    if (this.props.authentication.user !== nextProps.authentication.user) {
      this.setState({ selectedStaffId: nextProps.authentication.user.profile.staffId }, () => {
        this.initStaffData(this.state.selectedStaffId);
      });
    }
  }

  updatePayoutTypes(payoutTypes) {
    this.props.dispatch(payrollActions.updatePayoutType(this.state.selectedStaffId, payoutTypes.map(pt => ({
      ...pt,
      staffId: this.state.selectedStaffId,
    }))));
  }

  handleDispatchPercents(type, percents) {
    if (type === 'services') {
      this.props.dispatch(payrollActions.updateServicesPercent(
        this.state.selectedStaffId,
        percents.map((percent) => ({ ...percent, staffId: this.state.selectedStaffId })),
      ));
    } else if (type === 'products') {
      this.props.dispatch(payrollActions.updateProductsPercent(
        this.state.selectedStaffId,
        percents.map((percent) => ({ ...percent, staffId: this.state.selectedStaffId })),
      ));
    } else if (type === 'servicegroups') {
      this.props.dispatch(payrollActions.updateServiceGroupsPercent(
        this.state.selectedStaffId,
        percents.map((percent) => ({ ...percent, staffId: this.state.selectedStaffId })),
      ));
    }
  }


  render() {
    const { selectedStaffId, activeTab } = this.state;
    const { staff, payroll, services, material } = this.props;

    const payrollPage = !payroll.isLoadingAnalytic && !payroll.isLoadingPeriod
      ? <PayrollPage/>
      : <div className="loader salary-loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>;

    const settingsPage = !payroll.isLoadingTypes
    && !material.isLoadingProducts
    && !material.isLoadingCategories
    && !payroll.isLoadingServicesPercent
    && !payroll.isLoadingServiceGroupsPercent
    && !payroll.isLoadingProductsPercent
      ? <SettingPage/>
      : <div className="loader salary-loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>;

    const activeStaff = staff.staff && staff.staff.find(staff => staff.staffId === selectedStaffId);


    return (
      <div id="payroll" className="d-flex">
        <StaffSidebarProvider value={{ selectedStaffId, selectStaff: this.selectStaff, staffs: staff.staff ?? [] }}>
          <StaffList/>
        </StaffSidebarProvider>

        <div className="main-container col p-0">
          <NavBar handleSelectDate={this.handleSelectDate}
                  activeTab={activeTab}
                  date={this.state.date}
                  setTab={this.setTab}/>

          {this.state.activeTab === '' &&
          <PayrollProvider
            value={{ analytic: payroll.payoutAnalytic, payoutPeriod: payroll.payoutByPeriod, activeStaff: activeStaff }}>
            {payrollPage}
          </PayrollProvider>}

          {this.state.activeTab === 'settings' &&
          <SettingProvider
            value={{
              services: services.services,
              material,
              payroll,
              handleUpdatePercents: this.handleDispatchPercents,
              updatePayoutTypes: this.updatePayoutTypes,
              activeStaff: activeStaff
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
