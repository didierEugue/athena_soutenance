import React, { useState } from "react";
import { KTIcon } from "../../../../../../../_metronic/helpers";
import { useListView } from "../../core/ListViewProvider";
import { UsersListFilter } from "./UsersListFilter";
import DefaultAccess from "./Default_Access";
import { Modal } from "react-bootstrap";
import { Qualifications } from "./../../../Qualification";

const UsersListToolbar = () => {
  const { setItemIdForUpdate } = useListView();
  const [showDefaultAccess, setShowDefaultAccess] = useState(false);
  const [showRolesModal, setShowRolesModal] = useState(false);

  const openAddUserModal = () => {
    setItemIdForUpdate(null);
  };

  const openDefaultAccessModal = () => {
    setShowDefaultAccess(true);
  };

  const openRolesModal = () => {
    setShowRolesModal(true);
  };

  return (
    <div
      className="d-flex justify-content-end"
      data-kt-user-table-toolbar="base"
    >
      <UsersListFilter />

      {/* <button type='button' className='btn btn-light-info me-3' onClick={openDefaultAccessModal}>
        <KTIcon iconName='key' className='fs-2' />
        Accès par défaut
      </button> */}

      <button
        type="button"
        className="btn btn-light-primary me-3"
        onClick={openRolesModal}
      >
        <KTIcon iconName="lock-3" className="fs-2" />
        Rôles
      </button>

      <button
        type="button"
        className="btn btn-primary"
        onClick={openAddUserModal}
      >
        <KTIcon iconName="plus" className="fs-2" />
        Ajouter
      </button>

      <DefaultAccess
        show={showDefaultAccess}
        onHide={() => setShowDefaultAccess(false)}
      />

      <Modal
        show={showRolesModal}
        onHide={() => setShowRolesModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Rôles</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Qualifications className="" />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export { UsersListToolbar };
