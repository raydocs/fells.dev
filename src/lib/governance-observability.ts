export type CliToolId = "claude-code" | "codex" | "cursor" | "cline" | "opencode";
export type CliOsTab = "unix" | "powershell";
export type RouteClass = "cc" | "cc-thin" | "non-cc";

interface CliOnboardingBundle {
  id: CliToolId;
  tool: CliToolId;
  os: CliOsTab;
  baseUrl: string;
  endpoint: string;
  routeClass: RouteClass;
  expectedRouteClass: RouteClass;
  shellSnippet: string;
  envSnippet: string;
  configPath: string;
  configSnippet: string;
  configGeneratorSnippet: string;
  verifyCommand: string;
  notes: string[];
  defaultLatencyMs: number;
}

const shQuote = (value: string) => `'${String(value).replace(/'/g, `'\\''`)}'`;
const psQuote = (value: string) => `'${String(value).replace(/'/g, "''")}'`;

export function generateCliToolOnboarding(
  tool: CliToolId,
  os: CliOsTab,
  origin: string,
  modelOrKey = "claude-opus-5-5",
  keyPlaceholder = "YOUR_FELLS_API_KEY",
): CliOnboardingBundle {
  const cleanOrigin = origin.replace(/\/+$/, "") || "https://api.fells.dev";
  const v1Origin = `${cleanOrigin}/v1`;
  const looksLikeKey = modelOrKey.startsWith("sk-") || modelOrKey.includes("YOUR_") || modelOrKey.includes("KEY");
  const safeKey = (looksLikeKey ? modelOrKey : keyPlaceholder).trim() || "YOUR_FELLS_API_KEY";
  const rawModel = (looksLikeKey ? keyPlaceholder : modelOrKey).trim();
  const safeModel =
    !rawModel || rawModel.startsWith("sk-") || rawModel.includes("YOUR_")
      ? tool === "codex"
        ? "gpt-6.1-sol"
        : "claude-opus-5-5"
      : rawModel;

  if (tool === "claude-code") {
    const settingsJson = JSON.stringify(
      {
        model: safeModel,
        env: {
          ANTHROPIC_BASE_URL: cleanOrigin,
          ANTHROPIC_AUTH_TOKEN: safeKey,
        },
      },
      null,
      2,
    );
    const shellSnippet =
      os === "powershell"
        ? `$env:ANTHROPIC_BASE_URL = ${psQuote(cleanOrigin)}\n$env:ANTHROPIC_AUTH_TOKEN = ${psQuote(safeKey)}\nclaude --model ${psQuote(safeModel)}`
        : `export ANTHROPIC_BASE_URL=${shQuote(cleanOrigin)}\nexport ANTHROPIC_AUTH_TOKEN=${shQuote(safeKey)}\nclaude --model ${shQuote(safeModel)}`;
    const configSnippet =
      os === "powershell"
        ? `$dir = Join-Path $HOME ".claude"\nNew-Item -ItemType Directory -Force -Path $dir | Out-Null\n@'\n${settingsJson}\n'@ | Set-Content -Path (Join-Path $dir "settings.json") -Encoding UTF8`
        : `mkdir -p ~/.claude && cat <<'EOF' > ~/.claude/settings.json\n${settingsJson}\nEOF`;
    return {
      id: tool,
      tool,
      os,
      baseUrl: cleanOrigin,
      endpoint: "/v1/messages",
      routeClass: "cc",
      expectedRouteClass: "cc",
      shellSnippet,
      envSnippet: shellSnippet,
      configPath: os === "powershell" ? "%USERPROFILE%\\.claude\\settings.json" : "~/.claude/settings.json",
      configSnippet,
      configGeneratorSnippet: configSnippet,
      verifyCommand: "claude /status",
      notes: ["Anthropic Messages native wire", "Sticky LCP session lease enabled", "5m/1h Prompt Cache active"],
      defaultLatencyMs: 38,
    };
  }

  if (tool === "codex") {
    const codexModel = safeModel.startsWith("claude") ? "gpt-6.1-sol" : safeModel;
    const toml = [
      `model = ${JSON.stringify(codexModel)}`,
      `model_provider = "fells"`,
      `model_reasoning_effort = "high"`,
      ``,
      `[model_providers.fells]`,
      `name = "Fells"`,
      `base_url = ${JSON.stringify(v1Origin)}`,
      `wire_api = "responses"`,
      `experimental_bearer_token = ${JSON.stringify(safeKey)}`,
    ].join("\n");
    const shellSnippet =
      os === "powershell"
        ? `$env:OPENAI_BASE_URL = ${psQuote(v1Origin)}\n$env:OPENAI_API_KEY = ${psQuote(safeKey)}\ncodex --model ${psQuote(codexModel)}`
        : `export OPENAI_BASE_URL=${shQuote(v1Origin)}\nexport OPENAI_API_KEY=${shQuote(safeKey)}\ncodex --model ${shQuote(codexModel)}`;
    const configSnippet =
      os === "powershell"
        ? `$dir = Join-Path $HOME ".codex"\nNew-Item -ItemType Directory -Force -Path $dir | Out-Null\n@'\n${toml}\n'@ | Set-Content -Path (Join-Path $dir "config.toml") -Encoding UTF8`
        : `mkdir -p ~/.codex && cat <<'EOF' > ~/.codex/config.toml\n${toml}\nEOF`;
    return {
      id: tool,
      tool,
      os,
      baseUrl: v1Origin,
      endpoint: "/v1/responses",
      routeClass: "non-cc",
      expectedRouteClass: "non-cc",
      shellSnippet,
      envSnippet: shellSnippet,
      configPath: os === "powershell" ? "%USERPROFILE%\\.codex\\config.toml" : "~/.codex/config.toml",
      configSnippet,
      configGeneratorSnippet: configSnippet,
      verifyCommand: `codex --model ${codexModel} "ping"`,
      notes: ["OpenAI Responses wire API", "High reasoning effort enabled"],
      defaultLatencyMs: 44,
    };
  }

  if (tool === "cursor") {
    const cursorConfig = JSON.stringify(
      {
        "cursor.openaiBaseUrl": v1Origin,
        "cursor.anthropicBaseUrl": cleanOrigin,
        "cursor.model": safeModel,
        "cursor.apiKey": safeKey,
      },
      null,
      2,
    );
    const shellSnippet =
      os === "powershell"
        ? `$env:OPENAI_BASE_URL = ${psQuote(v1Origin)}\n$env:OPENAI_API_KEY = ${psQuote(safeKey)}\n# Cursor Settings -> Models -> Override OpenAI Base URL: ${v1Origin}`
        : `export OPENAI_BASE_URL=${shQuote(v1Origin)}\nexport OPENAI_API_KEY=${shQuote(safeKey)}\n# Cursor Settings -> Models -> Override OpenAI Base URL: ${v1Origin}`;
    const configSnippet =
      os === "powershell"
        ? `$dir = Join-Path $PWD ".cursor"\nNew-Item -ItemType Directory -Force -Path $dir | Out-Null\n@'\n${cursorConfig}\n'@ | Set-Content -Path (Join-Path $dir "fells-models.json") -Encoding UTF8`
        : `mkdir -p .cursor && cat <<'EOF' > .cursor/fells-models.json\n${cursorConfig}\nEOF`;
    return {
      id: tool,
      tool,
      os,
      baseUrl: v1Origin,
      endpoint: "/v1/chat/completions",
      routeClass: "non-cc",
      expectedRouteClass: "non-cc",
      shellSnippet,
      envSnippet: shellSnippet,
      configPath: ".cursor/fells-models.json",
      configSnippet,
      configGeneratorSnippet: configSnippet,
      verifyCommand: "Cursor -> Models -> Verify",
      notes: ["OpenAI-compatible /v1 override", "Supports streaming & tool calls"],
      defaultLatencyMs: 49,
    };
  }

  if (tool === "cline") {
    const clineJson = JSON.stringify(
      {
        "cline.apiProvider": "anthropic",
        "cline.anthropicBaseUrl": cleanOrigin,
        "cline.apiModelId": safeModel,
        "cline.apiKey": safeKey,
        "cline.promptCachingEnabled": true,
      },
      null,
      2,
    );
    const shellSnippet =
      os === "powershell"
        ? `$env:ANTHROPIC_BASE_URL = ${psQuote(cleanOrigin)}\n$env:ANTHROPIC_API_KEY = ${psQuote(safeKey)}\ncode --install-extension saoudrizwan.claude-dev`
        : `export ANTHROPIC_BASE_URL=${shQuote(cleanOrigin)}\nexport ANTHROPIC_API_KEY=${shQuote(safeKey)}\ncode --install-extension saoudrizwan.claude-dev`;
    const configSnippet =
      os === "powershell"
        ? `$dir = Join-Path $PWD ".vscode"\nNew-Item -ItemType Directory -Force -Path $dir | Out-Null\n@'\n${clineJson}\n'@ | Set-Content -Path (Join-Path $dir "settings.json") -Encoding UTF8`
        : `mkdir -p .vscode && cat <<'EOF' > .vscode/settings.json\n${clineJson}\nEOF`;
    return {
      id: tool,
      tool,
      os,
      baseUrl: cleanOrigin,
      endpoint: "/v1/messages",
      routeClass: "cc-thin",
      expectedRouteClass: "cc-thin",
      shellSnippet,
      envSnippet: shellSnippet,
      configPath: ".vscode/settings.json",
      configSnippet,
      configGeneratorSnippet: configSnippet,
      verifyCommand: "Cline / Roo Code -> API Configuration -> Check",
      notes: ["Anthropic Messages thin client (cc-thin)", "Prompt caching enabled"],
      defaultLatencyMs: 41,
    };
  }

  // opencode
  const opencodeJson = JSON.stringify(
    {
      $schema: "https://opencode.ai/config.json",
      model: `fells/${safeModel}`,
      provider: {
        fells: {
          npm: "@ai-sdk/anthropic",
          options: {
            baseURL: v1Origin,
            apiKey: safeKey,
          },
        },
      },
    },
    null,
    2,
  );
  const shellSnippet =
    os === "powershell"
      ? `$env:ANTHROPIC_BASE_URL = ${psQuote(cleanOrigin)}\n$env:ANTHROPIC_API_KEY = ${psQuote(safeKey)}\nopencode -m ${psQuote(`fells/${safeModel}`)}`
      : `export ANTHROPIC_BASE_URL=${shQuote(cleanOrigin)}\nexport ANTHROPIC_API_KEY=${shQuote(safeKey)}\nopencode -m ${shQuote(`fells/${safeModel}`)}`;
  const configSnippet =
    os === "powershell"
      ? `$dir = Join-Path $HOME ".config\\opencode"\nNew-Item -ItemType Directory -Force -Path $dir | Out-Null\n@'\n${opencodeJson}\n'@ | Set-Content -Path (Join-Path $dir "opencode.json") -Encoding UTF8`
      : `mkdir -p ~/.config/opencode && cat <<'EOF' > ~/.config/opencode/opencode.json\n${opencodeJson}\nEOF`;
  return {
    id: tool,
    tool,
    os,
    baseUrl: cleanOrigin,
    endpoint: "/v1/messages",
    routeClass: "cc-thin",
    expectedRouteClass: "cc-thin",
    shellSnippet,
    envSnippet: shellSnippet,
    configPath: "~/.config/opencode/opencode.json",
    configSnippet,
    configGeneratorSnippet: configSnippet,
    verifyCommand: `opencode -m fells/${safeModel}`,
    notes: ["OpenCode AI SDK Anthropic provider", "Supports session prefix caching"],
    defaultLatencyMs: 43,
  };
}

export interface InspectedLogRecord {
  id: string;
  isSample?: boolean;
  label?: string;
  created_at?: number;
  ts?: number;
  model: string;
  key_name?: string;
  key_prefix?: string;
  protocol?: string;
  status: number;
  latency_ms: number;
  ttft_ms?: number;
  tokens_in?: number;
  tokens_out?: number;
  tokens_cache_r?: number;
  tokens_cache_w?: number;
  tokens_cache_w1h?: number;
  input_tokens?: number;
  output_tokens?: number;
  thinking_tokens?: number;
  cache_read_tokens?: number;
  cache_write_5m_tokens?: number;
  cache_write_1h_tokens?: number;
  system_tokens?: number;
  tools_tokens?: number;
  history_tokens?: number;
  route_class?: RouteClass;
  lease_seat?: string;
  lcp_affinity_pct?: number;
  egress_score?: number;
  retries?: number;
  group_multiplier?: number;
  allow_micro: number;
  list_micro?: number;
  cash_micro?: number;
  grant_micro?: number;
  seat_covered?: boolean;
}

interface ContextSegment {
  key: "system" | "tools" | "history" | "input" | "output" | "thinking";
  tokens: number;
  pct: number;
  color: string;
}

interface ContextCompositionResult {
  totalTokens: number;
  segments: ContextSegment[];
}

export function computeContextComposition(row: Partial<InspectedLogRecord>): ContextCompositionResult {
  const rawIn = Math.max(0, Number(row.tokens_in ?? row.input_tokens ?? 0));
  const rawOut = Math.max(0, Number(row.tokens_out ?? row.output_tokens ?? 0));
  const cacheR = Math.max(0, Number(row.tokens_cache_r ?? row.cache_read_tokens ?? 0));
  const cacheW = Math.max(0, Number(row.tokens_cache_w ?? row.cache_write_5m_tokens ?? 0));
  const cacheW1h = Math.max(0, Number(row.tokens_cache_w1h ?? row.cache_write_1h_tokens ?? 0));
  const protocol = String(row.protocol || (String(row.model || "").includes("claude") ? "anthropic" : "openai"));
  const totalInputPool = protocol === "anthropic" ? rawIn + cacheR + cacheW + cacheW1h : Math.max(rawIn, cacheR) + cacheW + cacheW1h;

  const hasExplicit =
    row.system_tokens !== undefined ||
    row.tools_tokens !== undefined ||
    row.history_tokens !== undefined;

  let system = Math.max(0, Number(row.system_tokens ?? 0));
  let tools = Math.max(0, Number(row.tools_tokens ?? 0));
  let history = Math.max(0, Number(row.history_tokens ?? 0));
  let input = Math.max(0, Number(row.input_tokens ?? row.tokens_in ?? 0));
  let output = Math.max(0, Number(row.output_tokens ?? row.tokens_out ?? 0));
  let thinking = Math.max(0, Number(row.thinking_tokens ?? 0));

  if (!hasExplicit) {
    system = Math.round(totalInputPool * 0.16);
    tools = Math.round(totalInputPool * 0.22);
    history = Math.round(totalInputPool * 0.48);
    input = Math.max(0, totalInputPool - system - tools - history);
    const modelStr = String(row.model || "").toLowerCase();
    const hasReasoning = modelStr.includes("opus") || modelStr.includes("sonnet") || modelStr.includes("sol") || modelStr.includes("o3");
    if (thinking === 0 && hasReasoning) {
      thinking = Math.round(rawOut * 0.38);
      output = Math.max(0, rawOut - thinking);
    }
  }

  const totalTokens = Math.max(1, system + tools + history + input + output + thinking);
  const rawSegments: Array<{ key: ContextSegment["key"]; tokens: number; color: string }> = [
    { key: "system", tokens: system, color: "#7c8cff" },
    { key: "tools", tokens: tools, color: "#38bdf8" },
    { key: "history", tokens: history, color: "#10b981" },
    { key: "input", tokens: input, color: "#f59e0b" },
    { key: "output", tokens: output, color: "#e07a55" },
    { key: "thinking", tokens: thinking, color: "#a855f7" },
  ];

  let allocatedPct = 0;
  const segments: ContextSegment[] = rawSegments.map((seg, idx) => {
    const pct =
      idx === rawSegments.length - 1
        ? Math.max(0, Number((100 - allocatedPct).toFixed(1)))
        : Number(((seg.tokens / totalTokens) * 100).toFixed(1));
    allocatedPct += pct;
    return { ...seg, pct };
  });

  return {
    totalTokens: system + tools + history + input + output + thinking,
    segments,
  };
}

interface CacheSavingsResult {
  cacheReadTokens: number;
  cacheWrite5mTokens: number;
  cacheWrite1hTokens: number;
  hitRatePct: number;
  savedUsd: number;
  savedCny: number;
  savedUsdSingle: number;
  savedCnySingle: number;
  windowSavedUsd: number;
  windowSavedCny: number;
  savedUsdWindow: number;
  savedCnyWindow: number;
}

export function modelBaseRatesPerM(model: string): { inputPerM: number; outputPerM: number; inRate: number; outRate: number } {
  const m = String(model || "").toLowerCase();
  if (m.includes("opus")) return { inputPerM: 15.0, outputPerM: 75.0, inRate: 15.0, outRate: 75.0 };
  if (m.includes("haiku")) return { inputPerM: 0.8, outputPerM: 4.0, inRate: 0.8, outRate: 4.0 };
  if (m.includes("gpt-6") || m.includes("sol")) return { inputPerM: 2.5, outputPerM: 10.0, inRate: 2.5, outRate: 10.0 };
  return { inputPerM: 3.0, outputPerM: 15.0, inRate: 3.0, outRate: 15.0 };
}

export function computeCacheSavings(
  row: Partial<InspectedLogRecord>,
  allRowsOrFx: Array<Partial<InspectedLogRecord>> | number = [],
  maybeFxRate = 7.2072,
): CacheSavingsResult {
  const allRows = Array.isArray(allRowsOrFx) ? allRowsOrFx : [];
  const fxRate = typeof allRowsOrFx === "number" ? allRowsOrFx : maybeFxRate;

  const calcRowSavedUsd = (r: Partial<InspectedLogRecord>) => {
    const { inputPerM } = modelBaseRatesPerM(String(r.model || ""));
    const readTokens = Math.max(0, Number(r.tokens_cache_r ?? r.cache_read_tokens ?? 0));
    const write5m = Math.max(0, Number(r.tokens_cache_w ?? r.cache_write_5m_tokens ?? 0));
    const write1h = Math.max(0, Number(r.tokens_cache_w1h ?? r.cache_write_1h_tokens ?? 0));
    const grossSaved = (readTokens / 1_000_000) * inputPerM * 0.9;
    const writeOverhead = (write5m / 1_000_000) * inputPerM * 0.25 + (write1h / 1_000_000) * inputPerM * 1.0;
    return Math.max(0, grossSaved - writeOverhead);
  };

  const cacheReadTokens = Math.max(0, Number(row.tokens_cache_r ?? row.cache_read_tokens ?? 0));
  const cacheWrite5mTokens = Math.max(0, Number(row.tokens_cache_w ?? row.cache_write_5m_tokens ?? 0));
  const cacheWrite1hTokens = Math.max(0, Number(row.tokens_cache_w1h ?? row.cache_write_1h_tokens ?? 0));
  const rawIn = Math.max(0, Number(row.tokens_in ?? row.input_tokens ?? 0));
  const denom = Math.max(1, rawIn + cacheReadTokens + cacheWrite5mTokens + cacheWrite1hTokens);
  const hitRatePct = Number(((cacheReadTokens / denom) * 100).toFixed(1));

  const savedUsd = calcRowSavedUsd(row);
  const savedCny = savedUsd * fxRate;

  const list = allRows.length > 0 ? allRows : [row];
  const windowSavedUsd = Math.max(savedUsd, list.reduce((acc, item) => acc + calcRowSavedUsd(item), 0));
  const windowSavedCny = windowSavedUsd * fxRate;

  return {
    cacheReadTokens,
    cacheWrite5mTokens,
    cacheWrite1hTokens,
    hitRatePct,
    savedUsd,
    savedCny,
    savedUsdSingle: savedUsd,
    savedCnySingle: savedCny,
    windowSavedUsd,
    windowSavedCny,
    savedUsdWindow: windowSavedUsd,
    savedCnyWindow: windowSavedCny,
  };
}

interface WaterfallStep {
  id: string;
  label: string;
  detail: string;
  durationMs: number;
  offsetPct: number;
  widthPct: number;
  tone: "ok" | "info" | "warn" | "acc";
}

interface RoutingStoryResult {
  routeClass: RouteClass;
  routeClassLabel: string;
  leaseSeat: string;
  leaseAccount: string;
  lcpAffinityPct: number;
  egressIp: string;
  egressStabilityScore: number;
  retries: number;
  ttftMs: number;
  streamMs: number;
  streamDurationMs: number;
  totalMs: number;
  steps: WaterfallStep[];
  billingFormula: string;
  formulaText: string;
  usdTotal: number;
  cnyTotal: number;
  finalUsd: number;
  finalCny: number;
  fxRate: number;
  deductionSource: string;
}

export function buildRoutingStory(row: Partial<InspectedLogRecord>, fxRate = 7.2072): RoutingStoryResult {
  const totalMs = Math.max(80, Number(row.latency_ms || 1420));
  const protocol = String(row.protocol || (String(row.model || "").includes("claude") ? "anthropic" : "openai"));
  const model = String(row.model || "claude-opus-5-5");
  const cacheR = Math.max(0, Number(row.tokens_cache_r ?? row.cache_read_tokens ?? 0));
  const routeClass: RouteClass =
    row.route_class ||
    (protocol === "anthropic" && cacheR > 0
      ? "cc"
      : protocol === "anthropic"
        ? "cc-thin"
        : "non-cc");

  const routeClassLabel =
    routeClass === "cc"
      ? "cc · Claude Code Native"
      : routeClass === "cc-thin"
        ? "cc-thin · Anthropic Messages"
        : "non-cc · Standard API";

  const retries = Math.max(0, Number(row.retries ?? 0));
  const classifyMs = 4;
  const windControlMs = 6;
  const leaseSelectMs = retries > 0 ? 68 : 14;
  const ttftMs = Math.max(45, Math.min(totalMs - 30, Number(row.ttft_ms || Math.round(totalMs * 0.24))));
  const streamDurationMs = Math.max(20, totalMs - classifyMs - windControlMs - leaseSelectMs - ttftMs);

  const leaseSeat =
    row.lease_seat ||
    (routeClass === "cc"
      ? "seat-max20x-us-east-04 (Sticky LCP)"
      : routeClass === "cc-thin"
        ? "seat-pro-us-west-02 (Anthropic Messages)"
        : "pool-ent-openai-01 (Standard API)");
  const lcpAffinityPct = Number(row.lcp_affinity_pct ?? (routeClass === "cc" ? 96.4 : routeClass === "cc-thin" ? 82.0 : 0));
  const egressIp = routeClass === "cc" ? "38.68.134.12" : routeClass === "cc-thin" ? "38.68.134.48" : "198.51.100.24";
  const egressStabilityScore = Number(row.egress_score ?? 99.4);

  const rawSteps = [
    {
      id: "classify",
      label: `ClassifyClaudeCode → ${routeClass}`,
      detail: routeClassLabel,
      durationMs: classifyMs,
      tone: "acc" as const,
    },
    {
      id: "wind-control",
      label: "Key Wind-Control & Quota Pre-Check",
      detail: "Spend cap · Expiry · Model allowlist · CIDR · Wallet fallback OK",
      durationMs: windControlMs,
      tone: "info" as const,
    },
    {
      id: "lease",
      label: `Sticky Lease & Egress (${leaseSeat})`,
      detail: `LCP ${lcpAffinityPct.toFixed(1)}% · Egress IP ${egressStabilityScore.toFixed(1)}/100 · Retries: ${retries}`,
      durationMs: leaseSelectMs,
      tone: retries > 0 ? ("warn" as const) : ("ok" as const),
    },
    {
      id: "ttft",
      label: "Upstream Prefill & TTFT",
      detail: `${ttftMs} ms to first streamed token`,
      durationMs: ttftMs,
      tone: "info" as const,
    },
    {
      id: "stream",
      label: "Token Streaming & Final Settlement",
      detail: `${streamDurationMs} ms SSE stream · atomic ledger commit`,
      durationMs: streamDurationMs,
      tone: "ok" as const,
    },
  ];

  let elapsed = 0;
  const steps: WaterfallStep[] = rawSteps.map(s => {
    const offsetPct = Number(((elapsed / totalMs) * 100).toFixed(1));
    const widthPct = Math.max(4, Number(((s.durationMs / totalMs) * 100).toFixed(1)));
    elapsed += s.durationMs;
    return { ...s, offsetPct: Math.min(96, offsetPct), widthPct: Math.min(100 - offsetPct, widthPct) };
  });

  const { inputPerM, outputPerM } = modelBaseRatesPerM(model);
  const inTok = Math.max(0, Number(row.tokens_in ?? row.input_tokens ?? 0));
  const outTok = Math.max(0, Number(row.tokens_out ?? row.output_tokens ?? 0));
  const cacheW = Math.max(0, Number(row.tokens_cache_w ?? row.cache_write_5m_tokens ?? 0));
  const mult = Number(row.group_multiplier ?? (routeClass === "cc" ? 0.45 : routeClass === "cc-thin" ? 0.55 : 1.0));

  const computedUsd =
    ((inTok * inputPerM +
      outTok * outputPerM +
      cacheR * (inputPerM * 0.1) +
      cacheW * (inputPerM * 1.25)) /
      1_000_000) *
    mult;
  const allowMicro = Math.max(0, Number(row.allow_micro || 0));
  const cashMicro = Math.max(0, Number(row.cash_micro || 0));
  const grantMicro = Math.max(0, Number(row.grant_micro || 0));

  const usdTotal = allowMicro > 0 ? allowMicro / 1e6 : Math.max(0.0001, computedUsd);
  const cnyTotal = cashMicro + grantMicro > 0 ? (cashMicro + grantMicro) / 1e6 : usdTotal * fxRate;

  const billingFormula = `((${inTok.toLocaleString()} in × $${inputPerM}/M) + (${outTok.toLocaleString()} out × $${outputPerM}/M) + (${cacheR.toLocaleString()} cache_r × $${(inputPerM * 0.1).toFixed(2)}/M)${cacheW > 0 ? ` + (${cacheW.toLocaleString()} cache_w × $${(inputPerM * 1.25).toFixed(2)}/M)` : ""}) × ${mult.toFixed(2)} group = $${usdTotal.toFixed(4)} USD × FX ${fxRate.toFixed(4)} = ¥${cnyTotal.toFixed(4)} CNY`;

  const deductionSource =
    allowMicro > 0 && cashMicro + grantMicro === 0
      ? "Token Plan USD Allowance"
      : grantMicro > 0
        ? "Official Spend Grant"
        : "CNY Wallet Fallback";

  return {
    routeClass,
    routeClassLabel,
    leaseSeat,
    leaseAccount: leaseSeat,
    lcpAffinityPct,
    egressIp,
    egressStabilityScore,
    retries,
    ttftMs,
    streamMs: streamDurationMs,
    streamDurationMs,
    totalMs,
    steps,
    billingFormula,
    formulaText: billingFormula,
    usdTotal,
    cnyTotal,
    finalUsd: usdTotal,
    finalCny: cnyTotal,
    fxRate,
    deductionSource,
  };
}

export function getReferenceLogTraces(nowSec = Math.floor(Date.now() / 1000)): InspectedLogRecord[] {
  return [
    {
      id: "sample-cc-opus",
      isSample: true,
      label: "Claude Code · claude-opus-5-5 (cc · 94% Cache Hit)",
      created_at: nowSec - 45,
      ts: nowSec - 45,
      model: "claude-opus-5-5",
      protocol: "anthropic",
      status: 200,
      latency_ms: 1480,
      ttft_ms: 310,
      tokens_in: 1840,
      tokens_out: 920,
      tokens_cache_r: 42600,
      tokens_cache_w: 1200,
      tokens_cache_w1h: 0,
      system_tokens: 4800,
      tools_tokens: 9400,
      history_tokens: 29600,
      input_tokens: 1840,
      output_tokens: 580,
      thinking_tokens: 340,
      cache_read_tokens: 42600,
      cache_write_5m_tokens: 1200,
      cache_write_1h_tokens: 0,
      route_class: "cc",
      lease_seat: "seat-max20x-us-east-04",
      lcp_affinity_pct: 97.2,
      egress_score: 99.6,
      retries: 0,
      group_multiplier: 0.45,
      allow_micro: 46800,
      cash_micro: 0,
      grant_micro: 0,
    },
    {
      id: "sample-ccthin-sonnet",
      isSample: true,
      label: "Cline / Roo Code · claude-sonnet-5-5 (cc-thin · 1h Cache)",
      created_at: nowSec - 190,
      ts: nowSec - 190,
      model: "claude-sonnet-5-5",
      protocol: "anthropic",
      status: 200,
      latency_ms: 920,
      ttft_ms: 215,
      tokens_in: 2400,
      tokens_out: 640,
      tokens_cache_r: 18500,
      tokens_cache_w: 0,
      tokens_cache_w1h: 900,
      system_tokens: 3200,
      tools_tokens: 5100,
      history_tokens: 11100,
      input_tokens: 2400,
      output_tokens: 490,
      thinking_tokens: 150,
      cache_read_tokens: 18500,
      cache_write_5m_tokens: 0,
      cache_write_1h_tokens: 900,
      route_class: "cc-thin",
      lease_seat: "seat-pro-us-west-02",
      lcp_affinity_pct: 88.5,
      egress_score: 98.9,
      retries: 0,
      group_multiplier: 0.55,
      allow_micro: 13200,
      cash_micro: 0,
      grant_micro: 0,
    },
    {
      id: "sample-noncc-codex",
      isSample: true,
      label: "Codex CLI · gpt-6.1-sol (non-cc · Failover Retry 1×)",
      created_at: nowSec - 520,
      ts: nowSec - 520,
      model: "gpt-6.1-sol",
      protocol: "openai",
      status: 200,
      latency_ms: 2140,
      ttft_ms: 540,
      tokens_in: 14200,
      tokens_out: 1180,
      tokens_cache_r: 10400,
      tokens_cache_w: 0,
      tokens_cache_w1h: 0,
      system_tokens: 2600,
      tools_tokens: 3800,
      history_tokens: 6200,
      input_tokens: 1600,
      output_tokens: 720,
      thinking_tokens: 460,
      cache_read_tokens: 10400,
      cache_write_5m_tokens: 0,
      cache_write_1h_tokens: 0,
      route_class: "non-cc",
      lease_seat: "pool-ent-openai-01",
      lcp_affinity_pct: 75.0,
      egress_score: 99.1,
      retries: 1,
      group_multiplier: 1.0,
      allow_micro: 0,
      cash_micro: 168000,
      grant_micro: 0,
    },
  ];
}

interface LatencyBucketItem {
  id: "lt500" | "500to1000" | "1000to2000" | "gt5000";
  label: string;
  count: number;
  pct: number;
  tone: "ok" | "info" | "warn" | "err";
}

interface LatencyHistogramSummary {
  totalCount: number;
  p50TtftMs: number;
  p95TtftMs: number;
  p95TotalMs: number;
  buckets: LatencyBucketItem[];
}

export function computeLatencyBuckets(
  logs: Array<{ latency_ms?: number; ttft_ms?: number }> = [],
): LatencyHistogramSummary {
  const source =
    logs.length > 0
      ? logs.map(l => ({
          total: Math.max(50, Number(l.latency_ms || 420)),
          ttft: Math.max(30, Number(l.ttft_ms || Math.round(Number(l.latency_ms || 420) * 0.28))),
        }))
      : [
          { total: 280, ttft: 140 },
          { total: 340, ttft: 165 },
          { total: 410, ttft: 190 },
          { total: 460, ttft: 210 },
          { total: 490, ttft: 230 },
          { total: 620, ttft: 260 },
          { total: 780, ttft: 310 },
          { total: 890, ttft: 340 },
          { total: 1240, ttft: 410 },
          { total: 1680, ttft: 490 },
          { total: 5420, ttft: 820 },
        ];

  let lt500 = 0;
  let ms500to1000 = 0;
  let s1to2 = 0;
  let gt5s = 0;

  for (const item of source) {
    if (item.total < 500) lt500++;
    else if (item.total < 1000) ms500to1000++;
    else if (item.total <= 2000) s1to2++;
    else gt5s++;
  }

  const totalCount = Math.max(1, lt500 + ms500to1000 + s1to2 + gt5s);
  const ttfts = source.map(s => s.ttft).sort((a, b) => a - b);
  const totals = source.map(s => s.total).sort((a, b) => a - b);
  const pctAt = (arr: number[], q: number) => arr[Math.min(arr.length - 1, Math.floor(arr.length * q))] ?? 0;

  return {
    totalCount,
    p50TtftMs: pctAt(ttfts, 0.5),
    p95TtftMs: pctAt(ttfts, 0.95),
    p95TotalMs: pctAt(totals, 0.95),
    buckets: [
      { id: "lt500", label: "< 500ms", count: lt500, pct: Number(((lt500 / totalCount) * 100).toFixed(1)), tone: "ok" },
      { id: "500to1000", label: "500ms – 1s", count: ms500to1000, pct: Number(((ms500to1000 / totalCount) * 100).toFixed(1)), tone: "info" },
      { id: "1000to2000", label: "1s – 2s", count: s1to2, pct: Number(((s1to2 / totalCount) * 100).toFixed(1)), tone: "warn" },
      { id: "gt5000", label: "> 5s", count: gt5s, pct: Number(((gt5s / totalCount) * 100).toFixed(1)), tone: "err" },
    ],
  };
}

export function formatCooldownCountdown(
  untilSec: number,
  nowSec: number,
  recoverSuffix = "后自动恢复",
): string {
  const remainingSec = Math.max(0, Math.floor(untilSec - nowSec));
  if (remainingSec <= 0) {
    return "00:00:00";
  }
  const hh = Math.floor(remainingSec / 3600);
  const mm = Math.floor((remainingSec % 3600) / 60);
  const ss = remainingSec % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  const hhmmss = `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
  const totalMinutes = hh * 60 + mm;
  return `${hhmmss} · ${totalMinutes}m ${pad(ss)}s ${recoverSuffix}`;
}

interface SeatCooldownChannel {
  id: string;
  name: string;
  windowKind: "5h" | "7d";
  poolType: "5h" | "7d";
  routeClass: RouteClass;
  status: "healthy" | "cooldown";
  cooldownUntilSec: number;
  utilizationPct: number;
  egressIp: string;
  stabilityScore: number;
  spendGrantEligible: boolean;
  spendGrantApplied: boolean;
  spendGrantClaimed: boolean;
}

export function buildSeatCooldownChannels(
  nowSec: number,
  spendGrantClaimed: boolean,
  subsPlans: Array<{ name?: string; pool_name?: string }> = [],
): SeatCooldownChannel[] {
  const firstPoolName = subsPlans[0]?.pool_name || subsPlans[0]?.name || "Claude Max 20× · Seat #01 (us-east)";
  return [
    {
      id: "seat-5h-primary",
      name: firstPoolName,
      windowKind: "5h",
      poolType: "5h",
      routeClass: "cc",
      status: "healthy",
      cooldownUntilSec: 0,
      utilizationPct: 42,
      egressIp: "38.68.134.12",
      stabilityScore: 99.6,
      spendGrantEligible: false,
      spendGrantApplied: false,
      spendGrantClaimed: false,
    },
    {
      id: "seat-5h-cooldown",
      name: "Claude Max 20× · Seat #04 (us-west · Cooldown)",
      windowKind: "5h",
      poolType: "5h",
      routeClass: "cc",
      status: spendGrantClaimed ? "healthy" : "cooldown",
      cooldownUntilSec: spendGrantClaimed ? 0 : nowSec + 1425,
      utilizationPct: spendGrantClaimed ? 14 : 100,
      egressIp: "38.68.134.48",
      stabilityScore: 99.2,
      spendGrantEligible: true,
      spendGrantApplied: spendGrantClaimed,
      spendGrantClaimed,
    },
    {
      id: "seat-7d-weekly",
      name: "Claude Pro · Weekly Window #02",
      windowKind: "7d",
      poolType: "7d",
      routeClass: "cc-thin",
      status: "healthy",
      cooldownUntilSec: 0,
      utilizationPct: 64,
      egressIp: "38.68.134.91",
      stabilityScore: 98.9,
      spendGrantEligible: false,
      spendGrantApplied: false,
      spendGrantClaimed: false,
    },
  ];
}

export interface KeyGovernanceRules {
  quota_limit_micros?: number | null;
  expires_at?: number | null;
  allowed_models?: string[];
  allowed_cidrs?: string[];
  allow_wallet_fallback?: boolean;
}

export function isValidCidrOrIp(entry: string): boolean {
  const s = entry.trim();
  if (!s) return false;
  const v4 = s.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})(?:\/(\d{1,2}))?$/);
  if (v4) {
    const octets = [Number(v4[1]), Number(v4[2]), Number(v4[3]), Number(v4[4])];
    if (octets.some(o => o < 0 || o > 255)) return false;
    if (v4[5] !== undefined) {
      const prefix = Number(v4[5]);
      if (prefix < 0 || prefix > 32) return false;
    }
    return true;
  }
  const v6 = s.match(/^([0-9a-fA-F:]+)(?:\/(\d{1,3}))?$/);
  if (v6 && v6[1].includes(":")) {
    if (v6[2] !== undefined) {
      const prefix = Number(v6[2]);
      if (prefix < 0 || prefix > 128) return false;
    }
    return true;
  }
  return false;
}

export function parseCsvTokens(raw: string): string[] {
  return [...new Set(String(raw || "").split(/[\s,;]+/).map(s => s.trim()).filter(Boolean))];
}

function ipv4ToUint32(ip: string): number | null {
  const m = ip.trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return null;
  const octets = [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4])];
  if (octets.some(o => o < 0 || o > 255)) return null;
  return (((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0);
}

export function matchIpAgainstCidrs(clientIp: string, allowedCidrs?: string[]): boolean {
  if (!allowedCidrs || allowedCidrs.length === 0) return true;
  const ipNum = ipv4ToUint32(clientIp);
  for (const rule of allowedCidrs) {
    const trimmed = rule.trim();
    if (!trimmed) continue;
    if (trimmed === clientIp.trim() || trimmed === "0.0.0.0/0" || trimmed === "::/0") return true;
    const [netStr, prefixStr] = trimmed.split("/");
    const netNum = ipv4ToUint32(netStr);
    if (ipNum !== null && netNum !== null) {
      const prefix = prefixStr !== undefined ? Number(prefixStr) : 32;
      if (prefix === 0) return true;
      const mask = prefix >= 32 ? 0xffffffff : (~((1 << (32 - prefix)) - 1) >>> 0);
      if ((ipNum & mask) === (netNum & mask)) return true;
    }
  }
  return false;
}

export interface DryRunSimInput {
  model: string;
  keyId: string | number;
  keyName?: string;
  clientProfile: RouteClass;
  clientIp: string;
  inputTokens: number;
  outputTokens: number;
  thinkingTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
}

interface DryRunGateCheck {
  id: "spend_cap" | "expiry" | "model_allowlist" | "cidr_allowlist" | "wallet_fallback";
  gate: string;
  label: string;
  passed: boolean;
  detail: string;
}

interface DryRunSimOutput {
  overallAllowed: boolean;
  allowed: boolean;
  routeClass: RouteClass;
  classifyReason: string;
  gateChecks: DryRunGateCheck[];
  gates: DryRunGateCheck[];
  selectedSeat: string;
  leaseNode: string;
  lcpAffinityPct: number;
  lcpMatchPct: number;
  egressIp: string;
  egressStabilityScore: number;
  egressIpScore: number;
  lockedFxRate: number;
  fxRate: number;
  estimatedUsd: number;
  usdCost: number;
  estimatedCny: number;
  cnyCost: number;
  formulaText: string;
  formula: string;
}

export function evaluateDryRunSimulation(
  input: DryRunSimInput,
  gov: KeyGovernanceRules,
  nowSec = Math.floor(Date.now() / 1000),
  fxRate = 7.2072,
): DryRunSimOutput {
  const routeClass: RouteClass = input.clientProfile;
  const classifyReason =
    routeClass === "cc"
      ? "Matched User-Agent claude-cli + x-app: cli + official Claude Code system prompt prefix"
      : routeClass === "cc-thin"
        ? "Matched Anthropic /v1/messages endpoint without full Claude Code CLI system prompt"
        : "Matched OpenAI /v1/responses or /v1/chat/completions standard API wire format";

  const { inputPerM, outputPerM } = modelBaseRatesPerM(input.model);
  const mult = routeClass === "cc" ? 0.45 : routeClass === "cc-thin" ? 0.55 : 1.0;
  const effectiveOut = Math.max(0, input.outputTokens) + Math.max(0, input.thinkingTokens);
  const usdCost =
    ((Math.max(0, input.inputTokens) * inputPerM +
      effectiveOut * outputPerM +
      Math.max(0, input.cacheReadTokens) * (inputPerM * 0.1) +
      Math.max(0, input.cacheWriteTokens) * (inputPerM * 1.25)) /
      1_000_000) *
    mult;
  const cnyCost = usdCost * fxRate;
  const costMicros = Math.round(usdCost * 1e6);

  const allowedModels = gov.allowed_models ?? [];
  const allowedCidrs = gov.allowed_cidrs ?? [];
  const allowWalletFallback = gov.allow_wallet_fallback !== false;

  const capPassed = !gov.quota_limit_micros || gov.quota_limit_micros <= 0 || costMicros <= gov.quota_limit_micros;
  const expiryPassed = !gov.expires_at || gov.expires_at <= 0 || gov.expires_at > nowSec;
  const modelPassed =
    allowedModels.length === 0 ||
    allowedModels.some(m => m.toLowerCase() === input.model.trim().toLowerCase());
  const cidrPassed = matchIpAgainstCidrs(input.clientIp, allowedCidrs);
  const walletPassed = true;

  const gates: DryRunGateCheck[] = [
    {
      id: "spend_cap",
      gate: "Spend Cap (quota_limit_micros)",
      label: "Spend Cap (quota_limit_micros)",
      passed: capPassed,
      detail:
        gov.quota_limit_micros && gov.quota_limit_micros > 0
          ? `Req $${usdCost.toFixed(4)} vs Cap $${(gov.quota_limit_micros / 1e6).toFixed(2)}`
          : "Unlimited / Follows monthly cap",
    },
    {
      id: "expiry",
      gate: "Expiration (expires_at)",
      label: "Expiration (expires_at)",
      passed: expiryPassed,
      detail:
        gov.expires_at && gov.expires_at > 0
          ? expiryPassed
            ? `Valid until ${new Date(gov.expires_at * 1000).toISOString().slice(0, 10)}`
            : "Key expired"
          : "Never expires",
    },
    {
      id: "model_allowlist",
      gate: "Model Allowlist (allowed_models)",
      label: "Model Allowlist (allowed_models)",
      passed: modelPassed,
      detail:
        allowedModels.length > 0
          ? `${input.model} in [${allowedModels.join(", ")}]`
          : `All models allowed (${input.model})`,
    },
    {
      id: "cidr_allowlist",
      gate: "IP / CIDR Allowlist (allowed_cidrs)",
      label: "IP / CIDR Allowlist (allowed_cidrs)",
      passed: cidrPassed,
      detail:
        allowedCidrs.length > 0
          ? `Client ${input.clientIp} vs [${allowedCidrs.join(", ")}]`
          : `Any IP allowed (${input.clientIp})`,
    },
    {
      id: "wallet_fallback",
      gate: "Wallet Fallback (allow_wallet_fallback)",
      label: "Wallet Fallback (allow_wallet_fallback)",
      passed: walletPassed,
      detail: allowWalletFallback ? "Enabled (Auto-fallback to CNY wallet)" : "Disabled (Strict USD quota only)",
    },
  ];

  const allowed = gates.every(g => g.passed);
  const selectedSeat =
    routeClass === "cc"
      ? "seat-max20x-us-east-04"
      : routeClass === "cc-thin"
        ? "seat-pro-us-west-02"
        : "pool-ent-openai-01";
  const lcpMatchPct = routeClass === "cc" ? 97.4 : routeClass === "cc-thin" ? 86.2 : 0;
  const egressIp = routeClass === "cc" ? "38.68.134.12" : routeClass === "cc-thin" ? "38.68.134.48" : "198.51.100.24";
  const egressIpScore = routeClass === "cc" ? 99.6 : 99.1;

  const formula = `((${input.inputTokens.toLocaleString()} in × $${inputPerM}/M) + (${effectiveOut.toLocaleString()} out+think × $${outputPerM}/M) + (${input.cacheReadTokens.toLocaleString()} cache_r × $${(inputPerM * 0.1).toFixed(2)}/M) + (${input.cacheWriteTokens.toLocaleString()} cache_w × $${(inputPerM * 1.25).toFixed(2)}/M)) × ${mult.toFixed(2)} = $${usdCost.toFixed(4)} USD (¥${cnyCost.toFixed(4)} CNY @ ${fxRate.toFixed(4)})`;

  return {
    overallAllowed: allowed,
    allowed,
    routeClass,
    classifyReason,
    gateChecks: gates,
    gates,
    selectedSeat,
    leaseNode: selectedSeat,
    lcpAffinityPct: lcpMatchPct,
    lcpMatchPct,
    egressIp,
    egressStabilityScore: egressIpScore,
    egressIpScore,
    lockedFxRate: fxRate,
    fxRate,
    estimatedUsd: usdCost,
    usdCost,
    estimatedCny: cnyCost,
    cnyCost,
    formulaText: formula,
    formula,
  };
}
