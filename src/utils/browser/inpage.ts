setTimeout(() => {
  document.getElementById('sh-button')?.addEventListener('click', () => {
    const findInput = document.querySelector<HTMLInputElement>("[sh-input='address']")

    const getFavicon = (): string | null | undefined => {
      let favicon = undefined
      const nodeLinks = document.getElementsByTagName('link')

      for (const link of nodeLinks) {
        if (link.getAttribute('rel') === 'icon' || link.getAttribute('rel') === 'shortcut icon') {
          favicon = link.getAttribute('href')
        }
      }

      return favicon
    }

    if (findInput) {
      const favicon = getFavicon()

      document.dispatchEvent(
        new CustomEvent('request_addresses', {
          detail: {
            site: location.host,
            favicon,
          },
        })
      )
    }
  })
}, 1000)

export {}
