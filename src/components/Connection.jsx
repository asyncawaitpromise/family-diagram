import { Line, Group, Circle, Text } from 'react-konva';
import { CANVAS_CONFIG } from '../constants/canvas';

const Connection = ({ connection, fromShape, toShape, draggedShapeId, dragPosition, isSelected, onSelect, onDelete }) => {
  if (!fromShape || !toShape) return null;

  const getShapeCenter = (shape, dragPos) => {
    let x = dragPos ? dragPos.x : shape.x;
    let y = dragPos ? dragPos.y : shape.y;
    
    // For rectangles, add half the size to get center point
    if (shape.type === 'rect') {
      x += CANVAS_CONFIG.SHAPES.RECT_SIZE / 2;
      y += CANVAS_CONFIG.SHAPES.RECT_SIZE / 2;
    }
    // Circles and stars are already centered at their x,y coordinates
    
    return { x, y };
  };

  // Calculate connection points (center of shapes)
  const fromCenter = getShapeCenter(
    fromShape, 
    draggedShapeId === fromShape.id ? dragPosition : null
  );
  const toCenter = getShapeCenter(
    toShape, 
    draggedShapeId === toShape.id ? dragPosition : null
  );

  const fromX = fromCenter.x;
  const fromY = fromCenter.y;
  const toX = toCenter.x;
  const toY = toCenter.y;

  // Calculate midpoint for the delete button
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;

  const handleLineClick = (e) => {
    e.cancelBubble = true;
    if (onSelect) {
      onSelect(connection.id);
    }
  };

  const handleDeleteClick = (e) => {
    e.cancelBubble = true;
    if (onDelete) {
      onDelete(connection.id);
    }
  };

  return (
    <Group>
      <Line
        points={[fromX, fromY, toX, toY]}
        stroke={isSelected ? CANVAS_CONFIG.SELECTION.BORDER_COLOR : CANVAS_CONFIG.SHAPES.DEFAULT_FILL}
        strokeWidth={6}
        listening={true}
        onClick={handleLineClick}
        onTap={handleLineClick}
      />
      
      {isSelected && (
        <Group>
          <Circle
            x={midX}
            y={midY}
            radius={CANVAS_CONFIG.SELECTION.DELETE_BUTTON_RADIUS}
            fill={CANVAS_CONFIG.SELECTION.DELETE_BUTTON_COLOR}
            stroke={CANVAS_CONFIG.SELECTION.DELETE_BUTTON_STROKE}
            strokeWidth={CANVAS_CONFIG.SELECTION.DELETE_BUTTON_STROKE_WIDTH}
            listening={true}
            onClick={handleDeleteClick}
            onTap={handleDeleteClick}
          />
          <Text
            x={midX - 4}
            y={midY - 6}
            text="×"
            fontSize={16}
            fill="white"
            fontStyle="bold"
            listening={false}
          />
        </Group>
      )}
    </Group>
  );
};

export default Connection;