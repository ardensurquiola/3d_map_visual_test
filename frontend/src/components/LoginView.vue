<template>
  <div class="login-screen">
    <div class="login-card">
      <div class="login-logo">🏍</div>
      <h1 class="login-title">Tiendas de Motos México</h1>
      <p class="login-subtitle">Mapa 3D · deck.gl + Google Maps</p>

      <form class="login-form" @submit.prevent="handleSignIn">
        <div class="field">
          <label class="field-label">Correo electrónico</label>
          <input
            v-model="email"
            type="email"
            class="field-input"
            placeholder="correo@ejemplo.com"
            autocomplete="email"
            required
            :disabled="signing"
          />
        </div>

        <div class="field">
          <label class="field-label">Contraseña</label>
          <div class="password-wrapper">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="field-input"
              placeholder="••••••••"
              autocomplete="current-password"
              required
              :disabled="signing"
            />
            <button type="button" class="toggle-pw" @click="showPassword = !showPassword" tabindex="-1">
              <svg v-if="!showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>
          </div>
        </div>

        <p v-if="authError" class="login-error">{{ authError }}</p>

        <button type="submit" class="submit-btn" :disabled="signing">
          <span v-if="signing" class="spinner"></span>
          {{ signing ? 'Iniciando sesión…' : 'Iniciar sesión' }}
        </button>
      </form>

      <p class="login-note">Solo cuentas autorizadas tienen acceso.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth.js';

const { signIn, authError } = useAuth();
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const signing = ref(false);

async function handleSignIn() {
  signing.value = true;
  await signIn(email.value, password.value);
  signing.value = false;
}
</script>

<style scoped>
.login-screen {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f1117;
  z-index: 9999;
}

.login-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  background: #1a1d27;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 48px 40px;
  width: 100%;
  max-width: 380px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);
  box-sizing: border-box;
}

@media (max-width: 440px) {
  .login-card {
    border-radius: 0;
    min-height: 100dvh;
    justify-content: center;
    padding: 40px 28px;
  }
}

.login-logo {
  font-size: 48px;
  line-height: 1;
  margin-bottom: 4px;
}

.login-title {
  font-size: 20px;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
  text-align: center;
}

.login-subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  text-align: center;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  margin-top: 8px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.field-input {
  width: 100%;
  padding: 11px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 10px;
  color: #f1f5f9;
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;
  box-sizing: border-box;
}

.field-input::placeholder {
  color: #475569;
}

.field-input:focus {
  border-color: rgba(99, 102, 241, 0.6);
  background: rgba(255, 255, 255, 0.07);
}

.field-input:disabled {
  opacity: 0.5;
}

.password-wrapper {
  position: relative;
}

.password-wrapper .field-input {
  padding-right: 44px;
}

.toggle-pw {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
}

.toggle-pw:hover {
  color: #94a3b8;
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 4px;
  padding: 13px;
  width: 100%;
  background: #6366f1;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.submit-btn:hover:not(:disabled) {
  background: #4f52d3;
}

.submit-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.login-error {
  font-size: 13px;
  color: #f87171;
  text-align: center;
  margin: 0;
  padding: 10px 14px;
  background: rgba(248, 113, 113, 0.08);
  border: 1px solid rgba(248, 113, 113, 0.2);
  border-radius: 8px;
}

.login-note {
  font-size: 12px;
  color: #475569;
  margin: 0;
  text-align: center;
}
</style>
