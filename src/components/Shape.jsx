import { Circle, Rect, Star } from 'react-konva';
import { useRef, forwardRef } from 'react';
import { CANVAS_CONFIG } from '../constants/canvas';
import { useInteractionStore } from '../stores/interactionStore';

const Shape = forwardRef(({ shape, displayShape, isSelected, onSelect, onPositionUpdate, onDragMove, onDragStart, onDragEnd, selectedIds, isMultiSelectMode, onMultiShapePositionUpdate, onMultiDragMove, allShapes }, ref) => {
  const { debugLog } = useInteractionStore();
  const shapeRef = useRef();
  const renderShape = displayShape || shape;
  const commonProps = {
    ref: shapeRef,
    id: shape.id,
    x: renderShape.x,
    y: renderShape.y,
    fill: renderShape.fill,
    draggable: true,
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
      
      // Auto-select the shape when drag starts if not already selected
      if (!isSelected) {
        onSelect(shape.id);
      }
      
      if (onDragStart) {
        onDragStart(shape.id, { x: shape.x, y: shape.y });
      }
    },
    onDragMove: (e) => {
      const stage = e.target.getStage();
      const currentPos = e.target.position();
      const deltaX = currentPos.x - shape.x;
      const deltaY = currentPos.y - shape.y;
      
      debugLog('SHAPE_DRAG_MOVE', `Shape ${shape.id} dragging`, {
        shapeId: shape.id,
        currentPosition: currentPos,
        originalPosition: { x: shape.x, y: shape.y },
        stageTransform: { x: stage.x(), y: stage.y(), scale: stage.scaleX() },
        deltaX,
        deltaY,
        target: e.target.constructor.name,
        isMultiSelectMode,
        selectedIds
      });
      
      if (isMultiSelectMode && selectedIds && selectedIds.includes(shape.id) && onMultiDragMove) {
        // Create position updates for all selected shapes during drag
        const positions = {};
        selectedIds.forEach(id => {
          if (id === shape.id) {
            positions[id] = currentPos;
          } else {
            const otherShape = allShapes?.find(s => s.id === id);
            if (otherShape) {
              positions[id] = { x: otherShape.x + deltaX, y: otherShape.y + deltaY };
            }
          }
        });
        onMultiDragMove(positions);
      } else if (onDragMove) {
        // Single shape drag move
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
        attrs: e.target.attrs,
        isMultiSelectMode,
        selectedIds
      });
      
      // Clear the drag position to reset SelectionBorder to store position
      if (isMultiSelectMode && onMultiDragMove) {
        onMultiDragMove({});
      } else if (onDragMove) {
        onDragMove(null);
      }
      
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
        if (isMultiSelectMode && selectedIds && selectedIds.includes(shape.id) && onMultiShapePositionUpdate) {
          // Calculate the delta for group dragging
          const deltaX = finalPos.x - shape.x;
          const deltaY = finalPos.y - shape.y;
          
          // Create position updates for all selected shapes
          const positions = {};
          selectedIds.forEach(id => {
            if (id === shape.id) {
              positions[id] = finalPos;
            } else {
              // Find the original position of this shape and apply delta
              const otherShape = allShapes?.find(s => s.id === id);
              if (otherShape) {
                positions[id] = { x: otherShape.x + deltaX, y: otherShape.y + deltaY };
              }
            }
          });
          
          onMultiShapePositionUpdate(positions);
        } else {
          onPositionUpdate(shape.id, finalPos);
        }
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

  switch (renderShape.type) {
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