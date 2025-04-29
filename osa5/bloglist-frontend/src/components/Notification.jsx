const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  const infoMessage = message.startsWith('Error')
    ? 'notification error'
    : 'notification'

  return <div className={infoMessage}>{message}</div>
}

export default Notification
