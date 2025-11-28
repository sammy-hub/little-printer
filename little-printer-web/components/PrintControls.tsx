"use client";

type Props = {
  onGenerateAndPrint: () => Promise<void> | void;
  isLoading: boolean;
};

export default function PrintControls({ onGenerateAndPrint, isLoading }: Props) {
  return (
    <div className="controls no-print">
      <div className="controls-inner">
        <button
          type="button"
          className="print-button"
          onClick={() => void onGenerateAndPrint()}
          disabled={isLoading}
        >
          {isLoading ? "Preparing strip..." : "Generate & Print"}
        </button>
        <div className="helper-text">
          Tip: adjust margins & printer in the iOS print sheet for best
          alignment on your thermal printer.
        </div>
      </div>
    </div>
  );
}