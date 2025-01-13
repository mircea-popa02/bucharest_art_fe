import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Carousel } from 'react-bootstrap';
import p1 from '../../public/p1.jpg';
import p2 from '../../public/p2.jpg';
import p3 from '../../public/p3.jpg';
import p4 from '../../public/p4.jpg';

const Home = () => {
    return (
        <Container className='mt-4 bg-light border rounded'>
            <Row className='align-items-center'>
                <Col md={4} className='text-start p-4'>
                    <h1>Welcome to BucharestArt</h1>
                    <p className='mt-3'>Explore and discover art events, galleries, and share your opinions!</p>
                    <div className='mt-4'>
                        <Link to="/login">
                            <Button variant="primary" className='me-2'>Login</Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="outline-primary">Register</Button>
                        </Link>
                    </div>
                </Col>
                <Col md={8} className='text-center'>
                    <Carousel fade>
                        <Carousel.Item>
                            <img className="d-block w-100" src={p1} alt="Find Events" />
                            <Carousel.Caption>
                                <h3>Find Events</h3>
                                <p>Discover upcoming art events happening near you.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img className="d-block w-100" src={p2} alt="Explore Galleries" />
                            <Carousel.Caption>
                                <h3>Explore Galleries</h3>
                                <p>Browse through various art galleries and exhibitions.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img className="d-block w-100" src={p3} alt="Share Your Opinions" />
                            <Carousel.Caption>
                                <h3>Share Your Opinions</h3>
                                <p>Comment on events and share your thoughts with others.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img className="d-block w-100" src={p4} alt="Connect with Artists" />
                            <Carousel.Caption>
                                <h3>Connect with Artists</h3>
                                <p>Engage with your favorite artists and explore their work.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;