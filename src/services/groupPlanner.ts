import { Gymnast } from '@/types/Gymnast';

type Group = Gymnast[];

function assignGroupsByClub(
  gymnasts: Gymnast[],
  maxGroups: number,
  categoryOrder: Record<string, number>
): Group[] {

  const clubGroups = new Map<string, Gymnast[]>();

  for (const g of gymnasts) {
    if (!clubGroups.has(g.club)) {
      clubGroups.set(g.club, []);
    }
    clubGroups.get(g.club)!.push(g);
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

export function generateGroupPlan(
  gymnasts: Gymnast[],
  competitionType: String): Record<string, Group[]>{
  
    console.log(competitionType)

    // Standard format
    const POOL_CATEGORIES: Record<string, string[]> = {
        "Pulje 1": ["rekrutt"],
        "Pulje 2": ["13-14"],
        "Pulje 3": ["15-16"],
        "Pulje 4": ["17-18", "senior"],
      };
    const POOL_GROUP_LIMITS: Record<string, number> = {
        "Pulje 1": 6,
        "Pulje 2": 3,
        "Pulje 3": 3,
        "Pulje 4": 3,
    };


    // Defining competition format
    if(competitionType == "SeniorNM"){
      const POOL_CATEGORIES: Record<string, string[]> = {
        "Pulje 1": ["Senior"], // Ikke seedet pulje - Ca 60%
        "Pulje 2": ["Senior"], // Seedet - Ca 40%
      };
      const POOL_GROUP_LIMITS: Record<string, number> = {
        "Pulje 1": 2,
        "Pulje 2": 2,
      };
    }
    
    const pools: Record<string, Gymnast[]> = {};

    for (const g of gymnasts) {
      for (const [poolName, cats] of Object.entries(POOL_CATEGORIES)) {
        if (cats.includes(g.category)) {
          if (!pools[poolName]) pools[poolName] = [];
          pools[poolName].push(g);
          break;
        }
      }
    }

    const result: Record<string, Group[]> = {};

    for (const [poolName, gymnastsInPool] of Object.entries(pools)) {
      const limit = POOL_GROUP_LIMITS[poolName] ?? 6;
      const categoryOrder = Object.fromEntries(
        POOL_CATEGORIES[poolName].map((cat, i) => [cat, i])
      );
      result[poolName] = assignGroupsByClub(gymnastsInPool, limit, categoryOrder);
    }
    return result;
}
