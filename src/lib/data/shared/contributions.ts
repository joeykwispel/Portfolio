/**
 * Open-source contributions. PR metadata and diff snippets were taken from the GitHub API
 * (gh api repos/<owner>/<repo>/pulls/<n>/files); line numbers match GitHub's diff view.
 * Update `state` when a PR gets merged. Text per contribution lives in locales/<lang>/contributions.ts.
 */
export type DiffRow =
  | { k: 'hunk'; t: string }
  | { k: 'gap' }
  | { k: ' ' | '+' | '-'; t: string; o?: number; n?: number };

export interface Contribution {
  id: string;
  owner: string;
  repo: string;
  number: number;
  lang: string;
  langColor: string;
  stars: number;
  title: string;
  /** YYYY-MM-DD */
  opened: string;
  state: 'open' | 'merged' | 'closed';
  additions: number;
  deletions: number;
  files: number;
  tags: string[];
  diff: { file: string; additions: number; deletions: number; rows: DiffRow[] };
}

export const contributions: Contribution[] = [
  {
    "id": "minvws-dvp-proxy-8",
    "owner": "minvws",
    "repo": "nl-mgo-dvp-proxy",
    "number": 8,
    "lang": "Python",
    "langColor": "#3572A5",
    "stars": 0,
    "title": "feat(oidc): add crypto-agility + ML-DSA-65 support for client-assertion JWT",
    "opened": "2026-09-03",
    "state": "open",
    "additions": 158,
    "deletions": 56,
    "files": 9,
    "tags": [
      "ML-DSA-65",
      "FIPS 204",
      "Crypto-agility",
      "JWT"
    ],
    "diff": {
      "file": "services/proxy/app/oidc/services.py",
      "additions": 29,
      "deletions": 9,
      "rows": [
        {
          "k": "hunk",
          "t": "@@ -66,26 +66,34 @@ def __generate_code_challenge(self, code_verifier: str) -> str:"
        },
        {
          "k": " ",
          "t": "class ClientAssertionJwtIssuer:",
          "o": 66,
          "n": 66
        },
        {
          "k": " ",
          "t": "    KEY_STORE_PRIVATE_KEY_ID: str = \"client_assertion_jwt_private_key\"",
          "o": 67,
          "n": 67
        },
        {
          "k": " ",
          "t": "    KEY_STORE_PUBLIC_KEY_ID: str = \"client_assertion_jwt_public_key\"",
          "o": 68,
          "n": 68
        },
        {
          "k": "-",
          "t": "    JWT_ALG: str = \"RS256\"",
          "o": 69
        },
        {
          "k": "+",
          "t": "    KEY_STORE_FALLBACK_PRIVATE_KEY_ID: str = (",
          "n": 69
        },
        {
          "k": "+",
          "t": "        \"client_assertion_jwt_fallback_private_key\"",
          "n": 70
        },
        {
          "k": "+",
          "t": "    )",
          "n": 71
        },
        {
          "k": "+",
          "t": "    KEY_STORE_FALLBACK_PUBLIC_KEY_ID: str = \"client_assertion_jwt_fallback_public_key\"",
          "n": 72
        },
        {
          "k": "gap"
        },
        {
          "k": "+",
          "t": "        alg = self.__jwt_alg_fallback if self.__using_fallback_alg else self.__jwt_alg",
          "n": 92
        },
        {
          "k": " ",
          "t": "",
          "o": 85,
          "n": 93
        },
        {
          "k": " ",
          "t": "        new_jwt = jwt.JWT(",
          "o": 86,
          "n": 94
        },
        {
          "k": " ",
          "t": "            header={",
          "o": 87,
          "n": 95
        },
        {
          "k": "-",
          "t": "                \"alg\": self.JWT_ALG,",
          "o": 88
        },
        {
          "k": "+",
          "t": "                \"alg\": alg,",
          "n": 96
        },
        {
          "k": "hunk",
          "t": "@@ -102,17 +110,29 @@ def create(self, payload: dict[str, Any]) -> jwt.JWT:"
        },
        {
          "k": " ",
          "t": "    def __get_private_key(self) -> jwk.JWK:",
          "o": 103,
          "n": 111
        },
        {
          "k": " ",
          "t": "        if self.__private_key is None:",
          "o": 104,
          "n": 112
        },
        {
          "k": "-",
          "t": "            self.__private_key = self.__jwk_repository.get_first_key_from_store(",
          "o": 105
        },
        {
          "k": "-",
          "t": "                self.KEY_STORE_PRIVATE_KEY_ID",
          "o": 106
        },
        {
          "k": "-",
          "t": "            )",
          "o": 107
        },
        {
          "k": "+",
          "t": "            try:",
          "n": 113
        },
        {
          "k": "+",
          "t": "                self.__private_key = self.__jwk_repository.get_first_key_from_store(",
          "n": 114
        },
        {
          "k": "+",
          "t": "                    self.KEY_STORE_PRIVATE_KEY_ID",
          "n": 115
        },
        {
          "k": "+",
          "t": "                )",
          "n": 116
        },
        {
          "k": "+",
          "t": "            except KeyError:",
          "n": 117
        },
        {
          "k": "+",
          "t": "                self.__using_fallback_alg = True",
          "n": 118
        },
        {
          "k": "+",
          "t": "                self.__private_key = self.__jwk_repository.get_first_key_from_store(",
          "n": 119
        },
        {
          "k": "+",
          "t": "                    self.KEY_STORE_FALLBACK_PRIVATE_KEY_ID",
          "n": 120
        },
        {
          "k": "+",
          "t": "                )",
          "n": 121
        },
        {
          "k": " ",
          "t": "",
          "o": 108,
          "n": 122
        },
        {
          "k": " ",
          "t": "        return self.__private_key",
          "o": 109,
          "n": 123
        }
      ]
    }
  },
  {
    "id": "fundament-424",
    "owner": "fundament-oss",
    "repo": "fundament",
    "number": 424,
    "lang": "Go",
    "langColor": "#00ADD8",
    "stars": 13,
    "title": "fix(openfsc-operator): shorten group CA duration to 3 years",
    "opened": "2026-09-07",
    "state": "open",
    "additions": 65,
    "deletions": 2,
    "files": 2,
    "tags": [
      "PKI",
      "cert-manager",
      "Kubernetes",
      "RSA-4096"
    ],
    "diff": {
      "file": "openfsc-operator/internal/controller/coreresources.go",
      "additions": 8,
      "deletions": 2,
      "rows": [
        {
          "k": "hunk",
          "t": "@@ -45,9 +45,15 @@ func groupCAResources(inst *openfscv1.FSCInstallation) []*unstructured.Unstructu"
        },
        {
          "k": " ",
          "t": "\t\t\"secretName\":  groupCASecret,",
          "o": 47,
          "n": 47
        },
        {
          "k": "+",
          "t": "\t\t// RSA-4096 is Shor-vulnerable regardless of key size; cert-manager has no",
          "n": 48
        },
        {
          "k": "+",
          "t": "\t\t// ML-DSA support (its PrivateKeyAlgorithm enum is RSA/ECDSA/Ed25519 only,",
          "n": 49
        },
        {
          "k": "+",
          "t": "\t\t// and its signing code can't use a non-RSA/ECDSA/Ed25519 CA key even if",
          "n": 50
        },
        {
          "k": "+",
          "t": "\t\t// supplied out-of-band), so we can't change the algorithm today. Keeping",
          "n": 51
        },
        {
          "k": "+",
          "t": "\t\t// the lifetime short bounds how long anything this CA signs stays on RSA",
          "n": 52
        },
        {
          "k": "+",
          "t": "\t\t// and forces a checkpoint to reassess before committing again. See FUN-21.",
          "n": 53
        },
        {
          "k": " ",
          "t": "\t\t\"privateKey\":  map[string]any{\"algorithm\": \"RSA\", \"size\": int64(4096)},",
          "o": 48,
          "n": 54
        },
        {
          "k": "-",
          "t": "\t\t\"duration\":    \"87600h\", // 10 years",
          "o": 49
        },
        {
          "k": "-",
          "t": "\t\t\"renewBefore\": \"8760h\",  // 1 year",
          "o": 50
        },
        {
          "k": "+",
          "t": "\t\t\"duration\":    \"26280h\", // 3 years",
          "n": 55
        },
        {
          "k": "+",
          "t": "\t\t\"renewBefore\": \"2160h\",  // 90 days",
          "n": 56
        },
        {
          "k": " ",
          "t": "\t\t\"issuerRef\":   map[string]any{\"name\": groupSelfSignedIssuer, \"kind\": \"Issuer\"},",
          "o": 51,
          "n": 57
        }
      ]
    }
  },
  {
    "id": "brp-amsterdam-195",
    "owner": "Amsterdam",
    "repo": "brp-amsterdam-api",
    "number": 195,
    "lang": "Python",
    "langColor": "#3572A5",
    "stars": 1,
    "title": "Add AES-256-GCM BSN encryption and opt-in post-quantum TLS to RvIG",
    "opened": "2026-09-08",
    "state": "open",
    "additions": 209,
    "deletions": 12,
    "files": 5,
    "tags": [
      "ML-KEM",
      "X25519MLKEM768",
      "AES-256-GCM",
      "TLS 1.3"
    ],
    "diff": {
      "file": "src/brp_amsterdam_api/bevragingen/clients/base.py",
      "additions": 61,
      "deletions": 0,
      "rows": [
        {
          "k": "hunk",
          "t": "@@ -14,6 +17,60 @@"
        },
        {
          "k": "+",
          "t": "def _build_pqc_ssl_context() -> ssl.SSLContext | None:",
          "n": 31
        },
        {
          "k": "gap"
        },
        {
          "k": "+",
          "t": "    if os.environ.get(\"BRP_ENABLE_PQC_TLS\", \"false\").lower() not in (\"1\", \"true\", \"yes\"):",
          "n": 40
        },
        {
          "k": "+",
          "t": "        return None",
          "n": 41
        },
        {
          "k": "gap"
        },
        {
          "k": "+",
          "t": "    if ssl.OPENSSL_VERSION_INFO[:2] < _MIN_OPENSSL_FOR_PQC:",
          "n": 43
        },
        {
          "k": "+",
          "t": "        if not _pqc_tls_status_logged:",
          "n": 44
        },
        {
          "k": "+",
          "t": "            logger.warning(",
          "n": 45
        },
        {
          "k": "+",
          "t": "                \"PQC TLS requested (BRP_ENABLE_PQC_TLS) but linked OpenSSL %s is older \"",
          "n": 46
        },
        {
          "k": "+",
          "t": "                \"than 3.5 and does not support the ML-KEM hybrid TLS 1.3 group - \"",
          "n": 47
        },
        {
          "k": "+",
          "t": "                \"falling back to classical TLS.\",",
          "n": 48
        },
        {
          "k": "gap"
        },
        {
          "k": "+",
          "t": "    return ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)",
          "n": 60
        },
        {
          "k": "hunk",
          "t": "@@ -42,6 +99,10 @@ def __init__("
        },
        {
          "k": " ",
          "t": "        self._session = requests.Session()",
          "o": 43,
          "n": 100
        },
        {
          "k": " ",
          "t": "",
          "o": 44,
          "n": 101
        },
        {
          "k": "+",
          "t": "        pqc_context = _build_pqc_ssl_context()",
          "n": 102
        },
        {
          "k": "+",
          "t": "        if pqc_context is not None:",
          "n": 103
        },
        {
          "k": "+",
          "t": "            self._session.mount(\"https://\", _PQCTLSAdapter(pqc_context))",
          "n": 104
        }
      ]
    }
  }
];
