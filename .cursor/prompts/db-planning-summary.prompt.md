---
mode: 'agent'
model: claude-sonnet-4
tools: ['editFiles']
description: 'Generate MongoDB Database Planning Summary'
---
You are an AI assistant tasked with summarizing a conversation about MongoDB database planning for an MVP and preparing a concise summary for the next development stage. In the conversation history, you will find the following information:

Questions and recommendations:
<database_recomendations>
ai/mongo-db-planning-output.md
</database_recomendations>

Product Requirements Document (PRD)

Technology stack information

Conversation history with questions and answers

Model recommendations

Your tasks are to:

Summarize the conversation history, focusing on all decisions related to MongoDB database planning.

Use all recomendations from database_recomendations

Prepare a detailed conversation summary that includes:
a. Main requirements for MongoDB data structures and key patterns
b. Caching strategies and data access patterns
c. Memory optimization and persistence considerations
d. MongoDB-specific security and scalability configurations
e. Data expiration and eviction policies
f. Any unresolved issues or areas that require further clarification

Format the results as follows:

<conversation_summary>
<decisions>
[List the decisions made by the user regarding MongoDB configuration, data structures, and caching strategies, numbered].
</decisions>

<matched_recommendations>
[List the most relevant MongoDB-specific recommendations matched to the conversation, numbered]
</matched_recommendations>

<MongoDB_planning_summary>
[Provide a detailed summary of the conversation, including:
- MongoDB data structures chosen (strings, hashes, lists, sets, sorted sets, etc.)
- Key naming conventions and patterns
- Caching strategies (write-through, write-behind, cache-aside, etc.)
- Memory management and optimization approaches
- Persistence configuration (RDB, AOF, or both)
- Clustering and replication requirements
- Security configurations (AUTH, TLS, ACLs)
- Performance and monitoring considerations]
</MongoDB_planning_summary>

<memory_optimization_strategy>
[Detail the memory optimization strategy including:
- Data compression techniques
- TTL (Time To Live) policies
- Memory usage monitoring
- Eviction policies (LRU, LFU, random, etc.)
- Data structure efficiency considerations]
</memory_optimization_strategy>

<unresolved_issues>
[List any unresolved issues or areas that require further clarification regarding MongoDB implementation, if any]
</unresolved_issues>
</conversation_summary>

The final output should only contain content in markdown format. Make sure your summary is clear, concise, and provides valuable information for the next stage of MongoDB database implementation.
Please store output in ai/db_planning_summary.md file