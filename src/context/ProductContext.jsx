import { createContext, useState } from "react";

export const productContext = createContext();

export const ProductProvider = ({ children }) => {
  const [length, setLength ] = useState([]);

  return (
    <productContext.Provider value={{ length, setLength }}>
      {children}
    </productContext.Provider>
  );
};
