// import React, { useState } from 'react'
// import { PageTitle } from '../../../_metronic/layout/core'
// import { TabsWrapper } from '../../../components/TabsWrapper'
// import { RJAListPage } from './RJAListPage'
// import { RJAValidate } from './RJAValidate'

// const usersBreadcrumbs = [
//   {
//     title: 'Rapport Journalier d\'Activité',
//     path: '/app/pages/rja',
//     isSeparator: false,
//     isActive: false,
//   },
//   {
//     title: '',
//     path: '',
//     isSeparator: true,
//     isActive: false,
//   },
// ]

// const tabs = [
//   { title: 'Liste des rapports', tabKey: 'list' },
//   { title: 'Validation', tabKey: 'validate' },
// ]

// export function RJAPage() {
//   const [activeTab, setActiveTab] = useState('list')

//   return (
//     <>
//       <PageTitle breadcrumbs={usersBreadcrumbs}>RJA</PageTitle>

//       <TabsWrapper
//         tabs={tabs}
//         activeTab={activeTab}
//         onTabChange={setActiveTab}
//       >
//         {activeTab === 'list' && <RJAListPage />}
//         {activeTab === 'validate' && <RJAValidate />}
//       </TabsWrapper>
//     </>
//   )
// }

// export default RJAPage
import React, { useState } from "react";
import { PageTitle } from "../../../_metronic/layout/core";
import { TabsWrapper } from "../../../components/TabsWrapper";
import { RJAListPage } from "./RJAListPage";
import { RJAValidate } from "./RJAValidate";
import { useAuth } from "../../modules/auth";

const usersBreadcrumbs = [
  {
    title: "Rapport Journalier d'Activité",
    path: "/app/pages/rja",
    isSeparator: false,
    isActive: false,
  },
  {
    title: "",
    path: "",
    isSeparator: true,
    isActive: false,
  },
];

export function RJAPage() {
  const [activeTab, setActiveTab] = useState("list");
  const { currentUser } = useAuth();

  const hasValidationAccess = () => {
    return currentUser?.role?.code === "RP";
  };

  const tabs = [
    { title: "Liste des rapports", tabKey: "list" },
    ...(hasValidationAccess()
      ? [{ title: "Validation", tabKey: "validate" }]
      : []),
  ];

  const handleTabChange = (tab: string) => {
    if (tab === "validate" && !hasValidationAccess()) {
      return;
    }
    setActiveTab(tab);
  };

  return (
    <>
      <PageTitle breadcrumbs={usersBreadcrumbs}>RJA</PageTitle>

      <TabsWrapper
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      >
        {activeTab === "list" && <RJAListPage />}
        {activeTab === "validate" && hasValidationAccess() && <RJAValidate />}
      </TabsWrapper>
    </>
  );
}

export default RJAPage;
