import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setUser(user);
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            // Auto-repair/Lazy-init: Create a default profile if missing
            const defaultData = {
              username: user.displayName || user.email?.split('@')[0] || 'Scholar',
              email: user.email || '',
              totalQuizzes: 0,
              avgScore: 0,
              createdAt: new Date().toISOString(),
              lastActivity: new Date().toISOString()
            };
            await setDoc(doc(db, 'users', user.uid), defaultData);
            setUserData(defaultData);
          }
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return { user, userData, loading };
}
