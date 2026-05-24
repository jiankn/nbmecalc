import { getOptionalRequestContext } from "@cloudflare/next-on-pages";

export function readRuntimeEnv(name: string): string | undefined {
  const fromProcess = process.env[name];
  if (fromProcess && fromProcess.length > 0) return fromProcess;

  const env = getOptionalRequestContext()?.env as
    | Record<string, unknown>
    | undefined;
  const value = env?.[name];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export function getSiteUrlFromRuntime(req?: Request): string {
  return (
    readRuntimeEnv("NEXT_PUBLIC_SITE_URL") ??
    (req ? new URL(req.url).origin : "https://nbmecalc.com")
  );
}
