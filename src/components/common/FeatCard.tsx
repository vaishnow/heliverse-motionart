import { ReactNode } from "react";

export const FeatTitle = ({ children }: { children: string }) => {
  return <h3>{children}</h3>;
};

export const FeatDesc = ({ children }: { children: string }) => {
  return <p>{children}</p>;
};

export const FeatImg = ({ src, alt }: { src: string; alt: string }) => {
  return <img src={src} alt={alt} />;
};

export const FeatCard = ({ children }: { children: ReactNode }) => {
  return <div className="bg-gradient-to-b from-[#0D061F] to-[#251E35] rounded-2xl border-2 border-[#FFFFFF10] p-7 xl:w-1/4 grow">{children}</div>;
};