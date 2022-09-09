# Example Usage

Create a .yml file on `.github/workflows/` directory with

```
  name: Erin JIRA Release Message GitHub Actions Demo
  on:
    push:
      branches:
        - "master"
  jobs:
    Explore-GitHub-Actions:
      runs-on: ubuntu-latest
      steps:
        - name: Get JIRA Release Message
          id: erin-jira-release-message-github-actions-instance
          uses: erinapp/erin-jira-release-message-github-actions@1.0
          with:
            jira_base_url: ${{ secrets.JIRA_BASE_URL }}
            jira_username: ${{ secrets.JIRA_USERNAME }}
            jira_token: ${{ secrets.JIRA_TOKEN }}
            jira_project_name: ${{ secrets.JIRA_PROJECT_NAME }}
            jira_target_status: ${{ secrets.JIRA_TARGET_STATUS }}
            jira_target_label_field: ${{ secrets.JIRA_TARGET_LABEL_FIELD }}
            jira_target_label: ${{ secrets.JIRA_TARGET_LABEL }}
        - name: Transitioning JIRA Cards
          uses: wei/curl@master
          with:
            args: ${{ secrets.JIRA_WEBHOOK_URL_ARGS }}
        - name: Sending Slack Message
          uses: slackapi/slack-github-action@v1.21.0
          with:
            channel-id: ${{ secrets.SLACK_TARGET_CHANNEL_ID }}
            slack-message: ${{ steps.erin-jira-release-message-github-actions-instance.outputs.newReleaseMessage }}
          env:
            SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}
```

## Manage secrets

Then on your GitHub repository page, go to Settings tab then put your preference secrets there

<p align="center">
<img width="600" alt="Secrets Screenshot" src="https://user-images.githubusercontent.com/39117076/189289451-25488274-5fb8-4bf0-ab8b-eaed08f64d12.png">
</p>
