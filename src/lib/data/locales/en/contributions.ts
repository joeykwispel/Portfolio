export interface ContributionText {
  org: string;
  about: string;
  did: string;
  highlights: string[];
}

export const contributions: Record<string, ContributionText> = {
  'minvws-dvp-proxy-8': {
    org: 'Dutch Ministry of Health, Welfare and Sport (VWS)',
    about: 'A Python proxy from the ministry that signs a JWT to authenticate itself to an OIDC token endpoint during login (private_key_jwt, RFC 7523).',
    did: 'Made the one JWT this proxy signs crypto-agile. The algorithm moved from a hardcoded RS256 constant to config, defaulting to the post-quantum signature standard ML-DSA-65 with an automatic RS256 fallback, so production keeps working unchanged until quantum-safe keys are configured.',
    highlights: [
      'ML-DSA-65 (NIST FIPS 204) signing with automatic RS256 fallback',
      'Key tooling can now generate ML-DSA-44/65/87 keys',
      'Measured the impact: a 658 B JWT becomes 4,733 B with ML-DSA-65',
      'Backed by the AIVD/CWI/TNO PQC Migration Handbook'
    ]
  },
  'fundament-424': {
    org: 'Fundament (open-source community)',
    about:
      'A Go project with a Kubernetes operator for OpenFSC, used to federate services between organisations. Its group CA is a real production trust root.',
    did: 'Found the longest-lived RSA artifact in the repo: a self-signed RSA-4096 CA valid for 10 years. Cut its lifetime to 3 years with a 90-day renewal window, which bounds how long everything it signs stays quantum-vulnerable, and documented why cert-manager cannot move to ML-DSA yet.',
    highlights: [
      'CA lifetime 10 years → 3 years, renewal 1 year → 90 days',
      'Timing checked with Mosca’s inequality (X + Y < Z)',
      'Design record (FUN-21) mapping the path to a real ML-DSA CA',
      'Zero-downtime: existing installs renew on their next reconcile'
    ]
  },
  'brp-amsterdam-195': {
    org: 'City of Amsterdam',
    about:
      'An authorization proxy between the city’s services and the national population register (BRP) at RvIG, handling citizen service numbers (BSN) and address data.',
    did: 'Protected long-lived citizen data against “harvest now, decrypt later”. Added opt-in hybrid post-quantum TLS (X25519MLKEM768) on the outbound connection to RvIG, and upgraded BSN encryption from Fernet (AES-128) to AES-256-GCM.',
    highlights: [
      'Hybrid ML-KEM key exchange (NIST FIPS 203) on TLS 1.3',
      'BSN encryption upgraded to AES-256-GCM with key rotation',
      'Opt-in flag with a logged fallback, zero risk until enabled',
      'Real loopback TLS handshake test proves it is not inert config'
    ]
  }
};
