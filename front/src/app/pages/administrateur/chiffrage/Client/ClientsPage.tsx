import React, { useState, useEffect } from "react";
import { KTIcon } from "../../../../../_metronic/helpers";
import ClientForm from "./ClientForm";
import { Modal } from "react-bootstrap";
import { Client, getClients, deleteClient } from "../../../../../services/api";

type Props = {
  className: string;
};

const ClientsPage: React.FC<Props> = ({ className }) => {
  const [showModal, setShowModal] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>(
    undefined
  );

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const data = await getClients();
    setClients(data);
  };

  const handleDelete = async (id: number) => {
    await deleteClient(id);
    fetchClients();
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const handleSubmit = () => {
    setShowModal(false);
    setSelectedClient(undefined);
    fetchClients();
  };

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">
            Liste des Clients
          </span>
          <span className="text-muted mt-1 fw-semibold fs-7">
            Total de : {clients.length} Clients
          </span>
        </h3>

        <div className="card-toolbar">
          <a
            href="#"
            className="btn btn-sm btn-light-primary"
            onClick={() => setShowModal(true)}
          >
            <KTIcon iconName="plus" className="fs-2" />
            Ajouter un Client
          </a>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className="card-body py-3">
        {/* begin::Table container */}
        <div className="table-responsive">
          {/* begin::Table */}
          <table className="table align-middle gs-0 gy-4">
            {/* begin::Table head */}
            <thead>
              <tr className="fw-bold text-muted bg-light">
                <th className="ps-4 min-w-325px rounded-start">Nom complet</th>
                <th className="min-w-125px">Téléphone</th>
                <th className="min-w-125px">Email</th>
                <th className="min-w-200px">Adresse</th>
                <th className="min-w-200px text-center rounded-end">Actions</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="symbol symbol-50px me-5"></div>
                      <div className="d-flex justify-content-start flex-column">
                        <a
                          href="#"
                          className="text-gray-900 fw-bold text-hover-primary mb-1 fs-6"
                        >
                          {client.nom}
                        </a>
                      </div>
                    </div>
                  </td>
                  <td>
                    <a
                      href="#"
                      className="text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6"
                    >
                      {client.telephone}
                    </a>
                  </td>
                  <td>
                    <a
                      href="#"
                      className="text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6"
                    >
                      {client.email}
                    </a>
                  </td>
                  <td>
                    <a
                      href="#"
                      className="text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6"
                    >
                      {client.adresse}
                    </a>
                  </td>
                  <td className="text-center">
                    <a
                      href="#"
                      className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                      onClick={() => handleEdit(client)}
                    >
                      <KTIcon iconName="pencil" className="fs-3" />
                    </a>
                    <a
                      href="#"
                      className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
                      onClick={() => handleDelete(client.id!)}
                    >
                      <KTIcon iconName="trash" className="fs-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedClient
              ? "Modifier le client"
              : "Ajouter un nouveau client"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ClientForm client={selectedClient} onSubmit={handleSubmit} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export { ClientsPage };
