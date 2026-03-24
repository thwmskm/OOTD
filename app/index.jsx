import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { FB_auth } from "../database/firebase";

//Index.jsx is used as an user authenticator at launch to route user to either login or home screen
const AuthGate = () => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FB_auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return unsubscribe;
  }, []);

  if (user === undefined) return null;

  return user ? (
    <Redirect href="/(tabs)" />
  ) : (
    <Redirect href="/(screens)/(authentication)" />
  );
};

export default AuthGate;
