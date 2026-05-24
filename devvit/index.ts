import { Devvit } from "@devvit/public-api";

import { pulseAppSettings, pulseInstallationSettings } from "@/devvit/config/settings";
import { registerCommunityTriggers } from "@/devvit/triggers/community-triggers";

Devvit.configure({
  redditAPI: true,
  redis: true,
  realtime: true,
  http: true
});

Devvit.addSettings([...pulseAppSettings, ...pulseInstallationSettings]);

Devvit.addMenuItem({
  label: "Open Pulse Command Center",
  description: "Launch the subreddit digital twin and moderation forecast dashboard.",
  forUserType: "moderator",
  location: ["subreddit"],
  onPress: async (event: any, context: any) => {
    let subreddit = "r/politics";
    try {
      const currentSub = await context.reddit.getCurrentSubreddit();
      subreddit = currentSub.name;
    } catch {
      // fallback
    }
    context.ui.showWebView({
      url: `index.html?subreddit=${subreddit}&mode=live`,
      title: `Pulse: ${subreddit}`
    });
    context.ui.showToast({
      text: `Opening Pulse Command Center for ${subreddit}...`
    });
  }
});

registerCommunityTriggers();

export default Devvit;
