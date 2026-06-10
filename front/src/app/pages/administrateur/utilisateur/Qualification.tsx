import React, { useState, useEffect } from 'react'
import { KTIcon, KTSVG } from '../../../../_metronic/helpers'
import { Modal } from 'react-bootstrap'
import { getRoles, createRole, updateRole, deleteRole, Role } from '../../../../services/api'

type Props = {
  className: string
}

const Qualifications: React.FC<Props> = ({ className }) => {
  const [showModal, setShowModal] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])
  const [currentRole, setCurrentRole] = useState<Role>({ code: '', nom: '', coefficient_qualification: '' })
  const [isEditing, setIsEditing] = useState(false)

  console.log(roles);

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      const rolesData = await getRoles()
      setRoles(rolesData)
    } catch (error) {
      console.error("Erreur lors de la récupération des rôles:", error)
    }
  }

  const handleClose = () => {
    setShowModal(false)
    setCurrentRole({ code: '', nom: '', coefficient_qualification: '' })
    setIsEditing(false)
  }

  const handleShow = () => setShowModal(true)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCurrentRole({ ...currentRole, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing) {
        await updateRole(currentRole.id!, currentRole)
      } else {
        await createRole(currentRole)
      }
      fetchRoles()
      handleClose()
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du rôle:", error)
    }
  }

  const handleEdit = (role: Role) => {
    setCurrentRole(role)
    setIsEditing(true)
    handleShow()
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce rôle ?")) {
      try {
        await deleteRole(id)
        fetchRoles()
      } catch (error) {
        console.error("Erreur lors de la suppression du rôle:", error)
      }
    }
  }

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Rôles</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>Liste des Qualifications</span>
        </h3>
        <div className='card-toolbar'>
          <button
            type='button'
            className='btn btn-sm btn-light-primary'
            onClick={handleShow}
          >
            <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
            Ajouter
          </button>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bold text-muted'>
                <th className='min-w-40px'>Code</th>
                <th className='min-w-150px'>Nom</th>
                <th className='min-w-80px text-center'>Coefficient</th>
                <th className='min-w-90px text-center'>Actions</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {roles.map((role) => (
                <tr key={role.id}>
                  <td>
                    <a href='#' className='text-gray-900 fw-bold text-hover-primary fs-6'>
                      {role.code}
                    </a>
                  </td>
                  <td>
                    <a href='#' className='text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6'>
                      {role.nom}
                    </a>
                  </td>
                  {/* <td>
                    <span className='badge badge-light-success'>{role.coefficient_qualification}</span>
                  </td> */}
                  <td className='text-center'>
                    <span className={`badge ${
                      parseFloat(role.coefficient_qualification) < 1
                        ? 'badge-light-danger'
                        : parseFloat(role.coefficient_qualification) === 1
                        ? 'badge-light-warning'
                        : 'badge-light-success'
                    }`}>
                      {role.coefficient_qualification}
                    </span>
                  </td>
                  <td className='text-center'>
                    <a
                      href='#'
                      className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                      onClick={() => handleEdit(role)}
                    >
                      <KTIcon iconName='pencil' className='fs-3' />
                    </a>
                    <a href='#' className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm' onClick={() => handleDelete(role.id!)}>
                      <KTIcon iconName='trash' className='fs-3' />
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
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Modifier un Rôle' : 'Ajouter un Rôle'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className='mb-3'>
              <label className='form-label'>Code</label>
              <input type='text' className='form-control' name='code' value={currentRole.code} onChange={handleInputChange} />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Nom</label>
              <input type='text' className='form-control' name='nom' value={currentRole.nom} onChange={handleInputChange} />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Coefficient horaire</label>
              <input type='number' step='0.01' className='form-control' name='coefficient_qualification' value={currentRole.coefficient_qualification} onChange={handleInputChange} />
            </div>
            <div className='d-flex justify-content-center'>
              <button type='button' className='btn btn-secondary me-4' onClick={handleClose}>
                Fermer
              </button>
              <button type='submit' className='btn btn-primary'>
                Enregistrer
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export { Qualifications }
