# NativeScript Check Version

A NativeScript plugin to check if an updated version of your app is available on the Google Play Store or Apple App Store.

## Installation

To install the plugin, run the following command in your NativeScript project:

```bash
ns plugin add nativescript-check-version
```

## Usage

The plugin provides a single method, `versionCompare`, to check for app updates. It returns a promise with details about the app's update status.

### Example

```typescript
import { versionCompare } from 'nativescript-check-version';

async function checkForUpdates() {
  try {
    const result = await versionCompare();
    console.log('Update Check Result:', result);

    if (result.needsUpdate) {
      console.log(`Update available: ${result.updateType}`);
      console.log(`Current Version: ${result.currentVersion}`);
      console.log(`Notice: ${result.notice}`);
      console.log(`Store URL: ${result.storeUrl}`);
      // Prompt user to update or redirect to storeUrl
    } else {
      console.log('App is up to date.');
    }
  } catch (error) {
    console.error('Error checking for updates:', error);
  }
}

checkForUpdates();
```

### Method: `versionCompare`

```typescript
export function versionCompare(): Promise<{
  needsUpdate: boolean,
  updateType: string | null,
  currentVersion: string,
  notice: string,
  storeUrl: string
}>;
```

#### Return Value

The `versionCompare` method returns a `Promise` that resolves to an object with the following properties:

- `needsUpdate`: `boolean` - Indicates if an update is available.
- `updateType`: `string | null` - Type of update (e.g., "major", "minor", "patch") or `null` if no update is needed.
- `currentVersion`: `string` - The current version of the app installed on the device.
- `notice`: `string` - A message or notice about the update (e.g., release notes or update instructions).
- `storeUrl`: `string` - The URL to the app's page on the Google Play Store or Apple App Store.

### Platform Support

- **Android**: Checks the Google Play Store for updates.
- **iOS**: Checks the Apple App Store for updates.

### Requirements

- NativeScript 8.0 or higher
- Android: API Level 21 (Lollipop) or higher
- iOS: iOS 12.0 or higher

### Configuration

No additional configuration is required. The plugin automatically detects the app's package ID and platform to query the appropriate app store.

### Error Handling

The `versionCompare` method may throw errors in the following cases:
- Network connectivity issues.
- Invalid app store response.
- App not found on the store.

Ensure you handle errors appropriately in your application code.

### Example Error Handling

```typescript
import { versionCompare } from 'nativescript-check-version';

async function checkForUpdates() {
  try {
    const result = await versionCompare();
    if (result.needsUpdate) {
      alert(`A new ${result.updateType} update is available! Visit ${result.storeUrl} to update.`);
    }
  } catch (error) {
    console.error('Failed to check for updates:', error);
    alert('Unable to check for updates. Please try again later.');
  }
}

checkForUpdates();
```

## Contributing

Contributions are welcome! Please submit a pull request or open an issue on the [GitHub repository](https://github.com/your-repo/nativescript-check-version).

## License

This plugin is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
