# Merge Fix

# 1. Set merge strategy to allow unrelated histories
git config pull.rebase false

# 2. Pull remote changes with unrelated histories
git pull origin main --allow-unrelated-histories

# 3. Add all files again
git add .

# 4. Create merge commit
git commit -m "Merge remote and local files"

# 5. Push to GitHub
git push -u origin main