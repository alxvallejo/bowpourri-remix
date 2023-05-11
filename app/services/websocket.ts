import { io } from "socket.io-client";

export const socket = io("http://localhost:4000");
export let socketID = "";
socket.on("connect", () => {
  socketID = socket.id;
  console.log("connected with socketId", socketID);
});
