import { Button, Container, Row, Col, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Home.css';
import p1 from '/p1.jpg';
import p2 from '/p2.jpg';
import p3 from '/p3.jpg';

const Home = () => {
    return (
        <Container className='mt-4 bg-light border'>
            <Row className='align-items-center'>
                <Col md={4} className='text-start p-4'>
                    <h1>Bun venit la BucharestArt!</h1>
                    <p className='mt-3'>
                        Explorează și descoperă evenimente de artă, galerii și împărtășește-ți opiniile! Creează-ți un cont sau autentifică-te pentru a începe.
                    </p>
                    <div className='mt-4'>
                        <Link to="/login">
                            <Button variant="primary" className='me-2'>Autentificare</Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="outline-primary">
                                Cont nou
                            </Button>
                        </Link>
                    </div>
                </Col>
                <Col md={8} className='text-center'>
                    <Carousel fade>
                        <Carousel.Item>
                            <img
                                className="d-block w-100 carousel-image"
                                src={p1}
                                alt="Find Events"
                            />
                            <Carousel.Caption>
                                <h3>Find Events</h3>
                                <p>Discover upcoming art events happening near you.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100 carousel-image"
                                src={p2}
                                alt="Explore Galleries"
                            />
                            <Carousel.Caption>
                                <h3>Explore Galleries</h3>
                                <p>Browse through various art galleries and exhibitions.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100 carousel-image"
                                src={p3}
                                alt="Share Your Opinions"
                            />
                            <Carousel.Caption>
                                <h3>Share Your Opinions</h3>
                                <p>Comment on events and share your thoughts with others.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;
