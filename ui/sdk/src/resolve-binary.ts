import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const PLATFORMS: Record<string, string> = {
  "darwin-arm64": "@aaif/mesmile-binary-darwin-arm64",
  "darwin-x64": "@aaif/mesmile-binary-darwin-x64",
  "linux-arm64": "@aaif/mesmile-binary-linux-arm64",
  "linux-x64": "@aaif/mesmile-binary-linux-x64",
  "win32-x64": "@aaif/mesmile-binary-win32-x64",
};

/**
 * Resolves the path to the mesmile binary.
 *
 * Resolution order:
 *   1. `MESMILE_BINARY` environment variable (explicit override)
 *   2. Platform-specific `@aaif/mesmile-binary-*` optional dependency
 *
 * @throws if no binary can be found
 */
export function resolveGooseBinary(): string {
  const envBinary = process.env.MESMILE_BINARY;
  if (envBinary) return envBinary;

  const key = `${process.platform}-${process.arch}`;
  const pkg = PLATFORMS[key];
  if (!pkg) {
    throw new Error(
      `No mesmile binary available for ${key}. Set MESMILE_BINARY to the path of a mesmile binary.`,
    );
  }

  try {
    const require = createRequire(import.meta.url);
    const pkgDir = dirname(require.resolve(`${pkg}/package.json`));
    const binName = process.platform === "win32" ? "mesmile.exe" : "goose";
    return join(pkgDir, "bin", binName);
  } catch {
    throw new Error(
      `mesmile binary package ${pkg} is not installed. Set MESMILE_BINARY or install the native package.`,
    );
  }
}
