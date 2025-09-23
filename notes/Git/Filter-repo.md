**Removing a folder from repo history:** (used on single branch, single user).
```
git filter-repo --path target_folder --invert-paths
git remote add origin path_to_repo.git
git push --set-upstream origin main
git push --force
```