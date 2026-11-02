#!/usr/bin/env bash
################################################################################
# Nova Salud - Lanzador general (Linux / macOS)
# Levanta backend (puerto 4000) y frontend (puerto 5173) en cualquier dispositivo.
################################################################################
set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

BACKEND_PORT=4000
FRONTEND_PORT=5173
FRONTEND_URL="http://localhost:${FRONTEND_PORT}"

# Colores
C_RESET='\033[0m'
C_BOLD='\033[1m'
C_GREEN='\033[32m'
C_YELLOW='\033[33m'
C_RED='\033[31m'
C_CYAN='\033[36m'

log()  { printf '%b\n' "${C_CYAN}[Nova Salud]${C_RESET} $*"; }
ok()   { printf '%b\n' "${C_GREEN}✔${C_RESET} $*"; }
warn() { printf '%b\n' "${C_YELLOW}⚠${C_RESET} $*"; }
err()  { printf '%b\n' "${C_RED}✘${C_RESET} $*" >&2; }

# ---------------------------------------------------------------- requisitos --
require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    err "No se encontró '$1'. Instálalo y vuelve a intentar."
    exit 1
  fi
}

require_cmd node
require_cmd npm

# ------------------------------------------------------- entorno de node -----
export NODE_ENV="${NODE_ENV:-development}"

# ----------------------------------------------- instalar dependencias -------
install_if_needed() {
  local dir="$1"
  local label="$2"
  if [ ! -d "$dir/node_modules" ]; then
    warn "Instalando dependencias de $label (primera vez)..."
    (cd "$dir" && npm install --no-fund --no-audit) || {
      err "Fallo al instalar dependencias de $label"
      exit 1
    }
    ok "Dependencias de $label instaladas."
  else
    ok "Dependencias de $label listas."
  fi
}

install_if_needed "$BACKEND_DIR" "backend"
install_if_needed "$FRONTEND_DIR" "frontend"

# ----------------------------------------------------------------- seed ------
log "Ejecutando seed de la base de datos (backend)..."
(cd "$BACKEND_DIR" && npm run seed) >/dev/null 2>&1 && ok "Seed completado" || warn "Seed omitido (ya ejecutado o sin cambios)"

# ----------------------------------------------------------- limpiar previos --
pids_file="$ROOT_DIR/.novasalud.pids"
if [ -f "$pids_file" ]; then
  while read -r pid; do
    kill "$pid" 2>/dev/null || true
  done < "$pids_file"
  rm -f "$pids_file"
fi

# ------------------------------------------------------------ lanzar backend --
log "Iniciando backend en puerto ${BACKEND_PORT}..."
(cd "$BACKEND_DIR" && npm run dev > "$ROOT_DIR/.novasalud-backend.log" 2>&1 &)
echo $! >> "$pids_file"

# ------------------------------------------------------------ lanzar frontend --
log "Iniciando frontend en puerto ${FRONTEND_PORT}..."
(cd "$FRONTEND_DIR" && npm run dev > "$ROOT_DIR/.novasalud-frontend.log" 2>&1 &)
echo $! >> "$pids_file"

# --------------------------------------------------- esperar a que estén listos --
wait_for_port() {
  local port="$1"
  local name="$2"
  local i=0
  while ! (echo > "/dev/tcp/127.0.0.1/${port}") 2>/dev/null; do
    i=$((i + 1))
    if [ "$i" -gt 60 ]; then
      warn "No se detectó respuesta de $name en el puerto ${port}."
      return 1
    fi
    sleep 1
  done
  ok "$name listo en puerto ${port}"
}

wait_for_port "$BACKEND_PORT"  "Backend"
wait_for_port "$FRONTEND_PORT" "Frontend"

# ------------------------------------------------------------ abrir navegador --
log "Abriendo ${FRONTEND_URL} ..."
if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$FRONTEND_URL" >/dev/null 2>&1 &
elif command -v open >/dev/null 2>&1; then
  open "$FRONTEND_URL" >/dev/null 2>&1 &
else
  warn "No se pudo abrir el navegador automáticamente. Ve a: $FRONTEND_URL"
fi

# ---------------------------------------------------------------- resumen -----
cat <<EOF

${C_BOLD}================================================${C_RESET}
${C_BOLD}  Nova Salud - Servidores en línea${C_RESET}
${C_BOLD}================================================${C_RESET}
  Backend  : http://localhost:${BACKEND_PORT}
  Frontend : ${FRONTEND_URL}
  Credenciales:
    admin@novasalud.com   / admin123
    vendedor@novasalud.com / vendedor123
${C_BOLD}================================================${C_RESET}

Logs:
  backend  : $ROOT_DIR/.novasalud-backend.log
  frontend : $ROOT_DIR/.novasalud-frontend.log

Para detener todo:  ./detener.sh   (o presiona Ctrl+C y ejecuta detener.sh)

EOF

# Mantener el script vivo mostrando logs hasta que el usuario cancele
trap 'log "Deteniendo servidores..."; ./detener.sh; exit 0' INT TERM
while true; do
  sleep 1
done