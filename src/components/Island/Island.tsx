import styled from "styled-components";
const Island = styled.div`
  background-color: hsla(0, 0%, 100%, 0.9);
  backdrop-filter: saturate(100%) blur(10px);
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  padding: 0.25rem;
  transition: box-shadow 0.5s ease-in-out;
`;

export default Island;
