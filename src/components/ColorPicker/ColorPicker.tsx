import React, { useRef } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  background-color: #ced4da;
  width: 2.5rem;
  height: 2.5rem;
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
  className
}: Props) => {
  const inputRef = useRef<HTMLInputElement>();

  return (
    <Wrapper
      className={className}
      style={{ color: value }}
      onClick={() => inputRef.current.click()}
    >
      <div
        style={{
          height: "1.5rem",
          width: "1.5rem",
          paddingLeft: "0.2rem",
          marginLeft: "0.2rem"
        }}
      >
        {icon}
      </div>
      <input
        type="color"
        value={value || "#000000"}
        onChange={(e) => setValue(e.target.value)}
        style={{ visibility: "hidden", height: 0, width: 0 }}
        ref={inputRef}
      />
    </Wrapper>
  );
};

export default ColorPicker;
