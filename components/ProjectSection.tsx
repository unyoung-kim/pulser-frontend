'use client';

import { useState, useEffect } from 'react';
import { useClerk, useUser, useOrganization } from "@clerk/nextjs";
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Header } from "@/components/dashboard/header";
import { Loader } from "@/components/ui/loader";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface Project {
  id: number;
  name: string;
  user_id: string;
  org_id: string;
}

export default function ProjectSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state
  const { signOut } = useClerk();
  const { user } = useUser();
  const { organization } = useOrganization();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!user || !organization) return;

    const supabase = createClient(supabaseUrl, supabaseKey);
    setSupabase(supabase);
    fetchProjects(supabase);
  }, [user, organization]);

  const fetchProjects = async (supabaseClient: SupabaseClient) => {
    setLoading(true); // Set loading to true before fetching
    try {
      const { data, error } = await supabaseClient
        .from('Project')
        .select('*')
        .eq('org_id', organization?.id.replace(/^eq\./, '')); // Remove 'eq.' prefix

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || !user || !organization || !supabase) return;

    setLoading(true); // Set loading to true before creating
    try {
      const { data, error } = await supabase
        .from('Project')
        .insert([{ 
          name: newProjectName, 
          clerk_user_id: user.id,
          org_id: organization.id
        }])
        .select();

      if (error) throw error;

      setProjects([...projects, data[0] as Project]);
      setNewProjectName('');
      setIsCreateDialogOpen(false);
      router.push('/content');
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setLoading(false); // Set loading to false after creating
    }
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header showSearch={false} onSignOut={handleSignOut} />
      {loading && <Loader />}
      <div className="flex-1 p-10">
        <div className="w-full max-w-3xl mx-auto">
          <h1 className="text-xl font-semibold mb-6 text-indigo-600">Your Projects</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div 
              className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <span className="text-base font-medium text-gray-600">+ Create Project</span>
            </div>
            {projects.map((project: Project) => (
              <div 
                key={project.id} 
                className="aspect-square bg-white border rounded-lg shadow flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push('/content')} // Navigate to /content when clicked
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
