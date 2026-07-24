import { useState } from 'react'
import './App.css'
import type { PuzzleData, Page, Difficulty} from './types'
import { Board } from './board'
import { LandingPage } from './landing'
import puzzleData from './data/puzzles.json'


function App() {
  const data: PuzzleData = puzzleData
  const datestring = data.day + ' ' + data.displayDate

  const [currentPage, setCurrentPage] = useState<Page>(() => {
        const saved = localStorage.getItem(`colorku-page}`)
        if (saved === null) return 'landing'

        const parsed = JSON.parse(saved)
        if (parsed.date !== data.date) return 'landing'

        const page = parsed.page as Page
        if (page === 'landing') return 'landing'

        const progress = localStorage.getItem(`colorku-progress-${page}`)
        if (progress === null) return page

        const parsedProgress = JSON.parse(progress)
        if (parsedProgress === null) return page

        return page
    })

  function goToPage(page: Page) {
    setCurrentPage(page)
    localStorage.setItem('colorku-page', JSON.stringify({ date: data.date, page }))
  }

  if (currentPage === 'landing'){
    return (
      <LandingPage dateString={datestring} onSelectPage={goToPage}/>
    )
  }
  
  return (
  <Board puzzle={data[currentPage]} date={data.date} difficulty={currentPage as Difficulty} onBack={() => goToPage('landing')}  />
  )
}

export default App
