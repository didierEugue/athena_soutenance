const db = require("../config/database");

class OFFichier {
  static async create(fichierData) {
    const query = `
      INSERT INTO fichiers (nom, chemin, mime_type, created_at, ofab_id) 
      VALUES (?, ?, ?, NOW(), ?)
    `;

    try {
      console.log("Insertion fichier avec données:", fichierData);
      const [result] = await db.query(query, [
        fichierData.nom,
        fichierData.chemin,
        fichierData.mime_type,
        fichierData.ofab_id,
        // fichierData.mimeType,
        // fichierData.ofId,
      ]);
      console.log("Structure de la requête SQL:", query);
      console.log("Paramètres:", [
        fichierData.nom,
        fichierData.chemin,
        fichierData.mime_type,
        fichierData.ofab_id,
      ]);
      console.log("Résultat insertion:", result);
      return result;
    } catch (error) {
      console.error("Erreur création fichier OF:", error);
      throw error;
    }
  }
}

module.exports = OFFichier;
