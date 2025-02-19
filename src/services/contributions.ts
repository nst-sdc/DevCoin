import { supabase } from '../lib/supabase';
import { fetchUserContributions } from './github';

export const addContribution = async (contribution: any) => {
  try {
    // Add contribution
    const { data: contributionData, error: contributionError } = await supabase
      .from('contributions')
      .insert({
        ...contribution,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (contributionError) throw contributionError;

    // Update user's dev coins
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .update({ 
        dev_coins: contribution.dev_coins_earned 
      })
      .eq('id', contribution.user_id)
      .select()
      .single();

    if (userError) throw userError;

    return contributionData.id;
  } catch (error) {
    console.error('Error adding contribution:', error);
    throw error;
  }
};

export const syncGithubContributions = async (userId: string, githubUsername: string) => {
  try {
    const contributions = await fetchUserContributions(githubUsername);
    
    // Get existing contributions to avoid duplicates
    const existingQuery = query(
      collection(db, 'contributions'),
      where('memberId', '==', memberId),
      where('type', '==', 'PR')
    );
    const existingDocs = await getDocs(existingQuery);
    const existingPRs = new Set(existingDocs.docs.map(doc => doc.data().prId));

    // Add new contributions
    for (const contribution of contributions) {
      if (!existingPRs.has(contribution.id)) {
        await addContribution({
          ...contribution,
          memberId,
          prId: contribution.id,
        });
      }
    }

    return contributions;
  } catch (error) {
    console.error('Error syncing GitHub contributions:', error);
    throw error;
  }
};