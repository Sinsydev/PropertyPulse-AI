import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, isFirebaseReady } from "../lib/firebase";

export function useAuth() {
  const isReady = isFirebaseReady && Boolean(auth);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isReady);

  useEffect(() => {
    if (!isReady || !auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isReady]);

  return { user, loading, isFirebaseReady };
}
