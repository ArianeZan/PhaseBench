import { describe, expect, it } from "vitest";

import type { ModelMetrics } from "./metrics";
import {
  metricRanges,
  normalizeMetric,
  normalizeModelMetrics,
  weightedAverage,
} from "./normalization";

describe("normalizeMetric", () => {
  it("normalizes higher-is-better values and boundaries", () => {
    expect(normalizeMetric(50, metricRanges.qualityScore)).toBe(50);
    expect(normalizeMetric(0, metricRanges.qualityScore)).toBe(0);
    expect(normalizeMetric(100, metricRanges.qualityScore)).toBe(100);
  });

  it("reverses lower-is-better metrics", () => {
    expect(normalizeMetric(0.05, metricRanges.costUsd)).toBe(100);
    expect(normalizeMetric(0.75, metricRanges.costUsd)).toBe(0);
  });

  it("clamps outliers", () => {
    expect(normalizeMetric(-10, metricRanges.qualityScore)).toBe(0);
    expect(normalizeMetric(900, metricRanges.qualityScore)).toBe(100);
  });

  it("preserves missing values", () => {
    expect(normalizeMetric(null, metricRanges.qualityScore)).toBeNull();
  });

  it("treats non-finite evidence as missing", () => {
    expect(normalizeMetric(Number.NaN, metricRanges.qualityScore)).toBeNull();
    expect(
      normalizeMetric(Number.POSITIVE_INFINITY, metricRanges.costUsd),
    ).toBeNull();
  });

  it("returns a neutral score for a zero range", () => {
    expect(
      normalizeMetric(12, { minimum: 10, maximum: 10, direction: "higher" }),
    ).toBe(50);
  });
});

describe("weightedAverage", () => {
  it("renormalizes available weights", () => {
    expect(
      weightedAverage([
        { value: 100, weight: 0.75 },
        { value: null, weight: 0.25 },
      ]),
    ).toBe(100);
  });

  it("returns null without evidence", () => {
    expect(weightedAverage([{ value: null, weight: 1 }])).toBeNull();
  });

  it("keeps zero as available evidence", () => {
    expect(weightedAverage([{ value: 0, weight: 1 }])).toBe(0);
  });
});

describe("normalizeModelMetrics", () => {
  it("builds the four recommendation dimensions", () => {
    const metrics: ModelMetrics = {
      qualityScore: 90,
      taskPassRate: 80,
      automatedTestPassRate: 70,
      judgeScore: null,
      costUsd: 0.4,
      latencyMs: 4750,
      inputTokens: 3000,
      outputTokens: 1000,
      averageAttempts: 1.25,
      stabilityScore: 95,
    };
    expect(normalizeModelMetrics(metrics)).toEqual({
      quality: 82.94,
      value: 73.06,
      speed: 50,
      reliability: 86.5,
    });
  });

  it("keeps partial quality evidence while exposing missing required dimensions", () => {
    const result = normalizeModelMetrics({
      qualityScore: 0,
      taskPassRate: null,
      automatedTestPassRate: null,
      judgeScore: null,
      costUsd: 0.75,
      latencyMs: null,
      inputTokens: 0,
      outputTokens: 0,
      averageAttempts: null,
      stabilityScore: null,
    });

    expect(result.quality).toBe(0);
    expect(result.value).toBe(0);
    expect(result.speed).toBeNull();
    expect(result.reliability).toBeNull();
  });
});
