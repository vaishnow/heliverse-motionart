import { ReactNode } from "react";

export const FeatTitle = ({ children }: { children: string }) => {
  return <h2>{children}</h2>;
};

export const FeatDesc = ({ children }: { children: string }) => {
  return <p>{children}</p>;
};

export const FeatImg = ({ src, alt }: { src: string; alt: string }) => {
  return <img src={src} alt={alt} />;
};

export const FeatCard = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};