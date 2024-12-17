import React, { useRef, useEffect, useState } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import TextSymbol from '@arcgis/core/symbols/TextSymbol';

const ArcGISMapComponent: React.FC = () => {
  const mapDiv = useRef<HTMLDivElement | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const mapRef = useRef<MapView | null>(null);

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

  useEffect(() => {
    fetch("http://localhost:3000/gallery")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched locations:", data);
        setLocations(data);
      })
      .catch((error) => console.error("Error fetching locations:", error));
  }, []);

  useEffect(() => {
    let view: MapView | undefined;

    async function initializeMap() {
      try {
        const map = new Map({
          basemap: 'topo-vector' 
        });

        view = new MapView({
          container: mapDiv.current || undefined,
          map: map,
          center: [26.1025, 44.4268], 
          zoom: 10
        });

        mapRef.current = view;
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    }

    initializeMap();

    return () => {
      if (view) {
        view.destroy(); 
      }
    };
  }, []);

  useEffect(() => {
    if (locations.length === 0 || !mapRef.current) {
      console.log("No locations or map view not initialized");
      return;
    }

    locations.forEach((location) => {
      const point = new Point({
        longitude: location.coordinates.longitude,
        latitude: location.coordinates.latitude,
      });

      const pointGraphic = new Graphic({
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

      const textSymbol = new TextSymbol({
        text: location.name,
        color: "black",
        haloColor: "white",
        haloSize: "1px",
        xoffset: 3,
        yoffset: 3,
        font: {
          size: 12,
          family: "sans-serif",
          weight: "bold"
        }
      });

      const labelGraphic = new Graphic({
        geometry: point,
        symbol: textSymbol
      });

      console.log("Adding graphic:", pointGraphic);
      mapRef.current?.graphics.add(pointGraphic);
      mapRef.current?.graphics.add(labelGraphic);
    });
  }, [locations]);

  return (
    <div ref={mapDiv} style={{ height: '400px', width: '100%' }} />
  );
};

export default ArcGISMapComponent;