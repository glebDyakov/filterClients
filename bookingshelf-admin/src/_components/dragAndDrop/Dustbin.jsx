import React from 'react'
import { useDrop } from 'react-dnd'
import ItemTypes from './ItemTypes'

const Dustbin = ({ content, wrapperId, wrapperClassName, isStartMovingVisit, wrapperClick, movingVisitMillis, movingVisitStaffId }) => {
    const [{ canDrop, isOver }, drop] = useDrop({
        accept: ItemTypes.APPOINTMENT,
        drop: () => ({ movingVisitMillis, movingVisitStaffId }),
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    })
    const isActive = canDrop && isOver
    let border = ''
    if (isActive) {
        border = '1px solid #ed1b24'
    } else if (canDrop) {
        // border = '1px solid rgba(0, 0, 0, 0.2)'
    }
    return (
        <div
            id={wrapperId}
            className={wrapperClassName}
            onClick={wrapperClick}
            data-toggle={isStartMovingVisit && "modal"}
            data-target={isStartMovingVisit && ".move-visit-modal"}
            ref={drop}
            style={{ border }}
        >
            {content}
        </div>
    )
}
export default Dustbin
