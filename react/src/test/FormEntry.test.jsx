
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FormEntry from '../components/FormEntry'

describe('FormEntry API error handling', () => {
  it('shows an error and preserves form data when submission fails', async () => {
    const onAddApplication = vi.fn().mockResolvedValue(false)
    const onUpdateApplication = vi.fn()
    const onCancelEdit = vi.fn()
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})

    try {
      render(
        <FormEntry
          onAddApplication={onAddApplication}
          onUpdateApplication={onUpdateApplication}
          editingApplication={null}
          onCancelEdit={onCancelEdit}
        />
      )

      // Open the application form.
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

      // Submit the form and simulate an API failure.
      fireEvent.click(
        screen.getByRole('button', { name: /add entry/i })
      )

      // Wait for the asynchronous submission to finish.
      await vi.waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith(
          'Failed to save application. Please try again.'
        )
      })

      // Failed submission should preserve user input.
      expect(screen.getByLabelText('Company')).toHaveValue('Microsoft')
      expect(screen.getByLabelText('Position')).toHaveValue('Software Engineer')
      expect(onAddApplication).toHaveBeenCalledOnce()
      expect(onCancelEdit).not.toHaveBeenCalled()
    } finally {
      alertMock.mockRestore()
    }
  })
})
