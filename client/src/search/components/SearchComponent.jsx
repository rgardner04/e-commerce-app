import { useState, useEffect } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import "../styles/SearchComponent.css";

export default function SearchComponent() {
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 300);

  useEffect(() => {
    if (debouncedSearchText) {
      console.log(debouncedSearchText);
    }
  }, [debouncedSearchText]);

  return (
    <div className="search-container">
      <div className="search-cta">
        <h1 className="search-cta-header">Discover products you'll love</h1>
        <p className="search-cta-subtext">
          Thoughtfully curated everyday essentials, delivered to your door.
        </p>
      </div>
      <input
        className="search-input"
        type="text"
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  );
}
