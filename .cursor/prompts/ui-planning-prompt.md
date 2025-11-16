---
mode: 'agent'
model: claude-sonnet-4
tools: ['editFiles']
description: 'generate questions and answers regarding UI architecture planning'
---
You are an AI assistant tasked with helping to plan the user interface architecture for an MVP (Minimum Viable Product) based on the information provided. Your goal is to generate a list of questions and recommendations that will be used in a subsequent prompt to create a detailed UI architecture, user journey maps, and navigation structure.
You should focus on the goal described and avoid creating plan directly. Focus on list of questions and recommendations.

Please carefully review the information below:

<product_requirements>
ai\prd.md
</product_requirements>

<tech_stack>
ai\tech-stack.md
</tech_stack>

<api_plan>
ai\api-plan.md
</api_plan>

Analyze the provided information, focusing on aspects relevant to user interface design. Consider the following:

Identify key views and screens based on product requirements and available API endpoints.

Determine potential user flows and navigation between views, taking API capabilities into account.

Consider the UI components and interaction patterns that may be necessary to effectively communicate with the API.

Think about the responsiveness and accessibility of the interface.

Evaluate security and authentication requirements in the context of API integration.

Consider any specific UI libraries or frameworks that might be beneficial for the project.

Analyze how the API structure influences the UI design and data flows in the application.

Based on your analysis, generate a list of questions and recommendations. They should address any ambiguities, potential issues, or areas where more information is needed to create an effective UI architecture. Consider questions about:

1.View hierarchy and organization in relation to the API structure.

2.User flows and navigation supported by the available endpoints.

3.Responsiveness and adaptation to different devices.

4.Accessibility and inclusivity.

5.UI-level security and authorization in connection with API mechanisms.

6.Design and user experience consistency.

7.Application state management and synchronization strategy with the API.

8.Handling of error states and exceptions returned by the API.

9.Caching and performance optimization strategies in communication with the API.

The output in chat should have the following structure:
<ui_architecture_planning_output>
<questions>
[List your questions here, numbered]
</questions>

<recommendations>
Use all recomendations from UI plan
</recommendations>
</ui_architecture_planning_output>

Remember that your goal is to provide a comprehensive list of questions and recommendations that will help create a solid UI architecture for the MVP, fully integrated with the available API endpoints. Focus on the clarity, relevance, and accuracy of your output. Do not include any additional comments or explanations outside of the specified output format.

Continue this process, generating new questions and recommendations based on the provided context and user's responses until the user explicitly asks for a summary.

Remember to focus on the clarity, relevance, and accuracy of the results. Do not include any additional comments or explanations outside of the specified output format.