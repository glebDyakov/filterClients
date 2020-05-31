import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// fake data generator
const getItems = count =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k}`,
        content: `item ${k}`
    }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the dragDropItems look a bit nicer
    userSelect: "none",
    // padding: grid * 2,
    // margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "transparent" : "transparent",

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    //background: isDraggingOver ? "#0a1330" : "transparent",
    padding: grid,
    width: '100%'
});

class DragDrop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dragDropItems: []
        };
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.dragDropItems) {
            this.setState({ dragDropItems: newProps.dragDropItems })
        }
    }

    onDragEnd(result) {
        const { handleDrogEnd } = this.props
        const { dragDropItems } = this.state
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const updatedDragDropItems = reorder(
            this.state.dragDropItems,
            result.source.index,
            result.destination.index
        );

        const isOrderChanged = dragDropItems.some((item, i) => dragDropItems[i].id !== updatedDragDropItems[i].id)

        if (isOrderChanged) {
            this.setState({
                dragDropItems: updatedDragDropItems
            });
            if (handleDrogEnd) {
                handleDrogEnd(updatedDragDropItems)
            }
        }
    }


    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
        const { extraStyle, extraClassName, extraDroppableProps } = this.props;
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable" {...extraDroppableProps}>
                    {(provided, snapshot) => (
                        <div
                            className={extraClassName}
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{...getListStyle(snapshot.isDraggingOver), ...extraStyle}}
                        >
                            {this.state.dragDropItems.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            )}
                                        >
                                            {item.getContent(provided.dragHandleProps)}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }
}

export default DragDrop
