import { Rect, Circle, Line } from 'react-konva';
import { CANVAS_CONFIG } from '../constants/canvas';

const SelectionBorder = ({ shape, onDelete }) => {
  const { BORDER_OFFSET, BORDER_SIZE, DELETE_BUTTON_RADIUS } = CANVAS_CONFIG.SELECTION;
  
  const borderX = shape.type === 'rect' ? shape.x - BORDER_OFFSET : shape.x - (BORDER_SIZE / 2);
  const borderY = shape.type === 'rect' ? shape.y - BORDER_OFFSET : shape.y - (BORDER_SIZE / 2);
  const deleteButtonX = shape.type === 'rect' ? shape.x + BORDER_SIZE - BORDER_OFFSET : shape.x + (BORDER_SIZE / 2) - BORDER_OFFSET;
  const deleteButtonY = shape.type === 'rect' ? shape.y - BORDER_OFFSET : shape.y - (BORDER_SIZE / 2);

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