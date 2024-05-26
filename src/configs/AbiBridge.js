export const abiBridge = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "chainId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "message",
				"type": "bytes"
			}
		],
		"name": "MessageCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "chainId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "messageHash",
				"type": "bytes32"
			}
		],
		"name": "MessageProcessed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "chainId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "contractLocal",
				"type": "address"
			}
		],
		"name": "assetResolve",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "chainId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "contractRemote",
				"type": "address"
			}
		],
		"name": "assetResolveRev",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "chainId",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "messageHash",
				"type": "bytes32"
			},
			{
				"components": [
					{
						"internalType": "uint8",
						"name": "v",
						"type": "uint8"
					},
					{
						"internalType": "bytes32",
						"name": "r",
						"type": "bytes32"
					},
					{
						"internalType": "bytes32",
						"name": "s",
						"type": "bytes32"
					}
				],
				"internalType": "struct Bridge.Signature[8]",
				"name": "signatures",
				"type": "tuple[8]"
			},
			{
				"internalType": "uint64",
				"name": "sigEpoch",
				"type": "uint64"
			}
		],
		"name": "messageCheckSignatures",
		"outputs": [
			{
				"internalType": "address[8]",
				"name": "",
				"type": "address[8]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "chainId",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "messageHash",
				"type": "bytes32"
			},
			{
				"internalType": "uint64",
				"name": "epoch",
				"type": "uint64"
			}
		],
		"name": "messageGetRelayers",
		"outputs": [
			{
				"internalType": "address[8]",
				"name": "",
				"type": "address[8]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "message",
				"type": "bytes"
			},
			{
				"components": [
					{
						"internalType": "uint8",
						"name": "v",
						"type": "uint8"
					},
					{
						"internalType": "bytes32",
						"name": "r",
						"type": "bytes32"
					},
					{
						"internalType": "bytes32",
						"name": "s",
						"type": "bytes32"
					}
				],
				"internalType": "struct Bridge.Signature[8]",
				"name": "signatures",
				"type": "tuple[8]"
			},
			{
				"internalType": "uint64",
				"name": "sigEpoch",
				"type": "uint64"
			}
		],
		"name": "messageProcess",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "chainId",
				"type": "uint256"
			}
		],
		"name": "relayerActivate",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "chainId",
				"type": "uint256"
			}
		],
		"name": "relayerDeactivate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "chainId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "relayerAddr",
				"type": "address"
			}
		],
		"name": "relayerGetBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "relayerAddr",
				"type": "address"
			}
		],
		"name": "relayerGetStake",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "chainId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "relayerAddr",
				"type": "address"
			}
		],
		"name": "relayerGetStatus",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			},
			{
				"internalType": "uint64",
				"name": "",
				"type": "uint64"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "chainId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "relayerAddr",
				"type": "address"
			}
		],
		"name": "relayerGetWithdrawalMax",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "chainId",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "relayerWithdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "setOwner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "dstChainId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "dstAddress",
				"type": "address"
			}
		],
		"name": "transfer",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "srcContract",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "dstChainId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "dstAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transferERC20",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];