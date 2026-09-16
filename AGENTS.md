## Git Workflow Rules

### 1. Complete the Work First
- Finish the assigned task completely before creating a commit.
- Make sure all requested functionality, UI changes, fixes, and related files are properly implemented.
- Do not leave incomplete or temporary code unless explicitly required.

### 2. Review Before Commit
After completing the task, perform a full self-review:
- Review all changed files.
- Check for bugs, regressions, unused imports, unused variables, console logs, debug code, and unnecessary changes.
- Verify TypeScript/ESLint/build/test status where applicable.
- Check that the implementation follows the project's existing architecture, coding conventions, and documentation rules.
- Review the final diff using Git before committing.

### 3. Test Before Commit
- Run the relevant tests and validation commands.
- If the project has linting, type-checking, unit tests, or build commands, run the appropriate ones.
- Fix any issues found during validation before committing.
- Do not commit known broken code unless explicitly instructed.

### 4. Commit Automatically After Review
Once the work has been completed, reviewed, and validated:
- Create a Git commit automatically.
- Use a clear, concise, professional commit message following the project's existing commit convention.
- The commit should contain only changes related to the assigned task.
- Do not include unrelated modifications.

### 5. NEVER Push Automatically
**IMPORTANT: Do NOT run `git push` automatically.**

After creating the commit:
- Keep the commit locally.
- Do not push to `origin`, GitHub, GitLab, or any remote repository.
- Do not create or update a Pull Request.
- Do not merge any branch.
- Do not force-push.
- Wait for explicit user approval.

Only push when the user clearly instructs you to do so, such as:
- "Push it"
- "Push the commit"
- "Push to GitHub"
- "Create PR and push"

### 6. Final Response After Commit
After completing and committing the work, report:
- What was changed
- What was reviewed
- Tests/checks performed
- Commit hash
- Commit message
- Clearly state that the changes are **committed locally but NOT pushed**

Example:

"Task completed and reviewed successfully.
- Tests: passed
- Build: passed
- Commit: `abc1234`
- Message: `feat: update workforce page`
- Push: Not performed — waiting for your approval."

### 7. User Controls Remote Changes
The user must always have final control over remote repository changes.

**Default workflow:**
`Implement → Review → Test → Commit → STOP`

**Never:**
`Implement → Review → Test → Commit → Push`

Push is always a separate action requiring explicit user approval.