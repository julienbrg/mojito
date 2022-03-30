import styled from "styled-components";

export const Body = styled.div`
  align-items: center;
  color: white;
  display: flex;
  flex-direction: column;
  font-size: calc(10px + 2vmin);
  justify-content: center;
  margin-top: 40px;
`;

export const Button = styled.button`
  background-color: white;
  border: none;
  border-radius: 8px;
  color: #282c34;
  cursor: pointer;
  font-size: 16px;
  margin: 0px 20px;
  padding: 12px 24px;
  text-align: center;
  text-decoration: none;
`;

export const Container = styled.div`
  background-color: #000000;
  display: flex;
  flex-direction: column;
  height: calc(1000vh);
`;

export const Header = styled.header`
  align-items: center;
  background-color: #000000;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  min-height: 70px;
`;

export const Image = styled.img`
  height: 40vmin;
  margin-bottom: 10px;
  pointer-events: none;
`;

export const Loader = styled.img`
  pointer-events: none;
`;

export const Link = styled.a.attrs({
  target: "_blank",
  rel: "noopener noreferrer",
})`
  color: #800080;
  margin-top: 8px;
  font-size: calc(2px + 2vmin);
`;
