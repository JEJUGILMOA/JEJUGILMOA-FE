import { describe, expect, it } from 'vitest'
import { waitFor, screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import { usePlacesQuery } from '@/features/places/hooks'

function PlacesList() {
  const { data, isLoading, isError } = usePlacesQuery()

  if (isLoading) return <p>loading</p>
  if (isError) return <p>error</p>

  return (
    <ul>
      {data?.map((place) => (
        <li key={place.id}>{place.name}</li>
      ))}
    </ul>
  )
}

describe('places feature with MSW', () => {
  it('fetches and renders places', async () => {
    renderWithProviders(<PlacesList />)

    expect(screen.getByText('loading')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('성산일출봉')).toBeInTheDocument()
    })
    expect(screen.getByText('협재 해수욕장')).toBeInTheDocument()
  })
})
