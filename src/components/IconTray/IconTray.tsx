import styled from "styled-components";

const IconButtonTray = styled.div`
  background-color: hsla(0, 0%, 100%, 0.9);
  backdrop-filter: saturate(100%) blur(10px);
  box-shadow: 0 1px 5px rgb(0 0 0 / 15%);
  border-radius: 4px;
  padding: 0.25rem;
  transition: box-shadow 0.5s ease-in-out;
  display: flex;
`;

export const IconButton = styled.button<{ selected: boolean }>`
  background-color: ${(props) => (props.selected ? `#ced4da` : `#e9ecef`)};
  width: 2.5rem;
  height: 2.5rem;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.25rem;
  border: none;
  &:hover {
    background-color: #ced4da;
  }
  &:active {
    background-color: #ced4da;
  }
`;

export default IconButtonTray;
