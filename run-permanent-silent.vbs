Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
WshShell.Run "cmd /c npm run dev -- --host 0.0.0.0 --port 3000", 0, False
Set WshShell = Nothing
