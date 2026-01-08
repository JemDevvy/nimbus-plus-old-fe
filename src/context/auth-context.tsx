import { useState, useEffect, useContext } from "react";
import { AuthContext } from "./auth-context-value";
import type { User } from "./auth-context-value";

function decodeToken(token: string): Partial<User> | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return {
      userId: Number(decoded.userId),
      name: decoded.name || "",
      role: decoded.role || "",
    };
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessTokenState, setAccessTokenState] = useState<string | null>(null);

  // Custom setter to sync localStorage
  const setAccessToken = (token: string | null) => {
    setAccessTokenState(token);
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      const decoded = decodeToken(token);
      if (decoded && decoded.userId) {
        setUser({ userId: decoded.userId, name: decoded.name || "", role: decoded.role || "" });
      }
    }
    if (token && !accessTokenState) {
      setAccessTokenState(token);
    }
  }, [user, accessTokenState]);

  return (
    <AuthContext.Provider value={{ user, setUser, accessToken: accessTokenState, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


