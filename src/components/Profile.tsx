import React, { useEffect, useState } from 'react';
import {
    Container,
    Row,
    Col,
    Button,
    Form,
    Card,
    Image,
    Alert,
    Modal,
    Badge,
    ListGroup,
} from 'react-bootstrap';
import axios from 'axios';
import AuthService from '../auth/AuthService';
import '/profile.webp';

const Profile = () => {
    const [field, setField] = useState<'name' | 'password'>('name');
    const [value, setValue] = useState('');
    const [message, setMessage] = useState<string | null>(null);

    const [confirmedEvents, setConfirmedEvents] = useState<any[]>([]);
    const [interestedEvents, setInterestedEvents] = useState<any[]>([]);

    const [comments, setComments] = useState<any[]>([]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:3000/event/user', {
                headers: { Authorization: `Bearer ${AuthService.getToken()}` },
            });
            setConfirmedEvents(response.data.confirmedEvents);
            setInterestedEvents(response.data.interestedEvents);
        } catch (error) {
            console.error('Eroare la preluarea evenimentelor', error);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get('http://localhost:3000/comment', {
                headers: { Authorization: `Bearer ${AuthService.getToken()}` },
            });
            setComments(response.data);
        } catch (error) {
            console.error('Eroare la preluarea comentariilor', error);
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
            const fieldLabel = field === 'name' ? 'Numele' : 'Parola';
            setMessage(`${fieldLabel} a fost actualizat(ă) cu succes!`);
            setValue('');
        }
    };

    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
    };
    const handleConfirmDelete = async () => {
        try {
            const result = await AuthService.deleteAccount();
            if (result) {
                setMessage(result);
            } else {
                setMessage('Contul tău a fost șters cu succes.');
            }
            AuthService.logout();
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } catch (error) {
            setMessage('A apărut o eroare la ștergerea contului.');
        } finally {
            setShowDeleteModal(false);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };
    const updateEventParticipants = async (
        eventId: string,
        action: 'confirmed' | 'interested' | 'cancel'
    ) => {
        try {
            await axios.patch(
                `http://localhost:3000/event/${eventId}/participants`,
                { action },
                {
                    headers: { Authorization: `Bearer ${AuthService.getToken()}` },
                }
            );
            fetchEvents();
        } catch (error) {
            console.error('Eroare la actualizarea participării', error);
        }
    };

    return (
        <Container className="p-4 mt-4 bg-light border rounded">
            <Row className="mb-4 align-items-center">
                <Col md="auto">
                    <Image
                        className="rounded-circle"
                        alt="Poza profil"
                        src="/profile.webp"
                        width={64}
                        height={64}
                    />
                </Col>
                <Col>
                    <h3>Bine ai venit, {AuthService.getUsername()}</h3>
                    <p className="text-muted">Gestionează-ți profilul și explorează evenimentele.</p>
                </Col>
            </Row>
            {message && <Alert variant="info">{message}</Alert>}
            <Row className="mb-4">
                <Col md={6}>
                    <h4>Actualizează Profilul</h4>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Câmp de actualizat</Form.Label>
                            <Form.Select
                                value={field}
                                onChange={(e) => setField(e.target.value as 'name' | 'password')}
                            >
                                <option value="name">Nume utilizator</option>
                                <option value="password">Parolă</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                {field === 'name' ? 'Nume nou' : 'Parolă nouă'}
                            </Form.Label>
                            <Form.Control
                                type={field === 'password' ? 'password' : 'text'}
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder={`Introduceți ${field === 'name' ? 'numele' : 'parola'} nou(ă)`}
                            />
                        </Form.Group>

                        <Button variant="primary" onClick={handleChange}>
                            Actualizează
                        </Button>
                    </Form>
                </Col>
                <Col md={6} className="text-center">
                    <h4>Acțiuni cont</h4>
                    <Button variant="danger" onClick={handleDeleteAccount}>
                        Șterge cont
                    </Button>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={6}>
                    <div className='d-flex flex-column align-items-start mb-2'>
                        <h4>Evenimente Confirmate</h4>
                        <Badge bg="success">{confirmedEvents.length}</Badge>
                    </div>
                    {confirmedEvents.length > 0 ? (
                        confirmedEvents.map((event) => (
                            <Card key={event._id} className="mb-3">
                                <Card.Body>
                                    <Card.Title>{event.name}</Card.Title>
                                    <Card.Text>{event.description}</Card.Text>

                                    <div className="d-flex gap-2">
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => updateEventParticipants(event._id, 'interested')}
                                        >
                                            Sunt interesat
                                        </Button>
                                        <Button
                                            variant="outline-success"
                                            size="sm"
                                            onClick={() => updateEventParticipants(event._id, 'confirmed')}
                                        >
                                            Particip
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => updateEventParticipants(event._id, 'cancel')}
                                        >
                                            Renunță
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <p className="text-muted">Nu există evenimente confirmate încă.</p>
                    )}
                </Col>

                <Col md={6}>
                    <div className='d-flex flex-column align-items-start mb-2'>
                        <h4>Evenimente de Interes</h4>
                        <Badge bg="warning">{interestedEvents.length}</Badge>
                    </div>
                    {interestedEvents.length > 0 ? (
                        interestedEvents.map((event) => (
                            <Card key={event._id} className="mb-3">
                                <Card.Body>
                                    <Card.Title>{event.name}</Card.Title>
                                    <Card.Text>{event.description}</Card.Text>

                                    <div className="d-flex gap-2">
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => updateEventParticipants(event._id, 'interested')}
                                        >
                                            Sunt interesat
                                        </Button>
                                        <Button
                                            variant="outline-success"
                                            size="sm"
                                            onClick={() => updateEventParticipants(event._id, 'confirmed')}
                                        >
                                            Particip
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => updateEventParticipants(event._id, 'cancel')}
                                        >
                                            Renunță
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <p className="text-muted">Nu există evenimente de interes încă.</p>
                    )}
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className='d-flex flex-column align-items-start'>
                        <h4>Comentarii</h4>
                        <Badge bg="info">{comments.length}</Badge>
                    </div>
                    {comments.length > 0 ? (
                        <ListGroup className="mt-3 w-50">
                            {comments.map((comment) => (
                                <ListGroup.Item key={comment._id} className='d-flex flex-column align-items-start'>
                                    <p><strong>Data:</strong> {new Date(comment.date).toLocaleString("en-US", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    })}</p>
                                    <p><strong>Comentariu:</strong> {comment.text}</p>

                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                        <p className="text-muted">Nu există comentarii încă.</p>
                    )}
                </Col>
            </Row>
            <Modal show={showDeleteModal} onHide={handleCancelDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmă ștergerea contului</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Ești sigur că vrei să ștergi contul? Această acțiune nu poate fi anulată.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancelDelete}>
                        Anulează
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Șterge cont
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Profile;
