import { FC } from "react";
import { Modal } from "react-bootstrap";
import { KTIcon } from "../../../_metronic/helpers";

interface ConsigneModalProps {
  show: boolean;
  handleClose: () => void;
  consignes: any[];
  priorityTitle: string;
  onUpdateStatus: (id: number, newStatus: string) => void;
}

const ConsignesModal: FC<ConsigneModalProps> = ({
  show,
  handleClose,
  consignes,
  priorityTitle,
  onUpdateStatus,
}) => {
  const getStatusButton = (consigne: any) => {
    if (consigne.etat === "standby") {
      return (
        <button
          className="btn btn-sm btn-icon btn-light-primary"
          onClick={() => onUpdateStatus(consigne.id, "en_cours")}
          title="Marquer en cours"
        >
          <KTIcon iconName="arrow-right-circle" className="fs-2" />
        </button>
      );
    }
    if (consigne.etat === "en_cours") {
      return (
        <button
          className="btn btn-sm btn-icon btn-success"
          onClick={() => onUpdateStatus(consigne.id, "termine")}
          title="Marquer terminé"
        >
          <KTIcon iconName="check-circle" className="fs-2" />
        </button>
      );
    }
    return null;
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Consignes Reçues - {priorityTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row g-5 g-xl-8">
          {consignes.map((consigne) => (
            <div key={consigne.id} className="col-xl-4">
              <div className="card card-xl-stretch mb-xl-8">
                <div className="card-header border-0">
                  <h3 className="card-title fw-bold text-dark">
                    {consigne.titre}
                  </h3>
                  <div className="card-toolbar">
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
                </div>
                <div className="card-body pt-0">
                  <p className="text-gray-800 mt-3 mb-5">
                    Consigne
                    <b>
                      {" "}
                      {consigne.type === "personnel"
                        ? "Personnel"
                        : "de Direction"}
                    </b>
                  </p>
                  <p className="text-gray-800 mt-3 mb-5">{consigne.contenu}</p>
                  <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center flex-grow-1">
                      <div className="d-flex flex-column">
                        <span className="text-muted fw-semibold">
                          De :{" "}
                          <b>
                            {consigne.expediteur?.nom}{" "}
                            {consigne.expediteur?.prenoms}
                          </b>
                        </span>
                        <span className="text-muted fw-semibold">
                          Échéance :{" "}
                          <b>
                            {" "}
                            {new Date(
                              consigne.date_echeance
                            ).toLocaleDateString()}{" "}
                          </b>
                        </span>
                      </div>
                    </div>
                    {getStatusButton(consigne)}
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

export { ConsignesModal };
