import { useCanvasStore } from '../stores/canvasStore';
import { usePersistedShapeStore } from '../stores/persistedShapeStore';
import { useInteractionStore } from '../stores/interactionStore';
import { CANVAS_CONFIG } from '../constants/canvas';

export const useCanvasInteractions = (stageRef) => {
  const { 
    stageScale, 
    stageX, 
    stageY, 
    isPanning, 
    setIsPanning, 
    zoom, 
    updatePan 
  } = useCanvasStore();
  
  const { deselectAll } = usePersistedShapeStore();
  const { isTouchDragging } = useInteractionStore();

  const handleWheel = (e) => {
    e.evt.preventDefault();
    
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    
    zoom(e.evt.deltaY, pointer, stage);
  };

  const handleMouseDown = (e) => {
    if (!e.target || typeof e.target.getStage !== 'function') return;
    
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      deselectAll();
      setIsPanning(true);
    } else {
      setIsPanning(false);
    }
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    
    const stage = e.target.getStage();
    updatePan(stage.x(), stage.y());
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleTouchStart = (e) => {
    if (isTouchDragging()) return;
    
    if (!e.target || typeof e.target.getStage !== 'function') return;
    
    const stage = e.target.getStage();
    const clickedOnEmpty = e.target === stage;
    
    if (!clickedOnEmpty) {
      setIsPanning(false);
      return;
    }
    
    if (e.evt && e.evt.preventDefault) {
      e.evt.preventDefault();
    }
    
    const touches = e.evt && e.evt.touches ? e.evt.touches : [];
    
    if (touches.length === 1) {
      deselectAll();
      setIsPanning(true);
    } else if (touches.length === 2) {
      setIsPanning(false);
      const touch1 = touches[0];
      const touch2 = touches[1];
      const dist = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      stage.setAttrs({ lastDist: dist });
    }
  };

  const handleTouchMove = (e) => {
    if (!e.target || typeof e.target.getStage !== 'function') return;
    
    const stage = e.target.getStage();
    if (e.target !== stage) return;
    
    const touches = e.evt && e.evt.touches ? e.evt.touches : [];
    
    if (touches.length === 1 && isPanning) {
      if (e.evt && e.evt.preventDefault) {
        e.evt.preventDefault();
      }
      updatePan(stage.x(), stage.y());
    } else if (touches.length === 2) {
      if (e.evt && e.evt.preventDefault) {
        e.evt.preventDefault();
      }
      
      const touch1 = touches[0];
      const touch2 = touches[1];
      const newDist = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      const lastDist = stage.getAttr('lastDist') || newDist;
      
      if (lastDist > 0) {
        const centerX = (touch1.clientX + touch2.clientX) / 2;
        const centerY = (touch1.clientY + touch2.clientY) / 2;
        
        const stageRect = stage.container().getBoundingClientRect();
        const pointer = {
          x: centerX - stageRect.left,
          y: centerY - stageRect.top
        };
        
        const scale = newDist / lastDist;
        const oldScale = stage.scaleX();
        
        const mousePointTo = {
          x: (pointer.x - stageX) / oldScale,
          y: (pointer.y - stageY) / oldScale,
        };

        const newScale = Math.max(CANVAS_CONFIG.ZOOM.MIN_SCALE, Math.min(CANVAS_CONFIG.ZOOM.MAX_SCALE, oldScale * scale));
        
        const newPos = {
          x: pointer.x - mousePointTo.x * newScale,
          y: pointer.y - mousePointTo.y * newScale,
        };

        useCanvasStore.getState().updateTransform(newPos.x, newPos.y, newScale);
      }
      
      stage.setAttrs({ lastDist: newDist });
    }
  };

  const handleTouchEnd = (e) => {
    if (isPanning && e.evt && e.evt.preventDefault) {
      e.evt.preventDefault();
    }
    
    setIsPanning(false);
    
    if (e.target && typeof e.target.getStage === 'function') {
      const stage = e.target.getStage();
      if (stage) {
        stage.setAttrs({ lastDist: 0 });
      }
    }
  };

  const handleStageMove = (e) => {
    updatePan(e.target.x(), e.target.y());
  };

  return {
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleStageMove,
  };
};