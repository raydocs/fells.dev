import assert from "node:assert/strict";
import test from "node:test";
import { govObsWordsOf } from "../src/i18n/governance-observability.ts";
import {
  generateCliToolOnboarding,
  computeContextComposition,
  computeCacheSavings,
  buildRoutingStory,
  getReferenceLogTraces,
  computeLatencyBuckets,
  formatCooldownCountdown,
  buildSeatCooldownChannels,
  isValidCidrOrIp,
  parseCsvTokens,
  matchIpAgainstCidrs,
  evaluateDryRunSimulation,
  modelBaseRatesPerM,
} from "../src/lib/governance-observability.ts";

test("CLI / IDE onboarding generator supports Claude Code, Codex CLI, Cursor, Cline / Roo Code, and OpenCode across OS tabs", () => {
  const tools = ["claude-code", "codex", "cursor", "cline", "opencode"];
  for (const tool of tools) {
    const unix = generateCliToolOnboarding(tool, "unix", "https://api.fells.dev", "sk-fells-live-abc123", "claude-opus-5-5", "gpt-6.1-sol");
    const ps = generateCliToolOnboarding(tool, "powershell", "https://api.fells.dev", "sk-fells-live-abc123", "claude-opus-5-5", "gpt-6.1-sol");

    assert.equal(unix.id, tool);
    assert.ok(unix.envSnippet.includes("sk-fells-live-abc123"));
    assert.ok(ps.envSnippet.includes("sk-fells-live-abc123"));
    assert.ok(unix.configSnippet.includes("sk-fells-live-abc123"));
    assert.notEqual(unix.envSnippet, ps.envSnippet);
    assert.ok(["cc", "cc-thin", "non-cc"].includes(unix.expectedRouteClass));
  }
});

test("Context composition stacked bar, prompt cache savings, and locked-FX routing story waterfall compute exact shares and formulas", () => {
  const traces = getReferenceLogTraces();
  assert.ok(traces.length >= 3);
  const first = traces[0];
  const comp = computeContextComposition(first);
  assert.equal(comp.segments.length, 6);
  assert.equal(
    comp.totalTokens,
    comp.segments.reduce((acc, s) => acc + s.tokens, 0),
  );
  const pctSum = comp.segments.reduce((acc, s) => acc + s.pct, 0);
  assert.ok(pctSum > 99.5 && pctSum < 100.5);

  const savings = computeCacheSavings(first, 7.2072);
  assert.ok(savings.hitRatePct > 50);
  assert.ok(savings.savedUsd > 0);
  assert.ok(savings.savedCny > savings.savedUsd * 7);

  const story = buildRoutingStory(first);
  assert.equal(story.routeClass, "cc");
  assert.ok(story.steps.length >= 4);
  assert.ok(story.formulaText.includes("FX 7.2072"));
  assert.ok(modelBaseRatesPerM("claude-opus-5-5").inRate > 0);
});

test("Latency bucket histogram and second-by-second cooldown countdown with spend_grant reset", () => {
  const buckets = computeLatencyBuckets([
    { latency_ms: 320, ttft_ms: 190 },
    { latency_ms: 480, ttft_ms: 240 },
    { latency_ms: 720, ttft_ms: 310 },
    { latency_ms: 1450, ttft_ms: 410 },
    { latency_ms: 6100, ttft_ms: 820 },
  ]);
  assert.equal(buckets.totalCount, 5);
  assert.equal(buckets.buckets.length, 4);
  assert.equal(buckets.buckets[0].count, 2);
  assert.equal(buckets.buckets[1].count, 1);
  assert.equal(buckets.buckets[2].count, 1);
  assert.equal(buckets.buckets[3].count, 1);

  const countdown = formatCooldownCountdown(10_000 + 3665, 10_000, "后自动恢复");
  assert.equal(countdown, "01:01:05 · 61m 05s 后自动恢复");

  const channelsBefore = buildSeatCooldownChannels(10_000, false);
  assert.equal(channelsBefore[1].status, "cooldown");
  const channelsAfter = buildSeatCooldownChannels(10_000, true);
  assert.equal(channelsAfter[1].status, "healthy");
  assert.equal(channelsAfter[1].spendGrantApplied, true);
});

test("Self-managed API Key governance validation and Admin Dry-Run route & billing simulator", () => {
  assert.equal(isValidCidrOrIp("10.24.0.0/16"), true);
  assert.equal(isValidCidrOrIp("203.0.113.5"), true);
  assert.equal(isValidCidrOrIp("999.999.1.1/99"), false);
  assert.deepEqual(parseCsvTokens("claude-opus-5-5, gpt-6.1-sol"), ["claude-opus-5-5", "gpt-6.1-sol"]);
  assert.equal(matchIpAgainstCidrs("10.24.8.15", ["10.24.0.0/16"]), true);
  assert.equal(matchIpAgainstCidrs("203.0.113.99", ["10.24.0.0/16"]), false);

  const simPass = evaluateDryRunSimulation(
    {
      model: "claude-opus-5-5",
      keyId: "1",
      clientProfile: "cc",
      clientIp: "10.24.8.15",
      inputTokens: 20_000,
      outputTokens: 1_500,
      thinkingTokens: 2_000,
      cacheReadTokens: 15_000,
      cacheWriteTokens: 1_000,
    },
    {
      quota_limit_micros: 50_000_000,
      expires_at: 2_000_000_000,
      allowed_models: ["claude-opus-5-5"],
      allowed_cidrs: ["10.24.0.0/16"],
      allow_wallet_fallback: true,
    },
    1_760_000_000,
  );
  assert.equal(simPass.overallAllowed, true);
  assert.equal(simPass.routeClass, "cc");
  assert.ok(simPass.estimatedUsd > 0);
  assert.ok(simPass.estimatedCny > 0);

  const zh = govObsWordsOf("zh-CN");
  const en = govObsWordsOf("en");
  assert.ok(zh.cliOnboarding.title.length > 0);
  assert.ok(en.cliOnboarding.title.length > 0);
});
