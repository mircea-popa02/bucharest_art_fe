import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <h2>Welcome to the App</h2>
            <Link to="/login">
                <Button variant="primary">Login</Button>
            </Link>
            {' '}
            <Link to="/register">
                <Button variant="primary">Register</Button>
            </Link>
        </div>
    );
};

export default Home;
