import { useEffect, useState, useRef } from "react";
import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/dist/components/arcgis-zoom";
import { ArcgisMap, ArcgisZoom } from "@arcgis/map-components-react";
import Graphic from "@arcgis/core/Graphic";
import MapView from "@arcgis/core/views/MapView";
import ArcGISMapComponent from "./ArcgisMap";



const Map = () => {
  

  return (
    <ArcGISMapComponent />
  );
};

export default Map;
