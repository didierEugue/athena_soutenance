// AffairesListModal.tsx
import { FC, useState } from "react";
import { Modal } from "react-bootstrap";
import { KTIcon } from "../../../../_metronic/helpers";
import { AffaireDetailsModal } from "./AffaireDetailsModal";

interface Props {
  show: boolean;
  handleClose: () => void;
  affaires: any[];
  title: string;
  onArchive?: (id: number, newStatus: string) => void;
}

// const AffairesListModal: FC<Props> = ({
//   show,
//   handleClose,
//   affaires,
//   title,
// }) => {
//   return (
//     <Modal show={show} onHide={handleClose} size="xl" centered>
//       <Modal.Header closeButton>
//         <Modal.Title>{title}</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <div className="table-responsive">
//           <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
//             <thead>
//               <tr className="fw-bold text-muted">
//                 <th>Numéro</th>
//                 <th>Nom</th>
//                 <th>Client</th>
//                 <th>Date de création</th>
//                 <th>Date de clôture</th>
//               </tr>
//             </thead>
//             <tbody>
//               {affaires.map((affaire) => (
//                 <tr key={affaire.id}>
//                   <td>{affaire.numero}</td>
//                   <td>{affaire.nom}</td>
//                   <td>
//                     {affaire.client ? `${affaire.client.nom}` : "Non assigné"}
//                   </td>
//                   <td>
//                     {new Date(affaire.date_creation).toLocaleDateString()}
//                   </td>
//                   <td>
//                     {affaire.date_cloture
//                       ? new Date(affaire.date_cloture).toLocaleDateString()
//                       : "-"}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </Modal.Body>
//     </Modal>
//   );
// };

const AffairesListModal: FC<Props> = ({
  show,
  handleClose,
  affaires,
  title,
  onArchive,
}) => {
  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "standby":
        return "warning";
      case "en_cours":
        return "primary";
      case "terminé":
        return "success";
      case "cloture":
        return "info";
      case "archive":
        return "dark";
      default:
        return "light";
    }
  };

  const [selectedAffaire, setSelectedAffaire] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleRowClick = (affaire: any) => {
    if (affaire.statut === "terminé") {
      setSelectedAffaire(affaire);
      setShowDetailsModal(true);
    }
  };

  const showActionColumn = affaires.some(
    (affaire) =>
      affaire.statut === "terminé" ||
      affaire.statut === "cloture" ||
      affaire.statut === "archive"
  );

  //   return (
  //     <Modal show={show} onHide={handleClose} size="xl" centered>
  //       <Modal.Header closeButton>
  //         <Modal.Title>{title}</Modal.Title>
  //       </Modal.Header>
  //       <Modal.Body>
  //         <div className="table-responsive">
  //           {/* <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3"> */}
  //           <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3 table-hover">
  //             <thead>
  //               <tr className="fw-bold text-muted">
  //                 <th>Numéro</th>
  //                 <th>Nom</th>
  //                 <th>Client</th>
  //                 <th>Date de création</th>
  //                 <th>Date de clôture</th>
  //                 <th>Statut</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               {affaires.map((affaire) => (
  //                 <tr key={affaire.id} style={{ cursor: "pointer" }}>
  //                   <td>{affaire.numero}</td>
  //                   <td>{affaire.nom}</td>
  //                   <td>
  //                     {affaire.client ? `${affaire.client.nom}` : "Non assigné"}
  //                   </td>
  //                   <td>
  //                     {new Date(affaire.date_creation).toLocaleDateString()}
  //                   </td>
  //                   <td>
  //                     {affaire.date_cloture
  //                       ? new Date(affaire.date_cloture).toLocaleDateString()
  //                       : "-"}
  //                   </td>
  //                   <td>
  //                     <span
  //                       className={`badge badge-light-${getStatusColor(
  //                         affaire.statut
  //                       )}`}
  //                     >
  //                       {affaire.statut}
  //                     </span>
  //                   </td>
  //                 </tr>
  //               ))}
  //             </tbody>
  //           </table>
  //         </div>
  //       </Modal.Body>
  //     </Modal>
  //   );
  return (
    <>
      <Modal show={show} onHide={handleClose} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="table-responsive">
            <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3 table-hover">
              <thead>
                <tr className="fw-bold text-muted">
                  <th>Numéro</th>
                  <th>Nom</th>
                  <th>Client</th>
                  <th>Date de création</th>
                  <th>Date de clôture</th>
                  <th>Statut</th>
                  {/* <th>Actions</th> */}
                  {showActionColumn && <th>Actions</th>}
                </tr>
              </thead>
              {/* <tbody>
              {affaires.map((affaire) => (
                <tr key={affaire.id} style={{ cursor: "pointer" }}>
                  <td>{affaire.numero}</td>
                  <td>{affaire.nom}</td>
                  <td>
                    {affaire.client ? `${affaire.client.nom}` : "Non assigné"}
                  </td>
                  <td>
                    {new Date(affaire.date_creation).toLocaleDateString()}
                  </td>
                  <td>
                    {affaire.date_cloture
                      ? new Date(affaire.date_cloture).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <span
                      className={`badge badge-light-${getStatusColor(
                        affaire.statut
                      )}`}
                    >
                      {affaire.statut}
                    </span>
                  </td>
                  <td>
                    {affaire.statut === "terminé" && (
                      <button
                        className="btn btn-icon btn-light-info btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onArchive?.(affaire.id);
                        }}
                        title="Archiver"
                      >
                        <KTIcon iconName="archive" className="fs-2" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody> */}
              {/* <tbody>
              {affaires.map((affaire) => (
                <tr key={affaire.id} style={{ cursor: "pointer" }}>
                  <td>{affaire.numero}</td>
                  <td>{affaire.nom}</td>
                  <td>
                    {affaire.client ? `${affaire.client.nom}` : "Non assigné"}
                  </td>
                  <td>
                    {new Date(affaire.date_creation).toLocaleDateString()}
                  </td>
                  <td>
                    {affaire.date_cloture
                      ? new Date(affaire.date_cloture).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <span
                      className={`badge badge-light-${getStatusColor(
                        affaire.statut
                      )}`}
                    >
                      {affaire.statut}
                    </span>
                  </td>
                  {showActionColumn && (
                    <td>
                      {affaire.statut === "terminé" && (
                        <button
                          className="btn btn-icon btn-light-info btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onArchive?.(affaire.id);
                          }}
                          title="Archiver"
                        >
                          <KTIcon iconName="archive" className="fs-2" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody> */}
              <tbody>
                {affaires.map((affaire) => (
                  <tr
                    key={affaire.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRowClick(affaire)}
                  >
                    <td>{affaire.numero}</td>
                    <td>{affaire.nom}</td>
                    <td>
                      {affaire.client ? `${affaire.client.nom}` : "Non assigné"}
                    </td>
                    <td>
                      {new Date(affaire.date_creation).toLocaleDateString()}
                    </td>
                    <td>
                      {affaire.date_cloture
                        ? new Date(affaire.date_cloture).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      <span
                        className={`badge badge-light-${getStatusColor(
                          affaire.statut
                        )}`}
                      >
                        {affaire.statut}
                      </span>
                    </td>
                    {showActionColumn && (
                      <td>
                        {affaire.statut === "terminé" && (
                          <button
                            className="btn btn-icon btn-light-info btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onArchive?.(affaire.id, "cloture");
                            }}
                            title="Clôturer"
                          >
                            <KTIcon iconName="archive" className="fs-2" />
                          </button>
                        )}
                        {affaire.statut === "cloture" && (
                          <button
                            className="btn btn-icon btn-light-dark btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onArchive?.(affaire.id, "archive");
                            }}
                            title="Archiver"
                          >
                            <KTIcon iconName="archive" className="fs-2" />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal>
      {selectedAffaire && (
        <AffaireDetailsModal
          show={showDetailsModal}
          handleClose={() => {
            setShowDetailsModal(false);
            setSelectedAffaire(null);
          }}
          affaire={selectedAffaire}
        />
      )}
    </>
  );
};

export { AffairesListModal };
