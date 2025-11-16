---
mode: 'agent'
model: claude-sonnet-4
tools: ['editFiles', 'runCommands']
description: 'Summarize UI architecture planning and prepare a summary for next development phase'
---
You are an AI assistant tasked with summarizing a conversation about UI architecture planning for an MVP and preparing a concise summary for the next development phase. The conversation history contains the following information:

Product Requirements Document (PRD)

Technology stack information

API plan

Conversation history with questions and answers

UI architecture recommendations

<Ui_plan>
ui-architecture-planning-qa.md
</Ui_plan>

Your task is to:

Summarize the conversation history, focusing on all decisions related to UI architecture planning.

Match the model's recommendations with the answers provided in the conversation history. Identify which recommendations are relevant based on the discussion.

Prepare a detailed conversation summary that includes:
a. Main UI architecture requirements
b. Key views, screens, and user flows
c. API integration and state management strategy
d. Responsiveness, accessibility, and security considerations
e. Any unresolved issues or areas requiring further clarification

Format the results as follows:

<conversation_summary>
<decisions>
1. yes
2. separate page
3. primary
4. list (infinite scroll), only summary, details can be expanded on click
5. on one page,creation on top, list bellow
6. one serch for all types
7. use real time, show indicator, use polling
8. note detail view, dedicated page (uniq url)
9. list of categories as a separate page, dropdown on main page is nice to have
10. tags as a chips, create tag suing #[tag name] in note content
11. separate page for all shared notes, add item to main menu with link to item
12. infinite scroll
13 image can be added by copy / paste, one note - one image. Display it as a content (with optional text)
14. toast notifications
15. skeleton loaders. for semantic search use spinner and relevant info text
16. automatic token refresh
17. responsive adaptation of the same interface
18. the application simply fail gracefully
19. background refetching
20. use word counter
21. users should be taken directly to their notes list. Display title like "what's on your mind?" and text input field as a initial view
22. do not mix user notes with shared notes. Separate view but it would loooks in the same way - list and infinite scroll
23. silent operation
24. show semantic search results in the same way, always sort by date.
25. image upload and save only on note save, simple spinner during note save.
26. simple error messaging.
27. skip for now.
28. show retry button.
29. automatic fallback to keyword search.
30. by feature. Use best practics to React Query and Zustand interaction.
</decisions>
<matched_recommendations>
[List the most relevant recommendations matched to the conversation, numbered]
</matched_recommendations>
<ui_architecture_planning_summary>
[Provide a detailed conversation summary, including the elements listed in step 3].
</ui_architecture_planning_summary>
<unresolved_issues>
[List any unresolved issues or areas requiring further clarification, if any]
</unresolved_issues>
</conversation_summary>

The final output should only contain the content in markdown format. Ensure your summary is clear, concise, and provides valuable information for the next phase of UI architecture planning and API integration.Please save output in ai/ui-planning-summary.md