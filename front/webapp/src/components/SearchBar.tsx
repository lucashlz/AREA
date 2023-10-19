import { useEffect } from "react";
import Input, { InputProps } from "./Input";
import { InterfaceType } from "typescript";

type SearchBarProps = {
    style?: React.CSSProperties,
    setSearchInput: (e :string) => void,
    searchInput: string,
    items: any[],
    setItems: (item: any[]) => void,
    name: string
}

export default function SearchBar(props: SearchBarProps) {
    useEffect(() => {
        props.setItems([...props.items].sort((a, b) => {console.log("name a : ", a); return (a[props.name].localeCompare(b[props.name]))}))
    }, [props.searchInput])
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
