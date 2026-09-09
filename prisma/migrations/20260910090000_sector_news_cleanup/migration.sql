-- Limpieza única (10/09): retirar los titulares de la primera versión del
-- tablón (guardados sin etiqueta temática, alguno con fecha antigua del RSS).
-- La versión visual etiqueta siempre al publicar, así que topic IS NULL solo
-- puede ser una fila de arranque o de una pasada sin IA aún sin etiquetar.
DELETE FROM "sector_news" WHERE "topic" IS NULL;
