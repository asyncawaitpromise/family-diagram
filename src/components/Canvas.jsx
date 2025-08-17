import { Stage, Layer } from 'react-konva';
import { useState } from 'react';
import Shape from './Shape';
import SelectionBorder from './SelectionBorder';
import Connection from './Connection';
import AreaSelectionRect from './AreaSelectionRect';
import { useShapeConnections } from '../hooks/useShapeConnections';

const Canvas = ({
  stageRef,
  stageSize,
  stageScale,
  stageX,
  stageY,
  isPanning,
  shapes,
  selectedId,
  selectedIds,
  isMultiSelectMode,
  onStageMove,
  onStageEnd,
  onWheel,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onDrop,
  onDragOver,
  onShapeSelect,
  onShapePositionUpdate,
  onMultiShapePositionUpdate,
  onDeleteSelected,
  connections,
  selectedConnectionId,
  onConnectionSelect,
  onConnectionDelete
}) => {
  const selectedShape = shapes.find(shape => shape.id === selectedId);
  const [selectedShapeDragPosition, setSelectedShapeDragPosition] = useState(null);
  const [multiShapeDragPositions, setMultiShapeDragPositions] = useState({});
  const { handleDragStart, handleDragEnd } = useShapeConnections();

  return (
    <Stage
      ref={stageRef}
      width={stageSize.width}
      height={stageSize.height}
      scaleX={stageScale}
      scaleY={stageScale}
      x={stageX}
      y={stageY}
      draggable={false}
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <Layer>
        {/* Render connections first so they appear behind shapes */}
        {connections && connections.map(connection => {
          const fromShape = shapes.find(s => s.id === connection.fromId);
          const toShape = shapes.find(s => s.id === connection.toId);
          return (
            <Connection
              key={connection.id}
              connection={connection}
              fromShape={fromShape}
              toShape={toShape}
              draggedShapeId={selectedId}
              dragPosition={selectedShapeDragPosition}
              multiShapeDragPositions={multiShapeDragPositions}
              isSelected={connection.id === selectedConnectionId}
              onSelect={onConnectionSelect}
              onDelete={onConnectionDelete}
            />
          );
        })}
        
        {shapes.map(shape => {
          const isShapeSelected = shape.id === selectedId || (selectedIds && selectedIds.includes(shape.id));
          const dragPosition = multiShapeDragPositions[shape.id] || (shape.id === selectedId ? selectedShapeDragPosition : null);
          
          return (
            <Shape
              key={shape.id}
              shape={shape}
              displayShape={{
                ...shape,
                x: dragPosition ? dragPosition.x : shape.x,
                y: dragPosition ? dragPosition.y : shape.y
              }}
              isSelected={isShapeSelected}
              onSelect={onShapeSelect}
              onPositionUpdate={onShapePositionUpdate}
              onMultiShapePositionUpdate={onMultiShapePositionUpdate}
              onDragMove={shape.id === selectedId && !isMultiSelectMode ? setSelectedShapeDragPosition : undefined}
              onMultiDragMove={setMultiShapeDragPositions}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              selectedIds={selectedIds}
              isMultiSelectMode={isMultiSelectMode}
              allShapes={shapes}
            />
          );
        })}
        
        {selectedShape && !isMultiSelectMode && (
          <SelectionBorder
            shape={selectedShape}
            dragPosition={selectedShapeDragPosition}
            onDelete={onDeleteSelected}
          />
        )}
        
        {isMultiSelectMode && selectedIds && selectedIds.map(id => {
          const shape = shapes.find(s => s.id === id);
          const dragPosition = multiShapeDragPositions[id];
          return shape ? (
            <SelectionBorder
              key={id}
              shape={{
                ...shape,
                x: dragPosition ? dragPosition.x : shape.x,
                y: dragPosition ? dragPosition.y : shape.y
              }}
              dragPosition={dragPosition}
              onDelete={onDeleteSelected}
            />
          ) : null;
        })}
        
        <AreaSelectionRect />
      </Layer>
    </Stage>
  );
};

export default Canvas;