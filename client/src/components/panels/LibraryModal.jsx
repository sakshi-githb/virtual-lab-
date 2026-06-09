import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  FolderOpen, 
  Database, 
  Calendar, 
  Compass, 
  Search,
  AlertCircle
} from 'lucide-react';

const LibraryModal = ({ isOpen, onClose, onLoad, showNotification }) => {
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch experiments list from DB
  const fetchExperiments = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch('/api/experiments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to retrieve experiments list');
      }

      const data = await response.json();
      setExperiments(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchExperiments();
    }
  }, [isOpen]);

  // Handle experiment deletion
  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Avoid triggering card click
    
    if (!window.confirm("Are you sure you want to delete this saved physics layout? This action is permanent.")) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/experiments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete experiment');
      }

      showNotification('Experiment deleted successfully', 'success');
      // Refresh list
      fetchExperiments();
    } catch (err) {
      console.error(err);
      showNotification(err.message, 'error');
    }
  };

  if (!isOpen) return null;

  // Filtered experiments by search query
  const filteredExperiments = experiments.filter(exp => 
    exp.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-xs select-none animate-in fade-in duration-100">
      <div className="w-full max-w-3xl bg-white border-4 border-charcoal shadow-brutal-xl relative flex flex-col max-h-[85vh] overflow-hidden rounded-none animate-in fade-in zoom-in-95 duration-100">
        
        {/* Header */}
        <div className="bg-brutalBlue text-white border-b-4 border-charcoal p-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-white animate-pulse" />
            <h2 className="font-black text-xl uppercase tracking-tight text-white">
              📂 Saved Experiment Library
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="border-3 border-charcoal bg-white p-1 hover:bg-neutral-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shadow-brutal-sm cursor-pointer"
          >
            <X className="w-5 h-5 text-charcoal" />
          </button>
        </div>

        {/* Search Input Section */}
        <div className="bg-neutral-50 border-b-2 border-charcoal p-4 flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 h-5 text-charcoal/40" />
            </div>
            <input
              type="text"
              placeholder="Search experiments by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-3 border-charcoal font-mono text-sm font-bold bg-white text-charcoal placeholder-charcoal/40 focus:outline-none shadow-brutal-sm focus:-translate-x-[1px] focus:-translate-y-[1px] focus:shadow-brutal transition-all duration-75"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-cream flex flex-col gap-4">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-4 border-brutalBlue border-t-transparent rounded-full animate-spin"></div>
              <span className="font-mono text-xs font-bold text-charcoal/60 uppercase">
                Loading saved layouts from cloud...
              </span>
            </div>
          ) : error ? (
            <div className="border-3 border-charcoal bg-brutalRed/10 p-4 flex items-start gap-3 shadow-brutal-sm">
              <AlertCircle className="w-6 h-6 text-brutalRed flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <h4 className="font-extrabold text-sm uppercase text-brutalRed">Error Retrieving Library</h4>
                <p className="font-mono text-xs text-charcoal/80 mt-1">{error}</p>
                <button 
                  onClick={fetchExperiments}
                  className="mt-3 btn-brutal bg-white text-xs px-2.5 py-1 uppercase font-bold"
                >
                  Retry Fetch
                </button>
              </div>
            </div>
          ) : filteredExperiments.length === 0 ? (
            <div className="py-16 text-center border-4 border-dashed border-charcoal/20 bg-white/50 p-6">
              <FolderOpen className="w-12 h-12 text-charcoal/20 mx-auto mb-3" />
              <h3 className="font-black text-base uppercase text-charcoal/60">
                {searchQuery ? "No matches found" : "No saved layouts in library"}
              </h3>
              <p className="font-mono text-xs text-charcoal/50 mt-1 max-w-md mx-auto">
                {searchQuery 
                  ? "Adjust your search filters to find matching titles." 
                  : "Save your active canvas configuration in the workspace page, and it will list here for persistent cloud backup!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredExperiments.map((exp) => {
                const boxCount = exp.bodies.filter(b => b.shapeType === 'box').length;
                const circleCount = exp.bodies.filter(b => b.shapeType === 'circle').length;
                const polyCount = exp.bodies.filter(b => b.shapeType === 'polygon').length;

                return (
                  <div 
                    key={exp._id}
                    className="card-brutal bg-white p-4 flex flex-col justify-between relative hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-brutal transition-all duration-75 text-left"
                  >
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-black text-base uppercase tracking-tight text-charcoal truncate pr-2" title={exp.title}>
                          {exp.title}
                        </h3>
                        <span className="font-mono text-[9px] font-bold bg-neutral-200 border-2 border-charcoal px-1.5 py-0.5 rounded-none flex-shrink-0">
                          {exp.gravityY}G
                        </span>
                      </div>

                      {exp.description && (
                        <p className="text-xs text-charcoal/70 line-clamp-2">
                          {exp.description}
                        </p>
                      )}

                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-charcoal/60 mt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(exp.createdAt).toLocaleDateString(undefined, { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}</span>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2 font-mono text-[9px] font-bold">
                        <span className="bg-brutalYellow/20 text-yellow-800 border border-yellow-400 px-1.5 py-0.5">
                          {exp.bodies.length} Bodies
                        </span>
                        {boxCount > 0 && (
                          <span className="bg-neutral-100 text-neutral-600 border border-neutral-300 px-1.5 py-0.5">
                            {boxCount} Boxes
                          </span>
                        )}
                        {circleCount > 0 && (
                          <span className="bg-brutalBlue/10 text-brutalBlue border border-blue-300 px-1.5 py-0.5">
                            {circleCount} Circles
                          </span>
                        )}
                        {polyCount > 0 && (
                          <span className="bg-brutalRed/10 text-brutalRed border border-red-300 px-1.5 py-0.5">
                            {polyCount} Polys
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2.5 mt-4 border-t-2 border-dashed border-charcoal/20 pt-3 flex-shrink-0">
                      <button
                        onClick={() => onLoad(exp)}
                        className="btn-brutal bg-brutalGreen text-white text-[11px] py-1.5 px-3 flex-1 flex items-center justify-center gap-1.5 uppercase font-extrabold tracking-wider"
                      >
                        <Compass className="w-4 h-4" />
                        <span>Load Layout</span>
                      </button>
                      <button
                        onClick={(e) => handleDelete(exp._id, e)}
                        className="btn-brutal bg-brutalRed text-white text-[11px] py-1.5 px-2.5 hover:bg-red-600 active:bg-red-700"
                        title="Delete Experiment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-cream border-t-4 border-charcoal p-4 flex justify-between items-center flex-shrink-0">
          <span className="text-[10px] font-bold font-mono text-charcoal/60 uppercase">
            CLOUD DATABASE PERSISTENCE ACTIVE
          </span>
          <button
            onClick={fetchExperiments}
            className="btn-brutal bg-white text-charcoal text-[11px] py-1.5 px-3 uppercase font-extrabold"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default LibraryModal;
