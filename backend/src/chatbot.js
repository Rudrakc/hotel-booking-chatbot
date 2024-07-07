import axios from "axios";
import OpenAI from "openai/index.js";
import { Conversation } from "./database.js";

class Chatbot {
  constructor() {
    this.response = "";
    this.initializeThread();
  }

  async initializeThread() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.assistant = await this.openai.beta.assistants.create({
      name: "Hotel Booking Chatbot",
      instructions:
        "You are a hotel booking chat assistant. Write replies for hotel booking queries ",
      tools: [
        {
          type: "function",
          function: {
            name: "getRoomOptions",
            description: "Get the list of available rooms at Bot9 Palace",
            parameters: {
              type: "object",
              properties: {
                location: {
                  type: "string",
                  description: "The resort name, e.g., Bot9 Palace",
                },
              },
              required: ["location"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "createBooking",
            description: "Create a new booking at Bot9 Palace",
            parameters: {
              type: "object",
              properties: {
                roomId: {
                  type: "integer",
                  description: "The ID of the room to book",
                },
                fullName: {
                  type: "string",
                  description: "The full name of the person booking the room",
                },
                email: {
                  type: "string",
                  description:
                    "The email address of the person booking the room",
                },
                nights: {
                  type: "integer",
                  description: "The number of nights to stay",
                },
              },
              required: ["roomId", "fullName", "email", "nights"],
            },
          },
        },
      ],
      model: "gpt-4o",
    });
    this.thread = await this.openai.beta.threads.create();
  }

  async handleRunStatus(run) {
    // Check if the run is completed
    if (run.status === "completed") {
      const messages = await this.openai.beta.threads.messages.list(
        run.thread_id
      );
      for (const message of messages.data.reverse()) {
        console.log(`${message.role} > ${message.content[0].text.value}`);
      }
      this.response =
        messages.data[messages.data.length - 1].content[0].text.value;
    } else if (run.status === "requires_action") {
      return await this.handleRequiresAction(run);
    } else {
      console.error("Run did not complete:", run);
    }
  }

  async handleRequiresAction(run) {
    // Check if there are tools that require outputs
    if (
      run.required_action &&
      run.required_action.submit_tool_outputs &&
      run.required_action.submit_tool_outputs.tool_calls
    ) {
      // Loop through each tool in the required action section
      const toolOutputs = await Promise.all(
        run.required_action.submit_tool_outputs.tool_calls.map(async (tool) => {
          if (tool.function.name === "getRoomOptions") {
            return {
              tool_call_id: tool.id,
              output: await this.getRoomOptionsList(),
            };
          } else if (tool.function.name === "createBooking") {
            return {
              tool_call_id: tool.id,
              output: await this.bookRoom(tool.function.arguments),
            };
          }
        })
      );

      // Log the resolved tool outputs
      console.log(toolOutputs);

      if (toolOutputs.length > 0) {
        run = await this.openai.beta.threads.runs.submitToolOutputsAndPoll(
          this.thread.id,
          run.id,
          { tool_outputs: toolOutputs }
        );
        console.log("Tool outputs submitted successfully.");
      } else {
        console.log("No tool outputs to submit.");
      }

      // Check status after submitting tool outputs
      return await this.handleRunStatus(run);
    }
  }

  async getRoomOptionsList() {
    const response = await axios.get("https://bot9assignement.deno.dev/rooms");
    const rooms = response.data;
    let roomOptions = "Here are the available rooms:\n";
    rooms.forEach((room) => {
      roomOptions += `Room ID: ${room.id}, Name: ${room.name}, Price: ${room.price}\n`;
    });
    return roomOptions;
  }

  async bookRoom(argumentsList) {
    const { roomId, fullName, email, nights } = JSON.parse(argumentsList);
    try {
      const response = await axios.post(
        "https://bot9assignement.deno.dev/book",
        {
          roomId: roomId,
          fullName: fullName,
          email: email,
          nights: nights,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(
        `Booking confirmed! Your booking ID is ${response.data.bookingId}.`
      );
      return `Booking confirmed! Your booking ID is ${response.data.bookingId}.`;
    } catch (error) {
      console.error(
        "Error creating booking:",
        error.response ? error.response.data : error.message
      );
    }
  }

  async handleMessage(message, userId) {
    const entry = await Conversation.create({ userId, message, response: " " });

    const userMessage = await this.openai.beta.threads.messages.create(
      this.thread.id,
      {
        role: "user",
        content: message,
      }
    );

    let run = await this.openai.beta.threads.runs.createAndPoll(
      this.thread.id,
      {
        assistant_id: this.assistant.id,
      }
    );

    await this.handleRunStatus(run);

    await entry.update({ response: this.response });

    return this.response;
  }
}

export { Chatbot };
