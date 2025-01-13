import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Alert, Card } from 'react-bootstrap';
import AuthService from '../auth/AuthService';

const Login: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const errorMessage = await AuthService.login(name, password);
        if (errorMessage) {
            setError(errorMessage);
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <Card className='mt-4 mx-auto' style={{ width: '28rem' }}>
            <Card.Header>
                <Card.Title className='m-0 p-2'>
                    <h3>Autentificare</h3>
                    <p>
                        Introduceti numele si parola pentru a va autentifica în <strong>BucharestArt</strong>
                    </p>
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={handleLogin}>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group>
                        <Form.Label>Nume</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Parola</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">Autentificare</Button>
                </Form>
            </Card.Body>
            <Card.Footer className='d-flex'>
                Sau creează-ți un <span className='ms-1'><Card.Link href="/register">cont nou</Card.Link></span>
            </Card.Footer>

        </Card>
    );
};

export default Login;
