"use client";

import type { Theme, UserSettings } from "@/lib/types";

type Props = {
  open: boolean;
  onClose: () => void;
  settings: UserSettings;
  onChange: (settings: UserSettings) => void;
};

function textareaToList(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function listToTextarea(list: string[]): string {
  return list.join("\n");
}

const THEMES: { value: Theme; label: string; emoji: string }[] = [
  { value: "cozy", label: "Cozy", emoji: "☕️" },
  { value: "minimal", label: "Minimal", emoji: "◦" },
  { value: "playful", label: "Playful", emoji: "☻" }
];

const STRIP_LENGTHS: { value: UserSettings["stripLength"]; label: string }[] = [
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" }
];

export default function SettingsPanel({
  open,
  onClose,
  settings,
  onChange
}: Props) {
  if (!open) return null;

  const update = (partial: Partial<UserSettings>) => {
    onChange({ ...settings, ...partial });
  };

  return (
    <div className="settings-backdrop no-print" onClick={onClose}>
      <div
        className="settings-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="settings-header">
          <div className="settings-title">Settings</div>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        {/* Modules */}
        <div className="settings-section">
          <div className="settings-section-title">Modules</div>
          {(
            [
              ["news", "News / RSS"],
              ["reddit", "Reddit"],
              ["comics", "Comics"],
              ["quotes", "Quotes"],
              ["puzzle", "Puzzle / Prompt"]
            ] as const
          ).map(([key, label]) => (
            <div className="settings-row" key={key}>
              <div className="settings-row-left">
                <input
                  type="checkbox"
                  checked={settings.modules[key]}
                  onChange={(e) =>
                    update({
                      modules: {
                        ...settings.modules,
                        [key]: e.target.checked
                      }
                    })
                  }
                />
                <span>{label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* RSS feeds */}
        <div className="settings-section">
          <div className="settings-section-title">RSS feeds</div>
          <div style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>
            One URL per line.
          </div>
          <textarea
            className="settings-textarea"
            value={listToTextarea(settings.rssFeeds)}
            onChange={(e) => update({ rssFeeds: textareaToList(e.target.value) })}
          />
        </div>

        {/* Reddit subs */}
        <div className="settings-section">
          <div className="settings-section-title">Reddit subreddits</div>
          <div style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>
            Names only, no /r/ prefix. One per line.
          </div>
          <textarea
            className="settings-textarea"
            value={listToTextarea(settings.subreddits)}
            onChange={(e) =>
              update({ subreddits: textareaToList(e.target.value) })
            }
          />
        </div>

        {/* Comic feeds */}
        <div className="settings-section">
          <div className="settings-section-title">Comic feeds</div>
          <div style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>
            RSS or JSON feeds with images. One URL per line.
          </div>
          <textarea
            className="settings-textarea"
            value={listToTextarea(settings.comicFeeds)}
            onChange={(e) =>
              update({ comicFeeds: textareaToList(e.target.value) })
            }
          />
        </div>

        {/* Strip length */}
        <div className="settings-section">
          <div className="settings-section-title">Strip length</div>
          <div className="radio-row">
            {STRIP_LENGTHS.map((opt) => (
              <label key={opt.value} className="radio-pill">
                <input
                  type="radio"
                  name="stripLength"
                  value={opt.value}
                  checked={settings.stripLength === opt.value}
                  onChange={() => update({ stripLength: opt.value })}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="settings-section">
          <div className="settings-section-title">Theme</div>
          <div className="radio-row">
            {THEMES.map((t) => (
              <label key={t.value} className="radio-pill">
                <input
                  type="radio"
                  name="theme"
                  value={t.value}
                  checked={settings.theme === t.value}
                  onChange={() => update({ theme: t.value })}
                />
                <span>{t.emoji}</span>
                <span>{t.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 10, color: "#777", marginTop: 6 }}>
          Settings are stored on this device only (localStorage). No account,
          no cloud sync, no nonsense.
        </div>
      </div>
    </div>
  );
}