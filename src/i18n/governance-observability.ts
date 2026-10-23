interface GovObsWords {
  cliOnboarding: {
    kicker: string;
    title: string;
    sub: string;
    osUnix: string;
    osPowershell: string;
    activeKeyLabel: string;
    baseUrlLabel: string;
    testConn: string;
    testSuccess: string;
    latencyLabel: string;
    routeClassLabel: string;
    endpointLabel: string;
    shellExportTitle: string;
    configFileTitle: string;
    copyShell: string;
    copyConfig: string;
  };
  contextWaterfall: {
    kicker: string;
    title: string;
    sub: string;
    drawerToggleOpen: string;
    drawerToggleClose: string;
    sampleRequestsLabel: string;
    hydratedReady: string;
    hydratingHint: string;
    segSystem: string;
    segTools: string;
    segHistory: string;
    segInput: string;
    segOutput: string;
    segThinking: string;
    stackedTitle: string;
    tokensUnit: string;
    cacheCardTitle: string;
    cacheHitRate: string;
    cacheReadLabel: string;
    cacheWriteLabel: string;
    savedSingleLabel: string;
    savedWindowLabel: string;
    waterfallTitle: string;
    stepClassify: string;
    stepLease: string;
    lcpMatch: string;
    stepTtft: string;
    stepStream: string;
    stepBilling: string;
    formulaTitle: string;
  };
  latencyCooldown: {
    kicker: string;
    title: string;
    sub: string;
    p50Ttft: string;
    p95Ttft: string;
    p95Total: string;
    histogramTitle: string;
    bucketFast: string;
    bucketNormal: string;
    bucketSlow: string;
    bucketOutlier: string;
    cooldownTitle: string;
    spendGrantBadge: string;
    window5h: string;
    window7d: string;
    statusHealthy: string;
    statusCooling: string;
    recoverIn: string;
    spendGrantResetDone: string;
    spendGrantAction: string;
    spendGrantHint: string;
  };
  keyGovernance: {
    sectionTitle: string;
    sectionSub: string;
    spendCapLabel: string;
    spendCapHint: string;
    expiresAtLabel: string;
    expiresAtHint: string;
    allowedModelsLabel: string;
    allowedModelsHint: string;
    allowedModelsPlaceholder: string;
    allowedCidrsLabel: string;
    allowedCidrsHint: string;
    allowedCidrsPlaceholder: string;
    walletFallbackLabel: string;
    walletFallbackHint: string;
    badgeSpendCap: string;
    badgeExpires: string;
    badgeModels: string;
    badgeCidrs: string;
    badgeFallbackOn: string;
    badgeFallbackOff: string;
    cidrInvalid: string;
  };
  dryRun: {
    kicker: string;
    title: string;
    sub: string;
    profileCc: string;
    profileCcThin: string;
    profileNonCc: string;
    modelLabel: string;
    keyLabel: string;
    clientProfileLabel: string;
    clientIpLabel: string;
    inputTokensLabel: string;
    outputTokensLabel: string;
    thinkingTokensLabel: string;
    cacheReadTokensLabel: string;
    runBtn: string;
    decisionPass: string;
    decisionBlock: string;
    stickyLeaseResult: string;
    egressScoreResult: string;
    lockedFxResult: string;
  };
}

const zhCN: GovObsWords = {
  cliOnboarding: {
    kicker: "ZERO-FRICTION ONBOARDING · 零摩擦接入",
    title: "CLI / IDE 一键接入卡片",
    sub: "自动注入当前所选 API Key 与网关 Base URL，提供 macOS / Linux 与 Windows PowerShell 双环境命令及实时连通性探测。",
    osUnix: "macOS / Linux",
    osPowershell: "Windows PowerShell",
    activeKeyLabel: "当前密钥",
    baseUrlLabel: "网关地址",
    testConn: "发起连通性测试",
    testSuccess: "连通验证通过 · 200 OK",
    latencyLabel: "首包延迟",
    routeClassLabel: "路由分类",
    endpointLabel: "验证端点",
    shellExportTitle: "终端环境变量与一键启动",
    configFileTitle: "配置文件生成器",
    copyShell: "复制终端命令",
    copyConfig: "复制配置脚本",
  },
  contextWaterfall: {
    kicker: "CONTEXT & ROUTING STORY · 单次请求深度透视",
    title: "Context 构成堆叠条与 Routing Story 瀑布流",
    sub: "拆解单次请求的上下文 Token 构成比例、Prompt Cache 命中净省金额、路由分级轨迹与锁汇计费精确公式。",
    drawerToggleOpen: "展开透视抽屉",
    drawerToggleClose: "收起透视抽屉",
    sampleRequestsLabel: "切换透视请求样本（实时日志 / 基准画像）",
    hydratedReady: "首屏已秒开 · 聚合指标已就绪",
    hydratingHint: "首屏已秒开 · 后台异步回填重度指标中…",
    segSystem: "System Prompt",
    segTools: "Tools",
    segHistory: "Conversation History",
    segInput: "Current Input",
    segOutput: "Output",
    segThinking: "Thinking / Reasoning",
    stackedTitle: "Context 构成堆叠分布 (Context Composition)",
    tokensUnit: "tokens",
    cacheCardTitle: "Prompt Cache 命中净省卡片",
    cacheHitRate: "缓存命中率",
    cacheReadLabel: "Cache Read (0.1×)",
    cacheWriteLabel: "Cache Creation (5m / 1h)",
    savedSingleLabel: "本请求净省 (USD / CNY)",
    savedWindowLabel: "周期累计净省 (USD / CNY)",
    waterfallTitle: "Routing Story 瀑布流与锁汇计费公式拆解",
    stepClassify: "1. 路由特征分类 (ClassifyClaudeCode)",
    stepLease: "2. 粘性租约与出口席位 (Sticky Lease & LCP)",
    lcpMatch: "LCP 亲和度",
    stepTtft: "3. 首字延迟 (TTFT)",
    stepStream: "流式生成耗时",
    stepBilling: "4. 锁汇计费结算 (Locked-FX Billing)",
    formulaTitle: "(Input × rate + Output × rate + CacheRead × rate) × group_multiplier",
  },
  latencyCooldown: {
    kicker: "LIVE LATENCY & COOLDOWN · 实时健康度与限流恢复",
    title: "实时延迟分桶直方图与限流恢复秒级倒计时",
    sub: "监控 <500ms 至 >5s 实时延迟分桶分布（P50 / P95 TTFT）、5h / 7d 窗口限流秒级自动恢复倒计时，以及 Anthropic 官方免费额度重置权益 (spend_grant)。",
    p50Ttft: "P50 TTFT",
    p95Ttft: "P95 TTFT",
    p95Total: "P95 总延迟",
    histogramTitle: "实时延迟分桶直方图 (Latency Bucket Histogram)",
    bucketFast: "< 500ms (极速命中)",
    bucketNormal: "500ms – 1s (标准首包)",
    bucketSlow: "1s – 2s (长上下文预热)",
    bucketOutlier: "> 5s (深度推理 / 冷启动)",
    cooldownTitle: "通道 / 席位限流恢复秒级倒计时",
    spendGrantBadge: "Anthropic 官方免费额度重置权益 (spend_grant)",
    window5h: "5h 窗口",
    window7d: "7d 窗口",
    statusHealthy: "健康可用",
    statusCooling: "限流冷却中",
    recoverIn: "后自动恢复",
    spendGrantResetDone: "已应用 spend_grant 免费重置 · 席位已恢复",
    spendGrantAction: "一键重置限额 (spend_grant)",
    spendGrantHint: "当官方席位触发 5h 窗口限流且账户享有 Anthropic 官方免费额度重置权益 (spend_grant) 时，可一键重置窗口限额并立即恢复。",
  },
  keyGovernance: {
    sectionTitle: "自管 API Key 精细化风控治理 (Fine-Grained Key Governance)",
    sectionSub: "配置单 Key 独立额度硬顶、过期时间、模型白名单、来源 IP/CIDR 白名单与钱包余额回退开关。",
    spendCapLabel: "额度硬顶 (quota_limit_micros / USD)",
    spendCapHint: "达到该硬顶后立即拒绝新请求（留空则遵循月度限额）。",
    expiresAtLabel: "过期时间 (expires_at)",
    expiresAtHint: "到期后自动阻断调用（留空则永不过期）。",
    allowedModelsLabel: "模型白名单 (allowed_models)",
    allowedModelsHint: "逗号分隔模型 ID；留空允许全部可用模型。",
    allowedModelsPlaceholder: "claude-opus-5-5, claude-sonnet-5-5, gpt-6.1-sol",
    allowedCidrsLabel: "IP / CIDR 白名单 (allowed_cidrs)",
    allowedCidrsHint: "限制客户端出口 IP 或 CIDR 网段（留空不限来源 IP）。",
    allowedCidrsPlaceholder: "10.24.0.0/16, 203.0.113.5/32",
    walletFallbackLabel: "允许钱包余额回退 (allow_wallet_fallback)",
    walletFallbackHint: "当套餐或美元专项额度耗尽时，允许自动回退扣减人民币钱包余额。",
    badgeSpendCap: "硬顶",
    badgeExpires: "过期",
    badgeModels: "模型白名单",
    badgeCidrs: "CIDR 白名单",
    badgeFallbackOn: "钱包回退: 开启",
    badgeFallbackOff: "钱包回退: 关闭",
    cidrInvalid: "请输入合法的 IPv4/IPv6 地址或 CIDR 网段（例如 10.24.0.0/16）。",
  },
  dryRun: {
    kicker: "ROUTE & BILLING DRY-RUN SANDBOX · 管理端沙盒推演器",
    title: "路由与锁汇计费 Dry-Run 沙盒推演器",
    sub: "无损模拟任意请求载荷：检验 ClassifyClaudeCode 路由分类 (cc / cc-thin / non-cc)、API Key 五维风控检查、粘性租约 LCP 匹配、出口 IP 评分与锁汇 USD/CNY 计费拆解。",
    profileCc: "Claude Code CLI (cc · 原生粘性池)",
    profileCcThin: "Anthropic Messages 轻量客户端 (cc-thin)",
    profileNonCc: "Standard OpenAI / API SDK (non-cc)",
    modelLabel: "目标模型 (Model)",
    keyLabel: "测试 API Key",
    clientProfileLabel: "客户端请求特征 (Client / Headers)",
    clientIpLabel: "客户端来源 IP (Client IP)",
    inputTokensLabel: "Input Tokens",
    outputTokensLabel: "Output Tokens",
    thinkingTokensLabel: "Thinking Tokens",
    cacheReadTokensLabel: "Cache Read Tokens",
    runBtn: "执行 Dry-Run 沙盒推演",
    decisionPass: "风控放行 · ALLOW",
    decisionBlock: "风控拦截 · BLOCK",
    stickyLeaseResult: "粘性租约与 LCP 匹配",
    egressScoreResult: "出口 IP 与稳定度评分",
    lockedFxResult: "锁汇计费预估",
  },
};

const enUS: GovObsWords = {
  cliOnboarding: {
    kicker: "ZERO-FRICTION ONBOARDING",
    title: "Zero-Friction CLI / IDE One-Click Onboarding",
    sub: "Auto-injects your selected API Key and gateway Base URL into ready-to-run shell commands and config generators with live route verification.",
    osUnix: "macOS / Linux",
    osPowershell: "Windows PowerShell",
    activeKeyLabel: "Active Key",
    baseUrlLabel: "Gateway URL",
    testConn: "Test Connection",
    testSuccess: "Connection Verified · 200 OK",
    latencyLabel: "Handshake Latency",
    routeClassLabel: "Route Class",
    endpointLabel: "Verified Endpoint",
    shellExportTitle: "Terminal Env & Launch Command",
    configFileTitle: "Config File Generator",
    copyShell: "Copy Shell Command",
    copyConfig: "Copy Config Script",
  },
  contextWaterfall: {
    kicker: "CONTEXT & ROUTING STORY",
    title: "Per-Request Context Stacked Bar & Routing Story Waterfall",
    sub: "Inspect token composition across 6 context segments, Prompt Cache net savings, route classification timeline, and locked-FX billing formula.",
    drawerToggleOpen: "Open Inspector Drawer",
    drawerToggleClose: "Collapse Inspector Drawer",
    sampleRequestsLabel: "Inspect Request Trace (Live Logs / Reference Profiles)",
    hydratedReady: "Instant First Paint · Heavy Metrics Hydrated",
    hydratingHint: "Instant First Paint · Hydrating Heavy Aggregations…",
    segSystem: "System Prompt",
    segTools: "Tools",
    segHistory: "Conversation History",
    segInput: "Current Input",
    segOutput: "Output",
    segThinking: "Thinking / Reasoning",
    stackedTitle: "Context Composition Stacked Bar",
    tokensUnit: "tokens",
    cacheCardTitle: "Prompt Cache Savings Card",
    cacheHitRate: "Cache Hit Rate",
    cacheReadLabel: "Cache Read (0.1×)",
    cacheWriteLabel: "Cache Creation (5m / 1h)",
    savedSingleLabel: "Saved This Request (USD / CNY)",
    savedWindowLabel: "Saved Across Window (USD / CNY)",
    waterfallTitle: "Routing Story Waterfall & Locked-FX Billing Formula",
    stepClassify: "1. Route Classification (ClassifyClaudeCode)",
    stepLease: "2. Sticky Lease & Egress Selection (LCP)",
    lcpMatch: "LCP Affinity",
    stepTtft: "3. Time to First Token (TTFT)",
    stepStream: "Streaming Duration",
    stepBilling: "4. Locked-FX Settlement",
    formulaTitle: "(Input × rate + Output × rate + CacheRead × rate) × group_multiplier",
  },
  latencyCooldown: {
    kicker: "LIVE LATENCY & COOLDOWN TELEMETRY",
    title: "Live Latency Bucket Histogram & Cooldown Countdown",
    sub: "Real-time latency distribution (<500ms to >5s with P50/P95 TTFT), second-by-second 5h/7d rate-limit recovery countdown, and official Anthropic spend_grant reset.",
    p50Ttft: "P50 TTFT",
    p95Ttft: "P95 TTFT",
    p95Total: "P95 Total",
    histogramTitle: "Live Latency Bucket Histogram",
    bucketFast: "< 500ms (Fast Cache Hit)",
    bucketNormal: "500ms – 1s (Standard TTFT)",
    bucketSlow: "1s – 2s (Long Context Prefill)",
    bucketOutlier: "> 5s (Deep Reasoning / Cold)",
    cooldownTitle: "Channel / Seat Rate-Limit Cooldown & Official Spend Grant",
    spendGrantBadge: "Anthropic Official Free Quota Reset (spend_grant)",
    window5h: "5h Window",
    window7d: "7d Window",
    statusHealthy: "Healthy",
    statusCooling: "Cooldown",
    recoverIn: "until auto-recovery",
    spendGrantResetDone: "Official spend_grant Applied · Cooldown Cleared",
    spendGrantAction: "One-Click Quota Reset (spend_grant)",
    spendGrantHint: "When an official seat hits a 5-hour window rate limit and has an eligible Anthropic official free reset grant (spend_grant), click to reset the cooldown immediately.",
  },
  keyGovernance: {
    sectionTitle: "Fine-Grained Self-Managed API Key Governance",
    sectionSub: "Configure per-key hard spend cap, expiration date, model allowlist, IP/CIDR allowlist, and wallet balance fallback.",
    spendCapLabel: "Hard Spend Cap (quota_limit_micros / USD)",
    spendCapHint: "Reject requests immediately once this hard cap is reached (leave blank to follow monthly cap).",
    expiresAtLabel: "Expiration Date (expires_at)",
    expiresAtHint: "Automatically block calls after this date (leave blank for no expiration).",
    allowedModelsLabel: "Model Allowlist (allowed_models)",
    allowedModelsHint: "Comma-separated model IDs; leave blank to allow all models.",
    allowedModelsPlaceholder: "claude-opus-5-5, claude-sonnet-5-5, gpt-6.1-sol",
    allowedCidrsLabel: "IP / CIDR Allowlist (allowed_cidrs)",
    allowedCidrsHint: "Restrict client source IPs or CIDR blocks (leave blank for any IP).",
    allowedCidrsPlaceholder: "10.24.0.0/16, 203.0.113.5/32",
    walletFallbackLabel: "Allow Wallet Balance Fallback (allow_wallet_fallback)",
    walletFallbackHint: "Automatically fall back to CNY wallet balance when subscription or USD allowance is exhausted.",
    badgeSpendCap: "Cap",
    badgeExpires: "Exp",
    badgeModels: "Models",
    badgeCidrs: "CIDRs",
    badgeFallbackOn: "Wallet Fallback: ON",
    badgeFallbackOff: "Wallet Fallback: OFF",
    cidrInvalid: "Please enter valid IPv4/IPv6 addresses or CIDR blocks (e.g. 10.24.0.0/16).",
  },
  dryRun: {
    kicker: "ROUTE & BILLING DRY-RUN SANDBOX",
    title: "Admin Route & Locked-FX Billing Dry-Run Simulator",
    sub: "Simulate any request payload with zero charge: inspect ClassifyClaudeCode (cc / cc-thin / non-cc), 5-gate key governance checks, sticky lease LCP match, egress IP score, and locked-FX billing.",
    profileCc: "Claude Code CLI (cc · Native Sticky Pool)",
    profileCcThin: "Anthropic Messages Thin Client (cc-thin)",
    profileNonCc: "Standard OpenAI / API SDK (non-cc)",
    modelLabel: "Target Model",
    keyLabel: "Test API Key",
    clientProfileLabel: "Client / Headers Profile",
    clientIpLabel: "Client Source IP",
    inputTokensLabel: "Input Tokens",
    outputTokensLabel: "Output Tokens",
    thinkingTokensLabel: "Thinking Tokens",
    cacheReadTokensLabel: "Cache Read Tokens",
    runBtn: "Run Dry-Run Simulation",
    decisionPass: "ALLOWED · PASS",
    decisionBlock: "BLOCKED · DENY",
    stickyLeaseResult: "Sticky Lease & LCP Affinity",
    egressScoreResult: "Egress IP & Stability Score",
    lockedFxResult: "Locked-FX Billing Estimate",
  },
};

export function govObsWordsOf(lang: string): GovObsWords {
  return String(lang || "").toLowerCase().startsWith("zh") ? zhCN : enUS;
}
