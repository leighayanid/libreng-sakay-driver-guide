# Screenshots — 3 shots still needed

The driver shots are no longer taken by hand. The cockpit is a web app, so
`tools/capture-driver-shots.mjs` drives it and writes the PNGs straight out of the
running app — see **Re-shooting the driver screens** below. The three kiosk
shots left are Compose screens that cannot be reached on a demo bus, and need a
phone on USB once.

Until a file exists, the slide shows a dashed placeholder with the filename on
it — nothing to edit afterwards, just drop the file in.

## Rules

- PNG, **1080 × 2340** — the frame is built to that ratio.
- Demo data: **BS-001 · BTA 1001**, route **MU-ABU-IN · Abucay – Capitol**,
  driver **Juan Dela Cruz**.
- No real names, plate numbers, or phone numbers.

---

## Kiosk — `public/shots/kiosk/` — the three that are left

`app/src/androidTest/.../kiosk/KioskScreenshotTest.kt` in the Android project
renders these three. It compiles; it has not been run, because running it needs
a device attached. With one plugged in:

```bash
cd ~/AndroidStudioProjects/LibrengSakay
JAVA_HOME="C:/Program Files/Android/Android Studio/jbr" ./gradlew connectedDebugAndroidTest
adb pull /sdcard/Android/data/com.example.librengsakay/files/screenshots .
```

Then rename into place — the test names them by state, the deck by slide order:

| test output | deck file |
|---|---|
| `kiosk_already_boarded.png` | `kiosk/10-already-boarded.png` |
| `kiosk_tapped_out.png` | `kiosk/11-tapped-out.png` |
| `kiosk_connected.png` | `kiosk/13-connected.png` |

These three are still phone-resolution shots; they get drawn inside the POS
terminal like the rest of the kiosk screens (see the README).

- [ ] `10-already-boarded.png` — the re-tap inside the grace window
- [ ] `11-tapped-out.png` — **Salamat**, showing how long the rider was aboard
- [ ] `13-connected.png` — the **Connected** banner as held taps sync

The emulator is not an option for these: two of the three are driven by an NFC
tap, which an emulator cannot produce. The test renders the composable directly
and sidesteps that.

---

## Re-shooting the driver screens

```bash
# in the librengsakay repo
php artisan migrate:fresh --force --seed --seeder=E2eSeeder --env=e2e
php artisan tinker --env=e2e --execute="require '<this repo>/tools/seed-deck.php';"
php artisan serve --env=e2e --port=8010
php artisan reverb:start --env=e2e          # else a reconnect banner sits on every shot

# in this repo
node tools/capture-driver-shots.mjs .shots-out
```

`tools/seed-deck.php` puts the e2e database into the deck's demo data — BS-001 on
MU-ABU-IN with a live kiosk and a dispatch thread. `tools/capture-driver-shots.mjs` logs in as the
seeded driver, drives the cockpit, and writes `13`, `14`, `15`, `16` and `18`.
Copy the ones you want into `public/shots/driver/`.

Two things the script handles that are easy to get wrong by hand:

- **Geolocation must be granted.** Without a position the cockpit sits on
  "Requesting…" and quietly queues every tap into the offline sync, so the undo
  toast never appears.
- **Undo refuses the opening stop** ("the starting stop cannot be undone"), so
  the shot has to depart *and* arrive before there is anything to take back.

---

## Known gap: the driver shots predate the current UI

`01`–`12` were taken on a real device in October. The cockpit has been
redesigned since — the trip card, the controls and the stop list all moved — so
the newly captured `13`–`18` do not match them. The deck currently mixes two
builds of the same app.

Fixing it means re-shooting `01`–`12` with `tools/capture-driver-shots.mjs` and re-reading every
mark coordinate on those slides, since the marks are percentages of a layout
that has moved. That is a bigger job than a screenshot refresh and has not been
done.

The one place the mismatch would have been side-by-side on a single slide — the
undo slide, which paired the new toast with the old on-the-road shot — was
fixed by capturing `18-undo-done.png`.
