
function toggleMenu(){
  const nav = document.getElementById('navLinks');
  if(nav){ nav.classList.toggle('open'); }
}

(function(){
  const storageKey = 'agclsQuoteCart';

  function loadCart(){
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); }
    catch(e){ return []; }
  }
  function saveCart(cart){ localStorage.setItem(storageKey, JSON.stringify(cart)); }
  function itemKey(item){ return [item.name,item.category].join('||'); }
  function addItem(item){
    const cart = loadCart();
    if (!cart.some(entry => itemKey(entry) === itemKey(item))) {
      cart.push(item);
      saveCart(cart);
    }
    renderCart();
  }
  function removeItem(key){
    const cart = loadCart().filter(entry => itemKey(entry) !== key);
    saveCart(cart);
    renderCart();
  }
  function clearCart(){ saveCart([]); renderCart(); }

  function cartMarkup(cart){
    if (!cart.length) return '<p class="quote-list-empty">No items selected yet. Add items from any product category to build a quote request.</p>';
    return '<ol class="quote-list">' + cart.map(item => '<li><strong>' + item.name + '</strong>' + (item.category ? ' <span style="color:#64748b">(' + item.category + ')</span>' : '') + '</li>').join('') + '</ol>';
  }

  function renderCart(){
    const cart = loadCart();
    document.querySelectorAll('[data-quote-count]').forEach(el => el.textContent = cart.length);
    document.querySelectorAll('[data-quote-list]').forEach(el => el.innerHTML = cartMarkup(cart));
    document.querySelectorAll('[data-quote-summary]').forEach(el => {
      el.value = cart.map(item => '- ' + item.name + (item.category ? ' (' + item.category + ')' : '')).join('
');
    });
    document.querySelectorAll('[data-quote-json]').forEach(el => {
      el.value = cart.map(item => item.name + (item.category ? ' | ' + item.category : '')).join('; ');
    });
    document.querySelectorAll('[data-clear-quote]').forEach(btn => {
      btn.style.display = cart.length ? 'inline-flex' : 'none';
      btn.onclick = function(){ clearCart(); };
    });
  }

  document.addEventListener('click', function(e){
    const addBtn = e.target.closest('[data-add-quote]');
    if (addBtn) {
      addItem({name:addBtn.getAttribute('data-name')||'', category:addBtn.getAttribute('data-category')||''});
      addBtn.textContent = 'Added to Quote List';
      setTimeout(() => { addBtn.textContent = addBtn.getAttribute('data-default-label') || 'Add to Quote List'; }, 1400);
    }
    const removeBtn = e.target.closest('[data-remove-quote]');
    if (removeBtn) {
      removeItem(removeBtn.getAttribute('data-remove-quote'));
    }
  });

  document.addEventListener('DOMContentLoaded', function(){
    renderCart();
    const quoteForm = document.getElementById('quoteRequestForm');
    if (quoteForm) {
      const companyField = document.getElementById('quoteCompanyField');
      const subjectField = document.getElementById('quoteSubjectField');
      const selectedField = document.getElementById('selectedItemsField');
      function updateSubject(){
        const company = companyField && companyField.value.trim();
        subjectField.value = company ? 'Product quote request - ' + company + ' - Chromatograph Services' : 'Product quote request - Chromatograph Services';
      }
      if (companyField && subjectField) {
        companyField.addEventListener('input', updateSubject);
        updateSubject();
      }
      quoteForm.addEventListener('submit', function(e){
        const cart = loadCart();
        if (!cart.length) {
          e.preventDefault();
          alert('Please add at least one product to the quote list before sending the enquiry.');
          return;
        }
        if (selectedField) {
          selectedField.value = cart.map(item => '- ' + item.name + (item.category ? ' (' + item.category + ')' : '')).join('
');
        }
      });
    }
  });
})();
