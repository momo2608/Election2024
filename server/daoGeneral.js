const db = require('./db');
const { Candidato } = require('./model');

exports.getCandidati = () => {
  return new Promise((resolve, reject) => {
    const sql =  'SELECT * from Candidati';
    db.all(
      sql,
      (err, rows) => {
        if (err) {
          reject(err);
        }
        else {
          const candidati = rows.map(row => (
            new Candidato(row.id, row.nome, row.cognome)
          ));
          resolve(candidati);
        }
      });
  });
};

exports.getUffici = () => {
  return new Promise((resolve, reject) => {
    const sql =  'SELECT * from Uffici ORDER BY nome';
    db.all(
      sql,
      (err, rows) => {
        if (err) {
          reject(err);
        }
        else {
          const uffici = rows.map(row => ({
            id: row.id,
            nome: row.nome
          }))
          resolve(uffici);
        }
      });
  });
};

exports.getScrutinioByUfficioId = (ufficioId) => {
  return new Promise((resolve, reject) => {
    const sql =  'SELECT * FROM Scrutinio WHERE ufficioId=? ';
    db.all(
      sql,
      [ufficioId],
      (err, rows) => {
        if (err) {
          reject(err);
        }
        else {
          const scrutinio = rows.map(row => ({
            id: row.id,
          }))
          resolve(scrutinio);
        }
      });
  });
};

exports.insertScrutinio = (ufficioId, nVotanti, nVotiNulli,  timestamp, userId) => {
  return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO Scrutinio (ufficioId, votanti, votiNulli, time, userId) VALUES (?,?,?,?,?)';
      db.run(
          sql,
          [ufficioId, nVotanti, nVotiNulli, timestamp, userId],
          function (err) {
              if (err) {
                  reject(err);
              } else {
                // return id of the scrutinio just inserted
                resolve(this.lastID);
              }
          }
      );
  });
};

exports.insertVotoCandidato = (scrutinioId, voto) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO Voti (scrutinioId, candidatoId, voti) VALUES (?,?,?)';
    db.run(
        sql,
        [scrutinioId, voto.idCandidato, voto.voti],
        function (err) {
            if (err) {
                reject(err);
            } else {
              resolve(this.changes);
            }
        }
    );
});
};