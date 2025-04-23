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
export async function getDocument<T extends { id: string }>(collectionName: string, id: string): Promise<T> {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const docData = docSnap.data();
      return docData ? { id: docSnap.id, ...docData } as T : { id: docSnap.id } as T;
    }
    throw new Error(`Document not found in ${collectionName} with ID ${id}`);
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw error;
  }
}

// Update a document
export async function updateDocument<T extends { id: string }>(collectionName: string, id: string, docData: any): Promise<T> {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...docData,
      updatedAt: serverTimestamp()
    });
    
    // Get the updated document to return
    const updatedDoc = await getDoc(docRef);
    const fetchedData = updatedDoc.data();
    return fetchedData ? { id, ...fetchedData } as T : { id } as T;
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
export async function queryDocuments<T extends { id: string }>(
  collectionName: string, 
  conditions: any[] = [], 
  sortOptions: any[] = []
): Promise<T[]> {
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
    const documents: T[] = [];
    
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      documents.push(docData ? { id: doc.id, ...docData } as T : { id: doc.id } as T);
    });
    
    return documents;
  } catch (error) {
    console.error(`Error querying documents from ${collectionName}:`, error);
    throw error;
  }
}