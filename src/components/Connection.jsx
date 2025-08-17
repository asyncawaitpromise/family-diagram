import { Line } from 'react-konva';
import { CANVAS_CONFIG } from '../constants/canvas';

const Connection = ({ connection, fromShape, toShape, draggedShapeId, dragPosition }) => {
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

  return (
    <Line
      points={[fromX, fromY, toX, toY]}
      stroke={CANVAS_CONFIG.SHAPES.DEFAULT_FILL}
      strokeWidth={6}
      listening={false}
    />
  );
};

export default Connection;