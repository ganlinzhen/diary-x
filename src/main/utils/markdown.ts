// Markdown 段落解析工具

export interface ParsedSegment {
  content: string
  startLine: number
  endLine: number
  order: number
}

/**
 * 将 Markdown 内容解析为段落
 * 段落以空行分隔
 */
export function parseMarkdownToSegments(content: string): ParsedSegment[] {
  const lines = content.split('\n')
  const segments: ParsedSegment[] = []
  let currentSegment: string[] = []
  let startLine = 0
  let order = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // 空行作为段落分隔符
    if (line.trim() === '') {
      if (currentSegment.length > 0) {
        segments.push({
          content: currentSegment.join('\n'),
          startLine,
          endLine: i - 1,
          order: order++
        })
        currentSegment = []
      }
    } else {
      if (currentSegment.length === 0) {
        startLine = i
      }
      currentSegment.push(line)
    }
  }

  // 处理最后一个段落
  if (currentSegment.length > 0) {
    segments.push({
      content: currentSegment.join('\n'),
      startLine,
      endLine: lines.length - 1,
      order: order++
    })
  }

  return segments
}
