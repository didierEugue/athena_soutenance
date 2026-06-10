import React, { useState } from 'react'
import {KTIcon} from '../../../../../../../_metronic/helpers'
import {useListView} from '../../core/ListViewProvider'
import {UsersListFilter} from './UsersListFilter'
import DefaultAccess from './Default_Access'

const UsersListToolbar = () => {
  const {setItemIdForUpdate} = useListView()
  const [showDefaultAccess, setShowDefaultAccess] = useState(false)

  const openAddUserModal = () => {
    setItemIdForUpdate(null)
  }

  const openDefaultAccessModal = () => {
    setShowDefaultAccess(true)
  }
  return (
    <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
      <UsersListFilter />


      {/* begin::Export */}
      <button type='button' className='btn btn-light-primary me-3'>
        <KTIcon iconName='exit-up' className='fs-2' />
        Exporter
      </button>
      {/* end::Export */}

      {/* begin::Add user */}
      <button type='button' className='btn btn-primary' onClick={openAddUserModal}>
        <KTIcon iconName='plus' className='fs-2' />
        Ajouter
      </button>
      {/* end::Add user */}

      <DefaultAccess show={showDefaultAccess} onHide={() => setShowDefaultAccess(false)} />
    </div>
  )
}

export {UsersListToolbar}
