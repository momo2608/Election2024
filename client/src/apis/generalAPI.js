const SERVER_URL = 'http://localhost:3001/api';


// session apis

const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + '/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + '/sessions/current', {
    credentials: 'include',
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user;  // an object with the error coming from the server
  }
};

const logOut = async () => {
  const response = await fetch(SERVER_URL + '/sessions/current', {
    method: 'DELETE',
    credentials: 'include',
  });
  if (response.ok)
    return null;
}

const getUffici = async () => {
  const response = await fetch(SERVER_URL + '/uffici', {
    credentials: 'include',
  });

  const uffici = await response.json();
  if (response.ok) {
    return uffici;
  } else {
    throw uffici;
  }
}

const getCandidati = async () => {
  const response = await fetch(SERVER_URL + '/candidati', {
    credentials: 'include',
  });

  const candidati = await response.json();
  if (response.ok) {
    return candidati;
  } else {
    throw candidati;
  }
}

const insertScrutinio = async (data) => {

  const response = await fetch(SERVER_URL + '/newscrutinio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  const res = await response.json();
  if (response.ok) {
    return res;
  } else {
    throw res;
  }
}

const API = { getUserInfo, logIn, logOut, getUffici, getCandidati, insertScrutinio };
export default API;