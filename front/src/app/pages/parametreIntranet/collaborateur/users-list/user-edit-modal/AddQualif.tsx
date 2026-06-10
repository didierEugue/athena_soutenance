import React, {useState, useEffect} from 'react'
import {Modal, Button, Form} from 'react-bootstrap'

interface AddRoleProps {
  show: boolean
  handleClose: () => void
}

export const AddRole: React.FC<AddRoleProps> = ({show, handleClose}) => {
  const [code, setCode] = useState('')
  const [nom, setNom] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Nouveau rôle:', {code, nom})
    handleClose()
  }

  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      .modal-backdrop-dark {
        background-color: rgba(0, 0, 0, 0.7) !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      centered
      dialogClassName="modal-90w"
      backdropClassName="modal-backdrop-dark"
    >
      <Modal.Header closeButton>
        <Modal.Title>Ajouter un nouveau Qualification</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className='mb-3'>
            <Form.Label>Nom</Form.Label>
            <Form.Control
              type='text'
              placeholder='Entrez le code du rôle'
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Coefficient</Form.Label>
            <Form.Control
              type='text'
              placeholder='Entrez le nom du rôle'
              value={nom}
              onChange={(e) => setNom(e.target.value)}
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
