import React, { useState, useEffect } from "react";
import {
  Client,
  createClient,
  updateClient,
} from "../../../../../services/api";

interface Props {
  client?: Client;
  onSubmit: () => void;
}

const ClientForm: React.FC<Props> = ({ client, onSubmit }) => {
  const [formData, setFormData] = useState<Client>({
    nom: "",
    telephone: "",
    email: "",
    adresse: "",
  });

  useEffect(() => {
    if (client) {
      setFormData(client);
    }
  }, [client]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (client?.id) {
      await updateClient(client.id, formData);
    } else {
      await createClient(formData);
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-10">
        <label className="form-label required">Nom complet</label>
        <input
          type="text"
          className="form-control form-control-solid"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-10">
        <label className="form-label required">Téléphone</label>
        <input
          type="tel"
          className="form-control form-control-solid"
          name="telephone"
          value={formData.telephone}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-10">
        <label className="form-label required">Email</label>
        <input
          type="email"
          className="form-control form-control-solid"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-10">
        <label className="form-label">Adresse</label>
        <textarea
          className="form-control form-control-solid"
          rows={3}
          name="adresse"
          value={formData.adresse}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="text-center">
        <button type="submit" className="btn btn-primary">
          {client?.id ? "Modifier" : "Ajouter"}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;
