export default async function loadText (fileOrFiles) {
  const files = []
  if (typeof fileOrFiles === 'string') {
    const res = await fetch(`/base/test/resource/${fileOrFiles}`)
    return res.text()
  }

  const results = []
  for (const file of files) {
    const res = await fetch(`/base/test/resource/${file}`)
    results.push(await res.text())
  }
  return results
}
