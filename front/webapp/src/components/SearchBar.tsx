import { useEffect } from "react";
import Input from "./Input";

type SearchBarProps = {
  style?: React.CSSProperties;
  setSearchInput: (e: string) => void;
  searchInput: string;
  items: any[];
  setItems: (item: any[]) => void;
  name: string;
};

export default function SearchBar(props: SearchBarProps) {
  useEffect(() => {
    const sortedItems = [...props.items].sort((a, b) => {
      const distanceA = a[props.name]
        .toLowerCase()
        .indexOf(props.searchInput.toLowerCase());
      const distanceB = b[props.name]
        .toLowerCase()
        .indexOf(props.searchInput.toLowerCase());
      return distanceB - distanceA;
    });

    props.setItems(sortedItems);
  }, [props.searchInput]);
  return (
    <div className="applets-searchbar-holder" style={props.style}>
      <Input
        onChange={(e) => props.setSearchInput(e.target.value)}
        placeholder="Search"
        type="searchInput"
        value={props.searchInput}
        icon={`${process.env.PUBLIC_URL}/search.png`}
      />
    </div>
  );
}
