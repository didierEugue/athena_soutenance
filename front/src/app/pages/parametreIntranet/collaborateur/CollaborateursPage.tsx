import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'Gestion des Collaborateurs',
    path: '/app/pages/parametreIntranet/collaborateurs',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const CollaborateursPage = () => {
  return (
    <>
      <PageTitle breadcrumbs={usersBreadcrumbs}>Liste des Collaborateurs</PageTitle>
      <UsersListWrapper />
    </>
  )
}

export default CollaborateursPage
