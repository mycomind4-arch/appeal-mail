/**
 * Multi-Provider LLM Service — MIGRATED to @mailmypdf/ai
 *
 * This file now re-exports from llm-bridge.ts, which adapts the
 * shared @mailmypdf/ai router to appeal-mail's existing API.
 *
 * The original per-provider implementations (callGemini, callClaude,
 * callOpenAI) have been replaced by the shared adapters in @mailmypdf/ai.
 * All routing, fallback, and retry logic is handled by the shared router.
 *
 * Existing code that imports from this module continues to work
 * without changes.
 */

export {
  type LLMProvider,
  type LLMConfig,
  type LLMMessage,
  type LLMResponse,
  callLLM,
  callMultipleProvidersForConsensus,
  getAvailableProviders,
  isProviderAvailable,
  getProviderLabel,
  getDefaultModel,
  type AppealConsensusResult,
  _setLLMConfig,
  _resetLLMConfig,
} from './llm-bridge';
