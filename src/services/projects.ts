import { supabase } from '../lib/supabase';
import { fetchRepositories } from './github';

export const syncProjects = async () => {
  try {
    const repos = await fetchRepositories();

    for (const repo of repos) {
      // Check if project already exists
      const { data: existing, error: queryError } = await supabase
        .from('projects')
        .select()
        .eq('github_id', repo.id)
        .single();

      if (queryError && queryError.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
        throw queryError;
      }

      if (!existing) {
        const { error: insertError } = await supabase
          .from('projects')
          .insert({
            github_id: repo.id,
            name: repo.name,
            description: repo.description,
            url: repo.url,
            status: 'open',
            created_at: new Date().toISOString(),
            updated_at: repo.updatedAt,
            language: repo.language,
            stars: repo.stars
          });

        if (insertError) throw insertError;
      }
    }

    return repos;
  } catch (error) {
    console.error('Error syncing projects:', error);
    throw error;
  }
};

export const getProjects = async () => {
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*');

    if (error) throw error;
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};