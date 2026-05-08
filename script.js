const message = document.getElementById('message');
const button = document.getElementById('actionButton');

button.addEventListener('click', () => {
  const time = new Date().toLocaleTimeString();
  message.textContent = `Button clicked at ${time}. Happy coding!`;
});
