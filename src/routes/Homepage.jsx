import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiagramStore } from '../stores/diagramStore';

const Homepage = () => {
  const navigate = useNavigate();
  const { diagrams, createDiagram, deleteDiagram } = useDiagramStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDiagramName, setNewDiagramName] = useState('');

  const handleCreateDiagram = () => {
    if (newDiagramName.trim()) {
      const diagramId = createDiagram(newDiagramName);
      setNewDiagramName('');
      setShowCreateModal(false);
      navigate(`/diagram/${diagramId}`);
    }
  };

  const handleOpenDiagram = (diagramId) => {
    navigate(`/diagram/${diagramId}`);
  };

  const handleDeleteDiagram = (e, diagramId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this diagram?')) {
      deleteDiagram(diagramId);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Family Diagrams</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Create New Diagram
          </button>
        </div>

        {diagrams.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h2 className="text-xl font-medium text-gray-600 mb-2">No diagrams yet</h2>
            <p className="text-gray-500 mb-6">Create your first family diagram to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Create Your First Diagram
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diagrams.map((diagram) => (
              <div
                key={diagram.id}
                onClick={() => handleOpenDiagram(diagram.id)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 truncate pr-2">
                    {diagram.name}
                  </h3>
                  <button
                    onClick={(e) => handleDeleteDiagram(e, diagram.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete diagram"
                  >
                    ×
                  </button>
                </div>
                
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Created: {formatDate(diagram.createdAt)}</p>
                  <p>Updated: {formatDate(diagram.updatedAt)}</p>
                  <p>{diagram.shapes?.length || 0} shapes</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Diagram Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
              <h2 className="text-xl font-bold mb-4">Create New Diagram</h2>
              <input
                type="text"
                value={newDiagramName}
                onChange={(e) => setNewDiagramName(e.target.value)}
                placeholder="Enter diagram name"
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateDiagram();
                  }
                }}
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewDiagramName('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDiagram}
                  disabled={!newDiagramName.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded font-medium transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;