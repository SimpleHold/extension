import * as React from 'react'

import TextInput from '@components/TextInput'

const Test: React.FC = () => {
  const [value, setValue] = React.useState<string>('')

  return (
    <div style={{ height: 600, backgroundColor: '#F8F8F8', padding: 30 }}>
      <p>Test</p>
      <TextInput
        label="Enter password"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setValue(e.target.value)}
      />
    </div>
  )
}

export default Test
