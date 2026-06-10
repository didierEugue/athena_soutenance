import clsx from 'clsx'
import {FC} from 'react'
import {Row} from 'react-table'
import {User} from '../../core/_models'

type Props = {
  row: Row<User>
}

const CustomRow: FC<Props> = ({row}) => {
  const {key: rowKey, ...restRowProps} = row.getRowProps()
  return (
    <tr {...restRowProps} key={rowKey}>
      {row.cells.map((cell) => {
        const {key: cellKey, ...restCellProps} = cell.getCellProps()
        return (
          <td
            {...restCellProps}
            key={cellKey}
            className={clsx({'text-end min-w-100px': cell.column.id === 'actions'})}
          >
            {cell.render('Cell')}
          </td>
        )
      })}
    </tr>
  )
}


export {CustomRow}
