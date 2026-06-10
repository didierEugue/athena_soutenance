import {FC, lazy, Suspense} from 'react'
import {Navigate, Route, Routes, Outlet} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {MenuTestPage} from '../pages/MenuTestPage'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper'

const PrivateRoutes = () => {
  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'))
  const UsersPage = lazy(() => import('../modules/apps/user-management/UsersPage'))
  const UtilisateursPage = lazy(() => import('../pages/administrateur/utilisateur/UtilisateursPage'))
  const StatistiquesPage = lazy(() => import('../pages/administrateur/statistique/StatistiquesPage'))
  const ChiffragesPage = lazy(() => import('../pages/administrateur/chiffrage/ChiffragesPage'))
  const MessagesPage = lazy(() => import('../pages/messagerie/MessagesPage'))
  const AgendasPage = lazy(() => import('../pages/agenda/AgendasPage'))
  const CollaborateursPage = lazy(() => import('../pages/parametreIntranet/collaborateur/CollaborateursPage'))
  const AteliersPage = lazy(() => import('../pages/parametreIntranet/atelier/AteliersPage'))
  const OrdreFabricationsPage = lazy(() => import('../pages/ordreFabrication/OrdreFabricationsPage'))
  const RJAPage = lazy(() => import('../pages/rja/RJAPage'))

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        <Route path='dashboard' element={<DashboardWrapper />} />
        <Route
          path='builder'
          element={
            <SuspensedView>
              <BuilderPageWrapper />
            </SuspensedView>
          }
        />
        <Route path='menu-test' element={<MenuTestPage />} />
        {/* Lazy Modules */}
        <Route
          path='crafted/pages/profile/*'
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/pages/wizards/*'
          element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/widgets/*'
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/account/*'
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/chat/*'
          element={
            <SuspensedView>
              <ChatPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/user-management/*'
          element={
            <SuspensedView>
              <UsersPage />
            </SuspensedView>
          }
        />

        {/* Route Adminsistrateur */}
        <Route 
          path='app/pages/administrateur/*' 
          element={
          <SuspensedView>
            <Outlet />
          </SuspensedView>}>
          <Route path='utilisateurs' element={<UtilisateursPage />} />
          <Route path='statistiques' element={<StatistiquesPage />} />
          <Route path='chiffrages' element={<ChiffragesPage />} />
        </Route>

        {/* Route Paramètre Intranet */}
        <Route 
          path='/app/pages/parametreIntranet/*' 
          element={
          <SuspensedView>
            <Outlet />
          </SuspensedView>}>
          <Route path='collaborateurs' element={<CollaborateursPage />} />
          <Route path='ateliers' element={<AteliersPage />} />
        </Route>

        {/* Route Ordre de Fabrications */}  
        <Route
          path='/app/pages/ordreFabrication'
          element={
            <SuspensedView>
              <OrdreFabricationsPage />
            </SuspensedView>
          }
        />

        {/* Route Rapport Journalier d'Activité */}  
        <Route
          path='/app/pages/rja'
          element={
            <SuspensedView>
              <RJAPage />
            </SuspensedView>
          }
        />

        {/* Route Messagerie */}
        <Route
          path='app/pages/messageries/*'
          element={
            <SuspensedView>
              <MessagesPage />
            </SuspensedView>
          }
        />

        {/* Route Agenda */}  
        <Route
          path='app/pages/agenda'
          element={
            <SuspensedView>
              <AgendasPage />
            </SuspensedView>
          }
        />

        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}
