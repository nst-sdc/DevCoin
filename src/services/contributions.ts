import { db } from './firebase';
import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { fetchUserContributions } from './github';

export const addContribution = async (contribution: any) => {
  try {
    const contributionRef = await addDoc(collection(db, 'contributions'), {
      ...contribution,
      timestamp: new Date().toISOString(),
    });

    // Update member's total coins
    const memberRef = doc(db, 'members', contribution.memberId);
    const memberDoc = await getDoc(memberRef);
    
    if (memberDoc.exists()) {
      const currentCoins = memberDoc.data().devCoins || 0;
      await updateDoc(memberRef, {
        devCoins: currentCoins + contribution.coins,
      });
    }

    return contributionRef.id;
  } catch (error) {
    console.error('Error adding contribution:', error);
    throw error;
  }
};

export const syncGithubContributions = async (memberId: string, githubUsername: string) => {
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