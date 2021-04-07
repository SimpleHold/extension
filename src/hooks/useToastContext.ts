import * as React from 'react'

import ToastContext from '@contexts/Toast'

export default () => {
  return React.useContext(ToastContext)
}
