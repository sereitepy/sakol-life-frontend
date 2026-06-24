'use client'

import { SearchParams } from './types'
import { useQuizResults } from './use-quiz-results'
import { useFilters } from './use-filters'
import MajorsTab from './majors-tab'
import UniversitiesTab from './universities-tab'
import { useTranslations } from 'next-intl'

type Props = { searchParams: SearchParams }

export default function ResultsClient({ searchParams }: Props) {
  const tCard = useTranslations('major_card')
  
  const {
    result,
    identity,
    chosenMajorId,
    handleMajorChosen,
    handleMajorDeselected,
  } = useQuizResults()

  const {
    searchQuery,
    selCategories,
    selOutlooks,
    minScore,
    activeTab,
    inputValue,
    setInputValue,
    updateUrl,
    toggleFilter,
    clearAll,
    activeFilterCount,
    hasActiveFilters,
  } = useFilters(searchParams)

  const hasChosen = !!chosenMajorId

  if (!result) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='flex flex-col items-center gap-3'>
          <div className='w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin' />
          <p className='text-sm text-muted-foreground'>Loading your results…</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='border-b border-border bg-card sticky top-0 z-10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 flex gap-6'>
          {(['majors', 'universities'] as const).map(tab => {
            const isActive = activeTab === tab
            const isDisabled = tab === 'universities' && !hasChosen
            
            // Dynamically assign translated tab labels
            const tabLabel = tab === 'majors' 
              ? tCard('tab_majors') 
              : tCard('tab_universities')

            return (
              <button
                key={tab}
                disabled={isDisabled}
                onClick={() =>
                  !isDisabled &&
                  updateUrl({ tab: tab === 'majors' ? null : tab })
                }
                className={`
                  py-3.5 text-sm font-semibold border-b-2 transition-colors -mb-px cursor-pointer
                  ${
                    isActive
                      ? 'border-primary text-foreground'
                      : isDisabled
                        ? 'border-transparent text-muted-foreground/40 cursor-not-allowed'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                {tabLabel}
                {tab === 'universities' && !hasChosen && (
                  <span className='ml-1.5 text-[10px] font-normal text-muted-foreground/50 normal-case'>
                    {tCard('choose_major_first')}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-6'>
        {activeTab === 'majors' && (
          <MajorsTab
            results={result.results}
            identity={identity}
            chosenMajorId={chosenMajorId}
            searchQuery={searchQuery}
            selCategories={selCategories}
            selOutlooks={selOutlooks}
            minScore={minScore}
            inputValue={inputValue}
            activeFilterCount={activeFilterCount}
            hasActiveFilters={hasActiveFilters}
            onSetInputValue={setInputValue}
            onToggleFilter={toggleFilter}
            onUpdateUrl={updateUrl}
            onClearAll={clearAll}
            onMajorChosen={handleMajorChosen}
            onMajorDeselected={handleMajorDeselected}
          />
        )}
        {activeTab === 'universities' && hasChosen && (
          <UniversitiesTab onBack={() => updateUrl({ tab: null })} />
        )}
      </div>
    </div>
  )
}