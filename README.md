# 🛡️ Cryptoric Discord Handler

<div align="center">

[![Discord.js](https://img.shields.io/badge/Discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v16.9%2B-green?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Sharding](https://img.shields.io/badge/Hybrid-Sharding-orange?style=for-the-badge)](https://github.com/vladfrangu/discord-hybrid-sharding)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**A professional, enterprise-grade Discord bot boilerplate built for scalability.**
Featuring Discord.js v14, Hybrid Sharding, Component v2 Handling, and a robust hybrid command system.

[Features](#-features) • [Installation](#-setup) • [Documentation](#--how-to-add-your-own-commands) • [Authors](#-authors) • [Support](https://discord.gg/7f8hXtdQkq)

</div>

---

## 📋 Table of Contents
1. [Features](#-features)
2. [Project Structure](#-project-structure)
3. [Setup](#-setup)
4. [Configuration](#-configuration)
5. [Usage Guide](#-commands)
6. [Development Guide](#--how-to-add-your-own-commands)
7. [Authors](#-authors)

---

## ✨ Features

* 🚀 **Discord.js v14 Core:** Built on the latest library version taking full advantage of modern Discord features.
* 🔄 **Discord-Hybrid-Sharding:** Automated, enterprise-level sharding implementation for massive scalability across multiple clusters.
* 🎯 **Advanced Component Handler:** Modular handling for Buttons, Select Menus, and Modals (Component v2).
* ⚡ **Hybrid Command System:** Support for Slash Commands, Prefix Commands, and Mention Commands simultaneously.
* 🎨 **Rich Logging:** Beautiful, colorful ASCII console output with detailed cluster and shard information.
* 📁 **Modular Architecture:** A clean, organized, and maintainable file structure designed for team collaboration.

---

## 📁 Project Structure

```text
cryptoric-discord-bot/
├── cluster.js                # 🚀 Main entry point (Cluster Manager)
├── core/
│   ├── bot.js                # Bot initialization logic
│   └── Client.js             # Extended Discord Client class
├── handlers/
│   ├── CommandHandler.js     # Hybrid command processor
│   ├── ComponentHandler.js   # Interaction component processor
│   └── EventHandler.js       # Event listener loader
├── modules/
│   ├── commands/             # 💬 Command modules
│   │   ├── utility/
│   │   └── owner/
│   ├── components/           # 🔘 Component interactions
│   │   ├── buttons/
│   │   ├── selectmenus/
│   │   └── modals/
│   └── events/               # 📡 Event listeners
│       └── client/
├── registry/
│   ├── CommandRegistry.js    # In-memory command storage
│   └── ComponentRegistry.js  # In-memory component storage
├── utilities/
│   ├── Logger.js             # Advanced logging utility
│   └── EmbedBuilder.js       # Standardized embed generator
├── config.js                 # Global configuration
└── deployCommands.js         # Slash command registrar
````

-----

## 🚀 Setup

### 1\. Prerequisites

Ensure you have **Node.js v16.9.0** or higher installed.

### 2\. Install Dependencies

Clone the repository and install the required packages:

```bash
npm install
```

### 3\. Configure Environment

Create a `.env` file or modify your system environment variables. You will need the following:

| Variable | Description |
| :--- | :--- |
| `DISCORD_TOKEN` | Your Discord Bot Token |
| `CLIENT_ID` | Your Application ID |
| `PREFIX` | Default command prefix (e.g., `!`) |
| `OWNER_IDS` | Comma-separated User IDs for admin access |
| `TEST_GUILD_ID` | (Optional) Guild ID for instant slash command testing |

### 4\. Deploy Commands

Register your slash commands with the Discord API:

```bash
npm run deploy
```

### 5\. Launch

Start the bot with sharding enabled:

```bash
npm start
```

-----

## 📝 Commands

The bot features a **Quad-State Execution Method**, allowing users to interact in whichever way they prefer.

### 1\. Slash Commands (`/`)

Modern, integrated Discord commands.

  * `/ping` - Check latency and shard info.
  * `/help` - View interactive help menu.

### 2\. Prefix Commands (`!`)

Traditional text-based commands.

  * `!ping`
  * `!help`

### 3\. Strict Mention Commands (`@Bot cmd`)

Trigger a command by tagging the bot.

  * `@Npg ping`

### 4\. Passive Mention (`@Bot`)

Simply mentioning the bot will trigger a helpful response showing the current prefix and usage instructions.

-----

## 📖 💻 How to Add Your Own Commands

We've made development intuitive. Follow these templates to add new features.

### ⚡ Option A: The "Hybrid" Command (Recommended)

Make a command work for **both** Slash and Prefix simultaneously.

**File:** `modules/commands/utility/avatar.js`

```javascript
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    // 1. Slash Configuration
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get a user avatar')
        .addUserOption(option =>
            option.setName('user').setDescription('Target user').setRequired(false)
        ),

    // 2. Prefix Configuration
    name: 'avatar',
    description: 'Get a user avatar',
    aliases: ['av', 'pfp'],

    // 3. Unified Execution Logic
    async execute(interactionOrMessage, argsOrClient, clientOrUndefined) {
        // Detect context
        const isSlash = interactionOrMessage.isChatInputCommand?.();
        const client = isSlash ? argsOrClient : clientOrUndefined;

        // Normalize input
        let user;
        if (isSlash) {
            user = interactionOrMessage.options.getUser('user') || interactionOrMessage.user;
        } else {
            user = interactionOrMessage.mentions.users.first() || interactionOrMessage.author;
        }

        // Send response
        await interactionOrMessage.reply({
            content: `${user.username}'s avatar:`,
            files: [user.displayAvatarURL({ size: 1024 })]
        });
    }
};
```

### 🔘 Adding Interactive Buttons

**1. Create the Command:**
`modules/commands/fun/vote.js`

```javascript
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('vote').setDescription('Start a vote'),
    name: 'vote',

    async execute(ctx) {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('vote_yes').setLabel('Yes').setStyle(ButtonStyle.Success).setEmoji('✅'),
            new ButtonBuilder().setCustomId('vote_no').setLabel('No').setStyle(ButtonStyle.Danger).setEmoji('❌')
        );

        await ctx.reply({ content: 'Cast your vote!', components: [row] });
    }
};
```

**2. Handle the Interaction:**
`modules/components/buttons/voteHandler.js`

```javascript
module.exports = {
    customId: 'vote', // Matches 'vote_yes' and 'vote_no' via partial matching or use specific IDs

    async execute(interaction, client) {
        if (interaction.customId === 'vote_yes') {
            await interaction.reply({ content: 'You voted Yes!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'You voted No!', ephemeral: true });
        }
    }
};
```

-----

## 👨‍💻 Authors

This project is maintained by a dedicated team of developers.

| Contributor | Role | GitHub Profile | Discord |
| :--- | :--- | :--- | :--- |
| **Npg** | Lead Developer | [github](https://github.com/Itz-Npg) | [discord](https://discord.com/users/1052620216443601076) |
| **SoulCosmic** | Core Developer | [github](https://github.com/SoulDevs) | [discord](https://discord.com/users/543016540790849551) |
| **Sandeep Op** | Developer | [github](https://github.com/sandeep-op9) | [discord](https://discord.com/users/975254584224268298) | 
| **Vansh** | Developer | [github](https://github.com/vanshnoteral) | [discord](https://discord.com/users/1257022283373875282) |

-----

## 📄 License

This project is licensed under the **MIT License**.
