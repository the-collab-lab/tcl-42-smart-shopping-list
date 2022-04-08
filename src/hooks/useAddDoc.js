import { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function useAddDoc() {
  const [id, setID] = useState(null);
  const [error, setError] = useState(null);
  
  try {
      const colRef = collection(db, "users");
      const docRef = await addDoc(colRef, {
        item: itemName,
      });
      setID(docRef.id)
      console.log('success');
    } catch (e) {
      setError(e);
    }

  return { id, error };
}
