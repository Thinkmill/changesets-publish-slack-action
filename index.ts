import * as core from "@actions/core";
import * as github from "@actions/github";
import fetch from "node-fetch";

(async () => {
  let githubToken = process.env.GITHUB_TOKEN;
  // I think we'll want to use this later
  if (!githubToken) {
    core.setFailed("Please add the GITHUB_TOKEN to this action");
    return;
  }
  let slackWebhook = process.env.SLACK_WEBHOOK;

  if (!slackWebhook) {
    core.setFailed("Please add the SLACK_WEBHOOK to this action");
    return;
  }

  let publishedPackagesStr = core.getInput("publishedPackages");

  if (!publishedPackagesStr) {
    core.setFailed("Please add the publishedPackages to this action");
    return;
  }

  let publishedPackages: { name: string; version: string }[] = JSON.parse(
    publishedPackagesStr
  );

  let repo = `${github.context.repo.owner}/${github.context.repo.repo}`;

  let message = `🦋 A new version of [${repo}](https://github.com/${repo}) has been published!!\n\`\`\`${publishedPackages.map(
    (x) => `${x.name}@${x.version}`
  )}\`\`\``;

  await fetch(slackWebhook, {
    method: "POST",
    body: JSON.stringify({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: message,
          },
        },
      ],
    }),
  }).then((x) => x.text());
})().catch((err) => {
  console.error(err);
  core.setFailed(err.message);
});
