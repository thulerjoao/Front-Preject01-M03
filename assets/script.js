// const response = await fetch(`${baseURL}/all-jordans`);

const baseUrl = 'http://localhost:3000/jordans';
const msgAlert = document.querySelector(".msg-alert")

async function findAllJordans() {
  const response = await fetch(`${baseUrl}/all-jordans`);
  const jordans = await response.json();

  jordans.forEach((element) => {
    document.getElementById('main02').insertAdjacentHTML(
      'beforeend',
      `<div class="card" id="JordanListaItem${element._id}">
          <img src="${element.foto}" alt="imagem do produto">
          <p class="modelo">${element.modelo}</p>
          <p class="descricao">${element.descricao}</p>
          <p class="preco">R$ ${element.preco.toFixed(2)}</p>
            <div class="botoesDelEdit">
              <button id="btnEditar" onclick="abrirModal('${element._id}')">Editar</button> 
              <button id="btnApagar" onclick="abrirModalDelete('${element._id}')">Excluir</button> 
            </div>
          </div>`,
    );
  });
}

findAllJordans();

async function findByIdJordan() {
  const id = document.querySelector('#idJordan').value;
  const response = await fetch(`${baseUrl}/one-jordan/${id}`);
  const jordan = await response.json();

  if(jordan.message != undefined){
    localStorage.setItem('message', "Digite um ID Válido para Pesquisar");
    localStorage.setItem('type', "fail")
    msgAlert.innerText = localStorage.getItem("message");
    msgAlert.classList.add(localStorage.getItem("type"));
    showMessageAlert();
  }

  const jordanEscolhidoDiv = document.querySelector('#resultadoBusca');
  jordanEscolhidoDiv.innerHTML = `<section id="buscaPeloJordan">
    <h3>Resultado da Busca:</h3>
    <div class="card" id="JordanListaItem${jordan._id}">
    <img src="${jordan.foto}" alt="imagem do produto">
    <p class="modelo">${jordan.modelo}</p>
    <p class="descricao">${jordan.descricao}</p>
    <p class="preco">R$ ${jordan.preco.toFixed(2)}</p>
    <div class="botoesDelEdit">
              <button id="btnEditar" onclick="abrirModal('${jordan._id}')">Editar</button> 
              <button id="btnApagar" onclick="abrirModalDelete('${jordan._id}')">Excluir</button>
              <button id="btnMinimizar" onclick="minimizar()">Minimizar</button>
            </div>
    </div></section>`;
}

async function abrirModal(id = "") {
  if (id != "") {
    document.querySelector('#titleModal').innerText = 'Atualizar Jordan';
    document.querySelector('#btnModal').innerText = 'Atualizar';
    const response = await fetch(`${baseUrl}/one-jordan/${id}`);
    const jordan = await response.json();
    document.querySelector('#id').value = jordan._id;
    document.querySelector('#modelo').value = jordan.modelo;
    document.querySelector('#preco').value = jordan.preco;
    document.querySelector('#descricao').value = jordan.descricao;
    document.querySelector('#foto').value = jordan.foto;
  } else {
    document.querySelector('#titleModal').innerText = 'Cadastrar novo Jordan';
    document.querySelector('#btnModal').innerText = 'Cadastrar';
  }
  document.querySelector('#overlay').style.display = 'flex';
}

function fecharModal() {
  document.querySelector('.modal-overlay').style.display = 'none';
  document.querySelector('#modelo').value = '';
  document.querySelector('#preco').value = 0;
  document.querySelector('#descricao').value = '';
  document.querySelector('#foto').value = '';
}

async function submitJordan() {
  let id = document.querySelector('#id').value;
  let modelo = document.querySelector('#modelo').value;
  let preco = document.querySelector('#preco').value;
  let descricao = document.querySelector('#descricao').value;
  let foto = document.querySelector('#foto').value;

  const jordan = {
    modelo,
    preco,
    descricao,
    foto,
  };

  const existentId = id != "";
  const endPoint = baseUrl + (existentId ? `/update-jordan/${id}` : `/create-jordan`);

  const responde = await fetch(endPoint, {
    method: existentId ? `put` : `post`,
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    body: JSON.stringify(jordan),
  });
  const newJordan = await responde.json();
  
  // localStorage.setItem('message', "Digite um ID Válido para Pesquisar");
  //   localStorage.setItem('type', "fail")
  //   msgAlert.innerText = localStorage.getItem("message");
  //   msgAlert.classList.add(localStorage.getItem("type"));

  if(newJordan.message != undefined){
    localStorage.setItem("message", newJordan.message);
    localStorage.setItem('type', "fail")
    msgAlert.innerText = localStorage.getItem("message");
    msgAlert.classList.add(localStorage.getItem("type"));
    document.querySelector('#messages').style.display = 'flex';
    setTimeout(function () {
      document.querySelector('#messages').style.display = 'none';
      msgAlert.classList.remove(localStorage.getItem("type"));
    },4000);
  document.querySelector('.msg-alert').insertAdjacentElement(message);  
    return;
  }

  if(existentId){
    localStorage.setItem("message", "Jordan Atualizado com Sucesso!");
    localStorage.setItem('type', "success")

    msgAlert.innerText = localStorage.getItem("message");
    msgAlert.classList.add(localStorage.getItem("type"));
    
    fecharModal();
    document.querySelector('#messages').style.display = 'flex';
    setTimeout(function () {
      document.querySelector('#messages').style.display = 'none';
      msgAlert.classList.remove(localStorage.getItem("type"));
      document.location.reload(true);
    },4000);
  document.querySelector('.msg-alert').insertAdjacentElement(message);
    
  }else{
    localStorage.setItem("message", "Jordan Cadastrado com Sucesso!");
    localStorage.setItem('type', "success")

    msgAlert.innerText = localStorage.getItem("message");
    msgAlert.classList.add(localStorage.getItem("type"));
    
    fecharModal();
    document.querySelector('#messages').style.display = 'flex';
    setTimeout(function () {
      document.querySelector('#messages').style.display = 'none';
      msgAlert.classList.remove(localStorage.getItem("type"));
      document.location.reload(true);
    },4000);
  document.querySelector('.msg-alert').insertAdjacentElement(message); 
  }

  
  

  foto = '';
  modelo = '';
  descricao = '';
  preco = '';

  fecharModal();
}

function abrirModalDelete(id) {
  document.querySelector('#overlayDelete').style.display = 'flex';
  const confirmar = document.querySelector('#btnConfirmar');
  confirmar.addEventListener('click', function () {
    deleteJordan(id);
  });
}
function fecharModalDelete() {
  document.querySelector('#overlayDelete').style.display = 'none';
}

async function deleteJordan(id) {
  const response = await fetch(`${baseUrl}/delete-jordan/${id}`, {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  });

  localStorage.setItem("message", "Jordan Excluído com Sucesso.");
    localStorage.setItem('type', "success")

    msgAlert.innerText = localStorage.getItem("message");
    msgAlert.classList.add(localStorage.getItem("type"));
    
    fecharModalDelete();
    document.querySelector('#messages').style.display = 'flex';
    setTimeout(function () {
      document.querySelector('#messages').style.display = 'none';
      msgAlert.classList.remove(localStorage.getItem("type"));
      document.location.reload(true);
    },4000);
  document.querySelector('.msg-alert').insertAdjacentElement(message);

}

function minimizar() {
  document.querySelector('#buscaPeloJordan').style.display = 'none';
}

function showMessageAlert() {
  document.querySelector('#messages').style.display = 'flex';
  setTimeout(function () {document.querySelector('#messages').style.display = 'none';
  // msgAlert.innerText = "";
  msgAlert.classList.remove(localStorage.getItem("type"));
  // localStorage.clear();
  },4000);
  document.querySelector('.msg-alert').insertAdjacentElement(message);
}

