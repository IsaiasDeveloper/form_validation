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
          if (!getAddressWithCep()) {
            createErrorMsg(field, label);
            return (valid = false);
          }
        }
        if (field.classList.contains('homeNumber')) {
          if (!validateHomeNumber(field)) {
            createErrorMsg(field, label);
            return;
          }
        }

        field.classList.remove('fieldError');
        field.blur();
      }

      return true;
    }

    valitationFields();

    if (!valitationFields()) {
      return;
    }
    alert('Dados validados com sucesso!');
    cleanFields();
  });

function cleanFields() {
  const inputList = [...document.querySelectorAll('input')];
  inputList.forEach((e) => {
    e.classList.remove('fieldError');
    e.value = '';
    console.log(e.value);
  });
}

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
    field.classList.add('fieldError');
    field.focus();
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

function validateHomeNumber(field) {
  const homeNumber = document.querySelector('#homeNumber');
  var regex = /^\d+$/;
  regex.test(homeNumber.value);
  if (!regex.test(homeNumber.value)) {
    // let label = 'Número';
    // createErrorMsg(field, label); O "CEP" digitado não existe!
    errorMsg.innerHTML = 'cep falso';
    document.getElementById('postalCode').classList.add('fieldError');
    document.getElementById('postalCode').focus();
    return false;
  }
  document.getElementById('postalCode').classList.remove('fieldError');
  document.getElementById('postalCode').blur();
  errorMsg.innerHTML = '';
  return true;
}

//Blur events functions
function blurAllField(event) {
  const form = document.querySelector('.registre-form');
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
    /*
    ACREDITO QUE NÃO ESTÁ LIMPANDO OS CAMPOS DEVIDO A ESSA CHAMANA.
    */
    getAddressWithCep();
  } else if (field.type === 'text' && field.name === 'homeNumber') {
    validateHomeNumber(field);
  }
}

//Search address
function searcheAddress(cep) {
  const xhr = new XMLHttpRequest();
  const url = 'https://viacep.com.br/ws/' + cep + '/json/';
  xhr.open('GET', url, true);
  xhr.onload = function () {
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200) {
        const dados = JSON.parse(xhr.responseText);

        if (dados.erro) {
          errorMsg.innerHTML = 'O "CEP" digitado não existe!';
          document.getElementById('postalCode').classList.add('fieldError');
          document.getElementById('postalCode').focus();
        } else {
          const streetInput = document.getElementById('street');
          const neighborhoodInput = document.getElementById('neighborhood');
          const cityInput = document.getElementById('city');
          const stateInput = document.getElementById('state');

          streetInput.value = dados.logradouro || '';
          neighborhoodInput.value = dados.bairro || '';
          cityInput.value = dados.localidade || '';
          stateInput.value = dados.uf || '';

          streetInput.disabled = true;
          neighborhoodInput.disabled = true;
          cityInput.disabled = true;
          stateInput.disabled = true;

          errorMsg.innerHTML = '';
        }
      } else {
        errorMsg.innerHTML =
          'Ocorreu um erro. Por favor, busque pelo "CEP" novamente.';
      }
    }
  };

  xhr.send();
}

document
  .querySelector('.completeAddress')
  .addEventListener('click', getAddressWithCep);

function getAddressWithCep() {
  let cepInput = document.getElementById('postalCode').value;
  let errorMsg = document.querySelector('.erroMsg');
  if (cepInput.length === 0) {
    errorMsg.innerHTML = '';
    errorMsg.innerHTML = 'O "CEP" não pode ficar vázio!';
    document.getElementById('postalCode').classList.add('fieldError');
    document.getElementById('postalCode').focus();
    return false;
  }
  if (cepInput.length < 8 || cepInput.length === '') {
    errorMsg.innerHTML = '';
    errorMsg.innerHTML = '"CEP" inválido!';
    document.getElementById('postalCode').classList.add('fieldError');
    document.getElementById('postalCode').focus();
    return false;
  }
  const rawValue = cepInput.replace(/[^\d]/g, '');
  const formattedValue = rawValue.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2-$3');
  document.getElementById('postalCode').value = formattedValue;

  let cep = rawValue;
  searcheAddress(cep);
  document.getElementById('postalCode').classList.remove('fieldError');
  document.getElementById('postalCode').blur();
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
  field.classList.add('fieldError');
  field.focus();
  return;
}

// Remover o "focus()" quando for clicado fora do campo do formulário
const formElement = document.querySelector('.registre-form');
const inputFields = formElement.querySelectorAll('input');
function removeFocus() {
  inputFields.forEach((input) => {
    input.blur();
  });
}
document.addEventListener('clcik', function (event) {
  const elClk = event.target;
  if (!formElement.contains(elClk)) {
    removeFocus();
    console.log('Clicou!');
  }
});
