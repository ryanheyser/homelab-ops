#!/usr/bin/env zx
$.verbose = false

/**
 * * helmReleaseDiff.mjs
 * * Runs `helm template` with your Helm values and then runs a diff tool across Flux HelmRelease manifests
 * @param --current-release   The source Flux HelmRelease to compare against the target
 * @param --incoming-release  The target Flux HelmRelease to compare against the source
 * @param --kubernetes-dir    The directory containing your Flux manifests including the HelmRepository manifests
 * @param --diff-tool         The tool to use for diffing (`diff` or `dyff`)
 * @param --kube-version      Kubernetes version passed to `helm template` (default 1.36.0)
 * * Limitations:
 * * Uses the first HelmRelease in each file.
 * * Only charts from HelmRepository sources (HTTP or OCI) are rendered; chartRef/GitRepository sources are skipped.
 * * valuesFrom is not resolved; only inline spec.values are rendered.
 */
const CurrentRelease  = argv['current-release']
const IncomingRelease = argv['incoming-release']
const KubernetesDir   = argv['kubernetes-dir']
const diffTool        = argv['diff-tool']
const kubeVersion     = argv['kube-version'] || '1.36.0'

const helm = await which('helm')

// Any served Flux API version (helm.toolkit.fluxcd.io/v2, v2beta2, v2beta1, ...).
const isKind = (item, group, kind) =>
  item != null && typeof item === 'object'
    && typeof item.apiVersion === 'string' && item.apiVersion.startsWith(`${group}/`)
    && item.kind === kind

async function readDocs(file) {
  const contents = await fs.readFile(file, 'utf8')
  return YAML.parseAllDocuments(contents).map((item) => item.toJS())
}

// First HelmRelease in the file, or undefined. Files added by the PR are missing
// from the default-branch checkout (and deleted files from the PR checkout).
async function helmRelease(releaseFile) {
  if (!(await fs.pathExists(releaseFile))) {
    return undefined
  }
  return (await readDocs(releaseFile)).find((item) => isKind(item, 'helm.toolkit.fluxcd.io', 'HelmRelease'))
}

async function helmRepository(kubernetesDir, repositoryName) {
  const files = await globby([`${kubernetesDir}/**/*.yaml`, `!${kubernetesDir}/**/node_modules/**`])
  for (const file of files) {
    let docs
    try {
      docs = await readDocs(file)
    } catch {
      continue
    }
    const repo = docs.find((item) =>
      isKind(item, 'source.toolkit.fluxcd.io', 'HelmRepository')
        && item.metadata?.name === repositoryName)
    if (repo) {
      return repo.spec
    }
  }
  return undefined
}

// Returns the chart reference to pass to `helm template`, or undefined if the
// release's chart source can't be rendered here.
async function chartRef(release) {
  const chart = release.spec?.chart?.spec
  if (!chart || chart.sourceRef?.kind !== 'HelmRepository') {
    return undefined
  }
  const repo = await helmRepository(KubernetesDir, chart.sourceRef.name)
  if (!repo?.url) {
    return undefined
  }
  if (repo.type === 'oci' || repo.url.startsWith('oci://')) {
    return { ref: `${repo.url.replace(/\/$/, '')}/${chart.chart}`, version: chart.version }
  }
  // Prefix the local repo alias: Helm treats "<alias>/<chart>" as a path when a
  // matching directory exists (e.g. ./external-secrets/external-secrets).
  const alias = `hrdiff-${chart.sourceRef.name}`
  await $`${helm} repo add --force-update ${alias} ${repo.url}`
  return { ref: `${alias}/${chart.chart}`, version: chart.version }
}

async function helmTemplate(release) {
  const chart = await chartRef(release)
  if (!chart) {
    return undefined
  }
  // Write values as JSON (valid YAML). The YAML library emits YAML 1.2, which
  // leaves strings such as "on"/"off"/"yes" unquoted; Helm reads them as YAML 1.1
  // booleans, so a quoted "on" annotation would reach the chart as true.
  // Flux hands values to Helm as JSON too.
  const valuesFile = (await $`mktemp`).stdout.trim()
  await fs.writeFile(valuesFile, JSON.stringify(release.spec.values ?? {}))

  const versionArgs = chart.version ? ['--version', chart.version] : []
  const manifests = await $`${helm} template ${release.metadata.name} ${chart.ref} ${versionArgs} --kube-version ${kubeVersion} --include-crds=false --values ${valuesFile}`

  // Remove docs that are CustomResourceDefinition and keys which contain generated fields
  let documents = YAML.parseAllDocuments(manifests.stdout.trim())
  documents = documents.filter(doc => doc.get('kind') !== 'CustomResourceDefinition')
  documents.forEach(doc => {
    const del = (path) => doc.hasIn(path) ? doc.deleteIn(path) : false
    del(['metadata', 'labels'])
    del(['spec', 'template', 'metadata', 'annotations'])
    del(['spec', 'template', 'metadata', 'labels'])
  })
  // Stable order so the diff shows content changes, not helm's output order.
  const key = (doc) => [doc.get('kind'), doc.getIn(['metadata', 'namespace']), doc.getIn(['metadata', 'name'])].join('/')
  documents.sort((a, b) => key(a).localeCompare(key(b)))

  const manifestsFile = (await $`mktemp`).stdout.trim()
  await fs.writeFile(manifestsFile, documents.map(doc => doc.toString({directives: true})).join('\n'))
  return manifestsFile
}

const currentRelease  = await helmRelease(CurrentRelease)
const incomingRelease = await helmRelease(IncomingRelease)
if (!currentRelease || !incomingRelease) {
  process.exit(0)
}

const currentManifests  = await helmTemplate(currentRelease)
const incomingManifests = await helmTemplate(incomingRelease)
if (!currentManifests || !incomingManifests) {
  process.exit(0)
}

if (diffTool === 'diff') {
  const diff_tool = await which('diff')
  const diff_out = await $`${diff_tool} -u ${currentManifests} ${incomingManifests} || :`
  echo(diff_out.stdout.trim())
} else if (diffTool === 'dyff') {
  const dyff_tool = await which('dyff')
  const diff_out = await $`${dyff_tool} --color=off --truecolor=off between --omit-header --ignore-order-changes --detect-kubernetes=true --output=human ${currentManifests} ${incomingManifests}`
  echo(diff_out.stdout.trim())
}
