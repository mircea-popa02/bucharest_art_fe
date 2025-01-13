import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import AuthService from '../auth/AuthService';
import logo from '../../public/logo.svg';

const Dashboard: React.FC = () => {
    return (
        <>
            <Navbar bg="light" data-bs-theme="light" className='justify-content-between px-4 border rounded m-4'> 
                <Navbar.Brand href="/dashboard" className='me-4'>
                    BucharestArt
                </Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Item>
                        <Link to="/dashboard/map">
                            <Button variant="link">Map</Button>
                        </Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link to="/dashboard/settings">
                            <Button variant="link">Settings</Button>
                        </Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link to="/dashboard/profile">
                            <Button variant="link">Profile</Button>
                        </Link>
                    </Nav.Item>
                </Nav>
                <Button
                    variant="danger"
                    onClick={() => {
                        AuthService.logout();
                        window.location.href = '/';
                    }}
                >
                    Logout
                </Button>
            </Navbar>


            <Container className='p-0 border rounded bg-light'>
                <Outlet />
            </Container>
        </>
    );
};

export default Dashboard;
