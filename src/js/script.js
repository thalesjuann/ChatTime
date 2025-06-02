const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const toggleBtn = document.getElementById('toggleBtn');
const toggleText = document.getElementById('toggleText');
const formTitle = document.getElementById('formTitle');

let showingLogin = true;

toggleBtn.addEventListener('click', () => {
  showingLogin = !showingLogin;

  if (showingLogin) {
    formTitle.textContent = 'Entrar na sua conta';
    toggleText.textContent = 'Não tem uma conta?';
    toggleBtn.textContent = 'Registrar';

    loginForm.classList.add('active');
    loginForm.classList.remove('inactive');

    registerForm.classList.add('inactive');
    registerForm.classList.remove('active');
  } else {
    formTitle.textContent = 'Criar nova conta';
    toggleText.textContent = 'Já tem uma conta?';
    toggleBtn.textContent = 'Entrar';

    registerForm.classList.add('active');
    registerForm.classList.remove('inactive');

    loginForm.classList.add('inactive');
    loginForm.classList.remove('active');
  }
});

function showMessage(msg, isError = true) {
  let messageEl = document.getElementById('messageBox');
  if (!messageEl) {
    messageEl = document.createElement('div');
    messageEl.id = 'messageBox';
    messageEl.className = 'my-4 p-3 rounded text-center';
    loginForm.parentNode.insertBefore(messageEl, loginForm.nextSibling);
  }
  messageEl.textContent = msg;
  messageEl.classList.toggle('bg-red-600', isError);
  messageEl.classList.toggle('bg-green-600', !isError);
  messageEl.classList.toggle('text-white', true);
}

loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  const email = loginForm.querySelector('input[type="email"]').value;
  const password = loginForm.querySelector('input[type="password"]').value;
  try {
    await auth.signInWithEmailAndPassword(email, password);
    showMessage('Login efetuado com sucesso!', false);
    window.location.href = '../pages/home.html';
  } catch (error) {
    showMessage(error.message);
  }
});

registerForm.addEventListener('submit', async e => {
  e.preventDefault();
  const name = registerForm.querySelector('input[type="text"]').value;
  const email = registerForm.querySelector('input[type="email"]').value;
  const password = registerForm.querySelector('input[type="password"]').value;

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    await userCredential.user.updateProfile({ displayName: name });
    showMessage('Conta criada com sucesso!', false);
    window.location.href = '../pages/home.html';
    toggleBtn.click();
  } catch (error) {
    showMessage(error.message);
  }
});