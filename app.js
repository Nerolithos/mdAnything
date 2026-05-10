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
const latexHintToggle = document.getElementById("latexHintToggle");
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
const customMathBtn = document.getElementById("customMathBtn");
const customMathDialog = document.getElementById("customMathDialog");
const customMathForm = document.getElementById("customMathForm");
const customMathLabelInput = document.getElementById("customMathLabelInput");
const customMathDisplayInput = document.getElementById("customMathDisplayInput");
const customMathPreview = document.getElementById("customMathPreview");
const customMathStatus = document.getElementById("customMathStatus");
const customMathCancel = document.getElementById("customMathCancel");
const customMathSave = document.getElementById("customMathSave");
const openLatexCompat = document.getElementById("openLatexCompat");
const latexCompatDialog = document.getElementById("latexCompatDialog");
const latexCompatSummary = document.getElementById("latexCompatSummary");
const latexCompatList = document.getElementById("latexCompatList");
const latexCompatClose = document.getElementById("latexCompatClose");
const mathKeyboard = document.getElementById("mathKeyboard");
const mathGrid = document.getElementById("mathGrid");
const editorWrap = document.querySelector(".editor-wrap");
const welcomeScreen = document.getElementById("welcomeScreen");
const welcomeRain = document.getElementById("welcomeRain");
const welcomeTagline = document.getElementById("welcomeTagline");
const langEnBtn = document.getElementById("langEnBtn");
const langZhBtn = document.getElementById("langZhBtn");
const onboardingOverlay = document.getElementById("onboardingOverlay");
const onboardingCard = document.getElementById("onboardingCard");
const onboardingStep = document.getElementById("onboardingStep");
const onboardingTitle = document.getElementById("onboardingTitle");
const onboardingDesc = document.getElementById("onboardingDesc");
const onboardingNextBtn = document.getElementById("onboardingNextBtn");
const onboardingRenderTarget = document.querySelector('[data-onboarding-target="render-switch"]');
const onboardingToolbarTarget = document.querySelector('[data-onboarding-target="toolbar-panel"]');
const compatPass = document.getElementById("compatPass");
const compatPartial = document.getElementById("compatPartial");
const compatRisk = document.getElementById("compatRisk");
const refreshRenderBtn = document.getElementById("refreshRenderBtn");
const renderCaret = document.createElement("span");
renderCaret.className = "render-caret";

function ensureRenderCaretAttached() {
  if (!renderLayer.contains(renderCaret)) {
    renderLayer.appendChild(renderCaret);
  }
}

ensureRenderCaretAttached();

const CUSTOM_MATH_STORAGE_KEY = "mdAnything.customMathItems";
const FIRST_OPEN_STORAGE_KEY = "mdAnything.firstOpenDone";
const LOCALE_STORAGE_KEY = "mdAnything.locale";
const LATEX_HINT_STORAGE_KEY = "mdAnything.latexHints";
const DEFAULT_STARTER_CONTENT = [
  "# This is a Markdown helper editor",
  "",
  "```python",
  "print(\"You can write in-text code blocks.\")",
  "```",
  "",
  "$$\\begin{pmatrix} OR & EVEN & HELP \\\\ YOU & WRITE & LATEX \\end{pmatrix}$$",
  "",
  "**Now try for yourself!**",
  "",
  "$",
].join("\n");

const I18N = {
  zh: {
    welcomeTagline: "Markdown Smart Editor",
    renderToggle: "开启渲染",
    latexHintToggle: "兼容提示",
    lineGuideToggle: "行辅助线",
    compatPass: "通过",
    compatPartial: "部分",
    compatRisk: "报错",
    download: "下载",
    tools: "工具",
    format: "格式",
    headingMenu: "标题",
    h1: "# 一级标题",
    h2: "## 二级标题",
    h3: "### 三级标题",
    h4: "#### 四级标题",
    bold: "粗体",
    italic: "斜体",
    underline: "下划线",
    strike: "删除线",
    sup: "上角标",
    sub: "下角标",
    codeMath: "代码与数学",
    inlineCode: "行内代码",
    codeBlock: "代码块",
    insertInlineMath: "插入 $...$",
    insertBlockMath: "插入 $$...$$",
    links: "链接",
    linkMenu: "链接",
    webLink: "网页链接",
    imageLink: "图片链接",
    fileLink: "文件链接",
    clipboardImageLink: "剪贴板图片链接",
    table: "表格",
    buildTable: "建表",
    textToTable: "文本转 MD 表格",
    latexSection: "LaTeX",
    latexCompatBtn: "兼容检查",
    latexCompatTitle: "LaTeX 兼容检查",
    latexCompatClose: "关闭",
    latexCompatSummaryOk: "未发现明显兼容性风险。",
    latexCompatSummaryIssues: "发现 {count} 项兼容性风险，建议处理后再发布。",
    latexIssueUnmatchedDollar: "检测到不成对的 $ 定界符，部分渲染器会直接跳过该公式。建议检查转义与闭合。",
    latexIssueTableMath: "表格中的公式在 GitHub / 部分 Markdown 渲染链中经常失败。建议改成表格外块级公式，或预渲染为图片。",
    latexIssueParenDelimiters: "检测到 \\( ... \\) 或 \\[ ... \\] 定界符；部分 markdown-it 配置默认不识别。建议统一改为 $...$ 与 $$...$$。",
    latexIssueAlignEnv: "检测到 align/aligned 环境，KaTeX 与 GitHub 渲染策略可能不同。建议用 $$...$$ 包裹并在目标平台先验证。",
    latexIssueCodeFenceMath: "代码块中出现数学定界符，发布后通常不会按公式渲染。建议移出代码块。",
    latexIssueBlockSpacing: "检测到 $$ 块公式与正文紧贴，部分引擎会误判。建议在公式前后保留空行。",
    latexIssueEngineHint: "引擎提示：GitHub（MathJax）与本地 markdown-it-texmath/KaTeX 语法覆盖不同，发布前请做双端预览。",
    placeholder: "开始输入 Markdown...\n\n输入 $$ 会自动进入数学模式，下一次 $$ 结束。\n输入 $ 进入单行数学模式，下一次 $ 结束。\n输入 ``` 会触发语言选择。",
    mathKeyboardTitle: "数学符号键盘",
    customMath: "自定义",
    customMathTitleTip: "新增一个自定义数学按钮",
    tableDialogTitle: "创建表格",
    tableRows: "行数",
    tableCols: "列数",
    cancel: "取消",
    insert: "插入",
    langDialogTitle: "选择代码语言",
    langDialogLabel: "语言",
    confirm: "确定",
    mathTemplateTitle: "数学模板",
    downloadDialogTitle: "选择下载格式",
    downloadMd: "下载 .md",
    downloadTxt: "下载 .txt",
    downloadPdf: "下载 .pdf",
    customMathDialogTitle: "自定义数学按钮",
    customMathLabel: "按钮标题",
    customMathPreviewExpr: "预览表达式 (KaTeX)",
    save: "保存",
    onboarding1Title: "步骤 1 / 3",
    onboarding1Heading: "右上角开关可控制预览",
    onboarding1Desc: "在这里勾选“开启渲染”即可切换渲染预览。",
    onboarding2Title: "步骤 2 / 3",
    onboarding2Heading: "进入 LaTeX 会自动弹出数学键盘",
    onboarding2Desc: "当光标处在 $...$ 或 $$...$$ 数学模式时，下方数学键盘会自动展开。",
    onboarding3Title: "步骤 3 / 3",
    onboarding3Heading: "左侧工具栏支持按钮与快捷键",
    onboarding3Desc: "点击左侧按钮可快速插入格式，也可以把鼠标停在按钮上查看快捷键提示。",
    next: "下一步",
    startUsing: "开始使用",
    customLabelDefault: "自定义",
    expressionEmpty: "表达式不能为空。",
    expressionOk: "表达式合法，可保存。",
    expressionInvalid: "表达式无效：{message}",
    previewFailed: "预览失败",
    clipboardDenied: "无法读取剪贴板，请先授予剪贴板权限，或先手动粘贴后再使用该功能。",
    clipboardEmpty: "剪贴板为空，无法生成图片链接。",
    tableColumn: "列",
    tableCell: "内容",
    linkTextDefault: "链接文本",
    imageTextDefault: "图片",
    convertTableFailed: "未识别到可转化的文本结构。请确认列之间有至少两个空格，并且至少有两行。",
    matrixTemplate: "矩阵模板",
    determinantTemplate: "行列式模板",
    chooseSize: "先选维度",
    fillValues: "填值",
    rows: "行数 (1-6)",
    cols: "列数 (1-6)",
    templateSuffix: "模板",
  },
  en: {
    welcomeTagline: "Markdown Helper Editor",
    renderToggle: "Render Preview",
    latexHintToggle: "Compat Hints",
    lineGuideToggle: "Line Guides",
    compatPass: "Pass",
    compatPartial: "Partial",
    compatRisk: "Risk",
    download: "Download",
    tools: "Tools",
    format: "Formatting",
    headingMenu: "Headings",
    h1: "# Heading 1",
    h2: "## Heading 2",
    h3: "### Heading 3",
    h4: "#### Heading 4",
    bold: "Bold",
    italic: "Italic",
    underline: "Underline",
    strike: "Strikethrough",
    sup: "Superscript",
    sub: "Subscript",
    codeMath: "Code & Math",
    inlineCode: "Inline Code",
    codeBlock: "Code Block",
    insertInlineMath: "Insert $...$",
    insertBlockMath: "Insert $$...$$",
    links: "Links",
    linkMenu: "Links",
    webLink: "Web Link",
    imageLink: "Image Link",
    fileLink: "File Link",
    clipboardImageLink: "Clipboard Image Link",
    table: "Table",
    buildTable: "Build Table",
    textToTable: "Text to MD Table",
    latexSection: "LaTeX",
    latexCompatBtn: "Compatibility Check",
    latexCompatTitle: "LaTeX Compatibility Check",
    latexCompatClose: "Close",
    latexCompatSummaryOk: "No obvious compatibility risks were detected.",
    latexCompatSummaryIssues: "Detected {count} compatibility risks. Fix these before publishing.",
    latexIssueUnmatchedDollar: "Unmatched $ delimiters detected. Some renderers skip these formulas entirely. Check escaping and closing delimiters.",
    latexIssueTableMath: "Math inside tables often fails in GitHub or some Markdown pipelines. Consider moving formulas outside tables or pre-rendering as images.",
    latexIssueParenDelimiters: "Found \\( ... \\) or \\[ ... \\] delimiters. Some markdown-it setups do not parse them by default. Prefer $...$ and $$...$$.",
    latexIssueAlignEnv: "Detected align/aligned environments; KaTeX and GitHub may behave differently. Wrap with $$...$$ and verify on target platforms.",
    latexIssueCodeFenceMath: "Math delimiters were found inside code fences, where formulas usually won't render. Move them outside the code block.",
    latexIssueBlockSpacing: "Detected $$ blocks adjacent to normal text. Some engines mis-parse this. Keep a blank line before and after block math.",
    latexIssueEngineHint: "Engine hint: GitHub (MathJax) and local markdown-it-texmath/KaTeX do not have identical syntax coverage. Always preview in both.",
    placeholder: "Start typing Markdown...\n\nTyping $$ enters block math mode and the next $$ closes it.\nTyping $ enters inline math mode and the next $ closes it.\nTyping ``` opens language picker.",
    mathKeyboardTitle: "Math Symbol Keyboard",
    customMath: "Custom",
    customMathTitleTip: "Add a custom math button",
    tableDialogTitle: "Create Table",
    tableRows: "Rows",
    tableCols: "Columns",
    cancel: "Cancel",
    insert: "Insert",
    langDialogTitle: "Select Code Language",
    langDialogLabel: "Language",
    confirm: "Confirm",
    mathTemplateTitle: "Math Template",
    downloadDialogTitle: "Choose Download Format",
    downloadMd: "Download .md",
    downloadTxt: "Download .txt",
    downloadPdf: "Download .pdf",
    customMathDialogTitle: "Custom Math Button",
    customMathLabel: "Button Label",
    customMathPreviewExpr: "Preview Expression (KaTeX)",
    save: "Save",
    onboarding1Title: "Step 1 / 3",
    onboarding1Heading: "Use the top-right switch for preview",
    onboarding1Desc: "Check Render Preview here to switch into rendered mode.",
    onboarding2Title: "Step 2 / 3",
    onboarding2Heading: "Math keyboard opens automatically in LaTeX mode",
    onboarding2Desc: "When your cursor is inside $...$ or $$...$$, the math keyboard at the bottom opens automatically.",
    onboarding3Title: "Step 3 / 3",
    onboarding3Heading: "Toolbar supports buttons and shortcuts",
    onboarding3Desc: "Click tools on the left to insert quickly, and hover over buttons to see shortcuts.",
    next: "Next",
    startUsing: "Start Using",
    customLabelDefault: "Custom",
    expressionEmpty: "Expression cannot be empty.",
    expressionOk: "Expression is valid and ready to save.",
    expressionInvalid: "Invalid expression: {message}",
    previewFailed: "Preview failed",
    clipboardDenied: "Clipboard access failed. Please grant permission, or paste manually first.",
    clipboardEmpty: "Clipboard is empty. Unable to generate an image link.",
    tableColumn: "Col",
    tableCell: "Cell",
    linkTextDefault: "link text",
    imageTextDefault: "image",
    convertTableFailed: "No convertible table structure was detected. Make sure columns are separated by at least two spaces and that you have at least two rows.",
    matrixTemplate: "Matrix Template",
    determinantTemplate: "Determinant Template",
    chooseSize: "Choose size first",
    fillValues: "Fill values",
    rows: "Rows (1-6)",
    cols: "Columns (1-6)",
    templateSuffix: "Template",
  },
};

let lastValue = "";
let pendingCodeTrigger = null;
let pendingMathTemplate = null;
let isRenderEnabled = false;
let lastMathInput = null;
let customMathItems = [];
let onboardingIndex = -1;
let forceMathKeyboardOpen = false;
let currentLanguage = window.localStorage.getItem(LOCALE_STORAGE_KEY) === "en" ? "en" : "zh";
const welcomeRainState = {
  initialized: false,
  running: false,
  rafId: 0,
  lastTs: null,
  canvasW: 0,
  canvasH: 0,
  particles: [],
  logo: null,
  logoReady: false,
  dpr: 1,
  ctx: null,
};

const LINE_RESTORE_ON_LEAVE_MS = 300;
let activeSuspendRange = null;
const leaveRestoreTimers = new Map();
let isLatexHintEnabled = true;
let activeRenderCaretLine = -1;
let isAdjustingEditorScroll = false;
let isAdjustingRenderScroll = false;
let renderCaretUpdateRafId = 0;
let previewCaretOffsetY = 0;
let caretRealignRafId = 0;
let caretRealignUntilTs = 0;

function clampEditorScrollTop(scrollTop) {
  const max = Math.max(0, editor.scrollHeight - editor.clientHeight);
  return Math.max(0, Math.min(max, scrollTop));
}

function setPreviewCaretOffset(offsetY) {
  const safe = Number.isFinite(offsetY) ? offsetY : 0;
  const normalized = Math.abs(safe) < 0.5 ? 0 : safe;
  if (Math.abs(previewCaretOffsetY - normalized) < 0.5) return;
  previewCaretOffsetY = normalized;
  editor.style.setProperty("--preview-caret-offset", `${previewCaretOffsetY}px`);
}

function resetPreviewCaretOffset() {
  setPreviewCaretOffset(0);
}

function stopCaretRealignChecks() {
  caretRealignUntilTs = 0;
  if (!caretRealignRafId) return;
  window.cancelAnimationFrame(caretRealignRafId);
  caretRealignRafId = 0;
}

function ensureCaretAlignmentNow() {
  if (!isRenderEnabled) return;
  if (activeRenderCaretLine < 0) return;
  if (document.activeElement !== editor) return;
  alignEditorCaretToRenderedLine(activeRenderCaretLine);
}

function hideRenderCaret() {
  renderCaret.style.visibility = "hidden";
}

function updateRenderCaretNow() {
  if (!isRenderEnabled || document.activeElement !== editor) {
    hideRenderCaret();
    return;
  }

  if (editor.selectionStart !== editor.selectionEnd) {
    hideRenderCaret();
    return;
  }

  const lineIdx = getCurrentCursorLineIndex();
  const lines = editor.value.split("\n");
  const safeLine = Math.max(0, Math.min(lineIdx, lines.length - 1));
  const row = renderLayer.querySelector(`.render-line[data-line="${safeLine + 1}"]`);
  if (!row) {
    hideRenderCaret();
    return;
  }

  const lineText = lines[safeLine] || "";
  const lineStart = getLineStartOffset(safeLine);
  const col = Math.max(0, Math.min(lineText.length, editor.selectionStart - lineStart));

  const editorStyle = window.getComputedStyle(editor);
  const leftPad = parseFloat(editorStyle.paddingLeft) || 0;
  const rightPad = parseFloat(editorStyle.paddingRight) || 0;
  const rowWidth = Math.max(1, Math.floor(editor.clientWidth - leftPad - rightPad));
  const wrappedPos = measureWrappedLineCaretPos(lineText, col, rowWidth, editorStyle);
  const x = leftPad + wrappedPos.x;

  const y = row.offsetTop + wrappedPos.y + 2;
  const lineHeight = parseFloat(editorStyle.lineHeight) || 22;

  renderCaret.style.transform = `translate(${Math.max(0, x)}px, ${Math.max(0, y)}px)`;
  renderCaret.style.height = `${Math.max(12, lineHeight * 0.9)}px`;
  renderCaret.style.visibility = "visible";
}

function updateRenderCaret() {
  if (renderCaretUpdateRafId) return;
  renderCaretUpdateRafId = window.requestAnimationFrame(() => {
    renderCaretUpdateRafId = 0;
    updateRenderCaretNow();
  });
}

function scheduleCaretRealignChecks(durationMs = 420) {
  if (!isRenderEnabled || activeRenderCaretLine < 0) return;
  const now = (window.performance && typeof window.performance.now === "function")
    ? window.performance.now()
    : Date.now();
  caretRealignUntilTs = Math.max(caretRealignUntilTs, now + durationMs);
  if (caretRealignRafId) return;

  const tick = (ts) => {
    caretRealignRafId = 0;
    ensureCaretAlignmentNow();

    if (!isRenderEnabled || activeRenderCaretLine < 0 || document.activeElement !== editor) {
      caretRealignUntilTs = 0;
      return;
    }

    if (ts < caretRealignUntilTs) {
      caretRealignRafId = window.requestAnimationFrame(tick);
      return;
    }

    caretRealignUntilTs = 0;
  };

  caretRealignRafId = window.requestAnimationFrame(tick);
}

function getCurrentCursorLineIndex() {
  return editor.value.slice(0, editor.selectionStart).split("\n").length - 1;
}

function getLineEndOffset(lineIdx) {
  const lines = editor.value.split("\n");
  let pos = 0;
  for (let i = 0; i < lines.length; i += 1) {
    const len = lines[i].length;
    if (i === lineIdx) {
      return pos + len;
    }
    pos += len + 1;
  }
  return editor.value.length;
}

function getLineStartOffset(lineIdx) {
  const lines = editor.value.split("\n");
  const safeLine = Math.max(0, Math.min(lineIdx, lines.length - 1));
  let pos = 0;
  for (let i = 0; i < safeLine; i += 1) {
    pos += lines[i].length + 1;
  }
  return pos;
}

function setCursorToLineEnd(lineIdx) {
  const lines = editor.value.split("\n");
  const safeLine = Math.max(0, Math.min(lineIdx, lines.length - 1));
  const end = getLineEndOffset(safeLine);
  editor.focus();
  editor.setSelectionRange(end, end);
}

function setupLineMeasureLayer(style) {
  caretMeasureLayer.style.whiteSpace = "pre";
  caretMeasureLayer.style.wordBreak = "normal";
  caretMeasureLayer.style.overflowWrap = "normal";
  caretMeasureLayer.style.padding = "0";
  caretMeasureLayer.style.border = "0";
  caretMeasureLayer.style.width = "auto";
  caretMeasureLayer.style.fontFamily = style.fontFamily;
  caretMeasureLayer.style.fontSize = style.fontSize;
  caretMeasureLayer.style.lineHeight = style.lineHeight;
  caretMeasureLayer.style.fontWeight = style.fontWeight;
  caretMeasureLayer.style.fontStyle = style.fontStyle;
  caretMeasureLayer.style.letterSpacing = style.letterSpacing;
  caretMeasureLayer.style.wordSpacing = style.wordSpacing;
  caretMeasureLayer.style.textTransform = style.textTransform;
  caretMeasureLayer.style.tabSize = style.tabSize;
}

function measureLinePrefixX(lineText, col) {
  const prefix = col > 0 ? lineText.slice(0, col) : "";
  caretMeasureLayer.textContent = prefix;
  const marker = document.createElement("span");
  marker.textContent = "\u200b";
  caretMeasureLayer.appendChild(marker);
  return marker.offsetLeft;
}

function measureWrappedLineCaretPos(lineText, col, width, style) {
  const prefix = col > 0 ? lineText.slice(0, col) : "";
  caretMeasureLayer.style.whiteSpace = "pre-wrap";
  caretMeasureLayer.style.wordBreak = "break-word";
  caretMeasureLayer.style.overflowWrap = "break-word";
  caretMeasureLayer.style.padding = "0";
  caretMeasureLayer.style.border = "0";
  caretMeasureLayer.style.width = `${Math.max(1, width)}px`;
  caretMeasureLayer.style.fontFamily = style.fontFamily;
  caretMeasureLayer.style.fontSize = style.fontSize;
  caretMeasureLayer.style.lineHeight = style.lineHeight;
  caretMeasureLayer.style.fontWeight = style.fontWeight;
  caretMeasureLayer.style.fontStyle = style.fontStyle;
  caretMeasureLayer.style.letterSpacing = style.letterSpacing;
  caretMeasureLayer.style.wordSpacing = style.wordSpacing;
  caretMeasureLayer.style.textTransform = style.textTransform;
  caretMeasureLayer.style.tabSize = style.tabSize;
  caretMeasureLayer.style.textAlign = "left";
  caretMeasureLayer.style.direction = "ltr";
  caretMeasureLayer.textContent = prefix;
  const marker = document.createElement("span");
  marker.textContent = "\u200b";
  caretMeasureLayer.appendChild(marker);
  return { x: marker.offsetLeft, y: marker.offsetTop };
}

function getLineColumnFromClientX(lineIdx, clientX) {
  const lines = editor.value.split("\n");
  const safeLine = Math.max(0, Math.min(lineIdx, lines.length - 1));
  const lineText = lines[safeLine] || "";
  if (!lineText.length) return 0;

  const editorStyle = window.getComputedStyle(editor);
  setupLineMeasureLayer(editorStyle);

  const layerRect = renderLayer.getBoundingClientRect();
  const leftPad = parseFloat(editorStyle.paddingLeft) || 0;
  const x = Math.max(0, clientX - layerRect.left - leftPad);

  let low = 0;
  let high = lineText.length;
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    const midX = measureLinePrefixX(lineText, mid);
    if (midX <= x) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }

  if (low <= 0) return 0;
  const leftX = measureLinePrefixX(lineText, low);
  const prevX = measureLinePrefixX(lineText, low - 1);
  if (Math.abs(x - prevX) <= Math.abs(leftX - x)) {
    return low - 1;
  }
  return low;
}

function getLineColumnFromClientPoint(lineIdx, clientX, clientY) {
  const lines = editor.value.split("\n");
  const safeLine = Math.max(0, Math.min(lineIdx, lines.length - 1));
  const lineText = lines[safeLine] || "";
  if (!lineText.length) return 0;

  const row = renderLayer.querySelector(`.render-line[data-line="${safeLine + 1}"]`);
  if (!row) return getLineColumnFromClientX(safeLine, clientX);

  // Use the browser's own caret-hit-testing on the rendered DOM node.
  // This correctly resolves which visual sub-line the pointer is on even when
  // the rendered HTML wraps at different positions than the raw Markdown source.
  let hitNode = null;
  let hitOffset = 0;

  if (typeof document.caretPositionFromPoint === "function") {
    // Firefox
    const pos = document.caretPositionFromPoint(clientX, clientY);
    if (pos && row.contains(pos.offsetNode)) {
      hitNode = pos.offsetNode;
      hitOffset = pos.offset;
    }
  } else if (typeof document.caretRangeFromPoint === "function") {
    // Chrome / Safari
    const range = document.caretRangeFromPoint(clientX, clientY);
    if (range && row.contains(range.startContainer)) {
      hitNode = range.startContainer;
      hitOffset = range.startOffset;
    }
  }

  if (!hitNode) return getLineColumnFromClientX(safeLine, clientX);

  // Count rendered-text characters up to the hit position by walking text nodes.
  let renderedOffset = 0;
  const walker = document.createTreeWalker(row, NodeFilter.SHOW_TEXT, null);
  let current;
  while ((current = walker.nextNode())) {
    if (current === hitNode) {
      renderedOffset += hitOffset;
      break;
    }
    renderedOffset += current.textContent.length;
  }

  // Map the rendered-text offset proportionally to the source-text offset.
  // For un-formatted / suspended lines the rendered text equals the source text
  // so the ratio is 1:1 and the result is exact.  For lines with bold/code the
  // mapping is approximate but always lands on the correct visual sub-line.
  const renderedLen = (row.textContent || "").length;
  if (renderedLen === 0) return 0;
  const ratio = Math.min(1, renderedOffset / renderedLen);
  return Math.max(0, Math.min(lineText.length, Math.round(ratio * lineText.length)));
}

function setCursorToLineColumnByClientX(lineIdx, clientX) {
  const lines = editor.value.split("\n");
  const safeLine = Math.max(0, Math.min(lineIdx, lines.length - 1));
  const lineStart = getLineStartOffset(safeLine);
  const column = getLineColumnFromClientX(safeLine, clientX);
  const pos = lineStart + column;
  editor.focus();
  editor.setSelectionRange(pos, pos);
}

function alignEditorCaretToRenderedLine(lineIdx) {
  if (!isRenderEnabled || lineIdx < 0) return;

  const row = renderLayer.querySelector(`.render-line[data-line="${lineIdx + 1}"]`);
  if (!row) return;

  const layerRect = renderLayer.getBoundingClientRect();
  const rowRect = row.getBoundingClientRect();
  const margin = 22;
  let nextRenderScrollTop = renderLayer.scrollTop;

  if (rowRect.top < layerRect.top + margin) {
    nextRenderScrollTop += rowRect.top - (layerRect.top + margin);
  } else if (rowRect.bottom > layerRect.bottom - margin) {
    nextRenderScrollTop += rowRect.bottom - (layerRect.bottom - margin);
  }

  const maxRender = Math.max(0, renderLayer.scrollHeight - renderLayer.clientHeight);
  nextRenderScrollTop = Math.max(0, Math.min(maxRender, nextRenderScrollTop));

  if (Math.abs(nextRenderScrollTop - renderLayer.scrollTop) >= 0.5) {
    isAdjustingRenderScroll = true;
    renderLayer.scrollTop = nextRenderScrollTop;
    isAdjustingRenderScroll = false;
  }

  resetPreviewCaretOffset();
  isAdjustingEditorScroll = true;
  editor.scrollTop = clampEditorScrollTop(renderLayer.scrollTop);
  isAdjustingEditorScroll = false;

  updateRenderCaret();
  syncOverlayScroll();
}

function getPreviewCaretAlignState(lineIdx) {
  if (!isRenderEnabled || lineIdx < 0 || !caretMeasureLayer) return null;

  const row = renderLayer.querySelector(`.render-line[data-line="${lineIdx + 1}"]`);
  if (!row) return null;

  const renderLayerRect = renderLayer.getBoundingClientRect();
  const rowRect = row.getBoundingClientRect();
  const targetCaretY = rowRect.top - renderLayerRect.top;
  const caretAbsoluteY = getCaretAbsoluteYInEditor();
  if (caretAbsoluteY === null) return null;

  const idealScrollTop = caretAbsoluteY - targetCaretY;
  const nextScrollTop = clampEditorScrollTop(idealScrollTop);
  const visualCaretY = caretAbsoluteY - nextScrollTop;

  return {
    nextScrollTop,
    visualGapAfterScroll: targetCaretY - visualCaretY,
  };
}

function getCaretAbsoluteYInEditor() {
  if (!caretMeasureLayer) return null;

  const style = window.getComputedStyle(editor);
  const before = editor.value.slice(0, editor.selectionStart);
  const safeBefore = before.endsWith("\n") ? `${before} ` : before;

  caretMeasureLayer.style.width = `${editor.clientWidth}px`;
  caretMeasureLayer.style.fontFamily = style.fontFamily;
  caretMeasureLayer.style.fontSize = style.fontSize;
  caretMeasureLayer.style.lineHeight = style.lineHeight;
  caretMeasureLayer.style.fontWeight = style.fontWeight;
  caretMeasureLayer.style.letterSpacing = style.letterSpacing;
  caretMeasureLayer.style.wordSpacing = style.wordSpacing;
  caretMeasureLayer.style.textIndent = style.textIndent;
  caretMeasureLayer.style.textTransform = style.textTransform;
  caretMeasureLayer.style.tabSize = style.tabSize;
  caretMeasureLayer.style.overflowWrap = "break-word";
  caretMeasureLayer.style.textAlign = style.textAlign;
  caretMeasureLayer.style.direction = style.direction;
  caretMeasureLayer.style.padding = style.padding;

  caretMeasureLayer.textContent = safeBefore;
  const marker = document.createElement("span");
  marker.textContent = "\u200b";
  caretMeasureLayer.appendChild(marker);

  return marker.offsetTop;
}

function stripCodeFences(text) {
  return text.replace(/```[\s\S]*?```/g, "");
}

function findLatexErrors(text) {
  const errors = [];
  const content = stripCodeFences(text || "");

  const exprs = window.LatexCompatModule
    ? window.LatexCompatModule.extractMathExpressions(content)
    : [];

  if (exprs.length) {
    for (const item of exprs) {
      try {
        window.katex.renderToString(item.expr, { throwOnError: true, displayMode: !!item.isBlock });
      } catch (err) {
        errors.push(String(err.message || err));
      }
    }
    return errors;
  }

  const pattern = /(\$\$([\s\S]*?)\$\$)|(\$([^\n$]+?)\$)/g;
  let match = pattern.exec(content);
  while (match) {
    const expr = (match[2] ?? match[4] ?? "").trim();
    if (expr.length) {
      try {
        window.katex.renderToString(expr, { throwOnError: true, displayMode: !!match[1] });
      } catch (err) {
        errors.push(String(err.message || err));
      }
    }
    match = pattern.exec(content);
  }
  return errors;
}

function hasLatexContent(line) {
  if (window.LatexCompatModule) {
    return window.LatexCompatModule.hasMathContent(line);
  }
  return /(?<!\\)\$/.test(line) || /\\\(|\\\)|\\\[|\\\]|\\begin\{|\\end\{/.test(line);
}

function buildLatexCompatMeta(line) {
  if (!hasLatexContent(line)) return null;

  if (window.LatexCompatModule) {
    return window.LatexCompatModule.analyzeLine(line, { katexRender: tryKatexRender });
  }

  const ok = [];
  const failed = [];
  if (testKatexCompat(line)) ok.push("KaTeX");
  else failed.push({ engine: "KaTeX", reason: "Unsupported LaTeX syntax or rendering error" });
  if (testMathJaxCompat(line)) ok.push("MathJax");
  else failed.push({ engine: "MathJax", reason: "Unsupported LaTeX syntax or rendering error" });
  if (testGitHubMarkdownCompat(line)) ok.push("GitHub");
  else failed.push({ engine: "GitHub", reason: "Unsupported syntax" });
  if (testMarkdownItCompat(line)) ok.push("markdown-it");
  else failed.push({ engine: "markdown-it", reason: "Unsupported LaTeX syntax or rendering error" });
  return { ok, failed, risky: ok.length === 0 };
}

function tryKatexRender(expr, displayMode) {
  if (!window.katex) return false;
  try {
    window.katex.renderToString(expr, { throwOnError: true, displayMode });
    return true;
  } catch (_) {
    return false;
  }
}

function testKatexCompat(line) {
  const meta = buildLatexCompatMeta(line);
  if (!meta) return true;
  return !!meta.ok.includes("KaTeX");
}

function testMathJaxCompat(line) {
  const meta = buildLatexCompatMeta(line);
  if (!meta) return true;
  const status = meta.rendererSummary && meta.rendererSummary.MathJax
    ? meta.rendererSummary.MathJax.status
    : null;
  return status === "pass" || status === "partial";
}

function testGitHubMarkdownCompat(line) {
  const meta = buildLatexCompatMeta(line);
  if (!meta) return true;
  return !!meta.ok.includes("GitHub");
}

function testMarkdownItCompat(line) {
  const meta = buildLatexCompatMeta(line);
  if (!meta) return true;
  return !!meta.ok.includes("markdown-it");
}

function showLatexCompatTooltip(badge) {
  const tooltip = document.getElementById("latexCompatTooltip");
  const content = document.getElementById("latexCompatTooltipContent");
  if (!tooltip || !content) return;

  const tooltipText = badge.getAttribute("data-tooltip");
  if (!tooltipText) return;

  content.textContent = tooltipText;
  tooltip.setAttribute("aria-hidden", "false");

  // Position tooltip above badge, centered
  const rect = badge.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const left = rect.left + rect.width / 2 - tooltipRect.width / 2;
  const top = rect.top - tooltipRect.height - 8;

  tooltip.style.left = `${Math.max(8, left)}px`;
  tooltip.style.top = `${Math.max(8, top)}px`;

  // Position arrow
  const arrow = tooltip.querySelector(".latex-compat-tooltip-arrow");
  if (arrow) {
    arrow.style.left = `${rect.left + rect.width / 2 - left - 6}px`;
    arrow.style.bottom = "-12px";
  }
}

function hideLatexCompatTooltip() {
  const tooltip = document.getElementById("latexCompatTooltip");
  if (tooltip) {
    tooltip.setAttribute("aria-hidden", "true");
  }
}

function showFormatSpaceTooltip(badge) {
  const tooltip = document.getElementById("formatSpaceTooltip");
  const content = document.getElementById("formatSpaceTooltipContent");
  if (!tooltip || !content) return;

  const rawLine = badge.getAttribute("data-source-line") || "";
  const serializedRanges = badge.getAttribute("data-hit-ranges") || "[]";
  let ranges = [];
  try {
    ranges = JSON.parse(serializedRanges);
  } catch (_) {
    ranges = [];
  }

  const snippets = buildFormatSpaceErrorOnlyContent(rawLine, ranges);
  content.innerHTML = `<div class="format-space-tooltip-title">Unexpected space around delimiter</div><div class="format-space-tooltip-line">${snippets}</div>`;
  tooltip.setAttribute("aria-hidden", "false");

  const rect = badge.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const margin = 8;
  const maxLeft = window.innerWidth - tooltipRect.width - margin;
  const left = Math.min(Math.max(margin, rect.left + rect.width / 2 - tooltipRect.width / 2), Math.max(margin, maxLeft));
  const top = Math.max(margin, rect.top - tooltipRect.height - 8);

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

function hideFormatSpaceTooltip() {
  const tooltip = document.getElementById("formatSpaceTooltip");
  if (tooltip) {
    tooltip.setAttribute("aria-hidden", "true");
  }
}

function stripInlineCodeForLint(line) {
  return String(line || "").replace(/`[^`]*`/g, (segment) => " ".repeat(segment.length));
}

function isWhitespaceChar(char) {
  return !char || /\s/.test(char);
}

function isLikelyClosingBoundaryChar(char) {
  if (!char) return true;
  return /[\s.,;:!?)}\]>",'"，。！？；：、）】》]/.test(char);
}

function isEscapedAt(text, index) {
  let slashCount = 0;
  for (let i = index - 1; i >= 0 && text[i] === "\\"; i -= 1) {
    slashCount += 1;
  }
  return slashCount % 2 === 1;
}

function collectInlineMathRangesAndIssues(text) {
  const ranges = [];
  let hasUnexpectedSpace = false;
  let openIndex = -1;

  for (let i = 0; i < text.length; i += 1) {
    if (text[i] !== "$") continue;
    if (isEscapedAt(text, i)) continue;

    if (text[i + 1] === "$") {
      i += 1;
      continue;
    }

    if (openIndex < 0) {
      openIndex = i;
      continue;
    }

    ranges.push([openIndex, i]);
    if (i > 0 && /\s/.test(text[i - 1])) {
      hasUnexpectedSpace = true;
    }
    openIndex = -1;
  }

  return { ranges, hasUnexpectedSpace };
}

function isInRanges(index, ranges) {
  for (let i = 0; i < ranges.length; i += 1) {
    const [start, end] = ranges[i];
    if (index >= start && index <= end) return true;
  }
  return false;
}

function mergeHighlightRanges(ranges, textLength) {
  if (!ranges.length) return [];
  const normalized = ranges
    .map(([start, end]) => [
      Math.max(0, Math.min(start, textLength)),
      Math.max(0, Math.min(end, textLength)),
    ])
    .filter(([start, end]) => end > start)
    .sort((a, b) => a[0] - b[0]);

  if (!normalized.length) return [];

  const merged = [normalized[0]];
  for (let i = 1; i < normalized.length; i += 1) {
    const [start, end] = normalized[i];
    const last = merged[merged.length - 1];
    if (start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }
  return merged;
}

function buildFormatSpaceErrorOnlyContent(line, ranges) {
  const source = String(line || "");
  const safeRanges = mergeHighlightRanges(ranges, source.length);
  if (!safeRanges.length) return "";

  return safeRanges
    .map(([start, end]) => `<div class="format-space-tooltip-snippet"><span class="format-space-hit">${md.utils.escapeHtml(source.slice(start, end))}</span></div>`)
    .join("");
}

function hasUnexpectedSpaceBeforeClosingToken(text, token, options = {}) {
  const stack = [];
  const tokenLen = token.length;

  for (let i = 0; i <= text.length - tokenLen; i += 1) {
    if (text.slice(i, i + tokenLen) !== token) continue;
    if (isEscapedAt(text, i)) continue;
    if (isInRanges(i, options.skipRanges || [])) continue;

    if (options.excludeRepeated) {
      const prev = text[i - 1] || "";
      const next = text[i + tokenLen] || "";
      if (prev === token || next === token) continue;
    }

    const prevChar = text[i - 1] || "";
    const nextChar = text[i + tokenLen] || "";
    const prevIsSpace = isWhitespaceChar(prevChar);
    const nextIsSpace = isWhitespaceChar(nextChar);
    const canOpen = !nextIsSpace;
    const canClose = !prevIsSpace;

    // If there is an unmatched opener, prefer consuming an ambiguous delimiter as closer.
    const useAsCloser = canClose && stack.length > 0;

    if (prevIsSpace && stack.length > 0 && isLikelyClosingBoundaryChar(nextChar)) {
      const openerIndex = stack[stack.length - 1];
      const innerText = text.slice(openerIndex + tokenLen, i);
      if (/\S/.test(innerText)) {
        return true;
      }
    }

    if (useAsCloser) {
      stack.pop();
      continue;
    }

    if (canOpen) {
      stack.push(i);
      continue;
    }
  }

  return false;
}

function collectUnexpectedSpaceRangesForToken(text, token, options = {}) {
  const stack = [];
  const tokenLen = token.length;
  const hits = [];

  for (let i = 0; i <= text.length - tokenLen; i += 1) {
    if (text.slice(i, i + tokenLen) !== token) continue;
    if (isEscapedAt(text, i)) continue;
    if (isInRanges(i, options.skipRanges || [])) continue;

    if (options.excludeRepeated) {
      const prev = text[i - 1] || "";
      const next = text[i + tokenLen] || "";
      if (prev === token || next === token) continue;
    }

    const prevChar = text[i - 1] || "";
    const nextChar = text[i + tokenLen] || "";
    const prevIsSpace = isWhitespaceChar(prevChar);
    const nextIsSpace = isWhitespaceChar(nextChar);
    const canOpen = !nextIsSpace;
    const canClose = !prevIsSpace;
    const useAsCloser = canClose && stack.length > 0;

    if (prevIsSpace && stack.length > 0 && isLikelyClosingBoundaryChar(nextChar)) {
      const openerIndex = stack[stack.length - 1];
      const innerText = text.slice(openerIndex + tokenLen, i);
      if (/\S/.test(innerText)) {
        hits.push([openerIndex, i + tokenLen]);
      }
    }

    if (useAsCloser) {
      stack.pop();
      continue;
    }

    if (canOpen) {
      stack.push(i);
      continue;
    }
  }

  return hits;
}

function collectUnexpectedOpenSpaceRangesForToken(text, token, options = {}) {
  const tokenLen = token.length;
  const hits = [];

  function findNextCloser(startIndex) {
    for (let j = startIndex; j <= text.length - tokenLen; j += 1) {
      if (text.slice(j, j + tokenLen) !== token) continue;
      if (isEscapedAt(text, j)) continue;
      if (isInRanges(j, options.skipRanges || [])) continue;

      if (options.excludeRepeated) {
        const prev = text[j - 1] || "";
        const next = text[j + tokenLen] || "";
        if (prev === token || next === token) continue;
      }

      const prevChar = text[j - 1] || "";
      if (isWhitespaceChar(prevChar)) continue;
      return j;
    }
    return -1;
  }

  for (let i = 0; i <= text.length - tokenLen; i += 1) {
    if (text.slice(i, i + tokenLen) !== token) continue;
    if (isEscapedAt(text, i)) continue;
    if (isInRanges(i, options.skipRanges || [])) continue;

    if (options.excludeRepeated) {
      const prev = text[i - 1] || "";
      const next = text[i + tokenLen] || "";
      if (prev === token || next === token) continue;
    }

    const nextChar = text[i + tokenLen] || "";
    if (!isWhitespaceChar(nextChar)) continue;

    const closerIdx = findNextCloser(i + tokenLen);
    if (closerIdx < 0) continue;

    const innerText = text.slice(i + tokenLen, closerIdx);
    if (!/\S/.test(innerText)) continue;

    hits.push([i, closerIdx + tokenLen]);
    i = closerIdx + tokenLen - 1;
  }

  return hits;
}

function collectUnexpectedSpaceHighlightRanges(line) {
  const text = stripInlineCodeForLint(line);
  if (!text) return [];

  const ranges = [];
  let openInlineMath = -1;
  let openInlineMathHasLeadingSpace = false;
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] !== "$") continue;
    if (isEscapedAt(text, i)) continue;
    if (text[i + 1] === "$") {
      i += 1;
      continue;
    }

    if (openInlineMath < 0) {
      openInlineMath = i;
      openInlineMathHasLeadingSpace = /\s/.test(text[i + 1] || "");
      continue;
    }

    if (openInlineMathHasLeadingSpace || (i > 0 && /\s/.test(text[i - 1]))) {
      ranges.push([openInlineMath, i + 1]);
    }
    openInlineMath = -1;
    openInlineMathHasLeadingSpace = false;
  }

  const inlineMath = collectInlineMathRangesAndIssues(text);
  const checks = [
    { token: "**" },
    { token: "__" },
    { token: "~~" },
    { token: "*", excludeRepeated: true },
    { token: "_", excludeRepeated: true },
  ];

  checks.forEach((item) => {
    const openerHits = collectUnexpectedOpenSpaceRangesForToken(text, item.token, {
      excludeRepeated: item.excludeRepeated,
      skipRanges: inlineMath.ranges,
    });
    openerHits.forEach((range) => ranges.push(range));

    const tokenHits = collectUnexpectedSpaceRangesForToken(text, item.token, {
      excludeRepeated: item.excludeRepeated,
      skipRanges: inlineMath.ranges,
    });
    tokenHits.forEach((range) => ranges.push(range));
  });

  return mergeHighlightRanges(ranges, text.length);
}

function hasUnexpectedSpaceBeforeClosingDelimiter(line) {
  return collectUnexpectedSpaceHighlightRanges(line).length > 0;
}

function applyFormatSpaceWarningBadge(row, line, options = {}) {
  if (!row) return;
  row.querySelectorAll(".format-space-warning-badge").forEach((badge) => badge.remove());

  if (options.suppress) return;
  const hitRanges = collectUnexpectedSpaceHighlightRanges(line);
  if (!hitRanges.length) return;

  const badge = document.createElement("span");
  badge.className = "format-space-warning-badge";
  badge.textContent = "Unexpected space";
  badge.setAttribute("data-source-line", String(line || ""));
  badge.setAttribute("data-hit-ranges", JSON.stringify(hitRanges));
  badge.addEventListener("mouseover", () => showFormatSpaceTooltip(badge));
  badge.addEventListener("mouseleave", hideFormatSpaceTooltip);
  if (row.querySelector(".latex-compat-badge")) {
    badge.style.bottom = "20px";
  }
  row.appendChild(badge);
}

function applyLatexCompatBadge(row, line) {
  if (!row) return;
  row.querySelectorAll(".latex-compat-badge").forEach((badge) => badge.remove());
  if (!isLatexHintEnabled) return;

  const meta = buildLatexCompatMeta(line);
  if (!meta) return;

  const totalRenderers = window.LatexCompatModule
    ? window.LatexCompatModule.getRendererNames().length
    : meta.ok.length + (meta.failed ? meta.failed.length : 0);

  function summarizeNames(items, maxItems = 3) {
    const names = (items || []).slice(0, maxItems);
    const extraCount = Math.max(0, (items || []).length - names.length);
    return `${names.join(", ")}${extraCount ? ` +${extraCount}` : ""}`;
  }

  function simplifyReason(reason) {
    const text = String(reason || "");
    const splitIndex = text.indexOf(": ");
    const compact = splitIndex >= 0 ? text.slice(splitIndex + 2) : text;
    return compact
      .replace("KaTeX parser rejected this expression", "parser rejected")
      .replace("may rely on MathJax-only syntax; verify on target", "needs target verification")
      .replace("pipe in inline math can break markdown table parsing", "inline pipe may break tables")
      .replace("macro definitions are not reliably persisted across expressions", "macro persistence is unreliable")
      .replace("matrix environments should be block math on GitHub", "matrix should use block math")
      .replace("matrix blocks may render with layout differences", "matrix layout may differ")
      .replace("delimiter support depends on extensions/config", "delimiter depends on config")
      .replace("delimiter ", "")
      .replace(" is not supported", " unsupported");
  }

  let badgeText = "All Passed";
  if (meta.risky) {
    badgeText = "risk";
  } else if (meta.failed && meta.failed.length > 0) {
    badgeText = meta.ok.length < 4
      ? `Only: ${summarizeNames(meta.ok)}`
      : `Except: ${summarizeNames(meta.failed.map((item) => item.engine))}`;
  }

  const badge = document.createElement("span");
  badge.className = `latex-compat-badge${meta.risky ? " is-risk" : ""}`;
  badge.textContent = badgeText;
  
  // Store tooltip info as data attribute
  let tooltipText = "";
  if (meta.risky) {
    const reasons = meta.failed.slice(0, 3).map((f) => `${f.engine}: ${simplifyReason(f.reason)}`).join("\n");
    const extraCount = Math.max(0, meta.failed.length - 3);
    tooltipText = `Passed: none / ${totalRenderers}\n${reasons}${extraCount ? `\n+${extraCount} more` : ""}`;
  } else if (meta.failed && meta.failed.length > 0) {
    const summary = meta.ok.length < 4
      ? `Only: ${summarizeNames(meta.ok)}`
      : `Except: ${summarizeNames(meta.failed.map((item) => item.engine))}`;
    const reasons = meta.failed.slice(0, 3).map((f) => `${f.engine}: ${simplifyReason(f.reason)}`).join("\n");
    const extraCount = Math.max(0, meta.failed.length - 3);
    tooltipText = `${summary}\n${reasons}${extraCount ? `\n+${extraCount} more` : ""}`;
  } else if (meta.ok.length > 0) {
    tooltipText = `All ${totalRenderers} passed`;
  }
  
  if (tooltipText) {
    badge.setAttribute("data-tooltip", tooltipText);
    badge.style.cursor = "pointer";
    badge.addEventListener("mouseover", () => showLatexCompatTooltip(badge));
    badge.addEventListener("mouseleave", hideLatexCompatTooltip);
  }

  if (row.querySelector(".format-space-warning-badge")) {
    badge.style.bottom = "20px";
  }
  
  row.appendChild(badge);
}

function clearLatexCompatBadgeForRange(range) {
  if (!range) return;
  for (let lineIdx = range.start; lineIdx <= range.end; lineIdx += 1) {
    const row = renderLayer.querySelector(`.render-line[data-line="${lineIdx + 1}"]`);
    if (!row) continue;
    row.querySelectorAll(".latex-compat-badge").forEach((badge) => badge.remove());
  }
}

function clearFormatSpaceWarningBadgeForRange(range) {
  if (!range) return;
  for (let lineIdx = range.start; lineIdx <= range.end; lineIdx += 1) {
    const row = renderLayer.querySelector(`.render-line[data-line="${lineIdx + 1}"]`);
    if (!row) continue;
    row.querySelectorAll(".format-space-warning-badge").forEach((badge) => badge.remove());
  }
}

function rangesEqual(a, b) {
  if (!a || !b) return false;
  return a.start === b.start && a.end === b.end;
}

function rangeKey(range) {
  return `${range.start}:${range.end}`;
}

function rangesOverlap(a, b) {
  if (!a || !b) return false;
  return a.start <= b.end && b.start <= a.end;
}

function clearRestoreTimerForRange(range) {
  if (!range) return;
  const key = rangeKey(range);
  const timer = leaveRestoreTimers.get(key);
  if (!timer) return;
  clearTimeout(timer);
  leaveRestoreTimers.delete(key);
}

function clearAllRestoreTimers() {
  leaveRestoreTimers.forEach((timerId) => {
    clearTimeout(timerId);
  });
  leaveRestoreTimers.clear();
}

function resolveCursorRange(lines) {
  const selectionRange = resolveMultiLineSelectionRange(lines);
  if (selectionRange) {
    return selectionRange;
  }

  const lineIdx = getCurrentCursorLineIndex();
  const fenceRange = getCodeFenceRange(lines, lineIdx);
  if (fenceRange.inFence) {
    return { start: fenceRange.start, end: fenceRange.end, inBlock: false };
  }
  return isLineInsideBlockMath(lines, lineIdx);
}

function getLineIndexAtOffset(lines, offset) {
  const safeOffset = Math.max(0, Math.min(offset, editor.value.length));
  let acc = 0;
  for (let i = 0; i < lines.length; i += 1) {
    const lineLen = lines[i].length;
    const lineEnd = acc + lineLen;
    if (safeOffset <= lineEnd) {
      return i;
    }
    acc = lineEnd + 1;
  }
  return Math.max(0, lines.length - 1);
}

function resolveMultiLineSelectionRange(lines) {
  const selStart = editor.selectionStart;
  const selEnd = editor.selectionEnd;
  if (selStart === selEnd) return null;

  const startOffset = Math.min(selStart, selEnd);
  const endOffset = Math.max(selStart, selEnd);
  const startLine = getLineIndexAtOffset(lines, startOffset);
  // Use endOffset - 1 so a selection ending at the next line start does not
  // incorrectly include that next line.
  const endProbeOffset = Math.max(startOffset, endOffset - 1);
  const endLine = getLineIndexAtOffset(lines, endProbeOffset);

  if (endLine <= startLine) return null;
  return { start: startLine, end: endLine, inBlock: false, isSelection: true };
}

function restoreRangeWithCurrentContent(range) {
  if (!range || !isRenderEnabled) return;
  const lines = editor.value.split("\n");
  if (rangeHasFenceOrTableContext(lines, range.start, range.end)) {
    renderPreview(lines);
    ensureCaretAlignmentNow();
    return;
  }
  rerenderRange(range.start, range.end, lines);
  ensureCaretAlignmentNow();
}

function rangeHasFenceOrTableContext(lines, startLine, endLine) {
  for (let i = startLine; i <= endLine; i += 1) {
    if (isFenceOrTableContext(lines, i)) return true;
  }
  return false;
}

function scheduleRestoreRange(range) {
  if (!range) return;
  clearRestoreTimerForRange(range);
  const timerId = window.setTimeout(() => {
    if (isRenderDragging) {
      // Re-schedule: keep deferring until drag ends
      scheduleRestoreRange(range);
      return;
    }
    if (activeSuspendRange && rangesOverlap(activeSuspendRange, range)) {
      // Current suspended range still covers this area (common during Ctrl+A / drag);
      // defer restore to avoid random partial re-render while selection is active.
      scheduleRestoreRange(range);
      return;
    }
    if (!(activeSuspendRange && rangesEqual(activeSuspendRange, range))) {
      restoreRangeWithCurrentContent(range);
      scheduleCaretRealignChecks(LINE_RESTORE_ON_LEAVE_MS + 260);
    }
    leaveRestoreTimers.delete(rangeKey(range));
  }, LINE_RESTORE_ON_LEAVE_MS);
  leaveRestoreTimers.set(rangeKey(range), timerId);
}

function suspendRangeForCursor(lines) {
  activeRenderCaretLine = getCurrentCursorLineIndex();
  const range = resolveCursorRange(lines);
  clearRestoreTimerForRange(range);
  if (!activeSuspendRange || !rangesEqual(activeSuspendRange, range)) {
    if (activeSuspendRange) {
      scheduleRestoreRange(activeSuspendRange);
    }
    activeSuspendRange = { ...range };
  }
  markRenderRangeSuspended(range, lines);
  alignEditorCaretToRenderedLine(activeRenderCaretLine);
}

function syncSuspendRangeFromCursor() {
  if (!isRenderEnabled) return;
  if (isRenderDragging) return; // Don't disturb rendering during drag selection
  if (document.activeElement !== editor) return;
  suspendRangeForCursor(editor.value.split("\n"));
  // Re-apply visual selection after suspend updates row DOM.
  syncRenderSelectionHighlightFromEditor();
  // Keep cursor visually pinned to the active rendered line while navigating.
  scheduleCaretRealignChecks(1400);
  updateRenderCaret();
}

function markRenderRangeSuspended(range, lines) {
  const startLine = range.start;
  const endLine = range.end;

  for (let i = startLine; i <= endLine; i += 1) {
    const row = renderLayer.querySelector(`.render-line[data-line="${i + 1}"]`);
    if (!row) continue;
    row.classList.add("is-suspended");
    row.classList.remove("render-line-latex-error");
    const escaped = md.utils.escapeHtml(lines[i] || "");
    row.innerHTML = escaped.length ? `<span class="render-editing-raw">${escaped}</span>` : "&nbsp;";
  }
}

function isLineInsideBlockMath(lines, lineIdx) {
  let inBlock = false;
  let start = -1;
  for (let i = 0; i < lines.length; i += 1) {
    const count = (lines[i].match(/\$\$/g) || []).length;
    if (count % 2 === 1) {
      if (!inBlock) {
        start = i;
      } else {
        if (lineIdx >= start && lineIdx <= i) {
          return { start, end: i, inBlock: true };
        }
      }
      inBlock = !inBlock;
    }
  }
  if (inBlock && lineIdx >= start) {
    return { start, end: lines.length - 1, inBlock: true };
  }
  return { start: lineIdx, end: lineIdx, inBlock: false };
}

function getCodeFenceRange(lines, lineIdx) {
  let inFence = false;
  let start = -1;
  for (let i = 0; i < lines.length; i += 1) {
    if (/^\s*```/.test(lines[i])) {
      if (!inFence) {
        inFence = true;
        start = i;
      } else {
        if (lineIdx >= start && lineIdx <= i) {
          return { start, end: i, inFence: true };
        }
        inFence = false;
        start = -1;
      }
    }
  }

  if (inFence && lineIdx >= start) {
    return { start, end: lines.length - 1, inFence: true };
  }

  return { start: lineIdx, end: lineIdx, inFence: false };
}

function isFenceOrTableContext(lines, lineIdx) {
  let inFence = false;
  for (let i = 0; i <= lineIdx; i += 1) {
    if (/^\s*```/.test(lines[i])) {
      inFence = !inFence;
    }
  }
  if (inFence) return true;

  const hasTableMark = (value) => value && value.includes("|");
  return hasTableMark(lines[lineIdx - 1]) || hasTableMark(lines[lineIdx]) || hasTableMark(lines[lineIdx + 1]);
}

function rerenderRange(startLine, endLine, lines) {
  for (let i = startLine; i <= endLine; i += 1) {
    const row = renderLayer.querySelector(`.render-line[data-line="${i + 1}"]`);
    if (!row) {
      renderPreview(lines);
      return;
    }
    row.classList.remove("is-suspended", "render-line-latex-error");
    row.innerHTML = renderSingleLine(lines[i] || "");

    const lineErrors = findLatexErrors(lines[i] || "");
    if (lineErrors.length) {
      row.classList.add("render-line-latex-error");
      row.title = lineErrors[0];
    } else {
      row.removeAttribute("title");
    }
    applyFormatSpaceWarningBadge(row, lines[i] || "", { suppress: getCodeFenceRange(lines, i).inFence });
    applyLatexCompatBadge(row, lines[i] || "");
  }

  if (endLine > startLine) {
    const blockText = lines.slice(startLine, endLine + 1).join("\n");
    const blockErrors = findLatexErrors(blockText);
    if (blockErrors.length) {
      for (let i = startLine; i <= endLine; i += 1) {
        const row = renderLayer.querySelector(`.render-line[data-line="${i + 1}"]`);
        if (row) {
          row.classList.add("render-line-latex-error");
          row.title = blockErrors[0];
        }
      }
    }
  }

  ensureCaretAlignmentNow();
  requestAnimationFrame(syncRenderLineHeights);
  scheduleCaretRealignChecks(260);
}

function analyzeLatexCompatibility(markdown) {
  if (window.LatexCompatModule) {
    const report = window.LatexCompatModule.analyzeDocument(markdown, { katexRender: tryKatexRender });
    const issues = report.issues.map((item) => {
      if (item.key && typeof t === "function") return t(item.key);
      return String(item.message || item.key || "");
    });
    return [...new Set(issues.filter(Boolean))];
  }

  const issues = [];
  const codeFencePattern = /```[\s\S]*?```/g;
  const codeBlocks = markdown.match(codeFencePattern) || [];
  const noCode = markdown.replace(codeFencePattern, "\n");

  const dollars = noCode.match(/(?<!\\)\$/g) || [];
  if (dollars.length % 2 !== 0) {
    issues.push(t("latexIssueUnmatchedDollar"));
  }

  const lines = markdown.split("\n");
  const tableMath = lines.some((line) => line.includes("|") && /(?<!\\)\$/.test(line));
  if (tableMath) {
    issues.push(t("latexIssueTableMath"));
  }

  if (/\\\(|\\\)|\\\[|\\\]/.test(noCode)) {
    issues.push(t("latexIssueParenDelimiters"));
  }

  if (/\\begin\{align\*?\}|\\begin\{aligned\}/.test(noCode)) {
    issues.push(t("latexIssueAlignEnv"));
  }

  if (codeBlocks.some((block) => /(?<!\\)\$|\\begin\{/.test(block))) {
    issues.push(t("latexIssueCodeFenceMath"));
  }

  for (let i = 0; i < lines.length; i += 1) {
    if (!lines[i].includes("$$")) continue;
    const prev = (lines[i - 1] || "").trim();
    const next = (lines[i + 1] || "").trim();
    if ((prev && !prev.startsWith("$$")) || (next && !next.startsWith("$$"))) {
      issues.push(t("latexIssueBlockSpacing"));
      break;
    }
  }

  issues.push(t("latexIssueEngineHint"));
  return issues;
}

function t(key, vars = {}) {
  const pack = I18N[currentLanguage] || I18N.zh;
  const fallback = I18N.zh[key] || key;
  const template = pack[key] || fallback;
  return template.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`));
}

function getOnboardingSteps() {
  return [
    {
      title: t("onboarding1Title"),
      heading: t("onboarding1Heading"),
      description: t("onboarding1Desc"),
      target: onboardingRenderTarget,
      nextText: t("next"),
    },
    {
      title: t("onboarding2Title"),
      heading: t("onboarding2Heading"),
      description: t("onboarding2Desc"),
      target: mathKeyboard,
      nextText: t("next"),
    },
    {
      title: t("onboarding3Title"),
      heading: t("onboarding3Heading"),
      description: t("onboarding3Desc"),
      target: onboardingToolbarTarget,
      nextText: t("startUsing"),
    },
  ];
}

function syncOverlayScroll() {
  const top = isRenderEnabled ? renderLayer.scrollTop : editor.scrollTop;
  lineNumbers.scrollTop = top;
  guideLayer.scrollTop = top;
}

function resetRainParticle(particle, width, height, fromTop = false) {
  const size = 14 + Math.random() * 50;
  particle.size = size;
  particle.x = Math.random() * (width + size) - size * 0.5;
  particle.y = fromTop ? -size - Math.random() * height * 0.5 : Math.random() * (height + size) - size;
  particle.speed = 30 + size * 1.1 + Math.random() * 30;
  particle.drift = (Math.random() - 0.5) * 6;
  particle.phase = Math.random() * Math.PI * 2;
  particle.freq = 0.35 + Math.random() * 0.75;
  particle.baseAlpha = Math.min(0.24, 0.08 + size / 320);
}

function resizeWelcomeRain() {
  if (!welcomeRain) return;

  const rect = welcomeRain.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width));
  const height = Math.max(1, Math.floor(rect.height));
  const dpr = Math.min(2, window.devicePixelRatio || 1);

  welcomeRainState.canvasW = width;
  welcomeRainState.canvasH = height;
  welcomeRainState.dpr = dpr;

  welcomeRain.width = Math.floor(width * dpr);
  welcomeRain.height = Math.floor(height * dpr);

  const targetCount = Math.max(34, Math.min(96, Math.floor((width * height) / 21000)));
  const currentCount = welcomeRainState.particles.length;

  if (currentCount < targetCount) {
    for (let i = currentCount; i < targetCount; i += 1) {
      const particle = {};
      resetRainParticle(particle, width, height, false);
      welcomeRainState.particles.push(particle);
    }
  } else if (currentCount > targetCount) {
    welcomeRainState.particles.length = targetCount;
  }

  for (let i = 0; i < welcomeRainState.particles.length; i += 1) {
    const p = welcomeRainState.particles[i];
    if (p.x > width + p.size || p.y > height + p.size) {
      resetRainParticle(p, width, height, true);
    }
  }
}

function drawWelcomeRain(ts) {
  if (!welcomeRainState.running || !welcomeRain || !welcomeRainState.logoReady) {
    return;
  }

  welcomeRainState.rafId = requestAnimationFrame(drawWelcomeRain);

  if (welcomeRainState.lastTs === null) {
    welcomeRainState.lastTs = ts;
    return;
  }

  const deltaMs = ts - welcomeRainState.lastTs;
  if (deltaMs < 28) {
    return;
  }
  welcomeRainState.lastTs = ts;

  const dt = Math.min(deltaMs, 64) / 1000;
  const ctx = welcomeRainState.ctx;
  if (!ctx) return;

  const width = welcomeRainState.canvasW;
  const height = welcomeRainState.canvasH;
  const dpr = welcomeRainState.dpr;
  const time = ts / 1000;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const particles = welcomeRainState.particles;
  for (let i = 0; i < particles.length; i += 1) {
    const p = particles[i];
    p.y += p.speed * dt;
    p.x += p.drift * dt;

    if (p.y > height + p.size + 8) {
      resetRainParticle(p, width, height, true);
      continue;
    }

    const wave = 0.62 + 0.38 * Math.sin(time * p.freq + p.phase);
    const alpha = p.baseAlpha * wave;
    ctx.globalAlpha = alpha;
    ctx.drawImage(welcomeRainState.logo, p.x, p.y, p.size, p.size);
  }

  ctx.globalAlpha = 1;
}

function startWelcomeRain() {
  if (!welcomeRain || !welcomeRainState.logoReady) return;
  if (welcomeRainState.running) return;

  resizeWelcomeRain();
  welcomeRainState.running = true;
  welcomeRainState.lastTs = null;
  welcomeRainState.rafId = requestAnimationFrame(drawWelcomeRain);
}

function stopWelcomeRain() {
  welcomeRainState.running = false;
  welcomeRainState.lastTs = null;
  if (welcomeRainState.rafId) {
    cancelAnimationFrame(welcomeRainState.rafId);
    welcomeRainState.rafId = 0;
  }
}

function initWelcomeRain() {
  if (!welcomeRain || welcomeRainState.initialized) return;
  welcomeRainState.initialized = true;
  welcomeRainState.ctx = welcomeRain.getContext("2d", { alpha: true });

  const logo = new Image();
  logo.decoding = "async";
  logo.src = "favicon.ico";
  logo.addEventListener("load", () => {
    welcomeRainState.logo = logo;
    welcomeRainState.logoReady = true;
    resizeWelcomeRain();
    if (document.body.classList.contains("welcome-open")) {
      startWelcomeRain();
    }
  });
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

function setText(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = value;
}

function setLeadingLabelText(label, value) {
  if (!label) return;
  if (label.firstChild && label.firstChild.nodeType === Node.TEXT_NODE) {
    label.firstChild.nodeValue = `${value} `;
    return;
  }
  label.insertBefore(document.createTextNode(`${value} `), label.firstChild || null);
}

function applyLocaleToUI() {
  document.documentElement.lang = currentLanguage === "en" ? "en" : "zh-CN";

  if (welcomeTagline) welcomeTagline.textContent = t("welcomeTagline");

  setText('label[for="renderToggle"] span', t("renderToggle"));
  setText('label[for="latexHintToggle"] span', t("latexHintToggle"));
  setText('label[for="lineGuideToggle"] span', t("lineGuideToggle"));
  setText("#downloadBtn", t("download"));

  const toolbarPanel = document.querySelector(".toolbar-panel");
  if (toolbarPanel) {
    const toolbarTitle = toolbarPanel.querySelector("h2");
    if (toolbarTitle) toolbarTitle.textContent = t("tools");

    const groupTitles = toolbarPanel.querySelectorAll(".tool-group h3");
    if (groupTitles[0]) groupTitles[0].textContent = t("format");
    if (groupTitles[1]) groupTitles[1].textContent = t("codeMath");
    if (groupTitles[2]) groupTitles[2].textContent = t("links");
    if (groupTitles[3]) groupTitles[3].textContent = t("table");
    if (groupTitles[4]) groupTitles[4].textContent = t("latexSection");
  }

  const headingMainButtons = document.querySelectorAll(".heading-main");
  if (headingMainButtons[0]) headingMainButtons[0].textContent = t("headingMenu");
  if (headingMainButtons[1]) headingMainButtons[1].textContent = t("linkMenu");

  setText('[data-action="heading-1"]', t("h1"));
  setText('[data-action="heading-2"]', t("h2"));
  setText('[data-action="heading-3"]', t("h3"));
  setText('[data-action="heading-4"]', t("h4"));
  setText('[data-action="bold"]', t("bold"));
  setText('[data-action="italic"]', t("italic"));
  setText('[data-action="underline"]', t("underline"));
  setText('[data-action="strike"]', t("strike"));
  setText('[data-action="sup"]', t("sup"));
  setText('[data-action="sub"]', t("sub"));
  setText('[data-action="inline-code"]', t("inlineCode"));
  setText('[data-action="code-block"]', t("codeBlock"));
  setText('[data-action="insert-inline-math"]', t("insertInlineMath"));
  setText('[data-action="insert-block-math"]', t("insertBlockMath"));
  setText('[data-action="insert-web-link"]', t("webLink"));
  setText('[data-action="insert-image-link"]', t("imageLink"));
  setText('[data-action="insert-file-link"]', t("fileLink"));
  setText('[data-action="insert-image-link-from-clipboard"]', t("clipboardImageLink"));

  setText("#openTableBuilder", t("buildTable"));
  setText("#convertToTable", t("textToTable"));
  setText("#openLatexCompat", t("latexCompatBtn"));

  editor.placeholder = t("placeholder");

  setText(".math-title", t("mathKeyboardTitle"));
  customMathBtn.textContent = t("customMath");
  customMathBtn.title = t("customMathTitleTip");

  const tableDialogTitle = tableDialog.querySelector("h3");
  if (tableDialogTitle) tableDialogTitle.textContent = t("tableDialogTitle");
  const tableRowsLabel = tableDialog.querySelector('label[for="tableRows"]') || tableRows?.closest("label");
  const tableColsLabel = tableDialog.querySelector('label[for="tableCols"]') || tableCols?.closest("label");
  setLeadingLabelText(tableRowsLabel, t("tableRows"));
  setLeadingLabelText(tableColsLabel, t("tableCols"));
  tableCancel.textContent = t("cancel");
  const tableSubmit = tableForm.querySelector('button[type="submit"]');
  if (tableSubmit) tableSubmit.textContent = t("insert");

  const languageDialogTitle = languageDialog.querySelector("h3");
  if (languageDialogTitle) languageDialogTitle.textContent = t("langDialogTitle");
  const languageLabel = languageDialog.querySelector("label");
  setLeadingLabelText(languageLabel, t("langDialogLabel"));
  languageCancel.textContent = t("cancel");
  const languageSubmit = languageForm.querySelector('button[type="submit"]');
  if (languageSubmit) languageSubmit.textContent = t("confirm");

  if (!pendingMathTemplate) {
    mathTemplateTitle.textContent = t("mathTemplateTitle");
  }
  mathTemplateCancel.textContent = t("cancel");
  const mathTemplateSubmit = mathTemplateForm.querySelector('button[type="submit"]');
  if (mathTemplateSubmit) mathTemplateSubmit.textContent = t("insert");

  const downloadTitle = downloadDialog.querySelector("h3");
  if (downloadTitle) downloadTitle.textContent = t("downloadDialogTitle");
  downloadMdBtn.textContent = t("downloadMd");
  downloadTxtBtn.textContent = t("downloadTxt");
  downloadPdfBtn.textContent = t("downloadPdf");
  downloadCancel.textContent = t("cancel");

  const customTitle = customMathDialog.querySelector("h3");
  if (customTitle) customTitle.textContent = t("customMathDialogTitle");
  const customLabels = customMathDialog.querySelectorAll("label");
  setLeadingLabelText(customLabels[0], t("customMathLabel"));
  setLeadingLabelText(customLabels[1], t("customMathPreviewExpr"));
  customMathCancel.textContent = t("cancel");
  customMathSave.textContent = t("save");

  setText("#latexCompatTitle", t("latexCompatTitle"));
  if (latexCompatClose) latexCompatClose.textContent = t("latexCompatClose");

  updateCompatStats();
}

function updateCompatStats() {
  if (!compatPass || !compatPartial || !compatRisk) return;

  const lines = editor.value.split("\n");
  const totalEngines = window.LatexCompatModule
    ? window.LatexCompatModule.getRendererNames().length
    : 4;

  let pass = 0;
  let partial = 0;
  let risk = 0;

  for (const line of lines) {
    const meta = buildLatexCompatMeta(line);
    if (!meta) continue;

    if (meta.risky) {
      risk += 1;
    } else if (meta.ok.length >= totalEngines) {
      pass += 1;
    } else {
      partial += 1;
    }
  }

  compatPass.textContent = `${t("compatPass")}: ${pass}`;
  compatPartial.textContent = `${t("compatPartial")}: ${partial}`;
  compatRisk.textContent = `${t("compatRisk")}: ${risk}`;
}

function setLanguage(nextLanguage) {
  currentLanguage = nextLanguage === "en" ? "en" : "zh";
  window.localStorage.setItem(LOCALE_STORAGE_KEY, currentLanguage);
  applyLocaleToUI();
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

const caretMeasureLayer = document.createElement("div");
caretMeasureLayer.style.position = "absolute";
caretMeasureLayer.style.visibility = "hidden";
caretMeasureLayer.style.pointerEvents = "none";
caretMeasureLayer.style.left = "-99999px";
caretMeasureLayer.style.top = "0";
caretMeasureLayer.style.whiteSpace = "pre-wrap";
caretMeasureLayer.style.wordBreak = "break-word";
caretMeasureLayer.style.boxSizing = "border-box";
document.body.appendChild(caretMeasureLayer);

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
  { display: "\\infty", label: "∞", snippet: "\\infty " },
  // ── 上下标 ──
  { display: "x^{n}", label: "xⁿ", snippet: "x^{}" },
  { display: "x_{n}", label: "x_n", snippet: "x_{}" },
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

const MATH_LABEL_EN = {
  分数: "Fraction",
  分子: "Numerator",
  分母: "Denominator",
  根号: "Square Root",
  被开方项: "Radicand",
  "n次根": "Nth Root",
  次数: "Index",
  "求和 Σ": "Summation Σ",
  下限: "Lower bound",
  上限: "Upper bound",
  "连乘 Π": "Product Π",
  "积分 ∫": "Integral ∫",
  积分域: "Region",
  "二重积分 ∬": "Double Integral ∬",
  "三重积分 ∭": "Triple Integral ∭",
  "曲线积分 ∮": "Contour Integral ∮",
  路径: "Path",
  "极限 lim": "Limit lim",
  趋近条件: "Condition",
  导数: "Derivative",
  函数: "Function",
  变量: "Variable",
  偏导: "Partial Derivative",
  组合数: "Binomial",
  "总数 n": "Total n",
  "选取 k": "Choose k",
  矩阵: "Matrix",
  行列式: "Determinant",
};

function localizeMathItems() {
  if (currentLanguage !== "en") {
    return mathKeys;
  }

  return mathKeys.map((item) => ({
    ...item,
    label: MATH_LABEL_EN[item.label] || item.label,
    fields: item.fields
      ? item.fields.map((field) => ({
          ...field,
          label: MATH_LABEL_EN[field.label] || field.label,
        }))
      : item.fields,
  }));
}

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

function insertMathSnippet(value) {
  const mode = getMathModeAtCursor(editor.value, editor.selectionStart);
  if (mode) {
    insertText(value);
    return;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    insertText(value);
    return;
  }

  insertText(`$${trimmed}$ `);
}

function updateCustomMathButtonText() {
  customMathBtn.textContent = t("customMath");
}

function saveCustomMathItems() {
  try {
    window.localStorage.setItem(CUSTOM_MATH_STORAGE_KEY, JSON.stringify(customMathItems));
  } catch (_) {
    // Ignore storage failures.
  }
}

function loadCustomMathBinding() {
  try {
    const raw = window.localStorage.getItem(CUSTOM_MATH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        customMathItems = parsed
          .filter((item) => item && typeof item === "object")
          .map((item) => ({
            label: String(item.label || t("customLabelDefault")),
            display: String(item.display || "").trim(),
            snippet: String(item.display || "").trim(),
          }))
          .filter((item) => item.display.length > 0);
      } else if (parsed && typeof parsed === "object" && parsed.display) {
        // Compatibility migration from old single-binding data.
        customMathItems = [{
          label: String(parsed.label || t("customLabelDefault")),
          display: String(parsed.display).trim(),
          snippet: String(parsed.display).trim(),
        }].filter((item) => item.display.length > 0);
      }
    }
  } catch (_) {
    // Ignore malformed local storage and keep defaults.
  }

  updateCustomMathButtonText();
}

function validateCustomMathLatex(latex) {
  const value = (latex || "").trim();
  if (!value.length) {
    return { valid: false, html: "", message: t("expressionEmpty") };
  }

  try {
    const html = window.katex.renderToString(value, { throwOnError: true, displayMode: false });
    return { valid: true, html, message: t("expressionOk") };
  } catch (err) {
    return { valid: false, html: "", message: t("expressionInvalid", { message: err.message }) };
  }
}

function updateCustomMathPreview() {
  const latex = customMathDisplayInput.value;
  const label = (customMathLabelInput.value || "").trim();
  const result = validateCustomMathLatex(latex);

  if (result.valid) {
    customMathPreview.innerHTML = result.html;
    customMathStatus.textContent = result.message;
    customMathStatus.classList.remove("err");
    customMathStatus.classList.add("ok");
  } else {
    customMathPreview.textContent = t("previewFailed");
    customMathStatus.textContent = result.message;
    customMathStatus.classList.remove("ok");
    customMathStatus.classList.add("err");
  }

  customMathSave.disabled = !(result.valid && label.length > 0);
}

function openCustomMathDialog() {
  customMathLabelInput.value = t("customLabelDefault");
  customMathDisplayInput.value = "\\Omega";
  updateCustomMathPreview();
  customMathDialog.showModal();
  customMathDisplayInput.focus();
}

function insertMarkdownLink(url, isImage = false) {
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const prev = editor.value;
  const selected = prev.slice(start, end);
  const label = selected.length ? selected : (isImage ? t("imageTextDefault") : t("linkTextDefault"));
  const prefix = isImage ? "!" : "";
  const link = `${prefix}[${label}](${url})`;

  editor.value = `${prev.slice(0, start)}${link}${prev.slice(end)}`;
  const urlStart = start + prefix.length + label.length + 3;
  const urlEnd = urlStart + url.length;
  editor.setSelectionRange(urlStart, urlEnd);
  editor.focus();
  refreshAll();
}

async function insertImageLinkFromClipboard() {
  let clipText = "";
  try {
    clipText = (await navigator.clipboard.readText()) || "";
  } catch (_) {
    window.alert(t("clipboardDenied"));
    return;
  }

  const content = clipText.trim();
  if (!content) {
    window.alert(t("clipboardEmpty"));
    return;
  }

  insertMarkdownLink(content, true);
}

function initMathKeyboard() {
  mathGrid.innerHTML = "";

  const appendMathKey = (item) => {
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
      insertMathSnippet(item.snippet);
    });
    mathGrid.appendChild(btn);
  };

  localizeMathItems().forEach((item) => appendMathKey(item));
  customMathItems.forEach((item) => appendMathKey(item));
}

function generateMdTable(rows, cols) {
  const safeRows = Math.max(1, Number(rows));
  const safeCols = Math.max(1, Number(cols));
  const header = Array.from({ length: safeCols }, (_, i) => ` ${t("tableColumn")}${i + 1} `).join("|");
  const sep = Array.from({ length: safeCols }, () => " --- ").join("|");
  const body = Array.from({ length: safeRows - 1 }, () => `|${Array.from({ length: safeCols }, () => ` ${t("tableCell")} `).join("|")}|`).join("\n");
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

async function waitForPdfMathFonts(targetDocument = document) {
  if (!targetDocument.fonts) return;

  try {
    await targetDocument.fonts.ready;
  } catch (_err) {
    // Ignore readiness failures and continue with best effort font loading.
  }

  if (typeof targetDocument.fonts.load !== "function") return;

  const fontFaces = [
    '1em "KaTeX_Main"',
    '1em "KaTeX_Math"',
    '1em "KaTeX_Size1"',
    '1em "KaTeX_Size2"',
    '1em "KaTeX_Size3"',
    '1em "KaTeX_Size4"',
  ];

  await Promise.allSettled(fontFaces.map((font) => targetDocument.fonts.load(font)));
}

async function waitForPdfImages(container) {
  const images = Array.from(container.querySelectorAll("img"));
  if (!images.length) return;

  const waits = images.map((img) => new Promise((resolve) => {
    const finish = () => {
      img.removeEventListener("load", finish);
      img.removeEventListener("error", finish);
      resolve();
    };

    if (img.complete) {
      resolve();
      return;
    }

    img.addEventListener("load", finish, { once: true });
    img.addEventListener("error", finish, { once: true });
    window.setTimeout(finish, 6000);
  }));

  await Promise.allSettled(waits);
}

async function waitForPdfLayoutStability() {
  await new Promise((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)));
}

function preparePdfExportContainer(container) {
  container.querySelectorAll("img").forEach((img) => {
    img.style.maxWidth = "100%";
    img.style.height = "auto";
    img.style.display = "block";
    img.style.pageBreakInside = "avoid";
    img.style.breakInside = "avoid";
  });

  container.querySelectorAll("table").forEach((table) => {
    table.style.width = "100%";
    table.style.tableLayout = "fixed";
    table.style.wordBreak = "break-word";
    table.style.pageBreakInside = "avoid";
    table.style.breakInside = "avoid";
  });

  container.querySelectorAll("pre, blockquote").forEach((block) => {
    block.style.maxWidth = "100%";
    block.style.overflowWrap = "anywhere";
    block.style.wordBreak = "break-word";
    block.style.pageBreakInside = "avoid";
    block.style.breakInside = "avoid";
  });
}

async function downloadPdf() {
  const renderContainer = document.createElement("div");
  renderContainer.className = "pdf-export";
  renderContainer.style.background = "#fff";
  renderContainer.style.color = "#111827";
  renderContainer.style.fontFamily = '"Source Han Sans SC", sans-serif';
  renderContainer.style.lineHeight = "1.6";
  renderContainer.style.boxSizing = "border-box";
  renderContainer.style.width = "180mm";
  renderContainer.style.padding = "16mm";
  renderContainer.innerHTML = md.render(editor.value);
  preparePdfExportContainer(renderContainer);
  renderContainer.querySelectorAll("pre code").forEach((el) => {
    window.hljs.highlightElement(el);
  });

  const printFrame = document.createElement("iframe");
  printFrame.setAttribute("aria-hidden", "true");
  printFrame.style.position = "fixed";
  printFrame.style.right = "0";
  printFrame.style.bottom = "0";
  printFrame.style.width = "0";
  printFrame.style.height = "0";
  printFrame.style.border = "0";
  document.body.appendChild(printFrame);

  const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .map((el) => `<link rel="stylesheet" href="${el.href}">`)
    .join("\n");

  const printCss = `
    @page {
      size: A4;
      margin: 14mm;
    }
    html, body {
      background: #fff;
      color: #111827;
      margin: 0;
      padding: 0;
      font-family: "Source Han Sans SC", sans-serif;
      line-height: 1.6;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .pdf-export {
      width: auto;
      box-sizing: border-box;
      padding: 0;
    }
    .pdf-export img {
      max-width: 100%;
      height: auto;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .pdf-export table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #94a3b8;
      table-layout: fixed;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .pdf-export th,
    .pdf-export td {
      border: 1px solid #94a3b8;
      padding: 6px 8px;
      vertical-align: top;
      word-break: break-word;
    }
    .pdf-export pre,
    .pdf-export blockquote,
    .pdf-export table,
    .pdf-export .katex-display {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .pdf-export h1,
    .pdf-export h2,
    .pdf-export h3,
    .pdf-export h4,
    .pdf-export h5,
    .pdf-export h6 {
      page-break-after: avoid;
      break-after: avoid;
    }
    .pdf-export .katex,
    .pdf-export .katex-display {
      overflow: visible;
    }
    .pdf-export u {
      text-decoration-skip-ink: auto;
      text-underline-offset: 0.12em;
    }
    .page-break {
      page-break-before: always;
      break-before: page;
    }
  `;

  const doc = printFrame.contentDocument;
  if (!doc) {
    printFrame.remove();
    throw new Error("Print document unavailable");
  }

  doc.open();
  doc.write(`<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${makeSafeFileName()}</title>
        ${links}
        <style>${printCss}</style>
      </head>
      <body>
        <div class="pdf-export">${renderContainer.innerHTML}</div>
      </body>
    </html>`);
  doc.close();

  try {
    await waitForPdfMathFonts(doc);
    await waitForPdfImages(doc.body);
    await waitForPdfLayoutStability();

    const win = printFrame.contentWindow;
    if (!win) throw new Error("Print window unavailable");

    await new Promise((resolve) => {
      const done = () => {
        win.removeEventListener("afterprint", done);
        resolve();
      };
      win.addEventListener("afterprint", done);
      win.focus();
      win.print();
      window.setTimeout(done, 2000);
    });
  } catch (_err) {
    // Fallback: keep html2pdf path for environments where print is blocked.
    const container = document.createElement("div");
    container.className = "pdf-export";
    container.style.background = "#fff";
    container.style.color = "#111827";
    container.style.fontFamily = '"Source Han Sans SC", sans-serif';
    container.style.lineHeight = "1.6";
    container.style.boxSizing = "border-box";
    container.style.width = "180mm";
    container.style.padding = "16mm";
    container.innerHTML = md.render(editor.value);
    preparePdfExportContainer(container);
    container.querySelectorAll("pre code").forEach((el) => {
      window.hljs.highlightElement(el);
    });
    document.body.appendChild(container);

    await waitForPdfMathFonts();
    await waitForPdfImages(container);
    await waitForPdfLayoutStability();

    const options = {
      margin: 12,
      filename: `${makeSafeFileName()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        imageTimeout: 15000,
        width: container.scrollWidth,
        windowHeight: container.scrollHeight,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    };

    try {
      await window.html2pdf().set(options).from(container).save();
    } finally {
      container.remove();
    }
  } finally {
    printFrame.remove();
  }
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
  return md.render(normalizeMathDelimiters(line)).trim();
}

function normalizeMathDelimiters(text) {
  const source = String(text || "");
  return source
    .replace(/(?<!\\)\\\(([^]*?)(?<!\\)\\\)/g, (m, expr) => `$${expr}$`)
    .replace(/(?<!\\)\\\[([^]*?)(?<!\\)\\\]/g, (m, expr) => `$$${expr}$$`);
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

function isMarkdownTableRow(line) {
  const trimmed = line.trim();
  if (!trimmed.includes("|")) return false;
  if (!/^\|?.+\|.+\|?$/.test(trimmed)) return false;
  return true;
}

function isMarkdownTableSeparator(line) {
  const trimmed = line.trim();
  if (!trimmed.includes("|")) return false;
  const core = trimmed.replace(/^\|/, "").replace(/\|$/, "");
  const cells = core.split("|").map((cell) => cell.trim());
  if (!cells.length) return false;
  return cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function renderPreview(lines) {
  if (!isRenderEnabled) {
    renderLayer.innerHTML = "";
    return;
  }

  let inFence = false;
  let fenceLang = "plaintext";
  const lineInCodeFence = new Array(lines.length).fill(false);

  const htmlParts = [];

  for (let idx = 0; idx < lines.length; idx += 1) {
    const line = lines[idx];
    const fenceMatch = line.match(/^\s*```([\w+-]*)\s*$/);
    if (fenceMatch) {
      lineInCodeFence[idx] = true;
      if (!inFence) {
        inFence = true;
        fenceLang = fenceMatch[1] || "plaintext";
      } else {
        inFence = false;
        fenceLang = "plaintext";
      }
      htmlParts.push(`<div class="render-line" data-line="${idx + 1}">&nbsp;</div>`);
      continue;
    }

    if (inFence) {
      lineInCodeFence[idx] = true;
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

      htmlParts.push(`<div class="render-line code-fence-line ${segmentClass}" data-line="${idx + 1}"><code class="hljs language-${fenceLang}">${highlighted || "&nbsp;"}</code></div>`);
      continue;
    }

    const isTableStart =
      idx + 1 < lines.length
      && isMarkdownTableRow(line)
      && isMarkdownTableSeparator(lines[idx + 1]);

    if (isTableStart) {
      let end = idx + 2;
      while (end < lines.length && isMarkdownTableRow(lines[end])) {
        end += 1;
      }

      const tableBlock = normalizeMathDelimiters(lines.slice(idx, end).join("\n"));
      const tableHtml = md.render(tableBlock).trim();
      htmlParts.push(`<div class="render-line" data-line="${idx + 1}">${tableHtml}</div>`);

      for (let row = idx + 1; row < end; row += 1) {
        htmlParts.push(`<div class="render-line" data-line="${row + 1}">&nbsp;</div>`);
      }

      idx = end - 1;
      continue;
    }

    htmlParts.push(`<div class="render-line" data-line="${idx + 1}">${renderSingleLine(line)}</div>`);
  }

  renderLayer.innerHTML = htmlParts.join("");
  ensureRenderCaretAttached();

  lines.forEach((line, idx) => {
    const lineErrors = findLatexErrors(line);
    const row = renderLayer.querySelector(`.render-line[data-line="${idx + 1}"]`);
    if (!row) return;
    applyFormatSpaceWarningBadge(row, line, { suppress: lineInCodeFence[idx] });
    applyLatexCompatBadge(row, line);
    if (!lineErrors.length) return;
    row.classList.add("render-line-latex-error");
    row.title = lineErrors[0];
  });

  clearLatexCompatBadgeForRange(activeSuspendRange);
  clearFormatSpaceWarningBadgeForRange(activeSuspendRange);

  renderLayer.querySelectorAll("pre code").forEach((el) => {
    window.hljs.highlightElement(el);
  });

  // 首次排版后同步，再延迟一次用于字体/公式延迟布局
  requestAnimationFrame(() => {
    syncRenderLineHeights();
    scheduleCaretRealignChecks(220);
    requestAnimationFrame(() => {
      syncRenderLineHeights();
      scheduleCaretRealignChecks(220);
    });
    setTimeout(() => {
      syncRenderLineHeights();
      scheduleCaretRealignChecks(220);
    }, 80);
  });
}

function getMathModeAtCursor(text, cursor) {
  const part = text.slice(0, cursor);
  const openStack = [];

  function popLastToken(token) {
    for (let idx = openStack.length - 1; idx >= 0; idx -= 1) {
      if (openStack[idx] === token) {
        openStack.splice(idx, 1);
        return;
      }
    }
  }

  for (let i = 0; i < part.length; i += 1) {
    const ch = part[i];
    const next = part[i + 1];

    if (ch === "\\") {
      if (next === "(") {
        openStack.push("\\(");
        i += 1;
        continue;
      }
      if (next === ")") {
        popLastToken("\\(");
        i += 1;
        continue;
      }
      if (next === "[") {
        openStack.push("\\[");
        i += 1;
        continue;
      }
      if (next === "]") {
        popLastToken("\\[");
        i += 1;
        continue;
      }
      i += 1;
      continue;
    }

    if (ch === "\n") {
      for (let idx = openStack.length - 1; idx >= 0; idx -= 1) {
        if (openStack[idx] === "$") {
          openStack.splice(idx, 1);
        }
      }
      continue;
    }

    if (part.slice(i, i + 2) === "$$") {
      const hasBlockDollar = openStack.includes("$$");
      if (hasBlockDollar) {
        popLastToken("$$");
      } else {
        openStack.push("$$");
      }
      i += 1;
      continue;
    }

    if (ch === "$") {
      const hasInlineDollar = openStack.includes("$");
      if (hasInlineDollar) {
        popLastToken("$");
      } else if (!openStack.includes("$$")) {
        openStack.push("$");
      }
    }
  }

  if (!openStack.length) return null;

  const active = openStack[openStack.length - 1];
  if (active === "$$" || active === "\\[") {
    return { kind: "block", delimiter: active };
  }
  if (active === "$" || active === "\\(") {
    return { kind: "inline", delimiter: active };
  }
  return null;
}

function setRenderMode(enabled) {
  isRenderEnabled = enabled;
  editorWrap.classList.toggle("render-on", enabled);
  resetPreviewCaretOffset();
  if (!enabled) {
    hideRenderCaret();
    clearRenderDragHighlight();
  }
  if (!enabled) {
    stopCaretRealignChecks();
  }

  if (enabled) {
    renderLayer.scrollTop = editor.scrollTop;
    updateRenderCaret();
    syncRenderSelectionHighlightFromEditor();
  } else {
    clearAllRestoreTimers();
    activeSuspendRange = null;
    activeRenderCaretLine = -1;
  }

  refreshAll();
}

function toggleMathKeyboard() {
  if (forceMathKeyboardOpen) {
    setMathKeyboardOpen(true);
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
    env: "pmatrix",
    cellPrefix: "a",
  },
  determinant: {
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

  const title = type === "determinant" ? t("determinantTemplate") : t("matrixTemplate");

  pendingMathTemplate = { type, stage: "size" };
  mathTemplateTitle.textContent = `${title} - ${t("chooseSize")}`;
  createTemplateFields([
    { key: "rows", label: t("rows"), defaultValue: "2" },
    { key: "cols", label: t("cols"), defaultValue: "2" },
  ]);
}

function openSizedTemplateValueStep(type, rows, cols) {
  const meta = sizedTemplateMeta[type];
  if (!meta) return;

  const title = type === "determinant" ? t("determinantTemplate") : t("matrixTemplate");

  pendingMathTemplate = { type, stage: "values", rows, cols };
  mathTemplateTitle.textContent = `${title} - ${rows}x${cols} ${t("fillValues")}`;
  createGridTemplateFields(rows, cols, meta.cellPrefix);
}

function openMathTemplateDialog(item) {
  if (item.type && sizedTemplateMeta[item.type]) {
    openSizedTemplateSizeStep(item.type);
  } else {
    pendingMathTemplate = item;
    mathTemplateTitle.textContent = `${item.label} ${t("templateSuffix")}`;
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

  let cursor = editor.selectionStart;
  const value = editor.value;
  const mode = getMathModeAtCursor(value, cursor);
  if (!mode) return;

  const rightPart = value.slice(cursor);
  const closeToken = mode.delimiter === "$$"
    ? "$$"
    : mode.delimiter === "\\["
      ? "\\]"
      : mode.delimiter === "\\("
        ? "\\)"
        : "$";

  const escapedCloseToken = closeToken.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (new RegExp(`^\\s*${escapedCloseToken}`).test(rightPart)) {
    return;
  }

  e.preventDefault();

  if (cursor > 0 && value[cursor - 1] === " ") {
    editor.setRangeText("", cursor - 1, cursor, "end");
    cursor -= 1;
  }

  const insertion = `${closeToken}\n`;
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
  updateCompatStats();
  
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

function forceRefreshRenderAndChecks() {
  const lines = editor.value.split("\n");
  clearAllRestoreTimers();
  clearRenderDragHighlight();
  stopRenderDragAutoScroll();
  isRenderDragging = false;
  renderDragState = null;
  renderDragPointer = null;
  hideLatexCompatTooltip();
  hideFormatSpaceTooltip();

  if (isRenderEnabled) {
    activeSuspendRange = null;
    renderLayer.innerHTML = "";
    updateLineNumbers(lines);
    renderPreview(lines);
    syncSuspendRangeFromCursor();
    syncRenderSelectionHighlightFromEditor();
    updateRenderCaret();
  } else {
    refreshAll();
  }

  syncOverlayScroll();
  toggleMathKeyboard();
  updateCompatStats();
}

function openLatexCompatibilityDialog() {
  if (!latexCompatDialog || !latexCompatSummary || !latexCompatList) return;

  const issues = analyzeLatexCompatibility(editor.value);
  latexCompatList.innerHTML = "";

  const riskIssues = issues.filter((item) => item !== t("latexIssueEngineHint"));
  latexCompatSummary.textContent = riskIssues.length
    ? t("latexCompatSummaryIssues", { count: String(riskIssues.length) })
    : t("latexCompatSummaryOk");

  issues.forEach((message) => {
    const li = document.createElement("li");
    li.textContent = message;
    latexCompatList.appendChild(li);
  });

  latexCompatDialog.showModal();
}

function setLatexHintEnabled(enabled) {
  isLatexHintEnabled = !!enabled;
  window.localStorage.setItem(LATEX_HINT_STORAGE_KEY, isLatexHintEnabled ? "1" : "0");
  if (latexHintToggle) {
    latexHintToggle.checked = isLatexHintEnabled;
  }

  if (!isRenderEnabled) {
    return;
  }

  if (isLatexHintEnabled) {
    renderPreview(editor.value.split("\n"));
    if (activeSuspendRange) {
      suspendRangeForCursor(editor.value.split("\n"));
    }
    return;
  }

  renderLayer.querySelectorAll(".latex-compat-badge").forEach((badge) => badge.remove());
}

function clearOnboardingFocus() {
  document.querySelectorAll(".onboarding-focus").forEach((el) => {
    el.classList.remove("onboarding-focus");
  });
}

function resetOnboardingCardPosition() {
  if (!onboardingCard) return;
  onboardingCard.style.left = "";
  onboardingCard.style.top = "";
  onboardingCard.style.transform = "";
}

function positionFirstOnboardingCard() {
  if (!onboardingCard || !onboardingRenderTarget) return;

  const margin = 12;
  const gap = 14;
  const target = onboardingRenderTarget.getBoundingClientRect();
  const card = onboardingCard.getBoundingClientRect();
  const cardW = Math.max(320, card.width || 460);
  const cardH = Math.max(180, card.height || 240);
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;

  let left = target.right - cardW;
  left = Math.max(margin, Math.min(left, viewportW - cardW - margin));

  let top = target.bottom + gap;
  if (top + cardH > viewportH - margin) {
    top = target.top - cardH - gap;
  }
  top = Math.max(margin, Math.min(top, viewportH - cardH - margin));

  // If still overlapping target, prefer placing card to target's left/right side.
  const overlapsTarget = !(
    left + cardW < target.left
    || left > target.right
    || top + cardH < target.top
    || top > target.bottom
  );

  if (overlapsTarget) {
    const leftSide = target.left - cardW - gap;
    const rightSide = target.right + gap;
    if (leftSide >= margin) {
      left = leftSide;
    } else if (rightSide + cardW <= viewportW - margin) {
      left = rightSide;
    }
  }

  onboardingCard.style.left = `${Math.round(left)}px`;
  onboardingCard.style.top = `${Math.round(top)}px`;
  onboardingCard.style.transform = "none";
}

function finishOnboarding() {
  onboardingIndex = -1;
  forceMathKeyboardOpen = false;
  clearOnboardingFocus();
  resetOnboardingCardPosition();
  document.body.classList.remove("onboarding-open");
  if (onboardingCard) onboardingCard.setAttribute("aria-hidden", "true");
  if (onboardingOverlay) onboardingOverlay.setAttribute("aria-hidden", "true");
  toggleMathKeyboard();
}

function applyOnboardingStep(index) {
  const steps = getOnboardingSteps();

  if (index < 0 || index >= steps.length) {
    finishOnboarding();
    return;
  }

  onboardingIndex = index;
  const step = steps[index];

  clearOnboardingFocus();
  if (step.target) {
    step.target.classList.add("onboarding-focus");
    step.target.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }

  forceMathKeyboardOpen = step.target === mathKeyboard;
  if (forceMathKeyboardOpen) {
    setMathKeyboardOpen(true);
  } else {
    toggleMathKeyboard();
  }

  onboardingStep.textContent = step.title;
  onboardingTitle.textContent = step.heading;
  onboardingDesc.textContent = step.description;
  onboardingNextBtn.textContent = step.nextText;

  if (onboardingIndex === 0) {
    requestAnimationFrame(() => {
      positionFirstOnboardingCard();
    });
  } else {
    resetOnboardingCardPosition();
  }
}

function startOnboarding() {
  if (!onboardingCard || !onboardingOverlay || !onboardingNextBtn) {
    return;
  }

  document.body.classList.add("onboarding-open");
  onboardingCard.setAttribute("aria-hidden", "false");
  onboardingOverlay.setAttribute("aria-hidden", "false");
  applyOnboardingStep(0);
}

function isReloadNavigation() {
  const navigationEntry = performance.getEntriesByType("navigation")[0];
  return !!(navigationEntry && navigationEntry.type === "reload");
}

function setWelcomeScreenVisible(visible) {
  document.body.classList.toggle("welcome-open", visible);
  if (welcomeScreen) {
    welcomeScreen.setAttribute("aria-hidden", visible ? "false" : "true");
  }

  if (visible) {
    startWelcomeRain();
  } else {
    stopWelcomeRain();
  }
}

function startWorkspace({ firstOpen, showOnboarding }) {
  const shouldApplyStarter = firstOpen || editor.value.trim().length === 0;

  if (shouldApplyStarter) {
    editor.value = DEFAULT_STARTER_CONTENT;
  }

  const endPos = editor.value.length;
  editor.setSelectionRange(endPos, endPos);

  lineGuideToggle.checked = true;
  document.body.classList.add("show-line-guides");

  renderToggle.checked = true;
  setRenderMode(true);
  refreshAll();

  if (showOnboarding) {
    startOnboarding();
  }
}

function initializeDefaultState() {
  const firstOpen = !window.localStorage.getItem(FIRST_OPEN_STORAGE_KEY);
  const shouldShowWelcome = firstOpen || isReloadNavigation();

  const savedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  setLanguage(savedLocale === "en" ? "en" : "zh");
  const savedHints = window.localStorage.getItem(LATEX_HINT_STORAGE_KEY);
  setLatexHintEnabled(savedHints !== "0");
  initMathKeyboard();

  if (!shouldShowWelcome) {
    startWorkspace({ firstOpen: false, showOnboarding: false });
    return;
  }

  setWelcomeScreenVisible(true);

  const onChooseLanguage = (locale) => {
    setLanguage(locale);
    initMathKeyboard();
    setWelcomeScreenVisible(false);

    if (firstOpen) {
      window.localStorage.setItem(FIRST_OPEN_STORAGE_KEY, "1");
    }

    startWorkspace({
      firstOpen,
      showOnboarding: true,
    });
  };

  if (langEnBtn) {
    langEnBtn.onclick = () => onChooseLanguage("en");
  }

  if (langZhBtn) {
    langZhBtn.onclick = () => onChooseLanguage("zh");
  }
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
        case "insert-web-link":
          insertMarkdownLink("https://example.com");
          break;
        case "insert-image-link":
          insertMarkdownLink("https://example.com/image.png", true);
          break;
        case "insert-file-link":
          insertMarkdownLink("./path/to/file.ext");
          break;
        case "insert-image-link-from-clipboard":
          void insertImageLinkFromClipboard();
          break;
        default:
          break;
      }
    });
  });
}

editor.addEventListener("input", () => {
  const lines = editor.value.split("\n");

  if (isRenderEnabled) {
    updateLineNumbers(lines);
    suspendRangeForCursor(lines);
    // Re-apply measured render row heights after line-number nodes are rebuilt.
    // Without this, line numbers briefly fall back to default height while editing.
    syncRenderLineHeights();
    toggleMathKeyboard();
    updateCompatStats();
    syncOverlayScroll();
    updateRenderCaret();
    lastValue = editor.value;
    return;
  }

  const prevLength = lastValue.length;
  refreshAll();
  if (editor.value.length >= prevLength) {
    detectCodeTrigger();
  }
});

editor.addEventListener("click", toggleMathKeyboard);
editor.addEventListener("keyup", toggleMathKeyboard);
editor.addEventListener("click", () => {
  syncSuspendRangeFromCursor();
  updateRenderCaret();
});

editor.addEventListener("keyup", () => {
  syncSuspendRangeFromCursor();
  updateRenderCaret();
});

editor.addEventListener("focus", () => {
  syncSuspendRangeFromCursor();
  updateRenderCaret();
});

editor.addEventListener("select", () => {
  syncSuspendRangeFromCursor();
  updateRenderCaret();
});

document.addEventListener("selectionchange", () => {
  syncSuspendRangeFromCursor();
  syncRenderSelectionHighlightFromEditor();
});

editor.addEventListener("blur", (e) => {
  const next = e.relatedTarget;
  // 如果焦点移到数学键盘、对话框或对话框内的元素，保持键盘显示
  if (next && (mathKeyboard.contains(next) || mathTemplateDialog.contains(next) || next.closest("dialog"))) {
    return;
  }

  if (isRenderEnabled && activeSuspendRange) {
    scheduleRestoreRange(activeSuspendRange);
    activeSuspendRange = null;
  }

  activeRenderCaretLine = -1;
  resetPreviewCaretOffset();
  stopCaretRealignChecks();
  hideRenderCaret();

  setMathKeyboardOpen(false);
});

editor.addEventListener("scroll", () => {
  if (isAdjustingEditorScroll) {
    syncOverlayScroll();
    return;
  }

  if (isRenderEnabled) {
    syncOverlayScroll();
    return;
  }

  if (!isRenderEnabled) {
    renderLayer.scrollTop = editor.scrollTop;
  }
  syncOverlayScroll();
});

renderLayer.addEventListener("scroll", () => {
  if (!isRenderEnabled) {
    return;
  }
  if (isAdjustingEditorScroll || isAdjustingRenderScroll) {
    syncOverlayScroll();
    return;
  }
  // User is scrolling preview: do not pull view back to caret line.
  stopCaretRealignChecks();
  resetPreviewCaretOffset();
  isAdjustingEditorScroll = true;
  editor.scrollTop = clampEditorScrollTop(renderLayer.scrollTop);
  isAdjustingEditorScroll = false;
  updateRenderCaret();
  syncOverlayScroll();
});

let renderTouchStartY = null;

function scrollVisibleLayerBy(deltaY) {
  if (isRenderEnabled) {
    const max = Math.max(0, renderLayer.scrollHeight - renderLayer.clientHeight);
    const next = Math.max(0, Math.min(max, renderLayer.scrollTop + deltaY));
    if (Math.abs(next - renderLayer.scrollTop) < 0.5) return;
    renderLayer.scrollTop = next;
    syncOverlayScroll();
    return;
  }

  const next = clampEditorScrollTop(editor.scrollTop + deltaY);
  if (Math.abs(next - editor.scrollTop) < 0.5) return;
  isAdjustingEditorScroll = true;
  editor.scrollTop = next;
  isAdjustingEditorScroll = false;
  syncOverlayScroll();
}

renderLayer.addEventListener("wheel", (e) => {
  if (!isRenderEnabled) return;
  scrollVisibleLayerBy(e.deltaY);
  e.preventDefault();
}, { passive: false });

renderLayer.addEventListener("touchstart", (e) => {
  if (!isRenderEnabled) return;
  if (!e.touches || !e.touches.length) return;
  renderTouchStartY = e.touches[0].clientY;
}, { passive: true });

renderLayer.addEventListener("touchmove", (e) => {
  if (!isRenderEnabled) return;
  if (!e.touches || !e.touches.length || renderTouchStartY === null) return;

  const currentY = e.touches[0].clientY;
  const deltaY = renderTouchStartY - currentY;
  renderTouchStartY = currentY;

  scrollVisibleLayerBy(deltaY);
  e.preventDefault();
}, { passive: false });

renderLayer.addEventListener("touchend", () => {
  renderTouchStartY = null;
});

renderLayer.addEventListener("touchcancel", () => {
  renderTouchStartY = null;
});

// --- Render-mode drag selection ---
// Flag to suppress suspend/restore during drag so rendering stays frozen.
let isRenderDragging = false;
let renderDragState = null; // { startOffset }
let renderDragPointer = null; // { clientX, clientY }
let renderDragAutoScrollRafId = 0;
// Suppress the click event immediately following a drag release
let suppressNextRenderLayerClick = false;
function updateRenderDragSelectionAt(clientX, clientY) {
  if (!renderDragState || !isRenderEnabled) return;

  const lineIdx = getRenderLineIdxAtY(clientY);
  if (lineIdx === null) return;
  const endOffset = getTextareaOffsetAtPoint(lineIdx, clientX, clientY);

  // Skip if no change (avoids unnecessary DOM thrash)
  if (endOffset === renderDragState.lastEndOffset) return;
  renderDragState.lastEndOffset = endOffset;

  const selStart = Math.min(renderDragState.startOffset, endOffset);
  const selEnd = Math.max(renderDragState.startOffset, endOffset);

  applyRenderDragHighlight(selStart, selEnd);

  // Update textarea selection directly — isRenderDragging suppresses the
  // select/syncSuspendRangeFromCursor path so rendering won't flicker.
  editor.setSelectionRange(selStart, selEnd);
}

function stopRenderDragAutoScroll() {
  if (!renderDragAutoScrollRafId) return;
  window.cancelAnimationFrame(renderDragAutoScrollRafId);
  renderDragAutoScrollRafId = 0;
}

function tickRenderDragAutoScroll() {
  renderDragAutoScrollRafId = 0;
  if (!isRenderEnabled || !renderDragState || !renderDragPointer) return;

  const rect = renderLayer.getBoundingClientRect();
  const threshold = 28;
  let delta = 0;

  if (renderDragPointer.clientY < rect.top + threshold) {
    delta = -Math.min(18, Math.max(3, (rect.top + threshold - renderDragPointer.clientY) * 0.45));
  } else if (renderDragPointer.clientY > rect.bottom - threshold) {
    delta = Math.min(18, Math.max(3, (renderDragPointer.clientY - (rect.bottom - threshold)) * 0.45));
  }

  if (Math.abs(delta) >= 0.5) {
    scrollVisibleLayerBy(delta);
    updateRenderDragSelectionAt(renderDragPointer.clientX, renderDragPointer.clientY);
  }

  renderDragAutoScrollRafId = window.requestAnimationFrame(tickRenderDragAutoScroll);
}

function ensureRenderDragAutoScroll() {
  if (renderDragAutoScrollRafId) return;
  renderDragAutoScrollRafId = window.requestAnimationFrame(tickRenderDragAutoScroll);
}

// Find the closest render-line index to a given clientY using bounding-box search.
// Unlike elementFromPoint, this works even when the pointer is over child nodes
// (KaTeX elements, inline code, etc.) or in the gap between lines.
function getRenderLineIdxAtY(clientY) {
  const rows = Array.from(renderLayer.querySelectorAll(".render-line"));
  if (!rows.length) return null;

  let bestRow = null;
  let bestDist = Infinity;

  for (const row of rows) {
    const rect = row.getBoundingClientRect();
    if (clientY >= rect.top && clientY <= rect.bottom) {
      // Pointer is directly inside this row — exact hit
      const lineNum = Number(row.getAttribute("data-line") || "1");
      return Math.max(0, lineNum - 1);
    }
    // Distance to nearest edge of this row
    const dist = clientY < rect.top ? rect.top - clientY : clientY - rect.bottom;
    if (dist < bestDist) {
      bestDist = dist;
      bestRow = row;
    }
  }

  if (!bestRow) return null;
  const lineNum = Number(bestRow.getAttribute("data-line") || "1");
  return Math.max(0, lineNum - 1);
}

function getTextareaOffsetAtPoint(lineIdx, clientX, clientY) {
  const lines = editor.value.split("\n");
  const safeLine = Math.max(0, Math.min(lineIdx, lines.length - 1));
  const lineStart = getLineStartOffset(safeLine);
  const column = getLineColumnFromClientPoint(safeLine, clientX, clientY);
  return lineStart + column;
}

function clearRenderDragHighlight() {
  renderLayer.querySelectorAll(".render-selection-overlay").forEach((el) => el.remove());
  renderLayer.querySelectorAll(".render-line.is-drag-selected").forEach((el) => {
    el.classList.remove("is-drag-selected");
  });
}

function syncRenderSelectionHighlightFromEditor() {
  if (!isRenderEnabled) {
    clearRenderDragHighlight();
    return;
  }

  const selStart = editor.selectionStart;
  const selEnd = editor.selectionEnd;
  if (selStart === selEnd) {
    clearRenderDragHighlight();
    return;
  }

  applyRenderDragHighlight(Math.min(selStart, selEnd), Math.max(selStart, selEnd));
}

function applyRenderDragHighlight(startOffset, endOffset) {
  clearRenderDragHighlight();

  const value = editor.value;
  const lines = value.split("\n");
  const safeStart = Math.max(0, Math.min(startOffset, value.length));
  const safeEnd = Math.max(0, Math.min(endOffset, value.length));

  const fromOffset = Math.min(safeStart, safeEnd);
  const toOffset = Math.max(safeStart, safeEnd);

  const fromLineIdx = getLineIndexAtOffset(lines, fromOffset);
  const toProbeOffset = Math.max(fromOffset, toOffset - 1);
  const toLineIdx = getLineIndexAtOffset(lines, toProbeOffset);

  // Collect all text nodes in a rendered row in document order.
  function getTextNodes(row) {
    const nodes = [];
    const walker = document.createTreeWalker(row, NodeFilter.SHOW_TEXT, null);
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    return nodes;
  }

  // Given a list of text nodes and a character offset within their concatenated
  // text, return { node, offset } for use with DOM Range APIs.
  function resolveRenderedOffset(textNodes, offset) {
    let remaining = Math.max(0, offset);
    for (const tn of textNodes) {
      const len = tn.textContent.length;
      if (remaining <= len) return { node: tn, offset: remaining };
      remaining -= len;
    }
    const last = textNodes[textNodes.length - 1];
    return last ? { node: last, offset: last.textContent.length } : null;
  }

  function appendOverlay(row, left, width, top, height) {
    const overlay = document.createElement("span");
    overlay.className = "render-selection-overlay";
    overlay.style.left = `${Math.max(0, left)}px`;
    overlay.style.width = `${Math.max(2, width)}px`;
    overlay.style.top = `${Math.max(0, top + 2)}px`;
    overlay.style.height = `${Math.max(8, height - 4)}px`;
    row.appendChild(overlay);
  }

  for (let lineIdx = fromLineIdx; lineIdx <= toLineIdx; lineIdx += 1) {
    const row = renderLayer.querySelector(`.render-line[data-line="${lineIdx + 1}"]`);
    if (!row) continue;

    const lineText = lines[lineIdx] || "";
    const lineStart = getLineStartOffset(lineIdx);
    const lineEnd = lineStart + lineText.length;

    const segStart = Math.max(lineStart, fromOffset);
    const segEnd = Math.min(lineEnd, toOffset);
    const startCol = Math.max(0, segStart - lineStart);
    const endCol = Math.max(startCol, segEnd - lineStart);

    if (startCol === endCol && lineText.length > 0) continue;

    const rowRect = row.getBoundingClientRect();
    const rowWidth = Math.max(1, row.clientWidth);

    try {
      const textNodes = getTextNodes(row);
      const renderedLen = textNodes.reduce((s, n) => s + n.textContent.length, 0);

      // Map source columns to rendered text offsets proportionally.
      // For suspended (raw-text) rows the ratio is 1:1 and the result is exact.
      const ratio = lineText.length > 0 ? renderedLen / lineText.length : 1;
      const rStart = Math.round(Math.min(startCol * ratio, renderedLen));
      const rEnd = Math.round(Math.min(endCol * ratio, renderedLen));

      if (textNodes.length === 0) {
        // Empty rendered line — full-width overlay at top of row.
        appendOverlay(row, 0, rowWidth, 0, 22);
        continue;
      }

      const startNO = resolveRenderedOffset(textNodes, rStart);
      const endNO = resolveRenderedOffset(textNodes, rEnd);
      if (!startNO || !endNO) {
        appendOverlay(row, 0, rowWidth, 0, row.clientHeight || 22);
        continue;
      }

      const range = document.createRange();
      range.setStart(startNO.node, startNO.offset);
      range.setEnd(endNO.node, endNO.offset);

      // getClientRects returns one rect per visual sub-line — perfect for wrapping.
      const rects = Array.from(range.getClientRects());
      if (rects.length === 0) {
        // Collapsed or invisible range — draw a thin cursor-width strip.
        appendOverlay(row, 0, 2, 0, row.clientHeight || 22);
        continue;
      }
      for (const rect of rects) {
        appendOverlay(
          row,
          rect.left - rowRect.left,
          rect.width,
          rect.top - rowRect.top,
          rect.height,
        );
      }
    } catch (_) {
      // Fallback: highlight entire row segment.
      appendOverlay(row, 0, rowWidth, 0, row.clientHeight || 22);
    }
  }
}

renderLayer.addEventListener("mousedown", (e) => {
  if (!isRenderEnabled) return;
  // Only handle primary button
  if (e.button !== 0) return;
  const lineIdx = getRenderLineIdxAtY(e.clientY);
  if (lineIdx === null) return;
  const startOffset = getTextareaOffsetAtPoint(lineIdx, e.clientX, e.clientY);
  isRenderDragging = true;
  renderDragPointer = { clientX: e.clientX, clientY: e.clientY };
  renderDragState = { startOffset, lastEndOffset: startOffset };
  ensureRenderDragAutoScroll();
  e.preventDefault(); // Prevent browser text selection on renderLayer DOM
});

document.addEventListener("mousemove", (e) => {
  if (!renderDragState || !isRenderEnabled) return;
  renderDragPointer = { clientX: e.clientX, clientY: e.clientY };
  if (!(e.buttons & 1)) {
    // Button released outside window
    clearRenderDragHighlight();
    isRenderDragging = false;
    renderDragPointer = null;
    stopRenderDragAutoScroll();
    renderDragState = null;
    return;
  }

  updateRenderDragSelectionAt(e.clientX, e.clientY);
});

document.addEventListener("mouseup", (e) => {
  if (!renderDragState || !isRenderEnabled) return;
  const { startOffset, lastEndOffset } = renderDragState;
  const wasDrag = startOffset !== lastEndOffset;

  clearRenderDragHighlight();
  isRenderDragging = false;
  renderDragPointer = null;
  stopRenderDragAutoScroll();
  renderDragState = null;

  if (wasDrag) {
    const selStart = Math.min(startOffset, lastEndOffset);
    const selEnd = Math.max(startOffset, lastEndOffset);
    editor.focus();
    editor.setSelectionRange(selStart, selEnd);
    syncRenderSelectionHighlightFromEditor();
    // Suppress the click event that might be generated on mouseup
    suppressNextRenderLayerClick = true;
  }
});

renderLayer.addEventListener("click", (e) => {
  if (!isRenderEnabled) return;
  
  // Suppress click that immediately follows a drag release
  if (suppressNextRenderLayerClick) {
    suppressNextRenderLayerClick = false;
    return;
  }
  
  // Ignore synthetic clicks (e.detail === 0)
  if (e.detail === 0) return;

  const row = e.target.closest(".render-line");
  if (!row) return;

  const line = Number(row.getAttribute("data-line") || "1");
  const lineIdx = Math.max(0, line - 1);

  activeRenderCaretLine = lineIdx;
  const clickOffset = getTextareaOffsetAtPoint(lineIdx, e.clientX, e.clientY);
  editor.focus();
  editor.setSelectionRange(clickOffset, clickOffset);
  syncSuspendRangeFromCursor();
  updateRenderCaret();
  toggleMathKeyboard(); // Show math keyboard if cursor is in math mode
});

// Hide latex compat tooltip when clicking outside
document.addEventListener("click", (e) => {
  const tooltip = document.getElementById("latexCompatTooltip");
  if (tooltip && !tooltip.contains(e.target)) {
    const badge = e.target.closest(".latex-compat-badge");
    if (!badge) {
      hideLatexCompatTooltip();
    }
  }

  const formatSpaceTooltip = document.getElementById("formatSpaceTooltip");
  if (formatSpaceTooltip && !formatSpaceTooltip.contains(e.target)) {
    const warningBadge = e.target.closest(".format-space-warning-badge");
    if (!warningBadge) {
      hideFormatSpaceTooltip();
    }
  }
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
  } else if (key === "g" && e.shiftKey) {
    e.preventDefault();
    void insertImageLinkFromClipboard();
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
    window.alert(t("convertTableFailed"));
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

if (openLatexCompat) {
  openLatexCompat.addEventListener("click", () => {
    openLatexCompatibilityDialog();
  });
}

if (latexCompatClose) {
  latexCompatClose.addEventListener("click", () => {
    latexCompatDialog.close();
  });
}

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

  insertMathSnippet(snippet);
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

customMathBtn.addEventListener("click", () => {
  openCustomMathDialog();
});

customMathCancel.addEventListener("click", () => {
  customMathDialog.close();
  editor.focus();
});

customMathForm.addEventListener("submit", (e) => {
  e.preventDefault();
  updateCustomMathPreview();
  if (customMathSave.disabled) {
    return;
  }

  customMathItems.push({
    label: customMathLabelInput.value.trim(),
    display: customMathDisplayInput.value.trim(),
    snippet: customMathDisplayInput.value.trim(),
  });

  saveCustomMathItems();

  initMathKeyboard();
  customMathDialog.close();
  editor.focus();
});

[customMathLabelInput, customMathDisplayInput].forEach((input) => {
  input.addEventListener("input", updateCustomMathPreview);
});

customMathDialog.addEventListener("close", () => {
  customMathStatus.classList.remove("ok", "err");
});

lineGuideToggle.addEventListener("change", () => {
  document.body.classList.toggle("show-line-guides", lineGuideToggle.checked);
  refreshAll();
});

if (latexHintToggle) {
  latexHintToggle.addEventListener("change", () => {
    setLatexHintEnabled(latexHintToggle.checked);
  });
}

if (refreshRenderBtn) {
  refreshRenderBtn.addEventListener("click", () => {
    forceRefreshRenderAndChecks();
    editor.focus();
  });
}

renderToggle.addEventListener("change", () => {
  setRenderMode(renderToggle.checked);
});

window.addEventListener("resize", () => {
  resizeWelcomeRain();

  if (document.body.classList.contains("onboarding-open") && onboardingIndex === 0) {
    positionFirstOnboardingCard();
  }

  if (mathKeyboard.classList.contains("open")) {
    setMathKeyboardOpen(true);
  }
  refreshAll();
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopWelcomeRain();
    return;
  }

  if (document.body.classList.contains("welcome-open")) {
    startWelcomeRain();
  }
});

if (onboardingNextBtn) {
  onboardingNextBtn.addEventListener("click", () => {
    applyOnboardingStep(onboardingIndex + 1);
  });
}

if (onboardingOverlay) {
  onboardingOverlay.addEventListener("click", (e) => {
    e.preventDefault();
  });
}

loadCustomMathBinding();
bindToolbarActions();
initWelcomeRain();
initializeDefaultState();
