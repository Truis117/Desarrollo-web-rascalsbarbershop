// ============================================
// VALIDACIONES FRONTEND - Rascals Barbershop
// ============================================

// Expresiones regulares
const REGEX = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    telefono: /^[0-9]{10}$/,  // Teléfono colombiano 10 dígitos
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/  // Mínimo 8 chars, 1 mayúscula, 1 minúscula, 1 número
};

// ============================================
// VALIDAR EMAIL
// ============================================
function validateEmail(email) {
    if (!email || email.trim() === '') {
        return { valid: false, message: 'El email es obligatorio' };
    }
    if (!REGEX.email.test(email)) {
        return { valid: false, message: 'El email no es válido' };
    }
    return { valid: true };
}

// ============================================
// VALIDAR CONTRASEÑA
// ============================================
function validatePassword(password) {
    if (!password) {
        return { valid: false, message: 'La contraseña es obligatoria' };
    }
    if (password.length < 6) {
        return { valid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
    }
    return { valid: true };
}

// ============================================
// VALIDAR CONTRASEÑA SEGURA
// ============================================
function validateStrongPassword(password) {
    if (!password) {
        return { valid: false, message: 'La contraseña es obligatoria' };
    }
    if (!REGEX.password.test(password)) {
        return { valid: false, message: 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número' };
    }
    return { valid: true };
}

// ============================================
// VALIDAR TELÉFONO
// ============================================
function validateTelefono(telefono) {
    if (!telefono) {
        return { valid: true }; // Opcional
    }
    if (!REGEX.telefono.test(telefono)) {
        return { valid: false, message: 'El teléfono debe tener 10 dígitos' };
    }
    return { valid: true };
}

// ============================================
// VALIDAR NOMBRE
// ============================================
function validateNombre(nombre) {
    if (!nombre || nombre.trim() === '') {
        return { valid: false, message: 'El nombre es obligatorio' };
    }
    if (nombre.trim().length < 2) {
        return { valid: false, message: 'El nombre debe tener al menos 2 caracteres' };
    }
    return { valid: true };
}

// ============================================
// VALIDAR PRECIO
// ============================================
function validatePrecio(precio) {
    if (!precio) {
        return { valid: false, message: 'El precio es obligatorio' };
    }
    const precioNum = parseFloat(precio);
    if (isNaN(precioNum) || precioNum <= 0) {
        return { valid: false, message: 'El precio debe ser un número mayor a 0' };
    }
    return { valid: true };
}

// ============================================
// MOSTRAR ERROR EN CAMPO
// ============================================
function showFieldError(input, message) {
    // Remover error anterior si existe
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Agregar clase de error al input
    input.classList.add('input-error');

    // Crear y agregar mensaje de error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '14px';
    errorDiv.style.marginTop = '5px';
    
    input.parentElement.appendChild(errorDiv);
}

// ============================================
// LIMPIAR ERROR DE CAMPO
// ============================================
function clearFieldError(input) {
    input.classList.remove('input-error');
    const errorMessage = input.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// ============================================
// VALIDAR FORMULARIO COMPLETO
// ============================================
function validateForm(formId, validationRules) {
    const form = document.getElementById(formId);
    if (!form) return false;

    let isValid = true;

    // Limpiar errores previos
    form.querySelectorAll('.input-error').forEach(input => {
        clearFieldError(input);
    });

    // Validar cada campo según las reglas
    Object.keys(validationRules).forEach(fieldName => {
        const input = form.querySelector(`[name="${fieldName}"]`);
        if (!input) return;

        const validator = validationRules[fieldName];
        const result = validator(input.value);

        if (!result.valid) {
            showFieldError(input, result.message);
            isValid = false;
        }
    });

    return isValid;
}

// ============================================
// AGREGAR VALIDACIÓN EN TIEMPO REAL
// ============================================
function addRealTimeValidation(inputId, validator) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.addEventListener('blur', function() {
        const result = validator(this.value);
        if (!result.valid) {
            showFieldError(this, result.message);
        } else {
            clearFieldError(this);
        }
    });

    input.addEventListener('input', function() {
        if (this.classList.contains('input-error')) {
            const result = validator(this.value);
            if (result.valid) {
                clearFieldError(this);
            }
        }
    });
}

// ============================================
// ESTILOS CSS PARA INPUTS CON ERROR
// ============================================
const style = document.createElement('style');
style.textContent = `
    .input-error {
        border-color: #e74c3c !important;
        border-width: 2px !important;
    }
    .error-message {
        color: #e74c3c;
        font-size: 14px;
        margin-top: 5px;
        animation: shake 0.3s;
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// ============================================
// EXPORTAR FUNCIONES (para uso global)
// ============================================
window.Validations = {
    validateEmail,
    validatePassword,
    validateStrongPassword,
    validateTelefono,
    validateNombre,
    validatePrecio,
    showFieldError,
    clearFieldError,
    validateForm,
    addRealTimeValidation
};
