# Npg Discord Bot

## Overview

A professional Discord bot built with Discord.js v14 featuring Component v2 Handler and Discord-Hybrid-Sharding for horizontal scalability. The bot supports multiple command input methods (slash commands, prefix commands, and @mention commands) with an organized modular architecture designed for maintainability and extension.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Multi-Process Sharding Architecture
- **Discord-Hybrid-Sharding**: Implements horizontal scaling through cluster-based sharding from startup
- **Cluster Manager**: Entry point (`cluster.js`) spawns multiple bot processes for load distribution
- **Auto-Sharding**: Automatically determines optimal shard count based on guild requirements
- **Process Mode**: Each cluster runs in a separate Node.js process for fault isolation

**Rationale**: Prepares the bot for large-scale deployment (2500+ guilds require sharding). Discord-Hybrid-Sharding was chosen over native sharding for easier management and built-in process distribution.

### Extended Client Architecture
- **Custom Client Class**: `NpgClient` extends Discord.js Client with custom registry and handler systems
- **Dependency Injection**: Client instance receives cluster information and injects utilities/handlers
- **Single Responsibility**: Each handler focuses on one concern (commands, components, events)

**Rationale**: Extending the base client allows centralized access to custom functionality while maintaining Discord.js compatibility. This pattern enables easier testing and reduces coupling.

### Command System Design
- **Dual Command Support**: Commands work as both slash commands (`/ping`) and prefix commands (`!ping`)
- **Mention Commands**: Bot responds to @mentions as command triggers
- **Unified Execution**: Single `execute` function handles all command types through polymorphic interaction/message objects
- **Command Registry**: Separate collections for slash commands, prefix commands, and aliases

**Rationale**: Supporting multiple input methods improves user experience and backward compatibility. The unified execution pattern eliminates code duplication across command types.

### Component v2 Handler
- **Type-Based Organization**: Components separated into buttons, select menus, and modals
- **Prefix Matching**: Supports dynamic custom IDs through `startsWith()` matching for parameterized components
- **Component Registry**: Centralized storage with efficient lookup mechanisms
- **User Validation**: Components verify the original interaction user to prevent unauthorized access

**Rationale**: The v2 handler pattern addresses Discord's component interaction model where multiple instances of the same component need different behaviors. Prefix matching enables data passing through custom IDs.

### Event-Driven Architecture
- **Category-Based Organization**: Events grouped by source (client, guild, interaction)
- **Automatic Registration**: EventHandler discovers and registers all event files dynamically
- **Once vs On**: Support for both one-time and recurring event listeners
- **Error Isolation**: Event failures don't crash the entire bot

**Rationale**: Event-driven design aligns with Discord's real-time API. Categorization improves maintainability as the bot scales.

### Logging & Monitoring System
- **Colorful ASCII Logger**: Custom logger with cluster-aware output and gradient ASCII banners
- **Webhook Integration**: Optional Discord webhook logging for production monitoring
- **Cluster Identification**: All logs tagged with cluster ID for distributed debugging
- **Log Levels**: Support for info, success, warn, error, and debug levels

**Rationale**: Colorful console output improves developer experience. Webhook logging enables remote monitoring without SSH access. Cluster tags are essential for debugging in distributed systems.

### Permission & Security Model
- **Owner-Only Commands**: Configuration-based owner verification using user ID whitelist
- **Permission Checks**: Reusable PermissionHandler validates Discord permissions and roles
- **Eval Protection**: Dangerous eval command disabled by default with explicit config requirement
- **Ephemeral Responses**: Error messages use ephemeral replies to reduce channel clutter

**Rationale**: Security-first design prevents unauthorized access to dangerous commands. The permission handler centralizes authorization logic to ensure consistent security checks.

### File Organization Strategy
```
cluster.js (entry) → core/bot.js (shard client) → core/Client.js (extended client)
                  → handlers/ (loading logic)
                  → modules/ (feature code)
                  → registry/ (storage)
                  → utilities/ (helpers)
```

**Rationale**: Clear separation between infrastructure (core, handlers), features (modules), and utilities. This structure supports independent development of new features without touching core logic.

## External Dependencies

### Core Framework
- **discord.js v14.25.1**: Primary Discord API wrapper providing client, interaction, and component builders
- **discord-hybrid-sharding v3.0.1**: Cluster and shard management for horizontal scaling

### Utilities
- **dotenv v17.2.3**: Environment variable management for sensitive configuration (tokens, IDs)
- **chalk v4.1.2**: Terminal color styling for enhanced logging output
- **ascii-art v2.8.5**: ASCII banner generation for startup branding

### Discord API Integration
- All Discord interactions use REST API via discord.js builders
- Gateway connection managed through Discord.js client with automatic reconnection
- No external databases or data persistence (stateless design)
- Optional webhook logging to Discord channels for monitoring

### Configuration Requirements
The bot requires the following environment variables:
- `DISCORD_TOKEN`: Bot authentication token
- `CLIENT_ID`: Discord application ID for command deployment
- `PREFIX`: Command prefix (default: `!`)
- `OWNER_IDS`: Comma-separated list of owner user IDs
- `TEST_GUILD_ID`: Optional guild ID for testing slash commands
- Webhook URLs for logging (optional)

**Note**: No database is currently configured. Future additions of Drizzle or Postgres would require schema definitions and connection management in the Client constructor.