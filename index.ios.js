
import {diffLoose} from "./version-check.js"

const getAppVersion = async (bundleId) => {
  // Adds a random number to the end of the URL to prevent caching
  const url = `https://itunes.apple.com/lookup?bundleId=${bundleId}&country=in&_=${new Date().valueOf()}`;

  let res = await fetch(url);

  const data = await res.json();

  if (!data || !("results" in data)) {
    throw new Error("Unknown error connecting to iTunes.");
  }
  if (!data.results.length) {
    throw new Error("App for this bundle ID not found.");
  }

  res = data.results[0];
  let storeUrl = `itms-apps://apps.apple.com/app/${data.results[0].trackName}/id${data.results[0].trackId}`


  return {
    version: res['version'] || null,
    storeUrl
  };
};


export  const versionCompare = async () => {

  const bundleID = NSBundle.mainBundle.bundleIdentifier;
  const currentVersion =  NSBundle.mainBundle.infoDictionary.objectForKey("CFBundleShortVersionString");
  const {version:latestVersion, storeUrl } = await getAppVersion(bundleID)

  if (!latestVersion) {
    return {
      needsUpdate: false,
      updateType: null,
      notice: "Error: could not get latest version",
      storeUrl,
      currentVersion,

    };
  }

  try {
    const updateType = diffLoose(currentVersion, latestVersion);
    return {
      needsUpdate: !!updateType,
      updateType,
      storeUrl,
      currentVersion,

    };

  } catch (e) {

    let needsUpdate = currentVersion !== latestVersion && (latestVersion > currentVersion);
    if (!latestVersion.includes(".") || latestVersion.split(".").length < 3) {
      // Not a valid semver, so don't ever ask to update
      needsUpdate = false;
    }
    const updateType = needsUpdate ? "minor" : null;
    return {
      needsUpdate,
      updateType,
      currentVersion,
      notice: e.message.replace(/^Invalid Version:/, "Not a valid semver version:"),
      storeUrl
    };
  }
};
