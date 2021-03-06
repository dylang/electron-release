# Electron-release [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
> Publish a new release of your app to Github. Could be used togheter with: [electron-gh-releases](https://github.com/jenslind/electron-gh-releases).

## Install

```
npm install -g electron-release
```

## What it does

1. Zip compress your `.app`
2. Publish a new release on Github with the zip as an asset.
3. Updates `auto_updater.json` with the new url (if exists).

## Usage

```
Usage
  $ electron-release
Options
  --app  [Required] The path to the .app to compress and upload.
  --token  [Required] Github token to be able to publish the relase.
  --tag  The git tag connected to the release, needs to be semver. Defaults to version in package.json
  --repo  The github repo in the following format: "username/reponame". Defaults to repository.url in package.json
  --name  The name of the relase. Defaults to --tag
  --output  The .zip output folder. Defaults to same folder as .app
```

## Tests

```
npm test
```

## License
MIT
