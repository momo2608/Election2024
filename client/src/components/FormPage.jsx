import React, { useEffect, useState, useContext } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import MessageContext from "../messageCtx.jsx"
import API from '../apis/generalAPI';
import 'react-toastify/dist/ReactToastify.css';


function FormPage(props) {
  const { handleErrors } = useContext(MessageContext);
  const [candidati, setCandidati] = useState([]);
  const [uffici, setUffici] = useState([]);
  const [ufficio, setUfficio] = useState('');
  const [votanti, setVotanti] = useState(0);
  const [votiNulli, setVotiNulli] = useState(0);
  const [votiCandidati, setVotiCandidati] = useState([]);

  useEffect(() => {
    props.setMessage('');
    API.getCandidati().then((list) => {
      console.log(list);
      setCandidati(list);
      const initVotiCandidati = [];
      list.forEach((c) => {
        initVotiCandidati.push({ idCandidato: c.id, voti: 0 })
      });
      setVotiCandidati(initVotiCandidati);
    });

    API.getUffici().then((uffici) => {
      console.log(uffici);
      setUffici(uffici);
      /* if (uffici.length > 0) {
         setUfficio(uffici[0].id);
       }*/
    });

  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let numericValue;

    // Se il valore è una stringa vuota, lascialo così
    if (value === '') {
      numericValue = '';
    } else {
      numericValue = parseInt(value, 10) || 0;
    }

    if (isNaN(numericValue) || numericValue < 0) {
      // Mostra un avviso
      toast.error('Il valore non può essere negativo', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Resetta il campo specifico
      if (name === 'votanti') {
        setVotanti(0);
      } else if (name === 'votiNulli') {
        setVotiNulli(0);
      } else {
        // Reset specific candidate's votes
        setVotiCandidati((prevVoti) => {
          return prevVoti.map(v => v.idCandidato === name ? { ...v, voti: 0 } : v);
        });
      }
    } else {
      if (name === 'votanti') {
        setVotanti(numericValue);
      } else if (name === 'votiNulli') {
        setVotiNulli(numericValue);
      } else {
        // Update votiCandidati for the specific candidate
        setVotiCandidati((prevVoti) => {
          const updatedVoti = [...prevVoti];
          const index = updatedVoti.findIndex(v => v.idCandidato == name);
          if (index > -1) {
            updatedVoti[index].voti = numericValue;
          }
          return updatedVoti;
        });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.setMessage('');

    let totVoti = 0;
    votiCandidati.forEach((e) => {
      totVoti += e.voti;
    });

    // TODO: questo controllo è  richiesto?
    if (totVoti !== (votanti + votiNulli) || votiNulli > votanti || votiNulli > totVoti) {
      handleErrors({ error: 'Valori non corrispondenti! Ricontrolla!' });

      return
    }

    const dataToSubmit = {
      ufficio,
      votanti,
      votiNulli,
      votiCandidati,
    };
    console.log('Dati da inviare al server:', JSON.stringify(dataToSubmit));
    API.insertScrutinio(dataToSubmit).then(() => {
      props.setMessage({
        msg: 'Scrutinio inviato con successo!',
        type: 'success'
      });
      // navigate home
    }).catch((error) => {
      handleErrors(error);
    });
  };

  return (
    <>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <h1 className="text-center mb-4">Compila il Form</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="ufficio">
                <Form.Label className="bold-label">Bureau de Vote</Form.Label>
                <Form.Select
                  name="ufficio"
                  value={ufficio}
                  onChange={(e) => {
                    const selectedId = e.target.value; // Ora otteniamo direttamente l'id dell'ufficio anziché il nome
                    setUfficio(selectedId);
                  }}
                  required
                >
                  <option value="" disabled>Seleziona il Bureau de Vote</option>
                  {uffici.map((ufficio) => (
                    <option key={ufficio.id} value={ufficio.id}>{ufficio.nome}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="votanti">
                <Form.Label className="bold-label">Nombre de votants</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Inserisci il numero di votants"
                  name="votanti"
                  value={votanti}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="votiNulli">
                <Form.Label className="bold-label">Nombre de votes nuls</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Inserisci il valore di nuls"
                  name="votiNulli"
                  value={votiNulli}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Row className="form-row">
                {candidati.map((candidato) => {
                  let votiCandidato = votiCandidati.find(v => v.idCandidato === candidato.id)?.voti || '';
                  
                  /*<Col key={index} xs={12} sm={6}></Col>*/
                  return (<Col key={candidato.id} xs={12} sm={6}>
                    <Form.Group controlId={`form${candidato.id}`}>
                    <Form.Label className="bold-label">
                    {`${candidato.nome} ${candidato.cognome}`}
                    </Form.Label>
                    
                      <Form.Control
                        type="number"
                        placeholder={`Inserisci il numero di voti per ${candidato.nome} ${candidato.cognome}`}
                        name={candidato.id}
                        value={votiCandidato}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  );
                })}
              </Row>

              <Button variant="primary" type="submit">
                Invia
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </>
  );
}

export default FormPage;
