import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import InputGroup from "react-bootstrap/InputGroup";
import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import { Col, Container, Row } from "react-bootstrap";

const Settings: React.FC = () => {
  const [startDate, setStartDate] = useState(new Date());

  const [endDate, setEndDate] = useState(new Date());

  const [textInput, setTextInput] = useState("");

  const [checkbox, setCheckbox] = useState(false);

  const [events, setEvents] = useState([]);

  const handleChangeFrom = (date: Date) => {
    setStartDate(date);
  };

  const handleChangeTo = (date: Date) => {
    setEndDate(date);
  };

  const handleClearFilters = () => {
    setStartDate("01-01-2025");
    setEndDate("01-01-2025");
    setTextInput("");
    setCheckbox(false);
  };

  const handleGetEvents = () => {
    const token = localStorage.getItem("token");
    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];

    console.log(formattedStartDate, formattedEndDate, textInput, checkbox);
    const url = `http://localhost:3000/event?startDate=${formattedStartDate}&endDate=${formattedEndDate}&search=${textInput}&sort=${
      checkbox ? "attendees" : ""
    }`;
    console.log(url);
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
        console.log("Events data:", data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  };

  const handleTextInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTextInput(event.target.value);
  };

  return (
    <div style={{ margin: "0 auto", width: "100%" }}>
      <Container className="w-100 align-items-start m-0">
        <h1>Caută evenimente</h1>
      </Container>

      <Container className="mt-5 w-100 align-items-start m-0">
        <Row className="mb-4 align-items-center w-100">
          <Col className="w-20">
            <h5>De la:</h5>
            <DatePicker selected={startDate} onChange={handleChangeFrom} />
          </Col>
          <Col className="w-20">
            <h5>Până la:</h5>
            <DatePicker selected={endDate} onChange={handleChangeTo} />
          </Col>
        </Row>
      </Container>

      <Container className="mt-3 w-100 align-items-start m-0">
        <Row>
          <Col>
            <InputGroup className="m-0">
              <Form.Label className="m-0">Cuvinte cheie:</Form.Label>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputGroup className="m-0">
              <Form.Control
                type="text"
                placeholder="Caută după cuvinte cheie"
                value={textInput}
                onChange={handleTextInputChange}
              />
            </InputGroup>
          </Col>
        </Row>
      </Container>

      <Container className="mt-4 w-100 align-items-start m-0">
        <Row>
          <Col>
            <Form.Check
              id="sort-checkbox"
              label="Vreau evenimentele sortate"
              checked={checkbox}
              onChange={() => setCheckbox(!checkbox)}
            />
          </Col>
        </Row>
      </Container>

      <Container className="mt-5 mb-5 w-100 align-items-start m-0">
        <Row className="d-flex align-items-center">
          <Col className="d-flex justify-content-end">
            <Button onClick={handleGetEvents}>Caută evenimente</Button>
          </Col>
          <Col className="d-flex justify-content-start">
            <Button onClick={handleClearFilters}>Resetează filtre</Button>
          </Col>
        </Row>
      </Container>

      <CardGroup className="w-100 mt-4 w-100 align-items-start m-0">
        {events.map((event, index) => (
          <Row key={index} className="w-100 my-2 p-0">
            {" "}
            <Col className="w-100 m-0 p-0">
              {" "}
              <Card>
                <Card.Body>
                  <Card.Title>{event.name}</Card.Title>
                  <Card.Text>
                    Descriere: {event.description} <br />
                    Data: {
                      new Date(event.date).toISOString().split("T")[0]
                    }{" "}
                    <br />
                    Interesați: {event.interestedParticipants.length}
                  </Card.Text>
                  <Container className="d-flex justify-content-center">
                    <Button onClick={handleClearFilters}>
                      Vreau să particip
                    </Button>
                  </Container>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ))}
      </CardGroup>
    </div>
  );
};

export default Settings;
