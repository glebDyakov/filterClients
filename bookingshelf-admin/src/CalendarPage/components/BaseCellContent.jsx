import React from 'react';

const BaseCellContent = ({ time, notExpired }) => (
  <span className={(time.split(':')[1] === '00' && notExpired) ? 'visible-fade-time':'fade-time' }>
    {time}
  </span>
);

export default React.memo(BaseCellContent);
