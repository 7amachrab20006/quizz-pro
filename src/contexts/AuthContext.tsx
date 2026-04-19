import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  userData: any | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      // Cleanup previous doc listener
      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = null;
      }

      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Use a persistent listener for user data
        unsubscribeDoc = onSnapshot(doc(db, 'users', firebaseUser.uid), 
          (docSnap) => {
            if (docSnap.exists()) {
              setUserData(docSnap.data());
              setLoading(false);
            } else {
              // Lazy-init record
              const defaultData = {
                username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Scholar',
                email: firebaseUser.email || '',
                totalQuizzes: 0,
                avgScore: 0,
                createdAt: new Date().toISOString(),
                lastActivity: new Date().toISOString()
              };
              setDoc(doc(db, 'users', firebaseUser.uid), defaultData)
                .then(() => {
                   // Success will trigger onSnapshot again
                })
                .catch(err => {
                  console.error("Failed to create user record:", err);
                  setLoading(false);
                });
            }
          },
          (err) => {
            console.error("User data subscription error:", err);
            setLoading(false);
          }
        );
      } else {
        setUser(null);
        setUserData(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
