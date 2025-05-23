import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import api from "../services/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function parseJwt(token) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(b64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) {
      const u = parseJwt(t);
      if (u) {
        api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
        setUser(u);
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    Cookies.set("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const u = parseJwt(token);
    if (u) {
      setUser(u);
      setIsLoggedIn(true);
      router.push("/dashboard");
    } else {
      alert("Invalid token");
    }
  };

  const handleLogout = (token) => {
    localStorage.removeItem("token");
    Cookies.set("token", token);
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, handleLogin, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
