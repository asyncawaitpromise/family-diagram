import { Rect, Circle, Line } from 'react-konva';
import { useState, useEffect } from 'react';
import { CANVAS_CONFIG } from '../constants/canvas';

const SelectionBorder = ({ shape, dragPosition, onDelete }) => {
  const [internalDragPosition, setInternalDragPosition] = useState({ x: shape.x, y: shape.y });
  
  // Update internal position when shape changes (new selection or shape store update)
  useEffect(() => {
    setInternalDragPosition({ x: shape.x, y: shape.y });
  }, [shape.x, shape.y, shape.id]);
  
  // Update internal position when dragging occurs
  useEffect(() => {
    if (dragPosition) {
      setInternalDragPosition(dragPosition);
    } else if (dragPosition === null) {
      // Reset to shape store position when drag ends
      setInternalDragPosition({ x: shape.x, y: shape.y });
    }
  }, [dragPosition, shape.x, shape.y]);
  const { BORDER_OFFSET, BORDER_SIZE, DELETE_BUTTON_RADIUS } = CANVAS_CONFIG.SELECTION;
  
  // Use internalDragPosition for real-time updates during dragging
  const currentX = internalDragPosition.x;
  const currentY = internalDragPosition.y;
  
  const borderX = shape.type === 'rect' ? currentX - BORDER_OFFSET : currentX - (BORDER_SIZE / 2);
  const borderY = shape.type === 'rect' ? currentY - BORDER_OFFSET : currentY - (BORDER_SIZE / 2);
  const deleteButtonX = shape.type === 'rect' ? currentX + BORDER_SIZE - BORDER_OFFSET : currentX + (BORDER_SIZE / 2) - BORDER_OFFSET;
  const deleteButtonY = shape.type === 'rect' ? currentY - BORDER_OFFSET : currentY - (BORDER_SIZE / 2);

  return (
    <>
      {/* Selection border */}
      <Rect
        x={borderX}
        y={borderY}
        width={BORDER_SIZE}
        height={BORDER_SIZE}
        stroke={CANVAS_CONFIG.SELECTION.BORDER_COLOR}
        strokeWidth={CANVAS_CONFIG.SELECTION.BORDER_WIDTH}
        dash={CANVAS_CONFIG.SELECTION.BORDER_DASH}
        fill="transparent"
        listening={false}
      />
      
      {/* Delete button */}
      <Circle
        x={deleteButtonX}
        y={deleteButtonY}
        radius={DELETE_BUTTON_RADIUS}
        fill={CANVAS_CONFIG.SELECTION.DELETE_BUTTON_COLOR}
        stroke={CANVAS_CONFIG.SELECTION.DELETE_BUTTON_STROKE}
        strokeWidth={CANVAS_CONFIG.SELECTION.DELETE_BUTTON_STROKE_WIDTH}
        onClick={onDelete}
        onTap={onDelete}
      />
      
      {/* Delete button X icon */}
      <Line
        points={[
          deleteButtonX - 6, deleteButtonY - 6,
          deleteButtonX + 6, deleteButtonY + 6
        ]}
        stroke={CANVAS_CONFIG.SELECTION.DELETE_BUTTON_STROKE}
        strokeWidth={CANVAS_CONFIG.SELECTION.DELETE_BUTTON_STROKE_WIDTH}
        listening={false}
      />
      <Line
        points={[
          deleteButtonX + 6, deleteButtonY - 6,
          deleteButtonX - 6, deleteButtonY + 6
        ]}
        stroke={CANVAS_CONFIG.SELECTION.DELETE_BUTTON_STROKE}
        strokeWidth={CANVAS_CONFIG.SELECTION.DELETE_BUTTON_STROKE_WIDTH}
        listening={false}
      />
    </>
  );
};

export default SelectionBorder;