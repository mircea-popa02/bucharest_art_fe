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

      <div className="details-section mt-4">
        {selectedLocation ? (
          <div>
            <h2>{selectedLocation.name}</h2>
            <p>{selectedLocation.description}</p>
            {selectedLocation.address && (
              <p>
                <strong>Adresa:</strong> {selectedLocation.address}
              </p>
            )}
            {selectedLocation.phone && (
              <p>
                <strong>Telefon:</strong> {selectedLocation.phone}
              </p>
            )}
            {selectedLocation.contact_email && (
              <p>
                <strong>Email:</strong> {selectedLocation.contact_email}
              </p>
            )}
            {selectedLocation.website && (
              <a
                href={selectedLocation.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                Website
              </a>
            )}
            {selectedLocation.events && selectedLocation.events.length > 0 && (
              <ul>
                {selectedLocation.events.map((event, index) => (
                  <li key={index}>{event}</li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <h1>Selectați o locație pentru a vedea detaliile</h1>
        )}
      </div>
    </>
  );
};

export default Map;
