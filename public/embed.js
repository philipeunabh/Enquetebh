const renderPoll = (poll, container) => {
  let content = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
      .enquetes-bh-embed-wrapper {
        font-family: 'Inter', sans-serif;
        border: 1px solid #e5e7eb;
        border-radius: 1rem;
        padding: 1.5rem;
        background: #fff;
        max-width: 400px;
        margin: 1rem auto;
      }
      .enquetes-bh-embed-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 1rem;
      }
      .enquetes-bh-embed-option {
        display: block;
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        margin-bottom: 0.5rem;
        text-align: left;
        cursor: pointer;
        background: #f9fafb;
        color: #374151;
      }
      .enquetes-bh-embed-option:hover {
        background: #f3f4f6;
      }
      .enquetes-bh-embed-footer {
        margin-top: 1rem;
        text-align: center;
        font-size: 0.75rem;
      }
      .enquetes-bh-embed-footer a {
        color: #10b981;
        text-decoration: none;
      }
    </style>
    <div class="enquetes-bh-embed-wrapper">
      <h3 class="enquetes-bh-embed-title">${poll.title}</h3>
  `;

  poll.options.forEach(opt => {
    content += `<button class="enquetes-bh-embed-option">${opt.label}</button>`;
  });

  content += `
      <div class="enquetes-bh-embed-footer">
        Powered by <a href="${window.location.origin}" target="_blank">Enquetes BH</a>
      </div>
    </div>
  `;

  container.innerHTML = content;
};

(async () => {
  const params = new URLSearchParams(document.currentScript.src.split('?')[1]);
  const pollId = params.get('pollId');
  const container = document.getElementById(`enquetes-bh-embed-${pollId}`);

  if (pollId && container) {
    try {
      const res = await fetch(`${window.location.origin}/api/polls/${pollId}`);
      const poll = await res.json();
      renderPoll(poll, container);
    } catch (e) {
      container.innerHTML = 'Erro ao carregar enquete.';
    }
  }
})();
