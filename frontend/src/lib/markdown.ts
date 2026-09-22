/**
 * Robust markdown and mathematical notation parser for GridFlex AI chat widget.
 * Formats responses in clean, sequence-wise paragraphs, lists, equations, and code blocks.
 */
export function parseMarkdown(text: string): string {
  if (!text) return '';

  // Clean raw LaTeX math before escaping HTML
  let processed = text
    // Replace multi-line or block math $$ ... $$
    .replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
      const cleanMath = cleanMathExpression(math);
      return `\n:::MATH_BLOCK:::${cleanMath}:::END_MATH:::\n`;
    })
    // Replace inline math $ ... $
    .replace(/\$([^$\n]+)\$/g, (_, math) => {
      const cleanMath = cleanMathExpression(math);
      return `:::INLINE_MATH:::${cleanMath}:::END_INLINE:::`;
    });

  // Escape HTML tags
  let html = processed
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks (``` ... ```)
  html = html.replace(/```([\s\S]*?)```/g, (_, code) => {
    return `<pre style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 14px;overflow-x:auto;margin:8px 0;font-size:0.82rem;color:#0f172a;line-height:1.5;font-family:monospace;">${code.trim()}</pre>`;
  });

  // Inline code (`...`)
  html = html.replace(/`([^`]+)`/g, (_, code) => {
    return `<code style="background:#f1f5f9;border:1px solid #e2e8f0;border-radius:4px;padding:2px 6px;font-size:0.84em;color:#0284c7;font-family:monospace;font-weight:600;">${code}</code>`;
  });

  // Bold (**text**) - High contrast in light mode
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong style="color:var(--text-primary);font-weight:700;">$1</strong>');

  // Italic (*text*)
  html = html.replace(/\*([^*]+)\*/g, '<em style="color:var(--text-secondary);font-style:italic;">$1</em>');

  // Math Blocks Restoration
  html = html.replace(/:::MATH_BLOCK:::([\s\S]*?):::END_MATH:::/g, (_, math) => {
    return `<div style="background:#f8fafc;border:1px solid #e2e8f0;border-left:3px solid #6366f1;border-radius:6px;padding:8px 12px;margin:8px 0;font-family:monospace,sans-serif;font-size:0.84rem;color:#0f172a;overflow-x:auto;line-height:1.5;">${math.trim()}</div>`;
  });

  // Inline Math Restoration
  html = html.replace(/:::INLINE_MATH:::([\s\S]*?):::END_INLINE:::/g, (_, math) => {
    return `<span style="background:#f1f5f9;border:1px solid #e2e8f0;padding:1px 5px;border-radius:4px;font-family:monospace,sans-serif;font-size:0.84em;color:#4f46e5;font-weight:600;">${math.trim()}</span>`;
  });

  // Process lines into structured paragraphs, headers, and lists
  const rawLines = html.split('\n');
  const result: string[] = [];
  let inList = false;
  let inNumberedList = false;
  let paragraphBuffer: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      result.push(`<p style="margin:6px 0;line-height:1.58;color:var(--text-primary);">${paragraphBuffer.join(' ')}</p>`);
      paragraphBuffer = [];
    }
  };

  const closeLists = () => {
    if (inList) {
      result.push('</ul>');
      inList = false;
    }
    if (inNumberedList) {
      result.push('</ol>');
      inNumberedList = false;
    }
  };

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].trim();

    // Empty line triggers paragraph flush and list close
    if (!line) {
      flushParagraph();
      closeLists();
      continue;
    }

    // Header 3 (###)
    if (/^###\s/.test(line)) {
      flushParagraph();
      closeLists();
      result.push(`<h4 style="color:var(--brand);font-size:0.92rem;font-weight:700;margin:12px 0 6px 0;">${line.replace(/^###\s/, '')}</h4>`);
      continue;
    }

    // Header 2 (##)
    if (/^##\s/.test(line)) {
      flushParagraph();
      closeLists();
      result.push(`<h3 style="color:var(--text-primary);font-size:1.02rem;font-weight:800;margin:14px 0 6px 0;">${line.replace(/^##\s/, '')}</h3>`);
      continue;
    }

    // Horizontal rule (---)
    if (/^---+$/.test(line)) {
      flushParagraph();
      closeLists();
      result.push('<hr style="border:none;border-top:1px solid var(--border-subtle);margin:10px 0;" />');
      continue;
    }

    // Math block already rendered
    if (line.startsWith('<div style="background:#f8fafc')) {
      flushParagraph();
      closeLists();
      result.push(line);
      continue;
    }

    // Bullet list items (- item or • item)
    if (/^[-•*]\s/.test(line)) {
      flushParagraph();
      if (inNumberedList) {
        result.push('</ol>');
        inNumberedList = false;
      }
      if (!inList) {
        result.push('<ul style="margin:6px 0 8px 12px;padding:0;list-style:none;display:flex;flex-direction:column;gap:5px;">');
        inList = true;
      }
      const content = line.replace(/^[-•*]\s/, '');
      result.push(`<li style="display:flex;align-items:flex-start;gap:8px;line-height:1.5;"><span style="color:var(--cyan-primary);margin-top:2px;flex-shrink:0;">•</span><span>${content}</span></li>`);
      continue;
    }

    // Numbered list items (1. item)
    if (/^\d+\.\s/.test(line)) {
      flushParagraph();
      if (inList) {
        result.push('</ul>');
        inList = false;
      }
      if (!inNumberedList) {
        result.push('<ol style="margin:6px 0 8px 12px;padding:0;list-style:none;display:flex;flex-direction:column;gap:5px;">');
        inNumberedList = true;
      }
      const num = line.match(/^(\d+)\./)?.[1] || '1';
      const content = line.replace(/^\d+\.\s/, '');
      result.push(`<li style="display:flex;align-items:flex-start;gap:8px;line-height:1.5;"><span style="color:var(--brand);font-weight:700;font-size:0.85em;flex-shrink:0;min-width:18px;">${num}.</span><span>${content}</span></li>`);
      continue;
    }

    // Regular line inside a paragraph
    paragraphBuffer.push(line);
  }

  flushParagraph();
  closeLists();

  return result.join('');
}

/**
 * Converts common LaTeX math formatting into clean readable Unicode
 */
function cleanMathExpression(raw: string): string {
  return raw
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\mathbf\{([^}]+)\}/g, '$1')
    .replace(/\\mathbf\s+([A-Za-z0-9]+)/g, '$1')
    .replace(/\\times/g, '×')
    .replace(/\\pm/g, '±')
    .replace(/\\le/g, '≤')
    .replace(/\\ge/g, '≥')
    .replace(/\\neq/g, '≠')
    .replace(/\\approx/g, '≈')
    .replace(/\\Sigma/g, 'Σ')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\phi/g, 'φ')
    .replace(/\\rightarrow/g, '➔')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)')
    .replace(/\\,/g, ' ')
    .replace(/\\quad/g, '   ')
    .replace(/\\qquad/g, '     ')
    .trim();
}
