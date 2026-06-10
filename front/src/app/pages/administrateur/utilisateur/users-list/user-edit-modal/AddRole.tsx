import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { createRole } from '../../../../../../services/api'

interface AddRoleProps {
  show: boolean
  handleClose: () => void
  onRoleAdded: () => void
}

export const AddRole: React.FC<AddRoleProps> = ({ show, handleClose, onRoleAdded }) => {
  const [code, setCode] = useState('')
  const [nom, setNom] = useState('')
  const [coefficientQualification, setCoefficientQualification] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createRole({
        code,
        nom,
        coefficient_qualification: coefficientQualification
      })
      handleClose()
      onRoleAdded()
    } catch (error) {
      console.error("Erreur lors de l'ajout du rôle:", error)
    }
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter un nouveau rôle</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className='mb-3'>
            <Form.Label>Code</Form.Label>
            <Form.Control
              type='text'
              placeholder='Entrez le code du rôle'
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Nom</Form.Label>
            <Form.Control
              type='text'
              placeholder='Entrez le nom du rôle'
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Coefficient de qualification</Form.Label>
            <Form.Control
              type='number'
              step='0.01'
              placeholder='Entrez le coefficient de qualification'
              value={coefficientQualification}
              onChange={(e) => setCoefficientQualification(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant='primary' type='submit'>
            Ajouter
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
