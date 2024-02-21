import React from 'react';
import { Navbar, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';

function NavHeader(props) {
  const navigate = useNavigate();

  const onLogout = async () => {
    await props.handleLogout();
    navigate("/");
  }

  return (
    <div>
      {/* Logo al di fuori della Navbar */}
      <div className="mb-4">
        <img src="/pur.jpg" alt="image" className="img-fluid responsive-logo logo-dimensions" />
      </div>

      {/* Navbar */}
      <Navbar collapseOnSelect expand="lg" className="navbar-expand-lg justify-content-center flex-column">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav" className="lower-navbar w-100">
          {/* Links della Navbar */}
          <Nav className="me-auto" variant="pills" defaultActiveKey="/form">
            {props.loggedIn && (
              <>
                <Nav.Item>
                  <Nav.Link as={Link} to="/formPage" className="nav-link">
                    Compila Form
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/results" className="nav-link">
                    Risultati
                  </Nav.Link>
                </Nav.Item>
              </>
            )}
          </Nav>

          {/* Sezione a destra della Navbar */}
          <Nav className='me-4 d-flex align-items-center'>
            {props.loggedIn &&
              <Navbar.Text>
                {/* Qui potresti visualizzare l'avatar e il nome dell'utente */}
              </Navbar.Text>
            }

            {props.loggedIn ?
              <Button variant="outline-light h-75" onClick={onLogout}>
                Logout
              </Button>
              :
              <Link to='http://localhost:3001/login' className='btn btn-outline-light'>Login</Link>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default NavHeader;
