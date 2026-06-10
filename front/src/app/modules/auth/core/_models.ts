export interface AuthModel {
  token: string;
  user: UserModel;
}

// export interface UserModel {
//   id: number;
//   username: string;
//   nom: string;
//   prenom: string;
//   telephone: string;
//   adresse: string;
//   actif: boolean;
//   roles: string[];
//   avatar?: string;
//   avatar_url?: string;
// }
export interface UserModel {
  id: number;
  username: string;
  nom: string;
  prenom: string;
  telephone: string;
  adresse: string;
  actif: boolean;
  roles: string[];
  role: {
    id: number;
    code: string;
    nom: string;
  };
  avatar?: string;
  avatar_url?: string;
}
