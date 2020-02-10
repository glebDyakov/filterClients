import React from 'react'
import { useDrag } from 'react-dnd'
import ItemTypes from './ItemTypes'
const style = {
    border: '1px dashed gray',
    backgroundColor: 'white',
    padding: '0.5rem 1rem',
    marginRight: '1.5rem',
    marginBottom: '1.5rem',
    cursor: 'move',
    float: 'left',
}
const Box = ({ content, wrapperClassName, startMoving, moveVisit }) => {
    const [{ isDragging }, drag] = useDrag({
        item: { name, type: ItemTypes.APPOINTMENT },
        begin: startMoving,
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult()
            if (item && dropResult) {
                moveVisit(dropResult.movingVisitStaffId, dropResult.movingVisitMillis)
            }
        },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }
        ),
    })
    const opacity = isDragging ? 0.4 : 1
    return (
        <div ref={drag} className={wrapperClassName} style={{ opacity }}>
            {content}
        </div>
    )
}
export default Box
