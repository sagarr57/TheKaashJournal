import { AlertTriangle } from "lucide-react";

type DisclaimerType = "finance" | "health";

interface YmylDisclaimerProps {
  type: DisclaimerType;
}

export function YmylDisclaimer({ type }: YmylDisclaimerProps) {
  const isHealth = type === "health";

  return (
    <div className="flex gap-3 border border-amber-200 bg-amber-50 rounded-lg p-4 mb-5 text-sm text-amber-900">
      <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" aria-hidden />
      <div className="space-y-2">
        <p>
          <strong>Important:</strong>{" "}
          {isHealth
            ? "This article is for general educational purposes only and does not constitute medical advice, diagnosis, or treatment. Always consult a registered healthcare professional before making decisions about your health, medication, or wellbeing."
            : "This article is for general educational purposes only and does not constitute financial, investment, tax, or legal advice. Always consult a qualified, FCA-authorised adviser before making financial decisions."}
        </p>
        <p className="text-amber-800">
          {isHealth ? (
            <>
              UK readers: see{" "}
              <a
                href="https://www.nhs.uk/"
                className="text-blue-800 hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                NHS.uk
              </a>{" "}
              for official health information, or call{" "}
              <strong>NHS 111</strong> for urgent advice.
            </>
          ) : (
            <>
              UK readers: free impartial help at{" "}
              <a
                href="https://www.moneyhelper.org.uk/"
                className="text-blue-800 hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                MoneyHelper
              </a>
              ,{" "}
              <a
                href="https://www.stepchange.org/"
                className="text-blue-800 hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                StepChange
              </a>{" "}
              (0800 138 1111), or{" "}
              <a
                href="https://www.gov.uk/debt-advice"
                className="text-blue-800 hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                GOV.UK debt advice
              </a>
              .
            </>
          )}{" "}
          Full disclaimers:{" "}
          <a href="/disclaimer" className="text-blue-800 hover:underline font-medium">
            Advertising &amp; liability
          </a>
          .
        </p>
      </div>
    </div>
  );
}
