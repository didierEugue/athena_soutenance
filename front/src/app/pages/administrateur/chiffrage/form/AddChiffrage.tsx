import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import {
  createChiffrage,
  TypeChiffrage,
  updateChiffrage,
} from "../../../../../services/api";
import Swal from "sweetalert2";

interface AddChiffrageProps {
  isOpen: boolean;
  onClose: () => void;
  affaires: any[];
  fournisseurs: any[];
  typeChiffrages: TypeChiffrage[];
  selectedAffaire: any;
  editingChiffrage: any;
  onSuccess: () => void;
}

const AddChiffrage: React.FC<AddChiffrageProps> = ({
  isOpen,
  onClose,
  affaires,
  fournisseurs,
  typeChiffrages,
  selectedAffaire,
  editingChiffrage,
  onSuccess,
}) => {
  const [selectedAffaireId, setSelectedAffaireId] = useState<string>("");
  const [cout, setCout] = useState<number>(0);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedFournisseur, setSelectedFournisseur] = useState<string>("");

  const resetForm = () => {
    setCout(0);
    setSelectedType("");
    setSelectedFournisseur("");
    setSelectedAffaireId("");
  };
  useEffect(() => {
    if (selectedAffaire) {
      setSelectedAffaireId(`/api/affaires/${selectedAffaire.id}`);
    }

    if (editingChiffrage) {
      setCout(editingChiffrage.cout);
      setSelectedType(`/api/type_chiffrages/${editingChiffrage.type.id}`);
      setSelectedFournisseur(
        `/api/fournisseurs/${editingChiffrage.fournisseur.id}`
      );
    }
  }, [selectedAffaire, editingChiffrage]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const chiffrageData = {
      cout: cout,
      type: selectedType,
      affaire: selectedAffaireId,
      fournisseur: selectedFournisseur,
    };

    try {
      if (editingChiffrage) {
        await updateChiffrage(editingChiffrage.id, chiffrageData);
        Swal.fire({
          title: "Succès !",
          text: "Le chiffrage a été modifié avec succès",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await createChiffrage(chiffrageData);
        Swal.fire({
          title: "Succès !",
          text: "Le chiffrage a été ajouté avec succès",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
      resetForm();
      onSuccess();
      onClose();
    } catch (error) {
      Swal.fire({
        title: "Erreur !",
        text: "Une erreur est survenue lors de l'enregistrement",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {editingChiffrage ? "Modifier" : "Ajouter"} un chiffrage
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="fv-row mb-7">
            <label className="required fs-6 fw-semibold mb-2">Affaire</label>
            <select
              className="form-select form-select-solid fw-bold"
              value={selectedAffaireId}
              onChange={(e) => setSelectedAffaireId(e.target.value)}
              required
              disabled={!!selectedAffaire}
            >
              <option value="">Sélectionnez une affaire</option>
              {affaires
                .filter((affaire) => affaire.statut === "standby")
                .map((affaire) => (
                  <option
                    key={affaire.id}
                    value={`/api/affaires/${affaire.id}`}
                  >
                    {affaire.numero} - {affaire.nom}
                  </option>
                ))}
            </select>
          </div>

          <div className="fv-row mb-7">
            <label className="required fs-6 fw-semibold mb-2">Type</label>
            <select
              className="form-select form-select-solid"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">Sélectionner un type</option>
              {typeChiffrages.map((type) => (
                <option key={type.id} value={`/api/type_chiffrages/${type.id}`}>
                  {type.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="fv-row mb-7">
            <label className="required fs-6 fw-semibold mb-2">Coût</label>
            <input
              type="number"
              step="0.01"
              className="form-control form-control-solid mb-3 mb-lg-0"
              value={cout}
              onChange={(e) => setCout(Number(e.target.value))}
              required
            />
          </div>

          <div className="fv-row mb-7">
            <label className="required fs-6 fw-semibold mb-2">
              Fournisseur
            </label>
            <select
              className="form-select form-select-solid fw-bold"
              value={selectedFournisseur}
              onChange={(e) => setSelectedFournisseur(e.target.value)}
              required
            >
              <option value="">Sélectionnez un fournisseur</option>
              {fournisseurs.map((fournisseur) => (
                <option
                  key={fournisseur.id}
                  value={`/api/fournisseurs/${fournisseur.id}`}
                >
                  {fournisseur.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="text-center pt-15">
            <button
              type="reset"
              className="btn btn-light me-3"
              onClick={onClose}
            >
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              <span className="indicator-label">
                {editingChiffrage ? "Modifier" : "Enregistrer"}
              </span>
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};
export { AddChiffrage };
