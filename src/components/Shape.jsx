import { Circle, Rect, Star } from 'react-konva';
import { CANVAS_CONFIG } from '../constants/canvas';

const Shape = ({ shape, isSelected, onSelect, onPositionUpdate }) => {
  const commonProps = {
    id: shape.id,
    x: shape.x,
    y: shape.y,
    fill: shape.fill,
    draggable: isSelected,
    onClick: () => onSelect(shape.id),
    onTap: () => onSelect(shape.id),
    onDragEnd: (e) => {
      onPositionUpdate(shape.id, e.target.position());
    },
  };

  switch (shape.type) {
    case 'circle':
      return <Circle {...commonProps} radius={CANVAS_CONFIG.SHAPES.CIRCLE_RADIUS} />;
    case 'rect':
      return <Rect {...commonProps} width={CANVAS_CONFIG.SHAPES.RECT_SIZE} height={CANVAS_CONFIG.SHAPES.RECT_SIZE} />;
    case 'star':
      return <Star 
        {...commonProps} 
        numPoints={CANVAS_CONFIG.SHAPES.STAR_POINTS} 
        innerRadius={CANVAS_CONFIG.SHAPES.STAR_INNER_RADIUS} 
        outerRadius={CANVAS_CONFIG.SHAPES.STAR_OUTER_RADIUS} 
      />;
    default:
      return null;
  }
};

export default Shape;