import PropTypes from 'prop-types'

const LoginForm = ({ inputs, handlers, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <h2>Log in to application</h2>
      <div>
        Username:
        <input
          data-testid="username"
          type="text"
          value={inputs.username}
          name="username"
          onChange={({ target }) => handlers.setUsername(target.value)}
        />
      </div>
      <div>
        Password:
        <input
          data-testid="password"
          type="password"
          value={inputs.password}
          name="password"
          onChange={({ target }) => handlers.setPassword(target.value)}
        />
      </div>
      <button className="btn" type="submit">
        Sign in
      </button>
    </form>
  )
}

LoginForm.propTypes = {
  inputs: PropTypes.shape({
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  }).isRequired,
  handlers: PropTypes.shape({
    setUsername: PropTypes.func.isRequired,
    setPassword: PropTypes.func.isRequired,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default LoginForm
