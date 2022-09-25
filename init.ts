import { ensureDir } from "./deps.ts";
import { basename, dirname, join } from "./deps.ts";
import { writableStreamFromWriter } from "./deps.ts";
import { BuildConfig } from "./config.ts";

const MOD_URL = new URL("https://deno.land/x/ter");
const requiredViews = ["base.eta", "feed.xml.eta"];
const requiredAssets = ["ter.css"];

async function initializeFile(filePath: string, url: URL) {
  const fileResponse = await fetch(url.toString()).catch((err) => {
    console.error(`Can't fetch file: ${url}, Error: ${err}`);
    Deno.exit(1);
  });
  if (fileResponse.ok && fileResponse.body) {
    await ensureDir(dirname(filePath));
    const file = await Deno.open(filePath, {
      write: true,
      create: true,
    });
    const writableStream = writableStreamFromWriter(file);
    await fileResponse.body.pipeTo(writableStream);
  } else {
    console.error(`Fetch response error`);
    Deno.exit(1);
  }
}

export async function init(config: BuildConfig) {
  console.log("%cInitializing site config:", "font-weight: bold");
  try {
    await Deno.stat(join(Deno.cwd(), config.userConfigPath));
    console.log(`  File exists, skipping:\t${config.userConfigPath}`);
  } catch {
    await ensureDir(dirname(config.userConfigPath));
    await Deno.writeTextFile(
      config.userConfigPath,
      JSON.stringify(config.userConfig),
    );
    console.log(`  ${config.userConfigPath}`);
  }

  console.log("%cInitializing views and assets:", "font-weight: bold");
  for await (const view of requiredViews) {
    const viewPath = join(config.viewsPath, view);
    try {
      await Deno.stat(viewPath);
      console.log(`  File exists, skipping:\t${viewPath}`);
    } catch {
      const url = new URL(
        join(MOD_URL.href, basename(config.viewsPath), view),
      );
      await initializeFile(join(config.viewsPath, view), url);
      console.log(`  Initialized:\t${viewPath}`);
    }
  }
  for await (const asset of requiredAssets) {
    const assetPath = join(config.assetsPath, asset);
    try {
      await Deno.stat(assetPath);
      console.log("  File exists, skipping:\t", assetPath);
    } catch {
      const url = new URL(
        join(MOD_URL.href, basename(config.assetsPath), asset),
      );
      await initializeFile(join(config.assetsPath, asset), url);
      console.log(`  Initialized:\t${assetPath}`);
    }
  }
}
