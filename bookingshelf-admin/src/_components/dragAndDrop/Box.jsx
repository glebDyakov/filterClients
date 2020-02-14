import React from 'react'
import { useDrag } from 'react-dnd'
import ItemTypes from './ItemTypes'

const Box = ({ content, wrapperClassName, clearDraggingElem, startMoving, moveVisit }) => {
    const [{ isDragging }, drag] = useDrag({
        item: { name, type: ItemTypes.APPOINTMENT },
        begin: startMoving,
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult()
            if (item && dropResult) {
                moveVisit(dropResult.movingVisitStaffId, dropResult.movingVisitMillis)
            }
            clearDraggingElem()
        },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }
        ),
    })
    const visibility = isDragging ? 'hidden' : 'visible'
    return (
        <div ref={drag} className={wrapperClassName} style={{ visibility }}>{content}</div>
    )
}
export default Box
