import React, { useState, useEffect }  from 'react'
import {KTIcon} from '../../../../../_metronic/helpers'
import FournisseurForm from './FournisseurForm'
import { Modal } from 'react-bootstrap'
import { Fournisseur, getFournisseurs, deleteFournisseur } from '../../../../../services/api'

type Props = {
  className: string
}

const FournisseursPage: React.FC<Props> = ({className}) => {
  const [showModal, setShowModal] = useState(false)
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([])
  const [selectedFournisseur, setSelectedFournisseur] = useState<Fournisseur | undefined>(undefined)

  useEffect(() => {
    fetchFournisseurs()
  }, [])

  const fetchFournisseurs = async () => {
    const data = await getFournisseurs()
    setFournisseurs(data)
  }

  const handleDelete = async (id: number) => {
    await deleteFournisseur(id)
    fetchFournisseurs()
  }

  const handleEdit = (fournisseur: Fournisseur) => {
    setSelectedFournisseur(fournisseur)
    setShowModal(true)
  }

  const handleSubmit = () => {
    setShowModal(false)
    setSelectedFournisseur(undefined)
    fetchFournisseurs()
  }

  return (
    <div className={`card ${className}`}>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Liste des Fournisseurs</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>Total de : {fournisseurs.length} Fournisseurs</span>
        </h3>

        <div className='card-toolbar'>
          <a href='#' className='btn btn-sm btn-light-primary' onClick={() => setShowModal(true)}>
            <KTIcon iconName='plus' className='fs-2' />
            Ajouter un Fournisseur
          </a>
        </div>
      </div>
      <div className='card-body py-3'>
        <div className='table-responsive'>
          <table className='table align-middle gs-0 gy-4'>
            <thead>
              <tr className='fw-bold text-muted bg-light'>
                <th className='ps-4 min-w-325px rounded-start'>Nom</th>
                <th className='min-w-125px'>Téléphone</th>
                <th className='min-w-125px'>Email</th>
                <th className='min-w-200px'>Adresse</th>
                <th className='min-w-200px text-center rounded-end'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fournisseurs.map((fournisseur) => (
                <tr key={fournisseur.id}>
                  <td>
                    <div className='d-flex align-items-center'>
                    <div className='symbol symbol-50px me-5'>
                    </div>
                      <div className='d-flex justify-content-start flex-column'>
                        <a href='#' className='text-gray-900 fw-bold text-hover-primary mb-1 fs-6'>
                          {fournisseur.nom}
                        </a>
                      </div>
                    </div>
                  </td>
                  <td>
                    <a href='#' className='text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6'>
                      {fournisseur.telephone}
                    </a>
                  </td>
                  <td>
                    <a href='#' className='text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6'>
                      {fournisseur.email}
                    </a>
                  </td>
                  <td>
                    <a href='#' className='text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6'>
                      {fournisseur.adresse}
                    </a>
                  </td>
                  <td className='text-center'>
                    <a
                      href='#'
                      className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                      onClick={() => handleEdit(fournisseur)}
                    >
                      <KTIcon iconName='pencil' className='fs-3' />
                    </a>
                    <a href='#' className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm'
                       onClick={() => handleDelete(fournisseur.id!)}>
                      <KTIcon iconName='trash' className='fs-3' />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedFournisseur ? 'Modifier le fournisseur' : 'Ajouter un nouveau fournisseur'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FournisseurForm fournisseur={selectedFournisseur} onSubmit={handleSubmit} />
        </Modal.Body>
      </Modal>
    </div>
  )
}

export {FournisseursPage}
