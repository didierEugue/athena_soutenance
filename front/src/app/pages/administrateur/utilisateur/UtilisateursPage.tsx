import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'Gestion des Utilisateurs',
    path: '/app/pages/administrateur/utilisateurs',
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

const UtilisateursPage = () => {
  return (
    <>
      <PageTitle breadcrumbs={usersBreadcrumbs}>Liste des Utilisateurs</PageTitle>
      <UsersListWrapper />
    </>
  )
}

export default UtilisateursPage
