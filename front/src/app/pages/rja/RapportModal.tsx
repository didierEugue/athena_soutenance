import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { KTIcon } from "../../../_metronic/helpers";
import Select from "react-select";
import { useAuth } from "../../modules/auth";
import Swal from "sweetalert2";
import {
  Affaire,
  OrdreFabrication,
  TacheFacturable,
  TacheParActivite,
  getAffaires,
  getTachesFacturables,
  createTacheParActivite,
  updateTacheParActivite,
  uploadRJAFichiers,
} from "../../../services/api";

interface RapportModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  rapportToEdit?: TacheParActivite | null;
}

const RapportModal: React.FC<RapportModalProps> = ({
  show,
  onHide,
  onSuccess,
  rapportToEdit,
}) => {
  const { currentUser } = useAuth();
  const [affaires, setAffaires] = useState<Affaire[]>([]);
  const [selectedAffaire, setSelectedAffaire] = useState<string>("");
  const [ordreFabrications, setOrdreFabrications] = useState<
    OrdreFabrication[]
  >([]);
  const [selectedOF, setSelectedOF] = useState<string>("");
  const [tachesFacturables, setTachesFacturables] = useState<TacheFacturable[]>(
    []
  );
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategorie, setSelectedCategorie] = useState<string>("");
  const [selectedTache, setSelectedTache] = useState<string>("");
  const [multiplicateur, setMultiplicateur] = useState<number>(1);
  const [description, setDescription] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const affairesData = await getAffaires();
        setAffaires(
          affairesData.filter((aff: Affaire) => aff.statut === "en_cours")
        );

        const tachesData = await getTachesFacturables();
        setTachesFacturables(tachesData);
        const uniqueCategories = [
          ...new Set(
            tachesData.map((tache: TacheFacturable) => tache.categorie)
          ),
        ];
        setCategories(uniqueCategories as string[]);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };
    if (show) {
      fetchData();
    }
  }, [show]);

  useEffect(() => {
    if (show && rapportToEdit) {
      const affaire = affaires.find((a) =>
        a.ordreFabrications?.some(
          (of) => (of as any)["@id"] === (rapportToEdit.ordre_fabrication as any)["@id"]
        )
      );
      if (affaire) {
        setSelectedAffaire((affaire as any)["@id"] || '');
        setOrdreFabrications(affaire.ordreFabrications || []);
      }
      setSelectedOF((rapportToEdit.ordre_fabrication as any)["@id"] || '');
      setSelectedCategorie(rapportToEdit.type_activite);
      setSelectedTache((rapportToEdit.tache_facturable as any)["@id"] || '');
      setDescription(rapportToEdit.description);
      setMultiplicateur(
        Math.round((parseFloat(rapportToEdit.duree) * 60) / 30)
      );
    } else {
      resetForm();
    }
  }, [show, rapportToEdit, affaires]);

  useEffect(() => {
    const fetchOFs = async () => {
      if (selectedAffaire) {
        const affaire = affaires.find((a) => (a as any)["@id"] === selectedAffaire);
        if (affaire && affaire.ordreFabrications) {
          setOrdreFabrications(
            affaire.ordreFabrications.filter((of) => of.statut === "standby")
          );
        }
      }
    };
    fetchOFs();
  }, [selectedAffaire, affaires]);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const dureeReelle = (multiplicateur * 30) / 60;
  //     const currentDate = new Date().toISOString();

  //     if (rapportToEdit) {
  //       await updateTacheParActivite(rapportToEdit.id!, {
  //         tache_facturable: selectedTache,
  //         ordre_fabrication: selectedOF,
  //         type_activite: selectedCategorie,
  //         description: description,
  //         duree: dureeReelle.toString(),
  //         statut: "Standby",
  //       });
  //     } else {
  //       await createTacheParActivite({
  //         tache_facturable: selectedTache,
  //         ordre_fabrication: selectedOF,
  //         type_activite: selectedCategorie,
  //         description: description,
  //         duree: dureeReelle.toString(),
  //         date: currentDate,
  //         statut: "Standby",
  //         executeur: `/api/utilisateurs/${currentUser?.id}`,
  //       });
  //     }

  //     Swal.fire({
  //       title: "Succès!",
  //       text: rapportToEdit
  //         ? "Le rapport a été modifié avec succès"
  //         : "Le rapport a été créé avec succès",
  //       icon: "success",
  //       confirmButtonText: "OK",
  //     });

  //     onSuccess();
  //     onHide();
  //   } catch (error) {
  //     Swal.fire({
  //       title: "Erreur!",
  //       text: "Une erreur est survenue",
  //       icon: "error",
  //       confirmButtonText: "OK",
  //     });
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dureeReelle = (multiplicateur * 30) / 60;
      const currentDate = new Date().toISOString();

      let response;
      if (rapportToEdit) {
        response = await updateTacheParActivite(rapportToEdit.id!, {
          tache_facturable: selectedTache,
          ordre_fabrication: selectedOF,
          type_activite: selectedCategorie,
          description: description,
          duree: dureeReelle.toString(),
          statut: "Standby",
        });
      } else {
        response = await createTacheParActivite({
          tache_facturable: selectedTache,
          ordre_fabrication: selectedOF,
          type_activite: selectedCategorie,
          description: description,
          duree: dureeReelle.toString(),
          date: currentDate,
          statut: "Standby",
          executeur: `/api/utilisateurs/${currentUser?.id}`,
        });
      }

      // Upload des fichiers si présents
      if (selectedFiles.length > 0) {
        await uploadRJAFichiers(response.id, selectedFiles);
      }

      Swal.fire({
        title: "Succès!",
        text: rapportToEdit
          ? "Le rapport a été modifié avec succès"
          : "Le rapport a été créé avec succès",
        icon: "success",
        confirmButtonText: "OK",
      });

      onSuccess();
      onHide();
    } catch (error) {
      Swal.fire({
        title: "Erreur!",
        text: "Une erreur est survenue",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const resetForm = () => {
    setSelectedAffaire("");
    setSelectedOF("");
    setSelectedCategorie("");
    setSelectedTache("");
    setMultiplicateur(1);
    setDescription("");
    setSelectedFiles([]);
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {rapportToEdit ? "Modifier le rapport" : "Ajouter un rapport"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="form-label required">Affaire</label>
            <select
              className="form-select form-select-solid"
              value={selectedAffaire}
              onChange={(e) => setSelectedAffaire(e.target.value)}
              required
            >
              <option value="">Sélectionner une affaire</option>
              {affaires.map((affaire) => (
                <option key={affaire.id} value={affaire["@id"]}>
                  {affaire.numero} - {affaire.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <label className="form-label required">Ordre de fabrication</label>
            <select
              className="form-select form-select-solid"
              value={selectedOF}
              onChange={(e) => setSelectedOF(e.target.value)}
              required
            >
              <option value="">Sélectionner un ordre de fabrication</option>
              {ordreFabrications.map((of) => (
                <option key={of.id} value={of["@id"]}>
                  {of.numero} - {of.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <label className="form-label required">Catégorie d'activité</label>
            <select
              className="form-select form-select-solid"
              value={selectedCategorie}
              onChange={(e) => setSelectedCategorie(e.target.value)}
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((categorie) => (
                <option key={categorie} value={categorie}>
                  {categorie}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <label className="form-label required">Tâche</label>
            <select
              className="form-select form-select-solid"
              value={selectedTache}
              onChange={(e) => setSelectedTache(e.target.value)}
              required
            >
              <option value="">Sélectionner une tâche</option>
              {tachesFacturables
                .filter((tache) => tache.categorie === selectedCategorie)
                .map((tache) => (
                  <option key={tache.id} value={tache["@id"]}>
                    {tache.code} - {tache.nom}
                  </option>
                ))}
            </select>
          </div>

          <div className="mb-5">
            <label className="form-label required">
              Durée (par tranche de 30 min)
            </label>
            <div className="d-flex align-items-center">
              <input
                type="number"
                className="form-control form-control-solid w-100px"
                value={multiplicateur}
                onChange={(e) =>
                  setMultiplicateur(Math.max(1, parseInt(e.target.value)))
                }
                min={1}
                required
              />
              <span className="mx-3">
                x 30 min = {multiplicateur * 30} minutes
              </span>
            </div>
          </div>

          <div className="mb-5">
            <label className="form-label">Description</label>
            <textarea
              className="form-control form-control-solid"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mb-10 fv-row">
            <label className="form-label">Pièces jointes</label>
            <div className="d-flex align-items-center">
              <Select
                isMulti
                options={selectedFiles.map((file) => ({
                  value: file.name,
                  label: file.name,
                }))}
                value={selectedFiles.map((file) => ({
                  value: file.name,
                  label: file.name,
                }))}
                onChange={(selected) =>
                  setSelectedFiles(
                    selected.map(
                      (option) =>
                        selectedFiles.find(
                          (file) => file.name === option.value
                        )!
                    )
                  )
                }
                className="flex-grow-1 me-2"
              />
              <label
                htmlFor="file-upload"
                className="btn btn-light-primary btn-icon btn-sm"
              >
                <KTIcon iconName="plus" className="fs-2" />
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    setSelectedFiles((prev) => [
                      ...prev,
                      ...Array.from(e.target.files!),
                    ]);
                  }
                }}
                style={{ display: "none" }}
              />
            </div>
          </div>

          <div className="text-center mt-5">
            <button type="submit" className="btn btn-primary">
              {rapportToEdit ? "Modifier" : "Enregistrer"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default RapportModal;
