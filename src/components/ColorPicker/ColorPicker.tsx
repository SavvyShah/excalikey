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
  position: relative;
  &:hover {
    background-color: #adb5bd;
  }
  &:active {
    background-color: #b0b0b0;
  }
`;

interface Props {
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  icon: JSX.Element;
  style: any;
}

const ColorPicker: React.FunctionComponent<Props> = ({
  value,
  onChange,
  icon,
  style,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Wrapper
      style={{ color: value, ...style }}
      onClick={() => inputRef!.current!.click()}
    >
      {icon}
      <input
        type="color"
        value={value || "#000000"}
        onChange={(e) => onChange(e.target.value)}
        style={{ position: "absolute", top: 20, visibility: "hidden" }}
        ref={inputRef}
      />
    </Wrapper>
  );
};

export default ColorPicker;
