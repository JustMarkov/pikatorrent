# PikaTorrent ⚡

A modern, simple, connected, and electric BitTorrent app ⚡

<a href="https://discord.gg/6HxCV4aGdy">
  <img src="https://img.shields.io/badge/Join_us_on_discord-gray?logo=discord" />
</a>

## ⚠️ Project status

PikaTorrent is currently being rewritten with [Flutter](https://flutter.dev/). The codebase will greatly change and old implementation will be retired.

Flutter targets mobile & desktop. It allows me to focus on developing the app instead of continuously fight with the stack for each target (React Native/Electron/Node.js/Tamagui, and WebRTC implementations).

Remote control and CLI will no longer be available from next releases. Anyway, the UX was not great, it was not always working correctly, and it's a niche feature. It might come back later though, maybe.

PikaTorrent will now focus on providing a greater and consistent torrent experience on Mobile & Desktop, even for Apple devices 🤞.

## Installation

### Desktop & mobile

The recommended way to install PikaTorrent is from the app stores. You will receive automatic updates & the app will be associated with `magnet:` and `pikatorrent:` links, and `.torrent` files on desktop.

<table>
  <tr>
    <th>Windows</th>
    <th>Linux</th>
    <th>Android</th>
  </tr>
  <tr>
    <td>
    <a href="https://apps.microsoft.com/store/detail/9N9GJQ9BDJW3?launch=true&mode=mini">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="https://get.microsoft.com/images/en-US%20light.svg" />
        <img
          height="48px"
          alt="Download on Windows Store"
          src="https://get.microsoft.com/images/en-US%20dark.svg"
        />
      </picture>
    </a>
    </td>
    <td>
    <a href="https://flathub.org/apps/com.pikatorrent.PikaTorrent">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="https://dl.flathub.org/assets/badges/flathub-badge-i-en.png" />
        <img
          height="48px"
          alt="Download on Flathub"
          src='https://dl.flathub.org/assets/badges/flathub-badge-en.png'
        />
      </picture>
    </a>
    </td>
    <td>
    <a href="https://play.google.com/store/apps/details?id=com.gray.pikatorrent&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1">
  <img
    height="72px"
    alt="Get it on Google Play"
    src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
  />
  </a>
  </td>
  </tr>
</table>

### CLI

A cli is available on npm.

```sh
npm i -g pikatorrent
pikatorrent node # Start a headless pikatorrent node
```

Scan the qrcode from the mobile app, or click on your secret link to control your node from [app.pikatorrent.com](https://app.pikatorrent.com).
You will be prompted to accept the connection.

## Usage

Start PikaTorrent, open magnet links, share direct links, add your favorite torrents search engine, link the mobile app with your desktop app...

Join the discord for support, & report any bugs or features on Github :heart:

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://www.pikatorrent.com/desktop-dark.webp" />
  <img alt="desktop app screenshot" src="https://www.pikatorrent.com/desktop-light.webp" height="auto" width="720px" />
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://www.pikatorrent.com/mobile-dark.webp" />
  <img alt="mobile app screenshot" src="https://www.pikatorrent.com/mobile-light.webp" height="auto" width="200px" />
</picture>

## Development

You will need the flutter SDK to be installed on your platform.
Follow the guide at https://docs.flutter.dev/get-started/install.
You will

You might need to install `cmake`, `openssl`, `curl` and other depencies in order
to compile the project.

For MacOS:
```sh
brew install pkgconf cmake ninja
```

```sh
git clone --recurse-submodules git@github.com:G-Ray/pikatorrent.git pikatorrent
cd pikatorrent/app
./vcpkg/bootstrap-vcpkg.sh # .bat for Windows
export VCPKG_ROOT=/absolut/path/to/./app/vcpkg
flutter run # optionally specify --dart-define-from-file=.env
```

## Localization

We use [weblate](https://hosted.weblate.org/engage/pikatorrent/) to localize the app.

<a href="https://hosted.weblate.org/engage/pikatorrent/">
<img src="https://hosted.weblate.org/widget/pikatorrent/translations/multi-auto.svg" alt="Translation status" />
</a>

## License

GPL-3.0
