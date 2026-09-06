(function initLatexCompatModule(global) {
  const DB = global.LATEX_COMPAT_DATABASE;

  function hasMathContent(text) {
    if (!DB || !text) return false;
    return DB.patterns.hasMathHint.test(text);
  }

  function stripCodeFences(text) {
    // Keep GitHub math fences, but exclude ordinary fenced code from math checks.
    return (text || "").replace(/(^|\n)(`{3,}|~{3,})(?!\s*math\s*(?:\n|$))[^\n]*\n[\s\S]*?\n\2(?=\n|$)/g, "$1");
  }

  function extractMathExpressions(text) {
    const input = String(text || "");
    const out = [];

    function pushExpr(match, expr, delimiter, isBlock, start, end) {
      const trimmed = (expr || "").trim();
      if (!trimmed) return;
      out.push({
        raw: match,
        expr: trimmed,
        delimiter,
        isBlock,
        start,
        end,
      });
    }

    const blockRanges = [];
    const gfmInline = /\$`([\s\S]*?)`\$/g;
    let m;
    while ((m = gfmInline.exec(input))) {
      pushExpr(m[0], m[1], "inline-gfm", false, m.index, m.index + m[0].length);
      blockRanges.push([m.index, m.index + m[0].length]);
    }

    const dollarBlock = /\$\$([\s\S]*?)\$\$/g;
    while ((m = dollarBlock.exec(input))) {
      pushExpr(m[0], m[1], "block-dollar", true, m.index, m.index + m[0].length);
      blockRanges.push([m.index, m.index + m[0].length]);
    }

    const dollarInline = /(?<![\\$])\$(?!\$)((?:[^$\\]|\\[\s\S])*?)\$/g;
    while ((m = dollarInline.exec(input))) {
      const start = m.index;
      const inBlock = blockRanges.some(([s, e]) => start >= s && start < e);
      if (inBlock) continue;
      pushExpr(m[0], m[1], "inline-dollar", false, start, start + m[0].length);
    }

    const parenInline = /\\\(([\s\S]*?)\\\)/g;
    while ((m = parenInline.exec(input))) {
      pushExpr(m[0], m[1], "inline-paren", false, m.index, m.index + m[0].length);
    }

    const bracketBlock = /\\\[([\s\S]*?)\\\]/g;
    while ((m = bracketBlock.exec(input))) {
      pushExpr(m[0], m[1], "block-bracket", true, m.index, m.index + m[0].length);
    }

    const fencedMath = /(`{3,}|~{3,})\s*math\s*\n([\s\S]*?)\1/g;
    while ((m = fencedMath.exec(input))) {
      pushExpr(m[0], m[2], "fenced-math", true, m.index, m.index + m[0].length);
    }

    out.sort((a, b) => a.start - b.start || a.end - b.end);
    return out;
  }

  function collectDelimiterIssues(text) {
    const input = String(text || "");
    const issues = [];

    let inlineParenDepth = 0;
    let blockBracketDepth = 0;
    let inlineDollarOpen = false;

    for (let i = 0; i < input.length; i += 1) {
      const ch = input[i];
      const next = input[i + 1];
      const prev = input[i - 1];

      if (ch === "\\" && (next === "(" || next === ")" || next === "[" || next === "]")) {
        if (next === "(") inlineParenDepth += 1;
        if (next === ")") inlineParenDepth = Math.max(0, inlineParenDepth - 1);
        if (next === "[") blockBracketDepth += 1;
        if (next === "]") blockBracketDepth = Math.max(0, blockBracketDepth - 1);
        i += 1;
        continue;
      }

      if (ch !== "$") continue;
      if (prev === "\\") continue;

      if (next === "$") {
        i += 1;
        continue;
      }

      inlineDollarOpen = !inlineDollarOpen;
    }

    if (inlineParenDepth > 0) {
      issues.push("unmatched inline delimiter \\( ... \\)");
    }
    if (blockBracketDepth > 0) {
      issues.push("unmatched block delimiter \\[ ... \\]");
    }
    if (inlineDollarOpen) {
      issues.push("unmatched inline dollar delimiter $...$");
    }

    return issues;
  }

  function statusRank(status) {
    if (status === "risk") return 2;
    if (status === "partial") return 1;
    return 0;
  }

  function worstStatus(a, b) {
    return statusRank(a) >= statusRank(b) ? a : b;
  }

  function evaluateRendererForExpression(rendererName, exprInfo, options) {
    const renderer = DB.renderers[rendererName];
    const reasons = [];
    let status = "pass";

    const delim = exprInfo.delimiter;
    const delimSupported = renderer.supportsDelimiters.includes(delim);
    if (!delimSupported) {
      if ((renderer.configurableDelimiters || []).includes(delim)) {
        status = worstStatus(status, "partial");
        reasons.push(`delimiter ${delim} requires renderer configuration`);
      } else if (delim === "inline-paren" || delim === "block-bracket") {
        if (renderer.supportsParenDelimiters === "partial") {
          status = worstStatus(status, "partial");
          reasons.push("delimiter support depends on extensions/config");
        } else {
          status = worstStatus(status, "risk");
          reasons.push(`delimiter ${delim} is not supported`);
        }
      } else {
        status = worstStatus(status, "risk");
        reasons.push(`delimiter ${delim} is not supported`);
      }
    }

    const expr = exprInfo.expr;
    const hasCommandDef = DB.patterns.commandDefinition.test(expr);
    const hasMatrix = DB.patterns.matrixEnvironment.test(expr);

    if (rendererName === "GitHub") {
      if (hasCommandDef) {
        status = worstStatus(status, "partial");
        reasons.push("macro scope across separate GitHub expressions is not guaranteed by the documented syntax");
      }
      if (!exprInfo.isBlock && delim === "inline-dollar" && DB.patterns.tablePipe.test(expr)) {
        status = worstStatus(status, "partial");
        reasons.push("plain dollar math with a pipe can conflict with markdown tables; use GitHub's backtick form in tables");
      }
      if (hasMatrix && !exprInfo.isBlock) {
        status = worstStatus(status, "risk");
        reasons.push("matrix environments should be block math on GitHub");
      }
    }

    if (rendererName === "Pandoc") {
      if (hasCommandDef) {
        status = worstStatus(status, "partial");
        reasons.push("macro behavior depends on latex_macros extension and target writer");
      }
      if (delim === "inline-paren" || delim === "block-bracket") {
        status = worstStatus(status, "partial");
        reasons.push("requires tex_math_* extension when reading markdown");
      }
    }

    if (rendererName === "markdown-it" && (delim === "inline-paren" || delim === "block-bracket")) {
      status = worstStatus(status, "risk");
      reasons.push("default markdown-it-texmath dollars mode does not parse these delimiters");
    }

    if (rendererName === "Obsidian" && (delim === "inline-paren" || delim === "block-bracket")) {
      status = worstStatus(status, "risk");
      reasons.push("Obsidian docs recommend dollar delimiters for MathJax");
    }

    if (rendererName === "Stack Overflow" && (delim === "inline-paren" || delim === "block-bracket" || delim === "inline-gfm" || delim === "fenced-math")) {
      status = worstStatus(status, "risk");
      reasons.push("Stack Overflow authoring syntax uses dollar delimiters");
    }

    if ((rendererName === "KaTeX" || rendererName === "markdown-it") && hasCommandDef) {
      status = worstStatus(status, "partial");
      reasons.push("macro persistence can vary with runtime options");
    }

    if (typeof options.katexRender === "function") {
      const useKatexCheck = rendererName === "KaTeX" || rendererName === "markdown-it";
      if (useKatexCheck) {
        const ok = options.katexRender(expr, !!exprInfo.isBlock);
        if (!ok) {
          status = worstStatus(status, "risk");
          reasons.push("KaTeX parser rejected this expression");
        }
      }
      if (rendererName === "MathJax" || rendererName === "GitHub" || rendererName === "Obsidian" || rendererName === "Stack Overflow" || rendererName === "Jupyter" || rendererName === "Pandoc") {
        // Broad heuristic: if KaTeX fails badly, other engines may still work, but do not mark as fully pass.
        const ok = options.katexRender(expr, !!exprInfo.isBlock);
        if (!ok) {
          status = worstStatus(status, "partial");
          reasons.push("parser mismatch detected; verify on target renderer");
        }
      }
    }

    if (!reasons.length && status === "pass") {
      reasons.push("supported by known ruleset");
    }

    return { status, reasons };
  }

  function analyzeLine(line, options = {}) {
    const text = String(line || "");
    if (!hasMathContent(text)) return null;

    const delimiterIssues = collectDelimiterIssues(text);

    const expressions = extractMathExpressions(text);
    if (!expressions.length) {
      const reason = delimiterIssues[0] || "math syntax detected but no valid math expression extracted";
      return {
        hasMath: true,
        expressions: [],
        rendererSummary: {},
        ok: [],
        failed: Object.keys(DB.renderers).map((name) => ({ engine: name, reason })),
        risky: true,
      };
    }

    const rendererSummary = {};
    Object.keys(DB.renderers).forEach((rendererName) => {
      rendererSummary[rendererName] = {
        status: "pass",
        reasons: [],
      };
    });

    expressions.forEach((exprInfo) => {
      Object.keys(DB.renderers).forEach((rendererName) => {
        const result = evaluateRendererForExpression(rendererName, exprInfo, options);
        const current = rendererSummary[rendererName];
        current.status = worstStatus(current.status, result.status);
        current.reasons = current.reasons.concat(result.reasons.map((r) => `${exprInfo.raw}: ${r}`));
      });
    });

    if (delimiterIssues.length) {
      Object.keys(DB.renderers).forEach((rendererName) => {
        const current = rendererSummary[rendererName];
        current.status = worstStatus(current.status, "risk");
        current.reasons = current.reasons.concat(delimiterIssues.map((item) => `line syntax: ${item}`));
      });
    }

    const ok = [];
    const failed = [];
    Object.keys(rendererSummary).forEach((rendererName) => {
      const item = rendererSummary[rendererName];
      if (item.status === "pass") {
        ok.push(rendererName);
      } else {
        failed.push({
          engine: rendererName,
          reason: item.reasons[0] || (item.status === "partial" ? "partial support" : "unsupported syntax"),
        });
      }
    });

    return {
      hasMath: true,
      expressions,
      rendererSummary,
      ok,
      failed,
      risky: ok.length === 0,
    };
  }

  function analyzeDocument(markdown, options = {}) {
    const text = String(markdown || "");
    const lines = text.split("\n");
    const lineReports = [];
    const issues = [];

    const noCode = stripCodeFences(text);
    const expressions = extractMathExpressions(noCode);
    const unparsed = Array.from(noCode);
    expressions.forEach((expr) => {
      for (let i = expr.start; i < expr.end; i += 1) unparsed[i] = " ";
      const line = noCode.slice(0, expr.start).split("\n").length;
      const report = analyzeLine(expr.raw, options);
      if (report) lineReports.push({ line, report });
    });

    if (/(?<!\\)\$/.test(unparsed.join(""))) {
      issues.push({ key: "latexIssueUnmatchedDollar", severity: "risk" });
    }

    if (/\\\(|\\\)|\\\[|\\\]/.test(noCode)) {
      issues.push({ key: "latexIssueParenDelimiters", severity: "partial" });
    }

    const codeFencePattern = /(^|\n)(`{3,}|~{3,})(?!\s*math\s*(?:\n|$))[^\n]*\n[\s\S]*?\n\2(?=\n|$)/g;
    const codeBlocks = text.match(codeFencePattern) || [];
    if (codeBlocks.some((block) => /(?<!\\)\$|\\begin\{/.test(block))) {
      issues.push({ key: "latexIssueCodeFenceMath", severity: "partial" });
    }

    lines.forEach((line, index) => {
      const inlineExpressions = extractMathExpressions(line).filter((item) => !item.isBlock);
      if (inlineExpressions.some((item) => item.delimiter === "inline-dollar" && /(?<!\\)\|/.test(item.expr))) {
        issues.push({ key: "latexIssueTableMath", severity: "partial", line: index + 1 });
      }
    });

    issues.push({ key: "latexIssueEngineHint", severity: "info" });

    return {
      version: DB.version,
      sources: DB.sources,
      lineReports,
      issues,
    };
  }

  function getRendererNames() {
    return DB ? Object.keys(DB.renderers) : [];
  }

  global.LatexCompatModule = {
    hasMathContent,
    extractMathExpressions,
    analyzeLine,
    analyzeDocument,
    getRendererNames,
    database: DB,
  };
})(window);
