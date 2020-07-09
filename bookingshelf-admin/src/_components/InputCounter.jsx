import React from "react";

const InputCounter = ({ title, extraWrapperClassName, name, value, type = 'text', extraClassName, handleChange, handleKeyUp, placeholder, maxLength, withCounter = true }) => (
    <div className={extraWrapperClassName}  style={{position: 'relative'}}>
        <p>{title}</p>
        <input
            style={{paddingRight: '57px'}}
            className={extraClassName}
            type={type}
            placeholder={placeholder}
            value={value}
            name={name}
            onChange={handleChange}
            onKeyUp={handleKeyUp}
            maxLength={maxLength}
        />
        {withCounter && <span style={{ bottom: '17px', right: '10px', position: 'absolute', opacity: 0.7}}>{value ? value.length : 0}/{maxLength}</span>}
    </div>
);

export default InputCounter;
