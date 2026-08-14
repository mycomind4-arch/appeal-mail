import { createServerFn } from "@tanstack/react-start";
import { runStressTest, type StressTestResult } from "@/domain/stress-test";
import type { AppealGround } from "@/domain/ground";
import type { Evidence } from "@/domain/evidence";
import type { XRayResult } from "@/domain/xray";

/* ─────────────────────────────────────────────
   Stress Test Server Function
   Runs adversarial analysis on the user's
   grounds, evidence, and draft.
   ───────────────────────────────────────────── */

export const runStressTestFn = createServerFn()
  .validator((input: {
    grounds: AppealGround[];
    evidence: Evidence[];
    draft: string;
    xrayResult: XRayResult | null;
  }) => input)
  .handler(async ({ data }) => {
    if (!data.grounds || data.grounds.length === 0) {
      throw new Error("At least one ground is required to run the stress test");
    }

    const result = runStressTest(
      data.grounds,
      data.evidence,
      data.draft,
      data.xrayResult,
    );

    return result;
  });
