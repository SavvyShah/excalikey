import React, { useRef } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  background-color: #ced4da;
  width: 1.5rem;
  height: 1.5rem;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.25rem;
  &:hover {
    background-color: #adb5bd;
  }
  &:active {
    background-color: #b0b0b0;
  }
`;

interface Props {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  icon: JSX.Element;
  className: string;
}

const ColorPicker: React.FunctionComponent<Props> = ({
  value,
  setValue,
  icon,
  style,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>();

  return (
    <Wrapper
      style={{ color: value, ...style }}
      onClick={() => inputRef.current.click()}
    >
      {icon}
      <input
        type="color"
        value={value || "#000000"}
        onChange={(e) => setValue(e.target.value)}
        style={{ display: "none" }}
        ref={inputRef}
      />
    </Wrapper>
  );
};

export default ColorPicker;
