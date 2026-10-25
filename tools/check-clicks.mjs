import { readFileSync } from 'node:fs'

const isYaml = (lines) =>
  lines.length > 0 && lines.every(l => !l.trim() || /^[\w-]+\s*:/.test(l) || /^\s+\S/.test(l) || /^-\s/.test(l))

/** split a slidev markdown file into { fm, body } slides */
function slides(raw) {
  const lines = raw.replace(/\r\n/g, '\n').split('\n')
  const out = []
  let i = 0
  // leading headmatter
  const readFm = () => {
    if (lines[i] !== '---') return null
    let j = i + 1
    while (j < lines.length && lines[j] !== '---') j++
    if (j >= lines.length) return null
    const block = lines.slice(i + 1, j)
    if (!isYaml(block)) return null
    i = j + 1
    return block.join('\n')
  }
  let fm = readFm()
  let buf = []
  const push = () => out.push({ fm: fm || '', body: buf.join('\n') })
  for (; i < lines.length; i++) {
    if (lines[i] === '---') {
      push(); buf = []
      const save = i
      i++
      // optional frontmatter for the new slide
      let j = i
      while (j < lines.length && lines[j] !== '---') j++
      const block = lines.slice(i, j)
      if (j < lines.length && isYaml(block) && block.some(l => l.trim())) { fm = block.join('\n'); i = j }
      else { fm = ''; i = save }
      continue
    }
    buf.push(lines[i])
  }
  push()
  return out
}

/** pull the balanced [...] that follows :frames= */
function framesLiteral(body) {
  const k = body.indexOf(':frames="')
  if (k < 0) return null
  let i = body.indexOf('[', k)
  if (i < 0) return null
  let depth = 0, q = null
  for (let p = i; p < body.length; p++) {
    const c = body[p]
    if (q) { if (c === q) q = null; continue }
    if (c === "'" || c === '"') { q = c; continue }
    if (c === '[' || c === '{') depth++
    else if (c === ']' || c === '}') { depth--; if (depth === 0) return body.slice(i, p + 1) }
  }
  return null
}

const stepsOf = (frames) => {
  let n = 0
  frames.forEach((f, i) => {
    if (i > 0) { if (frames[i - 1].tap) n++; n++ }
    n += f.tour?.length ?? 0
  })
  return n
}

let bad = 0, total = 0
for (const file of process.argv.slice(2)) {
  const name = file.split(/[\/]/).pop()
  slides(readFileSync(file, 'utf8')).forEach((s, idx) => {
    if (!/<Walk\b/.test(s.body)) return
    total++
    const lit = framesLiteral(s.body)
    let frames
    try { frames = eval(lit) } catch (e) { console.log(`PARSE FAIL ${name} #${idx}: ${e.message}`); return }
    const want = stepsOf(frames)
    const m = s.fm.match(/^clicks:\s*(\d+)/m)
    const got = m ? Number(m[1]) : 0
    const title = (s.body.match(/^##\s+(.+)$/m) || [, '(no title)'])[1]
    if (want !== got) bad++
    console.log(`${want === got ? 'ok  ' : 'BAD '}${name} #${idx}  clicks:${m ? got : '—'}  needs:${want}   ${title}`)
  })
}
console.log(`\n${total} Walk slides, ${bad} with wrong click count`)
