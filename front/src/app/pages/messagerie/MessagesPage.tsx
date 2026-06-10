import {Navigate, Route, Routes, Outlet} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {Private} from './components/Private'
import {Group} from './components/Group'
import {Drawer} from './components/Drawer'

const chatBreadCrumbs: Array<PageLink> = [
  {
    title: 'Messagerie Interne',
    path: '/app/pages/messageries',
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

const MessagesPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='message-privee'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Message Privé</PageTitle>
              <Private />
            </>
          }
        />
        <Route
          path='message-groupee'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Message groupé</PageTitle>
              <Group />
            </>
          }
        />
        {/* <Route
          path='contact'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Liste des contacts</PageTitle>
              <Drawer />
            </>
          }
        /> */}
        <Route index element={<Navigate to='/app/pages/messageries' />} />
      </Route>
    </Routes>
  )
}

export default MessagesPage
