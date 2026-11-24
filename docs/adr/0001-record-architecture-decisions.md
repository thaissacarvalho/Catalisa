# ADR 0001: Record Architecture Decisions

- **Status:** Accepted
- **Date:** 2026-11-03
- **Decision owners:** Software Architecture and Engineering
- **Scope:** Application, platform, and operational architecture decisions

## Context

Architecture decisions are distributed across source code, migrations, test configuration, operational scripts, and informal discussions. This makes it difficult to understand why a decision was made, which alternatives were considered, and whether a later change intentionally supersedes an earlier choice.

The project contains multiple bounded modules, PostgreSQL persistence, Docker-based environments, HTTP contracts, authentication rules, and test infrastructure. These concerns evolve independently and need a lightweight, searchable record of their architectural rationale.

Without a consistent record, the team risks:

- repeating previously rejected discussions;
- introducing changes that conflict with existing constraints;
- losing context when maintainers or requirements change;
- treating implementation details as undocumented architecture;
- making operational decisions without recording their production impact.

## Decision

The team will use Architecture Decision Records (ADRs) as the default mechanism for documenting significant technical decisions.

ADRs will follow the Michael Nygard format:

1. Title
2. Status
3. Date and decision owners
4. Context
5. Decision
6. Consequences

ADRs will be stored under docs/adr/ and named using a zero-padded sequence and a kebab-case title:

~~~text
docs/adr/NNNN-short-descriptive-title.md
~~~

An ADR is required when a decision changes or constrains system structure, public contracts, persistence, security, deployment, observability, resilience, testing strategy, or a change with meaningful migration cost.

The author must document alternatives when they materially affected the decision. An ADR is reviewed with the code or infrastructure change it governs. Once accepted, the ADR remains immutable in intent; a new ADR supersedes it when the decision changes.

## Consequences

### Positive consequences

- Architectural rationale becomes searchable and versioned with the codebase.
- New contributors can understand constraints without reconstructing history.
- Reviews can evaluate implementation against an explicit decision.
- Superseded decisions remain traceable.
- Operational and security implications become part of design discussions.

### Negative consequences

- Authors spend additional time writing and reviewing decisions.
- Some decisions require follow-up ADRs as implementation details evolve.
- The repository contains more documents that need maintenance.

### Operating rules

- Prefer one decision per ADR.
- Keep the document concise and decision-oriented.
- Link related source code, migrations, guides, and superseding ADRs.
- Do not use an ADR as a task list or implementation diary.
- Update the status when a decision is proposed, accepted, deprecated, or superseded.

## Status: Accepted

This ADR is accepted. New architecture decisions should use this format and be committed under docs/adr/.

