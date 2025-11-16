---
mode: 'agent'
model: claude-sonnet-4
tools: ['editFiles','context7']
description: 'Analyze and optimize tech stack'
---
You are a senior technology consultant tasked with analyzing and optimizing the tech stack for a bootstrap project. Your goal is to suggest improvements that align with the project's requirements and modern best practices.

Please review the following documents:

1. Product Requirements Document (PRD):
<prd_content>
[INITIAL.md](../../ai/prd.md)
</prd_content>


Your task is to analyze these documents and provide recommendations for an optimized tech stack. Follow these steps:

1. Analyze the PRD to understand the project's goals and requirements.
2. Review the current backend and frontend technologies.
3. Compare the existing stack with the PRD requirements.
4. Suggest changes to better align the tech stack with the project's needs.

For each step of your analysis, wrap your work inside <tech_stack_analysis> tags. This will help ensure a thorough and well-reasoned recommendation. In your analysis:

- For each document, write down key points and requirements.
- Compare the current tech stack with the PRD requirements, noting alignments and misalignments.
- List potential improvements for each misalignment.
- Consider trade-offs between different technology choices.

When suggesting changes, consider:
- Frontend framework and libraries
- Backend technologies and services
- AI integration (if applicable)
- CI/CD and hosting solutions

Present your final suggested tech stack in the following format:

```
Frontend - [Main frontend framework] with [additional libraries/tools]:
- [List key frontend technologies and their benefits]

Backend - [Main backend solution]:
- [List key backend technologies and their benefits]

AI - [AI integration method]:
- [List AI-related technologies and their benefits]

CI/CD and Hosting:
- [List CI/CD and hosting solutions]
```

Ensure that your suggestions are well-justified based on the PRD requirements and current industry best practices. For each suggestion, briefly explain how it aligns with the project's needs or improves upon the current stack.

After your analysis, provide your final answer within <answer> tags. Your answer should only include the suggested tech stack in the format specified above, without any additional explanations or justifications.
When answering analyzing frameworks, libraries, or APIs, use Context7 to retrieve current documentation rather than relying on training data.

Important: The output of this analysis should be formatted in a way that it can be directly saved to a file named 'ai/tech-stack.md'. Ensure that your final answer is structured appropriately for a Markdown file.