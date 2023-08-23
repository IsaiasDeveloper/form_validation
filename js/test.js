function allEventsPage() {
  try {
    const testContant = document.querySelector('.testContant');
    const storedData = JSON.parse(localStorage.getItem('formData'));
    testContant.innerHTML = `
    <h2>Informações obtidas através do LocalStorage</h2>
    <p>Confira:</p><br>
    <p class="confirmationText"><b>Nome: </b>${storedData.name}</p>
    <p class="confirmationText"><b>RG: </b>${storedData.rg}</p>
    <p class="confirmationText"><b>E-mail: </b>${storedData.email}</p>
    <p class="confirmationText"><b>Telefone: </b>${storedData.phoneNumber}</p>
    <p class="confirmationText"><b>CEP: </b>${storedData.postalCode}</p>
    <p class="confirmationText"><b>Rua: </b>${storedData.street}</p>
    <p class="confirmationText"><b>Número: </b>${storedData.homeNumber}</p>
    <p class="confirmationText"><b>Complemento: </b>${storedData.complement}</p>
    <p class="confirmationText"><b>Bairro: </b>${storedData.neighborhood}</p>
    <p class="confirmationText"><b>UF: </b>${storedData.state}</p>
    <p class="confirmationText"><b>Cidade: </b>${storedData.city}</p>
    `;
    console.log(storedData);
  } catch (er) {
    console.warn(er);
  }
}
allEventsPage();
