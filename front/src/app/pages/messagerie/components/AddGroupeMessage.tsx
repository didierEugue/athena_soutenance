import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import Select from "react-select";
import { KTIcon } from "../../../../_metronic/helpers";
import UserSelectionModal from "./UserSelectionModal";
import { getRoles } from "../../../../services/api";
import { useAuth } from "../../../modules/auth";

const OBJETS_DISCUSSION = [
  "Demande de chiffrage",
  "Ordre de fabrication",
  "Rapport de visite",
  "Contrôles des attentes",
  "Besoins atelier",
];

const AddGroupeMessage: React.FC<{
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}> = ({ onClose, onSubmit }) => {
  const { currentUser } = useAuth();
  const [selectedObject, setSelectedObject] = useState("");
  const [nature, setNature] = useState("");
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const rolesData = await getRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error("Erreur lors du chargement des rôles:", error);
    }
  };

  const handleSelectUsers = (users: any[]) => {
    setSelectedUsers(users);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedObject ||
      !nature ||
      !selectedRole ||
      selectedUsers.length === 0
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        objet: {
          objet_discussion: selectedObject,
          nature: nature,
          statut: "Actif",
          reponse: "",
          archiver: false,
        },
        role: selectedRole,
        participants: [...selectedUsers, currentUser],
      });
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Objet de la discussion</Form.Label>
        <Form.Select
          value={selectedObject}
          onChange={(e) => setSelectedObject(e.target.value)}
          required
        >
          <option value="">Sélectionnez un objet</option>
          {OBJETS_DISCUSSION.map((objet) => (
            <option key={objet} value={objet}>
              {objet}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Nature du problème</Form.Label>
        <Form.Control
          type="text"
          value={nature}
          onChange={(e) => setNature(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Type de collaborateur</Form.Label>
        <div className="d-flex flex-wrap gap-4 mb-3">
          {roles.map((role) => (
            <Form.Check
              key={role.id}
              inline
              type="radio"
              label={role.nom}
              name="groupType"
              id={`role-${role.id}`}
              checked={selectedRole?.id === role.id}
              onChange={() => setSelectedRole(role)}
            />
          ))}
        </div>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Participants</Form.Label>
        <div className="d-flex align-items-center">
          <Select
            isMulti
            options={selectedUsers.map((user) => ({
              value: user.id,
              label: `${user.nom} ${user.prenoms}`,
            }))}
            value={selectedUsers.map((user) => ({
              value: user.id,
              label: `${user.nom} ${user.prenoms}`,
            }))}
            onChange={(selected) =>
              setSelectedUsers(
                selected.map((option) =>
                  selectedUsers.find((user) => user.id === option.value)
                )
              )
            }
            className="flex-grow-1 me-2"
            styles={{
              multiValue: (base) => ({
                ...base,
                backgroundColor: "#f3f6f9",
                borderRadius: "0.475rem",
                padding: "2px 6px",
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: "#7e8299",
                fontWeight: "bold",
              }),
              multiValueRemove: (base) => ({
                ...base,
                color: "#7e8299",
                ":hover": {
                  backgroundColor: "#e4e6ef",
                  color: "#3f4254",
                },
              }),
            }}
          />
          <Button
            variant="light-primary"
            className="btn-icon btn-sm"
            onClick={() => setShowUserModal(true)}
          >
            <KTIcon iconName="plus" className="fs-2" />
          </Button>
        </div>
      </Form.Group>

      {/* <div className="text-center mt-4">
        <Button variant="primary" type="submit">
          Créer la discussion
        </Button>
      </div> */}
      <div className="text-end mt-4">
        <Button
          variant="light"
          className="me-2"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Création..." : "Créer la discussion"}
        </Button>
      </div>

      <UserSelectionModal
        show={showUserModal}
        onHide={() => setShowUserModal(false)}
        onSelectUsers={handleSelectUsers}
        selectedUsers={selectedUsers}
        excludedRoleId={selectedRole?.id}
      />
    </Form>
  );
};

export default AddGroupeMessage;
