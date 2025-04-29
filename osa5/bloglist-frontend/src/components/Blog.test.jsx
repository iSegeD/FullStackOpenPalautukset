import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

let testBlog

describe('Blog.jsx testing', () => {
  beforeEach(() => {
    testBlog = {
      title: 'My First Frontend test',
      author: 'Sergey Dolzhenko',
      url: 'www.reactTest.com',
      likes: 19,
      user: {
        name: 'Test User',
      },
      id: '1994',
    }
  })

  test('Renders blog title by default, but not URL or likes', () => {
    render(<Blog blog={testBlog} />)

    const title = screen.getByText('My First Frontend test')
    expect(title).toBeDefined()

    const author = screen.queryByText('Sergey Dolzhenko')
    expect(author).toBeNull()

    const url = screen.queryByText('www.reactTest.com')
    expect(url).toBeNull()

    const likes = screen.queryByText(/likes/i)
    expect(likes).toBeNull()
  })

  test('Renders URL, likes and author after clicking View button', async () => {
    const mockLike = vi.fn()
    const mockDelete = vi.fn()

    render(
      <Blog
        blog={testBlog}
        likeBlog={mockLike}
        deleteBlog={mockDelete}
        user={{ name: 'Test User' }}
      />
    )

    const user = userEvent.setup()
    const viewButton = screen.getByText('View')
    await user.click(viewButton)

    const author = screen.queryByText('Sergey Dolzhenko')
    expect(author).toBeDefined()

    const url = screen.queryByText('www.reactTest.com')
    expect(url).toBeDefined()

    const likes = screen.queryByText(/likes/i)
    expect(likes).toBeDefined()
  })

  test('Like button works twice when pressed twice', async () => {
    const mockLike = vi.fn()
    const mockDelete = vi.fn()

    render(
      <Blog
        blog={testBlog}
        likeBlog={mockLike}
        deleteBlog={mockDelete}
        user={{ name: 'Test User' }}
      />
    )

    const user = userEvent.setup()
    const viewButton = screen.getByText('View')
    await user.click(viewButton)

    const likeButton = screen.getByText('Like')

    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockLike.mock.calls).toHaveLength(2)
  })
})
