import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setInfo(state, action) {
      return action.payload
    },
    hideInfo(state, action) {
      return ''
    },
  },
})

export const { setInfo, hideInfo } = notificationSlice.actions

export const setNotification = (message) => {
  return async (dispatch) => {
    dispatch(setInfo(message))

    setTimeout(() => {
      dispatch(hideInfo())
    }, 5000)
  }
}

export default notificationSlice.reducer
