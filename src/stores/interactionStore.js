import { create } from 'zustand';

export const useInteractionStore = create((set, get) => ({
  // Logging control
  debugLogging: false,

  // Drag and drop state
  isDragging: false,
  dragType: null,

  // Touch gesture state
  touchDragType: null,
  touchDragPosition: null,
  hasDraggedFromButton: false,

  // Actions
  startToolbarDrag: (type) => set({
    isDragging: true,
    dragType: type,
  }),

  endToolbarDrag: () => set({
    isDragging: false,
    dragType: null,
  }),

  startTouchDrag: (type, position) => set({
    touchDragType: type,
    touchDragPosition: position,
    hasDraggedFromButton: false,
  }),

  updateTouchDrag: (position) => set({
    touchDragPosition: position,
    hasDraggedFromButton: true,
  }),

  endTouchDrag: () => set({
    touchDragType: null,
    touchDragPosition: null,
    hasDraggedFromButton: false,
  }),

  // Helper to check if currently touch dragging
  isTouchDragging: () => {
    const { touchDragType } = get();
    return touchDragType !== null;
  },

  // Logging control
  toggleDebugLogging: () => set((state) => ({ 
    debugLogging: !state.debugLogging 
  })),

  setDebugLogging: (enabled) => set({ debugLogging: enabled }),

  // Debug logging utility
  debugLog: (category, message, data = {}) => {
    const { debugLogging } = get();
    if (debugLogging) {
      const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
      console.log(`[${timestamp}] [${category}] ${message}`, data);
    }
  },
}));