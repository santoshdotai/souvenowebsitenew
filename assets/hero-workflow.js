document.querySelectorAll('[data-workflow]').forEach((flow) => {
  const cards = [...flow.querySelectorAll('.workflow-card')];
  const run = flow.querySelector('[data-run]');
  const reset = flow.querySelector('[data-reset]');
  const status = flow.querySelector('[role="status"]');
  const initial = status.textContent;
  let timer;
  function show(index) {
    const finished = index === cards.length - 1;
    flow.dataset.stage = String(index);
    cards.forEach((card, i) => {
      card.classList.toggle('is-current', i === index);
      card.classList.toggle('is-done', i < index || finished);
      card.querySelector('.stage-state').textContent = i < index || finished ? 'Complete' : i === index ? 'Processing' : 'Waiting';
    });
    status.textContent = cards[index].dataset.message;
    run.disabled = !finished;
    run.textContent = finished ? 'Run again' : 'Running…';
    if (!finished) timer = setTimeout(() => show(index + 1), 1600);
  }
  run.addEventListener('click', () => { clearTimeout(timer); show(0); });
  reset.addEventListener('click', () => {
    clearTimeout(timer);
    delete flow.dataset.stage;
    cards.forEach((card, i) => {
      card.classList.remove('is-current', 'is-done');
      card.querySelector('.stage-state').textContent = i === 0 ? 'Ready' : 'Waiting';
    });
    status.textContent = initial;
    run.disabled = false;
    run.textContent = 'Run automation';
  });
});
