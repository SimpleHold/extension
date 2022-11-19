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
      logoImage={
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAL8SURBVHgB7ZhNTxNBGMf/s63ISy0bCEij2BKRhJAIQQ+CEZZEMZ4In4ByMDF4AO+oRY3xBifP7TfQc03Yk0fTg5KYkFj1YNREVyUGod3HZxZKCna7u30lhl/SbHdmuvPr7Lw8M8AR/wkCHmm5OTrkO6ZEQeYUQUQ4yeBPCoISv56+jGursQi2MwukiCkQIlyDARIpQZTQJx/G3dbjSSw4NzJPpKzY5YcvDjxrD5/UWEi1qU4XfmVan4gZqJRYcG70PpGI2eWH+nusjzOUev/67azx+VuUhBgkQWnFzC4ZT/S0Z7HKSQFbm3+w/uqNdc3DEEJMGI+TqVyC4vQgJ6n2cKhcKYlKRMv5CUq5UuEL/ShTKocGN2I1lmIoDSexndFXGSnJh7V1Bynu7CQSKCZ24vblmWJTglepbCaDDeNn0TJtoU4MXh0Jw05MSsFE3O4BaqjDk5QbWjvacKb/LL9JRMeSd5f/EXOSalIDPIF6l/L5/QiowcLPDDTvSO3Cc9eCllzU9sTcSPVdGYbvmB+lcKqvBw2Nx/elSdne4QFLPB8Svhl59au3LkU4N541M6iGlPUMbhkp8ePrd+5z23zfYr3CwpiaJdY50Bv7tPYO1ZLKIVuso7vLuaBc+BmlRQ2Oo8pSpaAEu9ojDc2NOCxSgiMQeZU1G31jw+qX9Y/Y+r2JptYAOnu769ZS4LhtV0ykuMW00+fPoe6QSCOr6PKrImAu4XBgCHAQeSOWljeKfu2RLkB1lxMmzeqTsb14bC9Q1F4srvDCPY86IAizB/cD+yJYXg7ivMGYQQ0pJGWlH0yopZydlJVXKLEWcsWkrHy7jGrKOUlJbENrHq1RHq0JVFrKFEtuNr6O27fx5L1Vnvk0VABL6vqDmJuyjts3uXOWqwPKxIuUVd5NIT6PUCljypYbQgl4lXItJilVrhQp63deCnuVK1VK4tjH8pGnNNznJlyMVl6QzTulSkk8n4/l2N3NRPm/DdJOC7IMhy0wn2PDv6JPOx81HVFJ/gJdcT2r5OBEvQAAAABJRU5ErkJggg=='
      }
      logoWidth={38}
      logoHeight={38}
      bgColor="#F8F8F8"
      qrStyle="dots"
      value={value}
      quietZone={0}
    />
  )
}

export default QRCode
