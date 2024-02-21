const daoGeneral = require('../../daoGeneral');
const dayjs = require('dayjs');

const getCandidati = async (req, res) => {
  try {
      const candidati = await daoGeneral.getCandidati();
      if (candidati.error) {
          return res.status(404).json(candidati);
      } else {
          return res.status(200).json(candidati);
      }
  } catch (e) {
      return res.status(500).json(e.message);
  }
}

const getUffici = async (req, res) => {
  try {
      const Uffici = await daoGeneral.getUffici();
      if (Uffici.error) {
          return res.status(404).json(Uffici);
      } else {
          return res.status(200).json(Uffici);
      }
  } catch (e) {
      return res.status(500).json(e.message);
  }
}

const insertNewScrutinio = async (req, res) => {
    const ufficioId = req.body.ufficio;
    const nVotanti = req.body.votanti;
    const nVotiNulli = req.body.votiNulli;
    const votiCandidati = req.body.votiCandidati;
    const timestamp = dayjs().format("DD/MM/YYYY HH:mm:ss");

    if (!req.user.id) {
        return res.status(401).json({ error: "Unauthorized! Do login" });
    }
    try {
        // avoid dupplications
        const scrutini = await daoGeneral.getScrutinioByUfficioId(ufficioId); 
        console.log(scrutini);
        if (scrutini && scrutini.length > 0) {
            return res.status(400).json({ error: `Lo scrutinio per questo Ufficio è stato già inserito!`});
        }

        // insert scrutinio
        const scrutinioId = await daoGeneral.insertScrutinio(ufficioId, nVotanti, nVotiNulli,  timestamp, req.user.id);
        // insert votes for candidati
        votiCandidati.forEach(async (voto) => {
           await daoGeneral.insertVotoCandidato(scrutinioId, voto);
        });

        return res.status(201).json(scrutinioId);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

module.exports = {
  getCandidati, 
  getUffici,
  insertNewScrutinio
};


  
