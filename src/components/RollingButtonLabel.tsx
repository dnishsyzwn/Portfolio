import { ArrowUpRight } from "lucide-react";

function RollingGlyph({ character, index, active }: { character: string | null; index: number; active?: boolean }) {
  const content = character === null ? <ArrowUpRight className="h-4 w-4" /> : character;
  return (
    <span className="relative inline-block overflow-hidden align-bottom leading-[1.4] [perspective:200px]">
      <span
        style={{ transitionDelay: `${index * 25}ms`, transform: active === undefined ? undefined : active ? "translateY(-100%) rotateX(45deg)" : "translateY(0) rotateX(0deg)" }}
        className="flex h-[1.4em] items-center origin-top transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/roll:[transform:translateY(-100%)_rotateX(45deg)] group-focus-visible/roll:[transform:translateY(-100%)_rotateX(45deg)] motion-reduce:transition-none motion-reduce:!delay-0"
      >{content}</span>
      <span
        style={{ transitionDelay: `${index * 25}ms`, transform: active === undefined ? undefined : active ? "translateY(0) rotateX(0deg)" : "translateY(100%) rotateX(-45deg)" }}
        className="absolute inset-0 flex h-[1.4em] items-center origin-bottom [transform:translateY(100%)_rotateX(-45deg)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/roll:[transform:translateY(0)_rotateX(0deg)] group-focus-visible/roll:[transform:translateY(0)_rotateX(0deg)] motion-reduce:transition-none motion-reduce:!delay-0"
      >{content}</span>
    </span>
  );
}

export default function RollingButtonLabel({ text, active }: { text: string; active?: boolean }) {
  let offset = 0;
  return (
    <span className="inline-block text-center">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((word, wordIndex) => {
          const start = offset;
          offset += word.length + 1;
          return (
            <span key={wordIndex}>
              {wordIndex > 0 ? " " : null}
              <span className="inline-block whitespace-nowrap">
                {Array.from(word).map((character, index) => <RollingGlyph key={index} character={character} index={start + index} active={active} />)}
              </span>
            </span>
          );
        })}
        <span className="ml-2 inline-block"><RollingGlyph character={null} index={text.length} active={active} /></span>
      </span>
    </span>
  );
}
