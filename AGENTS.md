# Agent Guidelines

This repository is the declarative source of truth for workloads and platform services in a
Flux-managed Kubernetes homelab. Read [README.md](README.md) for the repository overview and
[GOVERNANCE.md](GOVERNANCE.md) before proposing changes.

## Repository boundaries

- Keep changes within this repository's scope: Flux-managed workloads and supporting Kubernetes
  configuration. Hardware, bootstrap, and cluster lifecycle configuration belong in the companion
  `homelab-infrastructure` repository.
- Work in existing namespace and workload directories. Follow nearby manifests and
  `kustomization.yaml` files rather than introducing a new layout or abstraction.
- Flux continuously reconciles this repository. A merged change can alter a live cluster; assess
  operational impact and call out risky or irreversible effects.
- Do not edit Flux-generated files such as `flux-system/gotk-components.yaml` or
  `flux-system/gotk-sync.yaml`.

## Change practices

- Make the smallest coherent change. Preserve established naming, labels, API versions, chart
  sources, and version-pinning conventions unless the task specifically requires changing them.
- Update the relevant Kustomize resource list when adding or removing files. Check dependent
  resources, references, namespaces, and ordering when changing a workload.
- Never commit secrets or secret material: no credentials, tokens, private keys, literal secret
  values, Kubernetes `Secret` manifests, or encrypted secret blobs. Represent secret data only with
  `ExternalSecret` resources that reference the existing secret backend. Never retrieve or print
  secret values.
- When adding or changing a dependency, image, chart, or other versioned component, verify the
  latest version directly from its authoritative upstream source at implementation time. Do not
  rely on model memory or assume an existing pin is current. Use the latest version unless the user
  requests otherwise or a documented compatibility constraint requires a different version; state
  the reason. Prefer immutable SHA/digest pins when supported, and add a comment with the matching
  semantic version whenever using a SHA.
- Do not run commands that mutate a live cluster, including `kubectl apply`, Flux
  reconcile/suspend/resume commands, or operational `task` commands. Do not trigger backups,
  restores, wipes, or mounts. Limit validation to local, non-mutating checks unless the user
  explicitly asks for a live operation.
- Do not assume a validation command passed because a manifest parses. Run relevant available
  checks and report commands that could not be run.

## Validation and handoff

- Lint every generated or changed file with its repository-configured linter immediately after
  creating it and again after any subsequent edits. For YAML, run
  `yamllint -c .github/lint/.yamllint.yaml <changed-files>`; for Markdown, use
  `.github/lint/.markdownlint.yaml`.
- Treat lint failures as errors: fix them and rerun the linter before finishing. If the required
  linter is unavailable, do not claim validation passed; report the blocker and the check that
  remains to be run.
- Run `kustomize build <directory>` for affected Kustomize roots when the tool and required sources
  are available. This renders locally; do not apply the output to a cluster.
- If available, run `pre-commit run --all-files`; it includes secret scanning and formatting checks.
  Do not modify unrelated files just to clear pre-existing failures.
- Summarize changed paths, validation performed and its result, plus deployment risks or unresolved
  assumptions.
