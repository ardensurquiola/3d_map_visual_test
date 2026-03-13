import { ref } from 'vue';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
  updatePassword as firebaseUpdatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { auth } from '../firebase/config.js';

const user = ref(null);
const authLoading = ref(true);
const authError = ref(null);
const userDisplayName = ref(null);

onAuthStateChanged(auth, (firebaseUser) => {
  user.value = firebaseUser;
  userDisplayName.value = firebaseUser?.displayName ?? null;
  authLoading.value = false;
});

async function signIn(email, password) {
  authError.value = null;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
      authError.value = 'Correo o contraseña incorrectos.';
    } else if (err.code === 'auth/too-many-requests') {
      authError.value = 'Demasiados intentos fallidos. Intenta más tarde.';
    } else {
      authError.value = 'Error al iniciar sesión. Intenta de nuevo.';
    }
  }
}

async function signOut() {
  await firebaseSignOut(auth);
  user.value = null;
  userDisplayName.value = null;
}

async function updateUserProfile(displayName) {
  if (!user.value) throw new Error('No hay usuario autenticado.');
  await firebaseUpdateProfile(user.value, { displayName: displayName.trim() });
  userDisplayName.value = displayName.trim();
}

async function changePassword(currentPassword, newPassword) {
  if (!user.value) throw new Error('No hay usuario autenticado.');
  const credential = EmailAuthProvider.credential(user.value.email, currentPassword);
  await reauthenticateWithCredential(user.value, credential);
  await firebaseUpdatePassword(user.value, newPassword);
}

export function useAuth() {
  return { user, authLoading, authError, userDisplayName, signIn, signOut, updateUserProfile, changePassword };
}
