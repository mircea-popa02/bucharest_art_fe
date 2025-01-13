import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import AuthService from '../auth/AuthService';

const Dashboard: React.FC = () => {
    return (
        <>
            <Navbar bg="light" data-bs-theme="light" className='justify-content-between px-4 border rounded m-4'>
                <Navbar.Brand className='me-4'>
                    <Link to="/dashboard" className='text-decoration-none text-dark'>
                        BucharestArt
                    </Link>
                </Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Item>
                        <Link to="/dashboard/map">
                            <Button variant="link" className='text-decoration-none'>Hartă</Button>
                        </Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link to="/dashboard/events">
                            <Button variant="link" className='text-decoration-none'>Evenimente</Button>
                        </Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link to="/dashboard/profile">
                            <Button variant="link" className='text-decoration-none'>Profil</Button>
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


            <div className='p-0'>
                <Outlet />
            </div>
        </>
    );
};

export default Dashboard;
