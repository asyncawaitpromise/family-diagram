import { useState, useRef } from 'react';
import { Stage, Layer, Circle, Rect, Star, Transformer, Line } from 'react-konva';
import { Plus, Square, Circle as CircleIcon, Star as StarIcon, X } from 'react-feather';

const Home = () => {
  const [shapes, setShapes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [stageSize, setStageSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState(null);
  const trRef = useRef();
  const stageRef = useRef();

  // Handle window resize
  const handleResize = () => {
    setStageSize({ width: window.innerWidth, height: window.innerHeight });
  };

  // Add shape to canvas
  const addShape = (type, x = null, y = null) => {
    const newShape = {
      id: Date.now().toString(),
      type,
      x: x !== null ? x : Math.random() * (stageSize.width - 100) + 50,
      y: y !== null ? y : Math.random() * (stageSize.height - 100) + 50,
      fill: '#3b82f6',
      draggable: false,
    };
    setShapes([...shapes, newShape]);
    setSelectedId(newShape.id);
  };

  // Handle drag start from toolbar
  const handleToolbarDragStart = (type) => {
    setIsDragging(true);
    setDragType(type);
  };

  // Handle drop on canvas
  const handleCanvasDrop = (e) => {
    if (isDragging && dragType) {
      const stage = e.target.getStage();
      const pointerPosition = stage.getPointerPosition();
      addShape(dragType, pointerPosition.x, pointerPosition.y);
      setIsDragging(false);
      setDragType(null);
    }
  };

  // Handle drag over canvas
  const handleCanvasDragOver = (e) => {
    e.preventDefault();
  };

  // Select shape
  const selectShape = (id) => {
    setSelectedId(id);
  };

  // Deselect when clicking empty area
  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  // Delete selected shape
  const deleteSelected = () => {
    if (selectedId) {
      setShapes(shapes.filter(shape => shape.id !== selectedId));
      setSelectedId(null);
    }
  };

  // Update shape position
  const updateShapePosition = (id, newPos) => {
    setShapes(shapes.map(shape => 
      shape.id === id ? { ...shape, x: newPos.x, y: newPos.y } : shape
    ));
  };

  // Handle drag move for live updates
  const handleDragMove = (id, newPos) => {
    setShapes(shapes.map(shape => 
      shape.id === id ? { ...shape, x: newPos.x, y: newPos.y } : shape
    ));
  };

  // Render shape based on type
  const renderShape = (shape) => {
    const isSelected = shape.id === selectedId;
    const commonProps = {
      key: shape.id,
      id: shape.id,
      x: shape.x,
      y: shape.y,
      fill: shape.fill,
      draggable: isSelected,
      onClick: () => selectShape(shape.id),
      onTap: () => selectShape(shape.id),
      onDragMove: (e) => handleDragMove(shape.id, e.target.position()),
      onDragEnd: (e) => updateShapePosition(shape.id, e.target.position()),
    };

    switch (shape.type) {
      case 'circle':
        return <Circle {...commonProps} radius={30} />;
      case 'rect':
        return <Rect {...commonProps} width={60} height={60} />;
      case 'star':
        return <Star {...commonProps} numPoints={5} innerRadius={20} outerRadius={30} />;
      default:
        return null;
    }
  };

  const selectedShape = shapes.find(shape => shape.id === selectedId);

  return (
    <div className="w-screen h-screen max-h-[100svh] relative overflow-hidden">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-10 bg-base-100 shadow-lg rounded-lg p-2 flex gap-2">
        <button
          className="btn btn-primary btn-sm"
          onClick={() => addShape('circle')}
          draggable
          onDragStart={() => handleToolbarDragStart('circle')}
        >
          <CircleIcon size={16} />
        </button>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => addShape('rect')}
          draggable
          onDragStart={() => handleToolbarDragStart('rect')}
        >
          <Square size={16} />
        </button>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => addShape('star')}
          draggable
          onDragStart={() => handleToolbarDragStart('star')}
        >
          <StarIcon size={16} />
        </button>
      </div>

      {/* Canvas */}
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
        onDrop={handleCanvasDrop}
        onDragOver={handleCanvasDragOver}
      >
        <Layer>
          {shapes.map(renderShape)}
          
          {/* Selection border and delete button */}
          {selectedShape && (
            <>
              <Rect
                x={selectedShape.type === 'rect' ? selectedShape.x - 35 : selectedShape.x - 35}
                y={selectedShape.type === 'rect' ? selectedShape.y - 35 : selectedShape.y - 35}
                width={selectedShape.type === 'rect' ? 130 : 70}
                height={selectedShape.type === 'rect' ? 130 : 70}
                stroke="#ef4444"
                strokeWidth={2}
                dash={[5, 5]}
                fill="transparent"
                listening={false}
              />
              <Circle
                x={selectedShape.type === 'rect' ? selectedShape.x + 95 : selectedShape.x + 35}
                y={selectedShape.type === 'rect' ? selectedShape.y - 35 : selectedShape.y - 35}
                radius={12}
                fill="#ef4444"
                stroke="white"
                strokeWidth={2}
                onClick={deleteSelected}
                onTap={deleteSelected}
              />
              <Line
                points={[
                  (selectedShape.type === 'rect' ? selectedShape.x + 95 : selectedShape.x + 35) - 6, 
                  selectedShape.y - 35 - 6,
                  (selectedShape.type === 'rect' ? selectedShape.x + 95 : selectedShape.x + 35) + 6, 
                  selectedShape.y - 35 + 6
                ]}
                stroke="white"
                strokeWidth={2}
                listening={false}
              />
              <Line
                points={[
                  (selectedShape.type === 'rect' ? selectedShape.x + 95 : selectedShape.x + 35) + 6, 
                  selectedShape.y - 35 - 6,
                  (selectedShape.type === 'rect' ? selectedShape.x + 95 : selectedShape.x + 35) - 6, 
                  selectedShape.y - 35 + 6
                ]}
                stroke="white"
                strokeWidth={2}
                listening={false}
              />
            </>
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default Home;