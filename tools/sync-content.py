from pathlib import Path
import shutil,json
root=Path(__file__).resolve().parents[1]
source=root.parent/'PhilMission/app/src/main/assets/content.json'
content=json.loads(source.read_text(encoding='utf-8-sig'))
assert len(content['phrases'])==50 and len(content['worship'])==4
shutil.copyfile(source,root/'public/content.json')
print('Synced current Android content:',len(content['phrases']),'phrases')
