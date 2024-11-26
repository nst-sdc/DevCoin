import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import type { User } from '../types/auth';

export const makeAdmin = async (userId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      role: 'admin'
    });
  } catch (error: any) {
    throw new Error('Failed to update user role');
  }
};

export const approveContribution = async (contributionId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'contributions', contributionId), {
      status: 'approved',
      approvedAt: new Date().toISOString()
    });
  } catch (error: any) {
    throw new Error('Failed to approve contribution');
  }
};

export const assignProject = async (projectId: string, userId: string): Promise<void> => {
  try {
    const assignmentRef = collection(db, 'project_assignments');
    const q = query(assignmentRef, 
      where('projectId', '==', projectId),
      where('userId', '==', userId)
    );
    
    const existing = await getDocs(q);
    if (!existing.empty) {
      throw new Error('User is already assigned to this project');
    }

    await updateDoc(doc(db, 'projects', projectId), {
      assignedTo: userId,
      assignedAt: new Date().toISOString(),
      status: 'assigned'
    });
  } catch (error: any) {
    throw new Error('Failed to assign project');
  }
};