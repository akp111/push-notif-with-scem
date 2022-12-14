const ethers = require("ethers");
const PushAPI = require("@pushprotocol/restapi");
const dotenv = require('dotenv');
dotenv.config();
const EventListner = require("smart-contract-event-monitor").default;
const PK = process.env.PK_KEY; // channel private key
const Pkey = `0x${PK}`;
const signer = new ethers.Wallet(Pkey);
const ABI = [
  // define the ABI
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "oldOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "DemoEvent1",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "oldOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "DemoEvent2",
    type: "event",
  },
  {
    inputs: [],
    name: "EmitEvent1",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "EmitEvent2",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const contractAddress = "0x609FE9E0317EBE4BFdcdb94b04eCd84ed7d3e8A5"; // contract address
const contractMonitor = new EventListner(
  `wss://goerli.infura.io/ws/v3/${process.env.PROJECT_ID}`,
  contractAddress,
  ABI
); // initialise
const sendNotification = async (title, body) => {
  try {
    const apiResponse = await PushAPI.payloads.sendNotification({
      signer,
      type: 1, // target
      identityType: 2, // direct payload
      notification: {
        title: title,
        body: body,
      },
      payload: {
        title: title,
        body: body,
        cta: "",
        img: "",
      },
      recipients: "eip155:5:0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1", // recipient address
      channel: "eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681", // your channel address
      env: "staging",
    });

    // apiResponse?.status === 204, if sent successfully!
    console.log("API repsonse: ", apiResponse);
  } catch (err) {
    console.error("Error: ", err);
  }
}
  const monitorEvent = () => {
    try {
      contractMonitor.initiateEventMonitoring((data) => {
        // call the initiateEventMonitoring to monitor the events
        if (data.eventName == "DemoEvent1") {
            sendNotification("DemoEvent1", "DemoEven1 got triggered!!")
        }
      });
    } catch (err) {
      console.error("Error: ", err);
    }
  };


function main(){
    monitorEvent()
}

main()