const loadExternalScripts = (urls: string[]) => {
  for (const url of urls) {
    const script = document.createElement('script')
    script.src = url
    script.async = true
    document.body.appendChild(script)
  }
}

export default loadExternalScripts