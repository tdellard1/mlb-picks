# TODO: 
- Add Enums for Pick Types and evaluate results based on those. Will probably need to pass in line score and/our boxScore to evaluate
- Add Category Type for Options
- Add ability to reverse stats average from last 15 to starting at a certain date and going forward, in order to evaluate their trend and how many times they either achieved that trend, or failed
- Every reload, add one day (or one more game) of box scores to the back end for a game that is not postponed or suspended
- Add more analytics for batting, and try to add some for pitching
1. Clean COde of analysis components to render charts better
2. Change AnalysisComponent from using AnalysisData object for team stats, to using Team Analytics for team stats
2. Remove Team Analysis stats from BaseModel and keep it league Only
3. Reformat Base Model and extending classes, and add remaining stats for teams, potentially using TeamAnalytics Data
