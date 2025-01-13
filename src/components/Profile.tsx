import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form, Card, Image, Alert } from 'react-bootstrap';
import axios from 'axios';
import AuthService from '../auth/AuthService';

const Profile = () => {
    const [field, setField] = useState<'name' | 'password'>('name');
    const [value, setValue] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [confirmedEvents, setConfirmedEvents] = useState([]);
    const [interestedEvents, setInterestedEvents] = useState([]);
    const [comments, setComments] = useState([]);
    const [selectedEventComments, setSelectedEventComments] = useState([]);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:3000/event/user', {
                headers: { Authorization: `Bearer ${AuthService.getToken()}` },
            });
            setConfirmedEvents(response.data.confirmedEvents);
            setInterestedEvents(response.data.interestedEvents);
        } catch (error) {
            console.error('Error fetching events', error);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get('http://localhost:3000/comment', {
                headers: { Authorization: `Bearer ${AuthService.getToken()}` },
            });
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments', error);
        }
    };

    useEffect(() => {
        fetchEvents();
        fetchComments();
    }, []);

    const handleChange = async () => {
        const result = await AuthService.change(field, value);
        if (result) {
            setMessage(result);
        } else {
            setMessage(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);
            setValue('');
        }
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete your account? This action cannot be undone.'
        );
        if (!confirmDelete) return;

        const result = await AuthService.deleteAccount();
        if (result) {
            setMessage(result);
        } else {
            setMessage('Your account has been deleted successfully.');
            setTimeout(() => {
                window.location.href = '/';
            }, 3000);
        }
    };

    const handleShowComments = (eventId) => {
        const eventComments = comments.filter((comment) => comment.event === eventId);
        setSelectedEventComments(eventComments);
    };

    return (
        <Container className="mt-4">
            <Row className="mb-4 align-items-center">
                <Col md={8}>
                    <h3>Welcome, {AuthService.getUsername()}</h3>
                    <p className="text-muted">Manage your profile and explore events.</p>
                </Col>
                <Col md={4} className="text-end">
                    <Image
                        className="rounded-circle"
                        alt="avatar"
                        src="http://localhost:5173/public/profile.jpg"
                        width={100}
                        height={100}
                    />
                </Col>
            </Row>

            {message && <Alert variant="info">{message}</Alert>}

            <Row className="mb-4">
                <Col md={6}>
                    <h4>Update Profile</h4>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Field to update</Form.Label>
                            <Form.Select
                                value={field}
                                onChange={(e) => setField(e.target.value as 'name' | 'password')}
                            >
                                <option value="name">Username</option>
                                <option value="password">Password</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>New {field}</Form.Label>
                            <Form.Control
                                type={field === 'password' ? 'password' : 'text'}
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder={`Enter new ${field}`}
                            />
                        </Form.Group>

                        <Button variant="primary" onClick={handleChange}>
                            Update
                        </Button>
                    </Form>
                </Col>
                <Col md={6} className="text-center">
                    <h4>Account Actions</h4>
                    <Button variant="danger" onClick={handleDeleteAccount}>
                        Delete Account
                    </Button>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={6}>
                    <h4>Confirmed Events</h4>
                    {confirmedEvents.length > 0 ? (
                        confirmedEvents.map((event) => (
                            <Card key={event._id} className="mb-3">
                                <Card.Body>
                                    <Card.Title>{event.name}</Card.Title>
                                    <Card.Text>{event.description}</Card.Text>
                                    <Button
                                        variant="primary"
                                        onClick={() => handleShowComments(event._id)}
                                    >
                                        Show Comments
                                    </Button>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <p className="text-muted">No confirmed events yet.</p>
                    )}
                </Col>
                <Col md={6}>
                    <h4>Interested Events</h4>
                    {interestedEvents.length > 0 ? (
                        interestedEvents.map((event) => (
                            <Card key={event._id} className="mb-3">
                                <Card.Body>
                                    <Card.Title>{event.name}</Card.Title>
                                    <Card.Text>{event.description}</Card.Text>
                                    <Button
                                        variant="primary"
                                        onClick={() => handleShowComments(event._id)}
                                    >
                                        Show Comments
                                    </Button>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <p className="text-muted">No interested events yet.</p>
                    )}
                </Col>
            </Row>

            <Row>
                <Col>
                    <h4>Comments</h4>
                    {selectedEventComments.length > 0 ? (
                        <ul>
                            {selectedEventComments.map((comment) => (
                                <li key={comment._id}>{comment.text}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted">No comments to display.</p>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;
