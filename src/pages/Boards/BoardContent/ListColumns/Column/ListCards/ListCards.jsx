
import Box from '@mui/material/Box'
import Card from './Card/Card'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { uniqBy } from 'lodash'

function ListCards({ cards, columnId }) {
  return (
    <>
      {(() => {
        const allCards = cards || []
        const uniqueCards = uniqBy(allCards, '_id')

        return (
          <SortableContext items={uniqueCards.map((c, i) => c._id ?? `${columnId || 'col'}-${i}`)} strategy={verticalListSortingStrategy}>
            <Box
              sx={{
                p: '0 5px 5px 5px',
                m: '0 5px',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)} - ${theme.trello.columnFooterHeight} - ${theme.trello.columnHeaderHeight})`,
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#ced0da',
                  borderRadius: '8px'
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: '#bfc2cf'
                }
              }}
            >
              {uniqueCards.map((card, i) => (<Card key={card._id ?? `${columnId || 'col'}-${i}`} card={card} />))}
            </Box>
          </SortableContext>
        )
      })()}
    </>
  )
}

export default ListCards
