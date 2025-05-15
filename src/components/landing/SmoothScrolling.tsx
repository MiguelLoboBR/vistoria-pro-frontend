import { useEffect } from "react";

export const useSmoothScrolling = () => {
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      // Somente clique com botão esquerdo
      if (e.button !== 0) return;

      const target = e.target as HTMLElement;
      const anchor = target.closest("a[href^='#']");

      if (anchor instanceof HTMLAnchorElement) {
        const href = anchor.getAttribute("href");
        if (!href || href === "#") return;

        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 100,
            behavior: "smooth",
          });

          // Atualiza o hash na URL sem recarregar
          history.replaceState(null, "", href);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);
};

export default useSmoothScrolling;
