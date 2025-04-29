import { useState } from 'react'

const CreateForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addNewBlog = (e) => {
    e.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url,
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addNewBlog}>
      <h2>Create new Blog</h2>
      <div>
        Title:
        <input
          data-testid="title"
          type="text"
          value={title}
          name="title"
          onChange={({ target }) => setTitle(target.value)}
          id="title-input"
        />
      </div>
      <div>
        Author:
        <input
          data-testid="author"
          type="text"
          value={author}
          name="author"
          onChange={({ target }) => setAuthor(target.value)}
          id="author-input"
        />
      </div>
      <div>
        Url:
        <input
          data-testid="url"
          type="text"
          value={url}
          name="url"
          onChange={({ target }) => setUrl(target.value)}
          id="url-input"
        />
      </div>
      <button className="btn" type="submit">
        Create
      </button>
    </form>
  )
}

export default CreateForm
