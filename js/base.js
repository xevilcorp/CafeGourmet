document.addEventListener('DOMContentLoaded', function() { 
  let testApi = 'http://localhost:5179/';
  let productionApi = 'https://cafeteriagourmetproj.azurewebsites.net/'
  window.apiUrl = this.location.origin.includes('localhost') ? testApi : productionApi;

  // HTML Import
  document.querySelectorAll('html-import').forEach((el) => {
    fetch(el.getAttribute('link'))
    .then(response => response.text())
    .then(text => el.outerHTML = text)
    .then(() => { 
      checkCart()
      checkLogin() 
    });
  })
})

async function checkLogin() {
  let url = window.apiUrl + 'User/me'
  let headers = { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
  let response = await fetch(url, { method : 'GET', headers, credentials: 'include' })
  if (response.status == 200) {
    let user = await response.json()
    window.user = user
    document.querySelector('#login-btn').style.display = 'none'
    document.querySelector('#my-account').style.display = 'flex'
    if (user.userName.toLowerCase().indexOf('admin') > -1) {
      window.user.admin = true
      document.querySelector('#my-account > img').src = 'assets/img/icon-admin-profile-picture.svg'
      document.querySelector('#my-account .admin-mode').style.display = 'block'
      document.querySelector('#my-account .normal-user-p').style.display = 'none'
    }
  }

  const event = new CustomEvent('loginChecked', {bubbles: true});
  document.dispatchEvent(event)
}

function getParam(name) {
  let url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function checkCart() {
  if (localStorage.getItem('cart')) {
    let cartList = JSON.parse(localStorage.getItem('cart'))
    let totalQuantityCount = cartList.reduce((acc, item) => acc + item.quantity, 0);
    document.getElementById('cart-quantity').innerText = totalQuantityCount;
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}


function getStatusColor(status) {
  switch (status) {
    case 0:
      return 'black'
    case 1:
      return 'green'
    case 2:
      return 'red'
    case 3:
      return 'blue'
    case 4:
      return 'purple'
    default:
      return 'black'
  }
}
function getOrderStatus(status) {
  switch (status) {
    case 0:
      return 'Aguardando'
    case 1:
      return 'Em preparação'
    case 2:
      return 'Cancelado'
    case 3:
      return 'A caminho'
    case 4:
      return 'Entregue'
    default:
      return 'Desconhecido'
  }
}

function getOrderStatusIcon(status) {
  switch (status) {
    case 0:
      return 'assets/img/icon-wait.svg'
    case 1:
      return 'assets/img/icon-check-sm-grey.svg'
    case 2:
      return 'assets/img/icon-cancel.svg'
    case 3:
      return 'assets/img/icon-on-the-way.svg'
    case 4:
      return 'assets/img/icon-check-sm.svg'
    default:
      return 'Desconhecido'
  }
}