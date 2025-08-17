import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CANVAS_CONFIG } from '../constants/canvas';
import { useCanvasStore } from './canvasStore';

export const usePersistedShapeStore = create(
  persist(
    (set, get) => ({
      shapes: [],
      connections: [],
      selectedId: null,
      selectedConnectionId: null,
      selectedIds: [], // Multi-select state
      isMultiSelectMode: false,

      // Actions
      addShape: (type, x = null, y = null) => {
        // Get stage size from canvas store
        const canvasState = useCanvasStore.getState();
        const size = canvasState.stageSize;
        
        const newShape = {
          id: Date.now().toString(),
          type,
          x: x !== null ? x : Math.random() * (size.width - 100) + 50,
          y: y !== null ? y : Math.random() * (size.height - 100) + 50,
          fill: CANVAS_CONFIG.SHAPES.DEFAULT_FILL,
          draggable: false,
        };
        
        set((state) => ({
          shapes: [...state.shapes, newShape],
          selectedId: newShape.id,
        }));
      },

      selectShape: (id) => set({ selectedId: id, selectedConnectionId: null, selectedIds: [], isMultiSelectMode: false }),

      selectConnection: (id) => set({ selectedConnectionId: id, selectedId: null, selectedIds: [], isMultiSelectMode: false }),

      deselectAll: () => set({ selectedId: null, selectedConnectionId: null, selectedIds: [], isMultiSelectMode: false }),

      // Multi-select actions
      setMultiSelect: (ids) => set({ 
        selectedIds: ids, 
        isMultiSelectMode: ids.length > 1,
        selectedId: ids.length === 1 ? ids[0] : null,
        selectedConnectionId: null
      }),

      addToMultiSelect: (id) => set((state) => {
        const newIds = state.selectedIds.includes(id) 
          ? state.selectedIds.filter(existingId => existingId !== id)
          : [...state.selectedIds, id];
        return {
          selectedIds: newIds,
          isMultiSelectMode: newIds.length > 1,
          selectedId: newIds.length === 1 ? newIds[0] : null,
          selectedConnectionId: null
        };
      }),

      clearMultiSelect: () => set({ selectedIds: [], isMultiSelectMode: false }),

      deleteSelected: () => set((state) => {
        if (state.isMultiSelectMode && state.selectedIds.length > 0) {
          return {
            shapes: state.shapes.filter(shape => !state.selectedIds.includes(shape.id)),
            selectedIds: [],
            isMultiSelectMode: false,
            selectedId: null,
          };
        }
        if (state.selectedId) {
          return {
            shapes: state.shapes.filter(shape => shape.id !== state.selectedId),
            selectedId: null,
          };
        }
        if (state.selectedConnectionId) {
          return {
            connections: state.connections.filter(conn => conn.id !== state.selectedConnectionId),
            selectedConnectionId: null,
          };
        }
        return state;
      }),

      updateShapePosition: (id, newPos) => {
        const state = get();
        const shape = state.shapes.find(s => s.id === id);
        
        // Always log to console for debugging
        console.log('STORE updateShapePosition called', { id, newPos, shapeFound: !!shape });
        
        // Get debug logging function
        const debugLog = () => {
          try {
            const { debugLog: logFn } = require('./interactionStore').useInteractionStore.getState();
            return logFn;
          } catch {
            return () => {}; // Fallback if store not available
          }
        };
        
        if (shape) {
          debugLog()('SHAPE_POSITION_UPDATE', `Shape ${id} position updated in store`, {
            shapeId: id,
            oldPosition: { x: shape.x, y: shape.y },
            newPosition: newPos,
            delta: { x: newPos.x - shape.x, y: newPos.y - shape.y }
          });
        }
        
        set((state) => ({
          shapes: state.shapes.map(shape => 
            shape.id === id ? { ...shape, x: newPos.x, y: newPos.y } : shape
          ),
        }));
      },

      updateMultiShapePositions: (positions) => {
        set((state) => ({
          shapes: state.shapes.map(shape => {
            const newPos = positions[shape.id];
            return newPos ? { ...shape, x: newPos.x, y: newPos.y } : shape;
          }),
        }));
      },

      getSelectedShape: () => {
        const { shapes, selectedId } = get();
        return shapes.find(shape => shape.id === selectedId);
      },

      getSelectedConnection: () => {
        const { connections, selectedConnectionId } = get();
        return connections.find(conn => conn.id === selectedConnectionId);
      },

      addConnection: (fromId, toId) => {
        const newConnection = {
          id: Date.now().toString(),
          fromId,
          toId,
        };
        
        set((state) => ({
          connections: [...state.connections, newConnection],
        }));
      },

      removeConnection: (id) => set((state) => ({
        connections: state.connections.filter(conn => conn.id !== id),
      })),

      clearAll: () => set({ shapes: [], connections: [], selectedId: null }),

      setShapes: (shapes) => set({ shapes, selectedId: null }),

      setConnections: (connections) => set({ connections }),
    }),
    {
      name: 'family-diagram-shapes',
      partialize: (state) => ({ shapes: state.shapes, connections: state.connections }), // Only persist shapes and connections, not selectedId
    }
  )
);