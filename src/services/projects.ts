import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { fetchRepositories } from './github';

export const syncProjects = async () => {
  try {
    const repos = await fetchRepositories();
    const projectsRef = collection(db, 'projects');

    for (const repo of repos) {
      const q = query(projectsRef, where('githubId', '==', repo.id));
      const existing = await getDocs(q);

      if (existing.empty) {
        await addDoc(projectsRef, {
          githubId: repo.id,
          name: repo.name,
          description: repo.description,
          url: repo.url,
          status: 'open',
          createdAt: new Date().toISOString(),
          updatedAt: repo.updatedAt,
          language: repo.language,
          stars: repo.stars
        });
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
    const projectsRef = collection(db, 'projects');
    const snapshot = await getDocs(projectsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};