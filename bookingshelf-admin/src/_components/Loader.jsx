import React from 'react';

const Loader = () => {
  return (
    <div className="loading">
      <img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt="" />
    </div>
  );
};

export default Loader;
