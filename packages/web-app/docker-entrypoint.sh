#!/bin/sh

set -e

# Ensure packages are installed
yarn

# Now run the command specified
exec "$@"