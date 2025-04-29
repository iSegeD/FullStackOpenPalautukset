import { useState } from 'react'

const Blog = ({ blog, likeBlog, user, deleteBlog }) => {
  const [toggle, setToggle] = useState(false)

  const switcher = () => {
    setToggle(!toggle)
  }

  return (
    <div className="blog">
      {blog.title}

      <button onClick={switcher} className="blogBtn">
        {toggle ? 'Hide' : 'View'}
      </button>

      {toggle && (
        <div className="blog__info">
          {blog.url}

          <div>
            Likes: {blog.likes}{' '}
            <button onClick={() => likeBlog(blog.id)}>Like</button>
          </div>
          {blog.author}

          <div>
            {blog.user.name === user.name ? (
              <button className="btn" onClick={() => deleteBlog(blog.id)}>
                Remove
              </button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}

export default Blog
