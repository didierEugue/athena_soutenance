import React, {FC, useState} from 'react'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {FormTable} from './form/FormTable'
import {Affaire} from './form/Affaire'
// import {TabsWrapper} from '../../../../_metronic/helpers'
import { TabsWrapper } from '../../../../components/TabsWrapper'



const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'Gestion des Chiffrages',
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

const ChiffragesPage: FC = () => {
  const [activeTab, setActiveTab] = useState('Chiffrages')

  return (
    <>
      <PageTitle breadcrumbs={usersBreadcrumbs}>Chiffrage estimatif des commandes</PageTitle>

      <TabsWrapper
        // className='mt-5 mb-5'
        tabs={[
          {
            title: 'Chiffrages',
            tabKey: 'Chiffrages',
          },
          {
            title: 'Affaires',
            tabKey: 'Affaires',
          },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {activeTab === 'Chiffrages' && <FormTable />}
        {activeTab === 'Affaires' && <Affaire />}
      </TabsWrapper>
    </>
  )
}

export {ChiffragesPage}
export default ChiffragesPage
