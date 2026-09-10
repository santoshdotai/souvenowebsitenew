(() => {
  const cards = [...document.querySelectorAll('.workflow-card')];
  const run = document.querySelector('#hero-run');
  const reset = document.querySelector('#hero-reset');
  const status = document.querySelector('#hero-status');
  let timer;
  let stage = -1;
  const messages = ['Enquiry received. Souveno identifies the quantity and requested delivery.', 'Request structured. A quotation draft is prepared for review.', 'Your review is needed. Approve this example to continue.', 'Demo complete. The quotation, CRM task and follow-up are ready.'];
  function show(index) {
    stage = index;
    cards.forEach((card, i) => {
      card.classList.toggle('is-current', i === index);
      card.classList.toggle('is-done', i < index || index === 3);
      card.querySelector('.stage-state').textContent = i < index || index === 3 ? 'Complete' : i === index ? (index === 2 ? 'Needs approval' : 'Processing') : 'Waiting';
    });
    status.textContent = messages[index];
    run.disabled = index < 2;
    run.textContent = index === 2 ? 'Approve example →' : index === 3 ? 'Run again' : 'Running…';
    if (index < 2) timer = setTimeout(() => show(index + 1), 1500);
  }
  run.addEventListener('click', () => {
    clearTimeout(timer);
    show(stage === 2 ? 3 : 0);
  });
  reset.addEventListener('click', () => {
    clearTimeout(timer);
    stage = -1;
    cards.forEach((card, i) => {
      card.classList.remove('is-current', 'is-done');
      card.querySelector('.stage-state').textContent = i === 0 ? 'Ready' : 'Waiting';
    });
    status.textContent = 'See the cards move from enquiry to an approved quotation.';
    run.disabled = false;
    run.textContent = 'Run automation';
  });
})();
