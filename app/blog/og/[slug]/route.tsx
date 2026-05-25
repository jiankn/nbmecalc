/**
 * GET /blog/og/[slug] — Programmatic Open Graph image for a blog post.
 *
 * Returns a 1200x630 PNG rendered server-side from the post's metadata.
 * Used as:
 *   1. The post's Open Graph image (social shares: Twitter, LinkedIn, Slack)
 *   2. The blog index card cover thumbnail (downscaled by Next/Image)
 *   3. Schema.org Article image
 *
 * Why programmatic instead of static images:
 *   - Zero design work per post (write once, applies to all current + future)
 *   - Brand consistency guaranteed (mint scale + Plus Jakarta Sans)
 *   - Auto-updates when title or metadata changes
 *   - No copyright concerns (no stock photos)
 *   - Original-image E-E-A-T signal (Google rewards unique imagery)
 *
 * Built on Next.js 15's `next/og` (Edge runtime ImageResponse).
 */
import { ImageResponse } from "next/og";
import { getPost, CATEGORY_LABELS } from "@/lib/blog/posts";

export const runtime = "edge";

// Brand color tokens (mirror tailwind.config.ts mint scale).
const MINT_50 = "#ECFDF5";
const MINT_100 = "#D1FAE5";
const MINT_500 = "#34D399";
const MINT_700 = "#047857";
const GRAY_950 = "#030712";
const GRAY_700 = "#374151";
const GRAY_500 = "#6B7280";

// 1200x630 is the canonical Open Graph + Twitter Card size.
const WIDTH = 1200;
const HEIGHT = 630;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<Response> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    return new Response("Not found", { status: 404 });
  }

  const publishedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
          display: "flex",
          flexDirection: "column",
          background: `linear-gradient(135deg, ${MINT_50} 0%, #ffffff 60%, ${MINT_100} 100%)`,
          padding: 72,
          position: "relative",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Decorative accent grid in the top-right corner */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 360,
            height: 360,
            display: "flex",
            opacity: 0.08,
            backgroundImage: `radial-gradient(${MINT_500} 1.5px, transparent 1.5px)`,
            backgroundSize: "20px 20px",
          }}
        />

        {/* Top row: brand + category badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 48,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 26,
              fontWeight: 800,
              color: GRAY_950,
              letterSpacing: "-0.02em",
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: MINT_500,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 22,
                fontWeight: 800,
              }}
            >
              N
            </div>
            nbmecalc
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 18px",
              borderRadius: 999,
              background: MINT_100,
              border: `1.5px solid ${MINT_500}`,
              color: MINT_700,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: MINT_500,
              }}
            />
            {CATEGORY_LABELS[post.category]}
          </div>
        </div>

        {/* Title — the visual centerpiece */}
        <div
          style={{
            display: "flex",
            fontSize: post.title.length > 60 ? 56 : 68,
            fontWeight: 800,
            color: GRAY_950,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: 28,
            // Word wrap is automatic; max 4 lines visually fits.
          }}
        >
          {post.title}
        </div>

        {/* Description (truncated to fit) */}
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: GRAY_700,
            lineHeight: 1.4,
            marginBottom: "auto",
            maxWidth: 980,
          }}
        >
          {post.description.length > 140
            ? post.description.slice(0, 137) + "…"
            : post.description}
        </div>

        {/* Bottom row: author, date, reading time */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 32,
            borderTop: `2px solid ${MINT_100}`,
            fontSize: 22,
            color: GRAY_500,
            fontWeight: 600,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ color: GRAY_950, fontWeight: 700 }}>
              {post.author}
            </span>
            <span>·</span>
            <span>{publishedDate}</span>
            <span>·</span>
            <span>{post.readingTime} min read</span>
          </div>
          <div
            style={{
              display: "flex",
              color: MINT_700,
              fontWeight: 700,
            }}
          >
            nbmecalc.com/blog
          </div>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      headers: {
        // Aggressive caching — image only changes when post metadata changes,
        // and Next will bust the URL via the post slug + we can add ?v=N if
        // we ever need to bust it manually.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    }
  );
}
