import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { CardGroup } from "./CardGroup";
import { KTIcon } from "../../../../_metronic/helpers";
import { getRoles, Role } from "../../../../services/api";
import { useAuth } from "../../../modules/auth";

interface Props {
  show: boolean;
  onHide: () => void;
  onSelectUsers: (users: any[]) => void;
  selectedUsers: any[];
  excludedRoleId?: number;
}

const UserSelectionModal: React.FC<Props> = ({
  show,
  onHide,
  onSelectUsers,
  selectedUsers,
  excludedRoleId,
}) => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [localSelectedUsers, setLocalSelectedUsers] = useState(selectedUsers);
  const [activeKey, setActiveKey] = useState("");

  useEffect(() => {
    if (show) {
      loadRoles();
    }
  }, [show]);

  useEffect(() => {
    setLocalSelectedUsers(selectedUsers);
  }, [selectedUsers]);

  const loadRoles = async () => {
    try {
      const rolesData = await getRoles();
      const filteredRoles = excludedRoleId
        ? rolesData.filter((role: any) => role.id !== excludedRoleId)
        : rolesData;

      if (filteredRoles.length > 0) {
        setActiveKey(filteredRoles[0].code);
      }
      setRoles(filteredRoles);
    } catch (error) {
      console.error("Erreur lors du chargement des rôles:", error);
    }
  };

  const filterUsersBySearchTerm = (users: any[]) => {
    return users.filter(
      (user) =>
        user.id !== currentUser?.id &&
        (user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.prenoms.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const handleUserSelect = (user: any) => {
    setLocalSelectedUsers((prev) => {
      const isSelected = prev.some((u) => u.id === user.id);
      if (isSelected) {
        return prev.filter((u) => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  const handleAddParticipants = () => {
    onSelectUsers(localSelectedUsers);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Sélectionner des participants</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3 position-relative w-75 mx-auto">
          <Form.Control
            type="text"
            placeholder="Rechercher des utilisateurs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ps-12"
          />
          <KTIcon
            iconName="magnifier"
            className="fs-2 text-gray-500 position-absolute top-50 start-0 translate-middle-y ms-4"
          />
        </Form.Group>

        <div className="mt-5">
          <ul className="nav nav-tabs nav-line-tabs nav-line-tabs-2x mb-5 fs-6">
            {roles.map((role) => (
              <li className="nav-item" key={role.code}>
                <button
                  className={`nav-link ${
                    activeKey === role.code ? "active" : ""
                  }`}
                  onClick={() => setActiveKey(role.code)}
                >
                  {role.nom}
                </button>
              </li>
            ))}
          </ul>

          <div className="tab-content">
            {roles.map((role) => (
              <div
                key={role.code}
                className={`tab-pane fade ${
                  activeKey === role.code ? "show active" : ""
                }`}
              >
                <div className="d-flex flex-wrap justify-content-center">
                  {filterUsersBySearchTerm(role.utilisateurs || []).map(
                    (user) => (
                      <CardGroup
                        key={user.id}
                        id={user.id}
                        name={`${user.nom} ${user.prenoms}`}
                        job={role.nom}
                        isSelected={localSelectedUsers.some(
                          (u) => u.id === user.id
                        )}
                        onSelect={() => handleUserSelect(user)}
                      />
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleAddParticipants}>
          Ajouter les participants ({localSelectedUsers.length})
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserSelectionModal;
