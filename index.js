document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Elements
    const phoneForm = document.getElementById('phoneForm');
    const codeForm = document.getElementById('codeForm');
    const title = document.getElementById('title');
    const subtitle = document.getElementById('subtitle');
    const phoneIcon = document.getElementById('phoneIcon');
    const shieldIcon = document.getElementById('shieldIcon');
    const changeNumber = document.getElementById('changeNumber');
    const resendCode = document.getElementById('resendCode');
    const codeInputs = document.querySelectorAll('.code-inputs input');
    const countdownEl = document.getElementById('countdown');

    let sentCode = '';
    let countdownInterval;

    // Toast configuration
    const showToast = (message, type = 'info') => {
        Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "center",
            className: type,
            stopOnFocus: true,
        }).showToast();
    };

    // Start countdown timer
    const startCountdown = () => {
        let timeLeft = 60;
        resendCode.disabled = true;
        
        countdownInterval = setInterval(() => {
            timeLeft--;
            countdownEl.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                resendCode.disabled = false;
                document.getElementById('timer').textContent = 'يمكنك طلب رمز جديد الآن';
            }
        }, 1000);
    };

    // Generate verification code
    const generateCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    // Handle code inputs
    codeInputs.forEach((input, index) => {
        input.addEventListener('keyup', (e) => {
            if (e.key !== 'Backspace' && input.value) {
                if (index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                }
            } else if (e.key === 'Backspace') {
                if (index > 0) {
                    codeInputs[index - 1].focus();
                }
            }
        });

        input.addEventListener('keypress', (e) => {
            if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
            }
        });

        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            if (/^\d+$/.test(paste)) {
                const digits = paste.split('');
                codeInputs.forEach((input, i) => {
                    if (digits[i]) {
                        input.value = digits[i];
                        if (i < codeInputs.length - 1) {
                            codeInputs[i + 1].focus();
                        }
                    }
                });
            }
        });
    });

    // Handle phone number submission
    phoneForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const phoneNumber = document.getElementById('phoneNumber').value;
        
        if (phoneNumber.length === 11) {
            sentCode = generateCode();
            showToast(`تم إرسال رمز التحقق: ${sentCode}`, 'info');
            
            phoneForm.classList.add('hidden');
            codeForm.classList.remove('hidden');
            title.textContent = 'أدخل رمز التحقق';
            subtitle.textContent = 'تم إرسال رمز التحقق إلى هاتفك';
            phoneIcon.classList.add('hidden');
            shieldIcon.classList.remove('hidden');
            
            startCountdown();
            codeInputs[0].focus();
        }
    });

    // Handle verification code submission
    codeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const enteredCode = Array.from(codeInputs).map(input => input.value).join('');
        
        if (enteredCode === sentCode) {
            showToast('تم التحقق بنجاح! 🎉', 'success');
            codeInputs.forEach(input => input.value = '');
        } else {
            showToast('الرمز غير صحيح، حاول مرة أخرى', 'error');
            codeInputs.forEach(input => input.value = '');
            codeInputs[0].focus();
        }
    });

    // Handle resend code
    resendCode.addEventListener('click', () => {
        sentCode = generateCode();
        showToast(`تم إعادة إرسال رمز التحقق: ${sentCode}`, 'info');
        startCountdown();
        codeInputs.forEach(input => input.value = '');
        codeInputs[0].focus();
    });

    // Handle change number button
    changeNumber.addEventListener('click', () => {
        clearInterval(countdownInterval);
        codeForm.classList.add('hidden');
        phoneForm.classList.remove('hidden');
        title.textContent = 'التحقق من رقم الهاتف';
        subtitle.textContent = 'سنرسل لك رمز تحقق على رقم هاتفك';
        shieldIcon.classList.add('hidden');
        phoneIcon.classList.remove('hidden');
        document.getElementById('phoneNumber').value = '';
        codeInputs.forEach(input => input.value = '');
        sentCode = '';
    });
});