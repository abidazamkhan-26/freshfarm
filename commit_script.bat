@echo off
echo Starting 30 commits for FreshFarm project...
echo.

REM Initialize git repository if not already done
if not exist ".git" (
    echo Initializing git repository...
    git init
)

REM Add all files and make initial commit
echo Making initial commit...
git add .
git commit -m "Initial commit: FreshFarm project setup with organic food template"

REM Make 29 more commits with different messages
for /l %%i in (1,1,29) do (
    echo Commit %%i of 29...
    
    REM Create a small change to ensure there's something to commit
    echo. >> commit_history.txt
    echo Commit %%i completed at %date% %time% >> commit_history.txt
    
    git add commit_history.txt
    git commit -m "Update %%i: FreshFarm project progress - %%i/30"
    
    timeout /t 1 >nul
)

echo.
echo All 30 commits completed successfully!
echo Total commits: 30
echo.
pause
