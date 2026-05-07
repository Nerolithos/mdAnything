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
const customMathBtn = document.getElementById("customMathBtn");
const customMathDialog = document.getElementById("customMathDialog");
const customMathForm = document.getElementById("customMathForm");
const customMathLabelInput = document.getElementById("customMathLabelInput");
const customMathDisplayInput = document.getElementById("customMathDisplayInput");
const customMathPreview = document.getElementById("customMathPreview");
const customMathStatus = document.getElementById("customMathStatus");
const customMathCancel = document.getElementById("customMathCancel");
const customMathSave = document.getElementById("customMathSave");
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

const CUSTOM_MATH_STORAGE_KEY = "mdAnything.customMathItems";
const FIRST_OPEN_STORAGE_KEY = "mdAnything.firstOpenDone";
const LOCALE_STORAGE_KEY = "mdAnything.locale";
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
    lineGuideToggle: "行辅助线",
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
    lineGuideToggle: "Line Guides",
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

  const htmlParts = [];

  for (let idx = 0; idx < lines.length; idx += 1) {
    const line = lines[idx];
    const fenceMatch = line.match(/^\s*```([\w+-]*)\s*$/);
    if (fenceMatch) {
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

      const tableBlock = lines.slice(idx, end).join("\n");
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
  if (forceMathKeyboardOpen) {
    setMathKeyboardOpen(true);
    return;
  }

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
  if (isRenderEnabled) return;

  let cursor = editor.selectionStart;
  const value = editor.value;
  const mode = getMathModeAtCursor(value, cursor);
  if (!mode) return;

  const rightPart = value.slice(cursor);
  if (/^\s*\$\$/.test(rightPart) || /^\s*\$/.test(rightPart)) {
    return;
  }

  e.preventDefault();

  if (cursor > 0 && value[cursor - 1] === " ") {
    editor.setRangeText("", cursor - 1, cursor, "end");
    cursor -= 1;
  }

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
