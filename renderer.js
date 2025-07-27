const { clipboard, ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', async () => {
  const formArea = document.getElementById('formArea');
  const clearBtn = document.getElementById('clearFooter');
  const copyBtn = document.getElementById('copyFooter');
  const messages = await ipcRenderer.invoke('load-messages');
  const footerInput = document.getElementById('footerInput');
  const charCount = document.getElementById('charCount');
  const autoResize = (el) => {
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  for (let i = 0; i < 20; i++) {
    const wrapper = document.createElement('div');
    wrapper.className = 'flex items-start border-b border-gray-200 bg-white pl-2';
    const number = document.createElement('span');
    number.textContent = `${i + 1}.`;
    number.className = 'w-6 text-sm text-gray-500 mt-1';
    const input = document.createElement('textarea');
    input.rows = 1;
    input.value = messages[i] || '';
    input.className = `
      flex-grow h-full mt-1
      text-[10px] px-2 py-1
      border border-transparent
      resize-none
      min-h-[25px] max-h-[300px] overflow-y-auto
      focus:outline-none focus:ring-0
      bg-transparent
      scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100
    `.trim();

    const copyBtn = document.createElement('button');
    copyBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600 hover:text-black" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5h6m-6 0a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2m-6 0V3h6v2" />
      </svg>`;
    copyBtn.className = 'p-2 hover:bg-gray-100 rounded';
    const insertBtn = document.createElement('button');
    insertBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600 hover:text-green-800" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
    </svg>`;
    insertBtn.className = 'p-2 hover:bg-green-50 rounded';

    // EventListeners for input forms
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = `${input.scrollHeight}px`;
      messages[i] = input.value;
      ipcRenderer.send('save-messages', messages);
    });
    copyBtn.addEventListener('click', () => {
      clipboard.writeText(input.value);
    });
    insertBtn.addEventListener('click', () => {
      footerInput.value += input.value;
      autoResize(footerInput);
      charCount.textContent = `${footerInput.value.length} 文字`;
    });
    wrapper.appendChild(number);
    wrapper.appendChild(input);
    wrapper.appendChild(copyBtn);
    wrapper.appendChild(insertBtn);
    formArea.appendChild(wrapper);
    autoResize(input);
  }

  autoResize(footerInput);
  charCount.textContent = `${footerInput.value.length} 文字`;

  // EventListeners for footer input
  clearBtn.addEventListener('click', () => {
    footerInput.value = '';
    autoResize(footerInput);
    charCount.textContent = '0 文字';
  });
  copyBtn.addEventListener('click', () => {
    clipboard.writeText(footerInput.value);
  });
  footerInput.addEventListener('input', () => {
    autoResize(footerInput);
    charCount.textContent = `${footerInput.value.length} 文字`;
  });
});

