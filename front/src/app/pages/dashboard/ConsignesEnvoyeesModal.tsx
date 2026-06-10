import { FC } from "react";
import { Modal } from "react-bootstrap";
import { KTIcon } from "../../../_metronic/helpers";
import Swal from "sweetalert2";

interface ConsignesEnvoyeesModalProps {
  show: boolean;
  handleClose: () => void;
  consignes: any[];
  priorityTitle: string;
  onArchive: (id: number) => void;
  onEdit: (consigne: any) => void;
  onDelete: (id: number) => void;
}

const ConsignesEnvoyeesModal: FC<ConsignesEnvoyeesModalProps> = ({
  show,
  handleClose,
  consignes,
  priorityTitle,
  onArchive,
  onEdit,
  onDelete,
}) => {
  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Cette action est irréversible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(id);
      }
    });
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Consignes Envoyées - {priorityTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row g-5 g-xl-8">
          {consignes.map((consigne) => (
            <div key={consigne.id} className="col-xl-4">
              <div className="card card-xl-stretch mb-xl-8">
                {/* <div className="card-header border-0">
                  <h3 className="card-title fw-bold text-dark">
                    {consigne.titre}
                  </h3>
                  <div className="card-toolbar">
                    <button
                      className="btn btn-sm btn-icon btn-light-primary me-2"
                      onClick={() => onEdit(consigne)}
                      title="Modifier"
                    >
                      <KTIcon iconName="pencil" className="fs-2" />
                    </button>
                    <button
                      className="btn btn-sm btn-icon btn-light-danger me-2"
                      onClick={() => handleDelete(consigne.id)}
                      title="Supprimer"
                    >
                      <KTIcon iconName="trash" className="fs-2" />
                    </button>
                    <button
                      className="btn btn-sm btn-icon btn-light-success"
                      onClick={() => onArchive(consigne.id)}
                      title="Archiver"
                    >
                      <KTIcon iconName="archive" className="fs-2" />
                    </button>
                  </div>
                </div> */}
                <div className="card-header border-0">
                  <h3 className="card-title fw-bold text-dark">
                    {consigne.titre}
                  </h3>
                  {/* <div className="card-toolbar">
                    <button
                      className="btn btn-sm btn-icon btn-light-primary me-2"
                      onClick={() => onEdit(consigne)}
                      title="Modifier"
                    >
                      <KTIcon iconName="pencil" className="fs-2" />
                    </button>
                    <button
                      className="btn btn-sm btn-icon btn-light-danger me-2"
                      onClick={() => handleDelete(consigne.id)}
                      title="Supprimer"
                    >
                      <KTIcon iconName="trash" className="fs-2" />
                    </button>
                    {consigne.etat === "termine" && (
                      <button
                        className="btn btn-sm btn-icon btn-light-success"
                        onClick={() => onArchive(consigne.id)}
                        title="Archiver"
                      >
                        <KTIcon iconName="archive" className="fs-2" />
                      </button>
                    )}
                  </div> */}
                  <div className="card-toolbar">
                    {consigne.etat !== "termine" && (
                      <>
                        <button
                          className="btn btn-sm btn-icon btn-light-primary me-2"
                          onClick={() => onEdit(consigne)}
                          title="Modifier"
                        >
                          <KTIcon iconName="pencil" className="fs-2" />
                        </button>
                        <button
                          className="btn btn-sm btn-icon btn-light-danger me-2"
                          onClick={() => handleDelete(consigne.id)}
                          title="Supprimer"
                        >
                          <KTIcon iconName="trash" className="fs-2" />
                        </button>
                      </>
                    )}
                    {consigne.etat === "termine" && (
                      <button
                        className="btn btn-sm btn-icon btn-light-success"
                        onClick={() => onArchive(consigne.id)}
                        title="Archiver"
                      >
                        <KTIcon iconName="archive" className="fs-2" />
                      </button>
                    )}
                  </div>
                </div>

                {/* <div className="card-body pt-0">
                  <p className="text-gray-800 mt-3 mb-2">
                    Type :{" "}
                    {consigne.type === "personnel"
                      ? "Consigne Personnel"
                      : "Consigne de Direction"}
                  </p>
                  <p className="text-gray-800 mb-5">{consigne.contenu}</p>
                  <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center flex-grow-1">
                      <div className="d-flex flex-column">
                        <span className="text-muted fw-semibold">
                          À: {consigne.destinataire?.nom}{" "}
                          {consigne.destinataire?.prenoms}
                        </span>
                        <span className="text-muted fw-semibold">
                          Échéance:{" "}
                          {new Date(
                            consigne.date_echeance
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="card-body pt-0">
                  <div className="d-flex justify-content-between align-items-center mt-3 mb-2">
                    <p className="text-gray-800 mb-0">
                      Consigne{" "}
                      <b>
                        {" "}
                        {consigne.type === "personnel"
                          ? "Personnel"
                          : "de Direction"}
                      </b>
                    </p>
                    <span
                      className={`badge badge-light-${
                        consigne.etat === "standby"
                          ? "warning"
                          : consigne.etat === "en_cours"
                          ? "primary"
                          : "success"
                      }`}
                    >
                      {consigne.etat}
                    </span>
                  </div>
                  <p className="text-gray-800 mb-5">{consigne.contenu}</p>
                  <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center flex-grow-1">
                      <div className="d-flex flex-column">
                        <span className="text-muted fw-semibold">
                          À: {consigne.destinataire?.nom}{" "}
                          {consigne.destinataire?.prenoms}
                        </span>
                        <span className="text-muted fw-semibold">
                          Échéance:{" "}
                          {new Date(
                            consigne.date_echeance
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export { ConsignesEnvoyeesModal };
