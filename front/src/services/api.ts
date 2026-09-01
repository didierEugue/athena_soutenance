import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { AuthModel, UserModel } from "../app/modules/auth/core/_models";
import { getAuth } from "../app/modules/auth/core/AuthHelpers";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;
const UPLOAD_URL = import.meta.env.VITE_UPLOAD_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/ld+json",
    Accept: "application/ld+json",
  },
});

// setupAxios() n'installe son intercepteur que sur l'instance globale d'axios,
// et une instance issue d'axios.create() n'en herite pas : sans ce doublon, les
// appels passant par `api` partiraient sans en-tete Authorization et l'API les
// rejetterait en 401.
api.interceptors.request.use((config) => {
  const auth = getAuth();
  if (auth && auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

export const login = async (
  username: string,
  password: string
): Promise<AuthModel> => {
  try {
    const response = await api.post("/login_check", { username, password });
    const { token } = response.data;
    const decodedToken = jwtDecode(token) as UserModel;

    // saveAuth() n'est appele qu'au retour de cette fonction : le token n'est
    // pas encore dans localStorage, l'intercepteur ne peut donc pas le poser.
    const userResponse = await api.get(`/utilisateurs/${decodedToken.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const userData = userResponse.data;

    // Enrichir le decodedToken avec les informations complètes
    decodedToken.role = userData.role;
    // const completeUser = {
    //   ...decodedToken,
    //   role: userResponse.data.role,
    // };

    const completeUser = {
      id: userResponse.data.id,
      username: userResponse.data.email,
      nom: userResponse.data.nom,
      prenom: userResponse.data.prenoms,
      telephone: userResponse.data.telephone,
      adresse: userResponse.data.adresse,
      actif: userResponse.data.actif,
      roles: decodedToken.roles,
      role: userResponse.data.role,
    };

    try {
      const avatarResponse = await axios.get(
        `${UPLOAD_URL}/api/avatar/${decodedToken.id}`
      );
      if (avatarResponse.data.success) {
        decodedToken.avatar_url = avatarResponse.data.data.url;
      }
    } catch (error) {
      console.log("Pas d'avatar trouvé");
    }

    return { token, user: decodedToken };
  } catch (error) {
    console.log("Identifiant ou mot de passe incorrect");
    throw error;
  }
};

//! Entité Utilisateurs
// export const getUsers = async () => {
//   const response = await api.get("/utilisateurs");
//   return response.data;
// };
export const getUsers = async () => {
  const response = await api.get("/utilisateurs");
  const users = response.data["hydra:member"];

  // Enrichir chaque utilisateur avec son avatar
  const enrichedUsers = await Promise.all(
    users.map(async (user: any) => {
      try {
        const avatarResponse = await axios.get(
          `${UPLOAD_URL}/api/avatar/${user.id}`
        );
        if (avatarResponse.data.success) {
          return {
            ...user,
            avatar_url: avatarResponse.data.data.url,
          };
        }
        return user;
      } catch (error) {
        return user;
      }
    })
  );

  return {
    ...response.data,
    "hydra:member": enrichedUsers,
  };
};

export const getUser = async (id: number) => {
  const response = await api.get(`/utilisateurs/${id}`);
  return response.data;
};

export const createUser = async (userData: any) => {
  const response = await api.post("/utilisateurs", userData);
  return response.data;
};

export const updateUser = async (id: number, userData: any) => {
  const response = await api.patch(`/utilisateurs/${id}`, userData, {
    headers: {
      "Content-Type": "application/merge-patch+json",
    },
  });
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await api.delete(`/utilisateurs/${id}`);
  return response.data;
};
interface User {
  id: number;
  nom: string;
  prenoms: string;
  email: string;
  roles: string[] | []; // Tableau vide par défaut si pas de rôles
}

//! Entité Rôles

export interface Role {
  id?: number;
  code: string;
  nom: string;
  coefficient_qualification: string;
  utilisateurs?: {
    id: number;
    nom: string;
    prenoms: string;
  }[];
}

export const getRoles = async () => {
  const response = await api.get("/roles");
  return response.data["hydra:member"];
};

export const createRole = async (roleData: Role) => {
  const response = await api.post("/roles", roleData);
  return response.data;
};

export const updateRole = async (id: number, roleData: Role) => {
  const response = await api.put(`/roles/${id}`, roleData);
  return response.data;
};

export const deleteRole = async (id: number) => {
  const response = await api.delete(`/roles/${id}`);
  return response.data;
};

//! Entité Clients
export interface Client {
  id?: number;
  nom: string;
  telephone: string;
  email: string;
  adresse: string;
}

// Obtenir tous les clients
export const getClients = async () => {
  const response = await api.get("/clients");
  return response.data["hydra:member"];
};

// Obtenir un client spécifique
export const getClient = async (id: number) => {
  const response = await api.get(`/clients/${id}`);
  return response.data;
};

// Créer un nouveau client
export const createClient = async (clientData: Client) => {
  const response = await api.post("/clients", clientData);
  return response.data;
};

// Mettre à jour un client
export const updateClient = async (id: number, clientData: Client) => {
  const response = await api.patch(`/clients/${id}`, clientData, {
    headers: {
      "Content-Type": "application/merge-patch+json",
    },
  });
  return response.data;
};

// Supprimer un client
export const deleteClient = async (id: number) => {
  await api.delete(`/clients/${id}`);
};

//! Entité Fournisseurs
export interface Fournisseur {
  id?: number;
  nom: string;
  telephone: string;
  email: string;
  adresse: string;
}

export const getFournisseurs = async () => {
  const response = await api.get("/fournisseurs");
  return response.data["hydra:member"];
};

export const getFournisseur = async (id: number) => {
  const response = await api.get(`/fournisseurs/${id}`);
  return response.data;
};

export const createFournisseur = async (fournisseurData: Fournisseur) => {
  const response = await api.post("/fournisseurs", fournisseurData);
  return response.data;
};

export const updateFournisseur = async (
  id: number,
  fournisseurData: Fournisseur
) => {
  const response = await api.patch(`/fournisseurs/${id}`, fournisseurData, {
    headers: {
      "Content-Type": "application/merge-patch+json",
    },
  });
  return response.data;
};

export const deleteFournisseur = async (id: number) => {
  await api.delete(`/fournisseurs/${id}`);
};

//! Entité TachesFacturables
export interface TacheFacturable {
  id?: number;
  '@id'?: string;
  code: string;
  nom: string;
  cout_horaire: string;
  facturable: boolean;
  categorie: string;
}

// Ajoutez ces fonctions
export const getTachesFacturables = async () => {
  const response = await api.get("/tache_facturables");
  return response.data["hydra:member"];
};

export const createTacheFacturable = async (tacheData: TacheFacturable) => {
  const response = await api.post("/tache_facturables", tacheData);
  return response.data;
};

export const updateTacheFacturable = async (
  id: number,
  tacheData: TacheFacturable
) => {
  const response = await api.patch(`/tache_facturables/${id}`, tacheData, {
    headers: {
      "Content-Type": "application/merge-patch+json",
    },
  });
  return response.data;
};

export const deleteTacheFacturable = async (id: number) => {
  await api.delete(`/tache_facturables/${id}`);
};

//! Entité Affaire et Ordre de fabrication
export interface Affaire {
  id?: number;
  '@id'?: string;
  numero: string;
  nom: string;
  description: string;
  date_creation?: string;
  date_cloture: string;
  cout_total?: string;
  statut: "standby" | "en_cours" | "terminé" | "cloture" | "archive";
  client?: string | null | { nom: string; [key: string]: any };
  ordreFabrications?: OrdreFabrication[];
}

export interface OrdreFabrication {
  id?: number;
  '@id'?: string;
  numero: string;
  nom: string;
  description: string;
  date_cloture: string;
  indice: number;
  statut: "standby" | "en_cours" | "terminé";
  affaire?: string | { nom: string; numero: string; [key: string]: any };
  files?: File[];
  existingFiles?: Array<{
    id: number;
    nom: string;
    chemin: string;
    mime_type: string;
    url: string;
  }>;
}

// Ajoutez ces fonctions
export const getAffaires = async () => {
  const response = await api.get("/affaires");
  return response.data["hydra:member"];
};

export const getAffaire = async (id: number) => {
  const response = await api.get(`/affaires/${id}`);
  return response.data;
};

export const getLastAffaire = async () => {
  const response = await api.get(
    "/affaires?order[id]=desc&page=1&itemsPerPage=1"
  );
  return response.data["hydra:member"][0];
};

export const createAffaire = async (affaireData: Affaire) => {
  const response = await api.post("/affaires", affaireData);
  return response.data;
};

export const updateAffaire = async (
  id: number,
  affaireData: Partial<Affaire>
) => {
  const response = await api.patch(`/affaires/${id}`, affaireData, {
    headers: {
      "Content-Type": "application/merge-patch+json",
    },
  });
  return response.data;
};

export const deleteAffaire = async (id: number) => {
  await api.delete(`/affaires/${id}`);
};

// Fonctions pour les ordres de fabrication
export const getOrdreFabrications = async () => {
  const response = await api.get("/ordre_fabrications");
  return response.data["hydra:member"];
};

export const createOrdreFabrication = async (ofData: OrdreFabrication) => {
  const response = await api.post("/ordre_fabrications", ofData);
  return response.data;
};

export const updateOrdreFabrication = async (
  id: number,
  ofData: Partial<OrdreFabrication>
) => {
  const response = await api.patch(`/ordre_fabrications/${id}`, ofData, {
    headers: {
      "Content-Type": "application/merge-patch+json",
    },
  });
  return response.data;
};

export const deleteOrdreFabrication = async (id: number) => {
  await api.delete(`/ordre_fabrications/${id}`);
};

export interface TypeChiffrage {
  id: number;
  nom: string;
}

export interface Chiffrage {
  id?: number;
  cout: number;
  type: {
    id: number;
    nom: string;
  };
  affaire: {
    id: number;
    numero: string;
    nom: string;
  };
  client: {
    id: number;
    nom: string;
  };
  fournisseur: {
    id: number;
    nom: string;
  };
}

// Ajouter ces fonctions
export const getChiffrages = async () => {
  const response = await api.get("/chiffrages");
  return response.data["hydra:member"];
};

export const createChiffrage = async (chiffrageData: {
  cout: number;
  type: string;
  affaire: string;
  fournisseur: string;
}) => {
  const response = await api.post("/chiffrages", chiffrageData);
  return response.data;
};

export const updateChiffrage = async (
  id: number,
  chiffrageData: {
    cout?: number;
    type?: string;
    affaire?: string;
    fournisseur?: string;
  }
) => {
  const response = await api.patch(`/chiffrages/${id}`, chiffrageData, {
    headers: {
      "Content-Type": "application/merge-patch+json",
    },
  });
  return response.data;
};

export const deleteChiffrage = async (id: number) => {
  await api.delete(`/chiffrages/${id}`);
};

export const getTypeChiffrages = async (): Promise<TypeChiffrage[]> => {
  const response = await api.get("/type_chiffrages");
  return response.data["hydra:member"];
};

export const updateAffaireStatus = async (
  id: number,
  statut: "standby" | "en_cours" | "terminé"
) => {
  const response = await api.patch(
    `/affaires/${id}`,
    { statut },
    {
      headers: {
        "Content-Type": "application/merge-patch+json",
      },
    }
  );
  return response.data;
};

// Ajouter ces nouvelles interfaces et fonctions
export interface OrdreFabricationResponse {
  id: number;
  numero: string;
  nom: string;
  description: string;
  date_cloture: string;
  indice: number;
  statut: "standby" | "en_cours" | "terminé";
  affaire: {
    id: number;
    nom: string;
    statut: "standby" | "en_cours" | "terminé";
  };
}

// Fonction pour mettre à jour le statut d'un OF
export const updateOFStatus = async (
  id: number,
  statut: "standby" | "en_cours" | "terminé"
) => {
  const response = await api.patch(
    `/ordre_fabrications/${id}`,
    { statut },
    {
      headers: {
        "Content-Type": "application/merge-patch+json",
      },
    }
  );
  return response.data;
};

// Ajout des nouvelles interfaces
export interface TacheParActivite {
  id?: number;
  tache_facturable: string | TacheFacturable;
  ordre_fabrication: string | OrdreFabrication;
  type_activite: string;
  description: string;
  duree: string;
  date?: string;
  statut: "Standby" | "Validé" | "Rejeté" | "Réfusé";
  executeur: string | { id: number; nom: string; prenoms: string; role?: any };
  validateur?: string | { id: number; nom: string; prenoms: string };
}

// Ajout des nouvelles fonctions API
export const getTacheParActivites = async () => {
  const response = await api.get("/tache_par_activites");
  return response.data["hydra:member"];
};

export const createTacheParActivite = async (
  tacheData: Partial<TacheParActivite>
) => {
  const response = await api.post("/tache_par_activites", tacheData);
  return response.data;
};

export const updateTacheParActivite = async (
  id: number,
  tacheData: Partial<TacheParActivite>
) => {
  const response = await api.patch(`/tache_par_activites/${id}`, tacheData, {
    headers: {
      "Content-Type": "application/merge-patch+json",
    },
  });
  return response.data;
};

export const deleteTacheParActivite = async (id: number) => {
  await api.delete(`/tache_par_activites/${id}`);
};

export interface Agenda {
  id?: number;
  date_debut: string;
  date_fin: string;
  titre: string;
  description: string;
  importance:
    | "urgent/important"
    | "important/non_urgent"
    | "urgent/non_important"
    | "non_important/non_urgent";
  expediteur: string | { id?: number; nom: string; prenoms: string };
  destinataire: string | string[] | { id?: number; nom: string; prenoms: string };
  type: "SAV" | "Service Client" | "GPA";
  statut: "standby" | "terminé";
}

export const createAgenda = async (agendaData: Partial<Agenda>) => {
  const response = await api.post("/agendas", agendaData, {
    headers: {
      "Content-Type": "application/ld+json",
    },
  });
  return response.data;
};

// Ajouter ces fonctions avec les autres fonctions API
export const getAgendas = async () => {
  const response = await api.get("/agendas");
  return response.data["hydra:member"];
};

export const getAgenda = async (id: number) => {
  const response = await api.get(`/agendas/${id}`);
  return response.data;
};

export const updateAgenda = async (id: number, agendaData: Partial<Agenda>) => {
  const response = await api.patch(`/agendas/${id}`, agendaData, {
    headers: {
      "Content-Type": "application/merge-patch+json",
    },
  });
  return response.data;
};

export const deleteAgenda = async (id: number) => {
  await api.delete(`/agendas/${id}`);
};

// Ajouter cette fonction avec les autres fonctions API
export const getUtilisateurs = async () => {
  const response = await api.get("/utilisateurs");
  return response.data["hydra:member"];
};

// Interfaces pour la messagerie
export interface Message {
  id?: number;
  expediteur:
    | {
        id: number;
        nom: string;
        prenoms: string;
      }
    | string;
  destinataire:
    | {
        id: number;
        nom: string;
        prenoms: string;
      }
    | string;
  contenu: string;
  date_envoie: string;
  statut: boolean;
}

// Fonctions API pour les messages
export const getMessages = async () => {
  const response = await api.get("/messages");
  return response.data["hydra:member"];
};

export const getMessagesByUsers = async (
  expediteurId: number,
  destinataireId: number
) => {
  const response = await api.get(
    `/messages?expediteur=${expediteurId}&destinataire=${destinataireId}`
  );
  return response.data["hydra:member"];
};

export const sendMessage = async (messageData: {
  expediteur: string;
  destinataire: string;
  contenu: string;
  date_envoie: string;
  statut: boolean;
}) => {
  const response = await api.post("/messages", messageData);
  return response.data;
};

// export const getMessages = async () => {
//   const response = await api.get("/messages");
//   return response.data["hydra:member"]; // Retourne directement le tableau de messages
// };
export const updateMessageStatus = async (
  messageId: number,
  status: boolean
) => {
  const response = await api.patch(
    `/messages/${messageId}`,
    { statut: status },
    {
      headers: {
        "Content-Type": "application/merge-patch+json",
      },
    }
  );
  return response.data;
};

// Ajoutez ces interfaces
export interface Objet {
  id: number;
  objet_discussion: string;
  statut: string;
  reponse: string;
  archiver: boolean;
  nature: string;
}

export interface MessageGroupe {
  id?: number;
  objet: Objet | string;
  expediteur: any;
  role: any;
  contenu: string;
  date_envoi: string;
  participant: any;
}

export interface Participant {
  id: number;
}

export interface ParticipantGroupe {
  id: number;
  participant: string;
  utilisateur: {
    id: number;
    nom: string;
    prenoms: string;
  };
}

// Ajoutez ces fonctions
export const getObjets = async () => {
  const response = await api.get("/objets");
  return response.data["hydra:member"];
};

export const getMessageGroupes = async () => {
  const response = await api.get("/message_groupes");
  return response.data["hydra:member"];
};

export const sendGroupMessage = async (messageData: {
  objet: string;
  expediteur: string;
  role: string;
  contenu: string;
  date_envoi: string;
  participant: string;
}) => {
  const response = await api.post("/message_groupes", messageData);
  return response.data;
};

export const getParticipants = async () => {
  const response = await api.get("/participants");
  return response.data["hydra:member"];
};

export const getParticipantsGroupes = async () => {
  const response = await api.get("/participants_groupes");
  return response.data["hydra:member"];
};

export const createParticipant = async () => {
  const response = await api.post("/participants", {});
  return response.data;
};

export const createParticipantGroupe = async (data: {
  participant: string;
  utilisateur: string;
}) => {
  const response = await api.post("/participants_groupes", data);
  return response.data;
};

export const updateObjetStatus = async (id: number, reponse: string) => {
  const response = await api.patch(
    `/objets/${id}`,
    {
      reponse: reponse,
      statut: "Résolue",
      date_resolu: new Date().toISOString(),
    },
    {
      headers: {
        "Content-Type": "application/merge-patch+json",
      },
    }
  );
  return response.data;
};

export const createObjet = async (objetData: {
  objet_discussion: string;
  nature: string;
  statut: string;
  reponse: string;
  archiver: boolean;
}) => {
  const response = await api.post("/objets", objetData);
  return response.data;
};

// Ajout des interfaces pour les statistiques
export interface StatistiqueUtilisateur {
  affaire: string;
  of: string;
  tacheFacturable: string;
  coefficient: number;
  total: number;
  typeActivite: string;
  statut: string;
}

export interface StatistiqueAffaire {
  utilisateur: string;
  heures: number;
  cout: number;
}

// Ajout des fonctions pour récupérer les statistiques
export const getStatistiquesUtilisateur = async (
  userId: number,
  startDate: string,
  endDate: string
) => {
  const response = await api.get(
    `/tache_par_activites?executeur=${userId}&date[after]=${startDate}&date[before]=${endDate}`
  );
  return response.data["hydra:member"];
};

export const getStatistiquesAffaire = async (
  affaireId: number,
  startDate: string,
  endDate: string
) => {
  const response = await api.get(
    `/tache_par_activites?ordre_fabrication.affaire=${affaireId}&date[after]=${startDate}&date[before]=${endDate}`
  );
  return response.data["hydra:member"];
};

export interface Consigne {
  id: number;
  titre: string;
  type: string;
  contenu: string;
  etat: string;
  date_creation: string;
  date_echeance: string;
  priorite: string;
  expediteur: any;
  destinataire: any;
}

export const getConsignes = async () => {
  const response = await api.get("/consignes");
  return response.data;
};

export const updateConsigneStatus = async (id: number, etat: string) => {
  const response = await api.patch(
    `/consignes/${id}`,
    { etat },
    {
      headers: {
        "Content-Type": "application/merge-patch+json",
      },
    }
  );
  return response.data;
};

export const createConsigne = async (consigneData: any) => {
  const response = await api.post("/consignes", consigneData);
  return response.data;
};

export const updateConsigne = async (id: number, consigneData: any) => {
  const response = await api.patch(`/consignes/${id}`, consigneData, {
    headers: {
      "Content-Type": "application/merge-patch+json",
    },
  });
  return response.data;
};

export const deleteConsigne = async (id: number) => {
  const response = await api.delete(`/consignes/${id}`);
  return response.data;
};

// Ajout des nouvelles interfaces
export interface DetailChiffrage {
  id: number;
  cout: number;
  type: {
    id: number;
    nom: string;
  };
  affaire: {
    id: number;
    numero: string;
    nom: string;
  };
}

export interface DetailTacheParActivite {
  id: number;
  tache_facturable: {
    id: number;
    code: string;
    nom: string;
    cout_horaire: string;
    facturable: boolean;
  };
  duree: string;
  date: string;
  statut: string;
  executeur: {
    id: number;
    nom: string;
    prenoms: string;
    role: {
      id: number;
      nom: string;
      coefficient_qualification: string;
    };
  };
}

// Nouvelle fonction pour obtenir les chiffrages d'une affaire spécifique
export const getChiffragesParAffaire = async (affaireId: number) => {
  const response = await api.get(`/chiffrages?affaire.id=${affaireId}`);
  return response.data["hydra:member"];
};

// Fonction utilitaire pour calculer le coût de main d'œuvre
export const calculerCoutMainOeuvre = (
  tache: DetailTacheParActivite
): number => {
  if (!tache.tache_facturable.facturable) return 0;

  const coefficient = parseFloat(
    tache.executeur.role.coefficient_qualification
  );
  const heures = parseFloat(tache.duree);
  const coutHoraire = parseFloat(tache.tache_facturable.cout_horaire);

  return coefficient * heures * coutHoraire;
};

// Fonction pour calculer le coût total d'une affaire
export const calculerCoutTotalAffaire = (
  chiffrages: DetailChiffrage[],
  taches: DetailTacheParActivite[]
): number => {
  const totalChiffrages = chiffrages.reduce(
    (acc, chiffrage) => acc + chiffrage.cout,
    0
  );
  const totalMainOeuvre = taches.reduce(
    (acc, tache) => acc + calculerCoutMainOeuvre(tache),
    0
  );

  return totalChiffrages + totalMainOeuvre;
};

export const uploadAvatar = async (file: File, utilisateurId: number) => {
  try {
    const formData = new FormData();
    formData.append("fichier", file);
    formData.append("utilisateurId", utilisateurId.toString());

    const response = await axios.post(
      `${UPLOAD_URL}/api/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        validateStatus: (status) => status < 500,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Erreur lors de l'upload");
    }

    return response.data;
  } catch (error) {
    console.error("Erreur uploadAvatar:", error);
    throw error;
  }
};

// export const uploadOFFichiers = async (ofId: number, files: File[]) => {
//   if (files.length === 0) return { success: true, data: [] };

//   const formData = new FormData();
//   formData.append("ofId", ofId.toString());
//   files.forEach((file) => {
//     formData.append("fichiers", file);
//   });

//   const response = await axios.post(
//     `${UPLOAD_URL}/api/of-upload",
//     formData,
//     {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     }
//   );
//   return response.data;
// };
// export const uploadOFFichiers = async (ofId: number, files: File[]) => {
//   const formData = new FormData();
//   formData.append("ofId", ofId.toString());
//   files.forEach((file) => {
//     formData.append("fichiers", file); // Assurez-vous que ce nom correspond à celui attendu par le middleware
//   });

//   console.log("Uploading files for OF:", ofId); // Ajout de log
//   const response = await axios.post(
//     `${UPLOAD_URL}/api/of-upload",
//     formData,
//     {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     }
//   );
//   return response.data;
// };

// export const uploadOFFichiers = async (ofId: number, files: File[]) => {
//   console.log("Début upload, OF ID:", ofId);
//   console.log("Fichiers:", files);

//   if (files.length === 0) return { success: true, data: [] };

//   const formData = new FormData();
//   formData.append("ofId", ofId.toString());
//   files.forEach((file) => {
//     formData.append("fichiers", file);
//   });

//   try {
//     console.log("Envoi des fichiers pour OF:", ofId);
//     const response = await axios.post(
//       `${UPLOAD_URL}/api/of-upload`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );
//     console.log("Réponse upload:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Erreur upload:", error);
//     throw error;
//   }
// };

export const uploadOFFichiers = async (
  ofId: number,
  files: File[]
): Promise<any> => {
  if (!files || files.length === 0) {
    return { success: true, data: [] };
  }

  const formData = new FormData();
  formData.append("ofId", ofId.toString());
  files.forEach((file) => {
    formData.append("fichiers", file);
  });

  try {
    const response = await axios.post(
      `${UPLOAD_URL}/api/of-upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30 secondes timeout
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Erreur lors de l'upload");
    }

    return response.data;
  } catch (error: any) {
    console.error("Erreur upload fichiers:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Erreur lors de l'upload des fichiers"
    );
  }
};

// export const getOFFichiers = async (ofId: number) => {
//   try {
//     const response = await axios.get(
//       `${UPLOAD_URL}/api/ordre_fabrications/${ofId}/fichiers`
//     );
//     return response.data["hydra:member"].map((fichier: any) => ({
//       id: fichier.id,
//       nom: fichier.nom,
//       chemin: fichier.chemin,
//       mime_type: fichier.mime_type,
//       url: `${UPLOAD_URL}/uploads/${fichier.chemin}`,
//     }));
//   } catch (error) {
//     console.error("Erreur récupération fichiers OF:", error);
//     return [];
//   }
// };
// export const getOFFichiers = async (ofId: number) => {
//   try {
//     const response = await api.get(`/ordre_fabrications/${ofId}/fichiers`);
//     return response.data["hydra:member"].map((fichier: any) => ({
//       id: fichier.id,
//       nom: fichier.nom,
//       chemin: fichier.chemin,
//       mime_type: fichier.mime_type,
//       url: `${UPLOAD_URL}/uploads/${fichier.chemin}`, // URL du serveur Express
//     }));
//   } catch (error) {
//     console.error("Erreur récupération fichiers OF:", error);
//     return [];
//   }
// };

// export const getOFFichiers = async (ofId: number) => {
//   try {
//     const response = await axios.get(
//       `${UPLOAD_URL}/api/ordre_fabrications/${ofId}/fichiers`
//     );
//     return response.data["hydra:member"].map((fichier: any) => ({
//       id: fichier.id,
//       nom: fichier.nom,
//       chemin: fichier.chemin,
//       mime_type: fichier.mime_type,
//       url: `${UPLOAD_URL}/uploads/${fichier.chemin}`,
//     }));
//   } catch (error) {
//     console.error("Erreur récupération fichiers OF:", error);
//     return [];
//   }
// };

export const getOFFichiers = async (ofId: number) => {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_UPLOAD_URL
      }/api/ordre_fabrications/${ofId}/fichiers`
    );
    return response.data["hydra:member"].map((fichier: any) => ({
      id: fichier.id,
      nom: fichier.nom,
      chemin: fichier.chemin,
      mime_type: fichier.mime_type,
      url: `${import.meta.env.VITE_UPLOAD_URL}/uploads/${fichier.chemin}`,
    }));
  } catch (error) {
    console.error("Erreur récupération fichiers OF:", error);
    return [];
  }
};

// api.ts - Ajouter ces fonctions
export const uploadRJAFichiers = async (rjaId: number, files: File[]) => {
  const formData = new FormData();
  formData.append("rjaId", rjaId.toString());
  files.forEach((file) => {
    formData.append("fichiers", file);
  });

  try {
    const response = await axios.post(
      `${UPLOAD_URL}/api/rja-upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur upload:", error);
    throw error;
  }
};

export const getRJAFichiers = async (rjaId: number) => {
  try {
    const response = await axios.get(
      `${UPLOAD_URL}/api/tache_par_activites/${rjaId}/fichiers`
    );
    return response.data["hydra:member"].map((fichier: any) => ({
      ...fichier,
      url: `${UPLOAD_URL}/uploads/${fichier.chemin}`,
    }));
  } catch (error) {
    console.error("Erreur récupération fichiers RJA:", error);
    return [];
  }
};

export const uploadMessageFichiers = async (
  messageId: number,
  files: File[]
) => {
  const formData = new FormData();
  formData.append("messageId", messageId.toString());
  files.forEach((file) => {
    formData.append("fichiers", file);
  });

  try {
    const response = await axios.post(
      `${UPLOAD_URL}/api/message-upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur upload:", error);
    throw error;
  }
};

export const getMessageFichiers = async (messageId: number) => {
  try {
    const response = await axios.get(
      `${UPLOAD_URL}/api/message_groupes/${messageId}/fichiers`
    );
    return response.data["hydra:member"].map((fichier: any) => ({
      ...fichier,
      url: `${UPLOAD_URL}/uploads/${fichier.chemin}`,
    }));
  } catch (error) {
    console.error("Erreur récupération fichiers message:", error);
    return [];
  }
};

export const uploadPrivateFichiers = async (
  messageId: number,
  files: File[]
) => {
  const formData = new FormData();
  formData.append("messageId", messageId.toString());
  files.forEach((file) => {
    formData.append("fichiers", file);
  });

  try {
    const response = await axios.post(
      `${UPLOAD_URL}/api/private-upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur upload:", error);
    throw error;
  }
};

export const getPrivateFichiers = async (messageId: number) => {
  try {
    const response = await axios.get(
      `${UPLOAD_URL}/api/messages/${messageId}/fichiers`
    );
    return response.data["hydra:member"].map((fichier: any) => ({
      ...fichier,
      url: `${UPLOAD_URL}/uploads/${fichier.chemin}`,
    }));
  } catch (error) {
    console.error("Erreur récupération fichiers:", error);
    return [];
  }
};

// Nouvelles interfaces
interface FonctionSousMenu {
  id: number;
  code: string;
  nom: string;
}

interface SousMenu {
  id: number;
  code: string;
  nom: string;
  fonctionSousMenus: FonctionSousMenu[];
}

interface Menu {
  id: number;
  code: string;
  nom: string;
  sousMenus: SousMenu[];
}

interface AccesParDefaut {
  id: number;
  role: {
    id: number;
    code: string;
    nom: string;
  };
  menu: Menu;
}

// Nouvelles fonctions API
export const getMenus = async () => {
  const response = await api.get("/menus");
  return response.data["hydra:member"];
};

export const getAccesParDefauts = async () => {
  const response = await api.get("/acces_par_defauts");
  return response.data["hydra:member"];
};

export default api;
