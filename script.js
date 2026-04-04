const phoneNumber = '5541984597071';
const productCards = [...document.querySelectorAll('.product-card')];
const orderSummary = document.querySelector('#order-summary');
const form = document.querySelector('#order-form');

function getSelectedItems() {
  return productCards
    .map((card) => {
      const quantity = Number(card.querySelector('.quantity-input').value || 0);
      return {
        name: card.dataset.name,
        price: Number(card.dataset.price),
        quantity,
      };
    })
    .filter((item) => item.quantity > 0);
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function updateSummary() {
  const items = getSelectedItems();

  if (!items.length) {
    orderSummary.innerHTML = `
      <h3>Resumo do pedido</h3>
      <p>Selecione as quantidades no cardápio para montar seu pedido.</p>
    `;
    return;
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const list = items
    .map(
      (item) =>
        `<li>${item.quantity}x ${item.name} — ${formatCurrency(item.price * item.quantity)}</li>`
    )
    .join('');

  orderSummary.innerHTML = `
    <h3>Resumo do pedido</h3>
    <ul>${list}</ul>
    <p><strong>Total estimado:</strong> ${formatCurrency(total)}</p>
  `;
}

productCards.forEach((card) => {
  card.querySelector('.quantity-input').addEventListener('input', updateSummary);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const items = getSelectedItems();
  if (!items.length) {
    window.alert('Selecione pelo menos um produto antes de enviar o pedido.');
    return;
  }

  const formData = new FormData(form);
  const payment = formData.get('payment');
  const notes = String(formData.get('notes') || '').trim();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const lines = [
    'Olá, TykaYurt! Gostaria de fazer o seguinte pedido:',
    '',
    ...items.map(
      (item) => `- ${item.quantity}x ${item.name} (${formatCurrency(item.price * item.quantity)})`
    ),
    '',
    `Total estimado: ${formatCurrency(total)}`,
    '',
    `Nome: ${formData.get('name')}`,
    `Telefone: ${formData.get('phone')}`,
    `Endereço: ${formData.get('address')}`,
    `Pagamento: ${payment}`,
    `Observações: ${notes || 'Nenhuma.'}`,
  ];

  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
  window.open(url, '_blank', 'noopener');
});

updateSummary();
