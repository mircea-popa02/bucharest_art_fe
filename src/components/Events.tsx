import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import InputGroup from "react-bootstrap/InputGroup";
import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";

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
    <div>
      <h1>From</h1>
      <DatePicker selected={startDate} onChange={handleChangeFrom} />
      <h1>To</h1>
      <DatePicker selected={endDate} onChange={handleChangeTo} />
      <InputGroup className="mb-3">
        <Form.Label>Keywords:</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter text"
          value={textInput}
          onChange={handleTextInputChange}
        />
      </InputGroup>
      <Form.Check
        id="sort-checkbox"
        label="Sort the events"
        checked={checkbox}
        onChange={() => setCheckbox(!checkbox)}
      />
      <div>
        <Button onClick={handleClearFilters}>Clear Filters</Button>
      </div>

      <div>
        <Button onClick={handleGetEvents}>Get Events</Button>
      </div>

      <CardGroup>
        {events.map((event, index) => (
          <Card key={index} style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>{event.name}</Card.Title>
              <Card.Text>
                Description:{event.description} <br /> Date:{" "}
                {new Date(event.date).toISOString().split("T")[0]} <br />{" "}
                Participants: {event.confirmedParticipants} <br />{" "}
                Interested: {event.interestedParticipants}
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </CardGroup>
    </div>
  );
};

export default Settings;
