import { Gymnast } from '@/types/Gymnast';
import { SENIOR_DISTRIBUTION } from "@/types/seniorDistribution";

type Group = Gymnast[];

// ----------------------
// Small helpers
// ----------------------

function sum(numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

function splitGymnasts(gymnasts: Gymnast[]) {
  return {
    seeded: gymnasts.filter(g => g.seeded),
    unseeded: gymnasts.filter(g => !g.seeded),
  };
}

// ----------------------
// Group assignment helpers
// ----------------------

// Used for Norgescup:
// keep gymnasts from the same club together as much as possible,
// but group sizes do not need to match exact target sizes.
function assignGroupsByClub(
  gymnasts: Gymnast[],
  maxGroups: number,
  categoryOrder: Record<string, number>,
): Group[] {
  const clubGroups = new Map<string, Gymnast[]>();

  for (const gymnast of gymnasts) {
    if (!clubGroups.has(gymnast.club)) {
      clubGroups.set(gymnast.club, []);
    }
    clubGroups.get(gymnast.club)!.push(gymnast);
  }

  const sortedClubGroups = Array.from(clubGroups.values()).sort((a, b) => {
    const aOrder = Math.min(...a.map(g => categoryOrder[g.category] ?? 99));
    const bOrder = Math.min(...b.map(g => categoryOrder[g.category] ?? 99));

    return aOrder - bOrder || a[0].club.localeCompare(b[0].club);
  });

  const groups: Group[] = Array.from({ length: maxGroups }, () => []);
  const groupSizes = Array(maxGroups).fill(0);

  for (const clubGroup of sortedClubGroups) {
    const targetIndex = groupSizes.indexOf(Math.min(...groupSizes));
    groups[targetIndex].push(...clubGroup);
    groupSizes[targetIndex] += clubGroup.length;
  }

  for (const group of groups) {
    group.sort((a, b) => {
      const aOrder = categoryOrder[a.category] ?? 99;
      const bOrder = categoryOrder[b.category] ?? 99;

      return aOrder - bOrder || a.club.localeCompare(b.club);
    });
  }

  return groups;
}

// Used for NM Senior / NMJ:
// tries to keep clubs together, but must respect exact target group sizes.
function assignGroupsWithTargetSizes(
  gymnasts: Gymnast[],
  targetSizes: number[],
): Group[] {
  const groups: Group[] = targetSizes.map(() => []);
  const clubGroups = new Map<string, Gymnast[]>();

  for (const gymnast of gymnasts) {
    if (!clubGroups.has(gymnast.club)) {
      clubGroups.set(gymnast.club, []);
    }
    clubGroups.get(gymnast.club)!.push(gymnast);
  }

  const sortedClubGroups = Array.from(clubGroups.values()).sort(
    (a, b) => b.length - a.length || a[0].club.localeCompare(b[0].club)
  );

  for (const clubGroup of sortedClubGroups) {
    let placedWholeClub = false;

    for (let i = 0; i < groups.length; i++) {
      const remainingCapacity = targetSizes[i] - groups[i].length;

      if (clubGroup.length <= remainingCapacity) {
        groups[i].push(...clubGroup);
        placedWholeClub = true;
        break;
      }
    }

    if (!placedWholeClub) {
      for (const gymnast of clubGroup) {
        let bestIndex = -1;
        let bestRemaining = -1;

        for (let i = 0; i < groups.length; i++) {
          const remainingCapacity = targetSizes[i] - groups[i].length;

          if (remainingCapacity > bestRemaining) {
            bestRemaining = remainingCapacity;
            bestIndex = i;
          }
        }

        if (bestIndex === -1 || bestRemaining <= 0) {
          throw new Error("Could not place gymnast into target-sized groups");
        }

        groups[bestIndex].push(gymnast);
      }
    }
  }

  return groups;
}

// ----------------------
// Competition-specific planners
// ----------------------

function generateSeniorPlan(gymnasts: Gymnast[]): Record<string, Group[]> {
  const totalGymnasts = gymnasts.length;
  const { seeded, unseeded } = splitGymnasts(gymnasts);

  console.log("[groupPlanner] Gymnasts", gymnasts);
  console.log("Seeded:", seeded);
  console.log("Unseeded:", unseeded);
  console.log("Original length:", totalGymnasts);
  console.log("After split:", seeded.length + unseeded.length);

  if (seeded.length + unseeded.length !== totalGymnasts) {
    throw new Error("Split lengths do not match original gymnast count");
  }

  const distribution = SENIOR_DISTRIBUTION[totalGymnasts];

  if (!distribution) {
    throw new Error(`Unsupported number of gymnasts: ${totalGymnasts}`);
  }

  const expectedUnseeded = sum(distribution.unseeded);
  const expectedSeeded = sum(distribution.seeded);

  if (unseeded.length !== expectedUnseeded) {
    throw new Error(
      `Expected ${expectedUnseeded} unseeded gymnasts for total ${totalGymnasts}, but got ${unseeded.length}`
    );
  }

  if (seeded.length !== expectedSeeded) {
    throw new Error(
      `Expected ${expectedSeeded} seeded gymnasts for total ${totalGymnasts}, but got ${seeded.length}`
    );
  }

  const result: Record<string, Group[]> = {};

  if (distribution.unseeded.length > 0) {
    result["Pulje 1"] = assignGroupsWithTargetSizes(
      unseeded,
      distribution.unseeded
    );
  }

  if (distribution.seeded.length > 0) {
    result["Pulje 2"] = assignGroupsWithTargetSizes(
      seeded,
      distribution.seeded
    );
  }

  return result;
}

function generateNorgescupPlan(gymnasts: Gymnast[]): Record<string, Group[]> {
  const poolCategories: Record<string, string[]> = {
    "Pulje 1": ["rekrutt"],
    "Pulje 2": ["13-14"],
    "Pulje 3": ["15-16"],
    "Pulje 4": ["17-18", "senior"],
  };

  const poolGroupLimits: Record<string, number> = {
    "Pulje 1": 6,
    "Pulje 2": 3,
    "Pulje 3": 3,
    "Pulje 4": 3,
  };

  const pools: Record<string, Gymnast[]> = {};

  for (const gymnast of gymnasts) {
    for (const [poolName, categories] of Object.entries(poolCategories)) {
      if (categories.includes(gymnast.category)) {
        if (!pools[poolName]) {
          pools[poolName] = [];
        }
        pools[poolName].push(gymnast);
        break;
      }
    }
  }

  const result: Record<string, Group[]> = {};

  for (const [poolName, gymnastsInPool] of Object.entries(pools)) {
    const limit = poolGroupLimits[poolName];
    const categoryOrder = Object.fromEntries(
      poolCategories[poolName].map((category, index) => [category, index])
    );

    result[poolName] = assignGroupsByClub(
      gymnastsInPool,
      limit,
      categoryOrder
    );
  }

  return result;
}

// ----------------------
// Public entry point
// ----------------------

export function generateGroupPlan(
  gymnasts: Gymnast[],
  competitionType: string
): Record<string, Group[]> {
  if (competitionType === "NMS" || competitionType === "NMJ") {
    return generateSeniorPlan(gymnasts);
  }

  return generateNorgescupPlan(gymnasts);
}