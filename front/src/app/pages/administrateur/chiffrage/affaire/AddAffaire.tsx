import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import {
  createClient,
  createAffaire,
  createOrdreFabrication,
  getLastAffaire,
  getAffaire,
  updateAffaire,
  updateOrdreFabrication,
  updateClient,
  deleteOrdreFabrication,
  Client,
  Affaire,
  OrdreFabrication,
  uploadOFFichiers,
  getOFFichiers,
} from "../../../../../services/api";
import { KTIcon } from "../../../../../_metronic/helpers";
import Swal from "sweetalert2";
import Select from "react-select";

interface Props {
  show: boolean;
  handleClose: () => void;
  onSuccess?: () => void;
  affaireId?: number;
}

const AddAffaire: React.FC<Props> = ({
  show,
  handleClose,
  onSuccess,
  affaireId,
}) => {
  const [clientData, setClientData] = useState<Client>({
    nom: "",
    telephone: "",
    email: "",
    adresse: "",
  });

  const [affaireData, setAffaireData] = useState<Affaire>({
    numero: "",
    nom: "",
    description: "",
    date_cloture: "",
    statut: "standby",
    cout_total: "0",
  });

  const [ofs, setOfs] = useState<OrdreFabrication[]>([]);
  const [currentOF, setCurrentOF] = useState<OrdreFabrication>({
    numero: "",
    nom: "",
    description: "",
    date_cloture: "",
    indice: 1,
    statut: "standby",
  });

  const [minDate, setMinDate] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setMinDate(today);

    if (show) {
      if (affaireId) {
        loadAffaire(affaireId);
        setIsEditing(true);
      } else {
        generateAffaireNumber();
        setIsEditing(false);
        resetForm();
      }
    }
  }, [show, affaireId]);

  const loadAffaire = async (id: number) => {
    try {
      const data = await getAffaire(id);
      setAffaireData({
        numero: data.numero,
        nom: data.nom,
        description: data.description,
        date_cloture: data.date_cloture.split("T")[0],
        statut: data.statut,
        cout_total: data.cout_total,
        client: data.client ? data.client["@id"] : null,
      });

      if (data.client) {
        setClientData({
          id: data.client.id,
          nom: data.client.nom,
          telephone: data.client.telephone,
          email: data.client.email,
          adresse: data.client.adresse,
        });
      }

      if (data.ordreFabrications) {
        const ofsWithFiles = await Promise.all(
          data.ordreFabrications.map(async (of: any) => {
            const existingFiles = await getOFFichiers(of.id);
            return {
              id: of.id,
              numero: of.numero,
              nom: of.nom,
              description: of.description,
              date_cloture: of.date_cloture.split("T")[0],
              indice: of.indice,
              statut: of.statut,
              affaire: of["@id"],
              existingFiles,
              files: [],
            };
          })
        );
        setOfs(ofsWithFiles);
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'affaire:", error);
      Swal.fire("Erreur", "Impossible de charger l'affaire", "error");
    }
  };

  const resetForm = () => {
    setClientData({
      nom: "",
      telephone: "",
      email: "",
      adresse: "",
    });
    setAffaireData({
      numero: "",
      nom: "",
      description: "",
      date_cloture: "",
      statut: "standby",
      cout_total: "0",
    });
    setOfs([]);
    setCurrentOF({
      numero: "",
      nom: "",
      description: "",
      date_cloture: "",
      indice: 1,
      statut: "standby",
    });
  };

  const generateAffaireNumber = async () => {
    try {
      const lastAffaire = await getLastAffaire();
      const today = new Date();
      const dateStr = `${today.getDate().toString().padStart(2, "0")}.${(
        today.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}.${today.getFullYear().toString().slice(-2)}`;

      let nextNumber = 1;
      if (lastAffaire && lastAffaire.numero) {
        const match = lastAffaire.numero.match(/AFF(\d+)/);
        if (match) {
          nextNumber = parseInt(match[1], 10) + 1;
        }
      }

      const newAffaireNumber = `AFF${nextNumber
        .toString()
        .padStart(4, "0")}-${dateStr}`;
      setAffaireData((prev) => ({ ...prev, numero: newAffaireNumber }));
    } catch (error) {
      console.error("Erreur lors de la génération du numéro:", error);
    }
  };

  const generateOFNumber = () => {
    const baseNumber = affaireData.numero.split("-")[0];
    const nextOFNumber = (ofs.length + 1).toString().padStart(2, "0");
    return `OF${nextOFNumber}-${baseNumber}`;
  };

  const handleAddOF = () => {
    if (!currentOF.nom || !currentOF.date_cloture) {
      Swal.fire({
        title: "Attention",
        text: "Veuillez remplir au moins le nom et la date de clôture de l'OF",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    const newOF = {
      ...currentOF,
      numero: generateOFNumber(),
      indice: 1,
      files: selectedFiles,
    };
    setOfs([...ofs, newOF]);
    setCurrentOF({
      numero: "",
      nom: "",
      description: "",
      date_cloture: "",
      indice: 1,
      statut: "standby",
    });
    setSelectedFiles([]);
  };

  const validateClientData = () => {
    const hasAnyValue = Object.values(clientData).some((value) =>
      typeof value === "string" ? value.trim() !== "" : value !== null
    );

    if (hasAnyValue) {
      const hasAllValues = Object.values(clientData).every((value) =>
        typeof value === "string" ? value.trim() !== "" : value !== null
      );
      if (!hasAllValues) {
        throw new Error(
          "Si vous remplissez un champ client, tous les champs sont requis"
        );
      }
    }
    return hasAnyValue;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let clientId = null;
      const hasClientData = validateClientData();

      if (isEditing && affaireId) {
        // Mise à jour du client si nécessaire
        clientId = affaireData.client;
        if (validateClientData()) {
          if (clientData.id) {
            await updateClient(clientData.id, clientData);
          } else {
            const clientResponse = await createClient(clientData);
            clientId = clientResponse["@id"];
          }
        }

        // Mise à jour de l'affaire
        await updateAffaire(affaireId, {
          ...affaireData,
          client: clientId,
          date_cloture: new Date(affaireData.date_cloture).toISOString(),
        });

        // Gestion des OFs existants
        const existingOFIds = new Set(
          ofs.filter((of) => of.id).map((of) => of.id)
        );
        const originalOFs = (await getAffaire(affaireId)).ordreFabrications;

        // Suppression des OFs qui ne sont plus présents
        for (const originalOF of originalOFs) {
          if (!existingOFIds.has(originalOF.id)) {
            await deleteOrdreFabrication(originalOF.id);
          }
        }

        // Mise à jour ou création des OFs
        for (const of of ofs) {
          let ofResponse;
          if (of.id) {
            ofResponse = await updateOrdreFabrication(of.id, {
              nom: of.nom,
              description: of.description,
              date_cloture: new Date(of.date_cloture).toISOString(),
              statut: of.statut,
              indice: of.indice,
            });
          } else {
            ofResponse = await createOrdreFabrication({
              ...of,
              affaire: `/api/affaires/${affaireId}`,
              date_cloture: new Date(of.date_cloture).toISOString(),
            });
          }

          // Upload des fichiers si présents
          if (of.files && of.files.length > 0) {
            try {
              await uploadOFFichiers(ofResponse.id, of.files);
            } catch (error) {
              console.error(
                `Erreur upload fichiers pour OF ${ofResponse.id}:`,
                error
              );
            }
          }
        }
      } else {
        // Création d'une nouvelle affaire
        if (hasClientData) {
          const clientResponse = await createClient(clientData);
          clientId = clientResponse["@id"];
        }

        const affaireToCreate = {
          ...affaireData,
          client: clientId,
          date_creation: new Date().toISOString(),
          date_cloture: new Date(affaireData.date_cloture).toISOString(),
        };

        const affaireResponse = await createAffaire(affaireToCreate);

        // Création des OFs avec leurs fichiers
        for (const of of ofs) {
          const ofResponse = await createOrdreFabrication({
            ...of,
            affaire: affaireResponse["@id"],
            date_cloture: new Date(of.date_cloture).toISOString(),
          });

          if (of.files && of.files.length > 0) {
            try {
              await uploadOFFichiers(ofResponse.id, of.files);
            } catch (error) {
              console.error(
                `Erreur upload fichiers pour OF ${ofResponse.id}:`,
                error
              );
            }
          }
        }
      }

      Swal.fire({
        title: "Succès!",
        text: isEditing
          ? "Affaire mise à jour avec succès"
          : "Affaire créée avec succès",
        icon: "success",
        confirmButtonText: "OK",
      });

      handleClose();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      Swal.fire({
        title: "Erreur!",
        text: error.message || "Une erreur est survenue",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // ... (Le reste du code JSX reste identique)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter/Modifier une affaire</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row mb-10">
            <div className="col-md-6">
              <h3 className="card-title align-items-start flex-column mb-5">
                <span className="card-label fw-bold fs-3 mb-1">
                  Informations du client
                </span>
              </h3>
              <div className="mb-5">
                <label className="form-label">Nom complet</label>
                <input
                  type="text"
                  className="form-control form-control-solid"
                  placeholder="Nom complet du client"
                  name="nom"
                  value={clientData.nom}
                  onChange={(e) =>
                    setClientData({ ...clientData, nom: e.target.value })
                  }
                />
              </div>
              <div className="mb-5">
                <label className="form-label">Téléphone</label>
                <input
                  type="tel"
                  className="form-control form-control-solid"
                  placeholder="Téléphone du client"
                  name="telephone"
                  value={clientData.telephone}
                  onChange={(e) =>
                    setClientData({ ...clientData, telephone: e.target.value })
                  }
                />
              </div>
              <div className="mb-5">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control form-control-solid"
                  placeholder="Email du client"
                  name="email"
                  value={clientData.email}
                  onChange={(e) =>
                    setClientData({ ...clientData, email: e.target.value })
                  }
                />
              </div>
              <div className="mb-5">
                <label className="form-label">Adresse</label>
                <textarea
                  className="form-control form-control-solid"
                  rows={3}
                  placeholder="Adresse du client"
                  name="adresse"
                  value={clientData.adresse}
                  onChange={(e) =>
                    setClientData({ ...clientData, adresse: e.target.value })
                  }
                ></textarea>
              </div>
            </div>
            <div className="col-md-6">
              <h3 className="card-title align-items-start flex-column mb-5">
                <span className="card-label fw-bold fs-3 mb-1">
                  Informations de l'affaire
                </span>
              </h3>
              <div className="row mb-5">
                <div className="col-md-6">
                  <label className="form-label">Numéro de l'affaire</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    name="numero"
                    value={affaireData.numero}
                    readOnly
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Date de clôture</label>
                  <input
                    type="date"
                    className="form-control form-control-solid"
                    name="date_cloture"
                    value={affaireData.date_cloture}
                    onChange={(e) =>
                      setAffaireData({
                        ...affaireData,
                        date_cloture: e.target.value,
                      })
                    }
                    min={minDate}
                    required
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="form-label">Nom de l'affaire</label>
                <input
                  type="text"
                  className="form-control form-control-solid"
                  name="nom"
                  value={affaireData.nom}
                  onChange={(e) =>
                    setAffaireData({ ...affaireData, nom: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-5">
                <label className="form-label">Description de l'affaire</label>
                <textarea
                  className="form-control form-control-solid"
                  rows={3}
                  name="description"
                  value={affaireData.description}
                  onChange={(e) =>
                    setAffaireData({
                      ...affaireData,
                      description: e.target.value,
                    })
                  }
                  required
                ></textarea>
              </div>
              <div className="mb-5">
                <label className="form-label">Statut de l'affaire</label>
                <select
                  className="form-select form-select-solid"
                  name="statut"
                  value={affaireData.statut}
                  onChange={(e) =>
                    setAffaireData({ ...affaireData, statut: e.target.value as Affaire['statut'] })
                  }
                  required
                >
                  <option value="standby">Standby</option>
                  <option value="en_cours">En cours</option>
                </select>
              </div>
            </div>
          </div>

          <div className="separator separator-dashed my-10"></div>

          <div className="row mb-10">
            <div className="col-12">
              <h3 className="card-title align-items-start flex-column mb-5">
                <span className="card-label fw-bold fs-3 mb-1">
                  Ordres de Fabrication
                </span>
              </h3>
              <div className="row mb-5">
                <div className="col-md-4">
                  <label className="form-label">Nom de l'OF</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    value={currentOF.nom}
                    onChange={(e) =>
                      setCurrentOF({ ...currentOF, nom: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Date de clôture</label>
                  <input
                    type="date"
                    className="form-control form-control-solid"
                    value={currentOF.date_cloture}
                    onChange={(e) =>
                      setCurrentOF({
                        ...currentOF,
                        date_cloture: e.target.value,
                      })
                    }
                    min={minDate}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Commentaire</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    value={currentOF.description}
                    onChange={(e) =>
                      setCurrentOF({
                        ...currentOF,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="form-label">Documents</label>
                <div className="d-flex align-items-center">
                  <Select
                    isMulti
                    value={selectedFiles.map((file) => ({
                      value: file.name,
                      label: file.name,
                    }))}
                    onChange={(selected) => {
                      const newFiles = selected
                        .map((item) =>
                          selectedFiles.find((file) => file.name === item.value)
                        )
                        .filter((file): file is File => file !== undefined);
                      setSelectedFiles(newFiles);
                    }}
                    className="flex-grow-1 me-2"
                    placeholder="Sélectionnez des fichiers..."
                  />
                  <input
                    type="file"
                    multiple
                    className="d-none"
                    id="of-files"
                    onChange={handleFileSelect}
                  />
                  <label
                    htmlFor="of-files"
                    className="btn btn-light-primary btn-icon btn-sm"
                  >
                    <KTIcon iconName="plus" className="fs-2" />
                  </label>
                </div>
              </div>

              <div className="text-center mb-5">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddOF}
                >
                  Ajouter l'OF
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4 table-hover">
                  <thead>
                    <tr className="fw-bold text-muted bg-light">
                      <th className="min-w-150px">&nbsp; Numéro</th>
                      <th className="min-w-150px">Nom</th>
                      <th className="min-w-150px text-center">
                        Date de clôture
                      </th>
                      <th className="min-w-100px">Fichiers</th>
                      <th className="min-w-100px text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ofs.map((of, index) => (
                      <tr key={index} title={of.description}>
                        <td>&nbsp; {of.numero}</td>
                        <td>{of.nom}</td>
                        <td className="text-center">
                          {new Date(of.date_cloture).toLocaleDateString(
                            "fr-FR"
                          )}
                        </td>
                        <td>
                          {of.existingFiles &&
                            of.existingFiles.map((file, fileIndex) => (
                              <span
                                key={`existing-${fileIndex}`}
                                className="badge badge-light-success me-2"
                                style={{ cursor: "pointer" }}
                                onClick={() => window.open(file.url, "_blank")}
                                title="Cliquez pour ouvrir"
                              >
                                {file.nom}{" "}
                                <i className="bi bi-file-earmark-text ms-1"></i>
                              </span>
                            ))}
                          {of.files &&
                            of.files.map((file: File, fileIndex: number) => (
                              <span
                                key={`new-${fileIndex}`}
                                className="badge badge-light-primary me-2"
                              >
                                {file.name} (Nouveau)
                              </span>
                            ))}
                        </td>
                        <td className="text-center">
                          <button
                            type="button"
                            className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
                            onClick={() => {
                              const newOfs = ofs.filter((_, i) => i !== index);
                              setOfs(newOfs);
                            }}
                          >
                            <KTIcon iconName="trash" className="fs-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-primary me-2">
              Enregistrer
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Annuler
            </button>
          </div>
        </Modal.Body>
      </form>
    </Modal>
  );
};

export default AddAffaire;
