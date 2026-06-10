import React from "react";
import { updateAffaireStatus } from "../../../../../services/api";
import Swal from "sweetalert2";

interface ValidateBtnProps {
  affaireId: number;
  statut: string;
  onValidate: () => void;
}

const ValidateBtn: React.FC<ValidateBtnProps> = ({
  affaireId,
  statut,
  onValidate,
}) => {
  const isValidated =
    statut === "en_cours" || statut === "cloture" || statut === "terminé";

  const handleClick = async () => {
    if (isValidated) return;

    try {
      const result = await Swal.fire({
        title: "Êtes-vous sûr ?",
        text: "Voulez-vous valider cette affaire ? Cette action est irréversible !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, valider",
        cancelButtonText: "Annuler",
      });

      if (result.isConfirmed) {
        await updateAffaireStatus(affaireId, "en_cours");
        onValidate();
        Swal.fire(
          "Validé !",
          "Le statut de l'affaire a été mis à jour.",
          "success"
        );
      }
    } catch (error) {
      Swal.fire(
        "Erreur !",
        "Une erreur est survenue lors de la mise à jour du statut.",
        "error"
      );
    }
  };

  return (
    <div
      className={`btn btn-icon btn-sm ${
        isValidated ? "btn-success" : "btn-light-gray"
      }`}
      onClick={handleClick}
      style={{
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
        transition: "all 0.3s ease-out",
        cursor: isValidated ? "not-allowed" : "pointer",
        border: isValidated ? "none" : "1px solid #E4E6EF",
        backgroundColor: isValidated ? "" : "#ffffff",
      }}
    >
      <span
        className={`svg-icon svg-icon-1 ${
          isValidated ? "svg-icon-white" : "svg-icon-gray-500"
        }`}
        style={{
          position: "relative",
          zIndex: 2,
          opacity: 1,
          transition: "opacity 0.3s ease-out",
        }}
      >
        {isValidated ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M9.89557 13.4982L7.79487 11.2651C7.26967 10.7068 6.38251 10.7068 5.85731 11.2651C5.37559 11.7772 5.37559 12.5757 5.85731 13.0878L9.74989 17.2257C10.1448 17.6455 10.8118 17.6455 11.2066 17.2257L18.1427 9.85252C18.6244 9.34044 18.6244 8.54191 18.1427 8.02984C17.6175 7.47154 16.7303 7.47154 16.2051 8.02984L11.061 13.4982C10.7451 13.834 10.2115 13.834 9.89557 13.4982Z"
              fill="currentColor"
            />
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              opacity="0.3"
              x="2"
              y="2"
              width="20"
              height="20"
              rx="10"
              fill="currentColor"
            />
            <rect
              x="11"
              y="14"
              width="2"
              height="2"
              rx="1"
              fill="currentColor"
            />
            <rect
              x="11"
              y="8"
              width="2"
              height="4"
              rx="1"
              fill="currentColor"
            />
          </svg>
        )}
      </span>
    </div>
  );
};

export { ValidateBtn };
