import React from 'react';

const InputCounter = ({ disabled, title, extraWrapperClassName, name, value, type = 'text', extraClassName, handleChange, handleKeyUp, placeholder, maxLength, withCounter }) => (
  <div className={extraWrapperClassName} style={{ position: 'relative' }}>
    <p>{title}</p>
    <input
      disabled={disabled}
      style={{ paddingRight: '65px' }}
      className={extraClassName + (disabled ? ' disabledField' : '')}
      type={type}
      placeholder={placeholder}
      value={value}
      name={name}
      onChange={handleChange}
      onKeyUp={handleKeyUp}
      maxLength={maxLength}
    />
    {withCounter && <span className="company_counter" style={{ bottom: '17px', right: '10px', position: 'absolute', opacity: 0.7 }}>{value ? value.length : 0}/{maxLength}</span>}
  </div>
);

export default InputCounter;
