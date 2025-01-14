import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/dist/components/arcgis-zoom";
import React, { useState } from "react";
import ArcGISMapComponent from "./ArcgisMap";

interface Location {
  _id: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  type: string;
  description?: string;
  website?: string;
  address?: string;
  contact_email?: string;
  phone?: string;
  events?: string[];
}

const Map: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  return (
    <>
      <ArcGISMapComponent onLocationSelect={setSelectedLocation} />
      <div className="bg-light p-2">
        Apasă pe o locație pentru a vedea detaliile
      </div>
    </>
  );
};

export default Map;
