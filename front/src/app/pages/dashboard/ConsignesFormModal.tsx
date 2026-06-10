import { FC, useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../modules/auth";
import Select from "react-select";
import { getUtilisateurs } from "../../../services/api";
import clsx from "clsx";

interface ConsignesFormModalProps {
  show: boolean;
  handleClose: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any;
}

const priorityOptions = [
  { value: "important/urgent", label: "Important/Urgent", color: "#F1416C" },
  {
    value: "important/non_urgent",
    label: "Important/Non Urgent",
    color: "#FF9900",
  },
  {
    value: "urgent/non_important",
    label: "Urgent/Non Important",
    color: "#FFD700",
  },
  {
    value: "non_urgent/non_important",
    label: "Non Urgent/Non Important",
    color: "#A1A5B7",
  },
];

const typeOptions = [
  { value: "personnel", label: "Personnel" },
  { value: "direction", label: "Direction" },
];

const getCurrentDate = () => {
  return new Date().toISOString().split("T")[0];
};

const ConsignesFormModal: FC<ConsignesFormModalProps> = ({
  show,
  handleClose,
  onSubmit,
  initialValues,
}) => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState(
    initialValues?.type || "personnel"
  );

  //   useEffect(() => {
  //     const fetchUsers = async () => {
  //       const response = await getUtilisateurs();
  //       const filteredUsers = response.filter(
  //         (user: any) => user.id !== currentUser?.id
  //       );
  //       setUsers(filteredUsers);
  //     };
  //     fetchUsers();
  //   }, [currentUser]);
  //   useEffect(() => {
  //     if (initialValues) {
  //       formik.setValues({
  //         titre: initialValues.titre,
  //         contenu: initialValues.contenu,
  //         date_echeance: new Date(initialValues.date_echeance)
  //           .toISOString()
  //           .slice(0, 16),
  //         priorite: initialValues.priorite,
  //         type: initialValues.type,
  //         destinataire: initialValues.destinataire["@id"],
  //       });
  //       setSelectedType(initialValues.type);
  //     }
  //   }, [initialValues]);
  useEffect(() => {
    if (show) {
      if (initialValues) {
        formik.setValues({
          titre: initialValues.titre,
          contenu: initialValues.contenu,
          date_echeance: new Date(initialValues.date_echeance)
            .toISOString()
            .slice(0, 16),
          priorite: initialValues.priorite,
          type: initialValues.type,
          destinataire: initialValues.destinataire["@id"],
        });
        setSelectedType(initialValues.type);
      } else {
        formik.resetForm();
        setSelectedType("personnel");
      }
    }
  }, [show, initialValues]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUtilisateurs();
        const filteredUsers = response.filter(
          (user: any) => user.id !== currentUser?.id
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des utilisateurs:",
          error
        );
      }
    };
    fetchUsers();
  }, [currentUser]);

  //   const formik = useFormik({
  //     initialValues: initialValues || {
  //       titre: "",
  //       contenu: "",
  //       date_echeance: "",
  //       priorite: "",
  //       type: "personnel",
  //       destinataire: "",
  //     },
  //     validationSchema: Yup.object({
  //       titre: Yup.string().required("Le titre est requis"),
  //       contenu: Yup.string().required("Le contenu est requis"),
  //       date_echeance: Yup.string().required("La date d'échéance est requise"),
  //       priorite: Yup.string().required("La priorité est requise"),
  //       type: Yup.string().required("Le type est requis"),
  //       destinataire: Yup.string().when("type", {
  //         is: "direction",
  //         then: Yup.string().required("Le destinataire est requis"),
  //       }),
  //     }),
  //     onSubmit: (values) => {
  //       const formattedValues = {
  //         ...values,
  //         etat: "standby",
  //         expediteur: `/api/utilisateurs/${currentUser?.id}`,
  //         destinataire:
  //           values.type === "personnel"
  //             ? `/api/utilisateurs/${currentUser?.id}`
  //             : values.destinataire,
  //       };
  //       onSubmit(formattedValues);
  //       handleClose();
  //     },
  //   });
  const validationSchema = Yup.object({
    titre: Yup.string().required("Le titre est requis"),
    contenu: Yup.string().required("Le contenu est requis"),
    date_echeance: Yup.string().required("La date d'échéance est requise"),
    priorite: Yup.string().required("La priorité est requise"),
    type: Yup.string().required("Le type est requis"),
    destinataire: Yup.string().when("type", {
      is: (val: string) => val === "direction",
      then: () => Yup.string().required("Le destinataire est requis"),
      otherwise: () => Yup.string(),
    }),
  });

  const formik = useFormik({
    initialValues: initialValues || {
      titre: "",
      contenu: "",
      date_echeance: "",
      priorite: "",
      type: "personnel",
      destinataire: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const formattedValues = {
        ...values,
        etat: "standby",
        expediteur: `/api/utilisateurs/${currentUser?.id}`,
        destinataire:
          values.type === "personnel"
            ? `/api/utilisateurs/${currentUser?.id}`
            : values.destinataire,
      };
      onSubmit(formattedValues);
      handleClose();
    },
  });

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <form onSubmit={formik.handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            {initialValues ? "Modifier" : "Nouvelle"} Consigne
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <label className="form-label required">Titre</label>
            <input
              type="text"
              className="form-control"
              {...formik.getFieldProps("titre")}
            />
            {formik.touched.titre && formik.errors.titre && (
              <div className="text-danger">{formik.errors.titre as string}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label required">Contenu</label>
            <textarea
              className="form-control"
              rows={3}
              {...formik.getFieldProps("contenu")}
            />
            {formik.touched.contenu && formik.errors.contenu && (
              <div className="text-danger">{formik.errors.contenu as string}</div>
            )}
          </div>

          {/* <div className="mb-4">
            <label className="form-label required">Date d'échéance</label>
            <input
              type="datetime-local"
              className="form-control"
              {...formik.getFieldProps("date_echeance")}
            />
            {formik.touched.date_echeance && formik.errors.date_echeance && (
              <div className="text-danger">{formik.errors.date_echeance as string}</div>
            )}
          </div> */}
          <div className="mb-4">
            <label className="form-label required">Date d'échéance</label>
            <input
              type="date"
              className={clsx("form-control form-control-lg", {
                "is-invalid":
                  formik.touched.date_echeance && formik.errors.date_echeance,
              })}
              min={getCurrentDate()}
              {...formik.getFieldProps("date_echeance")}
            />
            {formik.touched.date_echeance && formik.errors.date_echeance && (
              <div className="text-danger">{formik.errors.date_echeance as string}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label required">Priorité</label>
            {/* <Select
              options={priorityOptions}
              value={priorityOptions.find(
                (option) => option.value === formik.values.priorite
              )}
              onChange={(option) =>
                formik.setFieldValue("priorite", option?.value)
              }
              className="form-select-lg"
            /> */}
            <Select
              options={priorityOptions}
              value={priorityOptions.find(
                (option) => option.value === formik.values.priorite
              )}
              onChange={(option) =>
                formik.setFieldValue("priorite", option?.value)
              }
              styles={{
                control: (base) => ({
                  ...base,
                  width: "100%",
                }),
                option: (base, { data }) => ({
                  ...base,
                  paddingLeft: "25px",
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: data.color,
                  },
                }),
              }}
            />
            {formik.touched.priorite && formik.errors.priorite && (
              <div className="text-danger">{formik.errors.priorite as string}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label required">Type</label>
            <Select
              options={typeOptions}
              value={typeOptions.find(
                (option) => option.value === formik.values.type
              )}
              onChange={(option) => {
                formik.setFieldValue("type", option?.value);
                setSelectedType(option?.value || "personnel");
                if (option?.value === "personnel") {
                  formik.setFieldValue(
                    "destinataire",
                    `/api/utilisateurs/${currentUser?.id}`
                  );
                }
              }}
            />
          </div>

          {selectedType === "direction" && (
            <div className="mb-4">
              <label className="form-label required">Destinataire</label>
              <Select
                options={users.map((user) => ({
                  value: `/api/utilisateurs/${user.id}`,
                  label: `${user.nom} ${user.prenoms}`,
                }))}
                value={users
                  .map((user) => ({
                    value: `/api/utilisateurs/${user.id}`,
                    label: `${user.nom} ${user.prenoms}`,
                  }))
                  .find(
                    (option) => option.value === formik.values.destinataire
                  )}
                onChange={(option) =>
                  formik.setFieldValue("destinataire", option?.value)
                }
              />
              {formik.touched.destinataire && formik.errors.destinataire && (
                <div className="text-danger">{formik.errors.destinataire as string}</div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-light" onClick={handleClose}>
            Annuler
          </button>
          <button type="submit" className="btn btn-primary">
            {initialValues ? "Modifier" : "Créer"}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export { ConsignesFormModal };
