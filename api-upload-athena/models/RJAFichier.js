// models/RJAFichier.js
const db = require("../config/database");

class RJAFichier {
  static async create(fichierData) {
    const query = `
      INSERT INTO fichiers (nom, chemin, mime_type, created_at, rja_id) 
      VALUES (?, ?, ?, NOW(), ?)
    `;

    try {
      console.log("Insertion fichier avec données:", fichierData);
      const [result] = await db.query(query, [
        fichierData.nom,
        fichierData.chemin,
        fichierData.mime_type,
        fichierData.rja_id,
      ]);
      return result;
    } catch (error) {
      console.error("Erreur création fichier RJA:", error);
      throw error;
    }
  }
}

module.exports = RJAFichier;
