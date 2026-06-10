import { ID, Response } from "../../../../../../_metronic/helpers";

export type Role = {
  id: number;
  nom: string;
  coefficient_qualification: string;
};

export type User = {
  id?: ID;
  email: string;
  password?: string;
  role: string;
  nom: string;
  prenoms: string;
  telephone: string;
  adresse: string;
  actif?: boolean;
  avatar?: string;
  avatar_url?: string;
};

export type UsersQueryResponse = {
  "hydra:member": User[];
  "hydra:totalItems": number;
  "hydra:view"?: {
    "hydra:first": string;
    "hydra:last": string;
    "hydra:next"?: string;
  };
};

export const initialUser: User = {
  email: "",
  role: "",
  nom: "",
  prenoms: "",
  telephone: "",
  adresse: "",
  actif: true,
  avatar: "",
  avatar_url: "",
};
