import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CANVAS_CONFIG } from '../constants/canvas';

export const useCanvasStore = create(
  persist(
    (set, get) => ({
  // Stage transform state
  stageScale: 1,
  stageX: 0,
  stageY: 0,
  stageSize: { width: window.innerWidth, height: window.innerHeight },

  // Pan and zoom state
  isPanning: false,

  // Actions
  updateTransform: (x, y, scale) => set((state) => ({
    stageX: x !== undefined ? x : state.stageX,
    stageY: y !== undefined ? y : state.stageY,
    stageScale: scale !== undefined ? scale : state.stageScale,
  })),

  setStageSize: (size) => set({ stageSize: size }),
  setIsPanning: (isPanning) => {
    // Get debug logging function
    const debugLog = () => {
      try {
        const { debugLog: logFn } = require('./interactionStore').useInteractionStore.getState();
        return logFn;
      } catch {
        return () => {}; // Fallback if store not available
      }
    };
    
    debugLog()('CANVAS_PANNING_STATE', `Panning ${isPanning ? 'started' : 'stopped'}`, {
      isPanning,
      currentTransform: get()
    });
    
    set({ isPanning });
  },

  // Zoom action with bounds
  zoom: (delta, pointer, currentStage) => {
    const { stageScale: oldScale, stageX, stageY } = get();
    
    const mousePointTo = {
      x: (pointer.x - stageX) / oldScale,
      y: (pointer.y - stageY) / oldScale,
    };

    // Positive delta (scroll down) should zoom out, negative delta (scroll up) should zoom in
    const direction = delta > 0 ? -1 : 1;
    const scaleBy = CANVAS_CONFIG.ZOOM.SCALE_FACTOR;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    
    const boundedScale = Math.max(
      CANVAS_CONFIG.ZOOM.MIN_SCALE, 
      Math.min(CANVAS_CONFIG.ZOOM.MAX_SCALE, newScale)
    );

    const newPos = {
      x: pointer.x - mousePointTo.x * boundedScale,
      y: pointer.y - mousePointTo.y * boundedScale,
    };

    set({
      stageScale: boundedScale,
      stageX: newPos.x,
      stageY: newPos.y,
    });
  },

  // Pan action
  updatePan: (x, y) => {
    const current = get();
    
    // Get debug logging function
    const debugLog = () => {
      try {
        const { debugLog: logFn } = require('./interactionStore').useInteractionStore.getState();
        return logFn;
      } catch {
        return () => {}; // Fallback if store not available
      }
    };
    
    debugLog()('CANVAS_PAN_UPDATE', 'Canvas position updated', {
      newPosition: { x, y },
      oldPosition: { x: current.stageX, y: current.stageY },
      delta: { x: x - current.stageX, y: y - current.stageY },
      scale: current.stageScale,
      isPanning: current.isPanning
    });
    
    set({ stageX: x, stageY: y });
  },

  // Set canvas state (for loading diagram-specific state)
  setCanvasState: (canvasState) => set({
    stageX: canvasState.stageX || 0,
    stageY: canvasState.stageY || 0,
    stageScale: canvasState.stageScale || 1,
  }),

  // Get current canvas state (for saving diagram-specific state)
  getCanvasState: () => {
    const { stageX, stageY, stageScale } = get();
    return { stageX, stageY, stageScale };
  },
}),
    {
      name: 'family-diagram-canvas',
      partialize: (state) => ({ 
        stageX: state.stageX, 
        stageY: state.stageY, 
        stageScale: state.stageScale 
      }),
    }
  )
);