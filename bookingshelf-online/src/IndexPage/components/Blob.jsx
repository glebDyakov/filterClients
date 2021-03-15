import React from 'react';
import MediaQuery from 'react-responsive'
const Blob = (props) => {
    const LAPTOP_WIDTH=810;
    switch (props.screen) {
        case 0: return (
            <MediaQuery minWidth={LAPTOP_WIDTH}>
                <div className="blob">
                    <svg width="1264" height="900" viewBox="0 0 1264 900" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M1143.64 220.869C1195.31 370.447 1209.57 553.565 1093.41 673.327C983.667 786.473 800.137 731.626 640.019 740.094C479.911 748.562 286.877 833.591 184.873 721.379C82.9174 609.219 181.658 437.705 234.789 294.308C276.18 182.596 338.722 82.7131 445.338 18.3965C565.13 -53.8682 704.605 -107.368 837.003 -68.9788C983.992 -26.3593 1096.23 83.6147 1143.64 220.869Z" fill="var(--color_button)" />
                    </svg>
                </div>
            </MediaQuery>
        )
        case 1: return (
            <MediaQuery minWidth={LAPTOP_WIDTH}>
                <div className="blob">
                    <svg width="1260" height="900" viewBox="0 0 1260 900" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M120.707 234.198C186.369 107.474 390.558 120.284 549.983 89.5074C665.967 67.1168 783.407 34.5382 894.659 84.7875C1009.74 136.768 1077.44 238.414 1113.98 344.249C1154.68 462.128 1183.14 593.65 1102.05 685.405C1017.21 781.408 862.392 794.52 716.413 794.111C547.944 793.64 361.467 794.852 242.463 682.998C112.32 560.674 48.0254 374.468 120.707 234.198Z" fill="var(--color_button)" />
                    </svg>
                </div>
            </MediaQuery>
        )
        case "staff-comments": return (
            <MediaQuery minWidth={LAPTOP_WIDTH}>
                <div className="blob">
                    <svg width="1030" height="900" viewBox="0 0 1030 900" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M463.699 8.25266C615.328 -12.2875 781.524 0.765266 888.732 102.159C1007.37 214.362 1053.2 379.589 1018.94 533.379C983.814 691.047 880.299 852.597 712.319 894.087C560.495 931.588 447.597 781.3 311.841 708.029C199.254 647.263 38.3538 629.653 5.8606 512.793C-27.0421 394.461 85.5419 293.013 170.432 199.463C251.352 110.289 339.239 25.1125 463.699 8.25266Z" fill="var(--color_button)" />
                    </svg>
                </div>
            </MediaQuery>
        )
        case "staff-create-comment": return (
            <MediaQuery minWidth={LAPTOP_WIDTH}>
                <div className="blob">
                    <svg width="1115" height="763" viewBox="0 0 1115 763" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M481.386 7.22831C337.747 22.5839 238.256 100.324 149.487 180.861C63.2325 259.116 -10.2987 344.376 1.18713 442.893C15.1917 563.014 57.3826 705.14 216.06 751.88C371.537 797.677 517.25 690.464 669.603 639.781C823.771 588.495 1024.04 574.184 1085.41 462.678C1153.53 338.901 1099.41 190.301 970.491 93.0923C850.169 2.36521 656.199 -11.4598 481.386 7.22831Z" fill="var(--color_button)" />
                    </svg>
                </div>
            </MediaQuery>
        )
        case 2: return (
            <MediaQuery minWidth={LAPTOP_WIDTH}>
                <div className="blob">
                    <svg width="1049" height="742" viewBox="0 0 1049 742" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M607.226 60.07C709.351 69.3188 819.339 29.6671 898.842 83.1659C998.026 149.909 1053.17 251.876 1048.75 357.182C1042.93 496.174 1024.85 666.701 871.898 726.137C719.312 785.43 566.438 663.732 414.256 603.741C261.517 543.531 54.4087 520.776 10.0343 386.389C-35.122 249.634 78.5694 100.323 222.126 21.8805C335.415 -40.0231 472.011 47.8246 607.226 60.07Z" fill="var(--color_button)" />
                    </svg>
                </div>
            </MediaQuery>
        )
        case 3: return (
            <MediaQuery minWidth={LAPTOP_WIDTH}>
                <div className="blob">
                    <svg width="1306" height="900" viewBox="0 0 1306 900" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M428.029 129.343C552.687 61.9373 683.873 1.89448 809.948 21.9132C951.2 44.3418 1077.71 114.972 1113.32 238.157C1149.61 363.668 1077.94 505.913 986.032 631.031C888.073 764.391 765.822 912.4 601.892 934.414C441.917 955.898 354.373 825.487 259.325 728.621C170.076 637.666 51.0252 546.71 89.0218 411.736C126.477 278.687 291.025 203.424 428.029 129.343Z" fill="var(--color_button)" />
                    </svg>
                </div>
            </MediaQuery>
        )
        case 4: return (
            <MediaQuery minWidth={LAPTOP_WIDTH}>
                <div className="blob">
                    <svg width="1067" height="675" viewBox="0 0 1067 675" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M542.617 0.0648112C700.075 2.2336 836.618 64.9686 934.155 148.326C1030.95 231.05 1095.3 335.868 1054.57 437.588C1015.3 535.63 877.034 592.99 739.487 634.404C608.185 673.937 464.303 691.311 330.64 655.552C183.938 616.306 53.3747 543.18 13.6117 440.213C-27.415 333.973 27.9721 222.554 130.489 137.257C231.965 52.826 381.457 -2.15497 542.617 0.0648112Z" fill="var(--color_button)" />
                    </svg>
                </div>
            </MediaQuery>
        )
        case 5: return (
            <MediaQuery minWidth={LAPTOP_WIDTH}>
                <div className="blob">
                    <svg width="1211" height="900" viewBox="0 0 1211 900" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M462.737 208.085C579.639 145.347 677.101 -7.83632 793.326 10.3653C919.977 30.1998 1092.12 209.318 1111.5 321.673C1129.94 428.577 988.917 518.551 908.54 622.319C821.817 734.28 681.288 726.287 540.808 760.37C390.745 796.778 312.737 874.663 223.822 788.445C135.988 703.275 81.1976 580.939 134.377 451.76C183.272 332.986 335.853 276.18 462.737 208.085Z" fill="var(--color_button)" />
                    </svg>
                </div>
            </MediaQuery>
        )
        case 6: return (
            <MediaQuery minWidth={LAPTOP_WIDTH}>
                <div className="blob">
                    <svg width="1121" height="824" viewBox="0 0 1121 824" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M564.661 47.7071C740.625 34.0082 950.092 -55.853 1068.55 53.5564C1188.3 164.169 1071.24 332.345 1029.8 477.331C989.213 619.377 998.436 803.914 837.635 861.621C678.738 918.645 531.128 779.121 378.628 711.019C239.989 649.108 59.0896 619.267 13.6887 493.673C-33.7918 362.325 48.3244 219.327 166.353 123.792C269.199 40.5476 421.98 58.8149 564.661 47.7071Z" fill="var(--color_button)" />
                    </svg>

                </div>
            </MediaQuery>
        )
        default: return (
            <MediaQuery minWidth={LAPTOP_WIDTH}>
                <div className="blob">
                    <svg width="1121" height="824" viewBox="0 0 1121 824" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M564.661 47.7071C740.625 34.0082 950.092 -55.853 1068.55 53.5564C1188.3 164.169 1071.24 332.345 1029.8 477.331C989.213 619.377 998.436 803.914 837.635 861.621C678.738 918.645 531.128 779.121 378.628 711.019C239.989 649.108 59.0896 619.267 13.6887 493.673C-33.7918 362.325 48.3244 219.327 166.353 123.792C269.199 40.5476 421.98 58.8149 564.661 47.7071Z" fill="var(--color_button)" />
                    </svg>
                </div>
            </MediaQuery>

        )
    }
}

export default Blob