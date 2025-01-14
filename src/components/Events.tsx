import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import "bootstrap/dist/css/bootstrap.min.css";
import { Badge, Container, Row, Col, Accordion } from "react-bootstrap";

const Settings: React.FC = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [textInput, setTextInput] = useState("");
  const [checkbox, setCheckbox] = useState(false);

  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [comments, setComments] = useState<any[]>([]);
  const [showCommentInputForEventId, setShowCommentInputForEventId] =
    useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState("");

  const [galleryInfo, setGalleryInfo] = useState<{ [eventId: string]: any }>({});

  useEffect(() => {
    handleGetEvents();
  }, [startDate, endDate, textInput, checkbox]);

  useEffect(() => {
    if (events.length === 0) return;

    const token = localStorage.getItem("token");

    events.forEach((event) => {
      if (!galleryInfo[event._id]) {
        fetch(`http://localhost:3000/event/${event._id}/gallery`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setGalleryInfo((prev) => ({
              ...prev,
              [event._id]: data,
            }));
          })
          .catch((error) => console.error("Error fetching gallery info:", error));
      }
    });
  }, [events, galleryInfo]);

  const handleGetEvents = () => {
    setIsLoading(true);

    const token = localStorage.getItem("token");
    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];

    const url = `http://localhost:3000/event?startDate=${formattedStartDate}&endDate=${formattedEndDate}&search=${textInput}&sort=${checkbox ? "attendees" : ""
      }`;

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setIsLoading(false);
      });
  };

  const handleClearFilters = () => {
    setStartDate(new Date());
    setEndDate(new Date());
    setTextInput("");
    setCheckbox(false);
    setEvents([]);
  };

  const handleTextInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTextInput(event.target.value);
  };

  const handleViewComments = (eventId: string) => {
    setShowCommentInputForEventId(eventId);
    getAllCommentsOfEvent(eventId);
  };

  const getAllCommentsOfEvent = (eventId: string) => {
    const token = localStorage.getItem("token");
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

    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/comment/${eventId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text,
        date: new Date().toISOString(),
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
    const token = localStorage.getItem("token");
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
        handleGetEvents();
      })
      .catch((error) => console.error("Error updating participants:", error));
  };

  return (
    <div className="p-3">
      <Container className="p-3 bg-light border rounded mb-4">
        <h4 className="mb-3">Caută evenimente</h4>

        <Row className="mb-3">
          <Col md={4} className="d-flex gap-2 flex-column">
            <Form.Label>De la</Form.Label>
            <DatePicker
              className="form-control"
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
            />
          </Col>
          <Col md={4} className="d-flex gap-2 flex-column">
            <Form.Label>Până la</Form.Label>
            <DatePicker
              className="form-control"
              selected={endDate}
              onChange={(date: Date) => setEndDate(date)}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Cuvinte cheie:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Caută după descriere sau nume..."
              value={textInput}
              onChange={handleTextInputChange}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6} className="d-flex align-items-center">
            <Form.Check
              id="sort-checkbox"
              label="Sortează după numărul de participanți"
              checked={checkbox}
              onChange={() => setCheckbox(!checkbox)}
              className="ms-2"
            />
          </Col>
        </Row>

        <div className="d-flex gap-2">
          <Button variant="primary" size="sm" onClick={handleGetEvents}>
            Caută
          </Button>
          <Button variant="outline-secondary" size="sm" onClick={handleClearFilters}>
            Resetează filtre
          </Button>
        </div>
      </Container>

      {isLoading ? (
        <div className="d-flex justify-content-center mt-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Se încarcă...</span>
          </Spinner>
        </div>
      ) : (
        <Container className="bg-light p-4 border rounded">
          <Row xs={1} md={2} className="g-4">
            {events.length > 0 ? (
              events.map((event) => (
                <Col key={event._id}>
                  <div className="border rounded p-3">
                    <h5>{event.name}</h5>

                    <p>
                      <strong>Data:</strong>{" "}
                      {new Date(event.date).toLocaleString("ro-RO", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>

                    <p className="mb-2 d-flex gap-2">
                      <Badge pill bg="secondary">
                        <strong>{event.interestedParticipants?.length || 0}</strong>{" "}
                        interesați
                      </Badge>
                      <Badge pill bg="success">
                        <strong>{event.confirmedParticipants?.length || 0}</strong>{" "}
                        confirmați
                      </Badge>
                    </p>

                    <p>{event.description}</p>

                    <div className="d-flex gap-2 mb-3">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() =>
                          updateEventParticipants(event._id, "interested")
                        }
                      >
                        Sunt interesat
                      </Button>
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() =>
                          updateEventParticipants(event._id, "confirmed")
                        }
                      >
                        Particip
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() =>
                          updateEventParticipants(event._id, "cancel")
                        }
                      >
                        Renunță
                      </Button>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2 mb-2"
                      onClick={() => handleViewComments(event._id)}
                    >
                      Comentarii
                    </Button>

                    <Accordion className="mt-3">
                      <Accordion.Item eventKey={`gallery-${event._id}`}>
                        <Accordion.Header>
                          {galleryInfo[event._id]
                            ? `Galerie: ${galleryInfo[event._id].name}`
                            : "Se încarcă galeria..."}
                        </Accordion.Header>
                        <Accordion.Body>
                          {galleryInfo[event._id] && (
                            <>
                              <p className="mb-1">
                                <Badge bg="dark">
                                  {galleryInfo[event._id].type}
                                </Badge>
                              </p>
                              <p>{galleryInfo[event._id].description}</p>
                              {galleryInfo[event._id].address && (
                                <p>
                                  <strong>Adresă:</strong>{" "}
                                  {galleryInfo[event._id].address}
                                </p>
                              )}
                              {galleryInfo[event._id].phone && (
                                <p>
                                  <strong>Telefon:</strong>{" "}
                                  <Badge bg="secondary">
                                    {galleryInfo[event._id].phone}
                                  </Badge>
                                </p>
                              )}
                              {galleryInfo[event._id].contact_email && (
                                <p>
                                  <strong>Email:</strong>{" "}
                                  <Badge bg="secondary">
                                    {galleryInfo[event._id].contact_email}
                                  </Badge>
                                </p>
                              )}
                              {galleryInfo[event._id].website && (
                                <p>
                                  <strong>Website:</strong>{" "}
                                  <a
                                    href={galleryInfo[event._id].website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {galleryInfo[event._id].website}
                                  </a>
                                </p>
                              )}
                              {galleryInfo[event._id].events && (
                                <p>
                                  <strong>Număr evenimente:</strong>{" "}
                                  <Badge bg="warning">
                                    {galleryInfo[event._id].events.length}
                                  </Badge>
                                </p>
                              )}
                            </>
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>

                    {showCommentInputForEventId === event._id && (
                      <div className="mt-3">
                        <h6>
                          <strong>
                            {
                              comments.filter((c) => c.eventId === event._id)
                                .length
                            }
                          </strong>{" "}
                          {comments.filter((c) => c.eventId === event._id).length === 1
                            ? "comentariu"
                            : "comentarii"}{" "}
                          pentru {event.name}
                        </h6>

                        {comments.some((c) => c.eventId === event._id) ? (
                          comments
                            .filter((comment) => comment.eventId === event._id)
                            .map((comment) => (
                              <div
                                key={comment._id}
                                className="border rounded p-2 my-1"
                              >
                                <p>
                                  <strong>{comment.user || "Anonim"}:</strong>{" "}
                                  {comment.text}
                                </p>
                                <p
                                  className="mb-0 text-muted"
                                  style={{ fontSize: "0.8rem" }}
                                >
                                  {new Date(comment.date).toLocaleString("ro-RO")}
                                </p>
                              </div>
                            ))
                        ) : (
                          <p>Niciun comentariu încă.</p>
                        )}

                        <div className="mt-3">
                          <Form.Label htmlFor={`comment-${event._id}`}>
                            Ai ceva interesant de spus?
                          </Form.Label>
                          <div className="d-flex gap-2 mt-1">
                            <Form.Control
                              id={`comment-${event._id}`}
                              type="text"
                              placeholder="Scrie un comentariu..."
                              value={newCommentText}
                              onChange={(e) => setNewCommentText(e.target.value)}
                            />
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() =>
                                handleAddComment(event._id, newCommentText)
                              }
                            >
                              Trimite
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Col>
              ))
            ) : (
              <p className="mt-4">Nu există evenimente pentru filtrele selectate.</p>
            )}
          </Row>
        </Container>
      )}
    </div>
  );
};

export default Settings;
