# Governance

This document describes safe contribution practices for this repository. It does not replace
repository-hosting branch protections or maintainer decisions.

## Scope and authority

- This repository declares workloads and supporting configuration for a Flux-managed Kubernetes
  cluster. The companion `homelab-infrastructure` repository owns underlying hardware, bootstrap,
  and cluster lifecycle setup.
- Maintainers decide whether changes are accepted and when they are merged. Contributors and AI
  agents may prepare changes, but must not merge or deploy them on a maintainer's behalf.
- Unless a maintainer directs otherwise, propose changes through a reviewable pull request. Explain
  the intent, affected services, validation, and operational impact.

## Change review

- Keep each change focused and make its effects clear. For removals, include relevant
  data-retention, dependency, and rollback considerations.
- Treat changes to cluster-wide services, networking, identity, certificates, storage, secrets,
  upgrades, Flux bootstrap, and pruning as high impact. Explain the scope and risks so a maintainer
  can review them deliberately.
- Do not infer that a change is safe to deploy merely because it renders or passes linting. Review
  must account for runtime behavior, dependency ordering, persistence, and recovery where relevant.
- Because Flux continuously reconciles the declared state, merging a change may cause it to take
  effect without a separate manual deployment step.

## Security and operations

- Never commit secrets or secret material, including literal values, Kubernetes `Secret` manifests,
  or encrypted secret blobs. Use `ExternalSecret` resources referencing the established secret
  backend. Do not retrieve or expose secret values in logs, examples, reports, or generated output.
- Do not perform live cluster mutations as part of routine review or code changes. Any requested
  operational action must be explicit and handled with maintainer authorization and appropriate
  safeguards.
- Prefer reversible, incremental changes. Call out destructive actions, downtime, data migration,
  and manual recovery steps rather than hiding them in implementation details.
- Treat third-party charts, images, and source repositories as dependencies: follow existing
  pinning and update conventions, and make version changes explicit. When adding or changing a
  versioned component, verify the latest version from its authoritative upstream source at
  implementation time; do not rely on model memory or assume an existing pin is current. Use the
  latest unless the user or a documented compatibility constraint requires otherwise. Prefer
  immutable SHA/digest pins when supported and annotate each SHA with its matching semantic version.

## Validation

- Lint generated files immediately after creating them and lint changed files again after any
  subsequent edits. Treat lint failures as errors; fix and rerun the check before considering the
  change complete.
- If a required linter is unavailable, report validation as blocked rather than claiming it passed.

## AI-assisted contributions

- AI-generated changes require the same review and validation as any other contribution. Agents
  must distinguish verified facts from assumptions and must not claim checks they did not run.
- Agents must not invent cluster topology, secret values, ownership assignments, or repository
  policies. Ask a maintainer when missing context affects safety or behavior.
- Agents should leave unrelated worktree changes untouched and report any relevant pre-existing
  failures separately from failures introduced by their change.
