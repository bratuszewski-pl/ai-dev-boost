---
mode: 'agent'
model: claude-sonnet-4
tools: ['editFiles']
description: 'Generate PRD planning summary'
---
You are an AI assistant tasked with summarizing a conversation about planning a PRD (Product Requirements Document) for an MVP and preparing a concise summary for the next stage of development. In the conversation history, you will find the following information:

Project description

Identified user problem

Conversation history containing questions and answers

Recommendations regarding the contents of the PRD

Your tasks are:

Summarize the conversation history, focusing on all decisions related to PRD planning.

Match the model’s recommendations to the answers provided in the conversation history. Identify which recommendations are relevant based on the discussion.

Prepare a detailed conversation summary that includes:
a. Main functional requirements of the product
b. Key user stories and usage flows
c. Important success criteria and ways to measure them
d. Any unresolved issues or areas requiring further clarification

Format the results as follows:

<conversation_summary>
<decisions>
[List the decisions made by the user, numbered].
</decisions>

<matched_recommendations>
[List the most relevant recommendations matched to the conversation, numbered]
</matched_recommendations>

<prd_planning_summary>
[Provide a detailed summary of the conversation, including the elements listed in step 3].
</prd_planning_summary>

<unresolved_issues>
[List any unresolved issues or areas requiring further clarification, if any]
</unresolved_issues>
</conversation_summary>
The final output should only contain the content in markdown format. Ensure that your summary is clear, concise, and provides valuable information for the next stage of creating the PRD.
Please store output in ai/planning_summary.md file