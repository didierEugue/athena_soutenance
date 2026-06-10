import React, {useState, useEffect} from 'react'
import {KTIcon, KTSVG} from '../../../../../_metronic/helpers'
import {Modal} from 'react-bootstrap'
import {getTachesFacturables, createTacheFacturable, updateTacheFacturable, deleteTacheFacturable, TacheFacturable} from '../../../../../services/api'
import Swal from 'sweetalert2'

type Props = {
  className: string
}

const Taches: React.FC<Props> = ({className}) => {
  const [showModal, setShowModal] = useState(false)
  const [taches, setTaches] = useState<TacheFacturable[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [selectedTache, setSelectedTache] = useState<TacheFacturable | null>(null)
  const [formData, setFormData] = useState<TacheFacturable>({
    code: '',
    nom: '',
    cout_horaire: '',
    facturable: false,
    categorie: ''
  })

  const loadTaches = async () => {
    try {
      const data = await getTachesFacturables()
      setTaches(data)
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error)
    }
  }

  useEffect(() => {
    loadTaches()
  }, [])

  const handleClose = () => {
    setShowModal(false)
    setIsEditing(false)
    setSelectedTache(null)
    setFormData({
      code: '',
      nom: '',
      cout_horaire: '',
      facturable: false,
      categorie: ''
    })
  }

  const handleShow = () => setShowModal(true)

  const handleEdit = (tache: TacheFacturable) => {
    setIsEditing(true)
    setSelectedTache(tache)
    setFormData(tache)
    setShowModal(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value, type} = e.target
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement
      setFormData({...formData, [name]: checkbox.checked})
    } else {
      setFormData({...formData, [name]: value})
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing && selectedTache?.id) {
        await updateTacheFacturable(selectedTache.id, formData)
      } else {
        await createTacheFacturable(formData)
      }
      handleClose()
      loadTaches()
      Swal.fire({
        title: 'Succès!',
        text: isEditing ? 'Tâche mise à jour avec succès!' : 'Tâche créée avec succès!',
        icon: 'success',
        confirmButtonText: 'OK'
      })
    } catch (error) {
      console.error('Erreur:', error)
      Swal.fire({
        title: 'Erreur!',
        text: 'Une erreur est survenue',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await Swal.fire({
        title: 'Êtes-vous sûr?',
        text: 'Cette action est irréversible!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, supprimer!',
        cancelButtonText: 'Annuler'
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteTacheFacturable(id)
          loadTaches()
          Swal.fire('Supprimé!', 'La tâche a été supprimée.', 'success')
        }
      })
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      Swal.fire('Erreur!', 'Une erreur est survenue lors de la suppression.', 'error')
    }
  }

  return (
    <div className={`card ${className}`}>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Tâches facturables</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>Liste des tâches</span>
        </h3>
        <div className='card-toolbar'>
          <button type='button' className='btn btn-sm btn-light-primary' onClick={handleShow}>
            <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
            Ajouter
          </button>
        </div>
      </div>

      <div className='card-body py-3'>
        <div className='table-responsive'>
          <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
            <thead>
              <tr className='fw-bold text-muted'>
                <th className='min-w-40px'>Code</th>
                <th className='min-w-150px'>Définition</th>
                <th className='min-w-140px'>Coût horaire</th>
                <th className='min-w-75px'>Catégorie</th>
                <th className='min-w-75px'>Facturable</th>
                <th className='min-w-90px text-center'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {taches.map((tache) => (
                <tr key={tache.id}>
                  <td>
                    <span className='text-gray-900 fw-bold'>{tache.code}</span>
                  </td>
                  <td>
                    <span className='text-gray-900 fw-bold'>{tache.nom}</span>
                  </td>
                  <td className='text-gray-900 fw-bold'>{tache.cout_horaire}€</td>
                  <td>
                    <span className='badge badge-light-primary'>{tache.categorie}</span>
                  </td>
                  <td>
                    <span className={`badge badge-light-${tache.facturable ? 'success' : 'warning'}`}>
                      {tache.facturable ? 'Oui' : 'Non'}
                    </span>
                  </td>
                  <td className='text-end'>
                    <button
                      onClick={() => handleEdit(tache)}
                      className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                    >
                      <KTIcon iconName='pencil' className='fs-3' />
                    </button>
                    <button
                      onClick={() => tache.id && handleDelete(tache.id)}
                      className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm'
                    >
                      <KTIcon iconName='trash' className='fs-3' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{isEditing ? 'Modifier' : 'Ajouter'} une tâche facturable</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='mb-3'>
              <label className='form-label'>Code</label>
              <input
                type='text'
                className='form-control'
                name='code'
                value={formData.code}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Nom</label>
              <input
                type='text'
                className='form-control'
                name='nom'
                value={formData.nom}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Coût horaire</label>
              <input
                type='number'
                className='form-control'
                name='cout_horaire'
                value={formData.cout_horaire}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Catégorie</label>
              <select
                className='form-select'
                name='categorie'
                value={formData.categorie}
                onChange={handleInputChange}
                required
              >
                <option value=''>Choisissez une catégorie</option>
                <option value='Installation'>Installation</option>
                <option value='Production'>Production</option>
                <option value='Autres'>Autres</option>
              </select>
            </div>
            <div className='mb-1 form-check mt-6'>
              <input
                type='checkbox'
                className='form-check-input'
                id='facturable'
                name='facturable'
                checked={formData.facturable}
                onChange={handleInputChange}
              />
              <label className='form-check-label' htmlFor='facturable'>
                Facturable
              </label>
            </div>
          </Modal.Body>
          <Modal.Footer className='d-flex justify-content-center'>
            <button type='button' className='btn btn-secondary me-4' onClick={handleClose}>
              Fermer
            </button>
            <button type='submit' className='btn btn-primary'>
              {isEditing ? 'Modifier' : 'Enregistrer'}
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  )
}

export {Taches}
