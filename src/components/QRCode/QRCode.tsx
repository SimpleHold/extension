import * as React from 'react'
import { QRCode as QRCoder } from 'react-qrcode-logo'

interface Props {
  size: number
  value: string
}

const QRCode: React.FC<Props> = (props) => {
  const { size, value } = props

  return (
    <QRCoder
      size={size}
      logoImage="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAoCAYAAACxbNkLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJfSURBVHgB7ZnBSwJBFMZfJWQoGBRtFCgYFHTQU0VBnbJbUNExD92Krt2je39AXbVbh4JuejMo8KZCkGBgUKQgJKy0gmHzllx3dRaZddsdxR8sruMKfs7s9743OyRJUh36hHq9fjgMfYZD74NC9Qt4Qxgd73hNm6BUOQ9XuTjkKgXgDcHpgdBUEMK+dd1rNIIeS1k4f74BXilIZbh+S4BYk+B4LkS9RnMPXb7GoBe4+0hCmqwkGoogVI9Hr5AT6bdEz7ocLjsafWfbA0G84wAbcTmcsCUE5PriHnEyfTcw7qOO2yZod3YZwt4NImoUzMQWQSEyK0f+ZmE0ErPcI2PUP8MWQWHfhvyKde8ie69bJDuxM7PclhgsN4WAx0tCpkc+j5IYY1QMgonh9j2pGbNckOBsJuaiCcmkNUTb6nKtrE7Mwx4xC3S/p9ILRPMPwAo3gtAoTue3lfdzLoG0oLgs2URxU1jXJhbaxnbIbLHCjSCx9g1mwI2geCFDGUsDK9zcQ2jfWJPwXpomUSj2mZG7U1a4cjmcESOzosbyJZcTi8q53zUF3RL0aEOq5YKKJLdValX5fHd2RVNoWcHliYcay5ccts6RfELOYNg2RJZOZIHiD5vLcRVOMYO5SRpo7K/hDzOrjbDNFNDB4sUUCas+8LsF5gYvSBq8RshVY6vLYfsQl4irGdikPfCuK22ImsEmCe8MBPECuiQNRRDWhG6KnNWsTS5QxzUzdOTfhF4At8Bolo1oBGGTdba4z+1Muf6KsXoLrJUhvYfGRuLIf9PpkSQ+NNYtrGbGESvpO9v+BXoHs/1Fw5iPAAAAAElFTkSuQmCC"
      logoWidth={36}
      logoHeight={28}
      bgColor="#F8F8F8"
      qrStyle="dots"
      value={value}
    />
  )
}

export default QRCode
