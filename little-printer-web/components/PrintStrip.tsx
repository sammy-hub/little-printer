import { PRINTER_WIDTH_PX } from "@/lib/constants";
import type { PrintBlock, Theme } from "@/lib/types";

type Props = {
  blocks: PrintBlock[];
  theme: Theme;
};

function getDivider(theme: Theme): string {
  switch (theme) {
    case "minimal":
      return "──────────────";
    case "playful":
      return "· · · · · · · · ·";
    case "cozy":
    default:
      return "⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯";
  }
}

function getHeaderIcon(theme: Theme): string {
  switch (theme) {
    case "minimal":
      return "◦";
    case "playful":
      return "☻";
    case "cozy":
    default:
      return "☕️";
  }
}

function getFooterText(theme: Theme): string {
  switch (theme) {
    case "minimal":
      return "printed on purpose ✶";
    case "playful":
      return "made by a tiny imaginary printer friend";
    case "cozy":
    default:
      return "printed with love (and a bit of thermal magic)";
  }
}

export default function PrintStrip({ blocks, theme }: Props) {
  const now = new Date();
  const dateStr = now.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const greeting = "Here’s your little daily strip.";

  const divider = getDivider(theme);
  const icon = getHeaderIcon(theme);
  const footerText = getFooterText(theme);

  return (
    <div
      id="print-root"
      style={{
        maxWidth: PRINTER_WIDTH_PX,
        width: "100%"
      }}
    >
      <div className="strip-header">
        <div className="strip-header-title">
          {icon} little strip
        </div>
        <div className="strip-header-date">{dateStr}</div>
        <div className="strip-header-greeting">{greeting}</div>
      </div>

      {blocks.map((block, idx) => {
        switch (block.type) {
          case "news":
            return (
              <section key={`news-${idx}`}>
                <div className="section-title">~ headlines ~</div>
                <div className="divider">{divider}</div>
                {block.items.map((item, i) => (
                  <div className="news-item" key={i}>
                    <div className="news-item-title">• {item.title}</div>
                    <div className="news-item-meta">[{item.source}]</div>
                  </div>
                ))}
              </section>
            );
          case "reddit":
            return (
              <section key={`reddit-${idx}`}>
                <div className="section-title">reddit corner</div>
                <div className="divider">{divider}</div>
                {block.items.map((item, i) => (
                  <div className="reddit-item" key={i}>
                    <div className="reddit-item-title">• {item.title}</div>
                    <div className="reddit-item-meta">
                      [/r/{item.subreddit}]
                    </div>
                  </div>
                ))}
              </section>
            );
          case "comic":
            return (
              <section key={`comic-${idx}`}>
                <div className="section-title">comic relief</div>
                <div className="divider">{divider}</div>
                {block.items.map((item, i) => (
                  <div className="comic" key={i}>
                    {item.title && (
                      <div
                        style={{
                          fontSize: 10,
                          marginBottom: 2,
                          textAlign: "center"
                        }}
                      >
                        {item.title}
                      </div>
                    )}
                    <img src={item.imageUrl} alt={item.title ?? "Comic"} />
                  </div>
                ))}
              </section>
            );
          case "quote":
            return (
              <section key={`quote-${idx}`}>
                <div className="section-title">today’s quote</div>
                <div className="divider">{divider}</div>
                <div className="quote-text">“{block.text}”</div>
                {block.author && (
                  <div className="quote-author">— {block.author}</div>
                )}
              </section>
            );
          case "puzzle":
            return (
              <section key={`puzzle-${idx}`}>
                <div className="section-title">little puzzle</div>
                <div className="divider">{divider}</div>
                <div className="puzzle-title">{block.title}</div>
                <div className="puzzle-content">{block.content}</div>
              </section>
            );
          case "header":
          case "footer":
          default:
            // We render our own header/footer outside blocks.
            return null;
        }
      })}

      <div className="strip-footer">{footerText}</div>
    </div>
  );
}