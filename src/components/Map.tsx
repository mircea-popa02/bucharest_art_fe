import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/dist/components/arcgis-zoom";
import { ArcgisMap, ArcgisZoom } from "@arcgis/map-components-react";


const Map = () => {
    return (

        <ArcgisMap
            itemId="d5dda743788a4b0688fe48f43ae7beb9"
            onArcgisViewReadyChange={(event: CustomEvent) => {
                console.log("MapView ready", event);
            }}
        >
            <ArcgisZoom position="top-left"></ArcgisZoom>
        </ArcgisMap>

    );
}

export default Map;