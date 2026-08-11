-- Fase 10 (Search): extensión unaccent para búsqueda insensible a acentos.
-- El buscador construye los tsvector en tiempo de consulta (catálogo pequeño);
-- cuando el contenido crezca se añadirá un índice GIN en una migración futura.
CREATE EXTENSION IF NOT EXISTS unaccent;
