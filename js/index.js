let errorMsg = document.querySelector('.erroMsg');
document
  .querySelector('.registre-form')
  .addEventListener('submit', function (event) {
    event.preventDefault();
    let registreForm = document.querySelector('.registre-form');

    function valitationFields() {
      let valid = true;
      for (let field of registreForm.querySelectorAll('.required')) {
        const label =
          field.previousElementSibling &&
          field.previousElementSibling.innerText;
        // if (!field.value) {
        //   errorMsg.innerHTML = '';
        //   errorMsg.innerHTML = `O "${label}" precisa ser preenchido.`;
        //   valid = false;
        //   return;
        // }
        if (field.classList.contains('name')) {
          if (!validateName(field)) {
            createErrorMsg(field, label);
            field.classList.add('fieldError');
            field.focus();
            return (valid = false);
          }
        }
        if (field.classList.contains('rg')) {
          if (!validateRG(field)) {
            createErrorMsg(field, label);
            return (valid = false);
          }
        }
        if (field.classList.contains('email')) {
          if (!validateEmail(field)) {
            createErrorMsg(field, label);
            return (valid = false);
          }
        }
        if (field.classList.contains('phoneNumber')) {
          if (!validatePhoneNumber(field)) {
            createErrorMsg(field, label);
            return (valid = false);
          }
        }
        if (field.classList.contains('postalCode')) {
          let cep = field.value;
          if (!getAddressWithCep()) {
            createErrorMsg(field, label);
            return false;
          }
        }
        field.classList.remove('fieldError');
        field.blur();
      }
      return true;
    }

    valitationFields();
    // document.querySelector('.completeAddress').click();
    valitationFields()
      ? console.log('Todos os campos validados com sucesso!')
      : console.log('Há campos invãlidos!');
  });
function validateName(field) {
  const name = field.value;
  const nameRegex = /^[a-zA-ZÀ-ÿ]+(([',. -][a-zA-ZÀ-ÿ ])?[a-zA-ZÀ-ÿ]*)*$/;
  if (!nameRegex.test(name)) {
    let label = 'Nome';
    createErrorMsg(field, label);
    field.classList.add('fieldError');
    field.focus();
    return false;
  } else if (name.length < 5) {
    errorMsg.innerHTML = '';
    errorMsg.innerHTML = `O campo "Nome" precisa ter mais de 5 caracteres.`;
    field.classList.add('fieldError');
    field.focus();
    return false;
  }
  field.classList.remove('fieldError');
  field.blur();
  errorMsg.innerHTML = '';
  return true;
}

function validateRG(field) {
  const rgInput = field.value;
  let rg = rgInput.replace(/\D/g, '');
  if (rg.length < 6) {
    errorMsg.innerHTML = '';
    errorMsg.innerHTML = `O campos "RG" deve ter mais de 6 dígitos`;
    valid = false;
    field.classList.add('fieldError');
    field.focus();
    return;
  }
  const formattedValue = rg.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{1})$/,
    '$1.$2.$3-$4'
  );
  document.getElementById('rg').value = formattedValue;
  field.classList.remove('fieldError');
  field.blur();
  errorMsg.innerHTML = '';
  return true;
}

function validateEmail(field) {
  const email = field.value;
  let valid = true;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    let label = 'Email';
    createErrorMsg(field, label);
    field.classList.add('fieldError');
    field.focus();
    valid = false;
    return false;
  }
  field.classList.remove('fieldError');
  field.blur();
  errorMsg.innerHTML = '';
  return true;
}

function validatePhoneNumber(field) {
  const phoneNumber = field.value.replace(/\D/g, '');
  if (/[^\d\s()-]/.test(field.value)) {
    let label = 'Telefone';
    createErrorMsg(field, label);
    return false;
  }
  const ddd = phoneNumber.substring(0, 2);
  const bodyPhone = phoneNumber.substring(2, phoneNumber.length);
  let phoneFormated;
  if (bodyPhone.length === 9) {
    phoneFormated = bodyPhone.replace(/^(\d{5})(\d{4})/, '$1-$2');
  } else if (bodyPhone.length === 8) {
    phoneFormated = bodyPhone.replace(/^(\d{4})(\d{4})/, '$1-$2');
  } else {
    errorMsg.innerHTML = '';
    errorMsg.innerHTML =
      'O campos "Telefone" precisa conter de 8 a 9 dígitos + o DDD.';
    field.classList.add('fieldError');
    field.focus();
    return false;
  }
  document.getElementById('phoneNumber').value = `(${ddd}) ${phoneFormated}`;
  field.classList.remove('fieldError');
  field.blur();
  return true;
}

//Blur events functions
function blurAllField(event) {
  const form = document.querySelector('.registre-form');
  // for (let erroText of form.querySelectorAll('.error-text')) {
  //   erroText.remove();
  // }
  const field = event.target;
  if (field.type === 'text' && field.name === 'name') {
    validateName(field);
  } else if (field.type === 'email' && field.name === 'email') {
    validateEmail(field);
  } else if (field.type === 'text' && field.name === 'rg') {
    validateRG(field);
  } else if (field.type === 'text' && field.name === 'phoneNumber') {
    validatePhoneNumber(field);
  } else if (field.type === 'text' && field.name === 'postalCode') {
    // document.querySelector('.completeAddress').click();
    getAddressWithCep(field);
  } else if (field.type === 'number' && field.name === 'number') {
    for (let erroText of form.querySelectorAll('.error-text')) {
      erroText.remove();
    }
  }
}

//Search address
function searcheAddress(cep) {
  let cepInput = document.getElementById('cep');
  const xhr = new XMLHttpRequest();
  const url = 'https://viacep.com.br/ws/' + cep + '/json/';
  xhr.open('GET', url, true);

  xhr.onload = function () {
    if (xhr.readyState === xhr.DONE && xhr.status === 200) {
      const dados = JSON.parse(xhr.responseText);

      document.getElementById('street').value = dados.logradouro;
      document.getElementById('neighborhood').value = dados.bairro;
      document.getElementById('city').value = dados.localidade;
      document.getElementById('state').value = dados.uf;
    } else {
      const span = document.createElement('span');
      span.innerHTML = 'CEP Inválido!';
      span.classList.add('error-text');
      cepInput.insertAdjacentElement('afterend', span);
      return false;
    }
  };

  xhr.send();
  return true;
}

document
  .querySelector('.completeAddress')
  .addEventListener('click', getAddressWithCep);

function getAddressWithCep(field) {
  let cepInput = document.getElementById('postalCode').value;
  let errorMsg = document.querySelector('.erroMsg');
  if (cepInput.length < 8 || cepInput.length === '') {
    errorMsg.innerHTML = '';
    errorMsg.innerHTML = 'CEP inválido!';
    field.classList.add('fieldError');
    field.focus();
    return false;
  }
  const rawValue = cepInput.replace(/[^\d]/g, '');
  const formattedValue = rawValue.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2-$3');
  document.getElementById('postalCode').value = formattedValue;

  let cep = rawValue;
  searcheAddress(cep);
  field.classList.remove('fieldError');
  field.blur();
  return true;
}

function createErrorMsg(field, label) {
  if (field.value === '') {
    errorMsg.innerHTML = '';
    errorMsg.innerHTML = `O campo "${label}" não pode ficar vázio!`;
  } else {
    errorMsg.innerHTML = '';
    errorMsg.innerHTML = `O campo "${label}" é inválido!`;
  }
}
