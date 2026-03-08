import { useEffect, useRef } from "react";
import type { NewCharacter } from "../backend";
import { useInternetIdentity } from "./useInternetIdentity";
import { useCreateCharacter, useGetAllCharacters } from "./useQueries";

const SEED_CHARACTERS: NewCharacter[] = [
  {
    name: "Kazeyori Shiranagi",
    role: "Main Character — Moon Clan",
    bio: "Kazeyori is an 11-year-old boy from the Moon Clan, standing 4'9\" with messy hair and a quiet, lonely spirit. He lost his father Harusuke (leader of the Moon Clan) at age 5 and his mother Ayame at age 7 — both killed by the Sunseekers. Unknown to him, his father's Power of the Moon was passed down to him. Ranked 10, he relies on weapons, basic combat, and instinct. He carries the Tsukinome — an inactive clan eye he does not yet know about.",
    imageUrl: "",
    weapon: "None (relies on basic combat and instinct)",
    power:
      "Tsukinome (inactive, unknown) — Moon Clan eye that activates briefly and uncontrollably in intense battle",
    traits: ["Quiet", "Lonely", "Enduring", "Rank 10"],
  },
  {
    name: "Sankei Enshiro",
    role: "Main Trio — Fire Clan",
    bio: "Sankei is a 12-year-old from the Fire Clan, standing 5'6\" with a muscular athletic build and messy red hair. He wears a green kimono and blue sneakers. Confident and energetic, he travels with Haruna to the Moon Village seeking Moon Rock, where he befriends Kazeyori. Ranked 9, he is the strongest of the trio so far.",
    imageUrl: "",
    weapon: "Black sword with fire patterns and a red handle",
    power:
      "Hinome (inactive, unknown) — Fire Clan eye that activates briefly and uncontrollably in intense battle",
    traits: ["Energetic", "Confident", "Muscular", "Rank 9"],
  },
  {
    name: "Haruna Hishigawa",
    role: "Main Trio — Earth Clan",
    bio: "Haruna is a 12-year-old girl from the Earth Clan, standing 5'0\" with a thin petite build and black hair with bangs. She wears a pink kimono and pink sneakers. Thoughtful and caring, she travels alongside Sankei. After meeting Kazeyori in the Moon Village, she talks about him extensively on the way home — sensing something special in him.",
    imageUrl: "",
    weapon: "Golden staff with 地球 carved on it — can change length",
    power:
      "Chikyonome (inactive, unknown) — Earth Clan eye that activates briefly and uncontrollably in intense battle",
    traits: ["Thoughtful", "Caring", "Petite", "Rank 10"],
  },
  {
    name: "Iwagami Sekien",
    role: "Sensei — Moon Clan",
    bio: "Iwagami Sekien is a member of the Moon Clan who becomes the sensei of Kazeyori Shiranagi, Sankei Enshiro, and Haruna Hishigawa. His descendants originate from multiple different clans — an extremely rare and significant lineage that implies deep ties across clan boundaries. He does not appear in Episode 1 but makes his presence known during a major battle. Rank 5.",
    imageUrl: "",
    weapon: "",
    power: "Moon Clan lineage with multi-clan descendant bloodline",
    traits: ["Mentor", "Multi-Clan Lineage", "Rank 5"],
  },
  {
    name: "Aurelian",
    role: "Major Antagonist — Sun Clan",
    bio: "Aurelian is the supreme leader of the Sunseekers and the most feared figure in the world — the one responsible for the deaths of Kazeyori's parents. Standing 6'4\" with fiery hair and an extremely muscular frame (8-pack, massive biceps and triceps), he wears a fire-colored grim reaper-style suit with sandals. He appears at the end of the anime as the ultimate threat. Rank: Sun King.",
    imageUrl: "",
    weapon: "Yellow staff with a mini sun on top",
    power:
      "Gravity Control, U.V. Ray, God Ray, Eternal Noon, Supernova Collapse (strongest)",
    traits: [
      "Supreme Villain",
      "Sun King",
      "Gravity Control",
      "Supernova Collapse",
    ],
  },
];

/**
 * When the authenticated admin visits the characters panel and the canister
 * has zero characters, this hook silently seeds the known cast so the
 * public-facing site immediately shows them.
 */
export function useSeedCharacters() {
  const { identity } = useInternetIdentity();
  const { data: characters, isLoading } = useGetAllCharacters();
  const createCharacter = useCreateCharacter();
  const seededRef = useRef(false);

  useEffect(() => {
    if (seededRef.current) return;
    if (!identity) return;
    if (isLoading) return;
    if (!characters) return;
    if (characters.length > 0) return; // already has characters, skip

    seededRef.current = true;

    // Seed sequentially to preserve display order
    (async () => {
      for (const char of SEED_CHARACTERS) {
        try {
          await createCharacter.mutateAsync(char);
        } catch {
          // Ignore individual failures — partial seed is better than none
        }
      }
    })();
  }, [identity, isLoading, characters, createCharacter]);
}
