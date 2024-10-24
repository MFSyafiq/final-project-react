import { createContext } from "react";
import { useState } from "react";

export const userContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: "1",
    name: "John Doe",
    email: "asdasd@gmail.com",
  });

  const handleChangeName = (param) => {
    setUser({
      ...user,
      name: param,
    });
  };
  return (
    <userContext.Provider value={{ user, handleChangeName }}>
      {children}
    </userContext.Provider>
  );
};
