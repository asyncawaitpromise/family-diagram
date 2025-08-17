import { Stage, Layer } from 'react-konva';
import { useState } from 'react';
import Shape from './Shape';
import SelectionBorder from './SelectionBorder';
import Connection from './Connection';
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
  onDeleteSelected,
  connections
}) => {
  const selectedShape = shapes.find(shape => shape.id === selectedId);
  const [selectedShapeDragPosition, setSelectedShapeDragPosition] = useState(null);
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
            />
          );
        })}
        
        {shapes.map(shape => (
          <Shape
            key={shape.id}
            shape={shape}
            isSelected={shape.id === selectedId}
            onSelect={onShapeSelect}
            onPositionUpdate={onShapePositionUpdate}
            onDragMove={shape.id === selectedId ? setSelectedShapeDragPosition : undefined}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        ))}
        
        {selectedShape && (
          <SelectionBorder
            shape={selectedShape}
            dragPosition={selectedShapeDragPosition}
            onDelete={onDeleteSelected}
          />
        )}
      </Layer>
    </Stage>
  );
};

export default Canvas;