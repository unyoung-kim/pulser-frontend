import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { projectId, background } = await request.json();

  if (!projectId) {
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
  }

  try {
    // First, check if the project exists
    const { data: projectData, error: checkError } = await supabase
      .from('Project')
      .select('id')
      .eq('id', projectId)
      .single();

    if (checkError) {
      console.error('Error checking project existence:', checkError);
      return NextResponse.json({ error: 'Failed to verify project existence' }, { status: 500 });
    }

    if (!projectData) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // If the project exists, proceed with the update
    // Ensure the background data is properly formatted as JSON
    const { data, error } = await supabase
      .from('Project')
      .update({ background: JSON.stringify(background) })
      .eq('id', projectId);

    if (error) throw error;

    return NextResponse.json({ message: 'Background updated successfully', data });
  } catch (error) {
    console.error('Error updating background:', error);
    return NextResponse.json({ error: 'Failed to update background' }, { status: 500 });
  }
}
