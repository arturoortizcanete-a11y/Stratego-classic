# Stratego Classic 0.2

Prototipo funcional de tablero y motor básico de reglas.

## Ejecutar
Requiere Node.js 20+:
```bash
npm install
npm run dev
```
Abrí la URL indicada por Vite. Para acceder desde otro equipo de la misma red, usá la dirección LAN que Vite muestre.

## Incluye
- Tablero 10x10 con lagos clásicos.
- Inventario estándar de 40 piezas por jugador.
- Despliegue manual seleccionando cada rango o colocación aleatoria para completar las piezas restantes.
- Cambio de jugador con pantalla de privacidad que oculta los rangos durante el pase del dispositivo.
- Selección de piezas y movimientos ortogonales.
- Explorador puede recorrer varias casillas en línea recta.
- Resolución básica de combates, bombas, minadores, espía y captura de bandera.
- En partida local por turnos, cada jugador ve sus propios rangos; los rangos rivales se muestran ocultos.
- Interfaz adaptable a móvil y escritorio.

## Limitaciones importantes
- Es un prototipo local de reglas, no es todavía multijugador en red.
- La modalidad de dos jugadores en el mismo dispositivo no protege secretos entre personas: se usa para probar el motor y la interfaz.
- Para una partida real entre dispositivos, el siguiente paso es implementar un servidor autoritativo que nunca envíe rangos secretos al rival.
- Conviene validar el reglamento exacto de la edición elegida antes de declarar compatibilidad oficial. Este prototipo usa la distribución clásica estándar.
