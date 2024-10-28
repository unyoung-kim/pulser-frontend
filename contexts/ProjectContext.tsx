'use client';  // Add this line at the top of the file

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useUser, useOrganization } from "@clerk/nextjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export interface Project {
  id: number;
  name: string;
  user_id: string;
  org_id: string;
}

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  fetchProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoaded: isUserLoaded } = useUser();
  const { organization, isLoaded: isOrgLoaded } = useOrganization();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  const fetchProjects = useCallback(async () => {
    if (!supabase || !organization) {
      console.log('Supabase or organization not available');
      return;
    }
    setLoading(true);
    try {
      console.log('Fetching projects for organization:', organization.id);
      const { data, error } = await supabase
        .from('Project')
        .select('*')
        .eq('org_id', organization.id);

      if (error) throw error;
      console.log('Fetched projects:', data);
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase, organization]);

  useEffect(() => {
    if (isUserLoaded && isOrgLoaded && user && organization) {
      console.log('User and organization loaded, initializing Supabase');
      const supabaseInstance = createClient(supabaseUrl, supabaseKey);
      setSupabase(supabaseInstance);
    }
  }, [isUserLoaded, isOrgLoaded, user, organization]);

  useEffect(() => {
    if (supabase && organization) {
      console.log('Supabase and organization available, fetching projects');
      fetchProjects();
    }
  }, [supabase, organization, fetchProjects]);

  return (
    <ProjectContext.Provider value={{ projects, loading, fetchProjects }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
