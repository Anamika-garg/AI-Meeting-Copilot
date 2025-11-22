const axios = require("axios");

const jiraClient = axios.create({
  baseURL: process.env.JIRA_BASE_URL,
  auth: {
    username: process.env.JIRA_EMAIL,
    password: process.env.JIRA_API_TOKEN
  },
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  }
});

async function createJiraIssue({ summary, description, priority }) {
  const payload = {
    fields: {
      project: {
        key: process.env.JIRA_PROJECT_KEY
      },
      summary,
      description,
      issuetype: {
        name: "Task"
      },
      priority: {
        name: priority || "Medium"
      }
    }
  };

  const res = await jiraClient.post("/rest/api/3/issue", payload);
  console.log("🐞 Jira issue created:", res.data.key);
  return res.data.key;
}

async function assignJiraIssue(issueKey, accountId) {
  // If you only have email, you'll first need to map email -> accountId separately.
  const payload = {
    accountId
  };

  await jiraClient.put(`/rest/api/3/issue/${issueKey}/assignee`, payload);
  console.log(`👤 Jira issue ${issueKey} assigned to ${accountId}`);
}

module.exports = { createJiraIssue, assignJiraIssue };
