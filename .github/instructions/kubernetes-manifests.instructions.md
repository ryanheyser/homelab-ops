---
description: "Use when adding or changing Kubernetes, Kustomize, or Flux YAML manifests in this repository."
applyTo:
  - "cert-manager-system/**/*.yaml"
  - "default/**/*.yaml"
  - "external-secrets/**/*.yaml"
  - "flux-system/**/*.yaml"
  - "flux-system-extra/**/*.yaml"
  - "kube-system/**/*.yaml"
  - "network-system/**/*.yaml"
  - "storage-system/**/*.yaml"
  - "upgrade-system/**/*.yaml"
  - "vault-system/**/*.yaml"
---
# Kubernetes Manifest Guidelines

- Inspect the workload's existing manifests and neighboring examples before editing. Preserve
  established Flux, HelmRelease, Kustomize, namespace, label, and resource naming patterns.
- Keep each resource in its existing namespace/workload area. Add or remove files from the relevant
  `kustomization.yaml` and check that all referenced resources exist.
- Preserve dependency and reconciliation behavior. Consider the effects of `dependsOn`, health
  checks, pruning, storage claims, secrets, and service exposure when touching related resources.
- Never commit secrets or secret material, including literal values, Kubernetes `Secret` manifests,
  or encrypted secret blobs. Use `ExternalSecret` resources referencing the existing secret backend;
  never retrieve or print secret values.
- When adding or changing an image, chart, or other versioned component, check its authoritative
  upstream source for the latest version at implementation time. Do not rely on model memory or
  assume existing pins are current. Use the latest unless the user or a documented compatibility
  constraint requires otherwise; explain any exception. Prefer immutable SHA/digest pins when
  supported, with a comment stating the matching semantic version.
- Do not modify generated Flux bootstrap manifests.
- Lint generated and changed YAML with the repository's yamllint configuration immediately after
  creating it and again after subsequent edits. Treat lint failures as errors: fix and rerun.
  If yamllint is unavailable, report validation as blocked, not passed.
- Render affected Kustomize roots locally when available. Never apply or reconcile rendered output
  against a live cluster.
