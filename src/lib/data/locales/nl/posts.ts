import type { posts as En } from '../en/posts';

export const posts: typeof En = {
  'crypto-agility-in-three-pull-requests': {
    title: 'Crypto-agility in drie pull requests',
    description: 'Wat ik leerde van het omzetten van post-quantum scanbevindingen in wijzigingen die maintainers van overheidscode echt kunnen mergen.',
    sections: [
      {
        heading: 'Een bevinding is geen fix',
        body: [
          'Bij PQNavigator zie ik veel scanresultaten. "Hier wordt RSA gebruikt", "daar ECDSA". Het klopt allemaal, en bijna niets ervan is op zichzelf bruikbaar. Een maintainer die een lijst met vijftig quantum-kwetsbare plekken krijgt, sluit het tabblad.',
          'Dus koos ik drie bevindingen in open-source projecten van de Nederlandse overheid en probeerde ik van elk een pull request te maken die vandaag veilig te mergen is. Elk leerde me een ander patroon.'
        ]
      },
      {
        heading: '1. Stop met het algoritme hardcoden',
        body: [
          'In een proxy van het ministerie van VWS was het JWT-algoritme een klasseconstante. Dat is het tegenovergestelde van crypto-agility: aanpassen betekent een codewijziging, een review en een release.',
          {
            code: 'class ClientAssertionJwtIssuer:\n-    JWT_ALG: str = "RS256"\n+    KEY_STORE_FALLBACK_PRIVATE_KEY_ID: str = (\n+        "client_assertion_jwt_fallback_private_key"\n+    )',
            lang: 'python',
            caption: 'minvws/nl-mgo-dvp-proxy#8'
          },
          'De fix leest het algoritme uit de config, kiest standaard ML-DSA-65 en valt terug op RS256 als er geen post-quantum sleutel is. In productie verandert niets tot iemand de nieuwe sleutel toevoegt.',
          {
            code: 'try:\n    self.__private_key = self.__jwk_repository.get_first_key_from_store(\n        self.KEY_STORE_PRIVATE_KEY_ID\n    )\nexcept KeyError:\n    self.__using_fallback_alg = True\n    self.__private_key = self.__jwk_repository.get_first_key_from_store(\n        self.KEY_STORE_FALLBACK_PRIVATE_KEY_ID\n    )',
            lang: 'python'
          },
          {
            note: 'Post-quantum handtekeningen zijn groot. De JWT groeide van 658 naar 4.733 bytes. Prima voor een server-naar-server-call, een probleem als je hem in een cookie stopt. Meet voordat je migreert.'
          }
        ]
      },
      {
        heading: '2. Kun je niet overstappen, verklein dan het venster',
        body: [
          'De Kubernetes-operator van Fundament maakt een RSA-4096-CA die tien jaar geldig is. Eerlijk antwoord: overstappen op ML-DSA kan nog niet, want cert-manager ondersteunt alleen RSA, ECDSA en Ed25519.',
          'Het risico kun je wel verkleinen. De ongelijkheid van Mosca zegt dat je een probleem hebt als de tijd dat data veilig moet blijven (X) plus de migratietijd (Y) langer is dan de tijd tot er een quantumcomputer is (Z). Een CA van tien jaar maakt X enorm. Drie jaar, met vernieuwing 90 dagen voor het verlopen, maakt X klein en dwingt een nieuw beslismoment af voordat iemand zich opnieuw aan RSA vastlegt.',
          {
            code: '"privateKey":  map[string]any{"algorithm": "RSA", "size": int64(4096)},\n"duration":    "26280h", // 3 years\n"renewBefore": "2160h",  // 90 days',
            lang: 'go',
            caption: 'fundament-oss/fundament#424'
          }
        ]
      },
      {
        heading: '3. Bescherm wat aanvallers vandaag opnemen',
        body: [
          'De gemeente Amsterdam draait een proxy naar de Basisregistratie Personen. Burgerservicenummers blijven een leven lang gevoelig en zijn daarmee het schoolvoorbeeld van "harvest now, decrypt later".',
          'De wijziging voegt hybride post-quantum TLS (X25519MLKEM768) toe op de uitgaande verbinding, achter een vlag, en controleert of de gekoppelde OpenSSL nieuw genoeg is. Zo niet, dan logt hij een waarschuwing en gebruikt hij klassieke TLS in plaats van te falen.',
          {
            code: 'if ssl.OPENSSL_VERSION_INFO[:2] < _MIN_OPENSSL_FOR_PQC:\n    logger.warning(\n        "PQC TLS requested (BRP_ENABLE_PQC_TLS) but linked OpenSSL %s is older "\n        "than 3.5 and does not support the ML-KEM hybrid TLS 1.3 group - "\n        "falling back to classical TLS.",',
            lang: 'python',
            caption: 'Amsterdam/brp-amsterdam-api#195'
          }
        ]
      },
      {
        heading: 'Wat ze gemeen hebben',
        body: [
          {
            list: [
              'Elke wijziging is optioneel of heeft een terugval. Mergen verandert niets tot het team besluit.',
              'Elke wijziging legt zichzelf uit in de code, met een verwijzing naar de onderbouwing, zodat de volgende developer hem niet terugdraait.',
              'Elke wijziging is echt getest. De TLS-wijziging heeft een loopback-handshaketest, niet alleen een configcheck.'
            ]
          },
          'De post-quantum migratie gaat jaren duren. Niet in één big-bang project, maar in honderden kleine wijzigingen zoals deze. Hoe eerder die saai worden, hoe beter.'
        ]
      }
    ]
  },

  'playwright-and-mcp': {
    title: 'E2E-tests schrijven met Playwright en MCP',
    description:
      'Hoe ik de Playwright MCP-server gebruikte om een AI-assistent een echte browser te laten besturen bij het schrijven van end-to-end tests voor een Angular-app vol workflows.',
    sections: [
      {
        heading: 'Waarom E2E-tests achterlopen',
        body: [
          'In een app vol workflows zoals Property Plan zitten de riskante bugs zelden in één component. Ze zitten in het pad door meerdere schermen: een melding die niet naar de volgende status kan, een formulier dat op mobiel zijn state kwijtraakt. Daar zijn end-to-end tests voor, en precies daarvoor zijn ze het traagst om te schrijven.',
          'Een goede E2E-test schrijven betekent door de app klikken, stabiele selectors vinden, wachten op het juiste moment, en dat opnieuw doen als de UI verandert. Door die frictie loopt E2E-dekking meestal achter op de features.'
        ]
      },
      {
        heading: 'Wat MCP toevoegt',
        body: [
          'Met het Model Context Protocol kan een AI-assistent tools gebruiken. De Playwright MCP-server is zo’n tool: de assistent krijgt een echte browser die hij kan openen, doorklikken en lezen, via de toegankelijkheidsboom in plaats van screenshots.',
          'Dat verandert de loop. In plaats van zelf door een workflow te klikken en dat in code te vertalen, beschrijf ik het scenario, loopt de assistent door de app en review en vorm ik de test die hij voorstelt.'
        ]
      },
      {
        heading: 'Hoe ik het gebruikte',
        body: [
          {
            steps: [
              { title: 'Beschrijf het scenario', text: 'In gewone taal, vanuit de gebruiker: registreer een schademelding, wijs hem toe, sluit hem af.' },
              {
                title: 'Laat hem verkennen',
                text: 'De assistent opent de app, vindt elementen op rol en label, en meldt wat hij ziet, ook waar de flow niet doet wat ik beschreef.'
              },
              {
                title: 'Review het als elke andere code',
                text: 'De gegenereerde test krijgt dezelfde review als handgeschreven code: selectors op rol, geen vaste timeouts, één duidelijke assertion per stap.'
              },
              {
                title: 'Draai het in de pipeline',
                text: 'De test draait in CI met gewone Playwright. MCP gebruik je alleen bij het schrijven, niet bij het testen.'
              }
            ]
          }
        ]
      },
      {
        heading: 'Waar ik op let',
        body: [
          'Een assistent schrijft graag een test die slaagt. Dat is niet hetzelfde als een test die faalt wanneer het moet. Ik breek de feature nog steeds één keer expres om de test rood te zien worden.',
          'Toegankelijke markup betaalt zich dubbel uit. Dezelfde rollen en labels die schermlezergebruikers helpen, maken de app makkelijk navigeerbaar voor de assistent en de tests stabiel.'
        ]
      }
    ]
  },

  'how-this-portfolio-works': {
    title: 'Hoe dit portfolio werkt',
    description: 'Een statische SvelteKit-site waar elke grafiek en elk getal wordt berekend uit één databestand, in twee talen, zonder cookies.',
    sections: [
      {
        heading: 'Eén bron van waarheid',
        body: [
          'Alles op deze site komt uit een handvol TypeScript-bestanden in src/lib/data. De rollen hebben een begin- en einddatum en een stack. De rest wordt afgeleid: hoe lang ik elke skill gebruikte, de grafieken, de cijfers bij Over mij, de skillniveaus. Voeg ik een rol toe, dan werkt elk getal zich bij.',
          {
            code: "{\n  id: 'property-plan',\n  company: 'Property Plan',\n  start: '2025-07',\n  end: '2026-07',\n  stack: ['Angular', 'Ionic Framework', 'Capacitor', 'RxJS', 'Playwright', 'MCP']\n}",
            lang: 'ts',
            caption: 'src/lib/data/shared/roles.ts'
          },
          'Overlappende rollen tellen één keer, dus twee parallelle projecten met React maken van één jaar React geen twee.'
        ]
      },
      {
        heading: 'Statisch, maar niet saai',
        body: [
          'De site is gebouwd met SvelteKit en geëxporteerd als gewone HTML met adapter-static, gehost op GitHub Pages. Elke pagina, in beide talen, is vooraf gerenderd, dus hij werkt zonder JavaScript en zoekmachines zien de volledige tekst.',
          'Zwaardere secties laden pas als je in de buurt scrolt. De lettertypes worden zelf gehost, dus je IP-adres gaat niet naar Google. Statistieken komen van Cloudflare Web Analytics, zonder cookies, dus ook zonder cookiebanner.'
        ]
      },
      {
        heading: 'Twee talen, twee URL’s',
        body: [
          'Engels staat op / en Nederlands op /nl/. Elke pagina linkt met hreflang-tags naar zijn vertaling, zodat een Nederlandse zoekopdracht de Nederlandse pagina toont. De tekst per taal staat in een eigen map, en TypeScript controleert dat de Nederlandse versie elke sleutel van de Engelse heeft.'
        ]
      },
      {
        heading: 'Getest als een product',
        body: [
          {
            list: [
              'Unittests met Vitest voor het datumrekenwerk en de afgeleide statistieken.',
              'End-to-end tests met Playwright, inclusief een axe-toegankelijkheidsscan van elke pagina in beide thema’s.',
              'Lighthouse CI bij elke pull request, met budgetten voor performance, toegankelijkheid en SEO.',
              'Een Content Security Policy met hashes voor elk inline script.'
            ]
          },
          'De status van mijn open-source pull requests wordt bij het bouwen opgehaald uit de GitHub API, en de site bouwt zichzelf elke week opnieuw, zodat een gemergde PR niet maandenlang als open blijft staan.',
          'De code staat onder MIT-licentie op GitHub. Gebruik hem gerust voor je eigen portfolio.'
        ]
      }
    ]
  }
};
