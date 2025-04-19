import { 
  db, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp
} from './firebase';

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  ACTIVITIES: 'activities',
  INVITATIONS: 'invitations'
};

// Generic CRUD operations for Firestore

// Create or update a document with a specified ID
export async function setDocument(collectionName: string, id: string, data: any) {
  const docRef = doc(db, collectionName, id);
  await setDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
  return { id, ...data };
}

// Create a new document with auto-generated ID
export async function createDocument(collectionName: string, data: any) {
  const id = data.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  return await setDocument(collectionName, id, { ...data, id, createdAt: serverTimestamp() });
}

// Get a document by ID
export async function getDocument(collectionName: string, id: string) {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    throw new Error(`Document not found in ${collectionName} with ID ${id}`);
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw error;
  }
}

// Update a document
export async function updateDocument(collectionName: string, id: string, data: any) {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    
    // Get the updated document to return
    const updatedDoc = await getDoc(docRef);
    return { id, ...updatedDoc.data() };
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
}

// Delete a document
export async function deleteDocument(collectionName: string, id: string) {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
}

// Query documents
export async function queryDocuments(collectionName: string, conditions: any[] = [], sortOptions: any[] = []) {
  try {
    let queryRef: any = collection(db, collectionName);
    
    // Add where conditions if any
    if (conditions.length > 0) {
      queryRef = query(queryRef, ...conditions);
    }
    
    // Add sort options if any
    if (sortOptions.length > 0) {
      queryRef = query(queryRef, ...sortOptions);
    }
    
    const querySnapshot = await getDocs(queryRef);
    const documents: any[] = [];
    
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    
    return documents;
  } catch (error) {
    console.error(`Error querying documents from ${collectionName}:`, error);
    throw error;
  }
}