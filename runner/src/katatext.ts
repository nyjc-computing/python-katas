// Minimal renderer for kata question markdown. The corpus grammar is small:
// paragraphs separated by blank lines, `inline code`, **bold**, and untagged
// ``` fences for sample input/output. Everything is escaped before any
// markup is applied, so corpus text can never inject HTML.

const escapeHtml = (s: string): string =>
  s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

const renderInline = (s: string): string =>
  escapeHtml(s)
    .replaceAll(/`([^`]+)`/g, '<code>$1</code>')
    .replaceAll(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')

export function kataQuestionHtml(markdown: string): string {
  const blocks: string[] = []
  const parts = markdown.split('```')
  parts.forEach((part, index) => {
    if (index % 2 === 1) {
      // fence content: sample input/output — raw block, no inline markup
      blocks.push(`<pre class="kata-sample">${escapeHtml(part.replace(/^\n/, '').replace(/\n$/, ''))}</pre>`)
    } else if (part.trim()) {
      const paragraphs = part
        .trim()
        .split(/\n{2,}/)
        .map((p) => `<p>${renderInline(p.trim()).replaceAll('\n', '<br>')}</p>`)
      blocks.push(paragraphs.join(''))
    }
  })
  return blocks.join('')
}
