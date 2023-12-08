import WebSocket from 'ws';
import readline from 'readline';

await new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve();
  }, 5000);
});

// readline is a built-in Node.js module that allows us to read input from the command line
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Create a new WebSocket connection to the server
const ws = new WebSocket('ws://server:3000/llm');

// When the connection is first opened, ask the user for a query
ws.on('open', function open() {
  askQuestion();
});

// When the connection receives a message, append response to the console
ws.on('message', function incoming(data) {
  // check if data is a string
  if (!data.includes('[') && !data.includes('{')) {
    process.stdout.write(data);
  } else {
    process.stdout.write('\n');
    if (data.includes('undefined')) {
      askQuestion();
    }
  }
});

function askQuestion() {
  if (rl.input.readable) {
    rl.question('\nEnter your real estate query: ', (answer) => {
      ws.send(
        JSON.stringify({
          table: 'houses',
          columns: 'price, description, square_footage',
          query: answer,
          messages: [],
        })
      );
    });
  }
}
