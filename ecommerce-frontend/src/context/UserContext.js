import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() =>{ // Datos del usuario autenticado
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser):null;
  })
  const [token, setToken] = useState(()=>{
    return localStorage.getItem("access")||null;
  }) // Token JWT

  //actualizar el localstorge cuando se ccambie el user
  const handleSetUser = (userData) =>{
    if (userData){
      localStorage.setItem("user",JSON.stringify(userData));
    }else{
      localStorage.removeItem("user");
    }
    setUser(userData);
  }
  //actualizar localstorage cuando se cambie de token
  const handleSetToken = (newToken)=>{
    if(newToken){
      localStorage.setItem("access", newToken);
    }else{
      localStorage.removeItem("access");
    }
    setToken(newToken);
  };
  //Cerrar sesion eliminando todos los datos de localstorage con una sola llamda
  const logout=()=>{
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);

  };

  return (
    <UserContext.Provider value={{ user, setUser:handleSetUser, token, setToken:handleSetToken, logout}}>
      {children}
    </UserContext.Provider>
  );
};