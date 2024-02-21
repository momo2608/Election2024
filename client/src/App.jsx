import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Alert } from 'react-bootstrap';
import './App.css'
import NavHeader from './components/NavbarComponents';
import { NotFoundLayout } from './components/PageLayout';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate, useNavigate } from 'react-router-dom';
import MessageContext from './messageCtx.jsx';
import API from './apis/generalAPI.js';
import { LoginForm } from './components/AuthComponents';
import VotesForm  from './components/VotesForm.jsx';
import FormPage from './components/FormPage.jsx';


function App() {
  const [loggedIn, setLoggedIn] = useState(null);
  const [user, setUser] = useState({})
  //the error message
  const [message, setMessage] = useState('');

  // If an error occurs, the error message will be shown in a toast.
  const handleErrors = (err) => {
    let msg = '';
    if (err.error) msg = err.error;
    else msg = "Unknown Error";
    setMessage({ msg: msg, type: 'danger' });
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // const u = await API.getUserInfo();
        // setUser({
        //   id: u.id,
        //   role: u.role,
        //   name: u.name,
        //   surname: u.surname,
        // });
        setLoggedIn(true);
      } catch (err) {
        setLoggedIn(false);
        handleErrors(err);
      }
    };

    checkAuth();
    setMessage('');
  }, []);


  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    
    // clean up everything
    setMessage('');
    setUser(null);
    
  };

  return (
    <BrowserRouter>
      <MessageContext.Provider value={{ handleErrors }}>
        <Routes>
          <Route
            element={
              <>
                <NavHeader loggedIn={loggedIn} user={user} handleLogout={handleLogout} setMessage={setMessage}/>
                <div className="mt-3 ms-4 me-4 mb-3 text-center">
                  <Container fluid className="text-center">
                    {message && (
                      <Row>
                        <Alert variant={message.type} onClose={() => setMessage('')} dismissible>
                          {message.msg}
                        </Alert>
                      </Row>
                    )}
                    <Outlet/>
                  </Container>
                </div>
              </>
            }
          >
            <Route path="/" element={true ? (<Navigate to="/formPage" />) : (<LoginForm loggedIn={loggedIn} />)} />
            {/* <Route path="/form" element={loggedIn ? <VotesForm loggedIn={loggedIn} user={user} setMessage={setMessage}/> : <LoginForm />} /> */}
            <Route path="/formPage" element={loggedIn ? <FormPage loggedIn={loggedIn} setMessage={setMessage} user={user}/> : <LoginForm loggedIn={loggedIn} />} />
            <Route path="*" element={<NotFoundLayout />} />
          </Route>
        </Routes>
      </MessageContext.Provider>
    </BrowserRouter>
  );
}

export default App;