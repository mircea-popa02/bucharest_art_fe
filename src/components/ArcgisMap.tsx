import React, { useRef, useEffect, useState } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import TextSymbol from '@arcgis/core/symbols/TextSymbol';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import './ArcgisMap.css';
import { Toast, Button, Container, Badge } from 'react-bootstrap';
import AuthService from '../auth/AuthService';

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

  const [events, setEvents] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [showCommentInputForEventId, setShowCommentInputForEventId] = useState<string | null>(null);


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

  const getEventsOfLocation = (location: Location) => {
    const token = AuthService.getToken();
    fetch(`http://localhost:3000/event/${location._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched events:", data);
        setEvents(data);
      })
      .catch((error) => console.error("Error fetching events:", error));
  }


  const handleViewComments = (eventId: string) => {
    setShowCommentInputForEventId(eventId);
    getAllCommentsOfEvent(eventId);
  };

  const getAllCommentsOfEvent = (eventId: string) => {
    const token = AuthService.getToken();
    fetch(`http://localhost:3000/comment/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const commentsWithEventId = data.map((comment: any) => ({
          ...comment,
          eventId,
        }));
        setComments(commentsWithEventId);
      })
      .catch((error) => console.error("Error fetching comments:", error));
  };

  const handleAddComment = (eventId: string, text: string) => {
    if (!text.trim()) return;

    const token = AuthService.getToken();
    fetch(`http://localhost:3000/comment/${eventId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text,
        date: new Date().toISOString(), // current date/time
      }),
    })
      .then((response) => response.json())
      .then(() => {
        getAllCommentsOfEvent(eventId);

        setNewCommentText("");
      })
      .catch((error) => console.error("Error adding comment:", error));
  };

  const updateEventParticipants = (
    eventId: string,
    action: "confirmed" | "interested" | "cancel"
  ) => {
    const token = AuthService.getToken();
    fetch(`http://localhost:3000/event/${eventId}/participants`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action }),
    })
      .then((response) => response.json())
      .then(() => {
        getEventsOfLocation(selectedLocation!);
      })
      .catch((error) => console.error("Error updating participants:", error));
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
          getEventsOfLocation(location);
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
                  Link către site
                </a>
              )}
            </Toast.Body>
          </>
        )}
      </Toast>

      {selectedLocation?.name && (
        <Container className='gallery-container p-4 bg-light border rounded mt-3'>
          <h4 className="me-auto">Evenimente viitoare la <strong>{selectedLocation.name}</strong></h4>
          <p>
            Aceasta este o locație tip: <strong>{selectedLocation.type}</strong>
          </p>
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event._id} className="border rounded my-2 p-4">
                <h5>{event.name}</h5>

                <p>
                  <strong>Data:</strong>{" "}
                  {new Date(event.date).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>

                <p className='mb-2 d-flex gap-2'>
                  <Badge pill bg="secondary"><strong>{event.interestedParticipants?.length || 0} &nbsp;</strong> interesați</Badge>
                  <Badge pill bg="success"><strong>{event.confirmedParticipants?.length || 0} &nbsp;</strong> confirmați</Badge>
                </p>

                <p>{event.description}</p>

                <div className="d-flex gap-2 mb-2">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => updateEventParticipants(event._id, "interested")}
                  >
                    Sunt interesat
                  </Button>
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => updateEventParticipants(event._id, "confirmed")}
                  >
                    Particip
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => updateEventParticipants(event._id, "cancel")}
                  >
                    Renunță
                  </Button>
                </div>
                <hr />
                <Button
                  variant="primary"
                  className="mb-2"
                  size="sm"
                  onClick={() => handleViewComments(event._id)}
                >
                  Comentarii
                </Button>

                {showCommentInputForEventId === event._id && (
                  <div className="mt-3">

                    {/* if the is only one, then "comentariu", else "comentarii" */}
                    <h6><strong>{comments.length}</strong> {comments.length === 1 ? "comentariu" : "comentarii"} pentru {event.name}</h6>
                    {comments.length > 0 && comments[0]?.eventId === event._id ? (
                      comments.map((comment: any) => (
                        <div key={comment._id} className="border rounded p-2 my-1">
                          <p>
                            <strong>{comment.user || "Anonim"}:</strong> {comment.text}
                          </p>
                          <p className="mb-0 text-muted" style={{ fontSize: "0.8rem" }}>
                            {new Date(comment.date).toLocaleString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>Niciun comentariu încă.</p>
                    )}

                    <div className="mt-3">
                      <label htmlFor={`comment-${event._id}`}>Ai ceva interesant de spus?</label>
                      <div className="d-flex gap-2 mt-1">
                        <input
                          id={`comment-${event._id}`}
                          type="text"
                          placeholder="Scrie un comentariu..."
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          className="form-control"
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleAddComment(event._id, newCommentText)}
                        >
                          Trimite
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>Nu există evenimente în acest moment</p>
          )}
        </Container>
      )}
    </div>
  );
};

export default ArcGISMapComponent;
