import { Circle, Rect, Star } from 'react-konva';
import { useRef, forwardRef } from 'react';
import { CANVAS_CONFIG } from '../constants/canvas';
import { useInteractionStore } from '../stores/interactionStore';

const Shape = forwardRef(({ shape, isSelected, onSelect, onPositionUpdate, onDragMove, onDragStart, onDragEnd }, ref) => {
  const { debugLog } = useInteractionStore();
  const shapeRef = useRef();
  const commonProps = {
    ref: shapeRef,
    id: shape.id,
    x: shape.x,
    y: shape.y,
    fill: shape.fill,
    draggable: isSelected,
    onClick: () => {
      debugLog('SHAPE_CLICK', `Shape ${shape.id} clicked`, { 
        shapeId: shape.id, 
        isSelected, 
        position: { x: shape.x, y: shape.y } 
      });
      onSelect(shape.id);
    },
    onTap: () => {
      debugLog('SHAPE_TAP', `Shape ${shape.id} tapped`, { 
        shapeId: shape.id, 
        isSelected, 
        position: { x: shape.x, y: shape.y } 
      });
      onSelect(shape.id);
    },
    onDragStart: (e) => {
      const stage = e.target.getStage();
      debugLog('SHAPE_DRAG_START', `Shape ${shape.id} drag started`, {
        shapeId: shape.id,
        startPosition: { x: shape.x, y: shape.y },
        stageTransform: { x: stage.x(), y: stage.y(), scale: stage.scaleX() },
        isSelected,
        target: e.target.constructor.name
      });
      
      if (onDragStart) {
        onDragStart(shape.id, { x: shape.x, y: shape.y });
      }
    },
    onDragMove: (e) => {
      const stage = e.target.getStage();
      const currentPos = e.target.position();
      debugLog('SHAPE_DRAG_MOVE', `Shape ${shape.id} dragging`, {
        shapeId: shape.id,
        currentPosition: currentPos,
        originalPosition: { x: shape.x, y: shape.y },
        stageTransform: { x: stage.x(), y: stage.y(), scale: stage.scaleX() },
        deltaX: currentPos.x - shape.x,
        deltaY: currentPos.y - shape.y,
        target: e.target.constructor.name
      });
      
      // Notify the SelectionBorder of the new position
      if (onDragMove) {
        onDragMove(currentPos);
      }
    },
    onDragEnd: (e) => {
      const stage = e.target.getStage();
      const finalPos = e.target.position();
      
      debugLog('SHAPE_DRAG_END', `Shape ${shape.id} drag ended`, {
        shapeId: shape.id,
        finalPosition: finalPos,
        originalPosition: { x: shape.x, y: shape.y },
        stageTransform: { x: stage.x(), y: stage.y(), scale: stage.scaleX() },
        totalDelta: { x: finalPos.x - shape.x, y: finalPos.y - shape.y },
        target: e.target.constructor.name,
        stagePosition: { x: stage.x(), y: stage.y() },
        targetX: e.target.x(),
        targetY: e.target.y(),
        attrs: e.target.attrs
      });
      
      // Clear the drag position to reset SelectionBorder to store position
      if (onDragMove) {
        onDragMove(null);
      }
      
      debugLog('SHAPE_CALLING_UPDATE', `Calling onPositionUpdate for shape ${shape.id}`, {
        shapeId: shape.id,
        finalPosition: finalPos,
        finalPositionX: finalPos.x,
        finalPositionY: finalPos.y,
        originalPosition: { x: shape.x, y: shape.y },
        onPositionUpdateExists: !!onPositionUpdate,
        positionValid: !isNaN(finalPos.x) && !isNaN(finalPos.y) && isFinite(finalPos.x) && isFinite(finalPos.y)
      });
      
      if (onDragEnd) {
        const shouldUpdate = onDragEnd(shape.id, finalPos, { x: shape.x, y: shape.y });
        if (!shouldUpdate) {
          // Reset to original position
          e.target.position({ x: shape.x, y: shape.y });
          return;
        }
      }
      
      // Only update if position is valid
      if (!isNaN(finalPos.x) && !isNaN(finalPos.y) && isFinite(finalPos.x) && isFinite(finalPos.y)) {
        onPositionUpdate(shape.id, finalPos);
      } else {
        debugLog('SHAPE_INVALID_POSITION', `Invalid position detected for shape ${shape.id}`, {
          shapeId: shape.id,
          finalPosition: finalPos,
          resettingToOriginal: true
        });
        // Reset to original position if invalid
        e.target.position({ x: shape.x, y: shape.y });
      }
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
});

Shape.displayName = 'Shape';

export default Shape;