import React from 'react';
import Dustbin from "../../_components/dragAndDrop/Dustbin";

const WhiteCell = (props) => {
    const {
        content,
        wrapperId,
        wrapperClassName,
        addVisit,
        moveVisit,
        movingVisitMillis,
        movingVisitStaffId,
    } = props;

    return (
        <Dustbin
            content={content}
            wrapperId={wrapperId}
            wrapperClassName={wrapperClassName}
            addVisit={addVisit}
            moveVisit={moveVisit}
            movingVisitMillis={movingVisitMillis}
            movingVisitStaffId={movingVisitStaffId}
        />
    );
}
export default WhiteCell;