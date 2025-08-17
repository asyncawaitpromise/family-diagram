import { Square, Circle as CircleIcon, Star as StarIcon } from 'react-feather';

const Toolbar = ({ onAddShape, onToolbarDragStart, onToolbarTouchStart }) => {
  const buttons = [
    { type: 'circle', icon: CircleIcon },
    { type: 'rect', icon: Square },
    { type: 'star', icon: StarIcon }
  ];

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 bg-base-100 shadow-lg rounded-lg p-2 flex gap-2">
      {buttons.map(({ type, icon: Icon }) => (
        <button
          key={type}
          className="btn btn-primary btn-sm"
          onClick={() => onAddShape(type)}
          draggable
          onDragStart={() => onToolbarDragStart(type)}
          onTouchStart={(e) => onToolbarTouchStart(type, e)}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
};

export default Toolbar;