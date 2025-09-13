import { useState } from "react";
import useDebounce from "../../hooks/useDebounce";

export default function useRadioListContentController() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return {
    search,
    debouncedSearch,
    handleChange,
  };
}
