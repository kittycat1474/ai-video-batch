# AI Video Batch

面向 AI 角色与 influencer 账号的 Codex 视频批量制作技能。支持不同账号与可变任务数量，先由人确认创意，再生成视频。

## 工作流程

1. 首次账号问答：画面风格、剧情类型、目标受众、角色关系、内容边界。
2. 提供简短剧情摘要，等待用户确认。
3. 使用用户的 shotlist 技能，将获批剧情转换为分镜。
4. 使用指定的参考资产、模型和参数，连续提交独立视频任务。
5. 命名并排开输出，供用户在平台人工审核。

默认不下载成片、不抽帧、不检查成片规格、不自动重试、不发布内容。多账号各用独立画布；同一画布只有一个执行者。平台生成任务可并行，不要求一个任务完成后再提交下一条。

## 安装与依赖

将本仓库克隆到 Codex 的技能目录：

```powershell
git clone https://github.com/kittycat1474/ai-video-batch.git "$env:USERPROFILE\.codex\skills\ai-video-batch"
```

分镜步骤必须配合 [ai-cinematic-shotlist-director](https://github.com/kittycat1474/ai-cinematic-shotlist-director) 或用户明确指定的替代分镜技能。使用 Orca 内置浏览器时，还需要本机的 `orca-cli` 技能与可运行的 Orca。

## 使用

> 使用 $ai-video-batch，为这个账号做 12 条视频，先问账号定位，再给我剧情摘要，确认后生成。

已有账号档案直接复用，只补问发生变化的信息。任务数量、人物、声音、模型、画幅与时长均不写死。

## 文件

- `SKILL.md`：完整工作流和确认规则。
- `references/nadou.md`：Nadou 在 Orca 中已验证的操作路线。
- `references/task-plan.md`：账号任务计划与提交记录格式。
- `scripts/orca-bridge.cjs`：安全传递提示词、精简 CLI 输出、防止重复提交的辅助脚本；不是开箱即用的全自动浏览器驱动。
- `scripts/check.cjs`：纯本地验证，不连接浏览器、不消耗生成额度。

```powershell
node scripts/check.cjs
```
