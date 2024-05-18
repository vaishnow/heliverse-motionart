import { ReactNode } from "react";

export const CardTitle = ({ children }: { children: string }) => {
  return <h2>{children}</h2>;
};

export const CardDesc = ({ children }: { children: string }) => {
  return <p>{children}</p>;
};

export const CardImg = ({ src, alt }: { src: string; alt: string }) => {
  return <img src={src} alt={alt} />;
};

export const Card = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};