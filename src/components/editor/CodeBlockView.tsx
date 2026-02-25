import { useCallback, useState } from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import type { ReactNodeViewProps } from "@tiptap/react";
import { SUPPORTED_LANGUAGES } from "./lowlight";
import { MermaidRenderer } from "./MermaidRenderer";
import { ChevronDownIcon } from "../icons";

export function CodeBlockView({
  node,
  updateAttributes,
}: ReactNodeViewProps) {
  const language: string = node.attrs.language || "";
  const isMermaid = language === "mermaid";
  const [showSource, setShowSource] = useState(false);
  const codeContent = node.textContent;

  const handleLanguageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateAttributes({ language: e.target.value });
    },
    [updateAttributes],
  );

  const languageSelector = (
    <div className="code-block-language-selector" contentEditable={false}>
      <select
        value={language}
        onChange={handleLanguageChange}
        className="appearance-none bg-transparent text-[var(--color-text-muted)] text-xs cursor-pointer outline-none pr-4 pl-1.5 py-0.5 rounded hover:bg-[var(--color-bg-emphasis)] transition-colors"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="w-3 h-3 absolute right-0.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]" />
    </div>
  );

  if (isMermaid && !showSource) {
    return (
      <NodeViewWrapper className="code-block-wrapper mermaid-wrapper" as="div">
        {languageSelector}
        <div
          contentEditable={false}
          className="mermaid-preview cursor-pointer rounded-lg bg-[var(--color-bg-muted)] p-4 my-1"
          onClick={() => setShowSource(true)}
          title="Click to edit source"
        >
          <MermaidRenderer code={codeContent} />
        </div>
        {/* Hidden but present for TipTap content tracking */}
        <div style={{ position: "absolute", overflow: "hidden", height: 0, opacity: 0 }}>
          <pre>
            {/* @ts-expect-error - "code" is a valid intrinsic element for NodeViewContent */}
            <NodeViewContent as="code" />
          </pre>
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="code-block-wrapper" as="div">
      {languageSelector}
      {isMermaid && (
        <button
          contentEditable={false}
          onClick={() => setShowSource(false)}
          className="code-block-preview-btn"
          type="button"
        >
          Preview
        </button>
      )}
      <pre>
        {/* @ts-expect-error - "code" is a valid intrinsic element for NodeViewContent */}
            <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
}
