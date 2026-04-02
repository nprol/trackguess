# 🎵 TrackGuess — React Native (Expo)

> ¡El juego de adivinanzas musicales que pone a prueba tu oído!

## ✨ Características

- **📅 Reto del Día** — mismas canciones para todos, renovadas cada 24 horas
- **🎸 10 géneros** — Pop, Rock, Hip-Hop, Electronic, R&B, Latin, Country, 80s, 90s, 2000s
- **🎧 Previews de 10 segundos** con inicio aleatorio dentro del clip
- **🎮 Tres niveles de dificultad** — Múltiple opción, texto libre, artista incluido
- **⏱️ Timer de 20 segundos** con bonus de velocidad para respuestas rápidas
- **🏆 Sistema de puntuación** — 100 pts por acierto + 50 pts bonus si respondes en menos de 5 segundos
- **🔤 Validación inteligente** — fuzzy matching que tolera tildes, errores de escritura y variaciones
- **📊 Resultados detallados** — precisión, ranking y desglose por ronda
- **🌙 Tema oscuro** · **📳 Vibración háptica** · **📱 Android e iOS**
- **Sin login** — funciona sin cuenta ni API key

## 🚀 Instalación

### Requisitos previos
- Node.js >= 18
- npm o yarn
- App **Expo Go** instalada en tu iPhone o Android

### Pasos

```bash
# 1. Clona el repositorio
git clone https://github.com/tu-usuario/trackguess.git
cd trackguess

# 2. Instala dependencias
npm install

# 3. Inicia el servidor de desarrollo
npx expo start
```

### Probar en tu teléfono

1. Abre la app **Expo Go** en tu iPhone/Android
2. Escanea el código QR que aparece en la terminal
3. ¡Listo!

### Probar en emulador

```bash
# Android
npx expo start --android

# iOS (solo en macOS)
npx expo start --ios
```

## 🗂️ Estructura del proyecto

```
trackguess/
├── app/                          # Rutas Expo Router (file-based)
│   ├── _layout.tsx               # Layout raíz (stack navigation)
│   ├── index.tsx                 # Pantalla de inicio
│   ├── genres.tsx                # Selección de género
│   └── game/
│       ├── setup.tsx             # Configuración de partida
│       ├── play.tsx              # Ronda de juego
│       └── results.tsx           # Resultados finales
├── src/
│   ├── components/               # Componentes reutilizables
│   │   ├── AnswerOption.tsx      # Botón de respuesta (múltiple opción)
│   │   ├── ProgressBar.tsx       # Barra de progreso
│   │   ├── Timer.tsx             # Temporizador de respuesta
│   │   └── ui/                   # Componentes base (Button, Card, etc.)
│   ├── hooks/
│   │   └── useAudioPlayer.ts     # Control de reproducción de audio
│   ├── services/
│   │   └── itunesApi.ts          # Cliente iTunes Search API
│   ├── store/
│   │   └── gameStore.ts          # Estado de la partida (Zustand)
│   ├── types/
│   │   └── music.ts              # Tipos del juego y canciones
│   └── utils/
│       ├── gameLogic.ts          # Puntuación, shuffle y reto diario
│       └── stringMatch.ts        # Validación fuzzy de respuestas
├── constants/
│   ├── genres.ts                 # Géneros y sus search terms
│   └── theme.ts                  # Tokens de diseño (colores, espaciado)
├── assets/                       # Imágenes e iconos
└── app.json                      # Configuración de Expo
```

## 🎮 Cómo se juega

1. **Elige modo** — Reto del Día (canciones fijas) o un género musical
2. **Configura la partida** — número de rondas (5, 10 o 20) y dificultad
3. **Pulsa play** y escucha 10 segundos del clip
4. **Adivina** — elige entre 4 opciones (Fácil) o escribe el título (Medio/Difícil)
5. **Acumula puntos** — responde antes de 5 segundos para el bonus de velocidad
6. **Consulta tus resultados** con el desglose completo de la partida

## 🛠️ Tech Stack

| Tecnología | Uso |
|------------|-----|
| Expo SDK 54 | Framework base |
| Expo Router 6 | Navegación file-based |
| Zustand | Estado global ligero |
| Expo Audio | Reproducción de audio |
| iTunes Search API | Canciones y previews (gratuita, sin auth) |
| Expo Haptics | Vibración táctil |
| TypeScript | Tipado estático |

## 📄 Licencia

Proyecto personal. ¡Úsalo como quieras! 🎵
