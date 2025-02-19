import { supabase } from '../lib/supabase';
import type { User } from '../types/auth';

export const makeAdmin = async (userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: true })
      .eq('id', userId);

    if (error) throw error;
  } catch (error: any) {
    throw new Error('Failed to update user role');
  }
};

export const approveContribution = async (contributionId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('contributions')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString()
      })
      .eq('id', contributionId);

    if (error) throw error;
  } catch (error: any) {
    throw new Error('Failed to approve contribution');
  }
};

export const assignProject = async (projectId: string, userId: string): Promise<void> => {
  try {
    // Check if project is already assigned
    const { data: project, error: queryError } = await supabase
      .from('projects')
      .select('assigned_to')
      .eq('id', projectId)
      .single();

    if (queryError) throw queryError;

    if (project?.assigned_to === userId) {
      throw new Error('User is already assigned to this project');
    }

    const { error: updateError } = await supabase
      .from('projects')
      .update({
        assigned_to: userId,
        assigned_at: new Date().toISOString(),
        status: 'assigned'
      })
      .eq('id', projectId);

    if (updateError) throw updateError;
  } catch (error: any) {
    throw new Error('Failed to assign project');
  }
};