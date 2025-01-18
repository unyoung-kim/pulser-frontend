'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOrganization, useUser } from '@clerk/nextjs';
import { DocumentTextIcon, FolderIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { useProjects } from '@/contexts/ProjectContext';
// import { createClient } from '@supabase/supabase-js';
import { getLastUpdatedText } from '@/lib/date';
import { supabase } from '@/lib/supabaseClient';

export default function ProjectSection() {
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [newProjectDescription, setNewProjectDescription] = useState<string>('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const { projects, loading, fetchProjects } = useProjects();
  const { user } = useUser();
  const { organization } = useOrganization();
  const router = useRouter();

  const navigateToContent = useCallback(
    (projectId: string) => {
      router.push(`/content?projectId=${projectId}`);
    },
    [router]
  );

  const navigateToBackground = useCallback(
    (projectId: string) => {
      router.push(`/background?projectId=${projectId}`);
    },
    [router]
  );

  const createProject = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newProjectName.trim() || !user || !organization) return;

      try {
        const { data, error } = await supabase
          .from('Project')
          .insert([
            {
              name: newProjectName,
              description: newProjectDescription,
              clerk_user_id: user.id,
              org_id: organization.id,
            },
          ])
          .order('updated_at', { ascending: false })
          .select();

        if (error) throw error;

        await fetchProjects(); // Refresh the projects list
        setIsCreateDialogOpen(false);
        setNewProjectName('');
        setNewProjectDescription('');

        if (data?.[0]) {
          router.push(`/tutorial?projectId=${data[0].id}`);
        }
      } catch (error) {
        console.error('Error creating project:', error);
      }
    },
    [newProjectName, newProjectDescription, fetchProjects, navigateToBackground, user, organization]
  );

  return (
    <div className="min-h-screen flex-1 bg-gray-50">
      {loading && <Loader />}
      <div className="p-8 md:p-12">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Your Projects</h1>
                <p className="text-muted-foreground">
                  Manage and organize your content across different projects
                </p>
              </div>
              <div className="mt-4 flex items-center space-x-6 rounded-xl border border-gray-100 bg-white px-6 py-3 shadow-sm md:mt-0">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
                    <FolderIcon className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                      Projects
                    </p>
                    <p className="text-lg font-semibold text-gray-900">{projects.length}</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
                    <DocumentTextIcon className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                      Contents
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {projects.reduce((sum, project) => sum + (project.content_count || 0), 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div
              className="group cursor-pointer overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-green-200 hover:shadow-md"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <div className="flex h-full flex-col p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 transition-colors group-hover:bg-green-100">
                  <PlusCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-900 transition-colors group-hover:text-green-600">
                  New Project
                </h3>
                <p className="mt-2 text-sm text-gray-500">Create something amazing</p>
              </div>
            </div>

            {projects.map((project) => (
              <div
                key={project.id}
                className="group cursor-pointer overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-md"
                onClick={() => navigateToBackground(project.id.toString())}
              >
                <div className="flex h-full flex-col p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 transition-colors group-hover:bg-indigo-100">
                      <FolderIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 transition-colors group-hover:bg-indigo-100">
                      <DocumentTextIcon className="h-4 w-4 text-indigo-600" />
                    </div>
                  </div>
                  <h3 className="truncate font-medium text-gray-900 transition-colors group-hover:text-indigo-600">
                    {project.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                    {project.description || 'No description provided'}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      Last updated {getLastUpdatedText(project.updated_at)}
                    </p>
                    <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-sm font-medium text-indigo-600">
                      {project.content_count} content
                      {project.content_count !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isCreateDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="border-b border-gray-100 px-8 pb-6 pt-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                  <FolderIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Create New Project</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Add a new project to organize your content
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={createProject} className="px-8 py-6">
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="projectName"
                    className="mb-2 block text-sm font-bold text-gray-700"
                  >
                    Company Name
                  </label>
                  <input
                    id="projectName"
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Name of the company you are doing SEO for"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="projectDescription"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Description <span className="text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    id="projectDescription"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="Describe what this project is about"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    rows={3}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">
                <Button
                  type="button"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  <PlusCircleIcon className="h-4 w-4" />
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
