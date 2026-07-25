import React, { createContext, useState } from "react";

export const PlantContext = createContext();

export const PlantProvider = ({ children }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [plantData, setPlantData] = useState(null);
  const [savedPlants, setSavedPlants] = useState([]);

  const savePlant = (plant) => {
    setSavedPlants((prev) => [...prev, plant]);
  };

  return (
    <PlantContext.Provider
      value={{
        selectedImage,
        setSelectedImage,

        plantData,
        setPlantData,

        savedPlants,
        savePlant,
      }}
    >
      {children}
    </PlantContext.Provider>
  );
};