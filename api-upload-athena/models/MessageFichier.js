const db = require("../config/database");

class MessageFichier {
  static async create(fichierData) {
    const query = `
      INSERT INTO fichiers (nom, chemin, mime_type, created_at, mg_id) 
      VALUES (?, ?, ?, NOW(), ?)
    `;

    try {
      console.log("Insertion fichier avec données:", fichierData);
      const [result] = await db.query(query, [
        fichierData.nom,
        fichierData.chemin,
        fichierData.mime_type,
        fichierData.mg_id,
      ]);
      return result;
    } catch (error) {
      console.error("Erreur création fichier message:", error);
      throw error;
    }
  }
}

module.exports = MessageFichier;
