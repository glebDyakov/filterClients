import React from 'react';

const Blob = () => {
   
    return (
        <svg id="blob" xmlns="http://www.w3.org/2000/svg" version="1.1" filter="url(#goo)">
        <defs>
            <filter id="goo">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"></feGaussianBlur>
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo"></feColorMatrix>
                <feComposite in="SourceGraphic" in2="goo" operator="atop"></feComposite>
            </filter>
        </defs>
        <circle class="blob" fill="#ed16aa" cx="50%" cy="50%" r="60" id="Circle1"></circle>
        <circle class="blob" fill="#ed16aa" cx="50%" cy="50%" r="60" id="Circle2"></circle>
        <circle class="blob" fill="#ed16aa" cx="50%" cy="50%" r="60" id="Circle3"></circle>
        <circle class="blob" fill="#ed16aa" cx="50%" cy="50%" r="60" id="Circle4"></circle>
    </svg>
    )
}

export default Blob