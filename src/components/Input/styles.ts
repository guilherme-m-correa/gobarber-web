import styled, { css } from 'styled-components';

import Tooltip from '../Tooltip/index';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  hasError: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: #232129;
  border-radius: 10px;
  padding: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  color: #666360;
  border: 2px solid #232129;

  & + div {
    margin-top: 8px;
  }

  ${props =>
    props.hasError &&
    css`
      border-color: #c53030;
    `}

  ${props =>
    props.isFocused &&
    css`
      color: #ff9000;
      border-color: #ff9000;
    `}

  input {
    color: #dbd5d2;
    flex: 1;
    background: transparent;
    border: 0;

    &::placeholder {
      color: #666360;
    }
  }

  svg {
    margin-right: 16px;

    ${props =>
      props.isFilled &&
      css`
        color: #ff9000;
      `}
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;

  svg {
    margin: 0;
  }

  span {
    background: #c53030;
    color: #dbd5d2;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
