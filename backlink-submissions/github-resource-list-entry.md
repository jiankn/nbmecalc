# GitHub 教育资源清单提交片段

状态：Prepared，等待选择一个真实匹配的公开资源清单仓库并由账号持有人创建 PR。

不要把这段内容批量复制到多个仓库。先检查目标仓库的贡献指南、许可证、重复条目和维护者要求。

建议条目：

```markdown
- [NBME score conversion](https://nbmecalc.com/nbme-score-conversion) — NBMEcalc is an independent browser-based study-planning tool for interpreting NBME, UWSA, Free 120, AMBOSS, and CMS practice-assessment results. Its public methodology explains the internal assumptions and limitations; it is not an official NBME or USMLE conversion.
```

如果目标仓库专门收录研究或验证资料，可使用机器可读状态资产：

```markdown
- [NBMEcalc validation status](https://nbmecalc.com/validation) ([machine-readable status](https://nbmecalc.com/validation-status.json)) — Public evidence status and limitations for an independent USMLE study-planning model.
```

## PR 说明

```text
This entry adds a free, browser-based educational resource relevant to NBME and USMLE study planning. The linked page explains the supported assessment families and limitations, and does not claim NBME/USMLE endorsement or an official score conversion. The entry is submitted once for this repository and is not being syndicated as a bulk backlink campaign.
```

## Verification after merge

Record the merged PR URL and the final rendered file URL. Confirm the target page returns HTTP 2xx, has no `noindex`, and contains the exact link. A GitHub source repository or an unmerged PR is not a completed backlink.
