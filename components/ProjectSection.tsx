'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useProjects } from "@/contexts/ProjectContext";
import { FolderIcon, PlusCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

// Update the getLastUpdatedText function to show days ago
const getLastUpdatedText = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  } catch {
    return '';
  }
};

export default function ProjectSection() {
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [newProjectDescription, setNewProjectDescription] = useState<string>('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const { projects, loading, fetchProjects } = useProjects();
  const router = useRouter();

  const navigateToContent = (projectId: string) => {
    router.push(`/content?projectId=${projectId}`);
  };

  const createProject = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      // Implement project creation logic here with description
      // After successful creation:
      await fetchProjects(); // Refresh the projects list
      setIsCreateDialogOpen(false);
      setNewProjectName('');
      setNewProjectDescription('');
    } catch (error) {
      console.error('Error creating project:', error);
    }
  }, [newProjectName, fetchProjects]);

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {loading && <Loader />}
      <div className="p-8 md:p-12">
        <div className="w-full max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Your Projects</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage and organize your content across different projects
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-6 bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <FolderIcon className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {projects.length}
                    </p>
                  </div>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <DocumentTextIcon className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Contents</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {projects.reduce((sum, project) => sum + (project.content_count || 0), 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div 
              className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden hover:border-green-200"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-lg mb-4 group-hover:bg-green-100 transition-colors">
                  <PlusCircleIcon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-green-600 transition-colors">New Project</h3>
                <p className="mt-2 text-sm text-gray-500">Create something amazing</p>
              </div>
            </div>

            {projects.map((project) => (
              <div 
                key={project.id} 
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden hover:border-indigo-200"
                onClick={() => navigateToContent(project.id.toString())}
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                      <FolderIcon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                      <DocumentTextIcon className="w-4 h-4 text-indigo-600" />
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                    {project.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {project.description || 'No description provided'}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      Last updated {getLastUpdatedText(project.updated_at)}
                    </p>
                    <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                      {project.content_count} content{project.content_count !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isCreateDialogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-8 pt-8 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-indigo-50 rounded-xl">
                  <FolderIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Create New Project</h2>
                  <p className="text-sm text-gray-500 mt-1">Add a new project to organize your content</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={createProject} className="px-8 py-6">
              <div className="space-y-5">
                <div>
                  <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name
                  </label>
                  <input
                    id="projectName"
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Enter a name for your project"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                             text-gray-900 text-sm placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-indigo-500/20 
                             focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    id="projectDescription"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="Describe what this project is about"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                             text-gray-900 text-sm placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-indigo-500/20 
                             focus:border-indigo-500 transition-colors"
                    rows={3}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                <Button 
                  type="button" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 
                           text-gray-700 text-sm font-medium rounded-xl transition-colors"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 
                           text-white text-sm font-medium rounded-xl 
                           transition-colors flex items-center gap-2"
                >
                  <PlusCircleIcon className="w-4 h-4" />
                  Create Project
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
