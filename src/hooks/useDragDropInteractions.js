import { useInteractionStore } from '../stores/interactionStore';
import { usePersistedShapeStore } from '../stores/persistedShapeStore';

export const useDragDropInteractions = (stageRef) => {
  const { 
    isDragging, 
    dragType, 
    touchDragType,
    touchDragPosition,
    hasDraggedFromButton,
    startToolbarDrag, 
    endToolbarDrag,
    startTouchDrag,
    updateTouchDrag,
    endTouchDrag 
  } = useInteractionStore();
  
  const { addShape } = usePersistedShapeStore();

  const handleToolbarDragStart = (type) => {
    startToolbarDrag(type);
  };

  const handleCanvasDrop = (e) => {
    if (isDragging && dragType) {
      const stage = e.target.getStage();
      const pointerPosition = stage.getPointerPosition();
      const worldX = (pointerPosition.x - stage.x()) / stage.scaleX();
      const worldY = (pointerPosition.y - stage.y()) / stage.scaleY();
      addShape(dragType, worldX, worldY);
      endToolbarDrag();
    }
  };

  const handleCanvasDragOver = (e) => {
    e.preventDefault();
  };

  const handleToolbarTouchStart = (type, e) => {
    e.preventDefault();
    const touch = e.touches[0];
    startTouchDrag(type, { x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e) => {
    if (touchDragType) {
      e.preventDefault();
      const touch = e.touches[0];
      updateTouchDrag({ x: touch.clientX, y: touch.clientY });
      return;
    }
  };

  const handleTouchEnd = (e) => {
    if (touchDragType) {
      e.preventDefault();
      
      if (hasDraggedFromButton) {
        const stage = stageRef.current;
        const stageRect = stage.container().getBoundingClientRect();
        const touch = e.changedTouches[0];
        
        if (
          touch.clientX >= stageRect.left &&
          touch.clientX <= stageRect.right &&
          touch.clientY >= stageRect.top &&
          touch.clientY <= stageRect.bottom
        ) {
          const localX = (touch.clientX - stageRect.left - stage.x()) / stage.scaleX();
          const localY = (touch.clientY - stageRect.top - stage.y()) / stage.scaleY();
          
          addShape(touchDragType, localX, localY);
        }
      }
      
      endTouchDrag();
      return;
    }
  };

  return {
    isDragging,
    dragType,
    touchDragType,
    touchDragPosition,
    handleToolbarDragStart,
    handleCanvasDrop,
    handleCanvasDragOver,
    handleToolbarTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};