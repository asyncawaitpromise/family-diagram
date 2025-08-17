import { CANVAS_CONFIG } from '../constants/canvas';

export const getShapeBounds = (shape) => {
  if (shape.type === 'rect') {
    return {
      x: shape.x,
      y: shape.y,
      width: CANVAS_CONFIG.SHAPES.RECT_SIZE,
      height: CANVAS_CONFIG.SHAPES.RECT_SIZE
    };
  } else if (shape.type === 'circle') {
    const radius = CANVAS_CONFIG.SHAPES.CIRCLE_RADIUS;
    return {
      x: shape.x - radius,
      y: shape.y - radius,
      width: radius * 2,
      height: radius * 2
    };
  } else if (shape.type === 'star') {
    const radius = CANVAS_CONFIG.SHAPES.STAR_OUTER_RADIUS;
    return {
      x: shape.x - radius,
      y: shape.y - radius,
      width: radius * 2,
      height: radius * 2
    };
  }
  return { x: shape.x, y: shape.y, width: 0, height: 0 };
};

export const isShapeIntersectingRect = (shape, rect) => {
  const shapeBounds = getShapeBounds(shape);
  
  const rectLeft = Math.min(rect.start.x, rect.end.x);
  const rectRight = Math.max(rect.start.x, rect.end.x);
  const rectTop = Math.min(rect.start.y, rect.end.y);
  const rectBottom = Math.max(rect.start.y, rect.end.y);
  
  const shapeLeft = shapeBounds.x;
  const shapeRight = shapeBounds.x + shapeBounds.width;
  const shapeTop = shapeBounds.y;
  const shapeBottom = shapeBounds.y + shapeBounds.height;
  
  return !(
    shapeRight < rectLeft ||
    shapeLeft > rectRight ||
    shapeBottom < rectTop ||
    shapeTop > rectBottom
  );
};

export const findShapesInSelection = (shapes, selectionStart, selectionEnd) => {
  const selectionRect = {
    start: selectionStart,
    end: selectionEnd
  };
  
  return shapes.filter(shape => 
    isShapeIntersectingRect(shape, selectionRect)
  ).map(shape => shape.id);
};