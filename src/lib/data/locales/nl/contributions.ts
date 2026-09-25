import type { ContributionText } from '../en/contributions';

export const contributions: Record<string, ContributionText> = {
  'minvws-dvp-proxy-8': {
    org: 'Ministerie van Volksgezondheid, Welzijn en Sport (VWS)',
    about:
      'Een Python-proxy van het ministerie die een JWT ondertekent om zich tijdens het inloggen te authenticeren bij een OIDC-tokenendpoint (private_key_jwt, RFC 7523).',
    did: 'De enige JWT die deze proxy ondertekent crypto-agile gemaakt. Het algoritme is van een hardcoded RS256-constante naar configuratie verhuisd, met de post-quantum handtekeningstandaard ML-DSA-65 als standaard en automatische terugval op RS256. Productie werkt dus ongewijzigd door tot er quantumveilige sleutels zijn ingesteld.',
    highlights: [
      'Ondertekening met ML-DSA-65 (NIST FIPS 204) en automatische RS256-terugval',
      'Sleuteltooling genereert nu ook ML-DSA-44/65/87-sleutels',
      'Impact gemeten: een JWT van 658 B wordt 4.733 B met ML-DSA-65',
      'Onderbouwd met het PQC-migratie handboek van AIVD/CWI/TNO'
    ]
  },
  'fundament-424': {
    org: 'Fundament (open-source community)',
    about:
      'Een Go-project met een Kubernetes-operator voor OpenFSC, waarmee organisaties services met elkaar federeren. De groeps-CA is een echte productie-trustroot.',
    did: 'Het langstlevende RSA-artefact in de repo gevonden: een self-signed RSA-4096 CA die 10 jaar geldig was. De looptijd teruggebracht naar 3 jaar met een vernieuwingsvenster van 90 dagen, zodat alles wat de CA ondertekent korter quantumkwetsbaar blijft, en vastgelegd waarom cert-manager nog niet naar ML-DSA kan.',
    highlights: [
      'CA-looptijd 10 jaar → 3 jaar, vernieuwen 1 jaar → 90 dagen',
      'Timing getoetst met de ongelijkheid van Mosca (X + Y < Z)',
      'Ontwerpnotitie (FUN-21) met de route naar een echte ML-DSA-CA',
      'Zonder downtime: bestaande installaties vernieuwen bij de volgende reconcile'
    ]
  },
  'brp-amsterdam-195': {
    org: 'Gemeente Amsterdam',
    about:
      'Een autorisatieproxy tussen de diensten van de gemeente en de Basisregistratie Personen (BRP) bij RvIG, voor burgerservicenummers (BSN) en adresgegevens.',
    did: 'Langlevende burgergegevens beschermd tegen “harvest now, decrypt later”. Opt-in hybride post-quantum TLS (X25519MLKEM768) toegevoegd op de uitgaande verbinding naar RvIG, en de BSN-versleuteling geüpgraded van Fernet (AES-128) naar AES-256-GCM.',
    highlights: [
      'Hybride ML-KEM-sleuteluitwisseling (NIST FIPS 203) op TLS 1.3',
      'BSN-versleuteling naar AES-256-GCM, inclusief sleutelrotatie',
      'Opt-in vlag met gelogde terugval, geen risico tot hij aan staat',
      'Echte TLS-handshaketest bewijst dat het geen dode configuratie is'
    ]
  }
};
