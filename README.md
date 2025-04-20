# SteamWebTools - various steam tools, that are not present in steam client, for average users
Deployed version: [Here](https://shporgalka-nope.github.io/SteamWebTools/)

Current functionality:
- Collection weight viewer - Currently steam has no way to see how much does a certain collection of addons weight, this tool is designed to calculate the approximate weight of given collection in MBs. First you need to gain a temp access to cordsanywhere service, it is vital for the tool because without some headers steam API wont process the request, and cordsanywhere provides these headers.