(function initLatexCompatDatabase(global) {
  const LATEX_COMPAT_DATABASE = {
    version: "2026-09-06",
    sources: [
      {
        name: "GitHub math expressions",
        url: "https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/writing-mathematical-expressions",
      },
      {
        name: "KaTeX supported functions",
        url: "https://katex.org/docs/supported.html",
      },
      {
        name: "MathJax TeX support",
        url: "https://docs.mathjax.org/en/latest/input/tex/macros/",
      },
      {
        name: "Obsidian advanced formatting syntax",
        url: "https://help.obsidian.md/advanced-syntax#Math",
      },
      {
        name: "Stack Exchange MathJax guidance",
        url: "https://math.meta.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference",
      },
      {
        name: "Jupyter notebook typesetting equations",
        url: "https://jupyter-notebook.readthedocs.io/en/stable/examples/Notebook/Typesetting%20Equations.html",
      },
      {
        name: "Pandoc manual (math)",
        url: "https://pandoc.org/MANUAL.html#math",
      },
    ],
    renderers: {
      KaTeX: {
        id: "katex",
        supportsDelimiters: ["inline-dollar", "block-dollar"],
        supportsParenDelimiters: false,
      },
      MathJax: {
        id: "mathjax",
        // MathJax itself does not enable single-dollar inline math by default.
        supportsDelimiters: ["block-dollar", "inline-paren", "block-bracket"],
        supportsParenDelimiters: true,
        configurableDelimiters: ["inline-dollar"],
      },
      GitHub: {
        id: "github",
        supportsDelimiters: ["inline-dollar", "inline-gfm", "block-dollar", "fenced-math"],
        supportsParenDelimiters: false,
      },
      Obsidian: {
        id: "obsidian",
        supportsDelimiters: ["inline-dollar", "block-dollar"],
        supportsParenDelimiters: false,
      },
      "Stack Overflow": {
        id: "stackoverflow",
        supportsDelimiters: ["inline-dollar", "block-dollar"],
        supportsParenDelimiters: false,
      },
      Jupyter: {
        id: "jupyter",
        supportsDelimiters: ["inline-dollar", "block-dollar", "inline-paren", "block-bracket"],
        supportsParenDelimiters: true,
      },
      Pandoc: {
        id: "pandoc",
        supportsDelimiters: ["inline-dollar", "block-dollar"],
        supportsParenDelimiters: "partial",
        configurableDelimiters: ["inline-gfm", "fenced-math"],
      },
      "markdown-it": {
        id: "markdown-it",
        supportsDelimiters: ["inline-dollar", "block-dollar"],
        supportsParenDelimiters: false,
      },
    },
    patterns: {
      hasMathHint: /(?<!\\)\$|\\\(|\\\)|\\\[|\\\]|\\begin\{|\\end\{|(?:`{3,}|~{3,})\s*math/,
      commandDefinition: /\\newcommand|\\renewcommand|\\providecommand|\\def\s*\\|\\gdef/,
      matrixEnvironment: /\\begin\{(matrix|pmatrix|bmatrix|Bmatrix|vmatrix|Vmatrix|array|smallmatrix)/,
      alignEnvironment: /\\begin\{align\*?\}|\\begin\{aligned\}/,
      tablePipe: /\|/,
    },
  };

  global.LATEX_COMPAT_DATABASE = LATEX_COMPAT_DATABASE;
})(window);
