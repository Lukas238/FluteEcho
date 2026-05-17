# FluteEcho

A microphone passthrough app with echo/delay and auto feedback suppression, designed for transverse flute practice.

## Features

- **Mic passthrough** with adjustable delay and echo (room/cathedral presets)
- **Spectrum analyzer** showing the flute frequency range (262–2093 Hz)
- **Auto feedback suppression** — detects and notches feedback frequencies up to 18 kHz
- **Dual-threshold detection** — faster response for high-frequency feedback (>2 kHz)
- **Frequency log** with ⚡ acople markers
- No internet required, no tracking, no ads

## Building

### Requirements

- Node.js 18+
- Android SDK (API 26+)
- Java 17+

### Steps

```bash
npm install
npx cap sync android
cd android && ./gradlew assembleRelease
```

The APK will be at `android/app/build/outputs/apk/release/app-release-unsigned.apk`.

## Technical Notes

- Web app built with vanilla JS + Web Audio API
- AudioWorklet (`delay-worklet.js`) handles the delay/echo DSP in a dedicated audio thread
- Falls back to a native Web Audio graph if AudioWorklet is not supported
- Capacitor bridges the web app to Android, providing mic access via the `getUserMedia` API

## License

GPL-3.0 — see [LICENSE](LICENSE)
