import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useDiagramStore = create(
  persist(
    (set, get) => ({
      diagrams: [],
      currentDiagramId: null,

      // Actions
      createDiagram: (name) => {
        const newDiagram = {
          id: Date.now().toString(),
          name: name.trim() || 'Untitled Diagram',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          shapes: [],
          connections: [],
          canvasState: {
            stageX: 0,
            stageY: 0,
            stageScale: 1,
          },
        };
        
        set((state) => ({
          diagrams: [...state.diagrams, newDiagram],
          currentDiagramId: newDiagram.id,
        }));
        
        return newDiagram.id;
      },

      deleteDiagram: (id) => {
        set((state) => ({
          diagrams: state.diagrams.filter(diagram => diagram.id !== id),
          currentDiagramId: state.currentDiagramId === id ? null : state.currentDiagramId,
        }));
      },

      updateDiagramShapes: (diagramId, shapes) => {
        set((state) => ({
          diagrams: state.diagrams.map(diagram =>
            diagram.id === diagramId
              ? { ...diagram, shapes, updatedAt: new Date().toISOString() }
              : diagram
          ),
        }));
      },

      updateDiagramConnections: (diagramId, connections) => {
        set((state) => ({
          diagrams: state.diagrams.map(diagram =>
            diagram.id === diagramId
              ? { ...diagram, connections, updatedAt: new Date().toISOString() }
              : diagram
          ),
        }));
      },

      updateDiagramCanvasState: (diagramId, canvasState) => {
        set((state) => ({
          diagrams: state.diagrams.map(diagram =>
            diagram.id === diagramId
              ? { ...diagram, canvasState, updatedAt: new Date().toISOString() }
              : diagram
          ),
        }));
      },

      setCurrentDiagram: (id) => {
        set({ currentDiagramId: id });
      },

      getCurrentDiagram: () => {
        const { diagrams, currentDiagramId } = get();
        return diagrams.find(diagram => diagram.id === currentDiagramId);
      },

      getDiagramById: (id) => {
        const { diagrams } = get();
        return diagrams.find(diagram => diagram.id === id);
      },
    }),
    {
      name: 'family-diagram-diagrams',
    }
  )
);