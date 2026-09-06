#!/usr/bin/env bash
# Idempotent repository bootstrap for Cloud Agent environments.
# Safe to run repeatedly: it converges the app to a runnable state without
# rewriting lockfiles or discarding existing data.
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Installing PHP dependencies"
composer install --no-interaction --prefer-dist --no-progress

echo "==> Installing JS dependencies"
npm ci

echo "==> Ensuring .env exists"
if [ ! -f .env ]; then
    cp .env.example .env
    php artisan key:generate --ansi
fi

echo "==> Ensuring SQLite database exists"
touch database/database.sqlite

echo "==> Running migrations"
php artisan migrate --force --ansi

echo "==> Seeding demo data (only when the database is empty)"
USER_COUNT="$(php artisan tinker --execute='echo \App\Models\User::count();' 2>/dev/null | tail -n 1 | tr -dc '0-9')"
if [ "${USER_COUNT:-0}" = "0" ]; then
    php artisan db:seed --force --ansi
else
    echo "    Users already present (${USER_COUNT}); skipping seed."
fi

echo "==> Building frontend assets"
npm run build

echo "==> Install complete"
