import { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, getDocs, getDoc, setDoc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Profile, Settings, defaultQuestions } from '../db';

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[] | undefined>(undefined);

  useEffect(() => {
    const q = query(collection(db, 'profiles'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Profile[];
      setProfiles(data);
    }, (error) => {
      console.error("Error fetching profiles:", error);
      setProfiles([]);
    });

    return () => unsubscribe();
  }, []);

  return profiles;
}

export function useProfile(id: string | undefined) {
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      setProfile(null);
      return;
    }

    const docRef = doc(db, 'profiles', id);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setProfile({ id: docSnap.id, ...docSnap.data() } as Profile);
      } else {
        setProfile(null);
      }
    }, (error) => {
      console.error("Error fetching profile:", error);
      setProfile(null);
    });

    return () => unsubscribe();
  }, [id]);

  return profile;
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | undefined>(undefined);

  useEffect(() => {
    const docRef = doc(db, 'settings', 'global');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings({ id: docSnap.id, ...docSnap.data() } as Settings);
      } else {
        // Initialize default settings if they don't exist
        const defaultSettings = { questions: defaultQuestions };
        setDoc(docRef, defaultSettings).catch(console.error);
        setSettings({ id: 'global', ...defaultSettings } as Settings);
      }
    }, (error) => {
      console.error("Error fetching settings:", error);
      setSettings({ id: 'global', questions: defaultQuestions });
    });

    return () => unsubscribe();
  }, []);

  return settings;
}

// Helper functions for mutations
export const addProfile = async (profile: Omit<Profile, 'id'>) => {
  return await addDoc(collection(db, 'profiles'), profile);
};

export const updateProfile = async (id: string, profile: Partial<Profile>) => {
  return await updateDoc(doc(db, 'profiles', id), profile);
};

export const deleteProfile = async (id: string) => {
  return await deleteDoc(doc(db, 'profiles', id));
};

export const updateSettings = async (settings: Partial<Settings>) => {
  return await setDoc(doc(db, 'settings', 'global'), settings, { merge: true });
};
