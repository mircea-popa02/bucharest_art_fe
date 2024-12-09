import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import AuthService from '../auth/AuthService';
import Card from 'react-bootstrap/Card';


const Register: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const errorMessage = await AuthService.register(name, password);
        if (errorMessage) {
            setError(errorMessage);
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <Card className='mt-4 mx-auto' style={{ width: '24rem' }}>
            <Card.Header>
                <Card.Title>
                    Create new account on <strong>BucharestArt</strong>
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={handleRegister}>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" onChange={(e) => setName(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" onChange={(e) => setPassword(e.target.value)} required />
                    </Form.Group>

                    <Button variant="primary" type="submit">Register</Button>
                </Form>
            </Card.Body>
            <Card.Footer>
                <Card.Link href="/login">Already have an account</Card.Link>
            </Card.Footer>
        </Card>
    );
};

export default Register;
