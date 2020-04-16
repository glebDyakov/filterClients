import React from "react";

const InputCounter = ({ title, name, value, type = 'text', extraClassName, handleChange, handleKeyUp, placeholder, maxLength }) => (
    <div style={{position: 'relative'}}>
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
        <span style={{ bottom: '17px', right: '10px', position: 'absolute', opacity: 0.7}}>{value ? value.length : 0}/{maxLength}</span>
    </div>
);

export default InputCounter;