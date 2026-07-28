function resetModal() {
    const successDiv = document.getElementById('registrationSuccess');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabs = document.querySelector('.modal-tabs');
    const divider = document.querySelector('.modal-divider');
    const googleBtn = document.querySelector('.modal-btn-google');
    if (successDiv) successDiv.style.display = 'none';
    if (tabs) tabs.style.display = 'flex';
    if (divider) divider.style.display = 'flex';
    if (googleBtn) googleBtn.style.display = 'flex';
    document.querySelectorAll('.modal-error').forEach(el => el.remove());
}

function showError(formId, message) {
    const form = document.getElementById(formId);
    if (!form) return;
    const oldError = form.querySelector('.modal-error');
    if (oldError) oldError.remove();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'modal-error';
    errorDiv.textContent = message;
    form.insertBefore(errorDiv, form.firstChild);
}

function removeErrors(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    document.querySelectorAll('.modal-error').forEach(el => el.remove());
}