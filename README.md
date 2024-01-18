# Building a RAG Generative AI application

## Introduction

RAG stands for Retrieval-Augmented Generation. It's a technique that allows us to extend the context window of a large
language model (LLM) by retrieving relevant information from a knowledge base. While lots of folks imagine the uses of
AI in the context of unstructured data, it's also possible to use it to generate text and insights from structured data.
Guess where most business data lives? In databases!

In this workshop, we'll be building a RAG application that generates answers to questions about real estate listings. An
agent can ask a question like "What house is best for a family of four?" and get a response catered to their needs.

### Magic

There's a few things we're doing behind the scenes to make this experience totally about the AI and not about the
infrastructure. We're using Docker to containerize our application, so you don't have to worry about installing
dependencies on your machine. The compose file will spin up a relational Postgres database, a Weaviate vector database,
a server that exposes a REST API, and a client that allows you to interact with the API.

For ease, we've exposed the port of the server so you can use a tool like Postman to interact with the API. Our client
will actually be run from within its container, so you'll have to use the terminal to interact with it. Why? I didn't
feel like dealing with a UI. ¯\\\_(ツ)\_/¯

## Prerequisites

Just two things!

- Docker
- An OpenAI API key

🚧 Okay... three things. This is optional, though: [Postman](https://postman.com). You can use any tool you want to
interact with the API, but Postman is pretty great and we provide a ready-made collection to make it easy to explore the
API. 🚧

### Docker

Docker is a containerization platform that allows us to run our application in a consistent environment. This means you
don't have to worry about installing dependencies on your machine, and you can be sure that the application will run the
same way on your machine as it does on ours.

To install Docker, follow the instructions for your operating system:

- [Mac](https://docs.docker.com/docker-for-mac/install/)
- [Windows](https://docs.docker.com/docker-for-windows/install/)
- [Linux](https://docs.docker.com/engine/install/)

### OpenAI API Key

We'll be using the OpenAI API to create responses to our questions. To get an API key, follow the instructions
[here](https://platform.openai.com/docs/developer-quickstart/your-api-keys).

## Installation

Clone the repository:

```bash
git clone https://github.com/robertjdominguez/BHM_AI_RAG.git
```

Change into the directory:

```bash
cd BHM_AI_RAG
```

Checkout the `waypoint-1` tag to get to the starting point of the workshop:

```bash
git checkout -f waypoint-1
```

Create an `.env` file in the root of the project and add the following variables:

```bash
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=admin
POSTGRESQL_CONNECTION_STRING=postgres://postgres:admin@postgres-db:5432/postgres
SERVER_BASE_URL=server:3000
WEAVIATE_URL=vector-db:8080
OPENAI_API_KEY=<your-openai-api-key>
# Choose one of the following models and uncomment it:
# GPT_MODEL=gpt-3.5-turbo
# GPT_MODEL=gpt-4-1106-preview
```

From the root of the repository, run:

```bash
docker compose up -d --build
```

This will build the docker images and start the containers. The first time you run this command, it will take a while to
download the docker images.

Whenever you're ready to stop the containers, run:

```bash
docker compose down
```

You can then restart them whenever you wish by running:

```bash
docker compose up -d
```

## Usage

We have five services running; four will run continuously, and one is a one-off script to populate our vector database
with some initial data.

After you start the containers, you can test that everything is working by running:

```bash
curl localhost:3000/healthcheck
```

You should get a response that looks like this:

```json
{
  "message": "I'm alive you fools!"
}
```

At the very least, your server is running 💯

If you run `docker ps`, you should see the following containers running with their own IDs:

```bash
CONTAINER ID   IMAGE                              COMMAND                  CREATED              STATUS          PORTS                    NAMES
6f909043a72b   recommendation-app-client          "docker-entrypoint.s…"   50 seconds ago       Up 49 seconds                            client
905b4049e79b   recommendation-app-server          "docker-entrypoint.s…"   50 seconds ago       Up 49 seconds   0.0.0.0:3000->3000/tcp   server
6738a3120a74   postgres:latest                    "docker-entrypoint.s…"   About a minute ago   Up 49 seconds   0.0.0.0:5432->5432/tcp   recommendation-app-postgres-db-1
4fbfecd7719e   semitechnologies/weaviate:1.21.2   "/bin/weaviate --hos…"   20 minutes ago       Up 20 minutes                            recommendation-app-vector-db-1
```

With the server running, you can explore the API by using this Postman collection:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.postman.com/mission-observer-40442015/workspace/bhm-ai-engineering)

You can also enter the `client` container and interact with the API from the command line in the form of a websocket
stream:

```bash
docker exec -it client /bin/bash
```

Once you execute this command, you'll be in the container's shell. From there, you can run:

```bash
npm run start
```

You'll be prompted by the client to enter a question. Enter a question and press enter. For now, you'll get a response
like this:

```text
You'll have to wait until the workshop to get an answer to that question!
```

## Workshop

> 🛑 Of course, you can do all of this 👇 on your own — but, we recommend doing this section together during the
> workshop...with beer! 🛑

We're starting off with a barebone application. However, we'll progressively add functionality using the waypoints
below. If you get lost at any point, each waypoint starts with a tagged commit, so you can always check out the code at
that point.

Our server code is the only thing that we'll change, so we've got nodemon running to restart the server whenever we make
changes. This means you don't have to restart the server manually every time you make a change 🎉

### Waypoint 1: Check me out

To catch up to this point, run:

```bash
git checkout -f waypoint-1
```

In this first section, we'll modify our prompt so that it sets context for the AI to generate a response.

<details>
<summary>Click to see the solution/steps 👀</summary>

Our prompt sits inside the `/server/utilities/weaviateHelpers.js` file. We have a function called `LLMQuery` that takes
several arguments:

| Argument    | Description                             |
| ----------- | --------------------------------------- |
| `ws`        | The websocket connection to the client. |
| `text`      | The text of the question.               |
| `fields`    | The fields to retrieve from Weaviate.   |
| `messages`  | The messages to send to the client.     |
| `className` | The class to query in Weaviate.         |

The websocket connection is for streaming responses to the client. It's totally optional — if you remove it and the
accompanying code that breaks the stream, the application will still work by sending the response to the client once the
AI has finished generating it. However, this can take a while, so we've opted to stream the response to the client as
the AI generates it. This is why we call it a **streaming response**.

Everything else is needed to generate a response. However, if you look at the `conversation` array, you'll see that we
only have one, hardcoded message. This is the prompt that's generating our current response:

```js
let conversation = [
  {
    role: 'system',
    content: `You can only say one thing no matter what the user asks: You'll have to wait until the workshop to get an answer to that question!`,
  },
];
```

We'll need to modify this prompt to generate a response that's more relevant to the question.

Let's replace it with:

```js
let conversation = [
  {
    role: 'system',
    content: `You are a helpful real estate assistant. Tell me which house is best based on the user's query.`,
  },
];
```

Our server will automatically restart, and we can test it out by asking a question. We should get a _better_ response
than before 🤞

</details>

### Waypoint 2: Prompt engineering

To catch up to this point, run:

```bash
git checkout -f waypoint-2
```

Next, we'll start introducing context to our prompts. We'll pass the results of our `near_text`` query to the AI to help
augment its understanding of the question and extend the context window.

<details>
<summary>Click to see the solution/steps 👀</summary>

Let's amend the prompt to include the results of our query:

```js
let conversation = [
  {
    role: 'system',
    content: `You are a helpful real estate assistant. You must use these houses and only these houses to determine the single house that is best for the user based on their query. Provide your reasoning in a friendly way. Additionally, provide some information about the size, price, and location of the house. Here is their query: ${makePrompt(
      embeddings
    )})}`,
  },
];
```

We're passing the `makePrompt` function the `embeddings` array, which contains the results of our query. This function
will return a string that's the combined results of our query. We'll use this string to augment the context window of
the AI.

</details>

### Waypoint 3: Having fun

To catch up to this point, run:

```bash
git checkout -f waypoint-3
```

Now that we've got a working application, we can start having some fun with it. We'll add a few more prompts to our
application to make it more robust and see how the AI responds to different questions.

## Wrapping up

Congratulations! You've built a RAG application that can generate answers to questions about real estate listings. You
can take the principles you've learned here and apply them to your own applications. If you want to learn more about
RAG, check out the [paper](https://arxiv.org/abs/2005.11401) that introduced it.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change 🤙
