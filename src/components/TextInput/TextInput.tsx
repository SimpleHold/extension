import * as React from 'react';

// Styles
import Styles from './styles';

interface Props {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput: React.FC<Props> = (props) => {
  const {label, value, onChange} = props;

  const [isFocused, setIsFocused] = React.useState<boolean>(false);
  const textInputRef = React.useRef<HTMLInputElement>(null);

  const onClick = (): void => {
    setIsFocused(true);
    setTimeout(() => {
      textInputRef.current?.focus();
    }, 100);
  };

  const onBlur = (): void => {
    setIsFocused(false);
  };

  return (
    <Styles.Container onClick={onClick}>
      <Styles.Label>{label}</Styles.Label>
      {value || isFocused ? (
        <Styles.TextInput
          value={value}
          onChange={onChange}
          ref={textInputRef}
          onBlur={onBlur}
        />
      ) : null}
    </Styles.Container>
  );
};

export default TextInput;
