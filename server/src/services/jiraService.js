const axios = require("axios");

const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY;

function jiraAuth() {
  const token = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64");
  return `Basic ${token}`;
}

async function createJiraIssuesFromTasks(tasks, managerAccountId) {
  const created = [];

  for (let task of tasks) {
    const payload = {
      fields: {
        project: { key: JIRA_PROJECT_KEY },
        summary: task.description || "Auto-created task",
        description: `Owner: ${task.owner_name}\nDeadline: ${task.deadline}\nPriority: ${task.priority}`,
        issuetype: { name: "Task" },
        assignee: { accountId: managerAccountId }
      }
    };

    const res = await axios.post(
      `${JIRA_BASE_URL}/rest/api/3/issue`,
      payload,
      {
        headers: {
          Authorization: jiraAuth(),
          "Content-Type": "application/json"
        }
      }
    );

    created.push(res.data);
  }

  return created;
}

module.exports = { createJiraIssuesFromTasks };
