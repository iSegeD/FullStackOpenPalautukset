import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateForm from './CreateForm'

describe('CreateForm.jsx testing', () => {
  test('Form calls createdBlog witch correct information when submitted', async () => {
    const mockCreateBlog = vi.fn()

    const { container } = render(<CreateForm createBlog={mockCreateBlog} />)

    const user = userEvent.setup()

    const title = container.querySelector('#title-input')
    const author = container.querySelector('#author-input')
    const url = container.querySelector('#url-input')
    const submitButton = screen.getByText('Create')

    await user.type(title, 'My Second Test')
    await user.type(author, 'Sergey Dolzhenko')
    await user.type(url, 'www.test.com')

    await user.click(submitButton)

    expect(mockCreateBlog.mock.calls).toHaveLength(1)
    const data = mockCreateBlog.mock.calls[0][0]
    expect(data.title).toBe('My Second Test')
    expect(data.author).toBe('Sergey Dolzhenko')
    expect(data.url).toBe('www.test.com')
  })
})
