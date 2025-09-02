当前项目的 RLS 策略总结：

1. users 表的 RLS 策略：


Users can view own profile: 用户只能查看自己的完整资料

Users can update own profile: 用户只能更新自己的资料

Users can view others basic info: 所有认证用户可以查看其他用户的基本信息


2. community_suggestions 表的 RLS 策略：


所有用户可以查看建议: 所有认证用户可以查看所有建议

认证用户可以创建建议: 认证用户可以创建建议（author_id 必须是自己）

作者可以更新自己的建议: 只有作者可以更新自己的建议


3. community_suggestion_votes 表的 RLS 策略：


所有用户可以查看投票: 所有认证用户可以查看投票记录

认证用户可以投票: 认证用户可以投票（voter_id 必须是自己）

用户可以更新/删除自己的投票: 用户可以管理自己的投票




