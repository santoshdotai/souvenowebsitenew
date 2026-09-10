document.querySelectorAll('.demo-card').forEach((card) => {
  const next = card.querySelector('[data-next]');
  const reset = card.querySelector('[data-reset]');
  const status = card.querySelector('[role="status"]');
  const steps = [...card.querySelectorAll('li')];
  let position = -1;
  next.addEventListener('click', () => {
    card.querySelector('details').open = true;
    position += 1;
    steps.forEach((step, index) => step.classList.toggle('active', index === position));
    if (position < steps.length) {
      status.textContent = `Step ${position + 1} of ${steps.length}: ${steps[position].textContent}`;
      next.textContent = position === steps.length - 1 ? 'Show result' : 'Next step';
    } else {
      status.textContent = `Example complete: ${card.dataset.result}`;
      next.textContent = 'Complete';
      next.disabled = true;
    }
  });
  reset.addEventListener('click', () => {
    position = -1;
    steps.forEach((step) => step.classList.remove('active'));
    status.textContent = 'Ready to walk through this example.';
    next.textContent = 'Start example';
    next.disabled = false;
    card.querySelector('details').open = false;
  });
});
