/// Lightweight Markdown-to-HTML renderer (no external crate).
///
/// Supports the subset used in blog posts:
/// - `## heading` / `### heading` / `#### heading`
/// - `**bold**`, `*italic*`
/// - `` `inline code` ``
/// - Fenced code blocks (` ``` `)
/// - `- unordered list`
/// - `[text](url)` links
/// - `| table |` (simple pipe tables)
/// - `> blockquote`
/// - Blank-line paragraph breaks

pub fn render(markdown: &str) -> String {
    let mut html = String::with_capacity(markdown.len() * 2);
    let mut in_code_block = false;
    let mut in_list = false;
    let mut in_blockquote = false;
    let mut in_table = false;
    let mut table_header_done = false;
    let mut paragraph = String::new();

    for line in markdown.lines() {
        // ── fenced code block ───────────────────────────────────────────
        if line.trim_start().starts_with("```") {
            if in_code_block {
                html.push_str("</code></pre>\n");
                in_code_block = false;
            } else {
                flush_paragraph(&mut html, &mut paragraph);
                let lang = line.trim_start().trim_start_matches('`').trim();
                if lang.is_empty() {
                    html.push_str("<pre><code>");
                } else {
                    html.push_str(&format!(r#"<pre><code class="language-{lang}">"#));
                }
                in_code_block = true;
            }
            continue;
        }
        if in_code_block {
            html.push_str(&html_escape(line));
            html.push('\n');
            continue;
        }

        let trimmed = line.trim();

        // ── blank line → close open structures ──────────────────────────
        if trimmed.is_empty() {
            flush_paragraph(&mut html, &mut paragraph);
            if in_list {
                html.push_str("</ul>\n");
                in_list = false;
            }
            if in_blockquote {
                html.push_str("</blockquote>\n");
                in_blockquote = false;
            }
            if in_table {
                html.push_str("</tbody></table>\n");
                in_table = false;
                table_header_done = false;
            }
            continue;
        }

        // ── headings ────────────────────────────────────────────────────
        if trimmed.starts_with("#### ") {
            flush_paragraph(&mut html, &mut paragraph);
            let text = inline(&trimmed[5..]);
            html.push_str(&format!("<h4>{text}</h4>\n"));
            continue;
        }
        if trimmed.starts_with("### ") {
            flush_paragraph(&mut html, &mut paragraph);
            let text = inline(&trimmed[4..]);
            html.push_str(&format!("<h3>{text}</h3>\n"));
            continue;
        }
        if trimmed.starts_with("## ") {
            flush_paragraph(&mut html, &mut paragraph);
            let text = inline(&trimmed[3..]);
            html.push_str(&format!("<h2>{text}</h2>\n"));
            continue;
        }
        if trimmed.starts_with("# ") {
            flush_paragraph(&mut html, &mut paragraph);
            let text = inline(&trimmed[2..]);
            html.push_str(&format!("<h1>{text}</h1>\n"));
            continue;
        }

        // ── blockquote ──────────────────────────────────────────────────
        if trimmed.starts_with("> ") {
            flush_paragraph(&mut html, &mut paragraph);
            if !in_blockquote {
                html.push_str("<blockquote>\n");
                in_blockquote = true;
            }
            let text = inline(&trimmed[2..]);
            html.push_str(&format!("<p>{text}</p>\n"));
            continue;
        }

        // ── unordered list ──────────────────────────────────────────────
        if trimmed.starts_with("- ") || trimmed.starts_with("* ") {
            flush_paragraph(&mut html, &mut paragraph);
            if !in_list {
                html.push_str("<ul>\n");
                in_list = true;
            }
            let text = inline(&trimmed[2..]);
            html.push_str(&format!("<li>{text}</li>\n"));
            continue;
        }

        // ── table ───────────────────────────────────────────────────────
        if trimmed.starts_with('|') && trimmed.ends_with('|') {
            flush_paragraph(&mut html, &mut paragraph);

            // Skip separator rows like |---|---|
            if trimmed.contains("---") {
                table_header_done = true;
                continue;
            }

            if !in_table {
                html.push_str("<table>\n<thead>\n");
                in_table = true;
                table_header_done = false;
            }

            let cells: Vec<&str> = trimmed
                .trim_matches('|')
                .split('|')
                .map(|c| c.trim())
                .collect();

            if !table_header_done {
                html.push_str("<tr>");
                for cell in &cells {
                    html.push_str(&format!("<th>{}</th>", inline(cell)));
                }
                html.push_str("</tr>\n</thead>\n<tbody>\n");
            } else {
                html.push_str("<tr>");
                for cell in &cells {
                    html.push_str(&format!("<td>{}</td>", inline(cell)));
                }
                html.push_str("</tr>\n");
            }
            continue;
        }

        // ── regular text → accumulate into paragraph ────────────────────
        if !paragraph.is_empty() {
            paragraph.push(' ');
        }
        paragraph.push_str(trimmed);
    }

    // Close any dangling structures.
    flush_paragraph(&mut html, &mut paragraph);
    if in_code_block {
        html.push_str("</code></pre>\n");
    }
    if in_list {
        html.push_str("</ul>\n");
    }
    if in_blockquote {
        html.push_str("</blockquote>\n");
    }
    if in_table {
        html.push_str("</tbody></table>\n");
    }

    html
}

/// Flush accumulated paragraph text into `<p>`.
fn flush_paragraph(html: &mut String, paragraph: &mut String) {
    if !paragraph.is_empty() {
        html.push_str(&format!("<p>{}</p>\n", inline(paragraph)));
        paragraph.clear();
    }
}

/// Process inline markup: bold, italic, code, links.
fn inline(text: &str) -> String {
    let text = html_escape(text);

    // Order matters: process longer patterns first.
    let mut result = text;

    // **bold**
    result = replace_pattern(&result, "**", "<strong>", "</strong>");

    // *italic* (careful not to match inside <strong>)
    result = replace_single_star(&result);

    // `inline code`
    result = replace_pattern(&result, "`", "<code>", "</code>");

    // [text](url) → <a href="url">text</a>
    result = replace_links(&result);

    result
}

/// Replace paired delimiters like `**...**` with HTML tags.
fn replace_pattern(input: &str, delim: &str, open: &str, close: &str) -> String {
    let mut result = String::with_capacity(input.len());
    let mut rest = input;
    let mut open_next = true;

    while let Some(pos) = rest.find(delim) {
        result.push_str(&rest[..pos]);
        if open_next {
            result.push_str(open);
        } else {
            result.push_str(close);
        }
        open_next = !open_next;
        rest = &rest[pos + delim.len()..];
    }
    result.push_str(rest);
    result
}

/// Handle single `*italic*` without interfering with `<strong>`.
fn replace_single_star(input: &str) -> String {
    let mut result = String::with_capacity(input.len());
    let chars: Vec<char> = input.chars().collect();
    let len = chars.len();
    let mut i = 0;

    while i < len {
        if chars[i] == '*' {
            // Skip if preceded by '<' or followed by '/' (likely inside HTML tag)
            let prev = if i > 0 { Some(chars[i - 1]) } else { None };
            if prev == Some('<') || (i + 1 < len && chars[i + 1] == '/') {
                result.push('*');
                i += 1;
                continue;
            }
            // Find closing *
            if let Some(end) = chars[i + 1..].iter().position(|&c| c == '*') {
                let end = i + 1 + end;
                result.push_str("<em>");
                for c in &chars[i + 1..end] {
                    result.push(*c);
                }
                result.push_str("</em>");
                i = end + 1;
            } else {
                result.push('*');
                i += 1;
            }
        } else {
            result.push(chars[i]);
            i += 1;
        }
    }
    result
}

/// Replace `[text](url)` with `<a>` tags.
fn replace_links(input: &str) -> String {
    let mut result = String::with_capacity(input.len());
    let mut rest: &str = input;

    while let Some(bracket_start) = rest.find('[') {
        result.push_str(&rest[..bracket_start]);
        let after_bracket = &rest[bracket_start + 1..];

        if let Some(bracket_end) = after_bracket.find("](") {
            let text = &after_bracket[..bracket_end];
            let after_paren = &after_bracket[bracket_end + 2..];

            if let Some(paren_end) = after_paren.find(')') {
                let url = &after_paren[..paren_end];
                result.push_str(&format!(r#"<a href="{url}">{text}</a>"#));
                rest = &after_paren[paren_end + 1..];
                continue;
            }
        }

        // Not a valid link pattern — emit the `[` literally.
        result.push('[');
        rest = after_bracket;
    }
    result.push_str(rest);
    result
}

/// Escape HTML special characters.
fn html_escape(s: &str) -> String {
    s.replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
}
