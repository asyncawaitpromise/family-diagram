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
  const { isTouchDragging, debugLog } = useInteractionStore();

  const handleWheel = (e) => {
    // Handle both Konva events (e.evt) and regular DOM events (e)
    const evt = e.evt || e;
    if (evt && evt.preventDefault) {
      evt.preventDefault();
    }
    
    // For testing, if we don't have a proper Konva event structure, just return
    if (!e.target || !e.target.getStage) {
      return;
    }
    
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    
    zoom(evt.deltaY, pointer, stage);
  };

  const handleMouseDown = (e) => {
    if (!e.target || typeof e.target.getStage !== 'function') return;
    
    const stage = e.target.getStage();
    const clickedOnEmpty = e.target === stage || e.target.constructor.name === 'Layer';
    
    debugLog('CANVAS_MOUSE_DOWN', 'Canvas mouse down', {
      clickedOnEmpty,
      target: e.target.constructor.name,
      currentPanning: isPanning,
      stageTransform: { x: stageX, y: stageY, scale: stageScale },
      targetId: e.target.id ? e.target.id() : 'no-id'
    });
    
    if (clickedOnEmpty) {
      deselectAll();
      setIsPanning(true);
      
      // Store pan start position for manual panning
      const pointer = stage.getPointerPosition();
      stage._panStart = pointer;
      stage._panStartStagePos = { x: stageX, y: stageY };
    } else {
      setIsPanning(false);
    }
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    
    if (stage._panStart) {
      const dx = pointer.x - stage._panStart.x;
      const dy = pointer.y - stage._panStart.y;
      
      const newX = stage._panStartStagePos.x + dx;
      const newY = stage._panStartStagePos.y + dy;
      
      debugLog('CANVAS_MOUSE_MOVE', 'Manual panning', {
        newPosition: { x: newX, y: newY },
        delta: { x: dx, y: dy },
        pointer,
        startPos: stage._panStart
      });
      
      stage.position({ x: newX, y: newY });
      updatePan(newX, newY);
    }
  };

  const handleMouseUp = () => {
    if (isPanning) {
      debugLog('CANVAS_MOUSE_UP', 'Canvas mouse up - ending pan', {
        wasPanning: isPanning,
        finalPosition: { x: stageX, y: stageY },
        scale: stageScale
      });
      
      const stage = stageRef.current;
      if (stage) {
        stage._panStart = null;
        stage._panStartStagePos = null;
      }
    }
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

  // Stage handlers removed - using manual panning now

  return {
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};