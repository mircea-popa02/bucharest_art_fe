import React, { useRef, useEffect, useState } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import TextSymbol from '@arcgis/core/symbols/TextSymbol';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import './ArcgisMap.css';
import { Toast, Button } from 'react-bootstrap';

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

interface ArcGISMapComponentProps {
  onLocationSelect: (location: Location | null) => void;
}

const ArcGISMapComponent: React.FC<ArcGISMapComponentProps> = ({ onLocationSelect }) => {
  const mapDiv = useRef<HTMLDivElement | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const mapRef = useRef<MapView | null>(null);

  const [showToast, setShowToast] = useState(false);

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoom += 1;
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoom -= 1;
    }
  };

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
          basemap: 'topo-vector',
        });

        view = new MapView({
          container: mapDiv.current || undefined,
          map: map,
          center: [26.1025, 44.4268],
          zoom: 12,
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

    const view = mapRef.current;

    locations.forEach((location) => {
      const point = new Point({
        longitude: location.coordinates.longitude,
        latitude: location.coordinates.latitude,
      });

      const markerSymbol = new SimpleMarkerSymbol({
        style: 'circle',
        color: 'white',
        outline: {
          color: 'black',
          width: 2,
        },
      });

      const pointGraphic = new Graphic({
        geometry: point,
        symbol: markerSymbol,
        attributes: location,
      });

      const textSymbol = new TextSymbol({
        text: location.name,
        color: "black",
        xoffset: 0,
        yoffset: 16,
        font: {
          size: 12,
          family: "sans-serif",
        },
      });

      const labelGraphic = new Graphic({
        geometry: point,
        symbol: textSymbol,
      });

      view.graphics.add(pointGraphic);
      view.graphics.add(labelGraphic);
    });

    view.on("click", async (event) => {
      const response = await view.hitTest(event);

      if (response.results.length > 0) {
        const graphic = response.results.find(
          (result) => result?.graphic.attributes
        )?.graphic;

        if (graphic) {
          const location = graphic.attributes as Location;
          setSelectedLocation(location);
          setShowToast(true);
          onLocationSelect(location);
        }
      }
    });

    view.on("pointer-move", async (event) => {
      const response = await view.hitTest(event);
      const cursor = response.results.length > 0 ? "pointer" : "default";
      view.container.style.cursor = cursor;
    });
  }, [locations, onLocationSelect]);

  return (
    <div style={{ position: 'relative', height: '75vh', width: '100%' }}>
      <div ref={mapDiv} style={{ height: '100%', width: '100%' }} />
      <div className='map-controls d-flex flex-column gap-2'>
        <Button variant="secondary" onClick={handleZoomIn}>
          +
        </Button>
        <Button variant="secondary" onClick={handleZoomOut}>
          -
        </Button>
      </div>
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        className="details-container border rounded"
        animation
      >
        {selectedLocation?.name && (
          <>
            <Toast.Header>
              <strong className="me-auto">{selectedLocation.name}</strong>
            </Toast.Header>
            <Toast.Body>
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
            </Toast.Body>
          </>
        )}
      </Toast>
    </div>
  );
};

export default ArcGISMapComponent;
