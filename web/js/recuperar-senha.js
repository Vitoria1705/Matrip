document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('forgotPasswordForm');
  const emailInput = document.getElementById('email');
  
  // Seleciona o botão de submit do formulário
  const btnSubmit = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    // Evita que a página recarregue ao enviar o formulário
    e.preventDefault();

    // 1. Validação visual nativa do HTML/CSS (adiciona as bordas verdes/vermelhas)
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    // 2. Captura o e-mail
    const email = emailInput.value;

    // 3. Feedback visual: Muda o texto do botão e desativa para evitar duplo clique
    const textoOriginal = btnSubmit.innerHTML;
    btnSubmit.innerHTML = 'Enviando link...';
    btnSubmit.disabled = true;

    try {
      // 4. A COMUNICAÇÃO COM O SEU BACKEND (API)
      // Aqui você vai colocar a URL do seu servidor que vai receber esse e-mail
      const response = await fetch('http://localhost:3000/api/recuperar-senha', {
        method: 'POST', // Método de envio
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }) // Mandamos o e-mail no formato JSON
      });

      // Lemos a resposta do servidor
      const data = await response.json();

      if (response.ok) {
        // SUCCESSO! O servidor respondeu bem.
        // Dica de segurança: Nunca diga se o e-mail existe ou não na base. 
        // Diga apenas que "se existir, o link foi enviado".
        alert('Se o e-mail estiver cadastrado, você receberá um link de recuperação em instantes!');
        
        // Limpa o formulário
        form.reset();
        form.classList.remove('was-validated');
      } else {
        // ERRO do servidor (ex: muitos pedidos, erro interno, etc.)
        alert(data.message || 'Ocorreu um erro. Tente novamente mais tarde.');
      }

    } catch (error) {
      // ERRO DE REDE (ex: servidor fora do ar, sem internet)
      console.error('Erro na requisição:', error);
      alert('Erro de conexão com o servidor. Verifique sua internet ou tente mais tarde.');
    } finally {
      // 5. Devolve o botão ao estado normal
      btnSubmit.innerHTML = textoOriginal;
      btnSubmit.disabled = false;
    }
  });
});