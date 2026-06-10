import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { ListAllUser } from '../messagerie/components/ListAllUser';

interface DestinatairesSelectorProps {
  selectedRecipients: string[];
  onSelect: (recipients: string[]) => void;
}

export const DestinatairesSelector: React.FC<DestinatairesSelectorProps> = ({ selectedRecipients, onSelect }) => {
  const [showUserModal, setShowUserModal] = useState(false);

  const handleUserSelect = (users: any[]) => {
    const newRecipients = users.map(user => user.name);
    onSelect([...selectedRecipients, ...newRecipients]);
    setShowUserModal(false);
  };

  return (
    <div>
      <div className="d-flex align-items-center">
        <Form.Control 
          as="select" 
          multiple 
          value={selectedRecipients}
                  onChange={(e) => {
                    const select = e.target as unknown as HTMLSelectElement
                    onSelect(Array.from(select.selectedOptions, option => option.value))
                  }}        >
          {selectedRecipients.map((recipient, index) => (
            <option key={index} value={recipient}>{recipient}</option>
          ))}
        </Form.Control>
        <Button variant="outline-secondary" onClick={() => setShowUserModal(true)}>+</Button>
      </div>

      <ListAllUser 
        show={showUserModal} 
        onHide={() => setShowUserModal(false)}
        onUserSelect={handleUserSelect}
      />
    </div>
  );
};