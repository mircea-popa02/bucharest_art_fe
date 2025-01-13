import { Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';

const Landing = () => {
    return (
        <Container className='bg-light p-4 border'>
            <Row className='mb-4'>
                <Col md={6}>
                    <h2>Ce este BucharestArt?</h2>
                    <p>
                        BucharestArt este o platformă online care îți oferă posibilitatea de a explora și descoperi evenimente de artă, galerii și de a împărtăși opiniile tale cu alți utilizatori.
                    </p>
                </Col>
                <Col md={6}>
                    <h2>Descoperă</h2>
                    <p>
                        Descoperă evenimente de artă și galerii din București și împrejurimi.
                    </p>
                    <Link to="/dashboard/map">
                        <Button variant="outline-primary" className='me-2'>Harta</Button>
                    </Link>
                </Col>
            </Row>
            <hr/>
            <Row>
                <Col>
                    <h2>FAQ</h2>
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Ce tipuri de evenimente pot găsi pe BucharestArt?</Accordion.Header>
                            <Accordion.Body>
                                Pe BucharestArt poți găsi o varietate de evenimente de artă, inclusiv expoziții de pictură, sculptură, fotografie, spectacole de teatru, concerte și multe altele.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Cum pot adăuga un eveniment pe platformă?</Accordion.Header>
                            <Accordion.Body>
                                Pentru a adăuga un eveniment, trebuie să îți creezi un cont și să urmezi pașii din secțiunea "Adaugă Eveniment". Completează formularul cu toate detaliile necesare și evenimentul tău va fi publicat după ce va fi aprobat de echipa noastră.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>Este BucharestArt gratuit?</Accordion.Header>
                            <Accordion.Body>
                                Da, utilizarea platformei BucharestArt este gratuită. Poți explora evenimentele și galeriile fără niciun cost. Totuși, unele evenimente pot avea taxe de participare stabilite de organizatori.
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>
            </Row>
        </Container>
    );
}

export default Landing;
