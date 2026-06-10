// import { FC, useEffect } from "react";
// import { useMutation, useQueryClient } from "react-query";
// import { MenuComponent } from "../../../../../../../_metronic/assets/ts/components";
// import { ID, KTIcon, QUERIES } from "../../../../../../../_metronic/helpers";
// import { useListView } from "../../core/ListViewProvider";
// import { useQueryResponse } from "../../core/QueryResponseProvider";
// import { deleteUser } from "../../core/_requests";
// import Swal from "sweetalert2";

// type Props = {
//   id: ID;
// };

// const UserActionsCell: FC<Props> = ({ id }) => {
//   const { setItemIdForUpdate } = useListView();
//   const { query } = useQueryResponse();
//   const queryClient = useQueryClient();

//   useEffect(() => {
//     MenuComponent.reinitialization();
//   }, []);

//   const openEditModal = () => {
//     setItemIdForUpdate(id);
//   };

//   // const deleteItem = useMutation(() => deleteUser(id), {
//   //   onSuccess: () => {
//   //     queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`]);
//   //   },
//   // });
//   // const deleteItem = useMutation(() => deleteUser(id), {
//   //   onSuccess: () => {
//   //     queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`]);
//   //     Swal.fire({
//   //       title: "Supprimé !",
//   //       text: "L'utilisateur a été supprimé avec succès.",
//   //       icon: "success",
//   //       confirmButtonText: "OK",
//   //     });
//   //   },
//   //   onError: () => {
//   //     Swal.fire({
//   //       title: "Erreur !",
//   //       text: "Une erreur est survenue lors de la suppression.",
//   //       icon: "error",
//   //       confirmButtonText: "OK",
//   //     });
//   //   },
//   // });
//   const deleteItem = useMutation(() => deleteUser(id), {
//     onSuccess: () => {
//       queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`]);
//     },
//   });

//   const handleDelete = () => {
//     Swal.fire({
//       title: "Êtes-vous sûr ?",
//       text: "Cette action est irréversible !",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Oui, supprimer",
//       cancelButtonText: "Annuler",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         deleteItem.mutate();
//         Swal.fire(
//           "Supprimé !",
//           "L'utilisateur a été supprimé avec succès.",
//           "success"
//         );
//       }
//     });
//   };

//   // const confirmDelete = () => {
//   //   Swal.fire({
//   //     title: "Êtes-vous sûr ?",
//   //     text: "Cette action est irréversible !",
//   //     icon: "warning",
//   //     showCancelButton: true,
//   //     confirmButtonColor: "#3085d6",
//   //     cancelButtonColor: "#d33",
//   //     confirmButtonText: "Oui, supprimer",
//   //     cancelButtonText: "Annuler",
//   //   }).then((result) => {
//   //     if (result.isConfirmed) {
//   //       deleteItem.mutate();
//   //       Swal.fire("Supprimé !", "L'utilisateur a été supprimé.", "success");
//   //     }
//   //   });
//   // };

//   const confirmDelete = async () => {
//     const result = await Swal.fire({
//       title: "Êtes-vous sûr ?",
//       text: "Cette action est irréversible !",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Oui, supprimer",
//       cancelButtonText: "Annuler",
//     });

//     if (result.isConfirmed) {
//       deleteItem.mutate();
//     }
//   };

//   return (
//     <>
//       {/* <div className='d-flex justify-content-center flex-shrink-0 flex-wrap'> */}
//       <div className="d-flex justify-content-center flex-shrink-0">
//         <button
//           className="btn btn-light-warning btn-active-light-primary btn-sm me-1 mb-1"
//           onClick={() => {
//             /* Logique d'accès */
//           }}
//         >
//           <span className="d-flex align-items-center">
//             <KTIcon iconName="eye" className="fs-5 me-1" />
//             <span className="d-inline-block text-nowrap">Accès</span>
//           </span>
//         </button>
//         <button
//           className="btn btn-light-success btn-active-light-primary btn-sm me-1 mb-1"
//           onClick={openEditModal}
//         >
//           <span className="d-flex align-items-center">
//             <KTIcon iconName="pencil" className="fs-5 me-1" />
//             <span className="d-inline-block text-nowrap">Modifier</span>
//           </span>
//         </button>
//         <button
//           className="btn btn-light-danger btn-active-light-primary btn-sm mb-1"
//           onClick={() => deleteItem.mutate()}
//         >
//           <span className="d-flex align-items-center">
//             <KTIcon iconName="trash" className="fs-5 me-1" />
//             <span className="d-inline-block text-nowrap">Supprimer</span>
//           </span>
//         </button>
//       </div>
//     </>
//   );
// };

// export { UserActionsCell };

import { FC, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { MenuComponent } from "../../../../../../../_metronic/assets/ts/components";
import { ID, KTIcon, QUERIES } from "../../../../../../../_metronic/helpers";
import { useListView } from "../../core/ListViewProvider";
import { useQueryResponse } from "../../core/QueryResponseProvider";
import { deleteUser } from "../../core/_requests";
import Swal from "sweetalert2";

type Props = {
  id: ID;
};

const UserActionsCell: FC<Props> = ({ id }) => {
  const { setItemIdForUpdate } = useListView();
  const { query } = useQueryResponse();
  const queryClient = useQueryClient();

  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

  const openEditModal = () => {
    setItemIdForUpdate(id);
  };

  const deleteItem = useMutation(() => deleteUser(id), {
    onSuccess: () => {
      queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`]);
    },
  });

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        await deleteItem.mutateAsync();
        Swal.fire(
          "Supprimé !",
          "L'utilisateur a été supprimé avec succès.",
          "success"
        );
      } catch (error) {
        Swal.fire("Erreur !", "La suppression a échoué.", "error");
      }
    }
  };

  return (
    <div className="d-flex justify-content-center flex-shrink-0">
      {/* <button
        className="btn btn-light-warning btn-active-light-primary btn-sm me-1 mb-1"
        onClick={() => {
          
        }}
      >
        <span className="d-flex align-items-center">
          <KTIcon iconName="eye" className="fs-5 me-1" />
          <span className="d-inline-block text-nowrap">Accès</span>
        </span>
      </button> */}
      <button
        className="btn btn-light-success btn-active-light-primary btn-sm me-1 mb-1"
        onClick={openEditModal}
      >
        <span className="d-flex align-items-center">
          <KTIcon iconName="pencil" className="fs-5 me-1" />
          <span className="d-inline-block text-nowrap">Modifier</span>
        </span>
      </button>
      <button
        className="btn btn-light-danger btn-active-light-primary btn-sm mb-1"
        onClick={() => handleDelete()}
      >
        <span className="d-flex align-items-center">
          <KTIcon iconName="trash" className="fs-5 me-1" />
          <span className="d-inline-block text-nowrap">Supprimer</span>
        </span>
      </button>
    </div>
  );
};

export { UserActionsCell };
