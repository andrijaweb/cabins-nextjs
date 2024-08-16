import { getCountries } from "@/app/_lib/data-service";
import { FC } from "react";

// Let's imagine your colleague already built this component 😃

interface SelectCountryProps {
  defaultCountry: string | null | undefined;
  name: string;
  id: string;
  className: string;
}

const SelectCountry: FC<SelectCountryProps> = async ({
  defaultCountry,
  name,
  id,
  className,
}) => {
  const countries = await getCountries();
  const flag =
    countries.find((country: any) => country.name === defaultCountry)?.flag ??
    "";

  return (
    <select
      name={name}
      id={id}
      // Here we use a trick to encode BOTH the country name and the flag into the value. Then we split them up again later in the server action
      defaultValue={`${defaultCountry}%${flag}`}
      className={className}
    >
      <option value="">Select country...</option>
      {countries.map((c: any) => (
        <option key={c.name} value={`${c.name}%${c.flag}`}>
          {c.name}
        </option>
      ))}
    </select>
  );
};

export default SelectCountry;
