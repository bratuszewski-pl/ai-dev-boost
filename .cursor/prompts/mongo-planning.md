---
mode: 'agent'
model: claude-sonnet-4
tools: ['editFiles']
description: 'Plan MongoDB database structure for MVP'
---
You are an AI assistant tasked with helping to plan a MongoDB database structure for an MVP (Minimum Viable Product) based on provided information. Your goal is to generate a list of questions and recommendations that will be used in subsequent prompts to create the Redis data structures, key naming patterns, and data organization strategies.

Please carefully review the information below:

<product_requirements>
ai/prd.md
</product_requirements>

<tech_stack>
ai/tech-stack.md
</tech_stack>

Analyze the provided information, focusing on aspects relevant to Redis database design. Consider the following:

Identify key entities and their attributes based on the product requirements.

Determine optimal Redis data structures (strings, hashes, lists, sets, sorted sets) for each entity.

Consider key naming conventions and patterns for data organization.

Think about data persistence, memory usage, and performance impacts.

Assess caching strategies and data expiration requirements.

Consider Redis-specific features that may be beneficial for the project (pub/sub, transactions, modules).

Based on your analysis, generate a list of questions and recommendations. These should address any ambiguities, potential issues, or areas where more information is needed to create an effective Redis data organization strategy. Consider questions about:

Data structure selection (hash vs. string vs. set vs. sorted set vs. list)

Key naming patterns and conventions

Data serialization formats (JSON, MessagePack, etc.)

Memory optimization strategies

Data expiration and TTL policies

Persistence configuration (RDB vs. AOF)

Performance considerations and optimization

Scalability concerns (clustering, sharding)

Data consistency and atomic operations

Backup and recovery strategies

The output should have the following structure:

<database_planning_output>
<questions>
[List your questions here, numbered]
</questions>

<recommendations>
[List your recommendations here, numbered]
</recommendations>
</database_planning_output>

Remember that your goal is to provide a comprehensive list of questions and recommendations to help create a solid Redis data organization strategy for the MVP. Focus on clarity, relevance, and accuracy in your output. Do not include any additional comments or explanations outside of the specified output format.

Continue this process by generating new questions and recommendations based on the provided context and user's responses until the user explicitly asks for a summary.

Remember to focus on the clarity, relevance, and accuracy of your results. Do not include any additional comments or explanations outside of the specified output format.