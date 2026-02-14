export const animeSiteConfig = {
  title: 'Whispers of the White Moon',
  tagline: 'Discover your clan. Find your character. Awaken your destiny.',
  synopsis: `Take the Clan Personality Quiz to discover which of the six powerful clans you belong to—Sun, Moon, Earth, Fire, Water, or Lightning. Your instincts, emotional reactions, and moral decisions will reveal your true nature.

Then, dive deeper with the Character Match System. Are you a natural leader like Kazeyori? Do you share Sankei's fiery determination? Or perhaps Haruna's unwavering support? Future characters like Volt await discovery as well.

Every result ends with a single truth: "Your Eye has begun to flicker…"`,
  
  ctaButtons: {
    primary: 'Discover the Story',
    secondary: 'Meet the Characters'
  },

  intro: {
    videoUrl: '/assets/Whispers Of The White Moon intro-1.mp4',
    fallbackUrl: '/assets/Whispers Of The White Moon intro-1.mp4'
  },

  video: {
    title: 'Video Player',
    sourceUrl: 'https://example.com/video.mp4',
    fallbackUrl: 'https://example.com/video',
    fallbackText: 'Open video in new tab'
  },

  worldbuilding: {
    clans: [
      { name: 'Sun Clan', eye: 'Taiyonome' },
      { name: 'Moon Clan', eye: 'Tsukinome' },
      { name: 'Earth Clan', eye: 'Chikyonome' },
      { name: 'Fire Clan', eye: 'Hinome' },
      { name: 'Water Clan', eye: 'Mizunome' },
      { name: 'Lightning Clan', eye: 'Denkinome' }
    ],
    clanEyeRules: [
      'The trio has their clan eyes but do not know how to use them',
      'They do not know the eyes can activate',
      'Eyes activate automatically only in very intense battles',
      'Activation is brief, instinctive, and uncontrollable',
      'Activation is controllable for those who have mastered it, but not for the trio',
      'Characters who have control are completely aware when their clan eyes activate, but the trio is not yet'
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
      bio: 'A strong-willed warrior from the Fire Clan who visits the Moon Village and becomes fast friends with Kazeyori.'
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
      name: 'Iwagami Sekien',
      clan: 'Moon Clan',
      age: 'Unknown',
      height: '5\'10"',
      rank: 3,
      design: 'Wise appearance with traditional robes, calm demeanor',
      personality: 'Patient and knowledgeable',
      weapon: 'Ancient staff',
      powerState: 'Master of Moon Clan techniques. Has fully awakened Tsukinome',
      bio: 'A legendary sensei from the Moon Clan who possesses deep knowledge of the ancient arts. His wisdom and mastery of the Tsukinome make him a formidable mentor for those seeking to unlock their true potential.'
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
      name: 'Suma',
      clan: 'Sun Clan',
      age: 'Unknown',
      height: '5\'4"',
      rank: 'Unknown',
      design: 'Fierce appearance with sun-themed attire, confident stance',
      personality: 'Aggressive and formidable',
      weapon: 'Solar whip',
      powerState: 'Skilled warrior with mastery of her solar whip. Has Taiyonome (Sun Clan eye)',
      bio: 'A fierce warrior from the Sun Clan who confronts the trio on their journey. Wielding her solar whip with deadly precision, she presents a formidable challenge that will test the limits of Sankei, Haruna, and Kazeyori\'s teamwork and combat abilities.'
    }
  ],

  episodes: [
    {
      number: 1,
      title: 'The Boy from the Moon Village',
      synopsis: 'The story begins with Kazeyori Shiranagi, a quiet and lonely boy living in the Moon Village. We follow his daily life, witnessing his struggles with weakness and isolation. No battles occur—just a glimpse into the life of a boy who doesn\'t yet know his destiny.',
      videoSourceUrl: undefined
    },
    {
      number: 2,
      title: 'The Visitors of the Moon Village',
      synopsis: 'Sankei and Haruna arrive in the Moon Village and meet Kazeyori, asking for directions. Introductions lead to a natural friendship forming. After they leave, Kazeyori eats at a local restaurant while Sankei and Haruna discuss him extensively on their journey back.',
      videoSourceUrl: undefined
    },
    {
      number: 3,
      title: 'The Sun\'s First Shadow',
      synopsis: 'Sankei and Haruna return to the Moon Village to find Kazeyori and invite him to train together with the goal of becoming the strongest in the world. Kazeyori agrees, and the trio sets out to travel to different villages. On their journey, they are confronted by Suma, a fierce warrior from the Sun Clan wielding a solar whip. The trio must face their first real battle together, and it won\'t be easy.',
      videoSourceUrl: undefined
    }
  ]
};
