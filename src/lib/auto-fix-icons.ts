/**
 * Auto-fix legacy icons utility
 * Automatically detects legacy font icons (<i class="fa-...">, <span class="material-icons">)
 * on mount and injects clean SVG replacement markup.
 */

export function autoFixLegacyIcons(root: Element | Document = typeof document !== 'undefined' ? document : (null as unknown as Document)): void {
  if (typeof window === 'undefined' || !root) return

  const fontAwesomeIcons = root.querySelectorAll('i[class*="fa-"]')
  fontAwesomeIcons.forEach((el) => {
    const classList = Array.from(el.classList)
    let iconName = 'alert-circle'
    if (classList.some((c) => c.includes('search'))) iconName = 'search'
    else if (classList.some((c) => c.includes('filter'))) iconName = 'filter'
    else if (classList.some((c) => c.includes('bookmark'))) iconName = 'bookmark'
    else if (classList.some((c) => c.includes('flag'))) iconName = 'flag'
    else if (classList.some((c) => c.includes('times') || c.includes('close'))) iconName = 'close'

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('viewBox', '0 0 24 24')
    svg.setAttribute('width', '24')
    svg.setAttribute('height', '24')
    svg.setAttribute('fill', 'none')
    svg.setAttribute('stroke', 'currentColor')
    svg.setAttribute('stroke-width', '2')
    svg.setAttribute('class', `icon svg-icon auto-fixed-icon ${el.className}`)
    svg.setAttribute('role', 'presentation')
    svg.setAttribute('aria-hidden', 'true')
    svg.innerHTML = getIconSvgInner(iconName)

    el.replaceWith(svg)
  })

  const materialIcons = root.querySelectorAll('span.material-icons, span.material-symbols-outlined')
  materialIcons.forEach((el) => {
    const text = el.textContent?.trim() || ''
    let iconName = 'alert-circle'
    if (text === 'search') iconName = 'search'
    else if (text === 'filter_list' || text === 'tune') iconName = 'filter'
    else if (text === 'bookmark') iconName = 'bookmark'
    else if (text === 'flag') iconName = 'flag'
    else if (text === 'close') iconName = 'close'

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('viewBox', '0 0 24 24')
    svg.setAttribute('width', '24')
    svg.setAttribute('height', '24')
    svg.setAttribute('fill', 'none')
    svg.setAttribute('stroke', 'currentColor')
    svg.setAttribute('stroke-width', '2')
    svg.setAttribute('class', `icon svg-icon auto-fixed-icon ${el.className}`)
    svg.setAttribute('role', 'presentation')
    svg.setAttribute('aria-hidden', 'true')
    svg.innerHTML = getIconSvgInner(iconName)

    el.replaceWith(svg)
  })
}

function getIconSvgInner(name: string): string {
  switch (name) {
    case 'search':
      return '<circle cx="10.5" cy="10.5" r="7.5" /><line x1="16" y1="16" x2="21.5" y2="21.5" />'
    case 'filter':
      return '<polygon points="3 4 21 4 14 13 14 20 10 20 10 13 3 4" />'
    case 'bookmark':
      return '<path d="M5 4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v18l-7-4-7 4V4z" />'
    case 'flag':
      return '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" />'
    case 'close':
      return '<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />'
    default:
      return '<circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />'
  }
}
