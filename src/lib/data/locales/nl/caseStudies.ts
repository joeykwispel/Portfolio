import type { caseStudies as En } from '../en/caseStudies';

export const caseStudies: typeof En = {
  pqnavigator: {
    title: 'Cryptografie zichtbaar maken voor de Rijksoverheid',
    lede: 'PQNavigator scant broncode op cryptografie en laat zien hoe klaar een organisatie is voor de post-quantum migratie. Ik werk aan de hele keten: de interface die mensen lezen, de flows erachter en het cluster waarop het draait.',
    role: 'Senior front-end & full-stack developer',
    team: 'Team van Competa IT, voor RVO, met ministeries en VNG als stakeholders',
    teaser: 'Duizenden technische crypto-bevindingen omzetten in iets waar een beleidsteam mee verder kan.',
    sections: [
      {
        heading: 'Het probleem',
        body: [
          'Grote quantumcomputers gaan RSA en elliptische-curve-cryptografie breken. Data die vandaag wordt onderschept, kan later worden ontsleuteld. Overheidsorganisaties moeten dus nu weten waar ze kwetsbare algoritmes gebruiken. De meeste hebben geen idee: cryptografie zit verstopt in libraries, configbestanden, certificaten en losse hulpfuncties, verspreid over honderden repositories.',
          'PQNavigator beantwoordt die vraag. Het scant repositories zonder ze uit te voeren, bouwt een cryptografische inventaris (een CBOM) en beoordeelt wat er moet veranderen en in welke volgorde, volgens het PQC-migratiehandboek van AIVD, CWI en TNO.'
        ]
      },
      {
        heading: 'Wat ik doe',
        body: [
          {
            steps: [
              {
                title: 'De review-interface',
                text: 'Ik bouw de front-end waarin mensen per repository bevindingen, risico’s en scanresultaten doorlopen. Het lastige is niet de tabel, maar de taal: een bevinding als "RSA-2048-sleutelgeneratie in een JWT-signer" moet begrijpelijk zijn voor een developer én voor een beleidsadviseur.'
              },
              {
                title: 'End-to-end flows',
                text: 'Ik ontwerp en bouw de flows van scanverzoek tot rapport, over de Next.js-front-end, de NestJS- en FastAPI-services en de server-side jobs die scandata verwerken.'
              },
              {
                title: 'Infrastructuur',
                text: 'Ik richt de servers op Proxmox en het Kubernetes-cluster in waarop het platform draait, plus de deployment-workflows en de lokale ontwikkelomgeving, zodat de hele stack op een laptop net zo draait als in het cluster.'
              },
              {
                title: 'Stakeholders',
                text: 'Ik schuif aan bij sessies met ministeries (BZK, BuZa, VWS) en VNG, en vertaal hun feedback en randvoorwaarden naar concrete productverbeteringen.'
              }
            ]
          }
        ]
      },
      {
        heading: 'Keuzes en afwegingen',
        body: [
          'Toegankelijkheid is een eis, geen extraatje: overheidssoftware moet voldoen aan WCAG 2.2. Dat sluit veel "slimme" datavisualisatie uit. Elke grafiek heeft een leesbaar tekstalternatief nodig, en kleur alleen draagt nooit de betekenis van een risiconiveau.',
          'Omdat ik zowel de interface als de infrastructuur beheer, zijn er minder overdrachten. Als een scan traag is, zie ik zelf of het aan de UI, de API of het cluster ligt, in plaats van een ticket aan te maken en te wachten.'
        ]
      },
      {
        heading: 'Waar het nu staat',
        body: [
          'PQNavigator is een werkend proof of concept en wordt gevalideerd op open-source repositories van de Nederlandse overheid. Organisaties schrokken van het aantal cryptografische afhankelijkheden dat het vond, en gaven aan geen nieuw platform zelf te willen beheren. Die feedback maakte van het product een managed service in plaats van een tool om zelf te hosten.',
          'Bevindingen uit die scans werden ook echte fixes: drie ervan heb ik omgezet in pull requests voor overheidsprojecten. Daarover lees je meer in de open-source case.'
        ]
      }
    ]
  },

  'post-quantum-open-source': {
    title: 'Post-quantum fixes in overheidscode',
    lede: 'Drie pull requests naar open-source projecten van het ministerie van VWS, de gemeente Amsterdam en de Fundament-community. Elk begon als bevinding in PQNavigator en eindigde als wijziging die vandaag veilig te mergen is.',
    role: 'Contributor, van bevinding tot pull request',
    team: 'Solo, gereviewd door de maintainers van elk project',
    teaser: 'Van scanbevinding naar een wijziging die maintainers zonder risico kunnen mergen.',
    sections: [
      {
        heading: 'Het probleem',
        body: [
          'Een scanrapport vol "quantum-kwetsbare" bevindingen is makkelijk te maken en makkelijk te negeren. Maintainers hebben een wijziging nodig die iets echts oplost, productie niet breekt en zichzelf uitlegt. Ik wilde laten zien dat de post-quantum migratie kan beginnen met kleine stappen die goed te reviewen zijn.'
        ]
      },
      {
        heading: 'Drie fixes, drie patronen',
        body: [
          {
            steps: [
              {
                title: 'Maak het algoritme configureerbaar (VWS)',
                text: 'Een proxy ondertekende zijn login-JWT met een hardcoded RS256-constante. Ik maakte het algoritme configureerbaar, standaard ML-DSA-65 (FIPS 204) met automatische terugval op RS256 als er nog geen post-quantum sleutel is. Productie werkt ongewijzigd door tot de sleutels er zijn.'
              },
              {
                title: 'Verkort de looptijd als overstappen nog niet kan (Fundament)',
                text: 'Een Kubernetes-operator maakte een RSA-4096-CA die 10 jaar geldig was. cert-manager kan nog geen ML-DSA-certificaten uitgeven, dus overstappen kon niet. Ik verkortte de looptijd naar 3 jaar met een vernieuwingsvenster van 90 dagen. Zo blijft alles wat de CA ondertekent korter kwetsbaar.'
              },
              {
                title: 'Bescherm data die jarenlang geheim moet blijven (Amsterdam)',
                text: 'Een proxy naar de Basisregistratie Personen verwerkt burgerservicenummers. Ik voegde optionele hybride post-quantum TLS (X25519MLKEM768) toe tegen “harvest now, decrypt later”, en zette de BSN-versleuteling om van Fernet (AES-128) naar AES-256-GCM.'
              }
            ]
          }
        ]
      },
      {
        heading: 'Keuzes en afwegingen',
        body: [
          'Elke wijziging is optioneel of heeft een terugval. Een maintainer kan mergen zonder dat productie verandert, en het aanzetten wanneer het team er klaar voor is. Dat weegt zwaarder dan cryptografisch perfect zijn.',
          'Meten in plaats van gokken. Een ML-DSA-65-handtekening laat de JWT groeien van 658 naar 4.733 bytes: prima voor een server-naar-server-call, maar goed om te weten. Voor de CA toetste ik de nieuwe looptijd aan de ongelijkheid van Mosca (X + Y < Z) en schreef ik een design record over de weg naar een echte ML-DSA-CA.',
          'Tests bewijzen dat het werkt. De TLS-wijziging heeft een echte loopback-handshaketest, zodat vaststaat dat de nieuwe instelling iets doet en niet alleen door de config-parser wordt geaccepteerd.'
        ]
      },
      {
        heading: 'Resultaat',
        body: [
          'Drie pull requests, 432 regels toegevoegd in 16 bestanden, elk onderbouwd met het PQC-migratiehandboek van AIVD, CWI en TNO. Ze staan open voor review; de status op deze site werkt zichzelf bij vanaf GitHub.'
        ]
      }
    ]
  },

  'property-plan': {
    title: 'Onderhoudsworkflows op web en mobiel',
    lede: 'Met Property Plan registreren en behandelen vastgoedprofessionals onderhoudsverzoeken en schademeldingen. Een jaar lang werkte ik aan de Angular-webapp en de mobiele app die uit dezelfde code wordt gebouwd.',
    role: 'Senior front-end developer',
    team: 'Agile Scrum-team met Product Owner, UX-designer en back-end developers',
    teaser: 'Eén Angular-codebase voor web en mobiel, en E2E-tests die het bijhouden.',
    sections: [
      {
        heading: 'Het probleem',
        body: [
          'Een onderhoudsverzoek gaat door veel handen: een huurder meldt schade, iemand beoordeelt het, een aannemer wordt ingepland, het werk wordt gecontroleerd. Elke stap heeft eigen schermen, statussen en uitzonderingen, en alles moet werken op een desktop op kantoor én op een telefoon op locatie.'
        ]
      },
      {
        heading: 'Wat ik deed',
        body: [
          {
            list: [
              'Nieuwe functionaliteit gebouwd voor het registreren, beheren en afhandelen van onderhoudsworkflows in Angular en TypeScript, met RxJS voor state die verandert terwijl je kijkt.',
              'Gewerkt aan de web- en mobiele app vanuit één codebase, met Ionic en Capacitor voor de native builds.',
              'Functionele wensen en UX-ontwerpen vertaald naar componenten die de rest van het team kon hergebruiken.',
              'Code gereviewd met focus op consistentie en onderhoudbaarheid, en meegedacht over de technische architectuur.',
              'Technische schuld opgespoord en verminderd als onderdeel van het gewone sprintwerk, niet als apart project.'
            ]
          }
        ]
      },
      {
        heading: 'End-to-end tests met Playwright en MCP',
        body: [
          'Workflows met veel stappen zijn precies waar regressies zich verstoppen, en precies waar E2E-tests met de hand schrijven traag is. Ik zette geautomatiseerde end-to-end tests op met Playwright en gebruikte de Playwright MCP-server, zodat een AI-assistent een echte browser door de app kon sturen terwijl ik de tests schreef en verfijnde.',
          'Het resultaat: bredere testdekking van de workflows en een snellere feedbackloop. Een wijziging die een stap brak, kwam naar boven in de pipeline in plaats van in een gebruikersmelding.'
        ]
      },
      {
        heading: 'Wat ik meeneem',
        body: [
          'Gedeelde code tussen web en mobiel loont alleen als componenten vanaf het begin voor beide worden ontworpen. Een desktopscherm achteraf geschikt maken voor een telefoon is altijd meer werk dan het meteen responsive bouwen.'
        ]
      }
    ]
  },

  'code-tuner': {
    title: 'Een greenfield SaaS voor technische schuld leiden',
    lede: 'Code Tuner analyseert codebases en laat zien waar technische schuld zich ophoopt, zodat teams kunnen kiezen waar hun inzet het meest oplevert. Bij Red Ocelot leidde ik de ontwikkeling vanaf een lege repository, en was ik ook Scrum Master van het team.',
    role: 'Lead software developer en Scrum Master',
    team: 'Ontwikkelteam met de Product Owner en domeinexperts van Red Ocelot',
    teaser: 'Van lege repository naar een platform dat codemetrics omzet in beslissingen.',
    sections: [
      {
        heading: 'Het probleem',
        body: [
          'Elke organisatie weet dat ze technische schuld heeft. Weinigen kunnen zeggen waar die zit, hoe erg het is of wat eerst moet. Code Tuner meet signalen als complexiteit, koppeling en hoe vaak code verandert, zonder de code uit te voeren of aan te passen, en toont ze zo dat techniek en business samen kunnen prioriteren.'
        ]
      },
      {
        heading: 'Wat ik deed',
        body: [
          {
            steps: [
              {
                title: 'Architectuur',
                text: 'Microservices en REST API’s ontworpen en gebouwd met NestJS en Hono op PostgreSQL via Prisma, met Python waar de analyse daarom vroeg.'
              },
              {
                title: 'Front-end',
                text: 'De React- en Next.js-applicatie gebouwd, inclusief datavisualisaties met D3.js en Chart.js die metrics leesbaar maken voor mensen die geen code lezen.'
              },
              {
                title: 'Kwaliteit',
                text: 'Testen en CI/CD opgezet met Jest, Vitest, React Testing Library en GitHub Actions, en Stryker-mutatietesten gebruikt om te checken of de tests echt bugs vangen.'
              },
              {
                title: 'Leiderschap',
                text: 'Het team geleid en begeleid, en als Scrum Master de ceremonies gedraaid in nauwe samenwerking met de Product Owner.'
              }
            ]
          }
        ]
      },
      {
        heading: 'Keuzes en afwegingen',
        body: [
          'Een tool die technische schuld meet, kan zelf niet veel schuld hebben. Daarom zaten testen en CI/CD in de eerste sprints en niet in de backlog voor later, en was mutatietesten de extra looptijd waard.',
          'Tegelijk lead developer en Scrum Master zijn vraagt balans. Het hielp om de rollen zichtbaar gescheiden te houden: in de refinement sprak ik voor de techniek, in de retrospective faciliteerde ik en liet ik het team praten.'
        ]
      },
      {
        heading: 'Resultaat',
        body: ['Code Tuner ging van greenfield-idee naar een werkend SaaS-platform dat nu live staat op codetuner.digital.']
      }
    ]
  },

  'vice-content-platform': {
    title: 'Herbruikbare templates voor redacties',
    lede: 'Bij Vice Media werkte ik aan het platform waarmee redacties content maken en publiceren voor sociale kanalen. Mijn focus: React-componenten en templates die meerdere redacties konden gebruiken zonder developer.',
    role: 'Front-end developer',
    team: 'Agile Scrum-team met UX-designers en developers',
    teaser: 'Componenten waarmee redacteuren in huisstijl publiceren zonder een developer te vragen.',
    sections: [
      {
        heading: 'Het probleem',
        body: [
          'Meerdere redacties publiceren op social media, elk met eigen formats, onder één merk. Zonder gedeelde bouwstenen betekent elk nieuw format maatwerk en kleine inconsistenties.'
        ]
      },
      {
        heading: 'Wat ik deed',
        body: [
          {
            list: [
              'Herbruikbare React-componenten en templates in Next.js gebouwd, gebruikt door meerdere redacties.',
              'Figma-ontwerpen vertaald naar responsive componenten, in nauwe samenwerking met de UX-designers.',
              'De kwaliteit en toegankelijkheid van de front-end bewaakt.',
              'De applicatie getest met Cypress en Cucumber, zodat scenario’s leesbaar waren voor het hele team.'
            ]
          }
        ]
      },
      {
        heading: 'Wat ik meeneem',
        body: [
          'Een componentenbibliotheek is een product met eigen gebruikers. De redacteuren waren die gebruikers, en de beste componenten waren die ze konden gebruiken zonder documentatie te lezen.'
        ]
      }
    ]
  }
};
