// const {response} = import("express")

const baseUrl = 'http://localhost:3000/jordans';

async function findAllJordans() {
  const response = await fetch(`${baseUrl}/todos`);
  const jordans = await response.json();

  jordans.forEach((element) => {
    document.getElementById('main02').insertAdjacentHTML(
      'beforeend',
      `<div class="card" id="JordanListaItem${element.id}">
          <img src="${element.foto}" alt="imagem do produto">
          <p class="modelo">${element.modelo}</p>
          <p class="descricao">${element.descricao}</p>
          <p class="preco">R$ ${element.preco}</p>
            <div class="botoesDelEdit">
              <button id="btnEditar" onclick="abrirModal(${element.id})">Editar</button> 
              <button id="btnApagar" onclick="abrirModalDelete(${element.id})">Excluir</button> 
            </div>
          </div>`,
    );
  });
}

findAllJordans();

async function findByIdJordan() {
  const id = document.querySelector('#idJordan').value;
  const response = await fetch(`${baseUrl}/jordan/${id}`);
  const jordan = await response.json();

  const jordanEscolhidoDiv = document.querySelector('#resultadoBusca');
  jordanEscolhidoDiv.innerHTML = `<section id="buscaPeloJordan">
    <h3>Resultado da Busca:</h3>
    <div class="card" id="JordanListaItem${jordan.id}">
    <img src="${jordan.foto}" alt="imagem do produto">
    <p class="modelo">${jordan.modelo}</p>
    <p class="descricao">${jordan.descricao}</p>
    <p class="preco">R$ ${jordan.preco}</p>
    <div class="botoesDelEdit">
              <button id="btnEditar" onclick="abrirModal(${jordan.id})">Editar</button> 
              <button id="btnApagar" onclick="abrirModalDelete(${jordan.id})">Excluir</button>
              <button id="btnMinimizar" onclick="minimizar()">Minimizar</button>
            </div>
    </div></section>`;
}

async function abrirModal(id = null) {
  if (id != null) {
    document.querySelector('#titleModal').innerText = 'Atualizar Jordan';
    document.querySelector('#btnModal').innerText = 'Atualizar';
    const response = await fetch(`${baseUrl}/jordan/${id}`);
    const jordan = await response.json();
    document.querySelector('#id').value = jordan.id;
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

async function createJordan() {
  let id = document.querySelector('#id').value;
  let modelo = document.querySelector('#modelo').value;
  let preco = document.querySelector('#preco').value;
  let descricao = document.querySelector('#descricao').value;
  let foto = document.querySelector('#foto').value;

  const jordan = {
    id,
    modelo,
    preco,
    descricao,
    foto,
  };

  const idExistente = id > 0;
  const endPoint = baseUrl + (idExistente ? `/update/${id}` : `/create`);

  const responde = await fetch(endPoint, {
    method: idExistente ? `put` : `post`,
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    body: JSON.stringify(jordan),
  });
  const novoJordan = await responde.json();

  const html = `<div class="card" id="JordanListaItem${novoJordan.id}">
      <img src="${novoJordan.foto}" alt="imagem do produto">
      <p class="modelo">${novoJordan.modelo}</p>
      <p class="descricao">${novoJordan.descricao}</p>
      <p class="preco">R$ ${novoJordan.preco}</p>
      <div class="botoesDelEdit">
              <button id="btnEditar" onclick="abrirModal(${novoJordan.id})">Editar</button> 
              <button id="btnApagar" onclick="abrirModalDelete(${novoJordan.id})">Excluir</button> 
            </div>
    </div>`;
  if (idExistente) {
    document.querySelector(`#JordanListaItem${id}`).outerHTML = html;
  } else {
    document.querySelector('#main02').insertAdjacentHTML('beforeend', html);
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
  const response = await fetch(`${baseUrl}/delete/${id}`, {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  });

  document.getElementById('main02').innerHTML = '';
  fecharModalDelete();
  findAllJordans();
  document.location.reload(true);
  console.log(id);
}

function minimizar() {
  document.querySelector('#buscaPeloJordan').style.display = 'none';
}
