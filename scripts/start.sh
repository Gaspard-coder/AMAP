#!/usr/bin/env sh
set -eu

export NODE_ENV="${NODE_ENV:-production}"
export PORT="${PORT:-3000}"

npm ci --omit=dev
npm start
