import { FC, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { MenuComponent } from "../../../../../../../_metronic/assets/ts/components";
import { ID, KTIcon, QUERIES } from "../../../../../../../_metronic/helpers";
import { useListView } from "../../core/ListViewProvider";
import { useQueryResponse } from "../../core/QueryResponseProvider";
import { deleteUser } from "../../core/_requests";

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
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`]);
    },
  });

  return (
    <>
      <div className="d-flex justify-content-center flex-shrink-0 flex-wrap">
        {/* <button
        className='btn btn-light-warning btn-active-light-primary btn-sm me-1 mb-1'
        onClick={() => {/* Logique d'accès *
      >
        <span className='d-flex align-items-center'>
          <KTIcon iconName='eye' className='fs-5 me-1' />
          <span className='d-inline-block text-nowrap'>Accès</span>
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
          onClick={() => {
            /* Logique d'accès */
          }}
        >
          <span className="d-flex align-items-center">
            <KTIcon iconName="trash" className="fs-5 me-1" />
            <span className="d-inline-block text-nowrap">Supprimer</span>
          </span>
        </button>
      </div>
    </>
  );
};

export { UserActionsCell };
