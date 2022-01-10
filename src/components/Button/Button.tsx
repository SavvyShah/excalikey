import styled from "styled-components";

const Button = styled.button<{ active: boolean }>`
  background-color: ${(props) => (props.active ? `#adb5bd` : `#ced4da`)};
  width: 2.5rem;
  height: 2.5rem;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.25rem;
  border: none;
  &:hover {
    background-color: #adb5bd;
  }
  &:active {
    background-color: #b0b0b0;
  }
`;

export default Button;
