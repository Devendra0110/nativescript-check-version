
import { Utils } from "@nativescript/core";
import {diffLoose} from "./version-check.js"

const getAppVersion = async (bundleId) => {

  const url = `https://play.google.com/store/apps/details?id=${bundleId}`;
  let res;
  try {
    res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.96 Mobile Safari/537.36",
        'sec-fetch-site': 'same-origin'
      }
    });
  } catch (e) {
    throw e;
  }

  if (!res.ok) {

    if (res.status === 404) {
      throw new Error(
        `App not found in Google Play.`
      );
    }
    throw res.statusText
  }

  const text = await res.text();
  const version = text.match(/\[\[\[['"]((\d+\.)+\d+)['"]\]\],/)[1];
  const notes = text.match(/<div itemprop="description">(.*?)<\/div>/)?.[1];
  const updateAt = text.match(/<div class="xg1aie">(.*?)<\/div>/)?.[1];

  let storeUrl = `market://details?id=${bundleId}`

  return {
    version: version || null,
    storeUrl
  };
};


export  const versionCompare = async () => {
  const context = Utils.android.getApplicationContext()
  const bundleID = context.getPackageName();
  var packageManager = context.getPackageManager();
  const currentVersion =  packageManager.getPackageInfo(context.getPackageName(), 0).versionName;
  const {version:latestVersion, storeUrl } = await getAppVersion(bundleID)

  if (!latestVersion) {
    return {
      needsUpdate: false,
      updateType: null,
      notice: "Error: could not get latest version",
      storeUrl
    };
  }

  try {
    const updateType = diffLoose(currentVersion, latestVersion);
    return {
      needsUpdate: !!updateType,
      updateType,
      storeUrl
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
