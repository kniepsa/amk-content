#!/usr/bin/env bash
# play-tts.sh - TTS wrapper (uses macOS say by default)
say "${1:-Done}" 2>/dev/null || true
