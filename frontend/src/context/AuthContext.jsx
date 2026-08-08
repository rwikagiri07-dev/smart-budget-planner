import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";


const AuthContext =
  createContext();


export function AuthProvider({ children }) {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    checkAuth();

  }, []);


  const checkAuth = async () => {

    const token =
      localStorage.getItem("token");


    if (!token) {

      setLoading(false);

      return;

    }


    try {

      const { data } =
        await api.get(
          "/auth/profile"
        );


      setUser(
        data.user || data
      );

    } catch (error) {

      localStorage.removeItem(
        "token"
      );

      setUser(null);

    } finally {

      setLoading(false);

    }

  };


  const login = async (
    email,
    password
  ) => {

    const { data } =
      await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );


    localStorage.setItem(
      "token",
      data.token
    );


    setUser(
      data.user
    );


    return data;

  };


  const register = async (
    name,
    email,
    password
  ) => {

    const { data } =
      await api.post(
        "/auth/register",
        {
          name,
          email,
          password,
        }
      );


    return data;

  };


  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    setUser(null);

  };


  return (

    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}


export function useAuth() {

  return useContext(
    AuthContext
  );

}