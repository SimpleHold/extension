import * as React from "react";
import SVG from "react-inlinesvg";

// Assets
import searchIcon from "@assets/icons/searchIcon.svg";

// Styles
import Styles from "./styles";

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const SearchBar: React.FC<Props> = (props) => {
  const { value, onChange, placeholder = '' } = props;

  const [isFocused, setIsFocused] = React.useState<boolean>(false);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(e.target.value);
  };

  const onFocus = (): void => {
    setIsFocused(true);
  };

  const onBlur = () => {
    setIsFocused(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onChange("")
    }
  }

  return (
    <Styles.Container isFocused={isFocused} className={"search"}>
      <Styles.Row>
        <SVG src={searchIcon} width={16} height={16} className="search-icon"/>
        <Styles.Input
          placeholder={placeholder}
          value={value}
          onChange={onChangeInput}
          ref={inputRef}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
      </Styles.Row>
    </Styles.Container>
  );
};

export default SearchBar;
