# cert-manager-system

This area contains the cluster certificate automation for issuing and renewing TLS certificates with cert-manager and Cloudflare.

Key components:

* [chart](chart/)
* [cloudflare](cloudflare/)

The chart directory installs the cert-manager controller. The Cloudflare directory holds the Let's Encrypt
`ClusterIssuer` resources, which solve ACME DNS-01 challenges in Cloudflare, and an `ExternalSecret` that reads the
Cloudflare API credential from Vault. DNS-01 means issuance does not depend on public A or AAAA records.
