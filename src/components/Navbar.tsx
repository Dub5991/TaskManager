import React from 'react';
import { Navbar, Nav, Button, Container, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const AppNavbar: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, logout, user, isLoading } = useAuth0();

  return (
    <Navbar bg="light" expand="lg" className="mb-4 shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Task Management
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
            {isAuthenticated && <Nav.Link as={Link} to="/profile">Profile</Nav.Link>}
            {isAuthenticated && <Nav.Link as={Link} to="/journal">Journal</Nav.Link>}
          </Nav>
          <Nav>
            {!isLoading && !isAuthenticated && (
              <Button variant="outline-primary" onClick={() => loginWithRedirect()}>
                Log In
              </Button>
            )}
            {!isLoading && isAuthenticated && (
              <>
                {user?.picture && (
                  <Image
                    src={user.picture}
                    roundedCircle
                    width={32}
                    height={32}
                    className="me-2"
                    alt={user.name}
                  />
                )}
                <span className="me-3">{user?.name}</span>
                <Button
                  variant="outline-danger"
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                >
                  Log Out
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;