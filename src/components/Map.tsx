import React, { useState, useEffect, useCallback } from "react";
import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/dist/components/arcgis-zoom";
import { ArcgisMap, ArcgisZoom } from "@arcgis/map-components-react";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { Geometry } from "@arcgis/core/geometry";
import { SimpleMarkerSymbol } from "@arcgis/core/symbols";
import { PopupTemplate } from "@arcgis/core/PopupTemplate";
import { Point } from "@arcgis/core/geometry";
import MapView from "@arcgis/core/views/MapView";

// Interface for location data
interface LocationData {
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

// Type for the CustomEvent detail from ArcgisMap
interface ArcgisViewReadyEventDetail {
  view: MapView;
}

interface MapProps {}

// React component
const Map: React.FC<MapProps> = () => {
  const [view, setView] = useState<MapView | null>(null);
  const [graphicsLayer, setGraphicsLayer] = useState<GraphicsLayer | null>(null);

  const fetchLocations = useCallback(async (): Promise<LocationData[]> => {
    const response = await fetch("http://localhost:3000/gallery");
    if (!response.ok) {
      throw new Error("Failed to fetch locations");
    }
    const data = await response.json();
    return data;
  }, []);

  const addLocationsToMap = useCallback(
    (locations: LocationData[]) => {
      if (!graphicsLayer || !view) return;

      const newGraphics = locations.map((loc) => {
        const geometry: Geometry = new Point({
          longitude: loc.coordinates.longitude,
          latitude: loc.coordinates.latitude
        });

        const symbol: SimpleMarkerSymbol = {
          type: "simple-marker",
          style: "circle",
          color: "blue",
          size: "8px",
          outline: {
            color: "white",
            width: 1
          }
        };

        const popupTemplate: PopupTemplate = {
          title: "{name}",
          content: `
            <b>Type:</b> {type}<br/>
            <b>Description:</b> {description}<br/>
            <b>Address:</b> {address}<br/>
            <b>Website:</b> <a href="{website}" target="_blank">{website}</a><br/>
            <b>Contact email:</b> {contact_email}<br/>
            <b>Phone:</b> {phone}<br/>
            <b>Events:</b> {events}<br/>
          `
        };

        const attributes = {
          name: loc.name,
          description: loc.description || "",
          type: loc.type,
          address: loc.address || "",
          website: loc.website || "",
          contact_email: loc.contact_email || "",
          phone: loc.phone || "",
          events: loc.events ? loc.events.join(", ") : ""
        };

        return new Graphic({
          geometry,
          symbol,
          attributes,
          popupTemplate
        });
      });

      graphicsLayer.addMany(newGraphics);

      // Optionally, zoom to all graphics
      if (newGraphics.length > 0) {
        view.goTo(newGraphics);
      }
    },
    [graphicsLayer, view]
  );

  const onMapViewReady = (event: CustomEvent<ArcgisViewReadyEventDetail>) => {
    const mapView = event.detail.view;
    console.log("MapView ready:", mapView);

    const gLayer = new GraphicsLayer();
    mapView.map.add(gLayer);
    setGraphicsLayer(gLayer);
    setView(mapView);
  };

  useEffect(() => {
    if (view && graphicsLayer) {
      fetchLocations().then((data) => {
        addLocationsToMap(data);
      }).catch(console.error);
    }
  }, [view, graphicsLayer, fetchLocations, addLocationsToMap]);

  return (
    <ArcgisMap
      itemId="d5dda743788a4b0688fe48f43ae7beb9"
      onArcgisViewReadyChange={onMapViewReady}
      style={{ width: "100%", height: "100%" }}
    >
      <ArcgisZoom position="top-left" />
    </ArcgisMap>
  );
};

export default Map;
