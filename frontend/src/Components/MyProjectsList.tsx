import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProjects } from '../api/projects';
import { Project, Tag } from '../types/project';

const MyProjectsList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getMyProjects(); // Use the correct API call
        if (response.status === 'success') {
          setProjects(Array.isArray(response.data) ? response.data : []);
        } else {
          setError(response.message || 'Failed to load your projects');
          setProjects([]);
        }
      } catch (err: any) {
        setError(err.response?.data?.detail || err.message || 'Error loading your projects');
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyProjects();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        <span className="ml-3 text-gray-400">Loading your projects...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 text-center">
        <p className="text-gray-400 mb-4">You haven't uploaded any projects yet.</p>
        <button
          onClick={() => navigate('/upload')}
          className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-300"
        >
          Upload Your First Project
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-gray-950 rounded-lg overflow-hidden ring-1 ring-gray-700 hover:ring-2 hover:ring-purple-300 transition cursor-pointer flex flex-col"
          onClick={() => navigate(`/project/${project.id}`)}
        >
          {/* Display first image or placeholder */}
           <div className="aspect-video bg-gray-800 flex items-center justify-center text-gray-500">
             {project.images && project.images.length > 0 ? (
                <img
                  src={project.images[0]}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
             ) : (
                <span>No Image</span>
             )}
           </div>
          <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-bold mb-2 text-white truncate">{project.title}</h3>
            <p className="text-gray-400 line-clamp-2 mb-4 flex-grow">{project.description}</p>
            <div className="mt-auto pt-4 border-t border-gray-700 flex items-center justify-between">
              {/* Display Tags */}
              <div className="flex flex-wrap gap-1">
                {project.tags && project.tags.length > 0 ? (
                  project.tags.slice(0, 2).map((tag) => ( // Show max 2 tags
                    <span key={tag.id} className="inline-block px-2 py-0.5 text-xs font-medium ring-1 ring-purple-400 bg-purple-900/30 text-purple-300 rounded-full">
                      {tag.tag_name}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-500 italic">No tags</span>
                )}
                 {project.tags && project.tags.length > 2 && (
                      <span className="text-xs text-gray-500">+{project.tags.length - 2}</span>
                   )}
              </div>
              <span className="text-sm text-gray-500">
                {new Date(project.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyProjectsList;