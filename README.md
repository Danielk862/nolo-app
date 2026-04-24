# 💰 Nolo App — React Native + Expo

App de finanzas personales basada en los diseños de **la Peliroja Financiera**.

## 📱 Pantallas incluidas

| Pantalla | Descripción |
|---|---|
| `LoginScreen` | Login con email/contraseña |
| `WelcomeScreen` | Bienvenida con enlace a tutorial YouTube |
| `HomeScreen` | Selector de módulos (3 opciones) |
| `FinanzasPersonalesScreen` | Ingresos / Gastos / Saldo personal (verde) |
| `FinanzasParejaScreen` | Ingresos / Gastos / Saldo en pareja (amarillo) |
| `SimuladoresScreen` | 6 simuladores financieros interactivos |

## 🧮 Simuladores incluidos

- **CDT** — Rendimiento de certificados de depósito
- **Deuda Banco** — Cuotas y costo total de deudas
- **Fondo de Emergencia** — Cálculo del fondo necesario
- **Ahorro** — Proyección de ahorros con interés compuesto
- **Plan Pensión** — Estimación de pensión futura
- **Préstamos** — Cuotas mensuales y total a pagar

## 🚀 Instalación y ejecución

### Requisitos previos
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Para iOS: Xcode (Mac) o app Expo Go
- Para Android: Android Studio o app Expo Go

### Pasos

```bash
# 1. Entra a la carpeta
cd nolo-app

# 2. Instala dependencias
npm install

# 3. Inicia el servidor
npx expo start

# 4. Escanea el QR con Expo Go (iOS/Android)
# O presiona 'i' para iOS simulator / 'a' para Android emulator
```

## 🎨 Diseño

- **Finanzas Personales**: Tema verde (`#C8F090` background, `#1E7A3E` accent)
- **Finanzas en Pareja**: Tema amarillo/dorado (`#E8A820`)
- **Gráficas de torta** implementadas con `react-native-svg` (sin dependencias externas pesadas)
- **Edición de valores** con modal nativo al tocar cada categoría

## 📁 Estructura

```
nolo-app/
├── App.js                          # Navegación principal
├── app.json                        # Config Expo
├── package.json
├── babel.config.js
├── constants/
│   └── theme.js                    # Colores, spacing, radius
├── components/
│   ├── NoloLogo.js                 # Logo $ Nolo
│   ├── PieChart.js                 # Gráfica de torta SVG
│   ├── BottomNav.js               # Navegación inferior
│   └── MonthSelector.js           # Selector de mes
└── screens/
    ├── LoginScreen.js
    ├── WelcomeScreen.js
    ├── HomeScreen.js
    ├── FinanzasPersonalesScreen.js
    ├── FinanzasParejaScreen.js
    └── SimuladoresScreen.js
```

## 🔧 Próximas mejoras sugeridas

- [ ] Módulo "Mi Negocio"
- [ ] Persistencia con AsyncStorage o SQLite
- [ ] Autenticación real (Firebase / Supabase)
- [ ] Exportar reportes PDF
- [ ] Notificaciones de presupuesto
- [ ] Modo oscuro
