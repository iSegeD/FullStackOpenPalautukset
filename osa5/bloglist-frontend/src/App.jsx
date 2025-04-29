import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import CreateForm from './components/CreateForm'
import Notification from './components/Notification'
import ModelWindow from './components/ModelWindow'
import loginService from './services/login'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)))
  }, [])

  useEffect(() => {
    const storageUser = window.localStorage.getItem('BlogAppLoggedUser')

    if (storageUser) {
      const currentUser = JSON.parse(storageUser)
      setUser(currentUser)
      blogService.getToken(currentUser.token)
    }
  }, [])

  const blogRef = useRef()

  const infoHelper = (message, time = 5000) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, time)
  }

  const handleLogIn = async (e) => {
    e.preventDefault()

    try {
      const currentUser = await loginService.logIn({
        username,
        password,
      })

      window.localStorage.setItem(
        'BlogAppLoggedUser',
        JSON.stringify(currentUser)
      )

      blogService.getToken(currentUser.token)
      setUser(currentUser)
      setUsername('')
      setPassword('')
    } catch (error) {
      infoHelper(`Error: ${error.response.data.error}`)
    }
  }

  const handleCreateNewBlog = async (newBlog) => {
    try {
      const createdBlog = await blogService.create(newBlog)

      createdBlog.user = user
      setBlogs((prev) => [...prev, createdBlog])
      infoHelper(
        `A new blog ${createdBlog.title} by ${createdBlog.author} added`
      )
      blogRef.current.switcher()
    } catch (error) {
      infoHelper(`Error: ${error.response.data.error}`)
    }
  }

  const handleLikeUpdate = async (id) => {
    const blogToFind = blogs.find((blog) => blog.id === id)

    if (!blogToFind) {
      return
    }

    const updatedBlog = {
      ...blogToFind,
      likes: blogToFind.likes + 1,
    }

    try {
      const result = await blogService.update(id, updatedBlog)
      setBlogs(
        blogs
          .map((blog) => (blog.id !== id ? blog : result))
          .sort((a, b) => b.likes - a.likes)
      )
    } catch (error) {
      infoHelper(`Error: ${error.response.data.error}`)
    }
  }

  const handleDeleteBlog = async (id) => {
    const blogToFind = blogs.find((blog) => blog.id === id)

    try {
      if (
        window.confirm(
          `Remove blog ${blogToFind.title} by ${blogToFind.author}?`
        )
      ) {
        await blogService.remove(id)
        setBlogs((prev) => prev.filter((blog) => blog.id !== id))
        infoHelper(`Blog: ${blogToFind.title} has been removed`)
      }
    } catch (error) {
      infoHelper(`Error: ${error.response.data.error}`)
    }
  }

  const logOutClick = () => {
    window.localStorage.removeItem('BlogAppLoggedUser')
    setUser(null)
  }

  return (
    <div>
      <Notification message={notification} />
      {!user && (
        <LoginForm
          onSubmit={handleLogIn}
          inputs={{ username, password }}
          handlers={{ setUsername, setPassword }}
        />
      )}

      {user && (
        <div>
          <h2>Blogs</h2>
          <p>
            {user.name} logged in{' '}
            <button onClick={logOutClick}>Sign out</button>
          </p>
          <ModelWindow label="Create new blog" ref={blogRef}>
            <CreateForm createBlog={handleCreateNewBlog} />
          </ModelWindow>
        </div>
      )}
      <br />
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={handleLikeUpdate}
          deleteBlog={handleDeleteBlog}
          user={user}
        />
      ))}
    </div>
  )
}

export default App
