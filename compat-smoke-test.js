global.window = global;

const fs = require("fs");
const assert = require("assert");

eval(fs.readFileSync("latex-compat-db.js", "utf8"));
eval(fs.readFileSync("latex-compat.js", "utf8"));

const rendererOrder = Object.keys(window.LATEX_COMPAT_DATABASE.renderers);

const lineCases = [
  { name: "inline_basic", expr: "$a^2+b^2=c^2$" },
  { name: "block_equation", expr: "$$\\begin{equation}E=mc^2\\end{equation}$$" },
  { name: "align_env", expr: "$$\\begin{align}a&=b\\\\c&=d\\end{align}$$" },
  { name: "alignat_env", expr: "$$\\begin{alignat}{2}x&=1&y&=2\\\\u&=3&v&=4\\end{alignat}$$" },
  { name: "gather_env", expr: "$$\\begin{gather}a=b\\\\c=d\\end{gather}$$" },
  { name: "split_env", expr: "$$\\begin{equation}\\begin{split}a&=b+c\\\\&=d+e\\end{split}\\end{equation}$$" },
  { name: "matrix_env", expr: "$$\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}$$" },
  { name: "pmatrix_env", expr: "$$\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}$$" },
  { name: "cases_env", expr: "$$f(x)=\\begin{cases}x&x>0\\\\0&x\\le 0\\end{cases}$$" },
  { name: "smallmatrix_env", expr: "$$\\begin{smallmatrix}a&b\\\\c&d\\end{smallmatrix}$$" },
  { name: "paren_delim", expr: "\\(a+b\\)" },
  { name: "bracket_delim", expr: "\\[a+b\\]" },
  { name: "newcommand", expr: "$$\\newcommand{\\R}{\\mathbb{R}} \\R$$" },
  { name: "inline_pipe", expr: "$a|b$" },
  {
    name: "fenced_math_block",
    expr: [
      "```math",
      "\\int_0^1 x^2 dx",
      "```",
    ].join("\n"),
  },
  { name: "github_protected_inline", expr: "$`a|b`$" },
];

function formatSummary(rendererSummary) {
  return rendererOrder
    .map((name) => {
      const item = rendererSummary && rendererSummary[name];
      return `${name}:${item ? item.status : "n/a"}`;
    })
    .join(" | ");
}

console.log("RENDERERS", rendererOrder.join(","));

for (const testCase of lineCases) {
  const report = window.LatexCompatModule.analyzeLine(testCase.expr);
  if (!report) {
    console.log(`CASE ${testCase.name} => NO_MATH_DETECTED`);
    continue;
  }
  console.log(`CASE ${testCase.name} => ${formatSummary(report.rendererSummary)}`);
}

const api = window.LatexCompatModule;

assert.deepStrictEqual(
  api.extractMathExpressions("GitHub $`a|b`$").map((item) => item.delimiter),
  ["inline-gfm"],
  "GitHub protected inline math must be recognized once, not as dollar math"
);

const githubInline = api.analyzeLine("$`a|b`$");
assert.strictEqual(githubInline.rendererSummary.GitHub.status, "pass");
assert.strictEqual(githubInline.rendererSummary["Stack Overflow"].status, "risk");

const defaultMathJax = api.analyzeLine("$x$");
assert.strictEqual(defaultMathJax.rendererSummary.MathJax.status, "partial");
assert.match(defaultMathJax.rendererSummary.MathJax.reasons.join(" "), /requires renderer configuration/);

const multiline = api.analyzeDocument("before\n\n$$\n\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}\n$$\n\nafter");
assert.strictEqual(multiline.lineReports.length, 1, "multiline display math must be analyzed as one expression");
assert.strictEqual(multiline.lineReports[0].line, 3);
assert.ok(!multiline.issues.some((item) => item.key === "latexIssueUnmatchedDollar"));

const ordinaryFence = api.analyzeDocument("```js\nconst price = '$5';\n```");
assert.ok(ordinaryFence.issues.some((item) => item.key === "latexIssueCodeFenceMath"));
assert.ok(!ordinaryFence.issues.some((item) => item.key === "latexIssueUnmatchedDollar"));

const mathFence = api.analyzeDocument("```math\na+b\n```");
assert.strictEqual(mathFence.lineReports.length, 1);
assert.ok(!mathFence.issues.some((item) => item.key === "latexIssueCodeFenceMath"));

console.log("ASSERTIONS passed");
