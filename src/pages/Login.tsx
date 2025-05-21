// Route: /login

import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';

const bgGradient = {
  background: 'linear-gradient(135deg, #0f2027 0%, #2c5364 100%)',
  minHeight: '100vh',
  padding: 0,
};

const cardVariants = {
  hidden: { opacity: 0, y: 80, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 80, damping: 15 } },
};

const buttonVariants = {
  rest: { scale: 1, boxShadow: '0px 0px 0px 0px #00e6ff', borderRadius: '2rem' },
  hover: {
    scale: 1.08,
    boxShadow: '0 0 0 4px #00e6ff88, 0 0 20px 4px #00e6ffcc',
    borderRadius: '2rem',
    transition: { duration: 0.2 },
  },
  tap: { scale: 0.96, borderRadius: '2rem' },
};

const Login: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div style={bgGradient}>
      <Container fluid className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <Row className="w-100 justify-content-center">
          <Col xs={12} md={8} lg={5}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Card
                className="shadow-lg"
                style={{
                  borderRadius: '2rem',
                  background: 'rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid #00e6ff',
                  color: '#fff',
                }}
              >
                <Card.Body className="p-5 text-center">
                  <motion.div
                    initial={{ scale: 0.8, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 120, delay: 0.2 }}
                  >
                    <h1 style={{ fontWeight: 900, letterSpacing: 2, fontSize: '2.5rem', color: '#00e6ff' }}>
                      Welcome, Goal Crusher!
                    </h1>
                  </motion.div>
                  <p className="mt-4 mb-5" style={{ fontSize: '1.2rem', color: '#e0e0e0' }}>
                    Set, track, and smash your most ambitious goals.<br />
                    Log in to unlock your full potential.
                  </p>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    initial="rest"
                    animate="rest"
                    style={{
                      display: 'inline-block',
                      borderRadius: '2rem',
                    }}
                  >
                    <Button
                      variant="outline-info"
                      size="lg"
                      style={{
                        fontWeight: 700,
                        letterSpacing: 1,
                        borderRadius: '2rem',
                        padding: '0.75rem 2.5rem',
                        fontSize: '1.25rem',
                        boxShadow: '0 0 12px #00e6ff55',
                        background: 'linear-gradient(90deg, #00e6ff 0%, #0072ff 100%)',
                        color: '#fff',
                        border: 'none',
                      }}
                      onClick={() => loginWithRedirect()}
                    >
                      🚀 Log In & Get Started
                    </Button>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="mt-5"
                  >
                    <div style={{ fontSize: '1rem', color: '#b2fefa' }}>
                      <span>Not just a login. It's your launchpad.</span>
                    </div>
                  </motion.div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;