import {Question} from './question';
import { createModal, isValid } from './utils';
import { authWithEmailAndPassword, getAuthForm } from './auth';
import './style.css';

const form = document.getElementById('form');
const modalBtn = document.getElementById('modal-btn');
const input= form.querySelector('#question-input');
const submitBtn= form.querySelector('#submit');


window.addEventListener('load', Question.renderList)
form.addEventListener('submit', submitFormHandler)
modalBtn.addEventListener('click', openModal)
input.addEventListener('input', () => {
  submitBtn.disabled = !isValid(input.value)
});

function submitFormHandler(e) {
  e.preventDefault();

  if(isValid(input.value)) {
    const question = {
      text: input.value.trim(),
      date: new Date().toJSON()
    };

    submitBtn.disabled = true;
    Question.create(question).then(function () {
        input.value = ''
        input.className = ''
        submitBtn.disabled = false
      })
  }
};

function openModal() {
  createModal('Autorization', getAuthForm())
  document.getElementById('auth-form')
    .addEventListener('submit', authFormHandle, {once: true})
};

function authFormHandle(e) {
  e.preventDefault();

  const btn = e.target.querySelector('button')
  const email = e.target.querySelector('#email').value
  const password = e.target.querySelector('#password').value

  btn.disabled = true;

  authWithEmailAndPassword(email, password)
    .then(Question.fetch)
    .then(renderModalAfterAuth)
    .then(() => btn.disabled = false)
};

function renderModalAfterAuth(content) {
  if(typeof content === 'string') {
    createModal('Ошыбка!', content)
  } else {
    createModal('Список вопросов', Question.listToHtml(content))
  }
};
