'use client'

import { createContext, useContext, useRef, RefObject } from 'react'

interface ScrollContextType {
  // Removed "| null" from inside the generic brackets
  scrollContainerRef: RefObject<HTMLDivElement>
}

const ScrollContext = createContext<ScrollContextType>({
  // The default value remains a null current object
  scrollContainerRef: { current: null },
})

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  // useRef<HTMLDivElement>(null) correctly creates a RefObject<HTMLDivElement>
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  return (
    <ScrollContext.Provider value={{ scrollContainerRef }}>
      {children}
    </ScrollContext.Provider>
  )
}

export function useScrollContainer() {
  const context = useContext(ScrollContext)
  if (!context) {
    throw new Error('useScrollContainer must be used within a ScrollProvider')
  }
  return context
}