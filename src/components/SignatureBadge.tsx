import React from "react";

type Props = {
  text?: string;
  logoSrc?: string;   // e.g. "/NGTFlogo400.png" (put file in /public)
  href?: string;      // optional: if set, whole badge becomes a link
  storageKey?: string; // optional: remember dismissed state
  allowClose?: boolean; // optional: show a small close "x"
};

const SignatureBadge: React.FC<Props> = ({
  text = "Laget av Nore Stene",
  logoSrc = "NorSte.jpg",
  href = "https://github.com/NorSte",                // if omitted -> not clickable
  storageKey = "signatureBadgeDismissed",
  allowClose = false,
}) => {
  const [hidden, setHidden] = React.useState(false);

  // If wanting user to be able to click it away
  /*React.useEffect(() => {
    try {
      if (localStorage.getItem(storageKey) === "1") setHidden(true);
    } catch {}
  }, [storageKey]);*/

  const dismiss = () => {
    setHidden(true);
    try {
      localStorage.setItem(storageKey, "1");
    } catch {}
  };

  if (hidden) return null;

  // shared content (logo + text)
  const Content = (
    <div className="flex items-center gap-2">
      {logoSrc && (
        <img
          src={logoSrc}
          alt=""
          className="h-1 w-1 rounded-full object-cover mr-10"
          style={{ 
            width: "40px", 
            height: "40px",
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
      className="fixed z-50 bottom-4 left-1/2 -translate-x-1/2 print:hidden"
      style={{
        bottom: "calc(1rem + env(safe-area-inset-bottom))",
      }}
    >
      <div className="flex items-center gap-2 rounded-md px-3 py-1.5 opacity-70 hover:opacity-90 transition-opacity pointer-events-none">
        <Wrapper>{Content}</Wrapper>

        {allowClose && (
          <button
            type="button"
            onClick={dismiss}
            aria-label="Skjul signatur"
            className="pointer-events-auto rounded p-1 hover:bg-black/5 dark:hover:bg-white/5"
            title="Skjul"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" role="img" aria-hidden="true">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SignatureBadge;
