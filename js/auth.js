// ===== تنظیمات Firebase =====
// این مقادیر از پروژه‌ی Firebase «cosmic-code» گرفته شده.
const firebaseConfig = {
  apiKey: "AIzaSyDfRsKh0h7JUZj894fR5nIeD0NBJkwnOb4",
  authDomain: "cosmic-code-e7b94.firebaseapp.com",
  projectId: "cosmic-code-e7b94",
  storageBucket: "cosmic-code-e7b94.firebasestorage.app",
  messagingSenderId: "948644041400",
  appId: "1:948644041400:web:190819bce51dcc2a2f1a4d"
};

let currentUser = null;
let authReady = false;
const authReadyCallbacks = [];

try {
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();

  auth.onAuthStateChanged((user) => {
    currentUser = user;
    authReady = true;
    if (typeof onAuthChanged === 'function') onAuthChanged(user);
    authReadyCallbacks.forEach((cb) => cb(user));
    authReadyCallbacks.length = 0;
  });

  // نتیجه‌ی ورود با گوگل (که با ریدایرکت انجام می‌شه) رو بعد از برگشت به صفحه چک می‌کنیم.
  auth.getRedirectResult().catch((err) => {
    console.error('Google sign-in redirect error:', err);
  });

  function signUpWithEmail(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }
  function signInWithEmail(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }
  function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return auth.signInWithRedirect(provider);
  }
  function signOutUser() {
    return auth.signOut();
  }
  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }
  window.signUpWithEmail = signUpWithEmail;
  window.signInWithEmail = signInWithEmail;
  window.signInWithGoogle = signInWithGoogle;
  window.signOutUser = signOutUser;
  window.resetPassword = resetPassword;
} catch (e) {
  console.error('Firebase init failed — عضویت تا وقتی تنظیمات Firebase کامل نشه کار نمی‌کنه.', e);
}

function translateAuthError(err) {
  const map = {
    'auth/email-already-in-use': 'این ایمیل قبلاً ثبت‌نام شده. وارد شو یا رمزت رو فراموش کردی؟',
    'auth/invalid-email': 'ایمیل واردشده معتبر نیست.',
    'auth/weak-password': 'رمز عبور باید حداقل ۶ کاراکتر باشه.',
    'auth/user-not-found': 'حسابی با این ایمیل پیدا نشد.',
    'auth/wrong-password': 'رمز عبور اشتباهه.',
    'auth/invalid-credential': 'ایمیل یا رمز عبور اشتباهه.',
    'auth/too-many-requests': 'تعداد تلاش‌ها زیاد بوده، کمی صبر کن و دوباره امتحان کن.',
    'auth/network-request-failed': 'مشکل در اتصال به اینترنت.',
    'auth/popup-closed-by-user': 'پنجره‌ی ورود بسته شد.',
    'auth/configuration-not-found': 'تنظیمات Firebase هنوز کامل نشده.'
  };
  return map[err.code] || ('خطا: ' + err.message);
}
