# Base Whispers

Anonymous whispers sent directly to Base wallets.

## What it is
Base Whispers is a privacy-first mini app on Base that allows anyone to send short anonymous messages to any wallet address.

No accounts.  
No profiles.  
No offchain signatures.

Just a wallet, a message, and Base.

## What it is NOT
- Not a chat app
- Not a social network
- Not account-based
- Not reliant on offchain infrastructure
- Not designed for conversations or replies

Base Whispers is a one-way messaging primitive.

## How it works
- Sender inputs a wallet address and a short message
- Sender pays a small fee
- Message is submitted onchain
- Contract emits an event for indexing
- Receiver reads messages linked to their wallet via the UI

No approvals.  
No signatures.  
No intermediaries.

## Fees
Each whisper includes a micro-fee to:
- Reduce spam
- Incentivize receivers
- Sustain the protocol

(Fee routing logic will be defined at the contract level.)

## Status
UI demo only.  
No onchain transactions yet.

## Live Demo
https://base-whispers-ui.vercel.app

## Vision
A minimal communication layer for Base wallets, Farcaster users, and onchain identities.
