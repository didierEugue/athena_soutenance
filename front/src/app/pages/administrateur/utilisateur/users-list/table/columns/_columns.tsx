import {Column} from 'react-table'
import {UserInfoCell} from './UserInfoCell'
import {UserRoleCell} from './UserRoleCell'
import {UserStatusCell} from './UserStatusCell'
import {UserActionsCell} from './UserActionsCell'
import {UserSelectionCell} from './UserSelectionCell'
import {UserCustomHeader} from './UserCustomHeader'
import {UserSelectionHeader} from './UserSelectionHeader'
import {User} from '../../core/_models'

const usersColumns: ReadonlyArray<Column<User>> = [
  {
    Header: (props) => <UserSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({...props}) => <UserSelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Nom' className='min-w-125px' />,
    id: 'name',
    Cell: ({...props}) => <UserInfoCell user={props.data[props.row.index]} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Rôle' className='min-w-125px' />,
    id: 'role',
    Cell: ({...props}) => <UserRoleCell role={props.data[props.row.index].role as any} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Téléphone' className='min-w-125px' />
    ),
    accessor: 'telephone',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Adresse' className='min-w-125px' />
    ),
    accessor: 'adresse',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Statut' className='text-center min-w-75px' />
    ),
    id: 'actif',
    Cell: ({...props}) => <UserStatusCell actif={props.data[props.row.index].actif ?? false} />,
  },
  // {
  //   Header: (props) => (
  //     <UserCustomHeader tableProps={props} title='Actions' className='text-center min-w-100px' />
  //   ),
  //   id: 'actions',
  //   Cell: ({...props}) => <UserActionsCell id={props.data[props.row.index].id} />,
  // },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Actions' className='text-center min-w-310px' />
    ),
    id: 'actions',
    Cell: ({...props}) => <UserActionsCell id={props.data[props.row.index].id} />,
  }
  
]

export {usersColumns}
