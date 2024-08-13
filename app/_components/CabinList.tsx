import { unstable_noStore as noStore } from "next/cache";

import CabinCard from "./CabinCard";
import { getCabins } from "../_lib/data-service";

const CabinList = async ({ filter }: { filter: string }) => {
  noStore();
  const cabins = await getCabins();

  if (!cabins.length) return null;

  const capacityRanges: Record<string, [number, number]> = {
    small: [0, 3],
    medium: [4, 7],
    large: [8, Infinity],
  };

  const filteredCabins =
    filter === "all"
      ? cabins
      : cabins.filter((cabin) => {
          const maxCapacity = cabin.maxCapacity ?? 0;
          const [min, max] = capacityRanges[filter] || [0, Infinity];
          return maxCapacity >= min && maxCapacity <= max;
        });

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {filteredCabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
};

export default CabinList;
