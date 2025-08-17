import { useState, useCallback } from 'react';
import { usePersistedShapeStore } from '../stores/persistedShapeStore';
import { CANVAS_CONFIG } from '../constants/canvas';

export const useShapeConnections = () => {
  const [dragStartPosition, setDragStartPosition] = useState(null);
  const [dragStartShapeId, setDragStartShapeId] = useState(null);
  const { shapes, addConnection } = usePersistedShapeStore();

  const calculateDistance = (pos1, pos2) => {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getShapeCenter = (shape) => {
    let x = shape.x;
    let y = shape.y;
    
    // For rectangles, add half the size to get center point
    if (shape.type === 'rect') {
      x += CANVAS_CONFIG.SHAPES.RECT_SIZE / 2;
      y += CANVAS_CONFIG.SHAPES.RECT_SIZE / 2;
    }
    // Circles and stars are already centered at their x,y coordinates
    
    return { x, y };
  };

  const getShapeAtPosition = useCallback((position, excludeId) => {
    // Use shape bounds for collision detection
    const SHAPE_SIZE = Math.max(
      CANVAS_CONFIG.SHAPES.CIRCLE_RADIUS * 2,
      CANVAS_CONFIG.SHAPES.RECT_SIZE,
      CANVAS_CONFIG.SHAPES.STAR_OUTER_RADIUS * 2
    );

    return shapes.find(shape => {
      if (shape.id === excludeId) return false;
      
      const shapeCenter = getShapeCenter(shape);
      const distance = calculateDistance(position, shapeCenter);
      return distance <= SHAPE_SIZE / 2;
    });
  }, [shapes]);

  const handleDragStart = useCallback((shapeId, position) => {
    setDragStartPosition(position);
    setDragStartShapeId(shapeId);
  }, []);

  const handleDragEnd = useCallback((shapeId, finalPosition, originalPosition) => {
    if (!dragStartPosition || !dragStartShapeId) {
      return true; // Allow normal position update
    }

    // Get the dragged shape to determine its type for center calculation
    const draggedShape = shapes.find(s => s.id === shapeId);
    if (!draggedShape) return true;

    // Convert the final position to center coordinates for the dragged shape
    const draggedShapeCenter = getShapeCenter({
      ...draggedShape,
      x: finalPosition.x,
      y: finalPosition.y
    });

    // Check if dropped on another shape using center coordinates
    const targetShape = getShapeAtPosition(draggedShapeCenter, shapeId);
    
    if (targetShape) {
      // Create connection between shapes
      addConnection(shapeId, targetShape.id);
      
      // Reset drag state
      setDragStartPosition(null);
      setDragStartShapeId(null);
      
      // Return false to prevent position update (revert to original position)
      return false;
    }

    // Reset drag state
    setDragStartPosition(null);
    setDragStartShapeId(null);
    
    // Allow normal position update
    return true;
  }, [dragStartPosition, dragStartShapeId, getShapeAtPosition, addConnection]);

  return {
    handleDragStart,
    handleDragEnd,
  };
};