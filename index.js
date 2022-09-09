import core from "@actions/core";
import github from "@actions/github";

import fetch, { Headers } from "node-fetch";
import base64 from "base-64";

class ErinJiraReleaseMessage {
  constructor(credentials) {
    const { baseURL, username, token, projectName } = credentials;
    this.baseURL = baseURL;

    const headers = new Headers();

    headers.append(
      "Authorization",
      "Basic " + base64.encode(username + ":" + token)
    );

    this.headers = headers;
    this.projectName = projectName;
  }

  getReleaseMessage = async (preferences) => {
    const headers = this.headers;

    async function get(endpoint) {
      return await fetch(endpoint, {
        method: "GET",
        headers,
      }).then((res) => res.json());
    }

    const { targetStatus, targetLabelField, targetLabel } = preferences;

    const findProjectJson = await get(
      `${this.baseURL}/rest/api/2/project/search`
    );

    const projectId = findProjectJson.values.find(
      ({ name }) => name === this.projectName
    ).id;

    if (projectId) {
      const findIssuesJson = await get(
        `${this.baseURL}/rest/api/2/search?jql=project=${projectId}`
      );

      let newReleaseMessage = "";

      newReleaseMessage += `${this.projectName}'s New Release`;

      newReleaseMessage += `\n\nDate Time: ${new Date().toLocaleString()}\n`;

      findIssuesJson.issues.forEach((item) => {
        if (
          item.fields.status.statusCategory.name.toLowerCase() ===
            targetStatus.toLowerCase() &&
          item.fields[targetLabelField].includes(targetLabel)
        ) {
          newReleaseMessage += `\n- ${item.fields.summary}`;
        }
      });

      return newReleaseMessage;
    }
  };
}

try {
  const jiraBaseURL = core.getInput("jira_base_url");
  const jiraUsername = core.getInput("jira_username");
  const jiraToken = core.getInput("jira_token");
  const jiraProjectName = core.getInput("jira_project_name");

  const jiraTargetStatus = core.getInput("jira_target_status");
  const jiraTargetLabelField = core.getInput("jira_target_label_field");
  const jiraTargetLabel = core.getInput("jira_target_label");

  const erinJiraReleaseMessage = new ErinJiraReleaseMessage({
    baseURL: jiraBaseURL,
    username: jiraUsername,
    token: jiraToken,
    projectName: jiraProjectName,
  });

  const newReleaseMessage = await erinJiraReleaseMessage.getReleaseMessage({
    targetStatus: jiraTargetStatus,
    targetLabelField: jiraTargetLabelField,
    targetLabel: jiraTargetLabel,
  });

  core.setOutput("newReleaseMessage", newReleaseMessage);
} catch (error) {
  core.setFailed(error.message);
}
