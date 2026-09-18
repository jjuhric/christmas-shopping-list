import { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, db } from '../firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, collection, getDocs, limit, query } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUninvited, setIsUninvited] = useState(false);

  function loginWithGoogle() {
    return signInWithPopup(auth, googleProvider);
  }

  function loginWithEmail(email, password) {
    return signInWithEmailAndPassword(auth, email.toLowerCase().trim(), password);
  }

  async function activateEmailAccount(email, password) {
    const cleanEmail = email.toLowerCase().trim();
    // If invited, this just creates the Auth credential for their existing
    // Firestore profile. If not invited, onAuthStateChanged will set them up
    // as the admin of a brand-new family.
    return createUserWithEmailAndPassword(auth, cleanEmail, password);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email.toLowerCase().trim());
  }

  function logout() {
    setUserProfile(null);
    setIsUninvited(false);
    return signOut(auth);
  }

  useEffect(() => {
    let unsubscribeDoc = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user && user.email) {
        const email = user.email.toLowerCase().trim();
        const userRef = doc(db, 'users', email);

        try {
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            // Check if ANY users exist in the entire collection
            const q = query(collection(db, 'users'), limit(1));
            const allUsersSnap = await getDocs(q);

            const isFirstEverUser = allUsersSnap.empty;
            // No invite found for this email: they become the admin of a
            // brand-new family of their own (the very first user in the
            // whole system is additionally granted cross-family Master Admin).
            const newFamilyAdmin = {
              id: email,
              name: user.displayName || '',
              email: email,
              photoURL: user.photoURL || '',
              familyId: '',
              role: isFirstEverUser ? 'master' : 'admin',
              isAdmin: true,
              isMaster: isFirstEverUser,
              isManaged: false,
              setupComplete: false,
              wishlist: [],
              recipientId: null,
              purchasedMembers: {},
              hasSignedIn: true,
              createdAt: Date.now()
            };
            await setDoc(userRef, newFamilyAdmin);
            setUserProfile(newFamilyAdmin);
            setIsUninvited(false);
          } else {
            setIsUninvited(false);
            // First time this invited member has actually signed in - only
            // members who have done this are eligible for the draw.
            if (!userSnap.data().hasSignedIn) {
              try {
                await updateDoc(userRef, { hasSignedIn: true, firstSignInAt: Date.now() });
              } catch (err) {
                console.warn("Could not record first sign-in:", err);
              }
            }
          }

          // Set up real-time listener for current user's profile
          unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
              setUserProfile({ id: docSnap.id, ...docSnap.data() });
              setIsUninvited(false);
            }
          });
        } catch (err) {
          console.error("Auth state handling error:", err);
        }
      } else {
        setUserProfile(null);
        setIsUninvited(false);
      }

      setLoading(false);
    });

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  const isMasterAdmin = userProfile?.isMaster === true || userProfile?.role === 'master';
  const isFamilyAdmin = userProfile?.isAdmin === true || isMasterAdmin;

  const value = {
    currentUser,
    userProfile,
    isMasterAdmin,
    isAdmin: isFamilyAdmin,
    isUninvited,
    loading,
    loginWithGoogle,
    loginWithEmail,
    activateEmailAccount,
    resetPassword,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
