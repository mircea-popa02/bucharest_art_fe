import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Button, Nav } from 'react-bootstrap';


const Dashboard: React.FC = () => {
    return (
        <div>
            <h2>Dashboard</h2>
            <Nav className="mb-3">
                <Nav.Item>
                    <Link to="/dashboard/profile">
                        <Button variant="link">Profile</Button>
                    </Link>
                </Nav.Item>
                <Nav.Item>
                    <Link to="/dashboard/settings">
                        <Button variant="link">Settings</Button>
                    </Link>
                </Nav.Item>
            </Nav>
            <Nav.Item>
                <Link to="/dashboard/map">
                    <Button variant="link">Map</Button>
                </Link>
            </Nav.Item>
            <Outlet />

        </div>
    );
};

export default Dashboard;
