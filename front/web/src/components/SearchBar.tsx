import { useEffect } from "react";
import Input from "./Input";
import _ from "lodash";
import "./SearchBar.css";

type SearchBarProps = {
  style?: React.CSSProperties;
  setSearchInput: (e: string) => void;
  searchInput: string;
  items: any[];
  setItems: (item: any[]) => void;
  name: string[];
};

export default function SearchBar(props: SearchBarProps) {
  useEffect(() => {
    const sortedItems = [...props.items].sort((a, b) => {
      let distanceA = 0;
      let distanceB = 0;
      for (let i = 0; i < props.name.length; i++) {
        const valueA = _.get(a, props.name[i], "").toLowerCase();
        const valueB = _.get(b, props.name[i], "").toLowerCase();
        distanceA += valueA.indexOf(props.searchInput.toLowerCase());
        distanceB += valueB.indexOf(props.searchInput.toLowerCase());
      }
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
