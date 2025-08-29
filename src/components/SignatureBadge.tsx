import React from "react";

type Props = {
  text?: string;
  logoSrc?: string;   // e.g. "/NGTFlogo400.png" (put file in /public)
  href?: string;      // optional: if set, whole badge becomes a link
  storageKey?: string; // optional: remember dismissed state
};

const SignatureBadge: React.FC<Props> = ({
  text = "Laget av Nore Stene",
  logoSrc = "NGTFlogo400.png",
  href = "https://github.com/NorSte",               
  storageKey = "signatureBadgeDismissed",
}) => {
  const [hidden, setHidden] = React.useState(false);

  // shared content (logo + text)
  const Content = (
    <div className="flex items-center gap-2">
      {logoSrc && (
        <img
          src={logoSrc}
          alt=""
          className="h-1 w-1 rounded-full object-cover mr-10"
          style={{ 
            width: "50px", 
            height: "50px",
            marginRight: "8px" // padding between logo and signature
          }}
          aria-hidden="true"
        />
      )}
      <span className="text-xs md:text-sm text-gray-700/70 dark:text-gray-200/60">
        {text}
      </span>
    </div>
  );

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    href ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
        aria-label={`${text} (åpnes i ny fane)`}
      >
        {children}
      </a>
    ) : (
      <div className="pointer-events-none">{children}</div> // not interactive
    );

  return (
    <div
    className="fixed bottom-4 right-4"
    style={{
      bottom: "calc(1rem + env(safe-area-inset-bottom))",
      right:"calc(1rem + env(safe-area-inset-right))",
    }}
    >
      <div className="flex items-center gap-2 rounded-md px-3 py-1.5 opacity-70 hover:opacity-90 transition-opacity pointer-events-none">
        <Wrapper>{Content}</Wrapper>
      </div>
    </div>
  );
};

export default SignatureBadge;
