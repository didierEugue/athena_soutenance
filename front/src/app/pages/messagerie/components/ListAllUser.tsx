import React, { useState, useEffect } from "react";
import { Modal, Nav, Tab } from "react-bootstrap";
import { Card1 } from "./Card1";
import { KTIcon } from "../../../../_metronic/helpers";
import { getRoles, Role } from "../../../../services/api";

const ListAllUser: React.FC<{
  show: boolean;
  onHide: () => void;
  onUserSelect: (user: any) => void;
}> = ({ show, onHide, onUserSelect }) => {
  const [key, setKey] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const rolesData = await getRoles();
      setRoles(rolesData);
      if (rolesData.length > 0) {
        setKey(rolesData[0].code);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des rôles:", error);
    }
  };

  const filterUsersBySearchTerm = (users: any[]) => {
    return users.filter(
      (user) =>
        user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.prenoms.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderUserList = (roleCode: string) => {
    const role = roles.find((r) => r.code === roleCode);
    const users = role ? filterUsersBySearchTerm(role.utilisateurs || []) : [];

    return (
      <div className="row g-6 g-xl-9">
        {users.map((user) => (
          <div key={user.id} className="col-md-6 col-xxl-3">
            <div
              onClick={() => handleUserClick(user)}
              style={{ cursor: "pointer" }}
            >
              <Card1
                avatar={`media/avatars/blank.png`}
                name={`${user.nom} ${user.prenoms}`}
                job={role?.nom || ""}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleUserClick = (user: any) => {
    onUserSelect(user);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Sélectionner un utilisateur</Modal.Title>
      </Modal.Header>
      <div className="px-5 py-3">
        <form className="position-relative">
          <input
            type="text"
            className="form-control form-control-solid px-15"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <KTIcon
            iconName="magnifier"
            className="fs-2 text-gray-500 position-absolute top-50 end-0 translate-middle-y me-5"
          />
        </form>
      </div>
      <Modal.Body>
        <Tab.Container activeKey={key} onSelect={(k) => setKey(k || "")}>
          <Nav variant="tabs" className="mb-5">
            {roles.map((role) => (
              <Nav.Item key={role.code}>
                <Nav.Link eventKey={role.code}>{role.nom}</Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          <Tab.Content>
            {roles.map((role) => (
              <Tab.Pane key={role.code} eventKey={role.code}>
                {renderUserList(role.code)}
              </Tab.Pane>
            ))}
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
    </Modal>
  );
};

export { ListAllUser };
