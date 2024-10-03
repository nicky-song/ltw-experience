#!/bin/bash -eu
#
# Simple script to detect the tenant to deploy to.

die() { echo "$0:" "$@" 1>&2 ; exit 1 ; }
is_github_actions() { [ "${CI:-}" = "true" ] && [ "${GITHUB_ACTIONS}" = "true" ] ; }
assert_github_actions() { is_github_actions || die "this script must be sourced from inside a github workflow." ; }

# Detect the target tenant from github environment variables.
if [ -z "${DUPLO_TENANT_NAME:-}" ]; then
  case "${GITHUB_REF_TYPE:-}" in
    branch)
      # Detect the tenant from the branch.
      case "${GITHUB_REF_NAME:-}" in
        main|feat/add-duplo-build-workflow)
          DUPLO_TENANT_NAME=dev01
          ;;
        release/*)
          DUPLO_TENANT_NAME=stg01
          ;;
        preview)
          DUPLO_TENANT_NAME=preview
          ;;
        *)
          die "DUPLO_TENANT_NAME: no tenant matching GITHUB_REF_NAME: $GITHUB_REF_NAME"
      esac
      ;;
    
    *)
      assert_github_actions
      die "GITHUB_REF_TYPE: must be branch"
  esac
fi

echo "::set-output name=DUPLO_TENANT_NAME::$DUPLO_TENANT_NAME"

case $DUPLO_TENANT_NAME in
  "dev01")
    echo "::set-output name=YARN_ENV_FILE::.env.development"
    ;;
  "stg01")
    echo "::set-output name=YARN_ENV_FILE::.env.staging"
    ;;
  "prod01")
    echo "::set-output name=YARN_ENV_FILE::.env.production"
    ;;
  "preview")
    echo "::set-output name=YARN_ENV_FILE::.env.preview"
    ;;
esac
