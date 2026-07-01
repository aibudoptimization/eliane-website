import {createClient} from 'next-sanity'
import {createReadStream, existsSync} from 'node:fs'
import {basename, resolve} from 'node:path'

type Span = {
  _type: 'span'
  _key: string
  text: string
  marks: string[]
}

type Block = {
  _type: 'block'
  _key: string
  style: 'normal'
  children: Span[]
  markDefs: Array<Record<string, unknown>>
  listItem?: 'bullet' | 'number'
  level?: number
}

let keyCounter = 0
const k = () => `k${++keyCounter}`

function mdToBlock(text: string, opts?: {listItem?: 'bullet' | 'number'; level?: number}): Block {
  const children: Span[] = []
  const boldRe = /\*\*(.*?)\*\*/g
  let last = 0
  let m: RegExpExecArray | null

  while ((m = boldRe.exec(text)) !== null) {
    if (m.index > last) {
      children.push({_type: 'span', _key: k(), text: text.slice(last, m.index), marks: []})
    }
    children.push({_type: 'span', _key: k(), text: m[1], marks: ['strong']})
    last = m.index + m[0].length
  }
  if (last < text.length) {
    children.push({_type: 'span', _key: k(), text: text.slice(last), marks: []})
  }
  if (children.length === 0) {
    children.push({_type: 'span', _key: k(), text, marks: []})
  }

  return {
    _type: 'block',
    _key: k(),
    style: 'normal',
    children,
    markDefs: [],
    ...(opts?.listItem ? {listItem: opts.listItem, level: opts.level ?? 1} : {}),
  }
}

function faqLinkedBullet(prefixBold: string, url: string, suffix: string): Block {
  const linkKey = k()
  return {
    _type: 'block',
    _key: k(),
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    children: [
      {_type: 'span', _key: k(), text: prefixBold, marks: ['strong', linkKey]},
      {_type: 'span', _key: k(), text: suffix, marks: []},
    ],
    markDefs: [{_key: linkKey, _type: 'link', href: url, openInNewTab: true}],
  }
}

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const token = process.env.SANITY_AUTH_TOKEN ?? process.env.SANITY_API_READ_TOKEN

  if (!projectId || !dataset || !token) {
    throw new Error('Missing Sanity env vars. Need projectId, dataset, and SANITY_AUTH_TOKEN (or fallback token).')
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-10-01',
    token,
    useCdn: false,
  })

  const existingHome = await client.fetch<{_id: string} | null>(`*[_type == "homePage"][0]{_id}`)
  const homeId = existingHome?._id ?? 'homePage'

  async function uploadImageFromPath(filePath: string) {
    if (!existsSync(filePath)) {
      throw new Error(`Image file not found: ${filePath}`)
    }
    return client.assets.upload('image', createReadStream(filePath), {
      filename: basename(filePath),
    })
  }

  const heroImagePath = resolve(process.cwd(), 'public/images/eliane-intro-training.png')
  const meetTrainerImagePath = resolve(process.cwd(), 'public/images/eliane-hero.jpg')
  const forYouImagePath = resolve(process.cwd(), 'public/images/eliane-poids-libres.png')
  const phoneMockPath =
    'C:/Users/Marsan/.cursor/projects/c-Users-Marsan-Desktop-Vibecoding-eliane/assets/c__Users_Marsan_AppData_Roaming_Cursor_User_workspaceStorage_19663086f227eb28a64faff850306d3f_images_phone-mock.jpeg-af3a1b5b-6eeb-4883-ae33-f0f6d6c93244.png'

  const [heroAsset, meetTrainerAsset, forYouAsset, phoneMockAsset] = await Promise.all([
    uploadImageFromPath(heroImagePath),
    uploadImageFromPath(meetTrainerImagePath),
    uploadImageFromPath(forYouImagePath),
    uploadImageFromPath(phoneMockPath),
  ])

  const homepagePatch = {
    heroKicker: 'Éliane Larre - Entraîneure personnelle à Montréal',
    heroHeadline: [
      mdToBlock(
        "Un service d'accompagnement personnalisé pour t'entraîner avec confiance, progresser durablement et arrêter de toujours recommencer",
      ),
    ],
    heroSubheadline:
      "Un accompagnement sur mesure, conçu pour toi qui veut intégrer l'entraînement à ta vie, ou pour toi qui crois avoir tout essayé, mais qui n'arrives toujours pas à atteindre tes objectifs et à les maintenir.",
    heroImage: {
      _type: 'image',
      asset: {_type: 'reference', _ref: heroAsset._id},
      alt: "Éliane tenant un haltère dans la salle d'entraînement",
    },
    heroCtaLabel: 'Je veux discuter de mes objectifs',
    heroCtaSubtext: "Appel gratuit, sans engagement pour voir si l'accompagnement est adapté à toi.",
    marqueeItems: [
      'Entraînements en présentiel',
      'À Montréal',
      '10+ années de pratique',
      'Approche personnalisée',
      'Approche durable',
      'Progression mesurable',
    ],
    sledEyebrow: 'Approche',
    sledHeadline: [mdToBlock('Tu veux progresser, mais tu ne veux plus avancer seule.')],
    sledSubheadline: [
      mdToBlock(
        "Que tu débutes ou que tu t'entraînes déjà depuis un moment, l'objectif est le même : avoir un cadre clair, te sentir guidée et savoir que tu avances dans la bonne direction.",
      ),
    ],
    sledFromTitle: "Là où tu es aujourd'hui",
    sledFromItems: [
      { _key: k(), text: [mdToBlock('Tu ne sais pas toujours **quoi faire au gym** ni si tu exécutes les mouvements correctement.')] },
      { _key: k(), text: [mdToBlock('Tu as déjà essayé des programmes, des vidéos ou des applications, mais tu finis par **décrocher**.')] },
      { _key: k(), text: [mdToBlock('Tu veux des résultats, mais **tu ne veux pas tomber dans une approche extrême ou irréaliste**.')] },
      { _key: k(), text: [mdToBlock("Tu aimerais **te sentir plus confiante** dans ton corps, dans tes entraînements et dans tes choix.")] },
      { _key: k(), text: [mdToBlock('Tu sens que **tu pourrais aller plus loin** avec un encadrement plus humain, plus précis et plus personnalisé.')] },
    ],
    sledToTitle: "Là où je vais t'amener",
    sledToItems: [
      { _key: k(), text: [mdToBlock("Vers une **routine d'entraînement claire, réaliste et adaptée à ton quotidien**, pour que tu puisses rester constante.")] },
      { _key: k(), text: [mdToBlock("Vers une **meilleure compréhension de ton corps**, de ton énergie et de ce dont tu as besoin pour progresser sans t'épuiser.")] },
      { _key: k(), text: [mdToBlock('Vers une façon de bouger plus contrôlée, plus précise et plus efficace, **pour que chaque entraînement ait un vrai impact**.')] },
      { _key: k(), text: [mdToBlock('Vers un sentiment de solidité, de **confiance et de maîtrise de ton corps**.')] },
      { _key: k(), text: [mdToBlock("Vers plus d'autonomie, avec **des bases concrètes en entraînement et en nutrition** que tu pourras continuer d'utiliser bien après l'accompagnement.")] },
    ],
    sledCtaLabel: "C'est là que je veux aller",
    meetTrainerKicker: 'Rencontre ton entraîneure',
    meetTrainerImage: {
      _type: 'image',
      asset: {_type: 'reference', _ref: meetTrainerAsset._id},
      alt: "Portrait souriant d'Éliane Larre",
    },
    meetTrainerCards: [
      {
        _key: k(),
        label: 'Mon parcours',
        body: "Depuis plus de 12 ans, l'entraînement fait partie de ma vie. **Au fil des années, j'ai appris que les résultats durables ne viennent pas d'une routine parfaite, d'un plan extrême ou d'une motivation constante.** Ils viennent d'une structure réaliste, d'une meilleure compréhension de son corps et d'habitudes qu'on arrive réellement à maintenir dans le quotidien.",
      },
      {
        _key: k(),
        label: 'Ma philosophie',
        body: "J'accompagne mes clientes comme j'aborde mon propre parcours : avec équilibre, sans extrêmes ni restrictions, et en m'adaptant aux différentes saisons de la vie. **Je ne suis pas là pour te donner un plan impossible à maintenir.** Je suis là pour t'aider à t'entraîner avec intention, à mieux comprendre ce que tu fais, à progresser de façon sécuritaire et à bâtir une routine qui s'intègre vraiment à ta vie.",
      },
      {
        _key: k(),
        label: 'Ma spécialité',
        body: 'Aider les femmes à se sentir plus fortes, plus confiantes et plus en maîtrise de leur corps. Des femmes qui veulent des résultats, oui, mais surtout une méthode qui respecte leur rythme, leur réalité et leur corps.',
      },
      {
        _key: k(),
        label: 'Mon engagement',
        body: "**Mon but est de t'amener vers plus de clarté, de constance et d'autonomie.** Je veux que tu saches quoi faire, pourquoi tu le fais, et comment continuer à prendre soin de toi bien après notre travail ensemble.",
      },
    ],
    meetTrainerQuote:
      "Tu n'as pas besoin d'un autre programme. Tu as besoin d'un cadre, d'un regard expert et d'un accompagnement qui s'adapte réellement à toi.",
    meetTrainerCtaLabel: 'Voir mon quotidien sur Instagram',
    meetTrainerCtaUrl: 'https://www.instagram.com/eliane.au.naturel',
    pullQuoteText:
      "Tu n'as pas besoin d'un autre programme. Tu as besoin d'un cadre, d'un regard expert et d'un accompagnement qui s'adapte réellement à toi.",
    pullQuoteEnabled: false,
    offeringEyebrow: 'Mon accompagnement',
    offeringTitle: 'Un accompagnement personnalisé, du début à la fin.',
    offeringLead:
      'Quatre piliers conçus ensemble pour te donner le cadre, la guidance et les outils dont tu as besoin pour progresser sans te perdre en route.',
    offeringAppImage: {
      _type: 'image',
      asset: {_type: 'reference', _ref: phoneMockAsset._id},
      alt: "Montage de trois écrans de l'application d'entraînement",
    },
    offeringAppKicker: 'Application personnalisée',
    offeringAppTitle: 'Un outil pensé pour toi, accessible où que tu sois.',
    offeringAppDescription:
      'Tes entraînements, ton historique de progression et tes communications avec moi, regroupés au même endroit. Simple, lisible, fait pour t\'accompagner sans t\'alourdir.',
    offeringFeatures: [
      {
        _key: k(),
        title: 'Un plan clair',
        description:
          "Ton programme est intégré à ton application personnalisée pour t'offrir une structure claire et des outils concrets pour soutenir ta progression.",
      },
      {
        _key: k(),
        title: 'Séances privées en présentiel',
        description: 'Tu es guidée, corrigée et accompagnée en temps réel pour progresser avec confiance.',
      },
      {
        _key: k(),
        title: 'Suivi entre les rencontres',
        description: "Tu n'es pas laissée seule entre deux séances. L'accompagnement te garde engagée, alignée et constante.",
      },
      {
        _key: k(),
        title: 'Enseignements concrets et utiles',
        description:
          'Je suis là pour te partager mes connaissances en entraînement et nutrition pour te permettre de comprendre et maintenir tes résultats.',
      },
    ],
    offeringCtaLabel: "Je veux voir si l'accompagnement est adapté pour moi",
    inPersonEyebrow: 'Pourquoi le présentiel',
    inPersonTitle: 'Pourquoi le présentiel change tout.',
    presentielCards: [
      {
        _key: k(),
        title: 'Correction en temps réel',
        description:
          "J'ajuste ta technique pour maximiser ta progression et diminuer les risques de blessure.",
        iconName: 'check',
      },
      {
        _key: k(),
        title: 'Progression sécuritaire',
        description: "Je t'aide à progresser tout en respectant ton rythme.",
        iconName: 'shield',
      },
      {
        _key: k(),
        title: 'Imputabilité',
        description: "Le présentiel ajoute une structure qui soutient l'engagement.",
        iconName: 'clock',
      },
      {
        _key: k(),
        title: 'Adaptation à ton état',
        description:
          'Un entraînement sur mesure, selon ton énergie, tes besoins et tes envies.',
        iconName: 'eye',
      },
    ],
    locationQuote:
      "Un programme peut te dire *quoi faire*. Un accompagnement en présentiel te montre *comment le faire* et t'aide à progresser plus rapidement qu'en étant seule.",
    reviewsEyebrow: 'Leur expérience',
    reviewsTitle: "Ce qu'elles en disent.",
    reviewsList: [
      {
        _key: k(),
        name: 'Claudie Larose',
        rating: 5,
        excerpt:
          "L'encadrement est super bien structuré : on se voit une fois par semaine en présentiel, et entre les séances, elle est toujours disponible pour répondre à mes questions. Ce que j'apprécie le plus, c'est l'ambiance sans pression — chacun évolue à son rythme, sans jugement.",
      },
      {
        _key: k(),
        name: 'Erwanne Frenette',
        rating: 5,
        excerpt:
          'Le fait que les séances soient en présentiel fait vraiment une différence pour rester motivée et bien encadrée. Tout est structuré, clair et professionnel, ce qui me permet de me sentir en confiance.',
      },
      {
        _key: k(),
        name: 'Laurie Ciorra',
        rating: 5,
        excerpt:
          "Éliane offre un service 100% personnalisé. Elle est patiente, motivante, encadrante et disponible 24/7 pour ses clientes. Elle m'a aidé à passer d'un mode de vie sédentaire à active.",
      },
    ],
    forYouEyebrow: 'Pour toi ou pas ?',
    forYouTitle: [mdToBlock('Une approche claire, pour les bonnes raisons.')],
    forYouImage: {
      _type: 'image',
      asset: {_type: 'reference', _ref: forYouAsset._id},
      alt: "Éliane accotée sur la barre dans le gym",
    },
    forYouYesTitle: "C'est pour toi si",
    forYouYesItems: [
      'Tu veux être accompagnée sérieusement.',
      "Tu es prête à t'impliquer.",
      "Tu veux apprendre à bien t'entraîner.",
      "Tu veux une approche personnalisée plutôt qu'un plan générique.",
      'Tu veux des résultats durables, pas une solution express.',
    ],
    forYouNoTitle: "Ce n'est probablement pas pour toi si",
    forYouNoItems: [
      'Tu cherches uniquement le prix le plus bas.',
      'Tu veux une solution miracle sans implication.',
      "Tu n'es pas disponible pour des séances en présentiel à Montréal.",
      'Tu préfères un programme 100 % autonome, sans accompagnement.',
    ],
    forYouFooter: [
      mdToBlock(
        "Cet accompagnement s'adresse aux femmes qui veulent investir sérieusement dans leur progression, leur confiance et leur santé à long terme.",
      ),
    ],
    forYouCtaLabel: "Je veux savoir si c'est pour moi",
    afterCallEyebrow: 'Comment ça se passe',
    afterCallHeadline: [mdToBlock("Après l'appel découverte.")],
    afterCallIntro: [
      mdToBlock(
        "L'appel est gratuit, sans engagement, et sert d'abord à voir si l'accompagnement est réellement pertinent pour toi.",
      ),
    ],
    afterCallSteps: [
      {
        title: 'Comprendre où tu en es',
        description:
          "On prend le temps de regarder ton point de départ : ton historique d'entraînement, ton mode de vie et ce qui t'a freinée par le passé.",
      },
      {
        title: 'Clarifier tes objectifs',
        description:
          'On met des mots précis sur ce que tu veux vraiment atteindre, et sur ce qui compte pour toi à long terme.',
      },
      {
        title: "Voir si l'accompagnement est adapté",
        description: "Je te dirai honnêtement si ce que j'offre correspond à ce que tu cherches — ou pas.",
      },
      {
        title: 'Répondre à tes questions',
        description:
          'Tu peux poser tout ce que tu veux : logistique, fréquence, méthode, prix. Aucune question n\'est de trop.',
      },
      {
        title: 'Te recommander la meilleure prochaine étape',
        description: 'Que ce soit avec moi ou ailleurs, tu repars avec une direction claire pour avancer.',
      },
    ],
    afterCallCtaLabel: "Je suis prête à avoir plus d'informations",
    purpleCtaEyebrow: 'Prochaine étape',
    purpleCtaHeadline: [mdToBlock('Es-tu prête à investir en toi ?')],
    purpleCtaButtonLabel: "Je veux passer à l'action",
    purpleCtaFooter: 'Gratuit et sans engagement',
    faqEyebrow: 'FAQ',
    faqHeadline: [mdToBlock('Questions fréquentes.')],
    faqSubheadline: [
      mdToBlock(
        "Pour toute question sur l'accompagnement, les offres ou la logistique, n'hésite pas. Je réponds personnellement.",
      ),
    ],
    collaboratorsHeadline: 'Mes collaborateurs',
  }

  const faqDocs = [
    {
      _id: 'faq-formations',
      _type: 'faq',
      order: 1,
      question: 'Quelles formations as-tu suivies ?',
      answer: [
        faqLinkedBullet(
          'Ataraxia',
          'https://ataraxia-entraineur.com',
          ', École de formation pour entraîneur privé en présentiel (juillet 2025).',
        ),
        faqLinkedBullet(
          'Psycom',
          'https://www.communicationpsycom.com',
          ", PRECOG, formation d'un an spécialisée en développement psychologique, communication humaine, relations interpersonnelles et leadership (mars 2026).",
        ),
        faqLinkedBullet(
          'Précision Nutrition',
          'https://www.precisionnutrition.com',
          ', formation en coaching nutritionnel (en cours).',
        ),
        mdToBlock("**MOMENTUM**, formation d'un an dans la continuité de PRECOG (en cours).", {
          listItem: 'bullet',
          level: 1,
        }),
      ],
    },
    {
      _id: 'faq-public-cible',
      _type: 'faq',
      order: 2,
      question: "À qui s'adresse ton accompagnement ?",
      answer: [
        mdToBlock(
          "Mon accompagnement s'adresse autant aux femmes qui débutent qu'à celles qui ont déjà de l'expérience en entraînement. Chaque démarche est entièrement personnalisée, en fonction de ton niveau, de tes objectifs et de ta réalité.",
        ),
      ],
    },
    {
      _id: 'faq-lieu',
      _type: 'faq',
      order: 3,
      question: 'Où ont lieu les séances ?',
      answer: [mdToBlock('Les séances se déroulent au Biner Training, au 220, boulevard Crémazie Ouest, à Montréal.')],
    },
    {
      _id: 'faq-prive-ou-groupe',
      _type: 'faq',
      order: 4,
      question: 'Les séances sont-elles privées ou en groupe ?',
      answer: [
        mdToBlock(
          "Les séances sont entièrement privées. Tu bénéficies d'un accompagnement individuel, dans un espace dédié au Biner Training.",
        ),
      ],
    },
    {
      _id: 'faq-equipement',
      _type: 'faq',
      order: 5,
      question: "Quel type d'équipement utilises-tu ?",
      answer: [
        mdToBlock(
          "Je travaille exclusivement avec poids libres et accessoires, notamment les bandes élastiques, le ballon, le step, le banc et d'autres outils complémentaires. Si tu t'entraînes à la maison, ton programme est adapté en fonction de l'équipement dont tu disposes.",
        ),
      ],
    },
    {
      _id: 'faq-programmes-maison',
      _type: 'faq',
      order: 6,
      question: 'Fais-tu des programmes pour la maison ?',
      answer: [
        mdToBlock(
          "Oui. Je crée ton programme en fonction de l'équipement auquel tu as accès à la maison. À noter : selon tes objectifs, il est possible que certains équipements soient recommandés pour te permettre de progresser de façon optimale.",
        ),
      ],
    },
    {
      _id: 'faq-blessure-condition',
      _type: 'faq',
      order: 7,
      question: "Puis-je m'entraîner avec une blessure ou une condition médicale ?",
      answer: [
        mdToBlock(
          "Chaque situation mérite d'être évaluée avec attention. Lors de l'appel découverte, nous prenons le temps de voir comment adapter l'accompagnement à ta réalité. Selon le contexte, l'avis d'un professionnel de la santé peut être requis avant de débuter.",
        ),
      ],
    },
    {
      _id: 'faq-grossesse-postpartum',
      _type: 'faq',
      order: 8,
      question: 'Accompagnes-tu les femmes enceintes ou en post-partum ?',
      answer: [
        mdToBlock(
          "Oui, avec certaines précautions. Un avis médical est requis avant de débuter ou de reprendre l'entraînement. Nous en discutons lors de l'appel découverte afin d'adapter l'accompagnement à ta situation.",
        ),
      ],
    },
  ]

  const allFaqIds = await client.fetch<string[]>(`*[_type == "faq"]._id`)
  const keepFaqIds = new Set(faqDocs.map((d) => d._id))

  let tx = client.transaction()
  tx = tx.createIfNotExists({_id: homeId, _type: 'homePage'})
  tx = tx.patch(homeId, {set: homepagePatch})

  for (const faq of faqDocs) {
    tx = tx.createOrReplace(faq)
  }

  for (const id of allFaqIds) {
    const base = id.startsWith('drafts.') ? id.slice('drafts.'.length) : id
    if (!keepFaqIds.has(base)) {
      tx = tx.delete(id)
    }
  }

  tx = tx.createOrReplace({
    _id: 'collaborator-esthetique-flora',
    _type: 'collaborator',
    name: 'Esthétique Flora',
    featured: true,
    order: 1,
  })

  await tx.commit()

  console.log('Step 1 seed complete:')
  console.log(`- homePage patched (id: ${homeId})`)
  console.log(`- FAQs upserted: ${faqDocs.length}`)
  console.log('- FAQs not in seed list deleted')
  console.log('- Collaborator upserted: Esthétique Flora')
  console.log('- Images uploaded and linked for hero, meet-trainer, offering (montage 3 écrans), for-you')
}

main().catch((err) => {
  console.error('Step 1 seed failed:', err)
  process.exit(1)
})

