(function initLatexCompatDatabase(global) {
  const LATEX_COMPAT_DATABASE = {
    version: "2026-05-10",
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
        url: "https://obsidian.md/help/Editing+and+formatting/Advanced+formatting+syntax#Math",
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
        supportsDelimiters: ["inline-dollar", "block-dollar", "inline-paren", "block-bracket"],
        supportsParenDelimiters: true,
      },
      GitHub: {
        id: "github",
        supportsDelimiters: ["inline-dollar", "block-dollar", "fenced-math"],
        supportsParenDelimiters: false,
      },
      Obsidian: {
        id: "obsidian",
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
      },
      "markdown-it": {
        id: "markdown-it",
        supportsDelimiters: ["inline-dollar", "block-dollar"],
        supportsParenDelimiters: false,
      },
    },
    patterns: {
      hasMathHint: /(?<!\\)\$|\\\(|\\\)|\\\[|\\\]|\\begin\{|\\end\{|```\s*math/,
      commandDefinition: /\\newcommand|\\renewcommand|\\providecommand|\\def\s*\\|\\gdef/,
      matrixEnvironment: /\\begin\{(matrix|pmatrix|bmatrix|Bmatrix|vmatrix|Vmatrix|array|smallmatrix)/,
      alignEnvironment: /\\begin\{align\*?\}|\\begin\{aligned\}/,
      tablePipe: /\|/,
    },
  };

  global.LATEX_COMPAT_DATABASE = LATEX_COMPAT_DATABASE;
})(window);
