import { JsonSection } from "@/features/request/components/JsonSection";

interface Props {
  webhookUrl: string;
}

function CodeExamples({ webhookUrl }: Props) {
  return (
    <div className="space-y-4">
      <JsonSection
        title="cURL"
        data={`curl -X POST "${webhookUrl}" \\
-H "Content-Type: application/json" \\
-d '{"event":"payment.success"}'`}
      />

      <JsonSection
        title="Fetch"
        data={`fetch("${webhookUrl}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    event: "payment.success",
  }),
});`}
      />

      <JsonSection
        title="Axios"
        data={`axios.post("${webhookUrl}", {
  event: "payment.success",
});`}
      />
    </div>
  );
}

export default CodeExamples;
