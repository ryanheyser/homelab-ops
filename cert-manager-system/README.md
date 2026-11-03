# cert-manager-system

This area contains the cluster certificate automation for issuing and renewing TLS certificates with cert-manager and Cloudflare.

Key components:

* [chart](chart/)
* [cloudflare](cloudflare/)

The chart directory installs the cert-manager controller, while the Cloudflare configuration includes the API token/secret material and the ACME challenge setup used for Let\'s Encrypt certificate issuance.
