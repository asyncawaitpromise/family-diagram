import { useState, useRef } from 'react';
import { Stage, Layer, Circle, Rect, Star, Transformer, Line } from 'react-konva';
import { Plus, Square, Circle as CircleIcon, Star as StarIcon, X } from 'react-feather';

const Home = () => {
  const [shapes, setShapes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [stageSize, setStageSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const trRef = useRef();
  const stageRef = useRef();

  // Handle window resize
  const handleResize = () => {
    setStageSize({ width: window.innerWidth, height: window.innerHeight });
  };

  // Add shape to canvas
  const addShape = (type) => {
    const newShape = {
      id: Date.now().toString(),
      type,
      x: Math.random() * (stageSize.width - 100) + 50,
      y: Math.random() * (stageSize.height - 100) + 50,
      fill: '#3b82f6',
      draggable: true,
    };
    setShapes([...shapes, newShape]);
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

  // Render shape based on type
  const renderShape = (shape) => {
    const commonProps = {
      key: shape.id,
      id: shape.id,
      x: shape.x,
      y: shape.y,
      fill: shape.fill,
      draggable: true,
      onClick: () => selectShape(shape.id),
      onTap: () => selectShape(shape.id),
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
    <div className="w-screen h-screen relative overflow-hidden">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-10 bg-base-100 shadow-lg rounded-lg p-2 flex gap-2">
        <button
          className="btn btn-primary btn-sm"
          onClick={() => addShape('circle')}
        >
          <CircleIcon size={16} />
        </button>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => addShape('rect')}
        >
          <Square size={16} />
        </button>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => addShape('star')}
        >
          <StarIcon size={16} />
        </button>
        {selectedId && (
          <button
            className="btn btn-error btn-sm ml-2"
            onClick={deleteSelected}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Canvas */}
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
      >
        <Layer>
          {shapes.map(renderShape)}
          
          {/* Selection border */}
          {selectedShape && (
            <Rect
              x={selectedShape.x - 35}
              y={selectedShape.y - 35}
              width={70}
              height={70}
              stroke="#ef4444"
              strokeWidth={2}
              dash={[5, 5]}
              fill="transparent"
              listening={false}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default Home;