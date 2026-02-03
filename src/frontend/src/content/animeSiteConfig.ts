export const animeSiteConfig = {
  title: 'Whispers of the White Moon',
  tagline: 'A journey through clans, destiny, and the power of awakening',
  synopsis: `In a world divided into six powerful clans—Sun, Moon, Earth, Fire, Water, and Lightning—each possessing unique clan eyes and abilities, a young warrior begins an unexpected journey.

The trio of young fighters relies on weapons, basic combat, and teamwork as they have not yet awakened their powers. Their clan eyes activate briefly and instinctively only in the most intense battles, completely unknown to them.

As they navigate a world connected by Moon Rock portals and face threats from the past, they must grow stronger to protect what matters most.`,
  
  ctaButtons: {
    primary: 'Discover the Story',
    secondary: 'Meet the Characters'
  },

  worldbuilding: {
    clans: [
      { name: 'Sun Clan', eye: 'Taiyonome' },
      { name: 'Moon Clan', eye: 'Tsukinome' },
      { name: 'Earth Clan', eye: 'Chikyonome' },
      { name: 'Fire Clan', eye: 'Hinome' },
      { name: 'Water Clan', eye: 'Mizunome' },
      { name: 'Lightning Clan', eye: 'Inazumanome' }
    ],
    clanEyeRules: [
      'The trio has their clan eyes but do not know how to use them',
      'They do not know the eyes can activate',
      'Eyes activate automatically only in very intense battles',
      'Activation is brief, instinctive, and uncontrollable',
      'The characters are completely unaware it\'s happening'
    ],
    powerSystem: {
      title: 'Power System (Start of Anime)',
      rules: [
        'No one in the trio has awakened powers',
        'No techniques unlocked',
        'They rely on weapons, basic combat, teamwork, and instinct'
      ]
    },
    rankSystem: {
      title: 'Rank System',
      description: 'Rank 1 is the strongest, Rank 10 is the weakest',
      startingRanks: [
        { character: 'Kazeyori Shiranagi', rank: 10 },
        { character: 'Haruna Hishigawa', rank: 10 },
        { character: 'Sankei Enshiro', rank: 9 }
      ]
    },
    shiranagFamily: {
      title: 'Shiranagi Family (Moon Clan)',
      father: {
        name: 'Harusuke Shiranagi',
        role: 'Leader of the Moon Clan',
        details: 'Holder of the Power of the Moon. Killed by the Sunseekers when Kazeyori was 5. His power was passed to Kazeyori, who does not know this.'
      },
      mother: {
        name: 'Ayame Shiranagi',
        details: 'No powers. Killed by the Sunseekers when Kazeyori was 7.'
      }
    },
    moonRock: {
      title: 'Moon Rock',
      description: 'A special rock that allows portals between villages, used for travel between clan territories.'
    }
  },

  characters: [
    {
      name: 'Kazeyori Shiranagi',
      clan: 'Moon Clan',
      age: 11,
      height: '4\'9"',
      rank: 10,
      design: 'Messy hair, small and slim build, wears sandals',
      personality: 'Quiet, lonely, enduring',
      weapon: 'None specified',
      powerState: 'No techniques, no awakened power. Has Tsukinome (inactive, unknown to him)',
      bio: 'The main character from the Moon Village. Orphaned young after his parents were killed by the Sunseekers, he carries a hidden power he doesn\'t yet understand.'
    },
    {
      name: 'Sankei Enshiro',
      clan: 'Fire Clan',
      age: 12,
      height: '5\'6"',
      rank: 9,
      design: 'Muscular, athletic build with 6-pack, messy red hair, green kimono, blue sneakers',
      personality: 'Energetic and determined',
      weapon: 'Black sword with fire patterns and red handle',
      powerState: 'No techniques, no awakened power. Has Hinome (inactive, unknown to him)',
      bio: 'A strong-willed warrior from the Fire Clan who visits the Moon Village seeking Moon Rock and becomes fast friends with Kazeyori.'
    },
    {
      name: 'Haruna Hishigawa',
      clan: 'Earth Clan',
      age: 12,
      height: '5\'0"',
      rank: 10,
      design: 'Thin, petite build, black hair with bangs, pink kimono, pink sneakers',
      personality: 'Kind and supportive',
      weapon: 'Golden staff with 地球 (Earth) carved on it, can change length',
      powerState: 'No techniques, no awakened power. Has Chikyonome (inactive, unknown to her)',
      bio: 'A skilled fighter from the Earth Clan who travels with Sankei and quickly bonds with Kazeyori during their visit to the Moon Village.'
    },
    {
      name: 'Aurelian',
      clan: 'Sun Clan',
      age: 'Unknown',
      height: '6\'4"',
      rank: 'Sunk King',
      design: 'Fiery hair, extremely muscular with 8-pack, big biceps and triceps, fire-colored grim reaper-style suit, sandals',
      personality: 'Ruthless and powerful',
      weapon: 'Yellow staff with a mini sun on top',
      powerState: 'Extremely powerful. Powers: Gravity Control, U.V Ray, God Ray, Eternal Noon, Supernova Collapse (strongest)',
      bio: 'Leader of the Sunseekers and the ultimate threat. Appears at the end of the anime as an overwhelmingly powerful adversary.'
    },
    {
      name: 'Kuroshi Shirogane',
      clan: 'Moon Clan',
      height: '5\'8"',
      rank: 5,
      design: 'Silver-white hair, lean athletic build, dark blue kimono with moon patterns, black combat boots',
      personality: 'Mysterious and calculating',
      weapon: 'Twin silver daggers with crescent moon engravings',
      powerState: 'No techniques, no awakened power. Has Tsukinome (inactive, unknown to him)',
      bio: 'A skilled fighter from the Moon Clan with a mysterious past. Known for his strategic mind and swift combat style.'
    }
    // ============================================================
    // TEMPLATE FOR NEXT CHARACTER - Uncomment and fill in when ready
    // ============================================================
    // {
    //   name: '[Character Name]',
    //   clan: '[Sun/Moon/Earth/Fire/Water/Lightning] Clan',
    //   age: 0,
    //   height: '[Height in feet/inches]',
    //   rank: 0,
    //   design: '[Physical appearance, clothing, distinctive features]',
    //   personality: '[Key personality traits]',
    //   weapon: '[Weapon description or "None specified"]',
    //   powerState: '[Current power status, techniques, clan eye status]',
    //   bio: '[Character background and story role]'
    // }
  ],

  episodes: [
    {
      number: 1,
      title: 'The Boy from the Moon Village',
      synopsis: 'The story begins with Kazeyori Shiranagi, a quiet and lonely boy living in the Moon Village. We follow his daily life, witnessing his struggles with weakness and isolation. No battles occur, and no sensei appears—just a glimpse into the life of a boy who doesn\'t yet know his destiny.'
    },
    {
      number: 2,
      title: 'The Visitors of the Moon Village',
      synopsis: 'Sankei and Haruna arrive in the Moon Village searching for Moon Rock. They meet Kazeyori and ask for directions, leading to introductions and a natural friendship forming. After they leave, Kazeyori eats at a local restaurant while Sankei and Haruna discuss him extensively on their journey back.'
    }
  ]
};
