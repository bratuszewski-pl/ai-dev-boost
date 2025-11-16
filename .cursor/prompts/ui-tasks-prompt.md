---
mode: 'agent'
model: claude-sonnet-4
tools: ['editFiles']
description: 'Generate ui documentation and task list from api-plan.md, prd.md, and ui-plan.md'
---
You are tasked with creating a list of files based on the content of three input files: prd.md, api-plan.md, and ui-plan.md. Each file you create will contain one view from ui-plan.md, its related user stories from prd.md, and related API endpoints from api-plan.md. You will also create a Task file containing all views to be created.

Here is the content of the input files:

<prd_content>
{{PRD_CONTENT}}
</prd_content>

<api_plan_content>
{{API_PLAN_CONTENT}}
</api_plan_content>

<ui_plan_content>
{{UI_PLAN_CONTENT}}
</ui_plan_content>

Follow these steps to complete the task:

1. Analyze the UI plan:
   - Identify each unique view mentioned in the ui-plan.md content.
   - Make a list of these views.

2. For each view:
   - Find related user stories from the PRD content that correspond to the functionality of this view.
   - Identify API endpoints from the API plan that are relevant to this view's functionality.

3. Create individual files:
   - For each view, create a file named "[ViewName].md" (replace [ViewName] with the actual name of the view).
   - In each file, include:
     a. The name of the view
     b. A brief description of the view's purpose
     c. Related user stories from the PRD
     d. Relevant API endpoints from the API plan

4. Create a Task file:
   - Name this file "ai\Ui-TaskList.md"
   - List all the views that need to be created
   - For each view, provide a brief description and list the main functionalities

5. Prepare the final output:
   - List all the files you've created (including the ai\Ui-TaskList.md)
   - For each file, provide a brief summary of its contents

Your final output should be structured as follows:

<output>
Files created:
1. [FileName1].md
   Summary: [Brief description of the file's contents]
2. [FileName2].md
   Summary: [Brief description of the file's contents]
...
N. TaskList.md
   Summary: List of all views to be created with their main functionalities
</output>

Ensure that your output only includes the list of files created and their summaries as specified above. Do not include the actual content of the files or any intermediate steps in your final output. Put all files to separate folder ai/ui