import { useEffect, useState, useRef } from "react";
import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/dist/components/arcgis-zoom";
import { ArcgisMap, ArcgisZoom } from "@arcgis/map-components-react";
import Graphic from "@arcgis/core/Graphic";
import MapView from "@arcgis/core/views/MapView";

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

const Map = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const mapRef = useRef<MapView | null>(null);

  // Fetch locations from the backend
  useEffect(() => {
    fetch("/api/gallery")
      .then((response) => response.json())
      .then((data) => setLocations(data))
      .catch((error) => console.error("Error fetching locations:", error));
  }, []);

  // Add graphics to the map when locations are loaded
  useEffect(() => {
    if (locations.length === 0 || !mapRef.current) return;

    locations.forEach((location) => {
      const point: __esri.PointProperties = {
        longitude: location.coordinates.longitude,
        latitude: location.coordinates.latitude,
      };

      const graphic = new Graphic({
        geometry: point,
        attributes: location,
        popupTemplate: {
          title: "{name}",
          content: `
            <p><strong>Type:</strong> {type}</p>
            <p><strong>Description:</strong> {description}</p>
            <p><strong>Address:</strong> {address}</p>
            <p><strong>Contact Email:</strong> {contact_email}</p>
            <p><strong>Phone:</strong> {phone}</p>
            <p><a href="{website}" target="_blank">Website</a></p>
          `,
        },
      });

      mapRef?.current?.graphics.add(graphic);
    });
  }, [locations]);

  return (
    <ArcgisMap
      itemId="d5dda743788a4b0688fe48f43ae7beb9"
      onArcgisViewReadyChange={(event: CustomEvent) => {
        mapRef.current = event.detail.view;
        console.log("MapView ready", event);
      }}
    >
      <ArcgisZoom position="top-left"></ArcgisZoom>
    </ArcgisMap>
  );
};

export default Map;
