'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Header } from "@/components/dashboard/header";
import { Loader } from "@/components/ui/loader";
import { useProjects } from "@/contexts/ProjectContext";

export default function ProjectSection() {
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const { projects, loading, fetchProjects } = useProjects();
  const router = useRouter();

  const navigateToContent = (projectId: string) => {
    router.push(`/content?projectId=${projectId}`);
  };

  const createProject = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement project creation logic here
    // After creation, call fetchProjects() to update the global state
  }, [newProjectName, fetchProjects]);

  return (
    <div className="flex-1">
      <Header showSearch={false} />
      {loading && <Loader />}
      <div className="p-10">
        <div className="w-full max-w-3xl mx-auto">
          <h1 className="text-xl font-semibold mb-6 text-indigo-600">Your Projects</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div 
              className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <span className="text-base font-medium text-gray-600">+ Create Project</span>
            </div>
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="aspect-square bg-white border rounded-lg shadow flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigateToContent(project.id.toString())}
              >
                <h2 className="text-base font-medium text-center text-gray-600">{project.name}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isCreateDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-4/5 h-1/3.5 max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Project</h2>
            <form onSubmit={createProject}>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter project name"
                className="w-full p-2 border rounded mb-4"
                required
              />
              <div className="flex justify-end gap-3 mt-9">
                <Button type="button" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Create Project</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
