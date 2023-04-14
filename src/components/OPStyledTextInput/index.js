import styled from "styled-components"

export const TextInput = styled.input`
  box-sizing: border-box;
  /* Auto layout */
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px 16px;

  height: 48px;
  width: 456px;

  font-weight: 400;
  font-size: 16px;
  line-height: 24px;

  /* 🌤️ $neutral/0 (White) */
  background: #ffffff;

  /* 🌤️ $neutral/300 */
  border: 1px solid #cbd5e0;
  border-radius: 12px;

  &:hover {
    border: 1px solid #a9b9cc;
    border-color: #a9b9cc;
  }

  &:focus {
    border: 2px solid #2173df;
    border-color: #2173df;
  }

  &:disabled {
    background: #f1f4f9;
    border: 1px solid #e2e8f0;
  }

  ${({ error }) =>
    error &&
    `
    border: 1px solid #DD6B20;
  `}
`
