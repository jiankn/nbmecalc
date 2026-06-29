import { ImageResponse } from "next/og";
import { getStepLabel } from "@/lib/prediction-share";
import { getPublicPredictionShare } from "@/lib/public-prediction-share";

export const runtime = "edge";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
): Promise<Response> {
  const { token } = await params;
  const share = await getPublicPredictionShare(token);
  if (!share) return new Response("Not found", { status: 404 });

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          padding: 72,
          background:
            "linear-gradient(135deg, #ECFDF5 0%, #ffffff 58%, #D1FAE5 100%)",
          color: "#030712",
          fontFamily: "Inter, system-ui, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -80,
            top: -100,
            width: 460,
            height: 460,
            display: "flex",
            borderRadius: 999,
            background: "#34D399",
            opacity: 0.12,
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 12,
                background: "#34D399",
                color: "#030712",
              }}
            >
              N
            </div>
            NBMEcalc
          </div>
          <div
            style={{
              display: "flex",
              borderRadius: 999,
              padding: "10px 18px",
              background: "#ffffff",
              border: "2px solid #A7F3D0",
              color: "#047857",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            {getStepLabel(share.step)} prediction
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 72,
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#047857",
              fontSize: 24,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Predicted range · 95% CI
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 8,
              fontSize: 112,
              lineHeight: 1,
              fontWeight: 900,
              letterSpacing: "-0.05em",
            }}
          >
            {share.ciLower}–{share.ciUpper}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 14,
              marginTop: 28,
              fontSize: 28,
              color: "#4B5563",
            }}
          >
            Most likely
            <strong style={{ color: "#030712", fontSize: 42 }}>
              {share.pointEstimate}
            </strong>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: 26,
            borderTop: "2px solid #D1FAE5",
            color: "#6B7280",
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          <span>Statistical estimate, not a guarantee.</span>
          <span style={{ color: "#047857" }}>nbmecalc.com</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=86400",
      },
    }
  );
}
