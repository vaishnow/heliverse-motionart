import { ReactNode } from "react";

export const CardTitle = ({ children }: { children: string }) => {
  return <h3>{children}</h3>;
};

export const CardDesc = ({ children }: { children: string }) => {
  return <p className="my-5">{children}</p>;
};

export const CardImg = ({ src, alt }: { src: string; alt: string }) => {
  return <img src={src} alt={alt} className="w-full"/>;
};

export const Card = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <div className={`bg-gradient-to-b from-[#0D061F] to-[#251E35] rounded-[20px] p-8 flex justify-center border-2 border-[#FFFFFF10] ${className}`}><div>{children}</div></div>;
};
