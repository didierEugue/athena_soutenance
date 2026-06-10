const db = require("../config/database");

class Fichier {
  static async create(fichierData) {
    const query = `
      INSERT INTO fichiers (nom, chemin, mime_type, created_at, utilisateur_id) 
      VALUES (?, ?, ?, NOW(), ?)
    `;

    try {
      console.log("Données avant insertion:", fichierData);
      const [result] = await db.query(query, [
        fichierData.nom,
        fichierData.chemin,
        fichierData.mimeType,
        fichierData.utilisateurId,
      ]);
      console.log("Résultat insertion:", result);
      return result;
    } catch (error) {
      console.error("Erreur création fichier:", error);
      throw error;
    }
  }

  static async getByUtilisateurId(utilisateurId) {
    const query = `
      SELECT f.* 
      FROM fichiers f
      WHERE f.utilisateur_id = ?
      ORDER BY f.created_at DESC
      LIMIT 1
    `;

    try {
      const [result] = await db.query(query, [utilisateurId]);
      return result[0];
    } catch (error) {
      console.error("Erreur récupération fichier:", error);
      throw error;
    }
  }
}

module.exports = Fichier;
