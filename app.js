const editor = document.getElementById("editor");
const renderLayer = document.getElementById("renderLayer");
const guideLayer = document.getElementById("guideLayer");
const lineNumbers = document.getElementById("lineNumbers");
const tableDialog = document.getElementById("tableDialog");
const tableForm = document.getElementById("tableForm");
const tableRows = document.getElementById("tableRows");
const tableCols = document.getElementById("tableCols");
const tableCancel = document.getElementById("tableCancel");
const languageDialog = document.getElementById("languageDialog");
const languageForm = document.getElementById("languageForm");
const languageSelect = document.getElementById("languageSelect");
const languageCancel = document.getElementById("languageCancel");
const renderToggle = document.getElementById("renderToggle");
const lineGuideToggle = document.getElementById("lineGuideToggle");
const mathTemplateDialog = document.getElementById("mathTemplateDialog");
const mathTemplateForm = document.getElementById("mathTemplateForm");
const mathTemplateTitle = document.getElementById("mathTemplateTitle");
const mathTemplateFields = document.getElementById("mathTemplateFields");
const mathTemplateCancel = document.getElementById("mathTemplateCancel");
const downloadBtn = document.getElementById("downloadBtn");
const downloadDialog = document.getElementById("downloadDialog");
const downloadMdBtn = document.getElementById("downloadMdBtn");
const downloadTxtBtn = document.getElementById("downloadTxtBtn");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");
const downloadCancel = document.getElementById("downloadCancel");
const mathKeyboard = document.getElementById("mathKeyboard");
const mathGrid = document.getElementById("mathGrid");
const editorWrap = document.querySelector(".editor-wrap");

let lastValue = "";
let pendingCodeTrigger = null;
let pendingMathTemplate = null;
let isRenderEnabled = false;
let lastMathInput = null;

function syncOverlayScroll() {
  const top = isRenderEnabled ? renderLayer.scrollTop : editor.scrollTop;
  lineNumbers.scrollTop = top;
  guideLayer.scrollTop = top;
}

function setMathKeyboardOpen(open) {
  if (open) {
    mathKeyboard.classList.add("open");
    mathKeyboard.setAttribute("aria-hidden", "false");
    document.body.classList.add("math-open");
    const keyboardHeight = mathKeyboard.offsetHeight || 0;
    document.documentElement.style.setProperty("--math-kb-height", `${keyboardHeight}px`);
    requestAnimationFrame(() => {
      syncOverlayScroll();
    });
    return;
  }

  mathKeyboard.classList.remove("open");
  mathKeyboard.setAttribute("aria-hidden", "true");
  document.body.classList.remove("math-open");
  document.documentElement.style.setProperty("--math-kb-height", "0px");

  requestAnimationFrame(() => {
    syncOverlayScroll();
  });
}

const md = window
  .markdownit({
    html: true,
    linkify: true,
    breaks: true,
    highlight(str, lang) {
      if (lang && window.hljs.getLanguage(lang)) {
        return `<pre><code class=\"hljs language-${lang}\">${window.hljs.highlight(str, { language: lang }).value}</code></pre>`;
      }
      return `<pre><code class=\"hljs\">${md.utils.escapeHtml(str)}</code></pre>`;
    },
  })
  .use(window.texmath, {
    engine: window.katex,
    delimiters: "dollars",
    katexOptions: { throwOnError: false },
  });

const measureLayer = document.createElement("div");
measureLayer.style.position = "absolute";
measureLayer.style.visibility = "hidden";
measureLayer.style.pointerEvents = "none";
measureLayer.style.left = "-99999px";
measureLayer.style.top = "0";
measureLayer.style.whiteSpace = "pre-wrap";
measureLayer.style.wordBreak = "break-word";
measureLayer.style.fontFamily = '"JetBrains Mono", monospace';
measureLayer.style.fontSize = "14px";
measureLayer.style.lineHeight = "1.6";
document.body.appendChild(measureLayer);

// display: KaTeX渲染后的显示符号; label: 对话框标题; snippet: 直接插入或模板; fields: 有则弹框
const mathKeys = [
  // ── 基础运算 ──
  { display: "+", label: "+", snippet: "+" },
  { display: "-", label: "-", snippet: "-" },
  { display: "\\times", label: "×", snippet: "\\times " },
  { display: "\\div", label: "÷", snippet: "\\div " },
  { display: "\\pm", label: "±", snippet: "\\pm " },
  { display: "\\mp", label: "∓", snippet: "\\mp " },
  { display: "\\cdot", label: "·", snippet: "\\cdot " },
  // ── 比较 ──
  { display: "\\leq", label: "≤", snippet: "\\leq " },
  { display: "\\geq", label: "≥", snippet: "\\geq " },
  { display: "\\neq", label: "≠", snippet: "\\neq " },
  { display: "\\approx", label: "≈", snippet: "\\approx " },
  { display: "\\equiv", label: "≡", snippet: "\\equiv " },
  { display: "\\sim", label: "∼", snippet: "\\sim " },
  // ── 集合逻辑 ──
  { display: "\\in", label: "∈", snippet: "\\in " },
  { display: "\\notin", label: "∉", snippet: "\\notin " },
  { display: "\\subset", label: "⊂", snippet: "\\subset " },
  { display: "\\cup", label: "∪", snippet: "\\cup " },
  { display: "\\cap", label: "∩", snippet: "\\cap " },
  { display: "\\forall", label: "∀", snippet: "\\forall " },
  { display: "\\exists", label: "∃", snippet: "\\exists " },
  // ── 箭头 ──
  { display: "\\to", label: "→", snippet: "\\to " },
  { display: "\\leftarrow", label: "←", snippet: "\\leftarrow " },
  { display: "\\Rightarrow", label: "⇒", snippet: "\\Rightarrow " },
  { display: "\\Leftrightarrow", label: "⇔", snippet: "\\Leftrightarrow " },
  { display: "\\infty", label: "∞", snippet: "\\infty" },
  // ── 上下标 ──
  { display: "x^n", label: "xⁿ", snippet: "^{}" },
  { display: "x_n", label: "x_n", snippet: "_{}" },
  // ── 结构模板 ──
  {
    display: "\\frac{a}{b}", label: "分数",
    snippet: "\\frac{{{{num}}}}{{{{den}}}}",
    fields: [
      { key: "num", label: "分子", defaultValue: "a+b" },
      { key: "den", label: "分母", defaultValue: "c+d" },
    ],
  },
  {
    display: "\\sqrt{x}", label: "根号",
    snippet: "\\sqrt{{{{x}}}}",
    fields: [{ key: "x", label: "被开方项", defaultValue: "x" }],
  },
  {
    display: "\\sqrt[n]{x}", label: "n次根",
    snippet: "\\sqrt[{{{{n}}}}]{{{{x}}}}",
    fields: [
      { key: "n", label: "次数", defaultValue: "n" },
      { key: "x", label: "被开方项", defaultValue: "x" },
    ],
  },
  {
    display: "\\sum", label: "求和 Σ",
    snippet: "\\sum_{{{{lower}}}}^{{{{upper}}}} ",
    fields: [
      { key: "lower", label: "下限", defaultValue: "i=1" },
      { key: "upper", label: "上限", defaultValue: "n" },
    ],
  },
  {
    display: "\\prod", label: "连乘 Π",
    snippet: "\\prod_{{{{lower}}}}^{{{{upper}}}} ",
    fields: [
      { key: "lower", label: "下限", defaultValue: "i=1" },
      { key: "upper", label: "上限", defaultValue: "n" },
    ],
  },
  {
    display: "\\int", label: "积分 ∫",
    snippet: "\\int_{{{{lower}}}}^{{{{upper}}}} ",
    fields: [
      { key: "lower", label: "下限", defaultValue: "0" },
      { key: "upper", label: "上限", defaultValue: "1" },
    ],
  },
  {
    display: "\\iint", label: "二重积分 ∬",
    snippet: "\\iint_{{{{lower}}}} ",
    fields: [
      { key: "lower", label: "积分域", defaultValue: "D" },
    ],
  },
  {
    display: "\\iiint", label: "三重积分 ∭",
    snippet: "\\iiint_{{{{lower}}}} ",
    fields: [
      { key: "lower", label: "积分域", defaultValue: "V" },
    ],
  },
  {
    display: "\\oint", label: "曲线积分 ∮",
    snippet: "\\oint_{{{{lower}}}} ",
    fields: [
      { key: "lower", label: "路径", defaultValue: "C" },
    ],
  },
  {
    display: "\\lim", label: "极限 lim",
    snippet: "\\lim_{{{{cond}}}} ",
    fields: [{ key: "cond", label: "趋近条件", defaultValue: "x \\to 0" }],
  },
  {
    display: "\\frac{d}{dx}", label: "导数",
    snippet: "\\frac{d {{{{f}}}}}{d {{{{x}}}}}",
    fields: [
      { key: "f", label: "函数", defaultValue: "f" },
      { key: "x", label: "变量", defaultValue: "x" },
    ],
  },
  {
    display: "\\frac{\\partial}{\\partial x}", label: "偏导",
    snippet: "\\frac{\\partial {{{{f}}}}}{\\partial {{{{x}}}}}",
    fields: [
      { key: "f", label: "函数", defaultValue: "f" },
      { key: "x", label: "变量", defaultValue: "x" },
    ],
  },
  {
    display: "\\binom{n}{k}", label: "组合数",
    snippet: "\\binom{{{{n}}}}{{{{k}}}}",
    fields: [
      { key: "n", label: "总数 n", defaultValue: "n" },
      { key: "k", label: "选取 k", defaultValue: "k" },
    ],
  },
  // ── 网格类模板（两步输入：先维度，再填值） ──
  {
    display: "\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}",
    label: "矩阵",
    type: "matrix",
  },
  {
    display: "\\begin{vmatrix}a&b\\\\c&d\\end{vmatrix}",
    label: "行列式",
    type: "determinant",
  },
  // ── 常用函数 ──
  { display: "\\sin", label: "sin", snippet: "\\sin " },
  { display: "\\cos", label: "cos", snippet: "\\cos " },
  { display: "\\tan", label: "tan", snippet: "\\tan " },
  { display: "\\ln", label: "ln", snippet: "\\ln " },
  { display: "\\log", label: "log", snippet: "\\log " },
  { display: "\\exp", label: "exp", snippet: "\\exp " },
  // ── 希腊字母 ──
  { display: "\\alpha", label: "α", snippet: "\\alpha " },
  { display: "\\beta", label: "β", snippet: "\\beta " },
  { display: "\\gamma", label: "γ", snippet: "\\gamma " },
  { display: "\\delta", label: "δ", snippet: "\\delta " },
  { display: "\\epsilon", label: "ε", snippet: "\\epsilon " },
  { display: "\\theta", label: "θ", snippet: "\\theta " },
  { display: "\\lambda", label: "λ", snippet: "\\lambda " },
  { display: "\\mu", label: "μ", snippet: "\\mu " },
  { display: "\\pi", label: "π", snippet: "\\pi " },
  { display: "\\sigma", label: "σ", snippet: "\\sigma " },
  { display: "\\phi", label: "φ", snippet: "\\phi " },
  { display: "\\omega", label: "ω", snippet: "\\omega " },
  { display: "\\Delta", label: "Δ", snippet: "\\Delta " },
  { display: "\\Sigma", label: "Σ", snippet: "\\Sigma " },
  { display: "\\Omega", label: "Ω", snippet: "\\Omega " },
];

function insertText(value) {
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const prev = editor.value;
  editor.value = `${prev.slice(0, start)}${value}${prev.slice(end)}`;
  const nextPos = start + value.length;
  editor.setSelectionRange(nextPos, nextPos);
  editor.focus();
  refreshAll();
}

function wrapSelection(prefix, suffix) {
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const prev = editor.value;
  const selected = prev.slice(start, end) || "text";
  editor.value = `${prev.slice(0, start)}${prefix}${selected}${suffix}${prev.slice(end)}`;
  editor.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
  editor.focus();
  refreshAll();
}

function initMathKeyboard() {
  mathGrid.innerHTML = "";
  mathKeys.forEach((item) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "math-key";
    btn.title = item.label;
    // 用 KaTeX 渲染显示符号，渲染失败则回退到 label 文字
    try {
      btn.innerHTML = window.katex.renderToString(item.display, { throwOnError: true, displayMode: false });
    } catch (_) {
      btn.textContent = item.label;
    }
    btn.addEventListener("click", () => {
      if (item.type && sizedTemplateMeta[item.type]) {
        openMathTemplateDialog(item);
        return;
      }

      if (mathTemplateDialog.open) {
        const activeInput =
          (document.activeElement && mathTemplateFields.contains(document.activeElement) && document.activeElement.tagName === "INPUT")
            ? document.activeElement
            : lastMathInput;

        if (activeInput) {
          // 插入纯 snippet（去掉占位符），有模板的直接插入基础形式
          const plainSnippet = item.fields ? item.snippet.replace(/\{\{\{[^}]+\}\}\}/g, "{}") : item.snippet;
          if (!plainSnippet) {
            return;
          }
          const s = activeInput.selectionStart ?? activeInput.value.length;
          const e = activeInput.selectionEnd ?? activeInput.value.length;
          activeInput.value = `${activeInput.value.slice(0, s)}${plainSnippet}${activeInput.value.slice(e)}`;
          const pos = s + plainSnippet.length;
          activeInput.setSelectionRange(pos, pos);
          activeInput.focus();
          return;
        }
      }

      if (item.fields && item.fields.length) {
        openMathTemplateDialog(item);
        return;
      }
      insertText(item.snippet);
    });
    mathGrid.appendChild(btn);
  });
}

function generateMdTable(rows, cols) {
  const safeRows = Math.max(1, Number(rows));
  const safeCols = Math.max(1, Number(cols));
  const header = Array.from({ length: safeCols }, (_, i) => ` 列${i + 1} `).join("|");
  const sep = Array.from({ length: safeCols }, () => " --- ").join("|");
  const body = Array.from({ length: safeRows - 1 }, () => `|${Array.from({ length: safeCols }, () => " 内容 ").join("|")}|`).join("\n");
  return `|${header}|\n|${sep}|${body ? `\n${body}` : ""}\n`;
}

function makeSafeFileName() {
  const now = new Date();
  const datePart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return `mdAnything-${datePart}`;
}

function downloadText(content, extension, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${makeSafeFileName()}.${extension}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function downloadPdf() {
  const container = document.createElement("div");
  container.className = "pdf-export";
  container.style.width = "210mm";
  container.style.padding = "12mm";
  container.style.background = "#fff";
  container.style.color = "#111827";
  container.style.fontFamily = '"Source Han Sans SC", sans-serif';
  container.innerHTML = md.render(editor.value);
  container.querySelectorAll("pre code").forEach((el) => {
    window.hljs.highlightElement(el);
  });
  document.body.appendChild(container);

  const options = {
    margin: [8, 8, 8, 8],
    filename: `${makeSafeFileName()}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["css", "legacy"] },
  };

  window
    .html2pdf()
    .set(options)
    .from(container)
    .save()
    .finally(() => {
      container.remove();
    });
}

function splitByMultiSpace(line) {
  return line.trim().split(/\s{2,}/g).map((s) => s.trim());
}

function convertTextBlockToTable(block) {
  const lines = block
    .split(/\r?\n/g)
    .map((l) => l.trimEnd())
    .filter((l) => l.trim().length > 0);

  if (lines.length < 2) return null;

  const rows = lines.map(splitByMultiSpace);
  const maxCols = Math.max(...rows.map((r) => r.length));
  if (maxCols < 2) return null;

  const normalized = rows.map((r) => {
    const clone = [...r];
    while (clone.length < maxCols) clone.push("");
    return clone;
  });

  const header = `| ${normalized[0].join(" | ")} |`;
  const sep = `| ${Array.from({ length: maxCols }, () => "---").join(" | ")} |`;
  const body = normalized.slice(1).map((r) => `| ${r.join(" | ")} |`).join("\n");
  return `${header}\n${sep}\n${body}`;
}

function updateLineNumbers(lines) {
  lineNumbers.innerHTML = "";
  guideLayer.innerHTML = "";

  lines.forEach((_, idx) => {
    const numberItem = document.createElement("div");
    numberItem.className = "line-number-item";
    numberItem.textContent = String(idx + 1);
    // 非渲染模式用 CSS 固定高度；渲染模式会由 renderPreview 的 rAF 覆盖
    if (!isRenderEnabled) {
      numberItem.style.height = "";
    }
    lineNumbers.appendChild(numberItem);

    const guideItem = document.createElement("div");
    guideItem.className = "guide-line";
    if (!isRenderEnabled) {
      guideItem.style.height = "";
    }
    guideLayer.appendChild(guideItem);
  });
}

function applyHeightsToLines(heights) {
  const numberItems = Array.from(lineNumbers.querySelectorAll(".line-number-item"));
  const guideItems = Array.from(guideLayer.querySelectorAll(".guide-line"));
  const baseHeight = parseFloat(window.getComputedStyle(editor).lineHeight) || 22.4;

  heights.forEach((h, i) => {
    const nextH = Math.max(baseHeight, h || baseHeight);
    if (numberItems[i]) numberItems[i].style.height = `${nextH}px`;
    if (guideItems[i]) guideItems[i].style.height = `${nextH}px`;
  });
}

function syncEditLineHeights(lines) {
  const width = Math.max(40, editor.clientWidth - 28);
  const style = window.getComputedStyle(editor);
  measureLayer.style.width = `${width}px`;
  measureLayer.style.fontFamily = style.fontFamily;
  measureLayer.style.fontSize = style.fontSize;
  measureLayer.style.lineHeight = style.lineHeight;
  measureLayer.innerHTML = "";

  lines.forEach((line) => {
    const row = document.createElement("div");
    row.style.whiteSpace = "pre-wrap";
    row.style.wordBreak = "break-word";
    row.textContent = line.length ? line : " ";
    measureLayer.appendChild(row);
  });

  const heights = Array.from(measureLayer.children).map((el) => el.getBoundingClientRect().height);
  applyHeightsToLines(heights);
}

function syncRenderLineHeights() {
  const renderLines = Array.from(renderLayer.querySelectorAll(".render-line"));
  const heights = renderLines.map((el) => el.getBoundingClientRect().height);
  applyHeightsToLines(heights);
}

function renderSingleLine(line) {
  if (line.trim().length === 0) {
    return "&nbsp;";
  }
  return md.render(line).trim();
}

function resolveHighlightLanguage(language) {
  if (!window.hljs || !language) return null;
  if (window.hljs.getLanguage(language)) return language;

  const aliasMap = {
    cpp: "c++",
    shell: "bash",
    sh: "bash",
    yml: "yaml",
    text: "plaintext",
  };

  const alias = aliasMap[language];
  if (alias && window.hljs.getLanguage(alias)) {
    return alias;
  }
  return null;
}

function renderPreview(lines) {
  if (!isRenderEnabled) {
    renderLayer.innerHTML = "";
    return;
  }

  let inFence = false;
  let fenceLang = "plaintext";

  renderLayer.innerHTML = lines
    .map((line, idx) => {
      const fenceMatch = line.match(/^\s*```([\w+-]*)\s*$/);
      if (fenceMatch) {
        if (!inFence) {
          inFence = true;
          fenceLang = fenceMatch[1] || "plaintext";
        } else {
          inFence = false;
          fenceLang = "plaintext";
        }
        return `<div class="render-line" data-line="${idx + 1}">&nbsp;</div>`;
      }

      if (inFence) {
        const prevLine = idx > 0 ? lines[idx - 1] : "";
        const nextLine = idx + 1 < lines.length ? lines[idx + 1] : "";
        const prevIsFence = /^\s*```([\w+-]*)\s*$/.test(prevLine);
        const nextIsFence = /^\s*```([\w+-]*)\s*$/.test(nextLine);
        const segmentClass = prevIsFence && nextIsFence
          ? "code-fence-single"
          : prevIsFence
            ? "code-fence-start"
            : nextIsFence
              ? "code-fence-end"
              : "code-fence-middle";

        const resolvedLanguage = resolveHighlightLanguage(fenceLang);
        let highlighted = md.utils.escapeHtml(line);
        try {
          if (line.trim().length > 0) {
            if (resolvedLanguage) {
              highlighted = window.hljs.highlight(line, { language: resolvedLanguage, ignoreIllegals: true }).value;
            } else {
              highlighted = window.hljs.highlightAuto(line).value;
            }
          }
        } catch (_) {
          highlighted = md.utils.escapeHtml(line);
        }

        return `<div class="render-line code-fence-line ${segmentClass}" data-line="${idx + 1}"><code class="hljs language-${fenceLang}">${highlighted || "&nbsp;"}</code></div>`;
      }

      return `<div class="render-line" data-line="${idx + 1}">${renderSingleLine(line)}</div>`;
    })
    .join("");

  renderLayer.querySelectorAll("pre code").forEach((el) => {
    window.hljs.highlightElement(el);
  });

  // 首次排版后同步，再延迟一次用于字体/公式延迟布局
  requestAnimationFrame(() => {
    syncRenderLineHeights();
    requestAnimationFrame(() => {
      syncRenderLineHeights();
    });
    setTimeout(syncRenderLineHeights, 80);
  });
}

function getMathModeAtCursor(text, cursor) {
  const part = text.slice(0, cursor);
  let blockOpen = false;
  let inlineOpen = false;

  for (let i = 0; i < part.length; i += 1) {
    const ch = part[i];

    if (ch === "\\") {
      i += 1;
      continue;
    }

    if (ch === "\n") {
      inlineOpen = false;
      continue;
    }

    if (part.slice(i, i + 2) === "$$") {
      blockOpen = !blockOpen;
      inlineOpen = false;
      i += 1;
      continue;
    }

    if (ch === "$" && !blockOpen) {
      inlineOpen = !inlineOpen;
    }
  }

  if (blockOpen) return "block";
  if (inlineOpen) return "inline";
  return null;
}

function setRenderMode(enabled) {
  isRenderEnabled = enabled;
  editorWrap.classList.toggle("render-on", enabled);

  if (enabled) {
    setMathKeyboardOpen(false);
    // 切换到渲染模式时，同步渲染层滚动位置
    renderLayer.scrollTop = editor.scrollTop;
  }

  refreshAll();
}

function toggleMathKeyboard() {
  if (isRenderEnabled) {
    setMathKeyboardOpen(false);
    return;
  }

  if (mathTemplateDialog.open) {
    setMathKeyboardOpen(true);
    return;
  }

  if (document.activeElement !== editor) {
    setMathKeyboardOpen(false);
    return;
  }

  const mode = getMathModeAtCursor(editor.value, editor.selectionStart);
  if (mode) {
    setMathKeyboardOpen(true);
  } else {
    setMathKeyboardOpen(false);
  }
}

function buildMathSnippetFromTemplate(item, values) {
  let result = item.snippet;
  item.fields.forEach((field) => {
    // 占位符使用 {{{key}}}，与 LaTeX 大括号结构可共存
    const token = `{{{${field.key}}}}`;
    result = result.replaceAll(token, values[field.key] ?? field.defaultValue ?? "");
  });
  return result;
}

function createTemplateFields(fields) {
  mathTemplateFields.classList.remove("grid-mode");
  mathTemplateFields.innerHTML = "";
  fields.forEach((field) => {
    const label = document.createElement("label");
    label.textContent = field.label;

    const input = document.createElement("input");
    input.name = field.key;
    input.value = field.defaultValue ?? "";
    input.required = true;
    input.addEventListener("focus", () => {
      lastMathInput = input;
    });

    label.appendChild(input);
    mathTemplateFields.appendChild(label);
  });

  const firstInput = mathTemplateFields.querySelector("input");
  if (firstInput) {
    firstInput.focus();
    lastMathInput = firstInput;
  }
}

function createGridTemplateFields(rows, cols, prefix) {
  mathTemplateFields.innerHTML = "";
  mathTemplateFields.classList.add("grid-mode");

  const grid = document.createElement("div");
  grid.className = "template-grid";
  grid.style.gridTemplateColumns = `repeat(${cols}, minmax(76px, 1fr))`;

  for (let r = 1; r <= rows; r += 1) {
    for (let c = 1; c <= cols; c += 1) {
      const input = document.createElement("input");
      input.name = `g_${r}_${c}`;
      input.value = "0";
      input.required = true;
      input.placeholder = `${prefix}(${r},${c})`;
      input.setAttribute("aria-label", `${prefix}(${r},${c})`);
      input.addEventListener("focus", () => {
        lastMathInput = input;
      });
      grid.appendChild(input);
    }
  }

  mathTemplateFields.appendChild(grid);
  const firstInput = grid.querySelector("input");
  if (firstInput) {
    firstInput.focus();
    lastMathInput = firstInput;
  }
}

const sizedTemplateMeta = {
  matrix: {
    title: "矩阵模板",
    env: "pmatrix",
    cellPrefix: "a",
  },
  determinant: {
    title: "行列式模板",
    env: "vmatrix",
    cellPrefix: "d",
  },
};

function buildGridLatex(rows, cols, values, env) {
  const body = [];
  for (let r = 1; r <= rows; r += 1) {
    const row = [];
    for (let c = 1; c <= cols; c += 1) {
      const key = `g_${r}_${c}`;
      row.push(values[key] && values[key].length ? values[key] : "0");
    }
    body.push(row.join(" & "));
  }
  return `\\begin{${env}} ${body.join(" \\\\ ")} \\end{${env}}`;
}

function openSizedTemplateSizeStep(type) {
  const meta = sizedTemplateMeta[type];
  if (!meta) return;

  pendingMathTemplate = { type, stage: "size" };
  mathTemplateTitle.textContent = `${meta.title} - 先选维度`;
  createTemplateFields([
    { key: "rows", label: "行数 (1-6)", defaultValue: "2" },
    { key: "cols", label: "列数 (1-6)", defaultValue: "2" },
  ]);
}

function openSizedTemplateValueStep(type, rows, cols) {
  const meta = sizedTemplateMeta[type];
  if (!meta) return;

  pendingMathTemplate = { type, stage: "values", rows, cols };
  mathTemplateTitle.textContent = `${meta.title} - ${rows}x${cols} 填值`;
  createGridTemplateFields(rows, cols, meta.cellPrefix);
}

function openMathTemplateDialog(item) {
  if (item.type && sizedTemplateMeta[item.type]) {
    openSizedTemplateSizeStep(item.type);
  } else {
    pendingMathTemplate = item;
    mathTemplateTitle.textContent = `${item.label} 模板`;
    createTemplateFields(item.fields || []);
  }

  mathTemplateDialog.showModal();
  toggleMathKeyboard();
}

function toggleLinePrefix(prefix) {
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const text = editor.value;

  const lineStart = text.lastIndexOf("\n", start - 1) + 1;
  const afterSelection = text.slice(end);
  const nextBreak = afterSelection.indexOf("\n");
  const lineEnd = nextBreak === -1 ? text.length : end + nextBreak;
  const segment = text.slice(lineStart, lineEnd);
  const lines = segment.split("\n");

  const shouldRemove = lines.every((line) => line.startsWith(prefix));
  const replaced = lines
    .map((line) => {
      if (shouldRemove) {
        return line.startsWith(prefix) ? line.slice(prefix.length) : line;
      }
      return `${prefix}${line}`;
    })
    .join("\n");

  editor.setRangeText(replaced, lineStart, lineEnd, "select");
  refreshAll();
}

function closeMathOnEnter(e) {
  if (e.key !== "Enter") return;
  if (isRenderEnabled) return;

  const cursor = editor.selectionStart;
  const value = editor.value;
  const mode = getMathModeAtCursor(value, cursor);
  if (!mode) return;

  const rightPart = value.slice(cursor);
  if (/^\s*\$\$/.test(rightPart) || /^\s*\$/.test(rightPart)) {
    return;
  }

  e.preventDefault();
  const insertion = mode === "block" ? "$$\n" : "$\n";
  editor.setRangeText(insertion, cursor, cursor, "end");
  refreshAll();
}

function openLanguageDialog(trigger) {
  pendingCodeTrigger = trigger;
  languageDialog.showModal();
}

function applyLanguageChoice(language) {
  const cursor = editor.selectionStart;
  const before = editor.value.slice(0, cursor);
  const after = editor.value.slice(cursor);

  if (pendingCodeTrigger === "fence") {
    const token = "```";
    if (before.endsWith(token)) {
      const cleanBefore = before.slice(0, -token.length);
      const block = `\`\`\`${language}\n\n\`\`\`\n`;
      editor.value = `${cleanBefore}${block}${after}`;
      const pos = cleanBefore.length + language.length + 5;
      editor.setSelectionRange(pos, pos);
    }
  } else if (pendingCodeTrigger === "toolbar-fence") {
    const block = `\`\`\`${language}\n\n\`\`\`\n`;
    editor.setRangeText(block, cursor, cursor, "end");
    const pos = cursor + language.length + 5;
    editor.setSelectionRange(pos, pos);
  }

  pendingCodeTrigger = null;
  refreshAll();
}

function detectCodeTrigger() {
  const cursor = editor.selectionStart;
  const before = editor.value.slice(0, cursor);
  if (before.endsWith("```")) {
    openLanguageDialog("fence");
  }
}

function refreshAll() {
  const lines = editor.value.split("\n");
  updateLineNumbers(lines);

  if (isRenderEnabled) {
    renderPreview(lines);
  } else {
    renderLayer.innerHTML = "";
    syncEditLineHeights(lines);
  }

  toggleMathKeyboard();
  
  // 同步滚动位置
  if (isRenderEnabled) {
    lineNumbers.scrollTop = renderLayer.scrollTop;
    guideLayer.scrollTop = renderLayer.scrollTop;
  } else {
    lineNumbers.scrollTop = editor.scrollTop;
    guideLayer.scrollTop = editor.scrollTop;
  }

  lastValue = editor.value;
}

function bindToolbarActions() {
  document.querySelectorAll(".tool-btn[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-action");
      switch (action) {
        case "bold":
          wrapSelection("**", "**");
          break;
        case "heading-1":
          toggleLinePrefix("# ");
          break;
        case "heading-2":
          toggleLinePrefix("## ");
          break;
        case "heading-3":
          toggleLinePrefix("### ");
          break;
        case "heading-4":
          toggleLinePrefix("#### ");
          break;
        case "italic":
          wrapSelection("*", "*");
          break;
        case "underline":
          wrapSelection("<u>", "</u>");
          break;
        case "strike":
          wrapSelection("~~", "~~");
          break;
        case "sup":
          wrapSelection("<sup>", "</sup>");
          break;
        case "sub":
          wrapSelection("<sub>", "</sub>");
          break;
        case "inline-code":
          wrapSelection("`", "`");
          break;
        case "code-block":
          openLanguageDialog("toolbar-fence");
          break;
        case "insert-inline-math":
          insertText("$ $");
          editor.setSelectionRange(editor.selectionStart - 2, editor.selectionStart - 2);
          break;
        case "insert-block-math":
          insertText("$$\n\n$$\n");
          editor.setSelectionRange(editor.selectionStart - 4, editor.selectionStart - 4);
          break;
        default:
          break;
      }
    });
  });
}

editor.addEventListener("input", () => {
  const prevLength = lastValue.length;
  refreshAll();
  if (!isRenderEnabled && editor.value.length >= prevLength) {
    detectCodeTrigger();
  }
});

editor.addEventListener("click", toggleMathKeyboard);
editor.addEventListener("keyup", toggleMathKeyboard);
editor.addEventListener("blur", (e) => {
  const next = e.relatedTarget;
  // 如果焦点移到数学键盘、对话框或对话框内的元素，保持键盘显示
  if (next && (mathKeyboard.contains(next) || mathTemplateDialog.contains(next) || next.closest("dialog"))) {
    return;
  }
  setMathKeyboardOpen(false);
});

editor.addEventListener("scroll", () => {
  lineNumbers.scrollTop = editor.scrollTop;
  guideLayer.scrollTop = editor.scrollTop;
});

renderLayer.addEventListener("scroll", () => {
  if (!isRenderEnabled) return;
  lineNumbers.scrollTop = renderLayer.scrollTop;
  guideLayer.scrollTop = renderLayer.scrollTop;
});

editor.addEventListener("keydown", (e) => {
  closeMathOnEnter(e);
  if (e.defaultPrevented) {
    return;
  }

  const isMac = navigator.platform.toUpperCase().includes("MAC");
  const mod = isMac ? e.metaKey : e.ctrlKey;
  if (!mod) return;

  const key = e.key.toLowerCase();
  if (key === "k" && e.shiftKey) {
    e.preventDefault();
    insertText("```plaintext\n\n```\n");
  } else if (key === "x" && e.shiftKey) {
    e.preventDefault();
    wrapSelection("~~", "~~");
  } else if (key === "u" && e.shiftKey) {
    e.preventDefault();
    wrapSelection("<u>", "</u>");
  } else if (key === "b") {
    e.preventDefault();
    wrapSelection("**", "**");
  } else if (key === "i") {
    e.preventDefault();
    wrapSelection("*", "*");
  } else if (key === "k") {
    e.preventDefault();
    wrapSelection("`", "`");
  } else if (key === "u") {
    e.preventDefault();
    wrapSelection("<sup>", "</sup>");
  } else if (key === "j") {
    e.preventDefault();
    wrapSelection("<sub>", "</sub>");
  }
});

document.getElementById("openTableBuilder").addEventListener("click", () => {
  tableDialog.showModal();
});

tableCancel.addEventListener("click", () => tableDialog.close());
tableForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const table = generateMdTable(tableRows.value, tableCols.value);
  insertText(table);
  tableDialog.close();
});

document.getElementById("convertToTable").addEventListener("click", () => {
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const target = start !== end ? editor.value.slice(start, end) : editor.value;
  const converted = convertTextBlockToTable(target);

  if (!converted) {
    window.alert("未识别到可转化的文本结构。请确认列之间有至少两个空格，并且至少有两行。");
    return;
  }

  if (start !== end) {
    editor.setRangeText(converted, start, end, "select");
  } else {
    editor.value = converted;
    editor.setSelectionRange(0, converted.length);
  }

  refreshAll();
});

languageCancel.addEventListener("click", () => {
  pendingCodeTrigger = null;
  languageDialog.close();
});

languageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  applyLanguageChoice(languageSelect.value);
  languageDialog.close();
});

mathTemplateCancel.addEventListener("click", () => {
  pendingMathTemplate = null;
  lastMathInput = null;
  mathTemplateDialog.close();
  editor.focus();
  toggleMathKeyboard();
});

mathTemplateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!pendingMathTemplate) {
    mathTemplateDialog.close();
    return;
  }

  if (pendingMathTemplate.stage === "size" && sizedTemplateMeta[pendingMathTemplate.type]) {
    const rowsInput = mathTemplateFields.querySelector('input[name="rows"]');
    const colsInput = mathTemplateFields.querySelector('input[name="cols"]');
    const rows = Math.min(6, Math.max(1, Number(rowsInput ? rowsInput.value : 2) || 2));
    const cols = Math.min(6, Math.max(1, Number(colsInput ? colsInput.value : 2) || 2));
    openSizedTemplateValueStep(pendingMathTemplate.type, rows, cols);
    toggleMathKeyboard();
    return;
  }

  const values = {};
  if (pendingMathTemplate.fields && pendingMathTemplate.fields.length) {
    pendingMathTemplate.fields.forEach((field) => {
      const input = mathTemplateFields.querySelector(`input[name=\"${field.key}\"]`);
      values[field.key] = input ? input.value.trim() : field.defaultValue ?? "";
    });
  } else if (pendingMathTemplate.stage === "values" && sizedTemplateMeta[pendingMathTemplate.type]) {
    const gridInputs = mathTemplateFields.querySelectorAll("input[name^=\"g_\"]");
    gridInputs.forEach((input) => {
      values[input.name] = input.value.trim();
    });
  }

  let snippet = "";
  if (pendingMathTemplate.stage === "values" && sizedTemplateMeta[pendingMathTemplate.type]) {
    const meta = sizedTemplateMeta[pendingMathTemplate.type];
    snippet = buildGridLatex(pendingMathTemplate.rows, pendingMathTemplate.cols, values, meta.env);
  } else {
    snippet = buildMathSnippetFromTemplate(pendingMathTemplate, values);
  }

  insertText(snippet);
  pendingMathTemplate = null;
  lastMathInput = null;
  mathTemplateDialog.close();
  editor.focus();
  toggleMathKeyboard();
});

downloadBtn.addEventListener("click", () => {
  downloadDialog.showModal();
});

downloadCancel.addEventListener("click", () => {
  downloadDialog.close();
});

downloadMdBtn.addEventListener("click", () => {
  downloadText(editor.value, "md", "text/markdown;charset=utf-8");
  downloadDialog.close();
});

downloadTxtBtn.addEventListener("click", () => {
  downloadText(editor.value, "txt", "text/plain;charset=utf-8");
  downloadDialog.close();
});

downloadPdfBtn.addEventListener("click", () => {
  downloadDialog.close();
  downloadPdf();
});

lineGuideToggle.addEventListener("change", () => {
  document.body.classList.toggle("show-line-guides", lineGuideToggle.checked);
  refreshAll();
});

renderToggle.addEventListener("change", () => {
  setRenderMode(renderToggle.checked);
});

window.addEventListener("resize", () => {
  if (mathKeyboard.classList.contains("open")) {
    setMathKeyboardOpen(true);
  }
  refreshAll();
});

bindToolbarActions();
initMathKeyboard();
setRenderMode(false);
refreshAll();
