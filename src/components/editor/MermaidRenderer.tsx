import { useEffect, useState, useId } from "react";
import { useTheme } from "../../context/ThemeContext";

interface MermaidRendererProps {
  code: string;
}

let mermaidPromise: Promise<typeof import("mermaid")> | null = null;

function getMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid");
  }
  return mermaidPromise;
}

export function MermaidRenderer({ code }: MermaidRendererProps) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { resolvedTheme } = useTheme();
  const uniqueId = useId().replace(/:/g, "m");

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaidModule = await getMermaid();
        const mermaid = mermaidModule.default;

        mermaid.initialize({
          startOnLoad: false,
          theme: resolvedTheme === "dark" ? "dark" : "default",
          securityLevel: "strict",
        });

        const { svg: rendered } = await mermaid.render(
          `mermaid-${uniqueId}`,
          code.trim(),
        );

        if (!cancelled) {
          setSvg(rendered);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Invalid mermaid syntax",
          );
          setSvg("");
        }
      }
    }

    if (code.trim()) {
      render();
    } else {
      setSvg("");
      setError("");
    }

    return () => {
      cancelled = true;
    };
  }, [code, resolvedTheme, uniqueId]);

  if (error) {
    return (
      <div className="text-xs text-[var(--color-text-muted)] italic px-2 py-1">
        Mermaid syntax error
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="text-xs text-[var(--color-text-muted)] italic px-2 py-1">
        Rendering diagram...
      </div>
    );
  }

  return (
    <div
      className="mermaid-diagram flex justify-center py-2"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
