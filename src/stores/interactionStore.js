import { create } from 'zustand';

export const useInteractionStore = create((set, get) => ({
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
}));