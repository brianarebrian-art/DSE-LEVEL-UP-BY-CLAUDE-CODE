// Minimal YAML subset loader (maps, lists, scalars). Zero dependency.
import { readFileSync, existsSync } from 'node:fs'

function stripInlineComment(raw) {
  let s = String(raw)
  let inSingle = false
  let inDouble = false
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (ch === "'" && !inDouble) inSingle = !inSingle
    else if (ch === '"' && !inSingle) inDouble = !inDouble
    else if (ch === '#' && !inSingle && !inDouble) {
      s = s.slice(0, i)
      break
    }
  }
  return s.trim()
}

function parseScalar(raw) {
  const s = stripInlineComment(raw)
  if (s === 'true') return true
  if (s === 'false') return false
  if (s === 'null' || s === '~' || s === '') return null
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s)
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    return s.slice(1, -1)
  }
  return s
}

export function parseSimpleYaml(text) {
  const lines = String(text).split(/\r?\n/)
  const root = {}
  let i = 0

  function indentOf(line) {
    const m = line.match(/^[ \t]*/)
    return m ? m[0].length : 0
  }

  function parseBlock(baseIndent) {
    const obj = {}
    let listKey = null
    let list = null

    while (i < lines.length) {
      const raw = lines[i]
      const trimmed = raw.trim()
      if (!trimmed || trimmed.startsWith('#')) {
        i += 1
        continue
      }
      const ind = indentOf(raw)
      if (ind < baseIndent) break
      if (ind > baseIndent && listKey == null) {
        // nested under previous key handled below
      }

      if (trimmed.startsWith('- ')) {
        if (!listKey) {
          throw new Error(`YAML list without key at line ${i + 1}`)
        }
        if (!list) {
          list = []
          obj[listKey] = list
        }
        const rest = trimmed.slice(2)
        if (rest.includes(':')) {
          const item = {}
          const [k, ...vs] = rest.split(':')
          item[k.trim()] = parseScalar(vs.join(':'))
          i += 1
          while (i < lines.length) {
            const nraw = lines[i]
            const ntrim = nraw.trim()
            if (!ntrim || ntrim.startsWith('#')) {
              i += 1
              continue
            }
            const nind = indentOf(nraw)
            if (nind <= ind) break
            if (ntrim.startsWith('- ')) break
            const [ik, ...ivs] = ntrim.split(':')
            item[ik.trim()] = parseScalar(ivs.join(':'))
            i += 1
          }
          list.push(item)
        } else {
          list.push(parseScalar(rest))
          i += 1
        }
        continue
      }

      if (ind !== baseIndent) break

      const colon = trimmed.indexOf(':')
      if (colon < 0) {
        i += 1
        continue
      }
      const key = trimmed.slice(0, colon).trim()
      const val = trimmed.slice(colon + 1).trim()
      listKey = null
      list = null
      i += 1

      if (val === '') {
        // peek: list or nested map
        let j = i
        while (j < lines.length && (!lines[j].trim() || lines[j].trim().startsWith('#'))) j += 1
        if (j < lines.length && lines[j].trim().startsWith('- ') && indentOf(lines[j]) > baseIndent) {
          listKey = key
          list = []
          obj[key] = list
        } else if (j < lines.length && indentOf(lines[j]) > baseIndent) {
          const nested = parseBlock(indentOf(lines[j]))
          obj[key] = nested
        } else {
          obj[key] = null
        }
      } else {
        obj[key] = parseScalar(val)
      }
    }
    return obj
  }

  Object.assign(root, parseBlock(0))
  return root
}

export function loadYamlFile(path) {
  if (!existsSync(path)) return null
  return parseSimpleYaml(readFileSync(path, 'utf8'))
}
