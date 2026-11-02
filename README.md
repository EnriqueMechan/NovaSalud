# Nova Salud - Software Web de Gestion de Inventario y Venta de Botica

Proyecto full stack desarrollado siguiendo el material tecnico de apoyo del curso.

## Tecnologias
- Backend: Node.js, Express.js, Sequelize ORM, JWT, bcryptjs
- Frontend: React + Vite, React Router, Axios
- Base de datos: SQLite (desarrollo) / MySQL (produccion)

## Estructura
- `backend/`: API REST
- `frontend/`: SPA React

## Ejecucion

### Lanzador general (recomendado)

Levanta backend y frontend con un solo comando, en cualquier dispositivo:

- **Linux / macOS:**
  ```bash
  chmod +x iniciar.sh detener.sh
  ./iniciar.sh
  ```
  Para detener: `./detener.sh`

- **Windows:**
  ```cmd
  iniciar.bat
  ```
  Para detener: `detener.bat`

El lanzador instala dependencias si faltan, ejecuta el seed de la base de datos, inicia el backend (puerto 4000) y el frontend (puerto 5173), y abre el navegador automáticamente.

### Ejecución manual

#### Backend
```bash
cd backend
npm install
npm run seed
npm run dev
```
API en http://localhost:4000

#### Frontend
```bash
cd frontend
npm install
npm run dev
```
App en http://localhost:5173

Credenciales: admin@novasalud.com / admin123 ; vendedor@novasalud.com / vendedor123

## Endpoints principales
- POST /api/v1/auth/login
- GET/POST /api/v1/products
- GET /api/v1/products/low-stock
- GET/POST /api/v1/sales
- GET /api/v1/dashboard/summary