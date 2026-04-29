# 💰 Nolo App — React Native + Expo

App de finanzas personales y en pareja basada en los diseños de **la Peliroja Financiera**.

---

## 📱 Pantallas

| Archivo | Descripción |
|---|---|
| `LoginScreen` | Inicio de sesión con usuario y contraseña (bcrypt) |
| `RegisterScreen` | Registro completo con datos personales y geolocalización |
| `WelcomeScreen` | Bienvenida con enlace a tutorial YouTube |
| `FinancesScreen` | Hub principal — selector de módulos de finanzas |
| `PersonalFinancesScreen` | Ingresos / Gastos / Saldo personal (tema verde) |
| `CoupleFinancesScreen` | Ingresos / Gastos / Saldo en pareja (tema amarillo) |
| `SimulatorsScreen` | Menú con acceso a todos los simuladores |
| `CDTScreen` | Simulador de Certificado de Depósito a Término |
| `BankDebtScreen` | Simulador de deuda bancaria (cuotas y costo total) |
| `EmergencyFundScreen` | Calculadora de fondo de emergencia |
| `SavingsScreen` | Proyección de ahorros con interés compuesto |
| `PensionPlanScreen` | Estimación de pensión futura |
| `LoansScreen` | Calculadora de cuotas y total de préstamos |

---

## 🚀 Instalación

### Requisitos
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Cuenta en [Supabase](https://supabase.com) con las tablas configuradas
- App **Expo Go** (iOS/Android) o emulador

### Pasos

```bash
# 1. Entra a la carpeta
cd nolo-app

# 2. Instala dependencias
npm install

# 3. Crea el archivo de variables de entorno
cp .env.example .env
# Agrega EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY

# 4. Inicia el servidor
npx expo start

# 5. Escanea el QR con Expo Go o presiona 'i' / 'a' para simuladores
```

---

## 🎨 Diseño

- **Finanzas Personales**: Tema verde — fondo `#C8F090`, acento `#1E7A3E`
- **Finanzas en Pareja**: Tema amarillo — acento `#E8A820`
- **Gráficas de torta** con `react-native-svg` (sin librerías externas de charts)
- **Modales** personalizados para edición de valores y confirmaciones

---

## 📁 Estructura

```
nolo-app/
├── App.js                                   # Navegación principal (Stack Navigator)
├── app.json
├── package.json
│
├── constants/
│   ├── routes.js                            # Constantes de rutas (ROUTES)
│   ├── theme.js                             # Colores, spacing, radius
│   ├── documentTypes.js                     # Tipos de documento
│   ├── expenseCategories.js                 # Categorías de gastos
│   ├── incomeCategories.js                  # Categorías de ingresos
│   ├── genders.js                           # Opciones de género
│   ├── monthToNumber.js                     # Meses → número
│   └── tabsFinance.js                       # Tabs de finanzas (Ingresos/Gastos/Saldo)
│
├── lib/
│   └── supabase.js                          # Cliente Supabase con SecureStore
│
├── models/
│   ├── index.js                             # Re-exporta todos los modelos
│   ├── User.js                              # CRUD tabla users
│   ├── Credentials.js                       # CRUD tabla credentials + auth
│   ├── PersonalFinances.js                  # CRUD finanzas personales
│   ├── CoupleFinances.js                    # CRUD finanzas en pareja
│   └── Geo.js                              # Países, estados y ciudades
│
├── hooks/
│   └── useFinances.js                       # Hook compartido para ambas pantallas de finanzas
│
├── utils/
│   ├── formatMoney.js                       # Formato de moneda COP
│   └── passwordCrypto.js                    # hashPassword / comparePassword (bcryptjs)
│
├── screens/
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── WelcomeScreen.js
│   ├── FinancesScreen.js                    # Hub: Finanzas Personales / En Pareja
│   ├── PersonalFinancesScreen.js
│   ├── CoupleFinancesScreen.js
│   ├── SimulatorsScreen.js                  # Menú de simuladores
│   ├── CDTScreen.js
│   ├── BankDebtScreen.js
│   ├── EmergencyFundScreen.js
│   ├── SavingsScreen.js
│   ├── PensionPlanScreen.js
│   └── LoansScreen.js
│
├── components/
│   ├── BottomNav.js                         # Barra de navegación inferior
│   ├── LogoutButton.js                      # Botón de cierre de sesión con confirmación
│   ├── MonthSelector.js                     # Selector horizontal de mes
│   ├── NoloLogo.js                          # Logo "$ Nolo"
│   ├── PieChart.js                          # Gráfica de torta con react-native-svg
│   ├── SimulatorComponents.js               # SimInput y ResultRow (usados en simuladores)
│   ├── SuccessModal.js                      # Modal de éxito reutilizable
│   └── finances/
│       ├── BalanceBar.js                    # Barra de saldo del período
│       ├── CategorySection.js               # Sección de categorías con gráfica
│       ├── EditModal.js                     # Modal de edición de valores
│       ├── FinanceHeader.js                 # Encabezado con goBack para pantallas de finanzas
│       ├── FinanceTabs.js                   # Tabs Ingresos / Gastos / Saldo
│       ├── SummarySection.js                # Resumen y botón guardar
│       └── YearSelector.js                  # Selector de año
│
└── styles/
    ├── screens/
    │   ├── LoginScreen.styles.js
    │   ├── RegisterScreen.styles.js
    │   ├── WelcomeScreen.styles.js
    │   ├── FinancesScreen.styles.js
    │   ├── PersonalFinancesScreen.styles.js
    │   ├── CoupleFinancesScreen.styles.js
    │   ├── SimulatorsScreen.styles.js
    │   └── simulator.styles.js              # Estilos compartidos para simuladores
    └── components/
        ├── BottomNav.styles.js
        ├── LogoutButton.styles.js
        ├── MonthSelector.styles.js
        ├── NoloLogo.styles.js
        └── SimulatorComponents.styles.js
```

---

## 🔐 Autenticación

El flujo de autenticación usa **Supabase Auth** + tabla `credentials` propia:

1. **Registro** — `supabase.auth.signUp` + RPC `register_user_profile` que inserta en `users` y `credentials` (contraseña hasheada con bcryptjs)
2. **Login** — RPC `get_email_by_username` para obtener el email → `supabase.auth.signInWithPassword`
3. **Sesión** — Persistida con `expo-secure-store` (chunking para el límite de 2KB en iOS)
4. **Logout** — `supabase.auth.signOut` con confirmación mediante modal antes de ejecutarse

---

## 🗃️ Base de datos (Supabase)

Tablas requeridas: `users`, `credentials`, `personal_finances`, `couple_finances`, `countries`, `states`, `cities`

RPCs requeridas:
- `register_user_profile` — registra usuario completo (SECURITY DEFINER)
- `get_email_by_username` — obtiene email dado un username

---

## 🔧 Próximas mejoras

- [ ] Módulo "Mi Negocio"
- [ ] Exportar reportes en PDF
- [ ] Notificaciones de alerta de presupuesto
- [ ] Modo oscuro
- [ ] Gráficas históricas por período
