<p align="center">
  <img src="https://img.shields.io/github/license/mohd-ijlan/audio-compressor-cli?style=for-the-badge" />
  <img src="https://img.shields.io/github/stars/mohd-ijlan/audio-compressor-cli?style=for-the-badge&color=yellow" />
  <img src="https://img.shields.io/github/forks/mohd-ijlan/audio-compressor-cli?style=for-the-badge&color=blue" />
  <img src="https://img.shields.io/github/issues/mohd-ijlan/audio-compressor-cli?style=for-the-badge&color=orange" />
</p>

<br/>

<h1 align="center">Audio Compressor CLI</h1>
<p align="center">Compress audio files or folders using FFmpeg (static binary) via a simple Node.js CLI.</p>

---

## Features

- Works on **Windows, Mac, Linux**
- No need to install FFmpeg (uses `ffmpeg-static`)
- Compresses multiple formats:
  - MP3
  - WAV
  - FLAC
  - AAC
  - M4A
- Supports both **single file** and **entire folder compression**
- Lets user choose compression quality (High / Medium / Low)
- **Progress bar** during compression
- Saves output in a `/compressed` folder

---

## Install (from npm)

```sh
npm install -g audio-compressor-cli
```

## Usage

### Compress a single file.
```sh
compress-audio "./music/song.mp3"
```
### Compress a folder.
```sh
compress-audio "./music-folder"
```
### Output example
```sh
Choose compression quality:
> High
  Medium
  Low

Compressing: song.mp3
[##########..........] 45% | ETA: 00:03
DONE -> compressed/song-compressed.mp3
```

## Run locally (from Github)
```sh
git clone https://github.com/mohd-ijlan/audio-compressor-cli.git
cd audio-compressor-cli
npm install
npm link
```
### Run
```sh
compress-audio "path/to/audio.mp3"
```

## Project Structure
```sh
audio-compressor-cli/
│
├── index.js          # Main CLI entry
├── package.json
├── README.md
└── /compressed       # Generated output (ignored by git)
```

## License
MIT License © 2025 Mohammed Ijlan

