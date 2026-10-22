
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import Dashboard from '../pages/Dashboard.jsx'

// Mock unrelated components.
vi.mock('../components/Header.jsx', () => ({
  default: () => null,
}))

vi.mock('../components/Sidebar.jsx', () => ({
  default: () => null,
}))

vi.mock('../components/CalendarWidget.jsx', () => ({
  default: () => null,
}))

describe('Dashboard API error handling', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('keeps the application list unchanged when POST fails', async () => {
    const existingApplication = {
      job_id: 1,
      user: 1,
      company: 'Google',
      position: 'Software Engineer',
      status: 'Applied',
      date_applied: '2026-10-20',
      notes: '',
    }

    // Simulate a successful GET followed by a failed POST.
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [existingApplication],
      })
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))

    vi.stubGlobal('fetch', fetchMock)

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})
    const consoleMock = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<Dashboard />)

    // Wait until the existing application is displayed.
    const table = await screen.findByRole('table')
    expect(within(table).getByText('Google')).toBeInTheDocument()

    // Open the form.
    fireEvent.click(
      screen.getByRole('button', {
        name: /create a new application entry/i,
      })
    )

    // Fill in the required fields.
    fireEvent.change(screen.getByLabelText('Company'), {
      target: { value: 'Microsoft' },
    })
    fireEvent.change(screen.getByLabelText('Position'), {
      target: { value: 'Software Engineer' },
    })
    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'Applied' },
    })
    fireEvent.change(screen.getByLabelText('Date Applied'), {
      target: { value: '2026-10-22' },
    })

    // Submit the form.
    fireEvent.click(
      screen.getByRole('button', { name: /add entry/i })
    )

    // The failed POST should trigger an error message.
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(
        'Failed to save application. Please try again.'
      )
    })

    // Verify that the request was attempted.
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock.mock.calls[1][0]).toBe('/api/job-applications/')
    expect(fetchMock.mock.calls[1][1].method).toBe('POST')

    // The existing application remains in the table.
    expect(within(table).getByText('Google')).toBeInTheDocument()

    // The failed application must not appear in the table.
    expect(within(table).queryByText('Microsoft')).not.toBeInTheDocument()

    // The form retains the failed submission's data.
    expect(screen.getByLabelText('Company')).toHaveValue('Microsoft')

    consoleMock.mockRestore()
  })
})
