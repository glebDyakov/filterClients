import React from 'react';
import ReactPaginate from 'react-paginate';
import '../../public/scss/paginator.scss';

const Paginator = (props) => {
  const { finalTotalPages = 0, onPageChange } = props;

  if (finalTotalPages <= 1) {
    return null;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }} className="paginator-container">
      <ReactPaginate
        previousLabel={'Пред'}
        nextLabel={'След'}
        breakLabel={'...'}
        pageCount={finalTotalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={onPageChange}
        subContainerClassName={'pages pagination'}
        breakClassName={'page-item'}
        breakLinkClassName={'page-link'}
        containerClassName={'pagination'}
        pageClassName={'page-item'}
        pageLinkClassName={'page-link'}
        previousClassName={'page-item'}
        previousLinkClassName={'page-link'}
        nextClassName={'page-item'}
        nextLinkClassName={'page-link'}
        activeClassName={'active'}
      />
    </div>
  );
};

export default Paginator;
