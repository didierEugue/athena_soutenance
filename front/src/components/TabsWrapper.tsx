import React from 'react'

interface Tab {
  title: string
  tabKey: string
}

interface TabsWrapperProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabKey: string) => void
  children: React.ReactNode
}

export const TabsWrapper: React.FC<TabsWrapperProps> = ({ tabs, activeTab, onTabChange, children }) => {
  return (
    <div>
      <div className='nav-wrapper'>
        <ul className='nav nav-tabs nav-line-tabs mb-5 fs-6'>
          {tabs.map((tab) => (
            <li className='nav-item' key={tab.tabKey}>
                <a
                    className={`nav-link ${activeTab === tab.tabKey ? 'active' : ''} cursor-pointer`}
                    onClick={() => onTabChange(tab.tabKey)}
                    >
                    {tab.title}
                </a>
            </li>
          ))}
        </ul>
      </div>
      <div className='tab-content'>{children}</div>
    </div>
  )
}
