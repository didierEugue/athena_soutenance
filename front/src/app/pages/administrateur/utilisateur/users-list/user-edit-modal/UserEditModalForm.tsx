import React, { FC, useState, useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { isNotEmpty, toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import { initialUser, User } from "../core/_models";
import clsx from "clsx";
import { useListView } from "../core/ListViewProvider";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import {
  createUser,
  updateUser,
  getRoles,
  Role,
} from "../../../../../../services/api";
import { useQueryResponse } from "../core/QueryResponseProvider";
import { AddRole } from "./AddRole";
import { uploadAvatar } from "../../../../../../services/api";
import Swal from "sweetalert2";

type Props = {
  isUserLoading: boolean;
  user: User;
};

const capitalizeWords = (str: string) => {
  return str.replace(/\b\w/g, (l) => l.toUpperCase());
};

const editUserSchema = Yup.object().shape({
  email: Yup.string()
    .email("Format d'email incorrect")
    .min(3, "Minimum 3 caractères")
    .max(50, "Maximum 50 caractères")
    .required("L'email est requis"),
  nom: Yup.string()
    .min(3, "Minimum 3 caractères")
    .max(50, "Maximum 50 caractères")
    .required("Le nom est requis"),
  prenoms: Yup.string()
    .min(3, "Minimum 3 caractères")
    .max(50, "Maximum 50 caractères")
    .required("Le prénom est requis"),
  telephone: Yup.string().required("Le téléphone est requis"),
  password: Yup.string().min(8, "Minimum 8 caractères").nullable(),
  role: Yup.string().required("Le rôle est requis"),
  adresse: Yup.string().required("L'adresse est requise"),
});

const UserEditModalForm: FC<Props> = ({ user, isUserLoading }) => {
  const { setItemIdForUpdate } = useListView();
  const { refetch } = useQueryResponse();
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files[0]) {
  //     setSelectedFile(event.target.files[0]);
  //   }
  // };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      // Créer une URL pour la prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchRoles = async () => {
    try {
      const rolesData = await getRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error("Erreur lors de la récupération des rôles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleRoleAdded = () => {
    fetchRoles();
  };

  const [userForEdit] = useState<User>({
    ...user,
    // avatar: user.avatar || initialUser.avatar,
    role: user.role || initialUser.role,
    nom: user.nom || initialUser.nom,
    prenoms: user.prenoms || initialUser.prenoms,
    telephone: user.telephone || initialUser.telephone,
    email: user.email || initialUser.email,
    adresse: user.adresse || initialUser.adresse,
    password: "",
  });

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch();
    }
    setItemIdForUpdate(undefined);
  };

  const blankImg = toAbsoluteUrl("media/svg/avatars/blank.svg");
  // const userAvatarImg = toAbsoluteUrl(`media/${userForEdit.avatar}`)
  const userAvatarImg = toAbsoluteUrl(`media/avatars/300-6.jpg`);

  // const formik = useFormik({
  //   initialValues: userForEdit,
  //   validationSchema: editUserSchema,
  //   onSubmit: async (values, { setSubmitting }) => {
  //     setSubmitting(true);
  //     try {
  //       const dataToSend = { ...values };
  //       if (!dataToSend.password) {
  //         delete dataToSend.password;
  //       }
  //       if (isNotEmpty(values.id) && typeof values.id === "number") {
  //         await updateUser(values.id, dataToSend);
  //       } else {
  //         await createUser(dataToSend);
  //       }
  //       cancel(true);
  //     } catch (ex) {
  //       console.error(ex);
  //     } finally {
  //       setSubmitting(false);
  //     }
  //   },
  // });
  // const formik = useFormik({
  //   initialValues: userForEdit,
  //   validationSchema: editUserSchema,
  //   onSubmit: async (values, { setSubmitting }) => {
  //     setSubmitting(true);
  //     try {
  //       // Étape 1: Créer/Modifier l'utilisateur
  //       const userData = { ...values };
  //       if (!userData.password) {
  //         delete userData.password;
  //       }

  //       let userId: number;
  //       if (isNotEmpty(values.id) && typeof values.id === "number") {
  //         const updatedUser = await updateUser(values.id, userData);
  //         userId = values.id;
  //       } else {
  //         const newUser = await createUser(userData);
  //         userId = newUser.id;
  //       }

  //       // Étape 2: Upload de l'avatar si un fichier est sélectionné
  //       if (selectedFile) {
  //         await uploadAvatar(selectedFile, userId);
  //       }

  //       // Succès
  //       await Swal.fire({
  //         icon: "success",
  //         title: "Succès!",
  //         text: "Utilisateur et avatar enregistrés avec succès",
  //         confirmButtonText: "OK",
  //       });

  //       cancel(true);
  //     } catch (ex) {
  //       console.error(ex);
  //       Swal.fire({
  //         icon: "error",
  //         title: "Erreur",
  //         text: "Une erreur est survenue lors de l'enregistrement",
  //         confirmButtonText: "OK",
  //       });
  //     } finally {
  //       setSubmitting(false);
  //     }
  //   },
  // });

  // const formik = useFormik({
  //   initialValues: userForEdit,
  //   validationSchema: editUserSchema,
  //   onSubmit: async (values, { setSubmitting }) => {
  //     setSubmitting(true);
  //     try {
  //       let userId: number;

  //       // Étape 1: Créer/Modifier l'utilisateur
  //       if (isNotEmpty(values.id) && typeof values.id === "number") {
  //         const updatedUser = await updateUser(values.id, values);
  //         userId = values.id;
  //       } else {
  //         const newUser = await createUser(values);
  //         userId = newUser.id;
  //       }

  //       console.log("ID utilisateur après création/modification:", userId); // Debug

  //       // Étape 2: Upload de l'avatar si un fichier est sélectionné
  //       if (selectedFile && userId) {
  //         const uploadResult = await uploadAvatar(selectedFile, userId);
  //         console.log("Résultat upload:", uploadResult); // Debug
  //       }

  //       await Swal.fire({
  //         icon: "success",
  //         title: "Succès!",
  //         text: "Utilisateur et avatar enregistrés avec succès",
  //         confirmButtonText: "OK",
  //       });

  //       cancel(true);
  //     } catch (ex) {
  //       console.error(ex);
  //       Swal.fire({
  //         icon: "error",
  //         title: "Erreur",
  //         text: "Une erreur est survenue lors de l'enregistrement",
  //         confirmButtonText: "OK",
  //       });
  //     } finally {
  //       setSubmitting(false);
  //     }
  //   },
  // });

  const formik = useFormik({
    initialValues: userForEdit,
    validationSchema: editUserSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        let userId: number;
        let userData = { ...values };

        // Création/Modification de l'utilisateur
        if (isNotEmpty(values.id) && typeof values.id === "number") {
          const updatedUser = await updateUser(values.id, userData);
          userId = values.id;
        } else {
          const newUser = await createUser(userData);
          userId = newUser.id;
        }

        // Upload de l'avatar si un fichier est sélectionné
        if (selectedFile && userId) {
          try {
            const uploadResult = await uploadAvatar(selectedFile, userId);
            console.log("Upload réussi:", uploadResult);
          } catch (uploadError) {
            console.error("Erreur upload:", uploadError);
            throw new Error("Erreur lors de l'upload de l'avatar");
          }
        }

        await Swal.fire({
          icon: "success",
          title: "Succès!",
          text: "Utilisateur et avatar enregistrés avec succès",
          confirmButtonText: "OK",
        });

        cancel(true);
      } catch (error) {
        console.error("Erreur:", error);
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: (error as any).message || "Une erreur est survenue",
          confirmButtonText: "OK",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <form
        id="kt_modal_add_user_form"
        className="form"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <div
          className="d-flex flex-column scroll-y me-n7 pe-7"
          id="kt_modal_add_user_scroll"
          data-kt-scroll="true"
          data-kt-scroll-activate="{default: false, lg: true}"
          data-kt-scroll-max-height="auto"
          data-kt-scroll-dependencies="#kt_modal_add_user_header"
          data-kt-scroll-wrappers="#kt_modal_add_user_scroll"
          data-kt-scroll-offset="300px"
        >
          <div className="row mb-7">
            <div className="col-md-6">
              <div className="fv-row mb-7">
                <label className="d-block fw-bold fs-6 mb-5">Avatar</label>
                <div
                  className="image-input image-input-outline"
                  data-kt-image-input="true"
                  style={{ backgroundImage: `url('${blankImg}')` }}
                >
                  <div
                    className="image-input-wrapper w-125px h-125px"
                    style={{ backgroundImage: `url('${userAvatarImg}')` }}
                  ></div>
                  <label
                    className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                    data-kt-image-input-action="change"
                    data-bs-toggle="tooltip"
                    title="Changer l'avatar"
                  >
                    <i className="bi bi-pencil-fill fs-7"></i>
                    {/* <input
                      type="file"
                      name="avatar"
                      accept=".png, .jpg, .jpeg"
                    /> */}
                    {/* <input
                      type="file"
                      name="fichier"
                      accept=".png, .jpg, .jpeg"
                      onChange={handleFileChange}
                    /> */}
                    <input
                      type="file"
                      name="fichier"
                      accept=".png, .jpg, .jpeg"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    {previewImage && (
                      <div className="image-preview mt-2">
                        <img
                          src={previewImage}
                          alt="Preview"
                          style={{ maxWidth: "100px" }}
                        />
                      </div>
                    )}
                    <input type="hidden" name="avatar_remove" />
                  </label>
                  <span
                    className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                    data-kt-image-input-action="cancel"
                    data-bs-toggle="tooltip"
                    title="Annuler l'avatar"
                  >
                    <i className="bi bi-x fs-2"></i>
                  </span>
                  <span
                    className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                    data-kt-image-input-action="remove"
                    data-bs-toggle="tooltip"
                    title="Supprimer l'avatar"
                  >
                    <i className="bi bi-x fs-2"></i>
                  </span>
                </div>
                <div className="form-text">
                  Types de fichiers autorisés : png, jpg, jpeg.
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-7">
                <label className="required fw-bold fs-6 mb-2">Nom</label>
                <input
                  placeholder="Nom"
                  {...formik.getFieldProps("nom")}
                  onChange={(e) => {
                    const upperCaseValue = e.target.value.toUpperCase();
                    formik.setFieldValue("nom", upperCaseValue);
                  }}
                  type="text"
                  name="nom"
                  className={clsx(
                    "form-control form-control-solid mb-3 mb-lg-0",
                    { "is-invalid": formik.touched.nom && formik.errors.nom },
                    { "is-valid": formik.touched.nom && !formik.errors.nom }
                  )}
                  autoComplete="off"
                  disabled={formik.isSubmitting || isUserLoading}
                />
                {formik.touched.nom && formik.errors.nom && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert">{formik.errors.nom}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="mb-7">
                <label className="required fw-bold fs-6 mb-2">Prénom</label>
                <input
                  placeholder="Prénom"
                  {...formik.getFieldProps("prenoms")}
                  onChange={(e) => {
                    const capitalizedValue = capitalizeWords(e.target.value);
                    formik.setFieldValue("prenoms", capitalizedValue);
                  }}
                  type="text"
                  name="prenoms"
                  className={clsx(
                    "form-control form-control-solid mb-3 mb-lg-0",
                    {
                      "is-invalid":
                        formik.touched.prenoms && formik.errors.prenoms,
                    },
                    {
                      "is-valid":
                        formik.touched.prenoms && !formik.errors.prenoms,
                    }
                  )}
                  autoComplete="off"
                  disabled={formik.isSubmitting || isUserLoading}
                />
                {formik.touched.prenoms && formik.errors.prenoms && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert">{formik.errors.prenoms}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="fv-row mb-7">
            <label className="required fw-bold fs-6 mb-2">Téléphone</label>
            <input
              placeholder="Téléphone"
              {...formik.getFieldProps("telephone")}
              type="tel"
              name="telephone"
              className={clsx(
                "form-control form-control-solid mb-3 mb-lg-0",
                {
                  "is-invalid":
                    formik.touched.telephone && formik.errors.telephone,
                },
                {
                  "is-valid":
                    formik.touched.telephone && !formik.errors.telephone,
                }
              )}
              autoComplete="off"
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.telephone && formik.errors.telephone && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert">{formik.errors.telephone}</span>
                </div>
              </div>
            )}
          </div>

          <div className="fv-row mb-7">
            <label className="required fw-bold fs-6 mb-2">Email</label>
            <input
              placeholder="Email"
              {...formik.getFieldProps("email")}
              className={clsx(
                "form-control form-control-solid mb-3 mb-lg-0",
                { "is-invalid": formik.touched.email && formik.errors.email },
                { "is-valid": formik.touched.email && !formik.errors.email }
              )}
              type="email"
              name="email"
              autoComplete="off"
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="fv-plugins-message-container">
                <span role="alert">{formik.errors.email}</span>
              </div>
            )}
          </div>

          <div className="fv-row mb-7">
            <label className="fw-bold fs-6 mb-2">Mot de passe</label>
            <input
              placeholder="Laisser vide pour ne pas changer"
              {...formik.getFieldProps("password")}
              type="password"
              name="password"
              className={clsx(
                "form-control form-control-solid mb-3 mb-lg-0",
                {
                  "is-invalid":
                    formik.touched.password && formik.errors.password,
                },
                {
                  "is-valid":
                    formik.touched.password && !formik.errors.password,
                }
              )}
              autoComplete="off"
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert">{formik.errors.password}</span>
                </div>
              </div>
            )}
          </div>

          <div className="fv-row mb-7">
            <label className="required fw-bold fs-6 mb-2">Rôle</label>
            <div className="d-flex align-items-center">
              <select
                className={clsx(
                  "form-select form-select-solid fw-bolder",
                  { "is-invalid": formik.touched.role && formik.errors.role },
                  { "is-valid": formik.touched.role && !formik.errors.role }
                )}
                {...formik.getFieldProps("role")}
                name="role"
              >
                <option value="">Sélectionnez un rôle</option>
                {roles.map((role) => (
                  <option key={role.id} value={`/api/roles/${role.id}`}>
                    {role.nom}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-icon btn-primary ms-2"
                onClick={() => setShowAddRoleModal(true)}
              >
                <i className="bi bi-plus-lg"></i>
              </button>
            </div>
            {formik.touched.role && formik.errors.role && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert">{formik.errors.role}</span>
                </div>
              </div>
            )}
          </div>

          {/* <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Adresse</label>
            <input
              placeholder='Adresse'
              {...formik.getFieldProps('adresse')}
              type='text'
              name='adresse'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.adresse && formik.errors.adresse},
                {'is-valid': formik.touched.adresse && !formik.errors.adresse}
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.adresse && formik.errors.adresse && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.adresse}</span>
                </div>
              </div>
            )}
          </div> */}
          <div className="fv-row mb-7">
            <label className="required fw-bold fs-6 mb-2">Adresse</label>
            <input
              placeholder="Adresse"
              {...formik.getFieldProps("adresse")}
              onChange={(e) => {
                const capitalizedValue = capitalizeWords(e.target.value);
                formik.setFieldValue("adresse", capitalizedValue);
              }}
              type="text"
              name="adresse"
              className={clsx(
                "form-control form-control-solid mb-3 mb-lg-0",
                {
                  "is-invalid": formik.touched.adresse && formik.errors.adresse,
                },
                { "is-valid": formik.touched.adresse && !formik.errors.adresse }
              )}
              autoComplete="off"
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.adresse && formik.errors.adresse && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert">{formik.errors.adresse}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center pt-15">
          <button
            type="reset"
            onClick={() => cancel()}
            className="btn btn-light me-3"
            data-kt-users-modal-action="cancel"
            disabled={formik.isSubmitting || isUserLoading}
          >
            Annuler
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            data-kt-users-modal-action="submit"
            disabled={
              isUserLoading ||
              formik.isSubmitting ||
              !formik.isValid ||
              !formik.touched
            }
          >
            <span className="indicator-label">Soumettre</span>
            {(formik.isSubmitting || isUserLoading) && (
              <span className="indicator-progress">
                Veuillez patienter...{" "}
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            )}
          </button>
        </div>
      </form>
      {(formik.isSubmitting || isUserLoading) && <UsersListLoading />}
      {showAddRoleModal && (
        <AddRole
          show={showAddRoleModal}
          handleClose={() => setShowAddRoleModal(false)}
          onRoleAdded={handleRoleAdded}
        />
      )}
    </>
  );
};

export { UserEditModalForm };
