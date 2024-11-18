"use client"; // Add this line at the top of the file

import { supabase } from "@/lib/supabaseClient";
import { useOrganization, useUser } from "@clerk/nextjs";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export interface Project {
  id: number;
  name: string;
  description: string;
  user_id: string;
  org_id: string;
  created_at: string;
  updated_at: string;
  content_count: number;
}

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  fetchProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoaded: isUserLoaded } = useUser();
  const { organization, isLoaded: isOrgLoaded } = useOrganization();
  // const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  const fetchProjects = useCallback(async () => {
    if (!supabase || !organization) {
      console.log("Supabase or organization not available");
      return;
    }
    setLoading(true);
    try {
      // console.log("Fetching projects for organization:", organization.id);

      // First get all projects
      const { data: projectsData, error: projectsError } = await supabase
        .from("Project")
        .select("*")
        .eq("org_id", organization.id);

      if (projectsError) throw projectsError;

      // Then get content counts for each project
      const promises =
        projectsData?.map(async (project) => {
          const { count, error } = await supabase
            .from("Content")
            .select("*", { count: "exact", head: true })
            .eq("project_id", project.id);

          return {
            ...project,
            content_count: count || 0,
          };
        }) || [];

      const projectsWithCount = await Promise.all(promises);

      // Sort projects by content count in descending order
      const sortedProjects = projectsWithCount.sort(
        (a, b) =>
          b.content_count - a.content_count || // First sort by content count
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime() // Then by creation date if counts are equal
      );

      console.log("Fetched and sorted projects:", sortedProjects);
      setProjects(sortedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase, organization]);

  useEffect(() => {
    if (isUserLoaded && isOrgLoaded && user && organization) {
      // console.log('User and organization loaded, initializing Supabase');
      // const supabaseInstance = createClient(supabaseUrl, supabaseKey);
      // setSupabase(supabaseInstance);
    }
  }, [isUserLoaded, isOrgLoaded, user, organization]);

  useEffect(() => {
    if (supabase && organization) {
      console.log("Supabase and organization available, fetching projects");
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
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
};
