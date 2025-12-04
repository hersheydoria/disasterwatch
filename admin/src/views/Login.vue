<template>
  <div class="page-wrap">
    <div class="bg-circle c1"></div>
    <div class="bg-circle c2"></div>

    <div class="card">
      <div class="brand">
        <div class="logo" aria-hidden>
          <img :src="logo" alt="DisasterWatch logo" class="logo-img" />
        </div>
        <div class="brand-text">DisasterWatch</div>
      </div>

      <h1 class="title">Welcome</h1>
      <p class="subtitle">Sign in to your account to continue</p>

      <div v-if="error" class="error-message">{{ error }}</div>

      <form class="login-form" @submit.prevent="submit">
        <label class="field">
          <div class="label">Username</div>
          <div class="input-row">
            <svg class="icon" viewBox="0 0 24 24"><path fill="#9aa0a6" d="M12 12a5 5 0 100-10 5 5 0 000 10zM2 20a10 10 0 0120 0H2z"/></svg>
            <input v-model="form.username" placeholder="Enter your username" />
          </div>
        </label>

        <label class="field">
          <div class="label">Password</div>
          <div class="input-row">
            <svg class="icon" viewBox="0 0 24 24"><path fill="#9aa0a6" d="M17 8V7a5 5 0 10-10 0v1H5v11h14V8h-2zm-8 0V7a3 3 0 116 0v1H9z"/></svg>
            <input type="password" v-model="form.password" placeholder="Enter your password" />
          </div>
        </label>

        <div class="row small">
          <label class="remember">
            <input type="checkbox" v-model="form.remember" />
            Remember me
          </label>
          <a class="forgot" href="#">Forgot Password?</a>
        </div>

        <button class="primary" type="submit" :disabled="loading">
          {{ loading ? 'Signing In...' : 'Sign In' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import logo from '../assets/logo.png'

const emit = defineEmits(['login'])

const form = reactive({ username: '', password: '', remember: false })
const loading = ref(false)
const error = ref('')

function submit() {
  if (!form.username || !form.password) {
    error.value = 'Please enter username and password'
    return
  }

  loading.value = true
  error.value = ''

  // Save user preference for remember me
  if (form.remember) {
    localStorage.setItem('rememberUsername', form.username)
  } else {
    localStorage.removeItem('rememberUsername')
  }
  
  // Emit login event to trigger dashboard display
  emit('login')
  loading.value = false
}
</script>

<style scoped>
.page-wrap{
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  background: linear-gradient(135deg, #f06b18 0%, #e86a24 40%, #d85a2a 100%);
  padding:40px;
  position:relative;
}
.bg-circle{
  position:absolute;
  border-radius:50%;
  opacity:0.06;
}
.bg-circle.c1{ width:300px; height:300px; left:40px; top:40px; background:#000; }
.bg-circle.c2{ width:180px; height:180px; right:60px; bottom:60px; background:#000; }
.card{
  width:420px;
  background: #fff;
  border-radius:12px;
  padding:28px 32px;
  box-shadow: 0 14px 40px rgba(0,0,0,0.18);
}
.brand{ display:flex; align-items:center; gap:12px; margin-bottom:14px; justify-content:center }
.logo{ width:40px; height:40px; border-radius:8px; display:flex; align-items:center; justify-content:center; background:linear-gradient(180deg,#ff8a46,#ff6b1a); box-shadow:0 6px 18px rgba(255,107,26,0.18)}
.logo-img{ width:22px; height:22px; object-fit:contain }
.brand-text{ font-weight:700; color:#222 }
.title{ margin: 4px 0 6px; font-size:22px; color:#111; text-align:center }
.subtitle{ margin:0 0 18px; color:#7a7f84; font-size:13px; text-align:center }
.error-message{ background:#fee; border:1px solid #fcc; color:#c33; padding:10px 12px; border-radius:6px; font-size:13px; margin-bottom:12px; text-align:center }
.login-form{ display:flex; flex-direction:column; gap:12px }
.field .label{ color:#6b7075; font-size:12px; margin-bottom:6px }
.input-row{ display:flex; align-items:center; gap:10px; border:1px solid #eef0f2; padding:10px 12px; border-radius:6px; background:#fafafa }
.input-row .icon{ width:18px; height:18px }
input{ border:0; outline:none; font-size:14px; background:transparent; flex:1 }
.row.small{ display:flex; justify-content:space-between; align-items:center; margin-top:6px }
.remember{ display:flex; gap:8px; align-items:center; color:#6b7075; font-size:13px }
.forgot{ color:#ff6b1a; text-decoration:none; font-size:13px }
.primary{ margin-top:10px; background:linear-gradient(180deg,#ff7b3a,#ff6b1a); color:white; border:0; padding:12px; border-radius:8px; font-weight:600; cursor:pointer; box-shadow:0 8px 18px rgba(255,107,26,0.18) }
.primary:disabled{ opacity:0.6; cursor:not-allowed }
.primary:active{ transform:translateY(1px) }

@media (max-width:768px){
  .page-wrap { padding: 30px; }
  .card { width: 100%; padding: 20px; }
  .title { font-size: 18px; }
}

@media (max-width:480px){
  .page-wrap { padding: 20px; }
  .bg-circle { display: none; }
  .card { width: 100%; padding: 20px; }
  .brand { flex-direction: column; margin-bottom: 12px; }
  .logo { width: 36px; height: 36px; }
  .logo-img { width: 20px; height: 20px; }
  .brand-text { font-size: 14px; }
  .title { margin: 4px 0 8px; font-size: 18px; }
  .subtitle { font-size: 12px; margin-bottom: 16px; }
  .login-form { gap: 10px; }
  .field .label { font-size: 11px; margin-bottom: 4px; }
  .input-row { padding: 8px 10px; }
  .input-row .icon { width: 16px; height: 16px; }
  input { font-size: 16px; }
  .remember { font-size: 12px; }
  .forgot { font-size: 12px; }
  .primary { padding: 10px; font-size: 14px; }
}
</style>
