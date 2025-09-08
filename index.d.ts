    /**
     * Returns the version of your app.
     * - For iOS we read it from *.plist's CFBundleShortVersionString.
     * - For Android we read the versionName from AndroidManifest.xml.
     */
    export function versionCompare(): Promise<{
        needsUpdate:boolean,
        updateType:string|null,
        currentVersion:string,
        notice:string;
        storeUrl:string
    }>;
