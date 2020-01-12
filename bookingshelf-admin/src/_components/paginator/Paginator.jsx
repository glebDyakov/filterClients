import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Pagination }  from 'react-bootstrap';

import './Paginator.scss';

class Paginator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pager: {}
    };
  }

  componentWillMount() {
    // set page if items array isn't empty
    if (this.props.items && this.props.items.length) {
      this.setPage(this.props.initialPage);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // reset page if items array has changed
    if (this.props.items !== prevProps.items) {
      this.setPage(this.props.initialPage);
    }
  }

  setPage(page) {
    const { items, pageSize } = this.props;
    let { pager } = this.state;

    if (page < 1 || page > pager.totalPages) {
      return;
    }

    // get new pager object for specified page
    pager = this.getPager(10, page, pageSize);

    // get new page of items from items array
    const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

    debugger
    // update state
    this.setState({ pager: pager });

    // call change page function in parent component
    this.props.onChangePage(pageOfItems);
  }

  getPager(totalItems, currentPage, pageSize) {
    // default to first page
    currentPage = currentPage || 1;

    // default page size is 5
    pageSize = pageSize || 5;

    // calculate total pages
    const totalPages = Math.ceil(totalItems / pageSize);

    let startPage, endPage;
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    // calculate start and end item indexes
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    const pages = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i);


    // return object with all pager properties required by the view
    return {
      totalItems,
      currentPage,
      pageSize,
      totalPages,
      startPage,
      endPage,
      startIndex,
      endIndex,
      pages
    };
  }

  render() {
    const {
      pager : {
        pages,
        currentPage,
        totalPages
      }
    } = this.state;

    if (!pages || pages.length <= 1) {
      return null;
    }

    return (
      <Pagination className="paginator">
        <div>testtestetest</div>
        <Pagination.Item
          disabled={currentPage === 1}
          onClick={() => this.setPage(1)}
        >
          First
        </Pagination.Item>
        <Pagination.Item
          disabled={currentPage === 1}
          onClick={() => this.setPage(currentPage - 1)}
        >
          Previous
        </Pagination.Item>
        {pages.map((page, index) =>
          <Pagination.Item
            key={index}
            className={currentPage === page ? 'active' : ''}
            onClick={() => this.setPage(page)}
          >
            {page}
          </Pagination.Item>
        )}
        <Pagination.Item
          disabled={currentPage === totalPages}
          onClick={() => this.setPage(currentPage + 1)}
        >
          Next
        </Pagination.Item>
        <Pagination.Item
          disabled={currentPage === totalPages}
          onClick={() => this.setPage(totalPages)}
        >
          Last
        </Pagination.Item>
      </Pagination>
    );
  }
}

Paginator.propTypes = {
  items: PropTypes.array.isRequired,
  onChangePage: PropTypes.func.isRequired,
  initialPage: PropTypes.number,
  pageSize: PropTypes.number
};

Paginator.defaultProps = {
  initialPage: 1,
  pageSize: 5
};

export default Paginator;
