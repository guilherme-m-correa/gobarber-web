import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
  margin-top: 24px;
  color: #312e38;
  font-weight: 500;
  height: 56px;
  background: #ff9000;
  border-radius: 10px;
  border: 0;
  padding: 16px;
  width: 100%;
  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#ff9000')};
  }
`;
