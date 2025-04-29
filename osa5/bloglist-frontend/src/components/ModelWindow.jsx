import { useState, forwardRef, useImperativeHandle } from 'react'

const ModelWindow = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideElement = { display: visible ? 'none' : '' }
  const showElemnt = { display: visible ? '' : 'none' }

  const switcher = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      switcher,
    }
  })

  return (
    <div>
      <div style={hideElement}>
        <button onClick={switcher}>{props.label}</button>
      </div>
      <div style={showElemnt}>
        {props.children}
        <button className="btn" onClick={switcher}>
          Cancel
        </button>
      </div>
    </div>
  )
})

ModelWindow.displayName = 'ModelWindow'

export default ModelWindow
