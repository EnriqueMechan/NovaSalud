#!/usr/bin/env bash
################################################################################
# Nova Salud - Detener servidores (Linux / macOS)
################################################################################
set -u
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
C_RESET='\033[0m'; C_GREEN='\033[32m'; C_RED='\033[31m'; C_CYAN='\033[36m'
log()  { printf '%b\n' "${C_CYAN}[Nova Salud]${C_RESET} $*"; }
ok()   { printf '%b\n' "${C_GREEN}✔${C_RESET} $*"; }

pids_file="$ROOT_DIR/.novasalud.pids"
if [ -f "$pids_file" ]; then
  while read -r pid; do
    kill "$pid" 2>/dev/null && ok "Proceso ${pid} detenido" || true
  done < "$pids_file"
  rm -f "$pids_file"
fi

# También limpia procesos node que usen los puertos del proyecto
for port in 4000 5173; do
  pid=$(lsof -ti ":${port}" 2>/dev/null || true)
  if [ -n "$pid" ]; then
    kill "$pid" 2>/dev/null && ok "Puerto ${port} liberado"
  fi
done

ok "Servidores de Nova Salud detenidos."